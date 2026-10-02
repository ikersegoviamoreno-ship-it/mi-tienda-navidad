import 'server-only';
import { shopifyFetch } from '@/lib/shopify';

/**
 * Reseñas reales guardadas en Shopify como metaobjetos `customer_review`
 * (Contenido → Metaobjetos → Reseña de cliente). Solo las que tengan estado
 * ACTIVO llegan a la Storefront API: las nuevas entran en Borrador para moderarlas.
 */
export const REVIEW_TYPE = 'customer_review';
export const REVIEWS_TAG = 'reviews';

export type Review = { id: string; author: string; city?: string; rating: number; body: string; verified: boolean; date: string };
export type ReviewSummary = { average: number; count: number; distribution: number[] };

const query = /* GraphQL */ `
  query reviews($type: String!) {
    metaobjects(type: $type, first: 250, sortKey: "updated_at", reverse: true) {
      nodes { id updatedAt fields { key value } }
    }
  }
`;

type Node = { id: string; updatedAt: string; fields: { key: string; value: string | null }[] };

export async function getReviews(handle: string): Promise<Review[]> {
  try {
    const data = await shopifyFetch<{ metaobjects: { nodes: Node[] } }>({
      query,
      variables: { type: REVIEW_TYPE },
      tags: [REVIEWS_TAG]
    });
    return data.metaobjects.nodes
      .map((n) => {
        const f = Object.fromEntries(n.fields.map((x) => [x.key, x.value ?? '']));
        return {
          id: n.id,
          handle: f.product_handle,
          author: f.author,
          city: f.city || undefined,
          rating: Math.min(5, Math.max(1, Number(f.rating) || 5)),
          body: f.body,
          verified: f.verified === 'true',
          date: n.updatedAt
        };
      })
      .filter((r) => r.handle === handle && r.author && r.body)
      .map(({ handle: _h, ...r }) => r);
  } catch (e) {
    console.error('[reviews] getReviews', e);
    return [];
  }
}

export function summarize(reviews: Review[]): ReviewSummary {
  const distribution = [0, 0, 0, 0, 0];
  reviews.forEach((r) => distribution[r.rating - 1]++);
  const count = reviews.length;
  return { count, distribution, average: count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0 };
}
