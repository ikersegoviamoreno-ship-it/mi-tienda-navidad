const rows = [
  ['Arranca risas al abrirlo', true, false],
  ['Diseño minimalista que combina', true, false],
  ['Se reutiliza cada Navidad', true, false],
  ['Sin montaje ni pilas', true, true],
  ['Pack para regalar con ahorro', true, false]
] as const;

export function Comparison() {
  return (
    <section className="section">
      <div className="container-site max-w-3xl">
        <div className="mb-10 space-y-3 text-center">
          <p className="eyebrow">Comparativa</p>
          <h2 className="text-3xl sm:text-4xl">No es otro adorno más</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="p-4 text-left font-medium text-ink-soft"><span className="sr-only">Característica</span></th>
                <th className="bg-pine p-4 font-serif text-base font-normal text-snow">Reno Aura</th>
                <th className="p-4 font-medium text-ink-soft">Adorno típico</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, a, b]) => (
                <tr key={label} className="border-b border-line last:border-0">
                  <td className="p-4">{label}</td>
                  <td className="bg-pine-tint p-4 text-center text-lg text-pine">{a ? '✓' : '—'}<span className="sr-only">{a ? 'Sí' : 'No'}</span></td>
                  <td className="p-4 text-center text-lg text-ink-soft">{b ? '✓' : '—'}<span className="sr-only">{b ? 'Sí' : 'No'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
