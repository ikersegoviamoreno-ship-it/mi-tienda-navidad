import { notFound } from 'next/navigation';
import { ProductPage } from '@/components/product/product-page';
import { getProduct } from '@/lib/shopify';
import { site } from '@/lib/site';

export const revalidate = 60;

/** Tienda de producto único: la home ES la ficha del producto estrella (menos clics = más conversión). */
export default async function Home() {
  const product = await getProduct(site.heroHandle);
  if (!product) notFound();
  return <ProductPage product={product} />;
}
