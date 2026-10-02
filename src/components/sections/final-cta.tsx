import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/lib/site';

export function FinalCta({ image }: { image?: { url: string; altText: string | null } }) {
  return (
    <section className="section">
      <div className="container-site grid items-center gap-6 md:grid-cols-2">
        {image && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-square bg-cream">
            <Image src={image.url} alt={image.altText || ''} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
          </div>
        )}
        <div className="space-y-5">
          <h2 className="text-3xl sm:text-4xl">Este año, el regalo lo eliges tú.</h2>
          <p className="text-ink-soft">Pide antes del 12 de diciembre y llega a tiempo para Nochebuena. Envío gratis desde {site.freeShippingThreshold} €.</p>
          <Link href="#producto" className="btn-primary">Quiero mi Reno Aura</Link>
        </div>
      </div>
    </section>
  );
}
