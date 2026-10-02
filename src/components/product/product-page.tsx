import { BuyBox } from '@/components/product/buy-box';
import { Gallery } from '@/components/product/gallery';
import { Benefits } from '@/components/sections/benefits';
import { Comparison } from '@/components/sections/comparison';
import { Faq, faqJsonLd } from '@/components/sections/faq';
import { FinalCta } from '@/components/sections/final-cta';
import { Guarantee } from '@/components/sections/guarantee';
import { Reviews } from '@/components/sections/reviews';
import { UseCases } from '@/components/sections/use-cases';
import { getReviews, summarize, type ReviewSummary } from '@/lib/reviews';
import type { Product } from '@/lib/shopify/types';
import { site } from '@/lib/site';

function productJsonLd(p: Product, rating: ReviewSummary) {
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
    ...(rating.count > 0 && { aggregateRating: { '@type': 'AggregateRating', ratingValue: rating.average.toFixed(1), reviewCount: rating.count } })
  };
}

export async function ProductPage({ product }: { product: Product }) {
  const imgs = product.images;
  const reviews = product.isFallback ? [] : await getReviews(product.handle);
  const summary = summarize(reviews);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([productJsonLd(product, summary), faqJsonLd()]) }} />

      <section id="producto" className="container-site scroll-mt-20 py-4 sm:py-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          <div className="lg:sticky lg:top-20 lg:self-start">
            <Gallery images={imgs} title={product.title} />
          </div>
          <div className="space-y-6">
            <BuyBox product={product} rating={summary.count ? { value: summary.average, count: summary.count } : undefined} />
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
      <Reviews reviews={reviews} summary={summary} handle={product.handle} />
      <Guarantee />
      <Faq />
      <FinalCta image={imgs[2] ?? imgs[0]} />
    </>
  );
}
