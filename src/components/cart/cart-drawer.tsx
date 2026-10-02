'use client';

import Image from 'next/image';
import { useEffect, useRef, useTransition } from 'react';
import { Countdown } from '@/components/countdown';
import { FreeShippingBar } from '@/components/free-shipping-bar';
import { PaymentIcons } from '@/components/payment-icons';
import { site } from '@/lib/site';
import { formatMoney, money, unitsInVariant } from '@/lib/utils';
import { useCart } from './cart-context';

export type Pack = { id: string; title: string; units: number; price: number; available: boolean };
export type CartUpsell = { handle: string; title: string; image?: string; packs: Pack[] };

export function CartDrawer({ upsell }: { upsell?: CartUpsell }) {
  const { cart, isOpen, close, update, add, isPending, error } = useCart();
  const [adding, startAdding] = useTransition();
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
  const busy = isPending || adding;
  const packs = upsell?.packs.filter((p) => p.available).sort((a, b) => a.units - b.units) ?? [];
  const single = packs.find((p) => p.units === 1);

  // Mejora de pack: la primera línea del producto estrella con cantidad 1 que no sea ya el pack mayor
  const upgradeLine = lines.find((l) => l.merchandise.product.handle === upsell?.handle && l.quantity === 1);
  const currentUnits = upgradeLine ? unitsInVariant(upgradeLine.merchandise.title) : 0;
  const nextPack = upgradeLine ? packs.find((p) => p.units > currentUnits) : undefined;
  const upgradeExtra = nextPack && upgradeLine ? nextPack.price - Number(upgradeLine.cost.totalAmount.amount) : 0;
  const upgradeSaving = nextPack && single ? single.price * nextPack.units - nextPack.price : 0;
  const emptyOffer = packs.find((p) => p.units === 2) ?? single;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/50" onClick={close} aria-hidden />
      <aside
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
        className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slide-in flex-col bg-snow shadow-2xl outline-none"
      >
        <header className="flex items-center justify-between bg-ink px-5 py-3.5 text-snow">
          <h2 className="font-serif text-xl">
            Tu carrito {cart?.totalQuantity ? <span className="font-sans text-sm text-snow/70">({cart.totalQuantity})</span> : null}
          </h2>
          <button onClick={close} className="rounded-full p-1.5 transition hover:bg-snow/10" aria-label="Cerrar carrito">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </header>

        <div className="border-b border-line bg-cream px-5 py-3">
          <FreeShippingBar subtotal={subtotal} />
        </div>

        <div className={`flex-1 overflow-y-auto px-5 ${busy ? 'pointer-events-none opacity-60' : ''}`}>
          {lines.length === 0 ? (
            <div className="space-y-4 py-8 text-center">
              <p className="font-serif text-xl">Tu carrito está vacío</p>
              <p className="text-sm text-ink-soft">El regalo más comentado de esta Navidad te está esperando.</p>
              {upsell && emptyOffer && (
                <div className="flex items-center gap-3 rounded-2xl border border-line p-3 text-left">
                  {upsell.image && (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
                      <Image src={upsell.image} alt="" fill sizes="64px" className="object-cover" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{upsell.title}</p>
                    <p className="text-xs text-ink-soft">{emptyOffer.title} · {formatMoney(money(emptyOffer.price))}</p>
                  </div>
                  <button onClick={() => startAdding(async () => void (await add(emptyOffer.id, 1)))} className="btn-primary min-h-[38px] px-4 text-xs">
                    Añadir
                  </button>
                </div>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-3 py-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream">
                    {line.merchandise.product.featuredImage && (
                      <Image src={line.merchandise.product.featuredImage.url} alt={line.merchandise.product.title} fill sizes="80px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-medium leading-tight">{line.merchandise.product.title}</p>
                        {line.merchandise.title !== 'Default Title' && (
                          <span className="mt-1 inline-block rounded-full bg-cream px-2 py-0.5 text-[11px] font-medium">{line.merchandise.title}</span>
                        )}
                      </div>
                      <p className="text-sm font-semibold">{formatMoney(line.cost.totalAmount)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-line">
                        <button className="h-8 w-8 text-lg leading-none" aria-label="Quitar uno"
                          onClick={() => update(line.id, line.merchandise.id, line.quantity - 1)}>−</button>
                        <span className="w-6 text-center text-sm tabular-nums">{line.quantity}</span>
                        <button className="h-8 w-8 text-lg leading-none" aria-label="Añadir uno"
                          onClick={() => update(line.id, line.merchandise.id, line.quantity + 1)}>+</button>
                      </div>
                      <button className="text-xs text-ink-soft underline-offset-2 hover:text-red hover:underline"
                        onClick={() => update(line.id, line.merchandise.id, 0)}>Eliminar</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {upgradeLine && nextPack && upgradeExtra > 0 && (
            <div className="mb-4 flex items-center gap-3 rounded-2xl border-2 border-dashed border-red/40 bg-red-tint p-3">
              
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-semibold">Pásate a {nextPack.title.toLowerCase()} por solo +{formatMoney(money(upgradeExtra))}</p>
                {upgradeSaving > 0 && <p className="text-xs text-red-dark">Ahorras {formatMoney(money(upgradeSaving))}: {nextPack.units === 2 ? 'uno para ti y otro para regalar' : 'regalos para todo el grupo'}.</p>}
              </div>
              <button onClick={() => update(upgradeLine.id, nextPack.id, 1)} className="rounded-full bg-red px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-red-dark">
                Mejorar
              </button>
            </div>
          )}
        </div>

        {lines.length > 0 && cart && (
          <footer className="space-y-3 border-t border-line px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
            {error && <p className="text-sm text-red" role="alert">{error}</p>}
            <Countdown to={site.christmasCutoff} label="Llega antes de Navidad · pide en" />
            <div className="flex items-baseline justify-between">
              <span className="text-sm">Subtotal <span className="text-xs text-ink-soft">(IVA incl.)</span></span>
              <strong className="text-lg">{formatMoney(cart.cost.subtotalAmount)}</strong>
            </div>
            <a href={cart.checkoutUrl} className="btn-primary w-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
              Finalizar compra · {formatMoney(cart.cost.totalAmount)}
            </a>
            <ul className="flex justify-center gap-4 text-[11px] text-ink-soft">
              <li>Envío {site.shippingDays}</li>
              <li aria-hidden>·</li>
              <li>{site.returnDays} días de devolución</li>
            </ul>
            <PaymentIcons />
          </footer>
        )}
      </aside>
    </div>
  );
}
