import { groq } from 'next-sanity';
import { sanityClient, isSanityConfigured } from '../client';
import type { Locale } from '@/i18n/routing';

export const blogCategories = [
  { slug: 'tendances', label: { fr: 'Tendances déco', ar: 'صيحات الديكور' } },
  { slug: 'guides', label: { fr: "Guides d'achat", ar: 'أدلة الشراء' } },
  { slug: 'conseils', label: { fr: 'Conseils techniques', ar: 'نصائح تقنية' } },
  { slug: 'usine', label: { fr: "Coulisses de l'usine", ar: 'كواليس المصنع' } },
  { slug: 'projets', label: { fr: 'Projets inspirants', ar: 'مشاريع ملهمة' } },
] as const;

export type BlogCategorySlug = (typeof blogCategories)[number]['slug'];

export interface BlogPost {
  slug: string;
  title: { fr: string; ar: string };
  excerpt?: { fr: string; ar: string };
  category: BlogCategorySlug;
  cover?: { _type: 'image'; asset?: { _ref: string } };
  body?: { fr: unknown[]; ar: unknown[] };
  author?: string;
  publishedAt: string;
  featured?: boolean;
}

const postFields = `
  "slug": slug.current,
  title,
  excerpt,
  category,
  cover,
  body,
  author,
  publishedAt,
  featured
`;

const allPostsQuery = groq`*[_type == "blogPost" && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) { ${postFields} }`;
const postBySlugQuery = groq`*[_type == "blogPost" && slug.current == $slug][0] { ${postFields} }`;
const postSlugsQuery = groq`*[_type == "blogPost" && defined(slug.current)][].slug.current`;
const featuredPostsQuery = groq`*[_type == "blogPost" && featured == true && publishedAt <= now()] | order(publishedAt desc)[0...3] { ${postFields} }`;

export async function fetchAllPosts(): Promise<BlogPost[]> {
  if (!isSanityConfigured()) return [];
  try {
    return (await sanityClient.fetch<BlogPost[]>(allPostsQuery)) || [];
  } catch (e) {
    console.warn('[sanity] fetchAllPosts failed', e);
    return [];
  }
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSanityConfigured()) return null;
  try {
    return await sanityClient.fetch<BlogPost | null>(postBySlugQuery, { slug });
  } catch (e) {
    console.warn('[sanity] fetchPostBySlug failed', e);
    return null;
  }
}

export async function fetchAllPostSlugs(): Promise<string[]> {
  if (!isSanityConfigured()) return [];
  try {
    return (await sanityClient.fetch<string[]>(postSlugsQuery)) || [];
  } catch {
    return [];
  }
}

export async function fetchFeaturedPosts(): Promise<BlogPost[]> {
  if (!isSanityConfigured()) return [];
  try {
    return (await sanityClient.fetch<BlogPost[]>(featuredPostsQuery)) || [];
  } catch {
    return [];
  }
}

export function formatDate(iso: string, locale: Locale) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}
