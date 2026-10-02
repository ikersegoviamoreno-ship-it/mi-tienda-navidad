'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useCart } from '@/components/cart/cart-context';
import { Countdown } from '@/components/countdown';
import { LockIcon, ReturnIcon, TruckIcon } from '@/components/icons';
import { PaymentIcons } from '@/components/payment-icons';
import { Stars } from '@/components/stars';
import { track } from '@/lib/analytics';
import type { Product, ProductVariant } from '@/lib/shopify/types';
import { site } from '@/lib/site';
import { cn, formatMoney, money, unitsInVariant } from '@/lib/utils';

type Offer = { variant: ProductVariant; units: number; price: number; reference: number; savings: number };

function buildOffers(variants: ProductVariant[]): Offer[] {
  const unit = Math.min(...variants.filter((v) => unitsInVariant(v.title) === 1).map((v) => Number(v.price.amount)));
  return variants.map((variant) => {
    const units = unitsInVariant(variant.title);
    const price = Number(variant.price.amount);
    const compare = variant.compareAtPrice ? Number(variant.compareAtPrice.amount) : 0;
    const reference = compare > price ? compare : Number.isFinite(unit) ? unit * units : price;
    return { variant, units, price, reference, savings: Math.max(0, reference - price) };
  });
}

export function BuyBox({ product, rating }: { product: Product; rating?: { value: number; count: number } }) {
  const { add, error } = useCart();
  const offers = useMemo(() => buildOffers(product.variants), [product.variants]);
  const isBundle = offers.length > 1 && offers.some((o) => o.units > 1);
  const popularIdx = isBundle ? offers.findIndex((o) => o.units === 2) : -1;
  const firstAvailable = offers.findIndex((o) => o.variant.availableForSale);
  const [selected, setSelected] = useState(popularIdx >= 0 && offers[popularIdx].variant.availableForSale ? popularIdx : Math.max(0, firstAvailable));
  const [isPending, startTransition] = useTransition();
  const [showSticky, setShowSticky] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const offer = offers[selected];
  const purchasable = !product.isFallback && offer?.variant.availableForSale;

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (product.isFallback) return;
    const p = product.priceRange.minVariantPrice;
    track('view', { id: product.id, value: Number(p.amount), currency: p.currencyCode });
  }, [product]);

  const onAdd = () =>
    startTransition(async () => {
      const ok = await add(offer.variant.id, 1);
      if (ok) track('add', { id: product.id, value: offer.price, currency: offer.variant.price.currencyCode });
    });

  const ctaLabel = product.isFallback
    ? 'Disponible muy pronto'
    : !offer?.variant.availableForSale
      ? 'Agotado'
      : isPending
        ? 'Añadiendo…'
        : `Añadir al carrito · ${formatMoney(offer.variant.price)}`;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="eyebrow">Edición Navidad {new Date(site.christmasCutoff).getFullYear()}</p>
        <h1 className="text-2xl leading-tight sm:text-3xl">{product.title}</h1>
        <a href="#resenas" className="flex items-center gap-2 text-sm">
          {rating ? (
            <>
              <Stars value={rating.value} />
              <span className="text-ink-soft underline-offset-2 hover:underline">{rating.value.toFixed(1)} · {rating.count} {rating.count === 1 ? 'reseña' : 'reseñas'}</span>
            </>
          ) : (
            <span className="text-ink-soft underline underline-offset-2">Sé el primero en dejar una reseña</span>
          )}
        </a>
        {offer && (
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold">{formatMoney(offer.variant.price)}</span>
            {offer.savings > 0 && (
              <>
                <s className="text-ink-soft">{formatMoney(money(offer.reference))}</s>
                <span className="rounded-full bg-red-tint px-2.5 py-0.5 text-xs font-semibold text-red">
                  Ahorras {formatMoney(money(offer.savings))}
                </span>
              </>
            )}
          </div>
        )}
        <p className="text-xs text-ink-soft">IVA incluido · Envío gratis desde {site.freeShippingThreshold} €</p>
      </div>

      {offers.length > 1 && (
        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm font-semibold">{isBundle ? 'Elige tu pack' : product.options[0]?.name}</legend>
          {offers.map((o, i) => (
            <label
              key={o.variant.id}
              className={cn(
                'relative flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 bg-white px-4 py-3 transition',
                i === selected ? 'border-ink shadow-sm' : 'border-line hover:border-ink-soft',
                !o.variant.availableForSale && 'cursor-not-allowed opacity-50'
              )}
            >
              <input
                type="radio"
                name="variant"
                className="sr-only"
                checked={i === selected}
                disabled={!o.variant.availableForSale}
                onChange={() => setSelected(i)}
              />
              {i === popularIdx && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-snow">
                  Más elegido
                </span>
              )}
              <span className="flex items-center gap-3">
                <span className={cn('grid h-5 w-5 place-items-center rounded-full border-2', i === selected ? 'border-ink' : 'border-line')}>
                  {i === selected && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
                </span>
                <span>
                  <span className="block font-medium">{o.variant.title}</span>
                  {isBundle && o.units > 1 && (
                    <span className="block text-xs text-ink-soft">
                      {formatMoney(money(o.price / o.units))} / unidad · {o.units === 2 ? 'uno para ti, otro para regalar' : 'para todo el grupo'}
                    </span>
                  )}
                </span>
              </span>
              <span className="text-right">
                <span className="block font-semibold">{formatMoney(o.variant.price)}</span>
                {o.savings > 0 && <span className="block text-xs font-medium text-red">−{formatMoney(money(o.savings))}</span>}
              </span>
            </label>
          ))}
        </fieldset>
      )}

      <div className="space-y-2">
        <button ref={ctaRef} onClick={onAdd} disabled={!purchasable || isPending} className="btn-primary w-full">
          {ctaLabel}
        </button>
        {error && <p className="text-sm text-red" role="alert">{error}</p>}
        <Countdown to={site.christmasCutoff} label="Llega antes de Navidad · pide en" />
      </div>

      <ul className="grid grid-cols-3 gap-2 text-center text-[11px] leading-tight text-ink-soft">
        {[
          [<TruckIcon key="t" />, `Envío ${site.shippingDays}`],
          [<ReturnIcon key="r" />, `${site.returnDays} días de devolución`],
          [<LockIcon key="l" />, 'Pago 100% seguro']
        ].map(([icon, text]) => (
          <li key={String(text)} className="flex flex-col items-center gap-1.5 rounded-xl bg-cream px-2 py-2.5">
            <span className="text-ink">{icon}</span>
            {text}
          </li>
        ))}
      </ul>
      <PaymentIcons />

      {/* Barra fija en móvil cuando el CTA principal sale de pantalla */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-30 border-t border-line bg-snow/95 p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 lg:hidden',
          showSticky ? 'translate-y-0' : 'translate-y-full'
        )}
        aria-hidden={!showSticky}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{offer?.variant.title}</p>
            <p className="text-sm font-semibold">{offer && formatMoney(offer.variant.price)}</p>
          </div>
          <button onClick={onAdd} disabled={!purchasable || isPending} tabIndex={showSticky ? 0 : -1} className="btn-primary min-h-[46px] px-6 text-sm">
            {product.isFallback ? 'Muy pronto' : isPending ? 'Añadiendo…' : 'Añadir'}
          </button>
        </div>
      </div>
    </div>
  );
}
