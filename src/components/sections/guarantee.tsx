import { site } from '@/lib/site';

export function Guarantee() {
  return (
    <section className="section">
      <div className="container-site">
        <div className="mx-auto max-w-3xl rounded-3xl bg-ink px-6 py-8 text-center text-snow sm:px-10">
          <p className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full border border-red font-serif text-2xl text-red">{site.returnDays}</p>
          <h2 className="text-2xl sm:text-3xl">Garantía de {site.returnDays} días</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-snow/80">
            Si no te saca una sonrisa, te devolvemos el dinero. Sin letra pequeña ni preguntas incómodas.
          </p>
        </div>
      </div>
    </section>
  );
}
