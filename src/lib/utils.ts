import type { Money } from '@/lib/shopify/types';

export function formatMoney({ amount, currencyCode }: Money) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: currencyCode }).format(Number(amount));
}

export function money(amount: number, currencyCode = 'EUR'): Money {
  return { amount: amount.toFixed(2), currencyCode };
}

/** Nº de unidades de una variante "Pack 2", "2 unidades", "Pack de 3"... (1 si no se detecta) */
export function unitsInVariant(title: string) {
  const m = title.match(/(\d+)/);
  return m ? Math.max(1, Number(m[1])) : 1;
}

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
