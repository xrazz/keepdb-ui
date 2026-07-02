'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUp, CirclePlus, Search, SmilePlus } from 'lucide-react';
import type { SdrAgent, SdrChat, SdrMessage } from '../data';

function messageGroupLabel(message: SdrMessage, index: number) {
  if (message.from === 'system') return null;
  if (index === 0) return message.time;
  return null;
}

function MessageBubble({ message, index }: { message: SdrMessage; index: number }) {
  if (message.from === 'system') {
    return (
      <div className="mx-auto max-w-[82%] rounded-full border border-zinc-200/70 bg-white px-3 py-1.5 text-center text-[11px] font-medium leading-5 text-zinc-500">
        {message.content}
      </div>
    );
  }

  const fromAgent = message.from === 'agent';
  const groupLabel = messageGroupLabel(message, index);

  return (
    <div>
      {groupLabel && (
        <p className="mb-3 text-center text-[11px] font-medium text-zinc-400">{groupLabel}</p>
      )}
      <div className={`flex ${fromAgent ? 'justify-end' : 'justify-start'}`}>
        <div className={`relative max-w-[78%] rounded-[20px] px-3.5 py-2 text-sm font-medium leading-6 ${
          fromAgent
            ? 'bg-blue-500 text-white after:absolute after:bottom-0 after:right-[-4px] after:size-3 after:rounded-bl-full after:bg-blue-500'
            : 'border border-zinc-200/70 bg-white text-zinc-700 after:absolute after:bottom-0 after:left-[-4px] after:size-3 after:rounded-br-full after:border-b after:border-l after:border-zinc-200/70 after:bg-white'
        }`}>
          <p>{message.content}</p>
        </div>
      </div>
    </div>
  );
}

function ChatPane({ agent, chat }: { agent: SdrAgent; chat: SdrChat | null }) {
  const [draft, setDraft] = useState('');
  const [extraMessages, setExtraMessages] = useState<SdrMessage[]>([]);

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || !chat) return;

    setExtraMessages((current) => [
      ...current,
      {
        id: `reply-${Date.now()}`,
        from: 'agent',
        sender: agent.name,
        content,
        time: 'Now',
      },
    ]);
    setDraft('');
  }

  if (!chat) {
    return (
      <div className="flex min-h-[420px] flex-1 items-center justify-center rounded-md bg-zinc-50 text-sm font-medium text-zinc-500">
        No chats yet.
      </div>
    );
  }

  const messages = [...chat.messages, ...extraMessages];

  return (
    <section className="flex min-h-[520px] min-w-0 flex-1 flex-col overflow-hidden rounded-md border border-zinc-200/70 bg-white shadow-[0_10px_30px_rgba(24,24,27,0.03)]">
      <div className="border-b border-zinc-100 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-medium text-zinc-950">{chat.leadName}</h2>
            <p className="mt-1 truncate text-xs font-medium text-zinc-400">{chat.leadPhone}</p>
          </div>
          <Link
            href={`/ai-sdr-agents/${agent.id}/chats/${chat.id}`}
            className="shrink-0 rounded-full bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
          >
            Open
          </Link>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto bg-zinc-50/30 px-4 py-4">
        {messages.map((message, index) => (
          <MessageBubble key={message.id} message={message} index={index} />
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-zinc-100 px-3 py-3">
        <button
          type="button"
          aria-label="Add attachment"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
        >
          <CirclePlus className="size-5" strokeWidth={1.8} />
        </button>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write a reply..."
          className="h-9 min-w-0 flex-1 rounded-full border border-zinc-200/70 bg-zinc-50 px-3 text-xs font-medium text-zinc-700 outline-none placeholder:text-zinc-400 focus:border-zinc-300"
        />
        <button
          type="button"
          aria-label="Add emoji"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
        >
          <SmilePlus className="size-5" strokeWidth={1.8} />
        </button>
        <button
          type="submit"
          aria-label="Send reply"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600"
        >
          <ArrowUp className="size-4" strokeWidth={2.2} />
        </button>
      </form>
    </section>
  );
}

export function SdrChatList({ agent }: { agent: SdrAgent }) {
  const [query, setQuery] = useState('');
  const [selectedChatId, setSelectedChatId] = useState(agent.chats[0]?.id || '');

  const visibleChats = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return agent.chats;

    return agent.chats.filter((chat) =>
      [chat.leadName, chat.leadPhone, chat.lastMessage].join(' ').toLowerCase().includes(normalizedQuery)
    );
  }, [agent.chats, query]);

  const selectedChat =
    agent.chats.find((chat) => chat.id === selectedChatId) ||
    visibleChats[0] ||
    null;

  return (
    <div className="flex w-full max-w-5xl flex-col gap-4 pb-12 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-80">
        <label className="mb-3 flex h-9 w-full items-center rounded-full border border-zinc-200/70 bg-zinc-50 px-3 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)]">
          <Search className="mr-2 size-3.5 text-blue-600" strokeWidth={1.8} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search chats"
            className="h-full min-w-0 flex-1 bg-transparent text-xs font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
          />
        </label>

        <div className="space-y-2">
          {visibleChats.map((chat) => {
            const active = selectedChat?.id === chat.id;

            return (
              <button
                key={chat.id}
                type="button"
                onClick={() => setSelectedChatId(chat.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm font-medium ${
                  active ? 'bg-zinc-100' : 'bg-zinc-50 hover:bg-zinc-100/70'
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-blue-700">{chat.leadName}</span>
                  <span className="mt-0.5 block truncate text-xs text-zinc-500">{chat.lastMessage}</span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-xs text-zinc-400">{chat.lastActive}</span>
                  {chat.unread > 0 && (
                    <span className="text-xs font-medium text-red-600">
                      {chat.unread}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <ChatPane agent={agent} chat={selectedChat} />
    </div>
  );
}
