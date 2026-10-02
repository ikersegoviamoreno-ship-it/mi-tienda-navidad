export function Stars({ value, className = '' }: { value: number; className?: string }) {
  const pct = (Math.max(0, Math.min(5, value)) / 5) * 100;
  return (
    <span className={`relative inline-block text-sm leading-none tracking-[2px] ${className}`} role="img" aria-label={`${value.toFixed(1)} de 5 estrellas`}>
      <span className="text-line">★★★★★</span>
      <span className="absolute inset-0 overflow-hidden whitespace-nowrap text-red" style={{ width: `${pct}%` }}>★★★★★</span>
    </span>
  );
}
