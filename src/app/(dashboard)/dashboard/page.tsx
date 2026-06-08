import {
  formatKeepDbDate,
  listKeepDbApiKeys,
  listKeepDbCollections,
  listKeepDbMemories,
  previewMemory,
} from '@/lib/keepdb/client';
import Link from 'next/link';

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
  const latestMemory = memories[0];
  const stats = [
    { label: 'Saved memories', value: totalMemories.toLocaleString() },
    { label: 'Memory spaces', value: collections.length.toLocaleString() },
    { label: 'Agent connection', value: activeApiKeys.length > 0 ? 'Active' : 'Not connected' },
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

      <section className="mb-4 rounded-md border border-zinc-200 bg-white px-4 py-4">
        <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-base font-semibold text-zinc-950">Search your memory</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Find feedback, prompts, notes, logs, and decisions saved to KeepDB.
            </p>
          </div>
          {latestMemory && (
            <p className="text-xs text-zinc-400">Last saved {formatKeepDbDate(latestMemory.createdAt)}</p>
          )}
        </div>
        <form action="/search">
          <input
            type="search"
            name="q"
            placeholder="Search anything..."
            className="h-12 w-full rounded-md border border-zinc-200 bg-zinc-50 px-4 text-base outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white"
          />
        </form>
      </section>

      <div className="grid gap-3 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md border border-zinc-200 bg-white px-4 py-3">
            <p className="text-xs text-zinc-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-md border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-zinc-950">Recent saves</h2>
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
            <h2 className="text-sm font-semibold text-zinc-950">Agent connection</h2>
          </div>
          {activeApiKeys.length > 0 ? (
            <div className="px-4 py-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Status</span>
                <span className="font-medium text-zinc-950">Connected</span>
              </div>
              <p className="mt-4 leading-relaxed text-zinc-500">
                Your agents can save and search memory from this account.
              </p>
              <Link
                href="/agent-setup"
                className="mt-4 inline-flex h-8 items-center rounded-md border border-zinc-200 bg-zinc-50 px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                Open agent setup
              </Link>
            </div>
          ) : (
            <div className="px-4 py-5 text-sm text-zinc-500">
              Connect an agent to start saving memory automatically.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
