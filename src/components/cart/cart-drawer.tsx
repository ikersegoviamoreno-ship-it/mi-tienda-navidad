'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { FreeShippingBar } from '@/components/free-shipping-bar';
import { PaymentIcons } from '@/components/payment-icons';
import { formatMoney } from '@/lib/utils';
import { useCart } from './cart-context';

export function CartDrawer() {
  const { cart, isOpen, close, update, isPending, error } = useCart();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  const lines = cart?.lines ?? [];
  const subtotal = Number(cart?.cost.subtotalAmount.amount ?? 0);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={close} aria-hidden />
      <aside
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
        className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slide-in flex-col bg-snow shadow-2xl outline-none"
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-serif text-xl">Tu carrito {cart?.totalQuantity ? `(${cart.totalQuantity})` : ''}</h2>
          <button onClick={close} className="rounded-full p-2 hover:bg-mist" aria-label="Cerrar carrito">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </header>

        <div className="border-b border-line px-5 py-4">
          <FreeShippingBar subtotal={subtotal} />
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
            <p className="text-ink-soft">Tu carrito está vacío.</p>
            <Link href="/" onClick={close} className="btn-primary">Ver el Reno Aura</Link>
          </div>
        ) : (
          <ul className={`flex-1 divide-y divide-line overflow-y-auto px-5 ${isPending ? 'opacity-60' : ''}`}>
            {lines.map((line) => (
              <li key={line.id} className="flex gap-4 py-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-mist">
                  {line.merchandise.product.featuredImage && (
                    <Image src={line.merchandise.product.featuredImage.url} alt={line.merchandise.product.title} fill sizes="80px" className="object-cover" />
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium leading-tight">{line.merchandise.product.title}</p>
                      {line.merchandise.title !== 'Default Title' && (
                        <p className="mt-0.5 text-xs text-ink-soft">{line.merchandise.title}</p>
                      )}
                    </div>
                    <p className="text-sm font-medium">{formatMoney(line.cost.totalAmount)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-line">
                      <button className="px-3 py-1 text-lg leading-none" aria-label="Quitar uno" disabled={isPending}
                        onClick={() => update(line.id, line.merchandise.id, line.quantity - 1)}>−</button>
                      <span className="w-6 text-center text-sm tabular-nums">{line.quantity}</span>
                      <button className="px-3 py-1 text-lg leading-none" aria-label="Añadir uno" disabled={isPending}
                        onClick={() => update(line.id, line.merchandise.id, line.quantity + 1)}>+</button>
                    </div>
                    <button className="text-xs text-ink-soft underline-offset-2 hover:underline" disabled={isPending}
                      onClick={() => update(line.id, line.merchandise.id, 0)}>Eliminar</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {lines.length > 0 && cart && (
          <footer className="space-y-3 border-t border-line px-5 py-5">
            {error && <p className="text-sm text-berry">{error}</p>}
            <div className="flex justify-between text-base">
              <span>Subtotal</span>
              <strong>{formatMoney(cart.cost.subtotalAmount)}</strong>
            </div>
            <p className="text-xs text-ink-soft">Impuestos incluidos. Envío calculado en el checkout.</p>
            <a href={cart.checkoutUrl} className="btn-primary w-full">
              Finalizar compra segura
            </a>
            <PaymentIcons />
          </footer>
        )}
      </aside>
    </div>
  );
}
