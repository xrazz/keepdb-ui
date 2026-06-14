'use client';

import { Database, Home, KeyRound, Search } from 'lucide-react';

export const dashboardNavItems = [
  { label: 'Overview', href: '/dashboard', icon: Home },
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Memories', href: '/memories', icon: Database },
  { label: 'API keys', href: '/agent-setup', icon: KeyRound },
];
