'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bot, ChevronDown, MessageCircle, Search } from 'lucide-react';
import type { SdrAgent, SdrChat } from '../data';

type SortMode = 'recent' | 'name' | 'unread' | 'status';

const chatStatusClass: Record<SdrChat['status'], string> = {
  Open: 'bg-zinc-100 text-zinc-600',
  Booked: 'bg-emerald-50 text-emerald-700',
  'Needs reply': 'bg-blue-50 text-blue-700',
  Review: 'bg-amber-50 text-amber-700',
};

function sortChats(chats: SdrChat[], sortMode: SortMode) {
  return [...chats].sort((a, b) => {
    if (sortMode === 'name') return a.leadName.localeCompare(b.leadName);
    if (sortMode === 'unread') return b.unread - a.unread;
    if (sortMode === 'status') return a.status.localeCompare(b.status);
    return b.unread - a.unread;
  });
}

export function SdrChatList({ agent }: { agent: SdrAgent }) {
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('recent');

  const visibleChats = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = normalizedQuery
      ? agent.chats.filter((chat) =>
          [chat.leadName, chat.leadPhone, chat.status, chat.source, chat.lastMessage]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery)
        )
      : agent.chats;

    return sortChats(filtered, sortMode);
  }, [agent.chats, query, sortMode]);

  const unread = agent.chats.reduce((sum, chat) => sum + chat.unread, 0);

  return (
    <div className="w-full max-w-3xl pb-12">
      <div className="mb-5">
        <Link href="/ai-sdr-agents" className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-950">
          <ArrowLeft className="size-3.5" strokeWidth={1.8} />
          AI SDR bots
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-50 text-blue-700">
                <Bot className="size-4.5" strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-medium tracking-tight text-zinc-950">{agent.name}</h2>
                <p className="mt-1 truncate text-sm text-zinc-500">
                  {agent.client} / {agent.channel} / {agent.chats.length} chats
                </p>
              </div>
            </div>
          </div>
          {unread > 0 && (
            <span className="shrink-0 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white">
              {unread} unread
            </span>
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex h-9 w-full items-center rounded-full border border-zinc-200/70 bg-zinc-50 px-3 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)] sm:max-w-sm">
          <Search className="mr-2 size-3.5 text-blue-600" strokeWidth={1.8} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search chats"
            className="h-full min-w-0 flex-1 bg-transparent text-xs font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
          />
        </label>

        <div className="relative sm:w-40">
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className="h-9 w-full appearance-none rounded-full border border-zinc-200/70 bg-zinc-50 pl-3 pr-10 text-xs font-medium text-zinc-600 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)] outline-none focus:border-zinc-300"
          >
            <option value="recent">Recently active</option>
            <option value="unread">Unread</option>
            <option value="name">Lead name</option>
            <option value="status">Status</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" strokeWidth={1.8} />
        </div>
      </div>

      <div className="space-y-2">
        {visibleChats.map((chat) => (
          <Link
            key={chat.id}
            href={`/ai-sdr-agents/${agent.id}/chats/${chat.id}`}
            className="flex items-center justify-between gap-4 rounded-md bg-zinc-50 px-3 py-2 text-sm font-medium hover:bg-zinc-100/70"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-emerald-700">
                <MessageCircle className="size-4" strokeWidth={1.8} />
              </span>
              <span className="min-w-0">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-blue-700">{chat.leadName}</span>
                  <span className="hidden shrink-0 text-xs text-zinc-400 sm:inline">{chat.leadPhone}</span>
                </span>
                <span className="mt-0.5 block truncate text-xs text-zinc-500">{chat.lastMessage}</span>
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              {chat.unread > 0 && (
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] text-white">{chat.unread}</span>
              )}
              <span className={`rounded-full px-2 py-1 text-[11px] ${chatStatusClass[chat.status]}`}>{chat.status}</span>
              <span className="hidden text-xs text-zinc-400 sm:inline">{chat.lastActive}</span>
            </span>
          </Link>
        ))}

        {visibleChats.length === 0 && (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-md bg-zinc-50 text-center text-zinc-400">
            <MessageCircle className="size-4" strokeWidth={1.8} />
            <p className="text-sm font-medium text-zinc-500">No chats yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
