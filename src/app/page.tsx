'use client';

import React, { useState } from 'react';
import { Show, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { WaitlistForm } from './waitlist-form';

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

      {/* NAV */}
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pb-10 pt-14 md:px-10"
      >
        <Link href="/" className="flex items-center gap-2" aria-label="KeepDB home">
          <Image src="/folder.png" alt="KeepDB" width={40} height={40} priority />
        </Link>
        <div className="flex items-center gap-6 text-base font-medium tracking-tight">
          <Link
            href="#features"
            className="font-medium underline text-gray-600 transition-colors hover:text-gray-700"
          >
            Features
          </Link>
          <Link
            href="#faq"
            className="font-medium underline text-gray-600 transition-colors hover:text-gray-700"
          >
            FAQ
          </Link>
          <Show when="signed-in">
            <Link href="/dashboard" className="text-gray-600 transition-colors hover:text-black">
              Dashboard
            </Link>
            <UserButton />
          </Show>
        </div>
      </nav>

      {/* HERO */}
      <header
        aria-labelledby="hero-heading"
        className="mx-auto w-full max-w-6xl px-6 pb-10 md:px-10 md:pb-12"
      >
        <div className="beta-shimmer mb-6 inline-flex rounded-full px-3 py-1 text-xs font-medium text-white">
          Free for first 100 users
        </div>

        <h1
          id="hero-heading"
          className="font-baskervville max-w-xl text-left text-[32px] font-medium leading-[1.28] tracking-normal text-black md:text-5xl"
        >
          Memory for agents.
          <br />
          A private DB for you.
        </h1>

        <p className="mt-7 max-w-xl text-left text-lg font-medium text-gray-600">
          Pipe in feedback, links, prompts, logs, notes, and decisions.
          <span> KeepDB turns messy context into searchable folders.</span>
        </p>

        <div className="mt-10 w-full max-w-xl">
          <WaitlistForm align="left" />
        </div>
      </header>

      <main>
        {/* FEATURES */}
        <section
          id="features"
          className="mx-auto w-full max-w-6xl px-6 pb-10 pt-4 md:px-10"
        >
          <div className="flex flex-col gap-4">

            {/* Feature 1 */}
            <div className="rounded-md border border-gray-200 p-8 md:p-10">
              <h2 className="flex items-center gap-3 text-xl font-medium leading-snug tracking-tight text-gray-900 md:whitespace-nowrap md:text-2xl">
                <Image src="/folder.png" alt="" width={24} height={24} className="hidden shrink-0 md:block" aria-hidden="true" />
                Store the context your agents need.
              </h2>
              <div className="mt-5 max-w-2xl space-y-3 text-base font-medium leading-relaxed text-gray-600">
                <p>
                  Save feedback, links, prompts, logs, notes, and decisions
                  without creating another app table or internal dashboard.
                </p>
                <p>
                  Keep every stream in its own folder, then let your tools read
                  the right memory back when it matters.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-md border border-gray-200 p-8 md:p-10">
              <h2 className="flex items-center gap-3 text-xl font-medium leading-snug tracking-tight text-gray-900 md:whitespace-nowrap md:text-2xl">
                <Image src="/folder.png" alt="" width={24} height={24} className="hidden shrink-0 md:block" aria-hidden="true" />
                Write once. Search later.
              </h2>
              <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-gray-600">
                Send one request from an app, webhook, cron job, or coding
                agent. KeepDB handles storage, chunking, indexing, and search.
              </p>
              <div className="mt-6 overflow-x-auto rounded-md border border-gray-200 p-6 md:max-w-2xl">
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
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-6xl px-6 py-20 text-center md:px-10">
          <h2 className="mx-auto max-w-2xl text-2xl font-semibold leading-snug text-gray-900 md:text-3xl">
            Give your agents memory.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base font-medium leading-relaxed text-gray-600">
            Join the private beta. Free for the first 100 builders.
          </p>
          <div className="mx-auto mt-10 w-full max-w-xl">
            <WaitlistForm />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto w-full max-w-3xl px-6 pb-24 md:px-10">
          <h2 className="mb-6 text-2xl font-medium leading-snug tracking-tight text-gray-900">
            Common questions
          </h2>
          <div className="rounded-md border border-gray-200">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={i !== faqs.length - 1 ? 'border-b border-gray-100' : ''}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left text-base font-medium text-gray-900 transition-colors hover:text-gray-600"
                >
                  {faq.question}
                  <span className="ml-4 font-mono text-gray-400">
                    {openFaq === i ? '-' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-base font-medium leading-relaxed text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-6 py-12 text-xs font-medium text-gray-400 sm:flex-row md:px-10">
        <p>© 2026 KeepDB. All rights reserved.</p>
        <nav className="flex gap-4">
          <Link href="mailto:hello@keepdb.dev" className="transition-colors hover:text-black">
            Support
          </Link>
          <Link href="#faq" className="transition-colors hover:text-black">
            FAQ
          </Link>
        </nav>
      </footer>
    </div>
  );
}
