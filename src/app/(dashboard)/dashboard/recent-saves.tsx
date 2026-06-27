import Link from 'next/link';
import { formatKeepDbDate, previewMemory, type KeepDbMemory } from '@/lib/keepdb/client';

export function RecentSaves({ memories }: { memories: KeepDbMemory[] }) {
  if (memories.length === 0) {
    return <div className="rounded-md bg-zinc-50 px-4 py-5 text-sm font-medium text-zinc-500">No memories found.</div>;
  }

  return (
    <div className="space-y-2">
      {memories.map((memory) => (
        <details key={memory.memoryId} className="group rounded-md bg-zinc-50 px-3 py-2">
          <summary className="grid cursor-pointer list-none gap-1 text-sm font-medium sm:grid-cols-[140px_1fr_120px] sm:items-center sm:gap-3">
            <Link
              href={`/search?q=${encodeURIComponent(memory.collection)}`}
              className="truncate text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {memory.collection}
            </Link>
            <span className="truncate text-zinc-700">{previewMemory(memory, 180)}</span>
            <span className="text-xs font-medium text-zinc-400 sm:text-right">{formatKeepDbDate(memory.createdAt)}</span>
          </summary>
          <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-700 sm:pl-[152px]">
            {previewMemory(memory, 1200)}
          </p>
        </details>
      ))}
    </div>
  );
}
