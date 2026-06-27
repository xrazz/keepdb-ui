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
    <div className="w-full max-w-3xl pb-12">
      {!response.success && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {response.message}
        </div>
      )}

      <div className="mb-4">
        <MemoryFolderFilter collections={collections} selectedCollection={selectedCollection} />
      </div>
      <MemoryRows memories={memories} />
    </div>
  );
}
