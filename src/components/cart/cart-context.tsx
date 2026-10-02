'use client';

import { createContext, useCallback, useContext, useState, useTransition } from 'react';
import type { Cart } from '@/lib/shopify/types';
import { addItem, updateItemQuantity } from './actions';

type CartContextValue = {
  cart: Cart | undefined;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isPending: boolean;
  error: string | null;
  add: (variantId: string, quantity?: number) => Promise<boolean>;
  update: (lineId: string, variantId: string, quantity: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ cart, children }: { cart: Cart | undefined; children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const add = useCallback(async (variantId: string, quantity = 1) => {
    setError(null);
    const res = await addItem(variantId, quantity);
    if (!res.ok) {
      setError(res.error);
      return false;
    }
    setOpen(true);
    return true;
  }, []);

  const update = useCallback((lineId: string, variantId: string, quantity: number) => {
    setError(null);
    startTransition(async () => {
      const res = await updateItemQuantity(lineId, variantId, quantity);
      if (!res.ok) setError(res.error);
    });
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, isOpen, open: () => setOpen(true), close: () => setOpen(false), isPending, error, add, update }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
