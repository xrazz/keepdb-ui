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
  'whitespace-nowrap border-r border-zinc-200 px-3 py-2 text-left text-xs font-medium text-zinc-700 last:border-r-0';
const tableBodyCell =
  'h-9 max-w-[320px] border-r border-zinc-100 p-0 last:border-r-0 hover:bg-zinc-50';
const tableCellText =
  'block h-9 w-full truncate bg-transparent px-3 text-left text-xs font-medium leading-9 text-zinc-700';

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
    <div className="w-full max-w-3xl pb-12">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <span aria-hidden="true">📁</span>
            <h1 className="truncate text-sm font-medium text-blue-700">{readableName(folder)}</h1>
            <span className="shrink-0 text-xs font-medium text-zinc-500">
              {memories.length.toLocaleString()} {memories.length === 1 ? 'memory' : 'memories'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setView('memory')}
            className={`h-8 rounded-full px-3 text-xs font-medium ${
              view === 'memory'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Memories
          </button>
          <button
            type="button"
            onClick={() => setView('table')}
            className={`inline-flex h-8 items-center gap-2 rounded-full px-3 text-xs font-medium ${
              view === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Table2 className="size-3.5" />
            Make table
          </button>
          <button
            type="button"
            onClick={() => downloadCsv(folder, columns, rows)}
            disabled={rows.length === 0}
            className="inline-flex h-8 items-center gap-2 rounded-full bg-zinc-50 px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="size-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {view === 'memory' ? (
        <div className="space-y-2">
          {memories.map((memory) => (
            <details key={memory.memoryId} className="group rounded-md bg-zinc-50 px-3 py-2">
              <summary className="grid cursor-pointer list-none gap-1 text-sm sm:grid-cols-[1fr_140px] sm:items-center">
                <p className="min-w-0 truncate font-medium text-blue-600">{previewMemory(memory, 150)}</p>
                <p className="text-xs font-medium text-zinc-400 sm:text-right">{formatKeepDbDate(memory.createdAt)}</p>
              </summary>
              <div className="mt-3 border-t border-zinc-100 pt-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="truncate text-xs font-medium text-zinc-400">{memory.memoryId}</p>
                  <button
                    type="button"
                    onClick={() => downloadMemory(memory)}
                    className="inline-flex h-8 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                  >
                    <Download className="size-3.5" />
                    Download
                  </button>
                </div>
                <p className="whitespace-pre-wrap rounded-md bg-white p-3 text-xs font-medium leading-relaxed text-zinc-700">
                  {memory.content}
                </p>
              </div>
            </details>
          ))}
          {memories.length === 0 && (
            <div className="flex min-h-40 items-center justify-center text-center text-sm font-medium text-zinc-500">
              No memories found.
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white">
          <table className="w-full min-w-max table-auto border-collapse">
            <thead>
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
