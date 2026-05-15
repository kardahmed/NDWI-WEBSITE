import { groq } from 'next-sanity';
import { sanityClient, isSanityConfigured, urlFor } from '../client';
import type { DoorProduct, DoorCategory, DoorBrand, DoorFinish, Thickness } from '@/lib/data/types';
import { doors as fallbackDoors } from '@/lib/data/doors';

// Champs commun aux requêtes "porte"
const doorFields = `
  "slug": slug.current,
  name,
  serie,
  category,
  brand,
  description,
  shortDescription,
  finishes,
  thicknesses,
  features,
  fireRating,
  acousticDb,
  securityClass,
  heroImage,
  configuratorImage,
  gallery,
  badges,
  order
`;

const doorsQuery = groq`*[_type == "door"] | order(order asc, name asc) { ${doorFields} }`;
const doorBySlugQuery = groq`*[_type == "door" && slug.current == $slug][0] { ${doorFields} }`;
const doorSlugsQuery = groq`*[_type == "door" && defined(slug.current)][].slug.current`;

type SanityImage = { _type: 'image'; asset?: { _ref: string } } | undefined;

interface SanityDoor {
  slug: string;
  name: string;
  serie: string;
  category: DoorCategory;
  brand?: DoorBrand;
  description: { fr: string; ar: string };
  shortDescription: { fr: string; ar: string };
  finishes: DoorFinish[];
  thicknesses: Thickness[];
  features?: { fr: string; ar: string }[];
  fireRating?: 'EI30' | 'EI60' | '';
  acousticDb?: number;
  securityClass?: 'RC2' | 'RC3' | 'RC4' | '';
  heroImage?: SanityImage;
  configuratorImage?: SanityImage;
  gallery?: unknown[];
  badges?: ('nouveau' | 'best-seller' | 'sur-mesure')[];
  order?: number;
}

function imageToUrl(img: SanityImage, width = 1000): string | undefined {
  if (!img || !img.asset?._ref) return undefined;
  try {
    return urlFor(img).width(width).fit('max').auto('format').url();
  } catch {
    return undefined;
  }
}

function adapt(d: SanityDoor): DoorProduct {
  const tech: DoorProduct['technicalSpecs'] = {};
  if (d.fireRating) tech.fireRating = d.fireRating;
  if (d.acousticDb) tech.acousticDb = d.acousticDb;
  if (d.securityClass) tech.securityClass = d.securityClass;

  const heroUrl = imageToUrl(d.heroImage, 1400);
  const configUrl = imageToUrl(d.configuratorImage, 1200) ?? heroUrl;

  // panelClip est lié à la photo de scène (calibration manuelle) → on le récupère depuis le code local.
  const localCalibration = fallbackDoors.find((fd) => fd.slug === d.slug);

  return {
    slug: d.slug,
    name: d.name,
    serie: d.serie,
    category: d.category,
    // Si Sanity n'a pas encore le champ brand, on prend celui du fallback local (souvent renseigné),
    // sinon défaut intelligent : blindée/technique = NDO (PAIL), sinon NDWi.
    brand:
      d.brand ??
      localCalibration?.brand ??
      (d.category === 'blindee' || d.category === 'technique' ? 'ndo' : 'ndwi'),
    description: d.description,
    shortDescription: d.shortDescription,
    finishes: d.finishes,
    thicknesses: d.thicknesses,
    features: d.features || [],
    technicalSpecs: Object.keys(tech).length > 0 ? tech : undefined,
    heroImage: heroUrl ?? '',
    configuratorImageUrl: configUrl,
    panelClip: localCalibration?.panelClip,
    gallery: [],
    badges: d.badges,
  };
}

export async function fetchAllDoors(): Promise<DoorProduct[]> {
  if (!isSanityConfigured()) return fallbackDoors;
  try {
    const res = await sanityClient.fetch<SanityDoor[]>(doorsQuery);
    if (!res || res.length === 0) return fallbackDoors;
    return res.map(adapt);
  } catch (e) {
    console.warn('[sanity] fetchAllDoors failed, fallback to static data', e);
    return fallbackDoors;
  }
}

export async function fetchDoorBySlug(slug: string): Promise<DoorProduct | null> {
  if (!isSanityConfigured()) {
    return fallbackDoors.find((d) => d.slug === slug) ?? null;
  }
  try {
    const res = await sanityClient.fetch<SanityDoor | null>(doorBySlugQuery, { slug });
    if (!res) return fallbackDoors.find((d) => d.slug === slug) ?? null;
    return adapt(res);
  } catch (e) {
    console.warn('[sanity] fetchDoorBySlug failed, fallback', e);
    return fallbackDoors.find((d) => d.slug === slug) ?? null;
  }
}

export async function fetchAllDoorSlugs(): Promise<string[]> {
  if (!isSanityConfigured()) return fallbackDoors.map((d) => d.slug);
  try {
    const res = await sanityClient.fetch<string[]>(doorSlugsQuery);
    if (!res || res.length === 0) return fallbackDoors.map((d) => d.slug);
    return res;
  } catch {
    return fallbackDoors.map((d) => d.slug);
  }
}
