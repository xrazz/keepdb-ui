'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Bot, Check, MessageCircle, Plus, Search, SlidersHorizontal, UsersRound } from 'lucide-react';
import type { SdrAgent, SdrAgentStatus } from '../data';

type SdrAgentsDashboardProps = {
  agents: SdrAgent[];
};

type DraftAgent = SdrAgent & {
  draftOnly?: boolean;
};

const statusClass: Record<SdrAgentStatus, string> = {
  Live: 'bg-emerald-50 text-emerald-700',
  Draft: 'bg-zinc-100 text-zinc-600',
  'Needs review': 'bg-amber-50 text-amber-700',
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
    messages: [
      {
        id: `${id}-welcome`,
        from: 'system',
        sender: 'KeepDB',
        content: 'Draft SDR agent created. Add scripts, qualification rules, objections, and booking context before launch.',
        time: 'Now',
      },
    ],
    draftOnly: true,
  };
}

function AgentCard({ agent }: { agent: DraftAgent }) {
  const href = agent.draftOnly
    ? `/ai-sdr-agents/${agent.id}?name=${encodeURIComponent(agent.name)}&client=${encodeURIComponent(agent.client)}`
    : `/ai-sdr-agents/${agent.id}`;

  return (
    <Link href={href} className="block rounded-md bg-zinc-50 p-3 hover:bg-zinc-100/70">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-950">{agent.name}</p>
          <p className="mt-1 truncate text-xs font-medium text-zinc-500">{agent.client}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${statusClass[agent.status]}`}>
          {agent.status}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 min-h-10 text-xs leading-5 text-zinc-600">{agent.goal}</p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div>
          <p className="text-[11px] font-medium text-zinc-400">Leads</p>
          <p className="mt-1 text-xs font-medium text-zinc-900">{agent.leads.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-zinc-400">Booked</p>
          <p className="mt-1 text-xs font-medium text-zinc-900">{agent.booked.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-zinc-400">Reply</p>
          <p className="mt-1 text-xs font-medium text-zinc-900">{agent.replyRate}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-200/70 pt-3">
        <span className="truncate text-xs font-medium text-blue-700">{agent.channel}</span>
        <span className="text-xs font-medium text-zinc-400">{agent.lastActive}</span>
      </div>
    </Link>
  );
}

export function SdrAgentsDashboard({ agents }: SdrAgentsDashboardProps) {
  const [query, setQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [clientName, setClientName] = useState('');
  const [channel, setChannel] = useState('WhatsApp');
  const [draftAgents, setDraftAgents] = useState<DraftAgent[]>([]);

  const allAgents = useMemo(() => [...draftAgents, ...agents], [agents, draftAgents]);
  const visibleAgents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return allAgents;

    return allAgents.filter((agent) =>
      [agent.name, agent.client, agent.channel, agent.status, agent.goal]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [allAgents, query]);

  const liveAgents = allAgents.filter((agent) => agent.status === 'Live').length;
  const booked = allAgents.reduce((sum, agent) => sum + agent.booked, 0);
  const leads = allAgents.reduce((sum, agent) => sum + agent.leads, 0);

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
    <div className="w-full max-w-5xl pb-12">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex size-9 items-center justify-center rounded-md bg-zinc-50 text-blue-600">
            <UsersRound className="size-[18px]" strokeWidth={1.8} />
          </div>
          <h2 className="text-xl font-medium tracking-tight text-zinc-950">AI SDR Agents</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Manage the sales reps your agency runs across clients. Each agent keeps its scripts, lead replies,
            objections, booking rules, and chat context in one SDR workspace.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate((current) => !current)}
          className="inline-flex h-9 w-fit items-center gap-2 rounded-full bg-zinc-950 px-3 text-xs font-medium text-white hover:bg-zinc-800"
        >
          <Plus className="size-3.5" strokeWidth={1.8} />
          Create bot
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          { label: 'Agents', value: allAgents.length.toLocaleString(), icon: Bot },
          { label: 'Live agents', value: liveAgents.toLocaleString(), icon: Check },
          { label: 'Booked from SDR', value: `${booked.toLocaleString()} / ${leads.toLocaleString()}`, icon: MessageCircle },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-md bg-zinc-50 px-3 py-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-zinc-500">{label}</p>
              <Icon className="size-3.5 text-zinc-400" strokeWidth={1.8} />
            </div>
            <p className="mt-1 truncate text-sm font-medium text-zinc-950">{value}</p>
          </div>
        ))}
      </div>

      {showCreate && (
        <form onSubmit={createAgent} className="mt-5 rounded-md border border-zinc-200 bg-white p-4 shadow-[0_10px_30px_rgba(24,24,27,0.04)]">
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_160px_auto] lg:items-end">
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
            <label className="block">
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
              className="inline-flex h-9 items-center justify-center rounded-full bg-blue-600 px-4 text-xs font-medium text-white hover:bg-blue-700"
            >
              Create draft
            </button>
          </div>
        </form>
      )}

      <div className="mt-5 flex h-9 items-center rounded-full border border-zinc-200/70 bg-zinc-50 px-3 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)]">
        <Search className="mr-2 size-3.5 text-blue-600" strokeWidth={1.8} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search agents, clients, channels..."
          className="h-full min-w-0 flex-1 bg-transparent text-xs font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
        />
        <SlidersHorizontal className="size-3.5 text-zinc-400" strokeWidth={1.8} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {visibleAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {visibleAgents.length === 0 && (
        <div className="mt-4 flex min-h-40 flex-col items-center justify-center rounded-md bg-zinc-50 text-center">
          <Search className="size-4 text-zinc-400" strokeWidth={1.8} />
          <p className="mt-2 text-sm font-medium text-zinc-500">No SDR agents match this search.</p>
        </div>
      )}
    </div>
  );
}
