'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { TAGS, addToCart, createCart, getCart, removeFromCart, updateCart } from '@/lib/shopify';

const COOKIE = 'cartId';
type Result = { ok: true } | { ok: false; error: string };

function saveCartId(id: string) {
  cookies().set(COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14
  });
}

export async function addItem(merchandiseId: string, quantity = 1): Promise<Result> {
  if (!merchandiseId || merchandiseId.startsWith('fallback-')) {
    return { ok: false, error: 'Este producto todavía no está disponible para la venta.' };
  }
  try {
    const lines = [{ merchandiseId, quantity }];
    const cartId = cookies().get(COOKIE)?.value;
    const existing = cartId ? await getCart(cartId).catch(() => undefined) : undefined;
    if (existing) {
      await addToCart(existing.id, lines);
    } else {
      const cart = await createCart(lines);
      saveCartId(cart.id);
    }
    revalidateTag(TAGS.cart);
    return { ok: true };
  } catch (e) {
    console.error('[cart] addItem', e);
    return { ok: false, error: 'No hemos podido añadirlo. Inténtalo de nuevo.' };
  }
}

export async function updateItemQuantity(lineId: string, merchandiseId: string, quantity: number): Promise<Result> {
  const cartId = cookies().get(COOKIE)?.value;
  if (!cartId) return { ok: false, error: 'Carrito no encontrado' };
  try {
    if (quantity <= 0) await removeFromCart(cartId, [lineId]);
    else await updateCart(cartId, [{ id: lineId, merchandiseId, quantity }]);
    revalidateTag(TAGS.cart);
    return { ok: true };
  } catch (e) {
    console.error('[cart] updateItemQuantity', e);
    return { ok: false, error: 'No hemos podido actualizar el carrito.' };
  }
}
