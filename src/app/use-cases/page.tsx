import type { Metadata } from 'next';
import Link from 'next/link';
import { useCases } from './data';

export const metadata: Metadata = {
  title: 'KeepDB use cases',
  description:
    'Use KeepDB for agent memory, customer feedback, prompt libraries, waitlists, logs, notes, and searchable app context.',
  alternates: {
    canonical: '/use-cases',
  },
};

export default function UseCasesPage() {
  return (
    <main className="min-h-screen bg-white font-[family-name:var(--font-dm-sans)] text-gray-900">
      <nav className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-8">
        <Link href="/" className="text-lg font-medium tracking-tight">
          <span className="text-zinc-900">Keep</span>
          <span className="text-zinc-600">DB</span>
        </Link>
        <Link href="/docs" className="text-sm font-medium text-gray-500 hover:text-black">
          Docs
        </Link>
      </nav>

      <section className="mx-auto w-full max-w-4xl px-6 pb-20 pt-14">
        <p className="text-sm font-medium text-gray-500">Use cases</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-medium leading-tight tracking-tight md:text-5xl">
          A memory database for the work your agents and apps keep losing.
        </h1>
        <p className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-gray-500">
          KeepDB stores useful context in folders, so you can browse it, search it,
          or let agents use it later.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {useCases.map((useCase) => (
            <Link
              key={useCase.slug}
              href={`/use-cases/${useCase.slug}`}
              className="border border-gray-200 p-6 transition-colors hover:border-gray-300"
            >
              <h2 className="text-xl font-medium text-gray-900">{useCase.title}</h2>
              <p className="mt-3 text-base font-medium leading-relaxed text-gray-500">
                {useCase.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
