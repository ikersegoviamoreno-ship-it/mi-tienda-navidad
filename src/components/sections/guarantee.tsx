import { site } from '@/lib/site';

export function Guarantee() {
  return (
    <section className="section">
      <div className="container-site">
        <div className="mx-auto max-w-3xl rounded-3xl bg-pine px-6 py-12 text-center text-snow sm:px-12">
          <p className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-gold font-serif text-2xl text-gold">{site.returnDays}</p>
          <h2 className="text-3xl sm:text-4xl">Garantía de {site.returnDays} días</h2>
          <p className="mx-auto mt-4 max-w-xl text-snow/80">
            Si no te saca una sonrisa, te devolvemos el dinero. Sin letra pequeña ni preguntas incómodas.
          </p>
        </div>
      </div>
    </section>
  );
}
