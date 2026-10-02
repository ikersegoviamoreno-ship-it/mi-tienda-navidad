'use client';

import { useEffect, useState } from 'react';

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    ms,
    d: Math.floor(ms / 864e5),
    h: Math.floor((ms / 36e5) % 24),
    m: Math.floor((ms / 6e4) % 60),
    s: Math.floor((ms / 1e3) % 60)
  };
}

/** Cuenta atrás REAL hasta la fecha límite de envío navideño. Desaparece al expirar. */
export function Countdown({ to, label }: { to: string; label: string }) {
  const target = new Date(to).getTime();
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!t || t.ms === 0) return null;

  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-cream px-4 py-2.5 text-sm text-red">
      <span className="min-w-0 truncate font-medium">{label}</span>
      <span className="shrink-0 whitespace-nowrap font-semibold tabular-nums" aria-live="off">
        {t.d}d {pad(t.h)}:{pad(t.m)}:{pad(t.s)}
      </span>
    </div>
  );
}
