import { site } from '@/lib/site';
import { formatMoney, money } from '@/lib/utils';

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const goal = site.freeShippingThreshold;
  const remaining = Math.max(0, goal - subtotal);
  const pct = Math.min(100, (subtotal / goal) * 100);

  return (
    <div className="space-y-2">
      <p className="text-sm text-ink">
        {remaining > 0 ? (
          <>
            Te faltan <strong>{formatMoney(money(remaining))}</strong> para el <strong>envío gratis</strong>
          </>
        ) : (
          <strong className="text-pine">🎉 ¡Tienes envío gratis!</strong>
        )}
      </p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-pine transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
