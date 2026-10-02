'use client';

/** Eventos de e-commerce para Meta Pixel y TikTok Pixel (solo si el visitante aceptó cookies). */
type Item = { id: string; value: number; currency: string; quantity?: number };

type Fbq = (...args: unknown[]) => void;
type Ttq = { track: (event: string, data?: Record<string, unknown>) => void; page: () => void };

declare global {
  interface Window {
    fbq?: Fbq;
    ttq?: Ttq;
  }
}

const EVENTS = {
  view: { meta: 'ViewContent', tiktok: 'ViewContent' },
  add: { meta: 'AddToCart', tiktok: 'AddToCart' },
  checkout: { meta: 'InitiateCheckout', tiktok: 'InitiateCheckout' }
} as const;

export function track(event: keyof typeof EVENTS, item: Item) {
  if (typeof window === 'undefined') return;
  const { meta, tiktok } = EVENTS[event];
  try {
    window.fbq?.('track', meta, {
      content_ids: [item.id],
      content_type: 'product',
      value: item.value,
      currency: item.currency,
      num_items: item.quantity ?? 1
    });
    window.ttq?.track(tiktok, {
      contents: [{ content_id: item.id, content_type: 'product', quantity: item.quantity ?? 1 }],
      value: item.value,
      currency: item.currency
    });
  } catch {
    /* un fallo de analítica nunca debe romper la compra */
  }
}
