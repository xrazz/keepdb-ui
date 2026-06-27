'use client';

import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { KeepDbCollection } from '@/lib/keepdb/client';

export function MemoryFolderFilter({
  collections,
  selectedCollection,
}: {
  collections: KeepDbCollection[];
  selectedCollection: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const activeLabel = selectedCollection || 'All';

  function selectCollection(collection: string) {
    setOpen(false);
    router.push(collection ? `/memories?collection=${encodeURIComponent(collection)}` : '/memories');
  }

  return (
    <div className="relative w-fit">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-9 max-w-[240px] items-center gap-2 rounded-full border border-zinc-200/70 bg-zinc-50 px-3 text-left text-xs font-medium text-zinc-600 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)] transition-colors hover:bg-zinc-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="text-zinc-400">📁</span>
        <span className="truncate">{activeLabel}</span>
        <ChevronDown className="size-4 shrink-0 text-zinc-500" strokeWidth={1.8} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-10 z-20 max-h-72 w-64 overflow-y-auto rounded-md border border-zinc-200 bg-white py-1 shadow-[0_10px_30px_rgba(24,24,27,0.06)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => selectCollection('')}
            className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs font-medium ${
              selectedCollection ? 'text-zinc-600 hover:bg-zinc-50' : 'bg-zinc-50 font-medium text-zinc-950'
            }`}
          >
            <span>All</span>
          </button>
          {collections.map((collection) => (
            <button
              key={collection.id}
              type="button"
              role="menuitem"
              onClick={() => selectCollection(collection.name)}
              className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs font-medium ${
                selectedCollection === collection.name
                  ? 'bg-zinc-50 font-medium text-zinc-950'
                  : 'text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <span className="truncate">{collection.name}</span>
              <span className="shrink-0 text-[10px] text-zinc-400">{collection.memories}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
