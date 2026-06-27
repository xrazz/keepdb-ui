'use client';

import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOptimistic } from 'react';
import { dashboardNavItems } from './nav-items';

export function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const [optimisticPathname, setOptimisticPathname] = useOptimistic(pathname);

  const navLinkClass = (active: boolean) =>
    `flex w-full items-center gap-3 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
      active
        ? 'border-zinc-200 bg-white/80 text-zinc-950'
        : 'border-transparent text-zinc-600 hover:bg-white/70 hover:text-zinc-950'
    }`;

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col bg-zinc-50 md:flex">
      <div className="flex h-16 items-center px-5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/folder.png" alt="" width={28} height={28} className="size-7" aria-hidden="true" />
          <div className="text-lg font-medium tracking-tight">
            <span className="text-zinc-900">Keep</span>
            <span className="text-zinc-600">DB</span>
          </div>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {dashboardNavItems.map(({ label, href, emoji }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOptimisticPathname(href)}
            className={navLinkClass(optimisticPathname === href)}
          >
            <span className="w-4 shrink-0 text-center text-sm leading-none text-zinc-500">{emoji}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2 px-5 py-4">
        <UserButton />
        <p className="truncate text-xs font-medium text-zinc-500">{userEmail}</p>
      </div>
    </aside>
  );
}
