import { groq } from 'next-sanity';
import { sanityClient, isSanityConfigured, urlFor } from '../client';
import type { DoorProduct, DoorCategory, DoorBrand, DoorFinish, Thickness } from '@/lib/data/types';
import { doors as fallbackDoors, isNdwiConfigurable } from '@/lib/data/doors';

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

/** Sanity peut encore contenir les anciennes valeurs 'interieure'/'blindee'/'technique'.
 *  On les normalise vers les 2 valeurs effectives lors de l'adaptation. */
type LegacyOrNewCategory = DoorCategory | 'interieure' | 'blindee' | 'technique';

function normalizeCategory(c: LegacyOrNewCategory | undefined): DoorCategory {
  if (c === 'entree') return 'entree';
  // Toutes les autres valeurs (interieur, interieure, blindee, technique) → interieur.
  return 'interieur';
}

interface SanityDoor {
  slug: string;
  name: string;
  serie: string;
  category: LegacyOrNewCategory;
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

  // ⚠️ Images de portes masquées temporairement — en attente de nouveaux visuels.
  // Pour les ré-activer : retirer ces deux `undefined` et remettre les imageToUrl().
  const heroUrl: string | undefined = undefined;
  const configUrl: string | undefined = imageToUrl(d.configuratorImage, 1200);

  // panelClip est lié à la photo de scène (calibration manuelle) → on le récupère depuis le code local.
  const localCalibration = fallbackDoors.find((fd) => fd.slug === d.slug);

  return {
    slug: d.slug,
    name: d.name,
    serie: d.serie,
    category: normalizeCategory(d.category),
    // Brand : whitelist NDWi stricte basée sur le slug (cf. isNdwiConfigurable).
    // On ignore d.brand côté Sanity pour garantir la cohérence métier.
    brand: isNdwiConfigurable(d.slug) ? 'ndwi' : 'ndo',
    description: d.description,
    shortDescription: d.shortDescription,
    finishes: d.finishes,
    thicknesses: d.thicknesses,
    features: d.features || [],
    technicalSpecs: Object.keys(tech).length > 0 ? tech : undefined,
    heroImage: heroUrl,
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
    const sanityDoors = res.map(adapt);
    // Augmente avec les modèles présents uniquement dans le seed local (par ex.
    // AURÈS tant qu'il n'a pas été créé dans Sanity Studio). Évite que la liste
    // diverge entre le code et la prod tant que la migration manuelle n'est pas faite.
    const sanitySlugs = new Set(sanityDoors.map((d) => d.slug));
    const localOnly = fallbackDoors.filter((d) => !sanitySlugs.has(d.slug));
    return [...sanityDoors, ...localOnly];
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
  const localSlugs = fallbackDoors.map((d) => d.slug);
  if (!isSanityConfigured()) return localSlugs;
  try {
    const res = await sanityClient.fetch<string[]>(doorSlugsQuery);
    if (!res || res.length === 0) return localSlugs;
    // Union Sanity + seed local (pour que les nouveaux modèles présents
    // uniquement dans le code, type AURÈS, soient pré-rendus).
    return Array.from(new Set([...res, ...localSlugs]));
  } catch {
    return localSlugs;
  }
}
