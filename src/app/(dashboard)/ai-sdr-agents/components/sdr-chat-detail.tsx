'use client';

import { useState } from 'react';
import { ArrowUp, CirclePlus, SmilePlus } from 'lucide-react';
import type { SdrAgent, SdrChat, SdrMessage } from '../data';

function messageGroupLabel(message: SdrMessage, index: number) {
  if (message.from === 'system') return null;
  if (index === 0) return message.time;
  return null;
}

function MessageRow({ message, index }: { message: SdrMessage; index: number }) {
  const fromAgent = message.from === 'agent';

  if (message.from === 'system') {
    return (
      <div className="mx-auto max-w-[82%] rounded-full border border-zinc-200/70 bg-white px-3 py-1.5 text-center text-[11px] font-medium leading-5 text-zinc-500">
        {message.content}
      </div>
    );
  }

  const groupLabel = messageGroupLabel(message, index);

  return (
    <div>
      {groupLabel && (
        <p className="mb-3 text-center text-[11px] font-medium text-zinc-400">{groupLabel}</p>
      )}
      <div className={`flex ${fromAgent ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[760px] rounded-[18px] px-3 py-1.5 text-sm font-medium leading-6 ${
          fromAgent
            ? 'rounded-br-md bg-blue-500 text-white'
            : 'rounded-bl-md bg-zinc-200 text-zinc-800'
        }`}>
          <p>{message.content}</p>
        </div>
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

      <div className="overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 shadow-[0_10px_30px_rgba(24,24,27,0.04)]">
        <div className="space-y-2 bg-zinc-50 px-4 py-4">
          {messages.map((message, index) => (
            <MessageRow key={message.id} message={message} index={index} />
          ))}
        </div>
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex items-center gap-2">
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
    </div>
  );
}
