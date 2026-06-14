import { timedSearchKeepDbMemories } from '@/lib/keepdb/client';
import { SearchResults } from './search-results';

type SearchPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params?.q?.trim() || '';
  const search = query ? await timedSearchKeepDbMemories(query, 10) : null;
  const response = search?.response || null;
  const searchMs = search?.elapsedMs ?? null;
  const results = response?.success ? response.data.results : [];

  return (
    <div className="w-full max-w-4xl pb-12">
      <form action="/search" className="mb-6">
        <div className="flex h-12 w-full items-center rounded-md border border-zinc-200 bg-white px-4 transition-colors focus-within:border-zinc-400">
          <span className="mr-3 shrink-0 text-sm font-medium tracking-tight">
            <span className="text-zinc-950">K</span>
            <span className="text-zinc-400">B</span>
          </span>
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search your memory..."
            className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-zinc-400"
          />
        </div>
      </form>

      {!query && (
        <section className="rounded-md border border-zinc-200 bg-white px-4 py-5">
          <h2 className="text-sm font-medium text-zinc-950">Personal search for your KeepDB</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
            Search everything saved to your account.
          </p>
        </section>
      )}

      {response && !response.success && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {response.message}
        </div>
      )}

      {query && response?.success && (
        <div className="bg-white">
          <div className="mb-5 text-xs font-medium text-zinc-500">
            {results.length} results for <span>&quot;{query}&quot;</span>
            {searchMs !== null && <span> in {searchMs} ms</span>}
          </div>
          <SearchResults results={results} />
        </div>
      )}
    </div>
  );
}
