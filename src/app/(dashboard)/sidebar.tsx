'use client';

import { Bot, Database, Folder, Home, KeyRound, Search, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: Home },
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Memories', href: '/memories', icon: Database },
  { label: 'Collections', href: '/collections', icon: Folder },
  { label: 'API Keys', href: '/api-keys', icon: KeyRound },
  { label: 'Agents', href: '/agent-setup', icon: Bot },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  const navLinkClass = (active: boolean) =>
    `flex w-full items-center gap-3 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? 'border-zinc-200 bg-white text-zinc-950'
        : 'border-transparent text-zinc-600 hover:bg-white hover:text-zinc-950'
    }`;

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50">
      <div className="flex h-16 items-center border-b border-zinc-200 px-5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/keepdb-logo.png"
            alt="KeepDB logo"
            width={28}
            height={28}
            className="rounded-md"
            priority
          />
          <span className="text-sm font-semibold tracking-wide">KeepDB</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href} className={navLinkClass(pathname === href)}>
            <Icon className="size-4 shrink-0" strokeWidth={1.8} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-zinc-200 px-5 py-4">
        <p className="truncate text-xs font-medium text-zinc-500">{userEmail}</p>
      </div>
    </aside>
  );
}
