import { MemoryFolderFilter } from './memory-folder-filter';
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

      <div className="rounded-md border border-zinc-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="grid flex-1 grid-cols-[180px_1fr_140px] text-xs font-medium text-zinc-500">
            <span>Database</span>
            <span>Memory</span>
            <span>Created</span>
          </div>
          <MemoryFolderFilter collections={collections} selectedCollection={selectedCollection} />
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
