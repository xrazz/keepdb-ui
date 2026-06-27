import { Search } from 'lucide-react';
import Image from 'next/image';
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
    <div className="w-full max-w-3xl pb-12">
      <form action="/search" className="mb-4">
        <div className="flex h-9 w-full items-center rounded-full border border-zinc-200/70 bg-zinc-50 px-3 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)] transition-colors focus-within:border-zinc-300">
          <Image
            src="/folder.png"
            alt=""
            width={18}
            height={18}
            className="mr-3 size-[18px] shrink-0"
          />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search your memory..."
            className="h-full min-w-0 flex-1 bg-transparent text-xs font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
          />
          <button
            type="submit"
            aria-label="Search"
            className="-mr-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-blue-600 hover:bg-white hover:text-blue-700"
          >
            <Search className="size-3.5" strokeWidth={1.8} />
          </button>
        </div>
      </form>

      {!query && (
        <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-center text-zinc-400">
          <Search className="size-4" strokeWidth={1.8} />
          <p className="text-sm font-medium text-zinc-500">Search anything in your database</p>
        </div>
      )}

      {response && !response.success && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {response.message}
        </div>
      )}

      {query && response?.success && (
        <div>
          <div className="mb-3 text-xs font-medium text-zinc-500">
            {results.length} results for <span>&quot;{query}&quot;</span>
            {searchMs !== null && <span> in {searchMs} ms</span>}
          </div>
          <SearchResults results={results} />
        </div>
      )}
    </div>
  );
}
