import { useCases } from '@/lib/site';

export function UseCases() {
  return (
    <section className="border-y border-line py-6">
      <div className="container-site">
        <p className="mb-3 text-center text-sm text-ink-soft">Perfecto para</p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {useCases.map((u) => (
            <li key={u.label} className="flex items-center justify-center gap-2 rounded-full border border-line bg-white px-3 py-2.5 text-sm font-medium">
              <span aria-hidden>{u.emoji}</span> {u.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
