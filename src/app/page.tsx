'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WaitlistForm } from './waitlist-form';

const faqs = [
  {
    question: 'What is KeepDB?',
    answer:
      'KeepDB is structured memory for your AI. It stores plans, notes, ideas, decisions, and project context in KB folders your agents can search.',
  },
  {
    question: 'What is a KB folder?',
    answer:
      'A KB folder is a named place for memory, like claude-memory, app-ideas, notes, research, launch-plan, or project-migration.',
  },
  {
    question: 'Can agents search all memory?',
    answer:
      'Yes. Agents can search one folder when the scope is clear, or search everything when they need broader context.',
  },
  {
    question: 'What should I store in KeepDB?',
    answer:
      'Store working context: merge plans, launch notes, app ideas, decisions, research, migration context, and anything your agents should remember later.',
  },
  {
    question: 'Is KeepDB built for MCP agents?',
    answer:
      'Yes. KeepDB gives MCP agents a simple memory layer they can write to, inspect, delete from, and search by folder or globally.',
  },
];

const features = [
  {
    title: 'Save to a named place',
    description:
      'Tell your agent to save memory into app-ideas, claude-memory, project-migration, research, or any KB folder you choose.',
  },
  {
    title: 'Search one folder or everything',
    description:
      'Pull up the exact plan, note, idea, or decision when you know where it lives, or search all memory when you do not.',
  },
  {
    title: 'Store memory, not just facts',
    description:
      'KeepDB is for project context agents can use later: plans, notes, ideas, decisions, research, and launch context.',
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
    'KeepDB is structured memory for your AI. Save plans, notes, ideas, decisions, and project context into KB folders agents can search.',
  url: 'https://keepdb.dev',
  image: 'https://keepdb.dev/screen.png',
};

export default function Page() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-medium font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div
        style={{
          backgroundImage: "url('/sky.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <nav
          aria-label="Main navigation"
          className="max-w-2xl mx-auto px-6 py-6 flex items-center justify-between"
        >
          <Link href="/" className="flex items-center gap-2" aria-label="KeepDB home">
            <Image
              src="/keepdb-logo.png"
              alt="KeepDB logo"
              width={56}
              height={56}
              className="rounded-md"
            />
          </Link>
          <div className="flex gap-5 text-sm font-semibold tracking-tight">
            <Link href="/docs" className="text-gray-600 hover:text-black transition-colors">
              Docs
            </Link>
            <Link href="/agents" className="text-gray-600 hover:text-black transition-colors">
              Agents
            </Link>
            <Link href="#features" className="text-gray-600 hover:text-black transition-colors">
              Features
            </Link>
          </div>
        </nav>

        <section
          aria-labelledby="hero-heading"
          className="max-w-2xl mx-auto px-6 pt-12 md:pt-16 pb-16"
        >
          <h1
            id="hero-heading"
            className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6 text-gray-900 text-center"
          >
            Structured memory for your AI
          </h1>

          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 text-center max-w-xl mx-auto">
            Save plans, notes, ideas, decisions, and project context into KB
            folders your agents can search.
          </p>

          <div className="mb-16">
            <WaitlistForm />
            <p className="mt-4 text-center text-xs text-gray-400 tracking-wide">
              Early access for indie hackers building with agents.
            </p>
          </div>
        </section>
      </div>

      <main>
        <section
          id="features"
          aria-labelledby="features-heading"
          className="max-w-2xl mx-auto px-6 pt-16 pb-16"
        >
          <h2 id="features-heading" className="text-lg font-semibold text-gray-900 mb-6 text-center">
            Built for agent memory
          </h2>
          <div className="grid gap-4">
            {features.map((f, i) => (
              <article
                key={i}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-6"
              >
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="max-w-2xl mx-auto px-6 pb-24">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">Common Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-900 text-left hover:bg-gray-50 transition-colors"
                >
                  {faq.question}
                  <span className="ml-4 text-gray-400">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="max-w-2xl mx-auto px-6 py-12 flex flex-col sm:flex-row justify-between items-center gap-6 text-gray-500 text-xs">
        <p>© 2026 KeepDB. All rights reserved.</p>
        <nav className="flex gap-4">
          <Link href="mailto:hello@keepdb.dev" className="hover:text-black">Support</Link>
          <Link href="#faq" className="hover:text-black">FAQ</Link>
        </nav>
      </footer>
    </div>
  );
}
