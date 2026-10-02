'use client';

import { useEffect, useState } from 'react';

export type Consent = 'granted' | 'denied' | null;
const KEY = 'reno-cookie-consent';
const EVENT = 'reno-consent-change';

export function readConsent(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(v: Exclude<Consent, null>) {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* modo privado: el banner volverá a salir, sin más */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: v }));
}

/** Vuelve a mostrar el banner (enlace "Configurar cookies" del pie). */
export function resetConsent() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENT, { detail: null }));
}

/** undefined mientras no se ha leído (evita parpadeos en la hidratación). */
export function useConsent() {
  const [consent, set] = useState<Consent | undefined>(undefined);
  useEffect(() => {
    set(readConsent());
    const on = (e: Event) => set((e as CustomEvent<Consent>).detail);
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  return consent;
}
