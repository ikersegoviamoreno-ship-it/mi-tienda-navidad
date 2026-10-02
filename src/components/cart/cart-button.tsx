'use client';

import { useCart } from './cart-context';

export function CartButton() {
  const { cart, open } = useCart();
  const count = cart?.totalQuantity ?? 0;
  return (
    <button onClick={open} className="relative rounded-full p-2 transition hover:bg-cream" aria-label={`Abrir carrito, ${count} artículos`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 7h12l-1 13H7L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-red px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
