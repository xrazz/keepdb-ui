import Link from 'next/link';

const API_BASE = 'https://keepdb-api-production.up.railway.app';

const endpoints = [
  {
    method: 'POST',
    path: '/memory',
    title: 'Create memory',
    description: 'Store one full text memory in a collection. KeepDB chunks and embeds it for search.',
  },
  {
    method: 'GET',
    path: '/memory',
    title: 'Search memory',
    description: 'Global or scoped hybrid search across your memories.',
  },
  {
    method: 'GET',
    path: '/collections/:name/memories',
    title: 'List collection',
    description: 'List recent memories in one collection without semantic ranking.',
  },
  {
    method: 'GET',
    path: '/tags/:name/memories',
    title: 'List tag',
    description: 'List recent memories whose metadata tags contain a value.',
  },
  {
    method: 'DELETE',
    path: '/memory/:memoryId',
    title: 'Delete memory',
    description: 'Soft delete one memory. Deleted memories are excluded from search and listing.',
  },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-[#f7f7f5] p-4 text-xs leading-relaxed text-gray-800">
      <code>{children}</code>
    </pre>
  );
}

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#fbfbf8] text-gray-900 font-[family-name:var(--font-dm-sans)]">
      <nav className="mx-auto flex max-w-2xl items-center justify-between px-6 py-7">
        <Link href="/" className="text-sm font-bold tracking-tight">
          KeepDB
        </Link>
        <div className="flex items-center gap-5 text-sm font-semibold">
          <Link href="/agents" className="text-gray-600 hover:text-black">
            Agents
          </Link>
          <Link href="/" className="text-gray-600 hover:text-black">
            Home
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-2xl px-6 pb-10 pt-12">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">KeepDB documentation</p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
          API Reference
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-gray-600">
          KeepDB V1 is a small memory API for agents and indie apps. One API key, named
          collections, full memories, searchable chunks, date filters, and soft delete.
        </p>
        <p className="mt-8 border-y border-gray-200 py-4 font-mono text-sm text-gray-700">{API_BASE}</p>
      </section>

      <section className="mx-auto max-w-2xl border-t border-gray-200 px-6 py-10">
        <h2 className="mb-4 text-xl font-bold tracking-tight">Authentication</h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-600">
          All memory endpoints require a bearer API key. Missing keys return
          <span className="font-mono"> 401 API key is required</span>. Invalid keys return
          <span className="font-mono"> 401 Invalid API key</span>.
        </p>
        <CodeBlock>{`Authorization: Bearer keep_sk_your_api_key`}</CodeBlock>
      </section>

      <section className="mx-auto max-w-2xl border-t border-gray-200 px-6 py-10">
        <h2 className="mb-5 text-xl font-bold tracking-tight">Quickstart</h2>
        <div className="space-y-10">
          <div className="space-y-3">
            <h3 className="mb-3 text-base font-semibold">1. Save a memory</h3>
            <CodeBlock>{`curl -sS -X POST "${API_BASE}/memory" \\
  -H "Authorization: Bearer keep_sk_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "collection": "cavenote-feedback",
    "content": "Cavenote feedback\\nmessage: The app feels fast.\\nemail: raj@example.com",
    "metadata": {
      "source": "ios-settings",
      "tags": ["feedback", "cavenote"]
    }
  }'`}</CodeBlock>
          </div>

          <div className="space-y-3">
            <h3 className="mb-3 text-base font-semibold">2. Search globally</h3>
            <CodeBlock>{`curl -sS "${API_BASE}/memory?query=feedbacks%20about%20cavenote&limit=5" \\
  -H "Authorization: Bearer keep_sk_your_api_key"`}</CodeBlock>
          </div>

          <div className="space-y-3">
            <h3 className="mb-3 text-base font-semibold">3. Search one collection</h3>
            <CodeBlock>{`curl -sS "${API_BASE}/memory?query=ios%20feedback&collection=cavenote-feedback&limit=5" \\
  -H "Authorization: Bearer keep_sk_your_api_key"`}</CodeBlock>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl border-t border-gray-200 px-6 py-10">
        <h2 className="mb-5 text-xl font-bold tracking-tight">Endpoints</h2>
        <div className="divide-y divide-gray-200 border-y border-gray-200">
          {endpoints.map((endpoint) => (
            <article key={`${endpoint.method}-${endpoint.path}`} className="py-5">
              <div className="mb-2 flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-xs font-semibold text-gray-950">
                  {endpoint.method}
                </span>
                <span className="font-mono text-sm text-gray-700">{endpoint.path}</span>
              </div>
              <h3 className="text-sm font-bold text-gray-950">{endpoint.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{endpoint.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl border-t border-gray-200 px-6 py-10 pb-24">
        <h2 className="mb-5 text-xl font-bold tracking-tight">Search filters</h2>
        <div className="grid gap-x-8 gap-y-2 text-sm text-gray-700 sm:grid-cols-2">
          {[
            'query',
            'limit',
            'threshold',
            'collection',
            'folder',
            'tag',
            'type',
            'createdAfter',
            'createdBefore',
            'createdOn',
            'dayOfWeek',
            'timezone',
          ].map((filter) => (
            <div key={filter} className="border-b border-gray-200 py-2 font-mono">
              {filter}
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-gray-500">
          Use <span className="font-mono">content</span> as the full memory. Use{' '}
          <span className="font-mono">matchedChunk</span> as the snippet explaining why a result matched.
        </p>
      </section>
    </main>
  );
}
