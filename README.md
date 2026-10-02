# Reno Aura — Tienda headless (Next.js 14 + Shopify Storefront API)

Tienda de producto único para **Reno Aura**, el reno navideño con actitud. Minimalista, móvil primero y orientada a conversión.

## Puesta en marcha

```bash
cp .env.example .env.local   # rellena dominio y token PÚBLICO de Storefront
npm install
npm run dev                  # http://localhost:3000
```

> El Admin API token (`shpat_…`) **no** se usa en el frontend y nunca debe ir en variables `NEXT_PUBLIC_*` ni en el repo.

## Activar las ventas

Mientras Shopify no tenga un producto con el handle de `NEXT_PUBLIC_HERO_PRODUCT_HANDLE` (por defecto `reno-aura`), la web muestra el catálogo de respaldo (`src/lib/catalog.ts`) con el botón "Disponible muy pronto".

1. Crea el producto en Shopify con handle `reno-aura`, estado **Activo** y publicado en el canal **Headless / Storefront API**.
2. Variantes recomendadas (opción "Pack"): `1 unidad`, `Pack 2`, `Pack 3`. El selector de packs detecta el número de unidades del título, calcula el precio por unidad y el ahorro, y marca el Pack 2 como "Más elegido".
3. Sube 3+ imágenes: la 1ª es la principal, la 2ª ilustra "Por qué" y la 3ª el CTA final.
4. (Opcional) Webhook `products/update` → `POST /api/revalidate?secret=SHOPIFY_REVALIDATION_SECRET`.

## Arquitectura

```
src/
├─ app/                     # App Router
│  ├─ page.tsx              # Home = ficha del producto estrella (menos clics → más conversión)
│  ├─ products/[handle]     # Ficha de producto (ISR 60 s + revalidación por tag)
│  ├─ collections/all       # Catálogo
│  ├─ pages/[slug]          # Envíos, devoluciones, contacto, privacidad, términos (SSG)
│  ├─ api/revalidate        # Webhook de Shopify
│  └─ sitemap.ts, robots.ts
├─ components/
│  ├─ cart/                 # Server actions (cookie httpOnly cartId), contexto y drawer
│  ├─ product/              # Galería (swipe), BuyBox (packs, CTA, barra fija móvil)
│  └─ sections/             # Beneficios, comparativa, reseñas, garantía, FAQ, CTA final
└─ lib/
   ├─ shopify/              # Cliente GraphQL Storefront, fragments, queries, tipos
   ├─ site.ts               # ← Textos, umbral de envío gratis, fecha límite de Navidad, FAQ, reseñas
   ├─ catalog.ts            # Producto de respaldo
   └─ legal.ts              # Textos legales base (revisar con tus datos fiscales)
```

- **Checkout**: se delega en el checkout nativo de Shopify (`cart.checkoutUrl`): Shop Pay, Apple/Google Pay, PayPal.
- **SEO**: metadata por página, JSON-LD `Product` + `FAQPage`, sitemap y robots.
- **Rendimiento**: `next/image` (AVIF/WebP), `next/font`, JS mínimo en cliente (solo galería, buy box y carrito).

## Paleta y decisiones de CRO

| Token | Color | Uso |
|---|---|---|
| `snow` / `mist` | `#FAF7F2` / `#F1ECE3` | Fondo marfil cálido: calma, premium, el producto destaca |
| `ink` | `#1C1A17` | Texto (contraste AA+) |
| `pine` | `#1F3D2B` | Verde abeto: confianza, marca, información (envíos, garantía) |
| `berry` | `#B3261E` | Rojo baya: **solo** CTAs y ahorro → el ojo va directo a la acción |
| `gold` | `#C8A24A` | Detalles premium (estrellas, acentos) |

- Pack 2 preseleccionado y marcado "Más elegido" + envío gratis desde 39 € (el Pack 2 cuesta 39,95 €) → sube el ticket medio.
- Barra de envío gratis en el carrito, CTA fijo en móvil, cuenta atrás **real** hasta la fecha límite de entrega navideña.
- Reseñas: la sección solo aparece cuando añades reseñas reales en `src/lib/site.ts` (o integras Judge.me). No se inventan reseñas ni stock.
- Precios tachados: usa `compareAtPrice` en Shopify solo si es el precio más bajo de los últimos 30 días (Directiva Ómnibus). Sin él, el ahorro mostrado es el real del pack frente a comprar unidades sueltas.

## Despliegue

Vercel: importa el repo, añade las variables de `.env.example` y despliega.
