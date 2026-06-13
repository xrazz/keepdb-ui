import Link from 'next/link';
import {
  formatKeepDbDate,
  listKeepDbCollections,
  listKeepDbMemories,
  previewMemory,
} from '@/lib/keepdb/client';

type MemoriesPageProps = {
  searchParams?: Promise<{ collection?: string }>;
};

export default async function MemoriesPage({ searchParams }: MemoriesPageProps) {
  const params = await searchParams;
  const selectedCollection = params?.collection?.trim() || '';
  const [collectionsResponse, response] = await Promise.all([
    listKeepDbCollections(),
    listKeepDbMemories(50, selectedCollection),
  ]);
  const collections = collectionsResponse.success ? collectionsResponse.data.results : [];
  const memories = response.success ? response.data.results : [];

  return (
    <div className="w-full pb-12">
      {!response.success && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {response.message}
        </div>
      )}

      <div className="mb-4 rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
          <h2 className="text-sm font-semibold text-zinc-950">Folders</h2>
        </div>
        <div className="flex flex-wrap gap-2 px-4 py-3">
          <Link
            href="/memories"
            className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedCollection
                ? 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                : 'border-zinc-950 bg-zinc-950 text-white'
            }`}
          >
            All
          </Link>
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/memories?collection=${encodeURIComponent(collection.name)}`}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCollection === collection.name
                  ? 'border-zinc-950 bg-zinc-950 text-white'
                  : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {collection.name}
              <span className="ml-1 text-[10px] opacity-60">{collection.memories}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-zinc-200 bg-white">
        <div className="grid grid-cols-[180px_1fr_140px] border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-500">
          <span>Database</span>
          <span>Memory</span>
          <span>Created</span>
        </div>
        {memories.length > 0 ? (
          memories.map((memory) => (
            <div key={memory.memoryId} className="grid grid-cols-[180px_1fr_140px] px-4 py-4 text-sm">
              <span className="font-medium text-zinc-950">{memory.collection}</span>
              <span className="text-zinc-600">{previewMemory(memory)}</span>
              <span className="text-zinc-400">{formatKeepDbDate(memory.createdAt)}</span>
            </div>
          ))
        ) : (
          <div className="px-4 py-5 text-sm text-zinc-500">No memories found.</div>
        )}
      </div>
    </div>
  );
}
