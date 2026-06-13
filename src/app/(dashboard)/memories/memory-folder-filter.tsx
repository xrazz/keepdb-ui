'use client';

import { useRouter } from 'next/navigation';
import type { KeepDbCollection } from '@/lib/keepdb/client';

export function MemoryFolderFilter({
  collections,
  selectedCollection,
}: {
  collections: KeepDbCollection[];
  selectedCollection: string;
}) {
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 text-xs font-medium text-zinc-500">
      <span>Folder</span>
      <select
        value={selectedCollection}
        onChange={(event) => {
          const collection = event.target.value;
          router.push(collection ? `/memories?collection=${encodeURIComponent(collection)}` : '/memories');
        }}
        className="h-8 min-w-[180px] rounded-md border border-zinc-200 bg-white px-2 text-xs font-medium text-zinc-700 outline-none transition-colors hover:border-zinc-300 focus:border-zinc-400"
      >
        <option value="">All folders</option>
        {collections.map((collection) => (
          <option key={collection.id} value={collection.name}>
            {collection.name} ({collection.memories})
          </option>
        ))}
      </select>
    </label>
  );
}
