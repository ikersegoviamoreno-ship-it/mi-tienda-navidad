import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductPage } from '@/components/product/product-page';
import { getProduct } from '@/lib/shopify';

export const revalidate = 60;

type Props = { params: { handle: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct(params.handle);
  if (!p) return {};
  return {
    title: p.seo.title || p.title,
    description: p.seo.description || p.description.slice(0, 155),
    alternates: { canonical: `/products/${p.handle}` },
    openGraph: { images: p.featuredImage ? [p.featuredImage.url] : [] }
  };
}

export default async function Page({ params }: Props) {
  const product = await getProduct(params.handle);
  if (!product) notFound();
  return <ProductPage product={product} />;
}
