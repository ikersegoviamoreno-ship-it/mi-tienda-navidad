import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { CookieBanner } from '@/components/analytics/cookie-banner';
import { Pixels } from '@/components/analytics/pixels';
import { AnnouncementBar } from '@/components/announcement-bar';
import { CartDrawer, type CartUpsell } from '@/components/cart/cart-drawer';
import { CartProvider } from '@/components/cart/cart-context';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { getCurrentCart } from '@/lib/cart';
import { getProduct } from '@/lib/shopify';
import { site } from '@/lib/site';
import { unitsInVariant } from '@/lib/utils';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const serif = Fraunces({ subsets: ['latin'], variable: '--font-serif', display: 'swap', axes: ['opsz'] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, locale: 'es_ES', type: 'website', images: ['/images/reno-aura.svg'] },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' }
};

export const viewport: Viewport = { themeColor: '#FFFFFF', viewportFit: 'cover' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [cart, hero] = await Promise.all([getCurrentCart(), getProduct(site.heroHandle)]);
  const upsell: CartUpsell | undefined =
    hero && !hero.isFallback
      ? {
          handle: hero.handle,
          title: hero.title,
          image: hero.featuredImage?.url,
          packs: hero.variants.map((v) => ({
            id: v.id,
            title: v.title,
            units: unitsInVariant(v.title),
            price: Number(v.price.amount),
            available: v.availableForSale
          }))
        }
      : undefined;

  return (
    <html lang="es" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <CartProvider cart={cart}>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:p-3">
            Saltar al contenido
          </a>
          <AnnouncementBar />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer upsell={upsell} />
          <CookieBanner />
          <Pixels />
        </CartProvider>
      </body>
    </html>
  );
}
