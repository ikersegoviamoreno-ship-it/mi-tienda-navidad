'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import type { Image as Img } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

export function Gallery({ images, title }: { images: Img[]; title: string }) {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  const go = (i: number) => {
    setActive(i);
    const el = track.current;
    if (el) el.scrollTo({ left: el.clientWidth * i, behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = track.current;
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  if (!images.length) return <div className="aspect-square rounded-2xl bg-mist" />;

  return (
    <div className="space-y-3">
      <div
        ref={track}
        onScroll={onScroll}
        className="flex aspect-square snap-x snap-mandatory overflow-x-auto rounded-2xl bg-mist [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((img, i) => (
          <div key={img.url} className="relative aspect-square w-full shrink-0 snap-center">
            <Image
              src={img.url}
              alt={img.altText || `${title} — imagen ${i + 1}`}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]" role="tablist" aria-label="Imágenes del producto">
          {images.map((img, i) => (
            <button
              key={img.url}
              role="tab"
              aria-selected={i === active}
              aria-label={`Ver imagen ${i + 1}`}
              onClick={() => go(i)}
              className={cn(
                'relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-20 sm:w-20',
                i === active ? 'border-ink' : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
