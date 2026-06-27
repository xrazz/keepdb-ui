'use client';

import { Bot, Database, Folder, Home, KeyRound, Search, Settings } from 'lucide-react';

export const dashboardNavItems = [
  { label: 'Overview', href: '/dashboard', icon: Home, emoji: '🏠' },
  { label: 'Search', href: '/search', icon: Search, emoji: '🔎' },
  { label: 'Folders', href: '/folders', icon: Folder, emoji: '📁' },
  { label: 'Memories', href: '/memories', icon: Database, emoji: '🧠' },
  { label: 'Connect', href: '/agent-skills', icon: Bot, emoji: '🤖' },
  { label: 'API keys', href: '/agent-setup', icon: KeyRound, emoji: '🔑' },
  { label: 'Settings', href: '/settings', icon: Settings, emoji: '⚙️' },
];
