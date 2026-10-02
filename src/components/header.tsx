import Link from 'next/link';
import { CartButton } from '@/components/cart/cart-button';
import { site } from '@/lib/site';

const nav = [
  { href: '/#producto', label: 'Reno Aura' },
  { href: '/#por-que', label: 'Por qué' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/collections/all', label: 'Tienda' }
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-snow/85 backdrop-blur-md">
      <div className="container-site flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-2xl tracking-tight" aria-label={`${site.name}, inicio`}>
          Reno<span className="text-berry">.</span>Aura
        </Link>
        <nav className="hidden gap-8 text-sm md:flex" aria-label="Principal">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-ink-soft transition hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>
        <CartButton />
      </div>
    </header>
  );
}
