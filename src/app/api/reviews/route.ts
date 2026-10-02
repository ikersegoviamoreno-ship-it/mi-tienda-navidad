import { NextResponse, type NextRequest } from 'next/server';
import { REVIEW_TYPE } from '@/lib/reviews';

/**
 * Recibe una reseña del formulario y la crea en Shopify como metaobjeto en BORRADOR.
 * Se publica cuando la apruebas en Shopify (Contenido → Metaobjetos → Reseña de cliente → Activo).
 * Usa un token Admin SOLO en servidor, con el permiso mínimo `write_metaobjects`.
 */
const domain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/$/, '');
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const version = process.env.SHOPIFY_API_VERSION || '2024-10';

const mutation = /* GraphQL */ `
  mutation createReview($metaobject: MetaobjectCreateInput!) {
    metaobjectCreate(metaobject: $metaobject) {
      metaobject { id }
      userErrors { field message }
    }
  }
`;

// Límite básico anti-spam por IP (en memoria; suficiente para una tienda pequeña).
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 3;
}

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '');

export async function POST(req: NextRequest) {
  if (!domain || !adminToken) {
    return NextResponse.json({ ok: false, error: 'Las reseñas no están configuradas todavía.' }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  // Honeypot: los bots rellenan el campo oculto "website"
  if (body.website) return NextResponse.json({ ok: true });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'Has enviado varias reseñas seguidas. Inténtalo más tarde.' }, { status: 429 });
  }

  const handle = clean(body.handle, 120);
  const author = clean(body.author, 60);
  const city = clean(body.city, 60);
  const text = clean(body.body, 1000);
  const rating = Number(body.rating);

  if (!handle || author.length < 2 || text.length < 10 || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ ok: false, error: 'Revisa los campos: nombre, puntuación y una reseña de al menos 10 caracteres.' }, { status: 400 });
  }

  const fields = [
    { key: 'product_handle', value: handle },
    { key: 'author', value: author },
    { key: 'rating', value: String(rating) },
    { key: 'body', value: text },
    { key: 'verified', value: 'false' },
    ...(city ? [{ key: 'city', value: city }] : [])
  ];

  try {
    const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': adminToken },
      body: JSON.stringify({
        query: mutation,
        variables: { metaobject: { type: REVIEW_TYPE, fields, capabilities: { publishable: { status: 'DRAFT' } } } }
      }),
      cache: 'no-store'
    });
    const json = await res.json();
    const errors = json.errors ?? json.data?.metaobjectCreate?.userErrors;
    if (!res.ok || (Array.isArray(errors) && errors.length)) throw new Error(JSON.stringify(errors ?? res.status));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[reviews] create', e);
    return NextResponse.json({ ok: false, error: 'No hemos podido enviar tu reseña. Inténtalo de nuevo.' }, { status: 500 });
  }
}
