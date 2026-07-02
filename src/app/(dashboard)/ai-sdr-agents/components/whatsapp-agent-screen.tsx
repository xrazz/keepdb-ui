'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bot,
  CheckCheck,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Video,
} from 'lucide-react';
import type { SdrAgent, SdrChat, SdrMessage } from '../data';

type WhatsappAgentScreenProps = {
  agent: SdrAgent;
  chat: SdrChat;
};

const statusClass = {
  Live: 'bg-emerald-50 text-emerald-700',
  Draft: 'bg-zinc-100 text-zinc-600',
  'Needs review': 'bg-amber-50 text-amber-700',
};

function MessageBubble({ message }: { message: SdrMessage }) {
  if (message.from === 'system') {
    return (
      <div className="flex justify-center px-4">
        <div className="max-w-[78%] rounded-md bg-amber-50 px-3 py-2 text-center text-[11px] font-medium leading-5 text-amber-800">
          {message.content}
        </div>
      </div>
    );
  }

  const fromAgent = message.from === 'agent';

  return (
    <div className={`flex px-4 ${fromAgent ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[82%] rounded-lg px-3 py-2 shadow-[0_1px_1px_rgba(24,24,27,0.06)] ${
          fromAgent ? 'bg-emerald-100 text-zinc-900' : 'bg-white text-zinc-900'
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
        <div className="mt-1 flex items-center justify-end gap-1">
          <span className="text-[10px] font-medium text-zinc-400">{message.time}</span>
          {fromAgent && <CheckCheck className="size-3 text-blue-500" strokeWidth={1.8} />}
        </div>
      </div>
    </div>
  );
}

function AgentInfoPanel({ agent }: { agent: SdrAgent }) {
  return (
    <aside className="hidden w-80 shrink-0 border-l border-zinc-200 bg-white xl:block">
      <div className="border-b border-zinc-200 px-4 py-4">
        <p className="text-sm font-medium text-zinc-950">Agent setup</p>
        <p className="mt-1 text-xs leading-5 text-zinc-500">{agent.folder}</p>
      </div>

      <div className="space-y-5 p-4">
        <div>
          <p className="text-xs font-medium text-zinc-400">Goal</p>
          <p className="mt-2 text-sm leading-6 text-zinc-700">{agent.goal}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Leads', value: agent.leads.toLocaleString() },
            { label: 'Booked', value: agent.booked.toLocaleString() },
            { label: 'Reply rate', value: agent.replyRate },
            { label: 'Channel', value: agent.channel },
          ].map((item) => (
            <div key={item.label} className="rounded-md bg-zinc-50 px-3 py-2">
              <p className="text-[11px] font-medium text-zinc-400">{item.label}</p>
              <p className="mt-1 truncate text-xs font-medium text-zinc-950">{item.value}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs font-medium text-zinc-400">Knowledge folders</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {agent.knowledge.map((folder) => (
              <Link
                key={folder}
                href={`/folders/${encodeURIComponent(folder)}`}
                className="rounded-full bg-zinc-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 hover:bg-zinc-100"
              >
                {folder}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-zinc-400">Handoff rule</p>
          <p className="mt-2 text-sm leading-6 text-zinc-700">{agent.handoffRule}</p>
        </div>

        <div className="space-y-2">
          <Link
            href={`/search?q=${encodeURIComponent(agent.name)}`}
            className="flex h-9 items-center gap-2 rounded-full border border-zinc-200 px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
          >
            <Search className="size-3.5" strokeWidth={1.8} />
            Search this agent
          </Link>
          <Link
            href={`/memories?collection=${encodeURIComponent(agent.folder)}`}
            className="flex h-9 items-center gap-2 rounded-full border border-zinc-200 px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
          >
            <ShieldCheck className="size-3.5" strokeWidth={1.8} />
            Open memory folder
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function WhatsappAgentScreen({ agent, chat }: WhatsappAgentScreenProps) {
  const [messages, setMessages] = useState(chat.messages);
  const [draft, setDraft] = useState('');

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;

    setMessages((current) => [
      ...current,
      {
        id: `operator-${Date.now()}`,
        from: 'agent',
        sender: agent.name,
        content,
        time: 'Now',
      },
    ]);
    setDraft('');
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[620px] w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 shadow-[0_10px_30px_rgba(24,24,27,0.04)]">
      <section className="flex min-w-0 flex-1 flex-col bg-[#efeae2]">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-zinc-50 px-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={`/ai-sdr-agents/${agent.id}`}
              aria-label="Back to SDR chats"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-white hover:text-zinc-800"
            >
              <ArrowLeft className="size-4" strokeWidth={1.9} />
            </Link>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white">
              <Bot className="size-5" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <h2 className="truncate text-sm font-medium text-zinc-950">{chat.leadName}</h2>
                <span className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium sm:inline ${statusClass[agent.status]}`}>
                  {agent.status}
                </span>
              </div>
              <p className="truncate text-xs font-medium text-zinc-500">
                {agent.name} / {chat.source} / {chat.leadPhone}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 text-zinc-500">
            <button type="button" aria-label="Voice call" className="inline-flex size-9 items-center justify-center rounded-full hover:bg-white">
              <Phone className="size-4" strokeWidth={1.8} />
            </button>
            <button type="button" aria-label="Video call" className="inline-flex size-9 items-center justify-center rounded-full hover:bg-white">
              <Video className="size-4" strokeWidth={1.8} />
            </button>
            <button type="button" aria-label="More actions" className="inline-flex size-9 items-center justify-center rounded-full hover:bg-white">
              <MoreVertical className="size-4" strokeWidth={1.8} />
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto py-4">
          <div className="flex justify-center px-4">
            <div className="rounded-md bg-amber-50 px-3 py-2 text-center text-[11px] font-medium leading-5 text-amber-800">
              Messages are a preview workspace. Connect the agent to WhatsApp, GHL, CloseBot, or custom workflows when ready.
            </div>
          </div>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>

        <form onSubmit={sendMessage} className="flex shrink-0 items-center gap-2 border-t border-zinc-200 bg-zinc-50 px-3 py-3">
          <button
            type="button"
            aria-label="Add context"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-white"
          >
            <Plus className="size-5" strokeWidth={1.8} />
          </button>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type a test reply..."
            className="h-10 min-w-0 flex-1 rounded-full bg-white px-4 text-sm font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
          />
          <button
            type="submit"
            aria-label="Send message"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white hover:bg-emerald-800"
          >
            <Send className="size-4" strokeWidth={1.8} />
          </button>
        </form>
      </section>

      <AgentInfoPanel agent={agent} />
    </div>
  );
}
