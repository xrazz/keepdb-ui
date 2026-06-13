'use client';

import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/search': 'Search',
  '/memories': 'Memories',
  '/agent-setup': 'Agents',
};

export function PageHeader({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? 'Overview';

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 px-8">
      <h1 className="text-base font-semibold">{title}</h1>

      <div className="flex items-center gap-3">
        <span className="max-w-52 truncate text-xs font-medium text-zinc-500">{userEmail}</span>
        <UserButton />
      </div>
    </header>
  );
}
