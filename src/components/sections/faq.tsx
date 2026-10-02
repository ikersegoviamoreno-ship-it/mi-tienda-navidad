import { faqs } from '@/lib/site';

export function Faq() {
  return (
    <section id="faq" className="section bg-mist">
      <div className="container-site max-w-3xl">
        <div className="mb-10 space-y-3 text-center">
          <p className="eyebrow">Preguntas frecuentes</p>
          <h2 className="text-3xl sm:text-4xl">Todo lo que necesitas saber</h2>
        </div>
        <div className="divide-y divide-line rounded-2xl bg-white">
          {faqs.map((f) => (
            <details key={f.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="text-xl text-ink-soft transition group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  };
}
