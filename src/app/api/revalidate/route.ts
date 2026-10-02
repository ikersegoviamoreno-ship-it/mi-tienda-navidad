import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { REVIEWS_TAG } from '@/lib/reviews';
import { TAGS } from '@/lib/shopify';

/**
 * Webhook de Shopify (products/*, metaobjects/*) →
 * POST https://tudominio.com/api/revalidate?secret=SHOPIFY_REVALIDATION_SECRET
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (!process.env.SHOPIFY_REVALIDATION_SECRET || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidateTag(TAGS.products);
  revalidateTag(REVIEWS_TAG);
  return NextResponse.json({ ok: true, revalidated: [TAGS.products, REVIEWS_TAG], now: Date.now() });
}
