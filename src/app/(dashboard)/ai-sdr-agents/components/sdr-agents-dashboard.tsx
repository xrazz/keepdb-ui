'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Plus, Search } from 'lucide-react';
import type { SdrAgent } from '../data';

type DraftAgent = SdrAgent & {
  draftOnly?: boolean;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function newDraftAgent(name: string, client: string, channel: string): DraftAgent {
  const safeName = name.trim() || 'Untitled SDR Agent';
  const safeClient = client.trim() || 'New client';
  const id = slugify(`${safeClient}-${safeName}`) || `draft-${Date.now()}`;

  return {
    id,
    name: safeName,
    client: safeClient,
    channel,
    status: 'Draft',
    goal: 'Qualify leads, answer key questions, and route qualified prospects to the right booking flow.',
    folder: `sdr/${id}`,
    leads: 0,
    booked: 0,
    replyRate: '0%',
    lastActive: 'Draft',
    tone: 'Helpful, concise',
    owner: 'Unassigned',
    handoffRule: 'Hand off when the lead asks for a human, pricing approval, or an unsupported request.',
    knowledge: ['sales-scripts', 'lead-qualification', 'objections', 'booking-rules'],
    chats: [],
    draftOnly: true,
  };
}

type SortMode = 'recent' | 'name' | 'chats' | 'booked';

function sortAgents(agents: DraftAgent[], sortMode: SortMode) {
  return [...agents].sort((a, b) => {
    if (sortMode === 'name') return a.name.localeCompare(b.name);
    if (sortMode === 'chats') return b.chats.length - a.chats.length;
    if (sortMode === 'booked') return b.booked - a.booked;
    return a.status === 'Live' && b.status !== 'Live' ? -1 : 1;
  });
}

export function SdrAgentsDashboard({ agents }: { agents: SdrAgent[] }) {
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [showCreate, setShowCreate] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [clientName, setClientName] = useState('');
  const [channel, setChannel] = useState('WhatsApp');
  const [draftAgents, setDraftAgents] = useState<DraftAgent[]>([]);

  const visibleAgents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const allAgents = [...draftAgents, ...agents];
    const filtered = normalizedQuery
      ? allAgents.filter((agent) =>
          [agent.name, agent.client, agent.channel, agent.status, agent.goal]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery)
        )
      : allAgents;

    return sortAgents(filtered, sortMode);
  }, [agents, draftAgents, query, sortMode]);

  function createAgent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const draft = newDraftAgent(agentName, clientName, channel);
    setDraftAgents((current) => [draft, ...current]);
    setAgentName('');
    setClientName('');
    setChannel('WhatsApp');
    setShowCreate(false);
  }

  return (
    <div className="w-full max-w-3xl pb-12">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex h-9 w-full items-center rounded-full border border-zinc-200/70 bg-zinc-50 px-3 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)] sm:max-w-sm">
          <Search className="mr-2 size-3.5 text-blue-600" strokeWidth={1.8} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search SDR bot"
            className="h-full min-w-0 flex-1 bg-transparent text-xs font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
          />
        </label>

        <div className="flex gap-2">
          <div className="relative w-40">
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="h-9 w-full appearance-none rounded-full border border-zinc-200/70 bg-zinc-50 pl-3 pr-9 text-xs font-medium text-zinc-600 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)] outline-none focus:border-zinc-300"
            >
              <option value="recent">Recently active</option>
              <option value="name">Name</option>
              <option value="chats">Most chats</option>
              <option value="booked">Most booked</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" strokeWidth={1.8} />
          </div>
          <button
            type="button"
            onClick={() => setShowCreate((current) => !current)}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-zinc-950 px-3 text-xs font-medium text-white hover:bg-zinc-800"
          >
            <Plus className="size-3.5" strokeWidth={1.8} />
            Create bot
          </button>
        </div>
      </div>

      {showCreate && (
        <form onSubmit={createAgent} className="mb-4 rounded-md border border-zinc-200 bg-white p-4 shadow-[0_10px_30px_rgba(24,24,27,0.04)]">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium text-zinc-500">Bot name</span>
              <input
                value={agentName}
                onChange={(event) => setAgentName(event.target.value)}
                placeholder="Medspa appointment setter"
                className="mt-1 h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-xs font-medium text-zinc-700 outline-none focus:border-zinc-300"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-500">Client</span>
              <input
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                placeholder="Client name"
                className="mt-1 h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-xs font-medium text-zinc-700 outline-none focus:border-zinc-300"
              />
            </label>
          </div>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="block sm:w-44">
              <span className="text-xs font-medium text-zinc-500">Channel</span>
              <select
                value={channel}
                onChange={(event) => setChannel(event.target.value)}
                className="mt-1 h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-xs font-medium text-zinc-700 outline-none focus:border-zinc-300"
              >
                <option>WhatsApp</option>
                <option>SMS</option>
                <option>Instagram DM</option>
                <option>Website chat</option>
              </select>
            </label>
            <button
              type="submit"
              className="inline-flex h-9 w-fit items-center justify-center rounded-full bg-blue-600 px-4 text-xs font-medium text-white hover:bg-blue-700"
            >
              Create draft
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {visibleAgents.map((agent) => {
          const href = agent.draftOnly
            ? `/ai-sdr-agents/${agent.id}?name=${encodeURIComponent(agent.name)}&client=${encodeURIComponent(agent.client)}&channel=${encodeURIComponent(agent.channel)}`
            : `/ai-sdr-agents/${agent.id}`;
          const unread = agent.chats.reduce((sum, chat) => sum + chat.unread, 0);

          return (
            <Link
              key={agent.id}
              href={href}
              className="flex items-center justify-between gap-4 rounded-md bg-zinc-50 px-3 py-2 text-sm font-medium hover:bg-zinc-100/70"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span aria-hidden="true">🤖</span>
                <span className="truncate text-blue-700">{agent.name}</span>
              </span>
              <span className="shrink-0 text-zinc-500">
                {unread > 0 ? (
                  <span className="text-red-600">
                    {unread.toLocaleString()} {unread === 1 ? 'new reply' : 'new replies'}
                  </span>
                ) : (
                  <span>{agent.chats.length.toLocaleString()} {agent.chats.length === 1 ? 'chat' : 'chats'}</span>
                )}
              </span>
            </Link>
          );
        })}

        {visibleAgents.length === 0 && (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-md bg-zinc-50 text-center text-zinc-400">
            <Search className="size-4" strokeWidth={1.8} />
            <p className="text-sm font-medium text-zinc-500">No SDR bots match this search</p>
          </div>
        )}
      </div>
    </div>
  );
}
