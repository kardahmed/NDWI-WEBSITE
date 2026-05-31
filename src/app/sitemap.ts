import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/lib/site';
import { fetchAllDoorSlugs } from '@/sanity/queries/doors';
import { fetchAllPostSlugs } from '@/sanity/queries/blog';
import { showrooms } from '@/lib/data/showrooms';
import { proAudiences } from '@/lib/data/pro';
import { brandCategories } from '@/lib/data/brands';

const baseUrl = siteConfig.url;

// Routes statiques (architecture brand-first depuis 2026)
const staticRoutes = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  // Brand landings
  { path: '/ndwi', priority: 0.95, changeFrequency: 'weekly' as const },
  { path: '/ndo', priority: 0.95, changeFrequency: 'weekly' as const },
  // Vue catalogue combinée (cross-brand)
  { path: '/habitat', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/habitat/portes', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/habitat/cuisines', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/habitat/chambres', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/habitat/dressing', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/habitat/bureaux', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/habitat/salons', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/habitat/hotellerie', priority: 0.8, changeFrequency: 'monthly' as const },
  // Configurateur 3D
  { path: '/configurateur/portes', priority: 0.9, changeFrequency: 'monthly' as const },
  // Autres
  { path: '/realisations', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/pro', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/showrooms', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/inspiration', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/contact', priority: 0.7, changeFrequency: 'yearly' as const },
  { path: '/carrieres', priority: 0.6, changeFrequency: 'weekly' as const },
  { path: '/legal', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // 1) Routes statiques × locales
  for (const r of staticRoutes) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${baseUrl}/${locale}${r.path}`,
        lastModified: now,
        changeFrequency: r.changeFrequency,
        priority: r.priority,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${baseUrl}/${l}${r.path}`])
          ),
        },
      });
    }
  }

  // 1bis) Sous-routes /ndwi/[category] et /ndo/[category] (brand-first)
  for (const brand of ['ndwi', 'ndo'] as const) {
    for (const cat of brandCategories) {
      for (const locale of routing.locales) {
        entries.push({
          url: `${baseUrl}/${locale}/${brand}/${cat.slug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.85,
        });
      }
    }
  }

  // 2) Pages B2B Pro (4 audiences)
  for (const a of proAudiences) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${baseUrl}/${locale}/pro/${a.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  // 3) Showrooms (ouverts uniquement)
  for (const s of showrooms.filter((x) => x.status === 'open')) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${baseUrl}/${locale}/showrooms/${s.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  // (Pas de fiche réalisation individuelle : pas de route /realisations/[slug].)

  // 5) Portes (depuis Sanity, fallback statique géré dans la query)
  const doorSlugs = await fetchAllDoorSlugs();
  for (const slug of doorSlugs) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${baseUrl}/${locale}/habitat/portes/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  // 6) Articles blog
  const postSlugs = await fetchAllPostSlugs();
  for (const slug of postSlugs) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${baseUrl}/${locale}/inspiration/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
