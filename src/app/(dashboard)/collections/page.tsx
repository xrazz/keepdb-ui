import { formatKeepDbDate, listKeepDbCollections } from '@/lib/keepdb/client';

export default async function CollectionsPage() {
  const response = await listKeepDbCollections();
  const collections = response.success ? response.data.results : [];

  return (
    <div className="w-full pb-12">
      {!response.success && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {response.message}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {collections.length > 0 ? (
          collections.map((collection) => (
            <article key={collection.name} className="rounded-md border border-zinc-200 bg-white px-4 py-4">
              <p className="font-mono text-sm font-semibold text-zinc-950">{collection.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {collection.description || `Last memory ${formatKeepDbDate(collection.lastMemoryAt)}`}
              </p>
              <p className="mt-4 text-xs font-medium text-zinc-400">
                {collection.memories.toLocaleString()} memories
              </p>
            </article>
          ))
        ) : (
          <div className="rounded-md border border-zinc-200 bg-white px-4 py-5 text-sm text-zinc-500">
            No collections found.
          </div>
        )}
      </div>
    </div>
  );
}
