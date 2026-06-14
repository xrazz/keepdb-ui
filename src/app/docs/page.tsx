import Link from 'next/link';

const API_BASE = 'https://api.keepdb.dev';

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
    <pre className="mt-4 overflow-x-auto rounded-lg border border-gray-100 bg-gray-50 p-4 text-xs leading-relaxed text-gray-700">
      <code>{children}</code>
    </pre>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-medium font-[family-name:var(--font-dm-sans)]">
      <div
        style={{
          backgroundImage: "url('/sky.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
        }}
      >
        <nav
          aria-label="Main navigation"
          className="max-w-2xl mx-auto px-6 py-6 flex items-center justify-between"
        >
          <Link href="/" className="flex items-center gap-2" aria-label="KeepDB home">
            <div className="text-lg font-medium tracking-tight">
              <span className="text-zinc-900">Keep</span>
              <span className="text-zinc-600">DB</span>
            </div>
          </Link>
          <div className="flex gap-5 text-sm font-medium tracking-tight">
            <Link href="/docs" className="text-gray-600 hover:text-black transition-colors">
              Docs
            </Link>
            <Link href="/agents" className="text-gray-600 hover:text-black transition-colors">
              Agents
            </Link>
            <Link href="/sign-in" className="text-gray-600 hover:text-black transition-colors">
              Sign in
            </Link>
          </div>
        </nav>

        <header className="max-w-2xl mx-auto px-6 pt-12 md:pt-16 pb-24">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight leading-tight text-gray-900">
            API Reference
          </h1>
          <p className="text-sm text-gray-500 mt-2">Last updated: June 2026</p>
        </header>
      </div>

      <main className="max-w-2xl mx-auto px-6 -mt-8 pb-24 relative z-10">
        <div className="text-sm text-gray-600 leading-relaxed space-y-10">
          <section>
            <h2 className="text-sm text-gray-900 font-medium mb-3">KeepDB V1</h2>
            <p>
              KeepDB is a small memory API for agents and indie apps. One API key can save
              full memories into named collections, then search them later with hybrid retrieval,
              date filters, tags, and soft delete.
            </p>
            <p className="mt-4 font-mono text-xs text-gray-500 break-all">{API_BASE}</p>
          </section>

          <section>
            <h2 className="text-sm text-gray-900 font-medium mb-3">Authentication</h2>
            <p>
              All memory endpoints require a bearer API key. Missing keys return{' '}
              <span className="font-mono">401 API key is required</span>. Invalid keys return{' '}
              <span className="font-mono">401 Invalid API key</span>.
            </p>
            <CodeBlock>{`Authorization: Bearer keep_sk_your_api_key`}</CodeBlock>
          </section>

          <section>
            <h2 className="text-sm text-gray-900 font-medium mb-3">Save a memory</h2>
            <p>
              Send text content and a collection name. If the collection does not exist, KeepDB
              creates it for the authenticated user.
            </p>
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
          </section>

          <section>
            <h2 className="text-sm text-gray-900 font-medium mb-3">Search memory</h2>
            <p>
              Search is global by default. Add a collection, folder, tag, type, or date filter when
              the scope is clear.
            </p>
            <CodeBlock>{`curl -sS "${API_BASE}/memory?query=feedbacks%20about%20cavenote&limit=5" \\
  -H "Authorization: Bearer keep_sk_your_api_key"`}</CodeBlock>
            <CodeBlock>{`curl -sS "${API_BASE}/memory?query=ios%20feedback&collection=cavenote-feedback&limit=5" \\
  -H "Authorization: Bearer keep_sk_your_api_key"`}</CodeBlock>
          </section>

          <section>
            <h2 className="text-sm text-gray-900 font-medium mb-3">Endpoints</h2>
            <div className="space-y-5">
              {endpoints.map((endpoint) => (
                <div key={`${endpoint.method}-${endpoint.path}`}>
                  <p className="font-mono text-xs text-gray-500">
                    {endpoint.method} {endpoint.path}
                  </p>
                  <h3 className="text-sm text-gray-900 font-medium mt-1">{endpoint.title}</h3>
                  <p>{endpoint.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm text-gray-900 font-medium mb-3">Search filters</h2>
            <p>
              Supported filters are <span className="font-mono">query</span>,{' '}
              <span className="font-mono">limit</span>, <span className="font-mono">threshold</span>,{' '}
              <span className="font-mono">collection</span>, <span className="font-mono">folder</span>,{' '}
              <span className="font-mono">tag</span>, <span className="font-mono">type</span>,{' '}
              <span className="font-mono">createdAfter</span>, <span className="font-mono">createdBefore</span>,{' '}
              <span className="font-mono">createdOn</span>, <span className="font-mono">dayOfWeek</span>, and{' '}
              <span className="font-mono">timezone</span>.
            </p>
          </section>
        </div>
      </main>

      <footer className="max-w-2xl mx-auto px-6 py-12 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6 text-gray-500 text-xs">
        <p>© 2026 KeepDB. All rights reserved.</p>
        <nav aria-label="Footer navigation" className="flex gap-4">
          <Link href="/agents" className="hover:text-black transition-colors">
            Agents
          </Link>
          <Link href="mailto:raj@keepdb.dev" className="hover:text-black transition-colors">
            Support
          </Link>
        </nav>
      </footer>
    </div>
  );
}
