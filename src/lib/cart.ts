import 'server-only';
import { cookies } from 'next/headers';
import { getCart, isShopifyConfigured } from '@/lib/shopify';

/** Carrito actual a partir de la cookie (undefined si no hay o Shopify falla). */
export async function getCurrentCart() {
  const cartId = cookies().get('cartId')?.value;
  if (!cartId || !isShopifyConfigured) return undefined;
  try {
    return await getCart(cartId);
  } catch (e) {
    console.error('[cart] getCurrentCart', e);
    return undefined;
  }
}
