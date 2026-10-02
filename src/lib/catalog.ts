import type { Product, ProductVariant } from '@/lib/shopify/types';
import { money } from '@/lib/utils';

/**
 * Catálogo local de RESPALDO. Solo se usa si Shopify no está disponible o el
 * producto aún no existe con ese handle. La web se ve completa pero el botón de compra
 * queda desactivado (isFallback). Crea el producto en Shopify con el mismo handle
 * para activar las ventas: los datos reales de Shopify sustituyen a estos.
 */
const v = (n: string, title: string, price: number): ProductVariant => ({
  id: `fallback-${n}`,
  title,
  availableForSale: true,
  selectedOptions: [{ name: 'Pack', value: title }],
  price: money(price),
  compareAtPrice: null
});

const variants = [v('1', '1 unidad', 34.95), v('2', 'Pack 2', 59.95), v('3', 'Pack 3', 79.95)];

const images = [
  { url: '/images/reno-aura.svg', altText: 'Reno Aura, el reno navideño con actitud', width: 800, height: 800 },
  { url: '/images/reno-aura-pine.svg', altText: 'Reno Aura sobre fondo verde abeto', width: 800, height: 800 },
  { url: '/images/reno-aura-berry.svg', altText: 'Reno Aura sobre fondo rojo baya', width: 800, height: 800 }
];

const description =
  'El reno navideño que dice lo que todos pensamos en la cena de Nochebuena. Reno Aura es la decoración con humor para quien quiere una Navidad con estilo… y un poco de actitud. Perfecto como regalo de amigo invisible, para la oficina o para darle personalidad al salón.';

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'fallback-reno-aura',
    handle: 'reno-aura',
    title: 'Reno Aura — El reno con actitud',
    description,
    descriptionHtml: `<p>${description}</p>`,
    availableForSale: true,
    tags: ['navidad', 'regalo', 'decoración'],
    options: [{ id: 'pack', name: 'Pack', values: variants.map((x) => x.title) }],
    priceRange: { minVariantPrice: money(34.95), maxVariantPrice: money(79.95) },
    compareAtPriceRange: { maxVariantPrice: money(0) },
    featuredImage: images[0],
    images,
    variants,
    seo: { title: null, description: null },
    isFallback: true
  }
];
