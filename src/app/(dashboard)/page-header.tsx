'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/search': 'Search',
  '/memories': 'Memories',
  '/api-keys': 'API Key',
  '/agent-setup': 'Agents',
};

export function PageHeader({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? 'Overview';

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 px-8">
      <h1 className="text-base font-semibold">{title}</h1>

      {pathname === '/memories' ? (
        <Link
          href="/memories"
          className="flex h-[30px] items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-100 px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200"
        >
          <Plus className="size-3.5" />
          New memory
        </Link>
      ) : pathname === '/api-keys' ? (
        <Link
          href="/api-keys"
          className="flex h-[30px] items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-100 px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200"
        >
          <Plus className="size-3.5" />
          New key
        </Link>
      ) : (
        <div className="flex items-center gap-3">
          <span className="max-w-52 truncate text-xs font-medium text-zinc-500">{userEmail}</span>
          <Link
            href="/auth/sign-out"
            className="flex h-[30px] items-center rounded-md border border-zinc-200 bg-zinc-50 px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            Sign out
          </Link>
        </div>
      )}
    </header>
  );
}
