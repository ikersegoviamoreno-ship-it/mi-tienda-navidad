import { cartFragment, productFragment } from './fragments';

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) @inContext(country: ES, language: ES) {
    product(handle: $handle) { ...product }
  }
  ${productFragment}
`;

export const getProductsQuery = /* GraphQL */ `
  query getProducts($first: Int = 24) @inContext(country: ES, language: ES) {
    products(first: $first, sortKey: BEST_SELLING) { edges { node { ...product } } }
  }
  ${productFragment}
`;

export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!) @inContext(country: ES, language: ES) {
    cart(id: $cartId) { ...cart }
  }
  ${cartFragment}
`;

export const createCartMutation = /* GraphQL */ `
  mutation createCart($lines: [CartLineInput!]) @inContext(country: ES, language: ES) {
    cartCreate(input: { lines: $lines }) {
      cart { ...cart }
      userErrors { field message }
    }
  }
  ${cartFragment}
`;

export const addToCartMutation = /* GraphQL */ `
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...cart }
      userErrors { field message }
    }
  }
  ${cartFragment}
`;

export const updateCartMutation = /* GraphQL */ `
  mutation updateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...cart }
      userErrors { field message }
    }
  }
  ${cartFragment}
`;

export const removeFromCartMutation = /* GraphQL */ `
  mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...cart }
      userErrors { field message }
    }
  }
  ${cartFragment}
`;
