'use client';

import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dashboardNavItems } from './nav-items';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/search': 'Search',
  '/folders': 'Folders',
  '/memories': 'Memories',
  '/agent-setup': 'API keys',
};

export function PageHeader({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const isFolderDetail = pathname.startsWith('/folders/');
  const title = pageTitles[pathname] ?? 'Overview';

  return (
    <header className="shrink-0 border-b border-zinc-200 px-4 md:px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 md:hidden" aria-label="KeepDB dashboard">
            <Image src="/folder.png" alt="" width={28} height={28} className="size-7" aria-hidden="true" />
          </Link>
          {isFolderDetail ? (
            <Link href="/folders" className="text-lg font-medium text-zinc-950 hover:text-blue-700">
              &lt; Folders
            </Link>
          ) : (
            <h1 className="text-lg font-medium">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden max-w-52 truncate text-xs font-medium text-zinc-500 sm:block">{userEmail}</span>
          <UserButton />
        </div>
      </div>

      <nav className="-mx-1 flex gap-1 overflow-x-auto pb-3 md:hidden" aria-label="Dashboard navigation">
        {dashboardNavItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href === '/folders' && pathname.startsWith('/folders/'));

          return (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${
                active
                  ? 'border-zinc-200 bg-zinc-50 text-zinc-950'
                  : 'border-transparent text-zinc-600'
              }`}
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
