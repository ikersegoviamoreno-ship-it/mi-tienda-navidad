import { ReviewForm } from '@/components/sections/review-form';
import { Stars } from '@/components/stars';
import type { Review, ReviewSummary } from '@/lib/reviews';

const fmtDate = (d: string) => new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date(d));

export function Reviews({ reviews, summary, handle }: { reviews: Review[]; summary: ReviewSummary; handle: string }) {
  return (
    <section id="resenas" className="section scroll-mt-16 bg-cream">
      <div className="container-site">
        <div className="mb-6 space-y-2 text-center">
          <p className="eyebrow">Opiniones</p>
          <h2 className="text-2xl sm:text-3xl">{summary.count ? 'Lo que dicen quienes ya lo tienen' : 'Sé el primero en opinar'}</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4 rounded-2xl bg-snow p-5">
            {summary.count > 0 ? (
              <>
                <div className="flex items-end gap-3">
                  <span className="font-serif text-5xl leading-none">{summary.average.toFixed(1)}</span>
                  <div className="pb-1">
                    <Stars value={summary.average} />
                    <p className="text-xs text-ink-soft">{summary.count} {summary.count === 1 ? 'reseña' : 'reseñas'}</p>
                  </div>
                </div>
                <ul className="space-y-1.5" aria-label="Distribución de puntuaciones">
                  {[5, 4, 3, 2, 1].map((n) => {
                    const c = summary.distribution[n - 1];
                    return (
                      <li key={n} className="flex items-center gap-2 text-xs">
                        <span className="w-3 tabular-nums">{n}</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                          <span className="block h-full rounded-full bg-red" style={{ width: `${(c / summary.count) * 100}%` }} />
                        </span>
                        <span className="w-5 text-right tabular-nums text-ink-soft">{c}</span>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <p className="text-sm text-ink-soft">Todavía no hay reseñas. ¿Ya tienes tu Reno Aura? Cuéntanos qué te parece.</p>
            )}
            <ReviewForm handle={handle} />
          </aside>

          {reviews.length > 0 && (
            <ul className="grid gap-3 sm:grid-cols-2">
              {reviews.slice(0, 12).map((r) => (
                <li key={r.id} className="space-y-2 rounded-2xl bg-snow p-5">
                  <div className="flex items-center justify-between gap-2">
                    <Stars value={r.rating} />
                    <span className="text-xs text-ink-soft">{fmtDate(r.date)}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{r.body}</p>
                  <p className="text-xs font-semibold">
                    {r.author}
                    {r.city && <span className="font-normal text-ink-soft"> · {r.city}</span>}
                    {r.verified && <span className="ml-2 rounded-full bg-red-tint px-2 py-0.5 text-[10px] font-semibold text-red-dark">✓ Compra verificada</span>}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
