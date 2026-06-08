import Link from 'next/link';
import { formatKeepDbDate, previewMemory, type KeepDbMemory } from '@/lib/keepdb/client';

export function RecentSaves({ memories }: { memories: KeepDbMemory[] }) {
  if (memories.length === 0) {
    return <div className="px-4 py-5 text-sm text-zinc-500">No memories found.</div>;
  }

  return (
    <div className="divide-y divide-zinc-200">
      {memories.map((memory) => (
        <details key={memory.memoryId} className="group px-4 py-3">
          <summary className="grid cursor-pointer list-none grid-cols-[140px_1fr_120px] items-center gap-3 text-sm">
            <Link
              href={`/search?q=${encodeURIComponent(memory.collection)}`}
              className="truncate font-mono text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              {memory.collection}
            </Link>
            <span className="truncate text-zinc-800">{previewMemory(memory, 180)}</span>
            <span className="text-right text-xs text-zinc-400">{formatKeepDbDate(memory.createdAt)}</span>
          </summary>
          <p className="mt-3 pl-[152px] text-sm leading-relaxed text-zinc-700">
            {previewMemory(memory, 1200)}
          </p>
        </details>
      ))}
    </div>
  );
}
