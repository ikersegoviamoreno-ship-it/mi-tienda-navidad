'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type State = 'idle' | 'open' | 'sending' | 'done';

export function ReviewForm({ handle }: { handle: string }) {
  const [state, setState] = useState<State>('idle');
  const [rating, setRating] = useState(5);
  const [error, setError] = useState<string | null>(null);

  if (state === 'done') {
    return <p className="rounded-xl bg-red-tint p-3 text-sm text-red-dark">¡Gracias! Tu reseña se publicará en cuanto la revisemos.</p>;
  }

  if (state === 'idle') {
    return (
      <button onClick={() => setState('open')} className="btn-secondary w-full">
        Escribir una reseña
      </button>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setState('sending');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, rating, handle })
    }).catch(() => null);
    const json = await res?.json().catch(() => null);
    if (json?.ok) setState('done');
    else {
      setError(json?.error ?? 'No hemos podido enviar tu reseña.');
      setState('open');
    }
  }

  const input = 'w-full rounded-lg border border-line bg-snow px-3 py-2 text-sm outline-none focus:border-ink';

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <fieldset>
        <legend className="mb-1 text-xs font-semibold">Tu puntuación</legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} estrellas`} aria-pressed={rating === n}
              className={cn('text-2xl leading-none transition', n <= rating ? 'text-red' : 'text-line')}>★</button>
          ))}
        </div>
      </fieldset>
      <input name="author" required minLength={2} maxLength={60} placeholder="Tu nombre" className={input} autoComplete="given-name" />
      <input name="city" maxLength={60} placeholder="Ciudad (opcional)" className={input} autoComplete="address-level2" />
      <textarea name="body" required minLength={10} maxLength={1000} rows={3} placeholder="¿Qué te ha parecido?" className={input} />
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {error && <p className="text-xs text-red" role="alert">{error}</p>}
      <button disabled={state === 'sending'} className="btn-primary min-h-[44px] w-full text-sm">
        {state === 'sending' ? 'Enviando…' : 'Enviar reseña'}
      </button>
      <p className="text-[11px] leading-snug text-ink-soft">Revisamos cada reseña antes de publicarla. Publicamos todas las opiniones reales, positivas o negativas.</p>
    </form>
  );
}
