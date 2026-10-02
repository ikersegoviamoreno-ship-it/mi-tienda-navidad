import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { legalPages } from '@/lib/legal';

type Props = { params: { slug: string } };

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(legalPages).map((slug) => ({ slug }));

export function generateMetadata({ params }: Props): Metadata {
  return { title: legalPages[params.slug]?.title };
}

export default function Page({ params }: Props) {
  const page = legalPages[params.slug];
  if (!page) notFound();
  return (
    <article className="container-site section max-w-2xl space-y-4">
      <h1 className="text-3xl">{page.title}</h1>
      {page.body.map((p, i) =>
        p.startsWith('## ') ? (
          <h2 key={i} className="pt-2 font-sans text-base font-semibold">{p.slice(3)}</h2>
        ) : (
          <p key={i} className="text-sm leading-relaxed text-ink-soft">{p}</p>
        )
      )}
    </article>
  );
}
