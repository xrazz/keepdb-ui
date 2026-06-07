import type { Metadata } from 'next';
import './globals.css';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'KeepDB',
  description:
    'KeepDB saves plans, notes, ideas, decisions, and project context into KB folders your agents can search.',
  keywords: [
    'ai memory',
    'agent memory',
    'mcp memory',
    'knowledge base memory',
    'keepdb',
  ],
  openGraph: {
    title: 'KeepDB — Structured memory for your AI',
    description: 'Save plans, notes, ideas, decisions, and project context into KB folders agents can search.',
    url: 'https://keepdb.dev',
    siteName: 'KeepDB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KeepDB — Structured memory for your AI',
    description: 'Save plans, notes, ideas, decisions, and project context into KB folders agents can search.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://keepdb.dev',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
