import { reviews } from '@/lib/site';

export function Reviews() {
  if (!reviews.length) return null;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return (
    <section id="resenas" className="section bg-mist">
      <div className="container-site">
        <div className="mb-10 space-y-3 text-center">
          <p className="eyebrow">Opiniones</p>
          <h2 className="text-3xl sm:text-4xl">Lo que dicen quienes ya lo tienen</h2>
          <p className="text-sm text-ink-soft"><span className="text-gold">★★★★★</span> {avg.toFixed(1)} de 5 · {reviews.length} reseñas verificadas</p>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {reviews.map((r, i) => (
            <li key={i} className="space-y-3 rounded-2xl bg-white p-6">
              <p className="text-gold" aria-label={`${r.rating} de 5 estrellas`}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
              <p className="text-sm leading-relaxed">“{r.text}”</p>
              <p className="text-xs font-semibold text-ink-soft">{r.name}{r.city ? ` · ${r.city}` : ''}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function reviewSummary() {
  if (!reviews.length) return undefined;
  return { value: reviews.reduce((s, r) => s + r.rating, 0) / reviews.length, count: reviews.length };
}
