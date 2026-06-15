'use client';

import { Download, Table2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { KeepDbMemory } from '@/lib/keepdb/client';

type FolderDetailClientProps = {
  folder: string;
  memories: KeepDbMemory[];
};

type TableRow = Record<string, string>;

const hiddenMetadataKeys = new Set(['preview', 'title', 'document']);
const tableHeaderCell =
  'whitespace-nowrap border-r border-zinc-200 px-3 py-2 text-left text-[11px] font-medium tracking-wide text-zinc-800 last:border-r-0';
const tableBodyCell =
  'h-10 max-w-[320px] border-r border-zinc-100 p-0 last:border-r-0 hover:bg-zinc-50';
const tableCellText =
  'block h-10 w-full truncate bg-transparent px-3 text-left text-sm font-medium leading-10 text-zinc-700';

function formatKeepDbDate(value?: string | null) {
  if (!value) return 'No memories yet';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function previewMemory(memory: KeepDbMemory, maxLength = 180) {
  const preview = memory.metadata?.preview || memory.matchedChunk || memory.content;
  const text = typeof preview === 'string' ? preview : memory.content;
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
}

function readableName(name: string) {
  return name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function stringifyCell(value: unknown) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}

function downloadMemory(memory: KeepDbMemory) {
  const blob = new Blob([memory.content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${memory.collection}-${memory.memoryId}.txt`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value: string) {
  if (!/[",\n]/.test(value)) return value;
  return `"${value.replaceAll('"', '""')}"`;
}

function downloadCsv(folder: string, columns: string[], rows: TableRow[]) {
  const csv = [
    columns.map(csvEscape).join(','),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column] || '')).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${folder}.csv`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function buildTable(memories: KeepDbMemory[]) {
  const metadataKeys = new Set<string>();

  memories.forEach((memory) => {
    Object.keys(memory.metadata || {}).forEach((key) => {
      if (!hiddenMetadataKeys.has(key)) metadataKeys.add(key);
    });
  });

  const columns = ['content', ...Array.from(metadataKeys).sort(), 'created'];
  const rows = memories.map((memory) => {
    const row: TableRow = {
      content: memory.content,
      created: formatKeepDbDate(memory.createdAt),
    };

    Array.from(metadataKeys).forEach((key) => {
      row[key] = stringifyCell(memory.metadata?.[key]);
    });

    return row;
  });

  return { columns, rows };
}

export function FolderDetailClient({ folder, memories }: FolderDetailClientProps) {
  const [view, setView] = useState<'memory' | 'table'>('memory');
  const { columns, rows } = useMemo(() => buildTable(memories), [memories]);

  return (
    <div className="w-full pb-12">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <span aria-hidden="true">📁</span>
            <h1 className="truncate text-xl font-medium text-blue-700">{readableName(folder)}</h1>
            <span className="shrink-0 text-sm font-medium text-zinc-500">
              {memories.length.toLocaleString()} {memories.length === 1 ? 'memory' : 'memories'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setView('memory')}
            className={`h-10 rounded-md border px-3 text-sm font-medium ${
              view === 'memory'
                ? 'border-zinc-900 bg-zinc-950 text-white'
                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            Memories
          </button>
          <button
            type="button"
            onClick={() => setView('table')}
            className={`inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-medium ${
              view === 'table'
                ? 'border-zinc-900 bg-zinc-950 text-white'
                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            <Table2 className="size-4" />
            Make table
          </button>
          <button
            type="button"
            onClick={() => downloadCsv(folder, columns, rows)}
            disabled={rows.length === 0}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="size-4" />
            Export CSV
          </button>
        </div>
      </div>

      {view === 'memory' ? (
        <div className="rounded-md border border-zinc-200 bg-white">
          <div className="divide-y divide-zinc-100">
            {memories.map((memory) => (
              <details key={memory.memoryId} className="group">
                <summary className="grid cursor-pointer list-none gap-1 px-4 py-3 text-sm sm:grid-cols-[1fr_140px] sm:items-center">
                  <p className="min-w-0 truncate font-medium text-blue-700">{previewMemory(memory, 150)}</p>
                  <p className="text-xs font-medium text-zinc-400 sm:text-right">{formatKeepDbDate(memory.createdAt)}</p>
                </summary>
                <div className="border-t border-zinc-100 bg-zinc-50 px-4 py-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="truncate text-xs font-medium text-zinc-400">{memory.memoryId}</p>
                    <button
                      type="button"
                      onClick={() => downloadMemory(memory)}
                      className="inline-flex h-8 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                    >
                      <Download className="size-3.5" />
                      Download
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-zinc-700">
                    {memory.content}
                  </p>
                </div>
              </details>
            ))}
            {memories.length === 0 && (
              <div className="px-4 py-5 text-sm font-medium text-zinc-500">No memories found.</div>
            )}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white">
          <table className="w-full min-w-max table-auto border-collapse">
            <thead className="bg-zinc-50">
              <tr className="border-b border-zinc-200">
                {columns.map((column) => (
                  <th key={column} className={tableHeaderCell}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {rows.map((row, index) => (
                <tr key={`${folder}-${index}`}>
                  {columns.map((column) => (
                    <td key={column} className={tableBodyCell} title={row[column]}>
                      <span className={tableCellText}>{row[column]}</span>
                    </td>
                  ))}
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-3 py-10 text-center text-sm font-medium text-zinc-500">
                    No rows in this folder.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
