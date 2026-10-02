import Image from 'next/image';
import { benefits } from '@/lib/site';

export function Benefits({ image }: { image?: { url: string; altText: string | null } }) {
  return (
    <section id="por-que" className="section bg-cream">
      <div className="container-site grid items-center gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="eyebrow">Por qué Reno Aura</p>
            <h2 className="text-2xl sm:text-3xl">Menos espumillón.<br />Más personalidad.</h2>
          </div>
          <ul className="space-y-4">
            {benefits.map((b, i) => (
              <li key={b.title} className="flex gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink font-serif text-snow">{i + 1}</span>
                <div>
                  <h3 className="font-sans text-base font-semibold">{b.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{b.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {image && (
          <div className="relative hidden aspect-square overflow-hidden rounded-2xl lg:block">
            <Image src={image.url} alt={image.altText || ''} fill sizes="(min-width:1024px) 560px, 100vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
