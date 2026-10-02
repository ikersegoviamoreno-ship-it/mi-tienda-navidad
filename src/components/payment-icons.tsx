const methods = ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'G Pay', 'Shop Pay'];

export function PaymentIcons({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center justify-center gap-1.5 ${className}`} aria-label="Métodos de pago aceptados">
      {methods.map((m) => (
        <li key={m} className="rounded border border-line bg-white px-2 py-0.5 text-[10px] font-semibold tracking-wide text-ink-soft">
          {m}
        </li>
      ))}
    </ul>
  );
}
