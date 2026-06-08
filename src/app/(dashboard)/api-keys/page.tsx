import { formatKeepDbDate, listKeepDbApiKeys } from '@/lib/keepdb/client';

export default async function ApiKeysPage() {
  const response = await listKeepDbApiKeys();
  const apiKeys = response.success ? response.data.results : [];

  return (
    <div className="w-full max-w-3xl pb-12">
      {!response.success && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {response.message}
        </div>
      )}

      <section className="rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-zinc-950">Agent API key</h2>
        </div>
        {apiKeys.length > 0 ? (
          <div className="divide-y divide-zinc-200">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-950">{apiKey.name}</h3>
                    <p className="mt-1 font-mono text-xs text-zinc-500">{apiKey.keyPrefix}...</p>
                  </div>
                  <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600">
                    {apiKey.revokedAt ? 'Revoked' : 'Active'}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-zinc-500">Scopes</p>
                    <p className="mt-1 font-medium text-zinc-700">{apiKey.scopes.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Created</p>
                    <p className="mt-1 font-medium text-zinc-700">
                      {formatKeepDbDate(apiKey.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Last used</p>
                    <p className="mt-1 font-medium text-zinc-700">
                      {formatKeepDbDate(apiKey.lastUsedAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-5 text-sm text-zinc-500">
            No agent API key found for this account.
          </div>
        )}
      </section>
    </div>
  );
}
