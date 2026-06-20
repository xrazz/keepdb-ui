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
      'KeepDB is searchable long-term memory for AI agents. Agents can save project context, decisions, prompts, links, logs, and notes into folders, then search the right memory later.',
  },
  {
    question: 'Why not just use a vector database?',
    answer:
      'Vector databases store embeddings. KeepDB gives agents a higher-level memory workflow: folders, full readable memories, hybrid search, API keys, dashboard browsing, and date filters.',
  },
  {
    question: 'Can agents search globally or inside one folder?',
    answer:
      'Yes. Agents can search across all memory when they need broad context, or search inside one folder when the task is scoped to a project, app, customer, or workflow.',
  },
  {
    question: 'What should I store in KeepDB?',
    answer:
      'Store the context your agents need later: product decisions, implementation notes, prompts, links, logs, markdown notes, research, and customer feedback.',
  },
  {
    question: 'Can KeepDB replace my app database?',
    answer:
      'No. KeepDB is memory and retrieval for context, not a transactional database. Keep users, payments, orders, and inventory in PostgreSQL or another primary database. Use KeepDB for searchable agent memory.',
  },
  {
    question: 'Is KeepDB built for agent workflows?',
    answer:
      'Yes. KeepDB works through REST today, with agent instruction files for Codex, Claude, and generic agents. MCP-style workflows can come later without changing the core memory model.',
  },
];

type FeatureSection = {
  title: string;
  description: string;
  underline: string;
  icon: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  kind?: 'scopes';
};

const featureSections: FeatureSection[] = [
  {
    title: 'Tell agents where to save working context.',
    description:
      'Your agent can save plans, implementation notes, research, links, prompts, and decisions into named folders instead of losing them in a chat transcript.',
    underline: 'decoration-orange-400',
    image: '/demo5.png',
    imageAlt: 'Agent saving a project plan into a KeepDB folder for later retrieval.',
    icon: '/titleicons/clicking.png',
  },
  {
    title: 'Retrieve the right thing months later.',
    description:
      'KeepDB focuses on retrieval, not just storage. Search project memory by meaning, keyword, folder, and date so your agent can find the exact context again.',
    underline: 'decoration-sky-400',
    image: '/dashboard-search.png',
    imageWidth: 2380,
    imageHeight: 1642,
    imageAlt: 'KeepDB search results showing relevant saved project memories with folder names and timestamps.',
    icon: '/titleicons/search.png',
  },
  {
    title: 'Keep agent memory structured in folders.',
    description:
      'Use folders like codex, claude, project-memory, customer-feedback, prompts, and logs so memory stays addressable instead of becoming one giant blob.',
    underline: 'decoration-amber-400',
    image: '/demo6.png',
    imageAlt: 'KeepDB folders organizing different kinds of agent memory and project context.',
    icon: '/titleicons/ewewewe.png',
  },
  {
    title: 'Search globally or inside one folder.',
    description:
      'Agents can search all memory for broad recall or scope retrieval to a single folder when the task has a clear project or data boundary.',
    underline: 'decoration-violet-400',
    image: '/search3.png',
    imageAlt: 'KeepDB scoped search showing global and folder-specific memory retrieval.',
    icon: '/titleicons/search.png',
  },
  {
    title: 'Share context between Codex, Claude, and your tools.',
    description:
      'Give multiple agents the same searchable project memory so each new session can pick up the decisions, constraints, and plans that already exist.',
    underline: 'decoration-emerald-400',
    image: '/share2.png',
    imageAlt: 'Multiple agents reading and writing shared KeepDB project memory.',
    icon: '/titleicons/share.png',
  },
  {
    title: 'Plug memory into your agent workflow.',
    description:
      'Use REST today with downloadable agent instructions for Codex, Claude, and generic agents. Save from code, scripts, or agent sessions.',
    underline: 'decoration-rose-400',
    image: '/plug2.png',
    imageAlt: 'KeepDB REST API and agent instructions connecting memory to developer workflows.',
    icon: '/titleicons/plug.png',
  },
  {
    title: 'Scope every API key by folder and job.',
    description:
      'Create read-only, write-only, or read-write API keys for specific folders so agents and apps only touch the memory they need.',
    underline: 'decoration-amber-400',
    kind: 'scopes',
    icon: '/titleicons/plug.png',
  },
];

const scopedKeyCards = [
  {
    name: 'Write-only API key',
    scope: 'app-feedback',
    badgeClass: 'bg-emerald-50 text-emerald-700',
    use: 'Let your app save feedback, without reading private memory back.',
  },
  {
    name: 'Read-only API key',
    scope: 'support',
    badgeClass: 'bg-sky-50 text-sky-700',
    use: 'Let a support bot answer from one folder, without changing data.',
  },
  {
    name: 'Read + write API key',
    scope: 'all folders',
    badgeClass: 'bg-violet-50 text-violet-700',
    use: 'Use for trusted agents that need to save and search memory.',
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
    'KeepDB is searchable long-term memory for AI agents. Save project context into folders, then let agents retrieve the right thing later.',
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
        {/* <div className="beta-shimmer mb-6 inline-flex rounded-full px-3 py-1 text-xs font-medium text-white">
          Invite only · free forever for first 100 users
        </div> */}

        <h1
          id="hero-heading"
          className="font-baskervville max-w-xl text-left text-[32px] font-medium leading-[1.28] tracking-normal text-black md:text-5xl"
        >
          Structured memory
          <br />
          for your AI.
        </h1>

        <p className="mt-7 max-w-xl text-left text-lg font-medium text-gray-600">
          KeepDB gives AI agents searchable long-term memory. Save decisions,
          prompts, links, logs, and project context into folders, then retrieve
          the right thing months later.
        </p>

        <div className="mt-10 w-full max-w-xl">
          <WaitlistForm align="left" />
        </div>
      </header>

      <main>
        {/* FEATURES */}
        <section
          id="features"
          className="mx-auto w-full max-w-6xl px-6 pb-10 pt-24 md:px-10"
        >
          <div className="space-y-12 md:space-y-40">
            {featureSections.map((feature) => (
              <div key={feature.title}>
                <h2
                  className={`flex items-center gap-3 whitespace-nowrap text-[15px] font-medium leading-snug tracking-tight text-gray-900 underline decoration-dotted underline-offset-4 sm:text-xl md:text-2xl ${feature.underline}`}
                >
                  <Image
                    src={feature.icon ?? '/folder.png'}
                    alt=""
                    width={30}
                    height={30}
                    className="size-5 shrink-0 sm:size-7"
                    aria-hidden="true"
                  />
                  {feature.title}
                </h2>
                <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-gray-600 md:text-lg">
                  {feature.description}
                </p>
                {feature.kind === 'scopes' ? (
                  <div className="mt-6 flex aspect-[2338/1110] w-full flex-col justify-between border border-gray-200 bg-white p-5 md:p-8">
                    <div>
                      <p className="max-w-3xl text-lg font-medium leading-relaxed text-gray-800 md:text-xl">
                        Security for the data your apps and agents touch.
                      </p>
                      <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-gray-500 md:text-lg">
                        Every API key can be limited to one folder. Create a
                        write-only key scoped to your feedback folder, and even
                        if someone gets the key, they cannot read your data
                        back. That keeps shipped apps and agents much safer.
                      </p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      {scopedKeyCards.map((card) => (
                        <div key={card.name} className="border border-gray-200 p-4">
                          <p className="text-base font-medium text-gray-900 md:text-lg">
                            {card.name}
                          </p>
                          <p
                            className={`mt-3 inline-flex px-2.5 py-1 text-sm font-medium ${card.badgeClass}`}
                          >
                            {card.scope}
                          </p>
                          <p className="mt-4 text-base font-medium leading-relaxed text-gray-500">
                            {card.use}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : feature.image ? (
                  <Image
                    src={feature.image}
                    alt={feature.imageAlt || feature.title}
                    width={feature.imageWidth ?? 2338}
                    height={feature.imageHeight ?? 1110}
                    className="mt-6 h-auto w-full border border-gray-200"
                    sizes="(min-width: 768px) 1024px, calc(100vw - 48px)"
                  />
                ) : (
                  <div
                    className="mt-6 aspect-[2338/1110] w-full border border-gray-200 bg-white"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-6xl px-6 py-20 text-center md:px-10">
          <h2 className="mx-auto max-w-2xl text-2xl font-semibold leading-snug text-gray-900 md:text-3xl">
            Give your agents searchable memory.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base font-medium leading-relaxed text-gray-600">
            Join the private beta for developers building with AI agents. Free
            for the first 100 builders.
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
          <Link href="/use-cases" className="transition-colors hover:text-black">
            Use cases
          </Link>
          <Link href="mailto:raj@keepdb.dev" className="transition-colors hover:text-black">
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
