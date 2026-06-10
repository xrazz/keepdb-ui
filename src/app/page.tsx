'use client';

import React, { useState } from 'react';
import { Lora } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { WaitlistForm } from './waitlist-form';

const lora = Lora({ subsets: ['latin'], weight: ['400', '600'] });

const faqs = [
  {
    question: 'What is KeepDB?',
    answer:
      'KeepDB is structured memory for AI agents and a quick database for humans. Store customer feedback, waitlist emails, prompts, plans, documentation, and project context in organized folders that both humans and agents can use.',
  },
  {
    question: 'What is a folder?',
    answer:
      'A folder is a dedicated space for related data. For example, you might have folders for feedback, waitlist, prompts, plans, documentation, or agent-memory. Keeping data separated makes it easier for both humans and agents to find the right context.',
  },
  {
    question: 'Can agents search all memory?',
    answer:
      'Yes. Agents can search a specific folder when they know where something belongs, or search across all folders when they need broader context.',
  },
  {
    question: 'What should I store in KeepDB?',
    answer:
      'Store customer feedback, waitlist emails, prompts, project plans, documentation, research, notes, decisions, and agent memory. Anything that provides useful context later is a good fit for KeepDB.',
  },
  {
    question: 'Can KeepDB replace PostgreSQL, MySQL, or MongoDB?',
    answer:
      'Not completely. KeepDB is a database for context, not transactions. Store customer feedback, prompts, plans, documentation, and agent memory in KeepDB. Store orders, payments, users, inventory, and other transactional data in a traditional database. Many teams use both together.',
  },
  {
    question: 'Is KeepDB built for MCP agents?',
    answer:
      'Yes. KeepDB provides a simple memory layer that MCP agents can write to, search, inspect, and organize using folders.',
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
    'KeepDB is structured memory for your AI agent. Save plans, notes, ideas, decisions, and project context into KB folders agents can search.',
  url: 'https://keepdb.dev',
  image: 'https://keepdb.dev/screen.png',
};

export default function Page() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-[family-name:var(--font-dm-sans)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Structural Container with vertical side borders */}
      <div className="w-full max-w-3xl bg-white border-x border-gray-200 flex flex-col min-h-screen">

        {/* Header and Hero area wrapper */}
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
            className="w-full px-8 py-6 flex items-center justify-between"
          >
            <Link href="/" className="flex items-center gap-2" aria-label="KeepDB home">
              <div className="text-lg font-bold tracking-tight">
                <span className="text-zinc-900">Keep</span>
                <span className="text-zinc-600">DB</span>
              </div>
            </Link>
            <div className="flex gap-5 text-sm font-semibold tracking-tight">
              <Link href="#features" className="text-gray-600 hover:text-black transition-colors">
                Features
              </Link>
              <Link href="#faq" className="text-gray-600 hover:text-black transition-colors">
                FAQ
              </Link>
            </div>
          </nav>

          <section
            aria-labelledby="hero-heading"
            className="w-full px-8 pt-12 md:pt-16 pb-16"
          >
            <h1
              id="hero-heading"
              className={`${lora.className} text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-6 text-gray-900 text-left max-w-2xl`}
            >
              Structured memory for AI agents. Quick database for you.
            </h1>

            <p className="text-base md:text-lg font-medium text-gray-600 leading-relaxed mb-8 text-left max-w-2xl">
              Store customer feedback and waitlist emails or any data just like you would in a normal database, alongside agent memories, prompts, and project context. Everything stays organized, so nothing gets lost or mixed together. Your agents can search and update it automatically, while you can browse and manage the same data yourself.
            </p>

            <div className="mb-8 w-full max-w-md [&_input]:bg-gray-50 [&_input]:border-gray-200 [&_input]:rounded-none">
              <WaitlistForm />
              <p className="mt-4 text-left text-xs text-gray-400 tracking-wide">
                Early access for indie hackers building with agents.
              </p>
            </div>
          </section>
        </div>

        <main className="flex-grow">
          {/* Features Section */}

          <section id="features" className="w-full border-t border-gray-200">
           <div className="px-8 py-12 border-b border-gray-200">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">
    What is KeepDB?
  </h2>

  <p className="text-base md:text-lg font-medium text-gray-600 leading-relaxed">
    Imagine customer feedback coming from your app, waitlist signups from
    your landing page, prompts used by your agents, project plans written
    by your team, and notes scattered across chats and documents. You want
    all of it searchable, organized, and easy to access later.
  </p>

  <p className="text-base md:text-lg font-medium text-gray-600 leading-relaxed mt-4">
    KeepDB gives humans and agents a shared place to store and retrieve
    that context. It is not a replacement for PostgreSQL or MongoDB.
    Instead, it is built for quick-access data like customer feedback,
    waitlist emails, prompts, documentation, notes, project plans, and
    agent memory without everything turning into one giant memory blob.
  </p>
</div>

            <div className="px-8 py-12 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                How does it work?
              </h2>

              <p className="text-base md:text-lg font-medium text-gray-600 leading-relaxed">
                Tell your agent where something belongs.
              </p>

              <div className="mt-5 border border-gray-200 bg-gray-50 p-5 text-base font-medium text-gray-700 space-y-3 leading-relaxed">
                <div>Save this launch plan under the plans folder</div>
                <div>Save these meeting notes under the product folder</div>
                <div>Save this prompt under the prompts folder</div>
              </div>


              <p className="text-base md:text-lg font-medium text-gray-600 leading-relaxed mt-5">
                Or skip the conversation entirely and send data directly from your
                app. Perfect for things like waitlist signups, customer feedback,
                support requests, feature requests, or any quick pipeline where
                setting up a full backend feels like overkill.
              </p>

              <div className="mt-5 border border-gray-200 bg-gray-50 p-5 overflow-x-auto">
                <pre className="text-sm leading-relaxed font-medium">
                  <span className="text-purple-600">await</span>{' '}
                  <span className="text-blue-600">fetch</span>(
                  <span className="text-emerald-600">
                    "https://api.keepdb.dev/memory"
                  </span>
                  , {'{'}
                  {'\n  '}
                  <span className="text-red-600">method</span>:{" "}
                  <span className="text-emerald-600">"POST"</span>,
                  {'\n  '}
                  <span className="text-red-600">headers</span>: {'{'}
                  {'\n    '}
                  <span className="text-red-600">Authorization</span>:{" "}
                  <span className="text-emerald-600">"Bearer keep_sk_..."</span>
                  {'\n  '}
                  {'}'},
                  {'\n  '}
                  <span className="text-red-600">body</span>:{" "}
                  <span className="text-blue-600">JSON.stringify</span>({'{'}
                  {'\n    '}
                  <span className="text-red-600">collection</span>:{" "}
                  <span className="text-emerald-600">"feedback"</span>,
                  {'\n    '}
                  <span className="text-red-600">content</span>:{" "}
                  <span className="text-emerald-600">
                    "Dark mode would be nice"
                  </span>
                  {'\n  '}
                  {'}'})
                  {'\n'}
                  {'}'})
                </pre>
              </div>

              <p className="text-base md:text-lg font-medium text-gray-600 leading-relaxed mt-5">
                Later, let your agent turn raw data into insights.
              </p>

              <div className="mt-5 border border-gray-200 bg-gray-50 p-5 text-base font-medium text-gray-700 space-y-3 leading-relaxed">
                <div>What features are users requesting the most?</div>
                <div>Summarize feedback from the last 7 days</div>
                <div>What was our migration plan?</div>
              </div>
            </div>

            <div className="px-8 py-12 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                One database. Multiple worlds.
              </h2>

              <p className="text-base md:text-lg font-medium text-gray-600 leading-relaxed">
                Store customer feedback in one folder, waitlist emails in another,
                project plans somewhere else, and agent memory in its own dedicated
                space. Everything stays separated, searchable, and easy to reason
                about.
              </p>

              <p className="text-base md:text-lg font-medium text-gray-600 leading-relaxed mt-4">
                The same data can be updated by your applications, searched by your
                agents, and managed by you from a single place.
              </p>
              <p className="text-base md:text-lg font-medium text-gray-600 leading-relaxed mt-4">
                Need a normal database table for customers, feedback, or waitlist signups? Use it that way. Need structured memory for your agents? Use the same system.
              </p>
            </div>

            <div className="px-8 py-12">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                One database. Multiple folders.
              </h2>


              <pre className="border border-gray-200 bg-gray-50 p-5 text-sm font-medium text-gray-700 overflow-x-auto leading-relaxed">
                {`feedback
├─ User wants dark mode
├─ Search feels slow
└─ Love the AI summaries

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
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                Ready to stop losing context?
              </h2>

              <p className="text-base md:text-lg font-medium text-gray-600 max-w-2xl mb-8 leading-relaxed">
                Keep customer data, agent memory, prompts, notes, and project
                context organized in one place that both humans and agents can use.
              </p>

              <div className="w-full max-w-md">
                <WaitlistForm />
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="w-full px-8 pb-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 text-left">
              Common Questions
            </h2>
            <div className="border border-gray-200 divide-y divide-gray-200 rounded-none">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-900 text-left hover:bg-gray-50 transition-colors"
                  >
                    {faq.question}
                    <span className="ml-4 text-gray-400 font-mono">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    /* Added font-medium here to weight the answers */
                    <div className="px-5 pb-5 pt-1 text-sm text-gray-600 font-medium leading-relaxed border-t border-gray-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Added font-medium directly to the parent footer class to scope all items inside */}
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