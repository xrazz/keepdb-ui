'use client';

import { UserButton } from '@clerk/nextjs';
import { ArrowLeft, Folder, Settings, Workflow } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dashboardNavItems } from './nav-items';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/search': 'Search',
  '/folders': 'Folders',
  '/memories': 'Memories',
  '/workflows': 'Workflows',
  '/ai-sdr-agents': 'AI SDR Agents',
  '/agent-skills': 'Connect',
  '/agent-setup': 'API keys',
  '/settings': 'Settings',
};

export function PageHeader({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const isFolderDetail = pathname.startsWith('/folders/');
  const isSdrAgentDetail = pathname.startsWith('/ai-sdr-agents/');
  const folderName = isFolderDetail
    ? decodeURIComponent(pathname.split('/').slice(2).join('/') || '').replaceAll('-', ' ')
    : '';
  const sdrAgentName = isSdrAgentDetail
    ? decodeURIComponent(pathname.split('/')[2] || '').replaceAll('-', ' ')
    : '';
  const sdrAgentId = isSdrAgentDetail ? pathname.split('/')[2] || '' : '';
  const sdrFolder = sdrAgentId ? `sdr/${decodeURIComponent(sdrAgentId)}` : '';
  const title = pageTitles[pathname] ?? 'Overview';

  return (
    <header className="shrink-0 px-4 md:px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 md:hidden" aria-label="KeepDB dashboard">
            <Image src="/folder.png" alt="" width={28} height={28} className="size-7" aria-hidden="true" />
          </Link>
          {isFolderDetail || isSdrAgentDetail ? (
            <div className="flex min-w-0 items-center gap-2">
              <Link
                href={isFolderDetail ? '/folders' : '/ai-sdr-agents'}
                aria-label={isFolderDetail ? 'Back to folders' : 'Back to AI SDR agents'}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-50 text-zinc-500 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)] hover:text-zinc-700"
              >
                <ArrowLeft className="size-5" strokeWidth={2.2} />
              </Link>
              <h1 className="min-w-0 truncate text-lg font-medium text-zinc-950">
                {isFolderDetail ? folderName : sdrAgentName}
              </h1>
            </div>
          ) : (
            <h1 className="text-lg font-medium">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isSdrAgentDetail && sdrFolder && (
            <div className="flex items-center gap-1.5">
              <Link
                href={`/folders/${encodeURIComponent(sdrFolder)}`}
                title={`Connected folder: ${sdrFolder}`}
                className="hidden h-8 max-w-44 items-center gap-1.5 rounded-full border border-zinc-200/70 bg-zinc-50 px-2.5 text-xs font-medium text-zinc-500 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)] hover:bg-zinc-100 sm:inline-flex"
              >
                <Folder className="size-3.5 text-blue-600" strokeWidth={1.8} />
                <span className="truncate">{sdrFolder}</span>
              </Link>
              <button
                type="button"
                aria-label="Open workflow"
                title="Workflow"
                className="inline-flex size-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
              >
                <Workflow className="size-4" strokeWidth={1.8} />
              </button>
              <button
                type="button"
                aria-label="Open agent settings"
                title="Settings"
                className="inline-flex size-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
              >
                <Settings className="size-4" strokeWidth={1.8} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-3 md:hidden">
            <span className="hidden max-w-52 truncate text-xs font-medium text-zinc-500 sm:block">{userEmail}</span>
            <UserButton />
          </div>
        </div>
      </div>

      <nav className="-mx-1 flex gap-1 overflow-x-auto pb-3 md:hidden" aria-label="Dashboard navigation">
        {dashboardNavItems.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href ||
            (href === '/folders' && pathname.startsWith('/folders/')) ||
            (href === '/ai-sdr-agents' && pathname.startsWith('/ai-sdr-agents/'));

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
