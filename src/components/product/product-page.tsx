import { BuyBox } from '@/components/product/buy-box';
import { Gallery } from '@/components/product/gallery';
import { Benefits } from '@/components/sections/benefits';
import { Comparison } from '@/components/sections/comparison';
import { Faq, faqJsonLd } from '@/components/sections/faq';
import { FinalCta } from '@/components/sections/final-cta';
import { Guarantee } from '@/components/sections/guarantee';
import { Reviews, reviewSummary } from '@/components/sections/reviews';
import { UseCases } from '@/components/sections/use-cases';
import type { Product } from '@/lib/shopify/types';
import { site } from '@/lib/site';

function productJsonLd(p: Product) {
  const rating = reviewSummary();
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    description: p.description,
    image: p.images.map((i) => (i.url.startsWith('http') ? i.url : `${site.url}${i.url}`)),
    brand: { '@type': 'Brand', name: site.name },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: p.priceRange.minVariantPrice.currencyCode,
      lowPrice: p.priceRange.minVariantPrice.amount,
      highPrice: p.priceRange.maxVariantPrice.amount,
      availability: p.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    },
    ...(rating && { aggregateRating: { '@type': 'AggregateRating', ratingValue: rating.value.toFixed(1), reviewCount: rating.count } })
  };
}

export function ProductPage({ product }: { product: Product }) {
  const imgs = product.images;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([productJsonLd(product), faqJsonLd()]) }} />

      <section id="producto" className="container-site scroll-mt-20 py-6 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Gallery images={imgs} title={product.title} />
          </div>
          <div className="space-y-8">
            <BuyBox product={product} rating={reviewSummary()} />
            {product.descriptionHtml && (
              <div
                className="prose-sm max-w-none border-t border-line pt-6 text-sm leading-relaxed text-ink-soft [&_li]:ml-4 [&_li]:list-disc [&_p]:mb-3"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            )}
          </div>
        </div>
      </section>

      <UseCases />
      <Benefits image={imgs[1] ?? imgs[0]} />
      <Comparison />
      <Reviews />
      <Guarantee />
      <Faq />
      <FinalCta image={imgs[2] ?? imgs[0]} />
    </>
  );
}
