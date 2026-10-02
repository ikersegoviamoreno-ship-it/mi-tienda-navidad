import Link from 'next/link';
import { CookieSettingsButton } from '@/components/analytics/cookie-banner';
import { PaymentIcons } from '@/components/payment-icons';
import { owner } from '@/lib/legal';
import { site } from '@/lib/site';

const links = [
  { href: '/pages/envios', label: 'Envíos' },
  { href: '/pages/devoluciones', label: 'Devoluciones' },
  { href: '/pages/contacto', label: 'Contacto' },
  { href: '/pages/privacidad', label: 'Privacidad' },
  { href: '/pages/cookies', label: 'Cookies' },
  { href: '/pages/terminos', label: 'Condiciones de venta' },
  { href: '/pages/aviso-legal', label: 'Aviso legal' }
];

export function Footer() {
  return (
    <footer className="mt-8 border-t border-line bg-cream">
      <div className="container-site grid gap-10 py-14 md:grid-cols-3">
        <div className="space-y-3">
          <p className="font-serif text-2xl">Reno<span className="text-red">.</span>Aura</p>
          <p className="max-w-xs text-sm text-ink-soft">{site.tagline}</p>
        </div>
        <nav aria-label="Ayuda" className="grid grid-cols-2 gap-2 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-ink-soft hover:text-ink">{l.label}</Link>
          ))}
          <CookieSettingsButton />
        </nav>
        <div className="space-y-3 text-sm text-ink-soft">
          <p>¿Dudas? Escríbenos a <a className="text-ink underline" href={`mailto:${site.email}`}>{site.email}</a></p>
          <PaymentIcons className="justify-start" />
        </div>
      </div>
      <p className="border-t border-line py-5 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} {site.name} · {owner.name} · NIF {owner.nif}
      </p>
    </footer>
  );
}
