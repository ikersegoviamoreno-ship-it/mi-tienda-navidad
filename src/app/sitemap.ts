import type { MetadataRoute } from 'next';
import { legalPages } from '@/lib/legal';
import { getProducts } from '@/lib/shopify';
import { site } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  return [
    { url: site.url, priority: 1 },
    { url: `${site.url}/collections/all`, priority: 0.8 },
    ...products.map((p) => ({ url: `${site.url}/products/${p.handle}`, priority: 0.9 })),
    ...Object.keys(legalPages).map((s) => ({ url: `${site.url}/pages/${s}`, priority: 0.3 }))
  ];
}
