'use client';

import { Bot, Database, Folder, Home, KeyRound, Search } from 'lucide-react';

export const dashboardNavItems = [
  { label: 'Overview', href: '/dashboard', icon: Home },
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Folders', href: '/folders', icon: Folder },
  { label: 'Memories', href: '/memories', icon: Database },
  { label: 'Agents', href: '/agent-skills', icon: Bot },
  { label: 'API keys', href: '/agent-setup', icon: KeyRound },
];
