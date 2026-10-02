export type Money = { amount: string; currencyCode: string };

export type Image = { url: string; altText: string | null; width?: number; height?: number };

export type SelectedOption = { name: string; value: string };

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  tags: string[];
  options: { id: string; name: string; values: string[] }[];
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  compareAtPriceRange: { maxVariantPrice: Money };
  featuredImage: Image | null;
  images: Image[];
  variants: ProductVariant[];
  seo: { title: string | null; description: string | null };
  /** true cuando los datos vienen del catálogo local de respaldo (no se puede comprar) */
  isFallback?: boolean;
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    product: { handle: string; title: string; featuredImage: Image | null };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: CartLine[];
};

type Edges<T> = { edges: { node: T }[] };

export type ShopifyProduct = Omit<Product, 'images' | 'variants'> & {
  images: Edges<Image>;
  variants: Edges<ProductVariant>;
};

export type ShopifyCart = Omit<Cart, 'lines'> & { lines: Edges<CartLine> };
