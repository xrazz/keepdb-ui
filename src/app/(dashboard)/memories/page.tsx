import { MemoryFolderFilter } from './memory-folder-filter';
import { MemoryRows } from './memory-rows';
import {
  listKeepDbCollections,
  listKeepDbMemories,
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
        <div className="grid grid-cols-[180px_1fr_140px] border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-500">
          <MemoryFolderFilter collections={collections} selectedCollection={selectedCollection} />
          <span>Memory</span>
          <span>Created</span>
        </div>
        <MemoryRows memories={memories} />
      </div>
    </div>
  );
}
