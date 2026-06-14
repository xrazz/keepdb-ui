import type { MetadataRoute } from 'next';
import { useCases } from './use-cases/data';

const baseUrl = 'https://keepdb.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['/', '/docs', '/agents', '/use-cases'];
  const useCaseRoutes = useCases.map((useCase) => `/use-cases/${useCase.slug}`);

  return [...routes, ...useCaseRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route === '/use-cases' ? 0.8 : 0.7,
  }));
}
