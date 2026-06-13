import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import './globals.css';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

const clerkAppearance = {
  elements: {
    card: 'border border-zinc-200 shadow-none',
    cardBox: 'border border-zinc-200 shadow-none',
    modalContent: 'shadow-none',
    footerAction: 'hidden',
    footerActionText: 'hidden',
    footerActionLink: 'hidden',
    logoBox: 'hidden',
  },
};

const clerkLocalization = {
  formButtonPrimary__continue: 'Continue',
  signIn: {
    start: {
      title: 'Continue to KeepDB',
      subtitle: '',
      titleCombined: 'Continue to KeepDB',
      subtitleCombined: '',
      actionText: '',
      actionLink: '',
    },
    emailCode: {
      title: 'Check your email',
      subtitle: 'Enter the code we sent to continue.',
      formTitle: 'Verification code',
      resendButton: "Didn't get a code? Resend",
    },
  },
  signUp: {
    start: {
      title: 'Continue to KeepDB',
      subtitle: '',
      titleCombined: 'Continue to KeepDB',
      subtitleCombined: '',
      actionText: '',
      actionLink: '',
    },
    emailCode: {
      title: 'Check your email',
      subtitle: 'Enter the code we sent to continue.',
      formTitle: 'Verification code',
      formSubtitle: '',
      resendButton: "Didn't get a code? Resend",
    },
  },
};

export const metadata: Metadata = {
  metadataBase: new URL('https://keepdb.dev'),
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
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${dmSans.variable} antialiased`}>
        <ClerkProvider appearance={clerkAppearance} localization={clerkLocalization}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
