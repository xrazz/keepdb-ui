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

const featureSections = [
  {
    title: 'Tell agents exactly where to save context.',
    underline: 'decoration-orange-400',
    image: '/demo5.png',
    icon: '/titleicons/clicking.png',
  },
  {
    title: 'Use it as a quick DB for everything else.',
    underline: 'decoration-amber-400',
    image: '/quickdb.png',
    icon: '/titleicons/structure.png',
  },
  {
    title: 'Keep your data structured and searchable.',
    underline: 'decoration-sky-400',
    image: '/demo6.png',
    icon: '/titleicons/ewewewe.png',
  },
  {
    title: 'Search globally or by folder.',
    underline: 'decoration-violet-400',
    image: '/search3.png',
    icon: '/titleicons/search.png',
  },
  {
    title: 'Your private search engine.',
    underline: 'decoration-blue-400',
    image: '/dashboard-search.png',
    imageWidth: 2380,
    imageHeight: 1642,
    icon: '/titleicons/search.png',
  },
  {
    title: 'Share context between agents.',
    underline: 'decoration-emerald-400',
    image: '/share2.png',
    icon: '/titleicons/share.png',
  },
  {
    title: 'Plug into your daily workflows.',
    underline: 'decoration-rose-400',
    image: '/plug2.png',
    icon: '/titleicons/plug.png',
  },
  {
    title: 'Scope every API key by job.',
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
          Invite only · free forever for first 100 users
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
          KeepDB is structured memory that also works as a quick database.
          <span> Collect customer feedback, waitlist signups, notes, or use it as your agent memory. Everything stays organized in folders, so your data never turns into a giant mess.</span>
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
                    alt=""
                    width={feature.imageWidth ?? 2338}
                    height={feature.imageHeight ?? 1110}
                    className="mt-6 h-auto w-full border border-gray-200"
                    sizes="(min-width: 768px) 1024px, calc(100vw - 48px)"
                    aria-hidden="true"
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
