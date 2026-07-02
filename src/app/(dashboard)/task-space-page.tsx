import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, Database, Folder, Search } from 'lucide-react';
import {
  formatKeepDbDate,
  previewMemory,
  type KeepDbCollection,
  type KeepDbMemory,
} from '@/lib/keepdb/client';

type TaskAction = {
  label: string;
  href: string;
};

type TaskFolder = {
  name: string;
  description: string;
};

type TaskStat = {
  label: string;
  value: string;
};

type TaskSpacePageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  stats: TaskStat[];
  folders: TaskFolder[];
  memories: KeepDbMemory[];
  collections: KeepDbCollection[];
  primaryAction: TaskAction;
  secondaryAction: TaskAction;
};

function folderCount(collections: KeepDbCollection[], folderName: string) {
  return collections.find((collection) => collection.name === folderName)?.memories ?? 0;
}

export function TaskSpacePage({
  title,
  description,
  icon: Icon,
  stats,
  folders,
  memories,
  collections,
  primaryAction,
  secondaryAction,
}: TaskSpacePageProps) {
  return (
    <div className="w-full max-w-4xl pb-12">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex size-9 items-center justify-center rounded-md bg-zinc-50 text-blue-600">
            <Icon className="size-[18px]" strokeWidth={1.8} />
          </div>
          <h2 className="text-xl font-medium tracking-tight text-zinc-950">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            href={secondaryAction.href}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
          >
            <Search className="size-3.5" strokeWidth={1.8} />
            {secondaryAction.label}
          </Link>
          <Link
            href={primaryAction.href}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-zinc-950 px-3 text-xs font-medium text-white hover:bg-zinc-800"
          >
            {primaryAction.label}
            <ArrowRight className="size-3.5" strokeWidth={1.8} />
          </Link>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md bg-zinc-50 px-3 py-2">
            <p className="text-xs font-medium text-zinc-500">{stat.label}</p>
            <p className="mt-1 truncate text-sm font-medium text-zinc-950">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-medium text-zinc-950">Starter folders</h3>
            <Link href="/folders" className="text-xs font-medium text-zinc-500 hover:text-zinc-950">
              All folders
            </Link>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {folders.map((folder) => {
              const memories = folderCount(collections, folder.name);

              return (
                <Link
                  key={folder.name}
                  href={`/folders/${encodeURIComponent(folder.name)}`}
                  className="min-h-28 rounded-md bg-zinc-50 p-3 hover:bg-zinc-100/70"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-blue-700">
                      <Folder className="size-3.5 shrink-0" strokeWidth={1.8} />
                      <span className="truncate">{folder.name}</span>
                    </span>
                    <span className="shrink-0 text-xs font-medium text-zinc-400">{memories}</span>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-zinc-500">{folder.description}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-medium text-zinc-950">Recent related memory</h3>
            <Database className="size-4 text-zinc-400" strokeWidth={1.8} />
          </div>
          <div className="space-y-2">
            {memories.length > 0 ? (
              memories.slice(0, 6).map((memory) => (
                <Link
                  key={memory.memoryId}
                  href={`/folders/${encodeURIComponent(memory.collection)}`}
                  className="block rounded-md bg-zinc-50 px-3 py-2 hover:bg-zinc-100/70"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate text-xs font-medium text-blue-700">{memory.collection}</p>
                    <p className="shrink-0 text-[11px] font-medium text-zinc-400">
                      {formatKeepDbDate(memory.createdAt)}
                    </p>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-600">
                    {previewMemory(memory, 160)}
                  </p>
                </Link>
              ))
            ) : (
              <div className="flex min-h-40 flex-col items-center justify-center rounded-md bg-zinc-50 px-4 text-center">
                <Database className="size-4 text-zinc-400" strokeWidth={1.8} />
                <p className="mt-2 text-sm font-medium text-zinc-500">No related memories yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
