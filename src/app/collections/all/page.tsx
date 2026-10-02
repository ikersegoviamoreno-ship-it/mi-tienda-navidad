import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import { formatMoney } from '@/lib/utils';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Tienda', alternates: { canonical: '/collections/all' } };

export default async function Catalog() {
  const products = await getProducts();
  return (
    <section className="container-site section">
      <div className="mb-10 space-y-3">
        <p className="eyebrow">Tienda</p>
        <h1 className="text-4xl">Todos los productos</h1>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <li key={p.id}>
            <Link href={`/products/${p.handle}`} className="group block space-y-3">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-mist">
                {p.featuredImage && (
                  <Image src={p.featuredImage.url} alt={p.featuredImage.altText || p.title} fill sizes="(min-width:1024px) 280px, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105" />
                )}
              </div>
              <div>
                <h2 className="font-sans text-sm font-medium">{p.title}</h2>
                <p className="text-sm text-ink-soft">Desde {formatMoney(p.priceRange.minVariantPrice)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
