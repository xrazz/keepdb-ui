'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import type { SdrAgent, SdrChat, SdrMessage } from '../data';

function MessageRow({ message }: { message: SdrMessage }) {
  const fromAgent = message.from === 'agent';

  if (message.from === 'system') {
    return (
      <div className="mx-auto max-w-[82%] rounded-full border border-zinc-200/70 bg-zinc-50 px-3 py-1.5 text-center text-[11px] font-medium leading-5 text-zinc-500">
        {message.content}
      </div>
    );
  }

  return (
    <div className={`flex ${fromAgent ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[760px] rounded-[18px] px-3.5 py-2 text-sm font-medium leading-6 shadow-[0_1px_2px_rgba(24,24,27,0.04)] ${
        fromAgent ? 'rounded-br-md bg-blue-600 text-white' : 'rounded-bl-md border border-zinc-200/70 bg-white text-zinc-700'
      }`}>
        <p>{message.content}</p>
        <p className={`mt-1 text-[10px] ${fromAgent ? 'text-blue-100' : 'text-zinc-400'}`}>
          {message.sender} / {message.time}
        </p>
      </div>
    </div>
  );
}

export function SdrChatDetail({ agent, chat }: { agent: SdrAgent; chat: SdrChat }) {
  const [messages, setMessages] = useState(chat.messages);
  const [draft, setDraft] = useState('');

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;

    setMessages((current) => [
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

  return (
    <div className="flex w-full max-w-3xl flex-col pb-12">
      <Link href={`/ai-sdr-agents/${agent.id}`} className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-950">
        <ArrowLeft className="size-3.5" strokeWidth={1.8} />
        {agent.name}
      </Link>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <span aria-hidden="true">💬</span>
            <h2 className="truncate text-sm font-medium text-blue-700">{chat.leadName}</h2>
          </div>
          <p className="mt-1 truncate text-xs font-medium text-zinc-500">{chat.leadPhone}</p>
        </div>
        {chat.unread > 0 && (
          <span className="shrink-0 text-xs font-medium text-red-600">
            {chat.unread} {chat.unread === 1 ? 'new reply' : 'new replies'}
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-md border border-zinc-200/70 bg-white shadow-[0_10px_30px_rgba(24,24,27,0.03)]">
        <div className="space-y-3 bg-zinc-50/40 px-4 py-4">
          {messages.map((message) => (
            <MessageRow key={message.id} message={message} />
          ))}
        </div>
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write a reply..."
          className="h-9 min-w-0 flex-1 rounded-full border border-zinc-200/70 bg-zinc-50 px-3 text-xs font-medium text-zinc-700 outline-none placeholder:text-zinc-400 focus:border-zinc-300"
        />
        <button
          type="submit"
          aria-label="Send reply"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
        >
          <Send className="size-3.5" strokeWidth={1.8} />
        </button>
      </form>
    </div>
  );
}
