import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/account', '/memories', '/search', '/agent-setup', '/agent-skills', '/folders', '/settings'],
    },
    sitemap: 'https://keepdb.dev/sitemap.xml',
  };
}
