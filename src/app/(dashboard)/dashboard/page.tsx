import {
  formatKeepDbDate,
  listKeepDbCollections,
  listKeepDbMemories,
  previewMemory,
} from '@/lib/keepdb/client';

function responseMessage(response: { success: boolean; message?: string }) {
  return response.success ? null : response.message || null;
}

export default async function DashboardPage() {
  const [collectionsResponse, memoriesResponse] = await Promise.all([
    listKeepDbCollections(),
    listKeepDbMemories(5),
  ]);

  const collections = collectionsResponse.success ? collectionsResponse.data.results : [];
  const memories = memoriesResponse.success ? memoriesResponse.data.results : [];
  const totalMemories = collections.reduce((sum, collection) => sum + collection.memories, 0);
  const totalBytes = collections.reduce((sum, collection) => sum + collection.contentBytes, 0);
  const stats = [
    { label: 'Total memories', value: totalMemories.toLocaleString() },
    { label: 'Collections', value: collections.length.toLocaleString() },
    { label: 'Stored data', value: `${Math.max(totalBytes / 1024 / 1024, 0).toFixed(1)} MB` },
  ];
  const configMessage = responseMessage(collectionsResponse) || responseMessage(memoriesResponse);

  return (
    <div className="w-full pb-12">
      {configMessage && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {configMessage}
        </div>
      )}

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
              Live memories will appear here after your KeepDB API key is configured.
            </div>
          )}
        </section>

        <section className="rounded-md border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-zinc-950">Top collections</h2>
          </div>
          {collections.length > 0 ? (
            <div className="divide-y divide-zinc-200">
              {collections.slice(0, 6).map((collection) => (
                <div key={collection.id} className="flex items-center justify-between gap-4 px-4 py-4">
                  <div>
                    <h3 className="font-mono text-sm font-semibold text-zinc-950">{collection.name}</h3>
                    <p className="mt-1 text-xs text-zinc-400">
                      Last memory {formatKeepDbDate(collection.lastMemoryAt)}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-zinc-600">{collection.memories}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-5 text-sm text-zinc-500">No live collections loaded yet.</div>
          )}
        </section>
      </div>
    </div>
  );
}
