import 'server-only';
import { FALLBACK_PRODUCTS } from '@/lib/catalog';
import { site } from '@/lib/site';
import {
  addToCartMutation,
  createCartMutation,
  getCartQuery,
  getProductQuery,
  getProductsQuery,
  removeFromCartMutation,
  updateCartMutation
} from './queries';
import type { Cart, Product, ShopifyCart, ShopifyProduct } from './types';

const domain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/$/, '');
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const version = process.env.SHOPIFY_API_VERSION || '2024-10';
const endpoint = domain ? `https://${domain}/api/${version}/graphql.json` : '';

export const TAGS = { products: 'products', cart: 'cart' } as const;

export const isShopifyConfigured = Boolean(domain && token);

type FetchOptions = {
  query: string;
  variables?: Record<string, unknown>;
  tags?: string[];
  cache?: RequestCache;
};

export async function shopifyFetch<T>({ query, variables, tags, cache = 'force-cache' }: FetchOptions): Promise<T> {
  if (!isShopifyConfigured) throw new Error('Shopify no está configurado (revisa .env.local)');

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token!
    },
    body: JSON.stringify({ query, variables }),
    // Productos: caché ISR con tags (revalidación por webhook). Carrito: sin caché.
    ...(cache === 'no-store' ? { cache } : { next: { tags, revalidate: 60 } })
  });

  const body = await res.json();
  if (!res.ok || body.errors) {
    throw new Error(`Shopify ${res.status}: ${JSON.stringify(body.errors ?? body)}`);
  }
  return body.data as T;
}

const flatten = <T>(c: { edges: { node: T }[] }) => c.edges.map((e) => e.node);

/** La web solo muestra productos de la marca (campo "Proveedor" en Shopify). */
const isBrandProduct = (p: { vendor: string }) => p.vendor.trim().toLowerCase() === site.name.toLowerCase();

function reshapeProduct(p: ShopifyProduct): Product {
  return { ...p, images: flatten(p.images), variants: flatten(p.variants) };
}

function reshapeCart(c: ShopifyCart): Cart {
  return { ...c, lines: flatten(c.lines) };
}

/* ---------------------------------- Productos ---------------------------------- */

/**
 * Devuelve el producto de Shopify. Si Shopify no responde o el producto aún no existe,
 * usa el catálogo local para que la web nunca se rompa (en ese modo no se puede comprar).
 */
export async function getProduct(handle: string): Promise<Product | undefined> {
  try {
    const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
      query: getProductQuery,
      variables: { handle },
      tags: [TAGS.products]
    });
    if (data.product) return isBrandProduct(data.product) ? reshapeProduct(data.product) : undefined;
  } catch (e) {
    console.error('[shopify] getProduct', handle, e);
  }
  return FALLBACK_PRODUCTS.find((p) => p.handle === handle);
}

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>({
      query: getProductsQuery,
      tags: [TAGS.products]
    });
    const products = flatten(data.products).filter(isBrandProduct).map(reshapeProduct);
    if (products.length) return products;
  } catch (e) {
    console.error('[shopify] getProducts', e);
  }
  return FALLBACK_PRODUCTS;
}

/* ----------------------------------- Carrito ----------------------------------- */

type CartPayload = { cart: ShopifyCart | null; userErrors: { message: string }[] };

function unwrap(payload: CartPayload): Cart {
  if (payload.userErrors?.length) throw new Error(payload.userErrors.map((e) => e.message).join(', '));
  if (!payload.cart) throw new Error('Carrito no disponible');
  return reshapeCart(payload.cart);
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query: getCartQuery,
    variables: { cartId },
    tags: [TAGS.cart],
    cache: 'no-store'
  });
  return data.cart ? reshapeCart(data.cart) : undefined;
}

export async function createCart(lines: { merchandiseId: string; quantity: number }[] = []) {
  const data = await shopifyFetch<{ cartCreate: CartPayload }>({
    query: createCartMutation,
    variables: { lines },
    cache: 'no-store'
  });
  return unwrap(data.cartCreate);
}

export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  const data = await shopifyFetch<{ cartLinesAdd: CartPayload }>({
    query: addToCartMutation,
    variables: { cartId, lines },
    cache: 'no-store'
  });
  return unwrap(data.cartLinesAdd);
}

export async function updateCart(cartId: string, lines: { id: string; merchandiseId: string; quantity: number }[]) {
  const data = await shopifyFetch<{ cartLinesUpdate: CartPayload }>({
    query: updateCartMutation,
    variables: { cartId, lines },
    cache: 'no-store'
  });
  return unwrap(data.cartLinesUpdate);
}

export async function removeFromCart(cartId: string, lineIds: string[]) {
  const data = await shopifyFetch<{ cartLinesRemove: CartPayload }>({
    query: removeFromCartMutation,
    variables: { cartId, lineIds },
    cache: 'no-store'
  });
  return unwrap(data.cartLinesRemove);
}
