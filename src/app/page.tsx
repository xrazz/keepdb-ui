'use client';

import React, { useState } from 'react';
import { Show, UserButton } from '@clerk/nextjs';
import { Lora } from 'next/font/google';
import Link from 'next/link';
import { WaitlistForm } from './waitlist-form';

const lora = Lora({ subsets: ['latin'], weight: ['400', '700'] });

const faqs = [
  {
    question: 'What is KeepDB?',
    answer:
      'KeepDB is a small memory database for agent-era products. Pipe in feedback, links, logs, prompts, notes, and decisions, then let your app or agent search it later.',
  },
  {
    question: 'What is a folder?',
    answer:
      'A folder is a dedicated space for one kind of context. For example: app-feedback, waitlist, prompts, logs, research, or project-memory. Folders keep agent memory from turning into one giant mixed blob.',
  },
  {
    question: 'Can agents search all memory?',
    answer:
      'Yes. Agents can search a specific folder when they know where something belongs, or search across all folders when they need broader context.',
  },
  {
    question: 'What should I store in KeepDB?',
    answer:
      'Store the context you want to search later: app feedback, support tickets, waitlist emails, saved links, markdown notes, prompts, project decisions, logs, and agent memory.',
  },
  {
    question: 'Can KeepDB replace PostgreSQL, MySQL, or MongoDB?',
    answer:
      'Not completely. KeepDB is a database for context, not transactions. Store customer feedback, prompts, plans, documentation, and agent memory in KeepDB. Store orders, payments, users, inventory, and other transactional data in a traditional database. Many teams use both together.',
  },
  {
    question: 'Is KeepDB built for MCP agents?',
    answer:
      'Yes. KeepDB is designed to work through REST today and MCP-style agent workflows next, so agents can write, search, inspect, and organize memory.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'KeepDB',
  applicationCategory: 'DeveloperApplication',
  offers: [
    {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
      description: 'Join the KeepDB V1 waitlist',
    },
  ],
  description:
    'KeepDB is a private memory database for AI agents, app feedback, prompts, logs, notes, and project context.',
  url: 'https://keepdb.dev',
  image: 'https://keepdb.dev/screen.png',
};

export default function Page() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-dm-sans)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pb-10 pt-24 md:px-10 md:pt-28"
      >
        <Link href="/" className="flex items-center gap-2" aria-label="KeepDB home">
          <div className="grid size-10 place-items-center rounded-full bg-black text-sm font-medium tracking-tight text-white">
            K
          </div>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium tracking-tight">
          <Link href="#features" className="text-gray-500 transition-colors hover:text-black">
            Features
          </Link>
          <Link href="#faq" className="text-gray-500 transition-colors hover:text-black">
            FAQ
          </Link>
          <Show when="signed-in">
            <Link href="/dashboard" className="text-gray-500 transition-colors hover:text-black">
              Dashboard
            </Link>
            <UserButton />
          </Show>
        </div>
      </nav>

      <header
        aria-labelledby="hero-heading"
        className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10 md:pb-24"
      >
        <h1
          id="hero-heading"
          className={`${lora.className} max-w-3xl text-left text-5xl font-bold leading-[0.98] tracking-tight text-gray-900 md:text-7xl`}
        >
          Memory for agents.
          <br />
          A private DB for everything else.
        </h1>

        <p className="mt-8 max-w-2xl text-left text-lg font-medium leading-relaxed text-gray-500 md:text-xl">
          Pipe in feedback, links, prompts, logs, notes, and decisions.
          <span className="text-gray-800"> KeepDB turns messy context into searchable folders.</span>
        </p>

        <div className="mt-10 w-full max-w-xl [&_form]:mx-0 [&_form]:max-w-none [&_input]:rounded-full [&_input]:border-0 [&_input]:bg-gray-100 [&_button]:rounded-full">
          <WaitlistForm />
          <p className="mt-4 text-left text-xs font-medium tracking-wide text-gray-400">
            Early access for 100 indie hackers building with agents. Free during beta.
          </p>
        </div>
      </header>

      <div
        className="h-[380px] w-full bg-[url('/bs4.png')] bg-cover bg-center md:h-[520px]"
        aria-hidden="true"
      />

      <main>
        <section id="features" className="mx-auto grid w-full max-w-6xl gap-16 px-6 py-24 md:px-10">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <h2 className={`${lora.className} text-3xl font-bold leading-tight text-gray-900 md:text-5xl`}>
              The database you reach for when context matters.
            </h2>

            <div className="space-y-5 text-lg font-medium leading-relaxed text-gray-500">
              <p>
                Your product already creates useful context: app feedback,
                waitlist signups, support requests, saved links, prompts, logs,
                project plans, and decisions buried inside chat sessions.
              </p>
              <p>
                KeepDB gives that context a home. It is for the messy,
                high-signal data you want humans and agents to retrieve later
                without building a dashboard from scratch.
              </p>
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <h2 className={`${lora.className} text-3xl font-bold leading-tight text-gray-900 md:text-5xl`}>
              Pipe data in from anywhere.
            </h2>

            <div>
              <p className="text-lg font-medium leading-relaxed text-gray-500">
                Send one request from your app, landing page, webhook, cron job,
                or coding agent. Choose a folder, pass the content, and KeepDB
                handles storage, chunking, indexing, and search.
              </p>

              <div className="mt-8 overflow-x-auto bg-gray-50 p-6">
                <pre className="text-sm font-medium leading-relaxed">
                  <span className="text-purple-600">await</span>{' '}
                  <span className="text-blue-600">fetch</span>(
                  <span className="text-emerald-600">
                    &quot;https://api.keepdb.dev/memory&quot;
                  </span>
                  , {'{'}
                  {'\n  '}
                  <span className="text-red-600">method</span>:{' '}
                  <span className="text-emerald-600">&quot;POST&quot;</span>,
                  {'\n  '}
                  <span className="text-red-600">headers</span>: {'{'}
                  {'\n    '}
                  <span className="text-red-600">Authorization</span>:{' '}
                  <span className="text-emerald-600">&quot;Bearer keep_sk_...&quot;</span>
                  {'\n  '}
                  {'}'},
                  {'\n  '}
                  <span className="text-red-600">body</span>:{' '}
                  <span className="text-blue-600">JSON.stringify</span>({'{'}
                  {'\n    '}
                  <span className="text-red-600">collection</span>:{' '}
                  <span className="text-emerald-600">&quot;app-feedback&quot;</span>,
                  {'\n    '}
                  <span className="text-red-600">content</span>:{' '}
                  <span className="text-emerald-600">
                    &quot;Camera crashes on iPhone 14&quot;
                  </span>
                  {'\n  '}
                  {'}'})
                  {'\n'}
                  {'}'})
                </pre>
              </div>
            </div>
          </div>

          <div>
            <h2 className={`${lora.className} max-w-2xl text-3xl font-bold leading-tight text-gray-900 md:text-5xl`}>
              Use it for the data that gets lost first.
            </h2>

            <div className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-3">
              {[
                ['App feedback', 'Pipe iOS or web feedback into one searchable folder.'],
                ['Links and research', 'Save useful links mid-session and ask for them later.'],
                ['Prompt library', 'Keep prompts, agent instructions, and versions searchable.'],
                ['Logs and events', 'Store lightweight errors, events, and traces for later recall.'],
                ['Session notes', 'Save decisions before a coding session disappears.'],
                ['Shared agent memory', 'Give multiple agents the same project context.'],
              ].map(([title, body]) => (
                <div key={title}>
                  <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-gray-500">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <h2 className={`${lora.className} text-3xl font-bold leading-tight text-gray-900 md:text-5xl`}>
              One account.
              <br />
              Multiple folders.
            </h2>

            <pre className="overflow-x-auto bg-gray-50 p-6 text-sm font-medium leading-relaxed text-gray-600">
              {`app-feedback
  Camera crashes on iPhone 14
  Dark mode contrast is low
  Widget does not update

waitlist
  raj@example.com
  sam@example.com
  jane@example.com

prompts
  Onboarding email
  Support assistant
  Landing page copy

agent-memory
  User preferences
  Project context
  Important decisions`}
            </pre>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-24 pt-8 text-center md:px-10">
          <h2 className={`${lora.className} mx-auto max-w-3xl text-4xl font-bold leading-tight text-gray-900 md:text-6xl`}>
            Stop re-explaining yourself to every new chat window.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-gray-500">
            Join the beta and start storing the context your agents should
            already know.
          </p>

          <div className="mx-auto mt-10 w-full max-w-xl [&_form]:max-w-none [&_input]:rounded-full [&_input]:border-0 [&_input]:bg-gray-100 [&_button]:rounded-full">
            <WaitlistForm />
          </div>
        </section>

        <section id="faq" className="mx-auto w-full max-w-3xl px-6 pb-24 md:px-10">
          <h2 className={`${lora.className} mb-8 text-3xl font-bold leading-tight text-gray-900`}>
            Common questions
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-gray-900 transition-colors hover:text-gray-500"
                >
                  {faq.question}
                  <span className="ml-4 font-mono text-gray-400">{openFaq === i ? '-' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="pb-5 text-sm font-medium leading-relaxed text-gray-500">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-6 py-12 text-xs font-medium text-gray-400 sm:flex-row md:px-10">
        <p>© 2026 KeepDB. All rights reserved.</p>
        <nav className="flex gap-4">
          <Link href="mailto:hello@keepdb.dev" className="transition-colors hover:text-black">Support</Link>
          <Link href="#faq" className="transition-colors hover:text-black">FAQ</Link>
        </nav>
      </footer>
    </div>
  );
}
