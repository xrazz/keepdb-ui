import {
  formatKeepDbDate,
  listKeepDbApiKeys,
  listKeepDbCollections,
  listKeepDbMemories,
  previewMemory,
} from '@/lib/keepdb/client';

function responseMessage(response: { success: boolean; message?: string }) {
  return response.success ? null : response.message || null;
}

export default async function DashboardPage() {
  const [collectionsResponse, memoriesResponse, apiKeysResponse] = await Promise.all([
    listKeepDbCollections(),
    listKeepDbMemories(5),
    listKeepDbApiKeys(),
  ]);

  const collections = collectionsResponse.success ? collectionsResponse.data.results : [];
  const memories = memoriesResponse.success ? memoriesResponse.data.results : [];
  const apiKeys = apiKeysResponse.success ? apiKeysResponse.data.results : [];
  const activeApiKeys = apiKeys.filter((key) => !key.revokedAt);
  const totalMemories = collections.reduce((sum, collection) => sum + collection.memories, 0);
  const totalBytes = collections.reduce((sum, collection) => sum + collection.contentBytes, 0);
  const primaryKey = activeApiKeys[0];
  const stats = [
    { label: 'Total memories', value: totalMemories.toLocaleString() },
    { label: 'Stored data', value: `${Math.max(totalBytes / 1024 / 1024, 0).toFixed(1)} MB` },
    { label: 'Agent keys', value: activeApiKeys.length.toLocaleString() },
  ];
  const configMessage =
    responseMessage(collectionsResponse) ||
    responseMessage(memoriesResponse) ||
    responseMessage(apiKeysResponse);

  return (
    <div className="w-full pb-12">
      {configMessage && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {configMessage}
        </div>
      )}

      <form action="/search" className="mb-4">
        <input
          type="search"
          name="q"
          placeholder="Search everything in your memory..."
          className="h-12 w-full rounded-md border border-zinc-200 bg-white px-4 text-base outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400"
        />
      </form>

      <div className="grid gap-3 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md border border-zinc-200 bg-white px-4 py-3">
            <p className="text-xs text-zinc-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-md border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-zinc-950">Recent memories</h2>
          </div>
          {memories.length > 0 ? (
            <div className="divide-y divide-zinc-200">
              {memories.map((memory) => (
                <div key={memory.memoryId} className="px-4 py-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="font-mono text-xs font-medium text-zinc-500">{memory.collection}</span>
                    <span className="shrink-0 text-xs text-zinc-400">
                      {formatKeepDbDate(memory.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-700">{previewMemory(memory, 220)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-5 text-sm text-zinc-500">
              Live memories will appear here after your account has saved data.
            </div>
          )}
        </section>

        <section className="rounded-md border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-zinc-950">Agent API key</h2>
          </div>
          {primaryKey ? (
            <div className="px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-950">{primaryKey.name}</h3>
                  <p className="mt-1 font-mono text-xs text-zinc-500">{primaryKey.keyPrefix}...</p>
                </div>
                <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600">
                  Active
                </span>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Scopes</span>
                  <span className="font-medium text-zinc-700">{primaryKey.scopes.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Last used</span>
                  <span className="font-medium text-zinc-700">
                    {formatKeepDbDate(primaryKey.lastUsedAt)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-4 py-5 text-sm text-zinc-500">
              No active agent key found for this account.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
