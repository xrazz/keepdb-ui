import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUseCase, useCases } from '../data';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return useCases.map((useCase) => ({ slug: useCase.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getUseCase(slug);

  if (!useCase) return {};

  return {
    title: `${useCase.title} | KeepDB`,
    description: useCase.description,
    alternates: {
      canonical: `/use-cases/${useCase.slug}`,
    },
    openGraph: {
      title: `${useCase.title} | KeepDB`,
      description: useCase.description,
      url: `https://keepdb.dev/use-cases/${useCase.slug}`,
      siteName: 'KeepDB',
      type: 'article',
    },
  };
}

export default async function UseCasePage({ params }: PageProps) {
  const { slug } = await params;
  const useCase = getUseCase(slug);

  if (!useCase) notFound();

  return (
    <main className="min-h-screen bg-white font-[family-name:var(--font-dm-sans)] text-gray-900">
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-8">
        <Link href="/" className="text-lg font-medium tracking-tight">
          <span className="text-zinc-900">Keep</span>
          <span className="text-zinc-600">DB</span>
        </Link>
        <Link href="/use-cases" className="text-sm font-medium text-gray-500 hover:text-black">
          Use cases
        </Link>
      </nav>

      <article className="mx-auto w-full max-w-3xl px-6 pb-24 pt-14">
        <p className="text-sm font-medium text-gray-500">Use case</p>
        <h1 className="mt-4 text-4xl font-medium leading-tight tracking-tight md:text-5xl">
          {useCase.title}
        </h1>
        <p className="mt-5 text-lg font-medium leading-relaxed text-gray-500">
          {useCase.intro}
        </p>

        <section className="mt-14 border-t border-gray-100 pt-8">
          <h2 className="text-2xl font-medium tracking-tight">What you can store</h2>
          <div className="mt-6 space-y-4">
            {useCase.examples.map((example) => (
              <p key={example} className="border border-gray-200 p-4 text-base font-medium text-gray-600">
                {example}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-14 border-t border-gray-100 pt-8">
          <h2 className="text-2xl font-medium tracking-tight">Why KeepDB fits</h2>
          <div className="mt-6 space-y-4">
            {useCase.whyKeepDb.map((reason) => (
              <p key={reason} className="text-base font-medium leading-relaxed text-gray-600">
                {reason}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-14 border-t border-gray-100 pt-8">
          <h2 className="text-2xl font-medium tracking-tight">Start with one folder</h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-gray-500">
            Create a folder, send one memory through the API, then search it from
            the dashboard or your agent.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full border border-black bg-black px-5 py-3 text-base font-medium text-white shadow-[0_2px_8px_rgba(0,0,0,0.16)] hover:bg-gray-900"
          >
            Get free access
          </Link>
        </section>
      </article>
    </main>
  );
}
