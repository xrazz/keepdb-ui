'use client';

import React, { useState } from 'react';
import { Show, UserButton } from '@clerk/nextjs';
import { Lora } from 'next/font/google';
import Link from 'next/link';
import { WaitlistForm } from './waitlist-form';

const lora = Lora({ subsets: ['latin'], weight: ['400', '600'] });

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
    <div className="min-h-screen bg-white flex justify-center font-[family-name:var(--font-dm-sans)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full max-w-4xl bg-white border border-gray-200 flex flex-col min-h-screen">
        <div
          style={{
            backgroundImage: "url('/bs4.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <nav
            aria-label="Main navigation"
            className="w-full px-8 py-6 flex items-center justify-between"
          >
            <Link href="/" className="flex items-center gap-2" aria-label="KeepDB home">
              <div className="text-lg font-medium tracking-tight">
                <span className="text-zinc-900">Keep</span>
                <span className="text-zinc-600">DB</span>
              </div>
            </Link>
            <div className="flex items-center gap-5 text-sm font-medium tracking-tight">
              <Link href="#features" className="text-gray-600 hover:text-black transition-colors">
                Features
              </Link>
              <Link href="#faq" className="text-gray-600 hover:text-black transition-colors">
                FAQ
              </Link>
              <Show when="signed-out">
                <Link
                  href="/sign-in"
                  className="rounded-full bg-black px-3 py-1 text-xs text-white transition-colors hover:bg-gray-900"
                >
                  Sign in
                </Link>
              </Show>
              <Show when="signed-in">
                <Link href="/dashboard" className="text-gray-600 transition-colors hover:text-black">
                  Dashboard
                </Link>
                <UserButton />
              </Show>
            </div>
          </nav>

          <section
            aria-labelledby="hero-heading"
            className="w-full px-8 pt-12 md:pt-16 pb-16"
          >
            <h1
              id="hero-heading"
              className={`${lora.className} text-4xl md:text-5xl font-medium tracking-tight leading-[1.05] mb-6 text-gray-900 text-left max-w-2xl`}
            >
              Memory for your agents. A private DB for everything else.
            </h1>

            <p className="text-base md:text-lg font-medium text-gray-600 leading-relaxed mb-8 text-left max-w-2xl">
              Pipe in feedback, links, prompts, logs, notes, and decisions. KeepDB organizes it into searchable folders so your app, your dashboard, and your agents can find the right context later.
            </p>

            <div className="mb-8 w-full max-w-md [&_input]:bg-white  [&_input]:rounded-none">
              <WaitlistForm />
              <p className="mt-4 text-left text-xs font-medium text-gray-400 tracking-wide">
                Early access for indie hackers building with agents. Free during beta.
              </p>
            </div>
          </section>
        </div>

        <main className="flex-grow">
          <section id="features" className="w-full border-t border-gray-200">
            <div className="px-8 py-12 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                The database you reach for when context matters.
              </h2>

              <p className="text-base md:text-lg font-medium text-gray-600 leading-relaxed">
                Your product already creates useful context: app feedback,
                waitlist signups, support requests, saved links, prompts, logs,
                project plans, and decisions buried inside chat sessions.
              </p>

              <p className="text-base md:text-lg font-medium text-gray-600 leading-relaxed mt-4">
                KeepDB gives that context a home. It is not trying to replace
                PostgreSQL or MongoDB for payments, users, orders, or inventory.
                It is for the messy, high-signal data you want humans and agents
                to retrieve later without building a dashboard from scratch.
              </p>
            </div>

            <div className="px-8 py-12 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Pipe data in from anywhere.
              </h2>

              <p className="text-base md:text-lg font-medium text-gray-600 leading-relaxed">
                Send one request from your app, landing page, webhook, cron job,
                or coding agent. Choose a folder, pass the content, and KeepDB
                handles storage, chunking, indexing, and search.
              </p>

              <div className="mt-5 border border-gray-200 bg-gray-50 p-5 overflow-x-auto">
                <pre className="text-sm leading-relaxed font-medium">
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
                  <span className="text-red-600">type</span>:{' '}
                  <span className="text-emerald-600">&quot;feedback&quot;</span>,
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

              <p className="text-base md:text-lg font-medium text-gray-600 leading-relaxed mt-5">
                Later, ask your agent the questions you actually care about.
              </p>

              <div className="mt-5 border border-gray-200 bg-gray-50 p-5 text-base font-medium text-gray-700 space-y-3 leading-relaxed">
                <div>What are users complaining about most this week?</div>
                <div>List every SwiftUI link I saved during the build.</div>
                <div>What did we decide about pricing?</div>
              </div>
            </div>

            <div className="px-8 py-12 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Use it for the data that gets lost first.
              </h2>

              <div className="grid gap-px border border-gray-200 bg-gray-200 md:grid-cols-2">
                {[
                  ['App feedback', 'Pipe iOS or web feedback into one searchable folder.'],
                  ['Links and research', 'Save useful links mid-session and ask for them later.'],
                  ['Prompt library', 'Keep prompts, agent instructions, and versions searchable.'],
                  ['Logs and events', 'Store lightweight errors, events, and traces for later recall.'],
                  ['Session notes', 'Save decisions before a coding session disappears.'],
                  ['Shared agent memory', 'Give multiple agents the same project context.'],
                ].map(([title, body]) => (
                  <div key={title} className="bg-white p-5">
                    <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-gray-600">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-8 py-12">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                One account. Multiple folders.
              </h2>

              <p className="text-base md:text-lg font-medium text-gray-600 leading-relaxed mb-5">
                Keep feedback, logs, notes, prompts, and agent memory separated
                without creating a new backend for every little data stream.
              </p>

              <pre className="border border-gray-200 bg-gray-50 p-5 text-sm font-medium text-gray-700 overflow-x-auto leading-relaxed">
                {`app-feedback
├─ Camera crashes on iPhone 14
├─ Dark mode contrast is low
└─ Widget does not update

waitlist
├─ raj@example.com
├─ sam@example.com
└─ jane@example.com

plans
├─ Launch strategy
├─ Pricing notes
└─ Marketing ideas

prompts
├─ Onboarding email
├─ Support assistant
└─ Landing page copy

agent-memory
├─ User preferences
├─ Project context
└─ Important decisions`}
              </pre>
            </div>
          </section>

          <section className="w-full border-t border-gray-200">
            <div className="px-8 py-16 flex flex-col items-center text-center">
              <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-4">
                Stop re-explaining yourself to every new chat window.
              </h2>

              <p className="text-base md:text-lg font-medium text-gray-600 max-w-2xl mb-8 leading-relaxed">
                Join the beta and start storing the context your agents should
                already know.
              </p>

              <div className="w-full max-w-md">
                <WaitlistForm />
              </div>
            </div>
          </section>

          <section id="faq" className="w-full px-8 pb-24">
            <h2 className="text-lg font-medium text-gray-900 mb-6 text-left">
              Common Questions
            </h2>
            <div className="border border-gray-200 divide-y divide-gray-200 rounded-none">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-gray-900 text-left hover:bg-gray-50 transition-colors"
                  >
                    {faq.question}
                    <span className="ml-4 text-gray-400 font-mono">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 pt-1 text-sm text-gray-600 font-medium leading-relaxed border-t border-gray-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="w-full px-8 py-12 flex flex-col sm:flex-row justify-between items-center gap-6 text-gray-500 text-xs font-medium border-t border-gray-200">
          <p>© 2026 KeepDB. All rights reserved.</p>
          <nav className="flex gap-4">
            <Link href="mailto:hello@keepdb.dev" className="hover:text-black transition-colors">Support</Link>
            <Link href="#faq" className="hover:text-black transition-colors">FAQ</Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}
