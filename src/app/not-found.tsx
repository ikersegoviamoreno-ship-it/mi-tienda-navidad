import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-site section space-y-5 text-center">
      <p className="font-serif text-6xl">404</p>
      <h1 className="text-2xl">Este reno se ha perdido por el camino</h1>
      <Link href="/" className="btn-primary">Volver a la tienda</Link>
    </section>
  );
}
