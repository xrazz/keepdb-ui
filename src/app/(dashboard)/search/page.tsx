import { formatKeepDbDate, previewMemory, timedSearchKeepDbMemories } from '@/lib/keepdb/client';

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
        <div className="rounded-md border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-500">
            {results.length} results for <span>&quot;{query}&quot;</span>
            {searchMs !== null && <span> in {searchMs} ms</span>}
          </div>
          {results.length > 0 ? (
            <div className="divide-y divide-zinc-200">
              {results.map((memory) => (
                <article key={memory.memoryId} className="px-4 py-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="font-mono text-xs font-medium text-zinc-500">
                      {memory.collection}
                    </span>
                    <span className="shrink-0 text-xs text-zinc-400">
                      {formatKeepDbDate(memory.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-800">{previewMemory(memory, 320)}</p>
                  {typeof memory.score === 'number' && (
                    <p className="mt-2 text-xs text-zinc-400">Score {memory.score.toFixed(4)}</p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="px-4 py-5 text-sm text-zinc-500">No matching memories found.</div>
          )}
        </div>
      )}
    </div>
  );
}
