'use client';

import Link from 'next/link';
import { resetConsent, setConsent, useConsent } from '@/lib/consent';
import { site } from '@/lib/site';

export function CookieBanner() {
  const consent = useConsent();
  // Sin píxeles configurados no hay cookies de terceros: no hace falta banner
  if (!site.metaPixelId && !site.tiktokPixelId) return null;
  if (consent !== null) return null;

  return (
    <div role="dialog" aria-label="Cookies" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-lg animate-fade-up rounded-2xl border border-line bg-snow p-4 shadow-2xl sm:bottom-5">
      <p className="text-sm leading-relaxed text-ink-soft">
        Usamos cookies propias y de terceros (Meta y TikTok) para medir y mejorar nuestros anuncios. Puedes aceptarlas o
        rechazarlas. <Link href="/pages/cookies" className="text-ink underline">Más información</Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button onClick={() => setConsent('denied')} className="btn-secondary min-h-[42px] flex-1 px-4">
          Rechazar
        </button>
        <button onClick={() => setConsent('granted')} className="btn-primary min-h-[42px] flex-1 px-4 text-sm">
          Aceptar
        </button>
      </div>
    </div>
  );
}

/** Enlace del pie para cambiar la elección (obligatorio poder retirar el consentimiento). */
export function CookieSettingsButton() {
  if (!site.metaPixelId && !site.tiktokPixelId) return null;
  return (
    <button onClick={resetConsent} className="text-left text-ink-soft hover:text-ink">
      Configurar cookies
    </button>
  );
}
