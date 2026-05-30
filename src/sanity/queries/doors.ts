import { groq } from 'next-sanity';
import { sanityClient, isSanityConfigured, urlFor } from '../client';
import type { DoorProduct, DoorCategory, DoorBrand, DoorFinish, Thickness, LocalizedString } from '@/lib/data/types';
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
  thicknessExact,
  composition,
  certifications,
  priceFromDZD,
  dimensionsRange,
  compatibleSens,
  "compatibleRevetements": compatibleRevetements[]->slug.current,
  "compatiblePoignees": compatiblePoignees[]->slug.current,
  "compatibleSerrures": compatibleSerrures[]->slug.current,
  "compatibleVitrages": compatibleVitrages[]->slug.current,
  "compatibleRemplissages": compatibleRemplissages[]->slug.current,
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
  description: LocalizedString;
  shortDescription: LocalizedString;
  finishes: DoorFinish[];
  thicknesses: Thickness[];
  features?: LocalizedString[];
  fireRating?: 'EI30' | 'EI60' | '';
  acousticDb?: number;
  securityClass?: 'RC2' | 'RC3' | 'RC4' | '';
  thicknessExact?: string;
  composition?: LocalizedString;
  certifications?: LocalizedString[];
  priceFromDZD?: number;
  dimensionsRange?: {
    largeurMin?: number;
    largeurMax?: number;
    hauteurMin?: number;
    hauteurMax?: number;
  };
  compatibleSens?: Array<'gauche' | 'droite' | 'va-et-vient' | 'coulissant'>;
  compatibleRevetements?: string[];
  compatiblePoignees?: string[];
  compatibleSerrures?: string[];
  compatibleVitrages?: string[];
  compatibleRemplissages?: string[];
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

/** Helper : true si la valeur est "vide" (undefined/null/'' / array vide / objet vide). */
function isEmpty(v: unknown): boolean {
  if (v == null) return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'string') return v.trim() === '';
  return false;
}

function adapt(d: SanityDoor): DoorProduct {
  const tech: DoorProduct['technicalSpecs'] = {};
  if (d.fireRating) tech.fireRating = d.fireRating;
  if (d.acousticDb) tech.acousticDb = d.acousticDb;
  if (d.securityClass) tech.securityClass = d.securityClass;
  if (d.thicknessExact) tech.thicknessExact = d.thicknessExact;

  // ⚠️ Images de portes masquées temporairement — en attente de nouveaux visuels.
  const heroUrl: string | undefined = undefined;
  const configUrl: string | undefined = imageToUrl(d.configuratorImage, 1200);

  const localCalibration = fallbackDoors.find((fd) => fd.slug === d.slug);

  // Sanitize dimensionsRange (au cas où certains sub-fields manqueraient).
  const dim = d.dimensionsRange;
  const dimensionsRange =
    dim && dim.largeurMin != null && dim.largeurMax != null && dim.hauteurMin != null && dim.hauteurMax != null
      ? {
          largeurMin: dim.largeurMin,
          largeurMax: dim.largeurMax,
          hauteurMin: dim.hauteurMin,
          hauteurMax: dim.hauteurMax,
        }
      : undefined;

  return {
    slug: d.slug,
    name: d.name,
    serie: d.serie,
    category: normalizeCategory(d.category),
    // Brand : whitelist NDWi stricte basée sur le slug (ignore d.brand côté Sanity).
    brand: isNdwiConfigurable(d.slug) ? 'ndwi' : 'ndo',
    description: d.description,
    shortDescription: d.shortDescription,
    finishes: d.finishes,
    thicknesses: d.thicknesses,
    features: d.features || [],
    technicalSpecs: Object.keys(tech).length > 0 ? tech : undefined,
    composition: d.composition,
    certifications: d.certifications,
    compatibleRevetements: d.compatibleRevetements,
    compatiblePoignees: d.compatiblePoignees,
    compatibleSerrures: d.compatibleSerrures,
    compatibleVitrages: d.compatibleVitrages,
    compatibleRemplissages: d.compatibleRemplissages,
    compatibleSens: d.compatibleSens?.filter(
      (s): s is 'gauche' | 'droite' => s === 'gauche' || s === 'droite'
    ),
    dimensionsRange,
    priceFromDZD: d.priceFromDZD,
    heroImage: heroUrl,
    configuratorImageUrl: configUrl,
    panelClip: localCalibration?.panelClip,
    gallery: [],
    badges: d.badges,
  };
}

/**
 * Fusionne Sanity et seed pour les 4 NDWi configurables :
 * - seed = baseline (transcription catalogue validée)
 * - Sanity gagne sur chaque champ qu'il fournit (price, composition, certifs, dims, refs options…)
 * - Si Sanity ne connaît pas la porte du tout, on prend le seed pur
 * Cette stratégie permet à l'utilisateur d'éditer ce qu'il veut depuis Studio
 * sans perdre les autres champs déjà transcrits dans le seed.
 */
function mergeNdwi(slug: string, sanityDoor: SanityDoor | null): DoorProduct | null {
  const seed = fallbackDoors.find((d) => d.slug === slug);
  if (!sanityDoor && !seed) return null;
  if (!sanityDoor) return seed ?? null;
  if (!seed) return adapt(sanityDoor);

  const sanityAdapted = adapt(sanityDoor);
  return {
    ...seed,
    // Sanity peut écraser tous les champs textuels / numériques scalaires
    name: !isEmpty(sanityAdapted.name) ? sanityAdapted.name : seed.name,
    serie: !isEmpty(sanityAdapted.serie) ? sanityAdapted.serie : seed.serie,
    category: sanityAdapted.category ?? seed.category,
    description: !isEmpty(sanityAdapted.description?.fr) ? sanityAdapted.description : seed.description,
    shortDescription: !isEmpty(sanityAdapted.shortDescription?.fr)
      ? sanityAdapted.shortDescription
      : seed.shortDescription,
    features: !isEmpty(sanityAdapted.features) ? sanityAdapted.features : seed.features,
    technicalSpecs: { ...seed.technicalSpecs, ...sanityAdapted.technicalSpecs },
    composition: sanityAdapted.composition ?? seed.composition,
    certifications: !isEmpty(sanityAdapted.certifications)
      ? sanityAdapted.certifications
      : seed.certifications,
    priceFromDZD: sanityAdapted.priceFromDZD ?? seed.priceFromDZD,
    dimensionsRange: sanityAdapted.dimensionsRange ?? seed.dimensionsRange,
    compatibleSens: !isEmpty(sanityAdapted.compatibleSens)
      ? sanityAdapted.compatibleSens
      : seed.compatibleSens,
    compatibleRevetements: !isEmpty(sanityAdapted.compatibleRevetements)
      ? sanityAdapted.compatibleRevetements
      : seed.compatibleRevetements,
    compatiblePoignees: !isEmpty(sanityAdapted.compatiblePoignees)
      ? sanityAdapted.compatiblePoignees
      : seed.compatiblePoignees,
    compatibleSerrures: !isEmpty(sanityAdapted.compatibleSerrures)
      ? sanityAdapted.compatibleSerrures
      : seed.compatibleSerrures,
    compatibleVitrages: !isEmpty(sanityAdapted.compatibleVitrages)
      ? sanityAdapted.compatibleVitrages
      : seed.compatibleVitrages,
    compatibleRemplissages: !isEmpty(sanityAdapted.compatibleRemplissages)
      ? sanityAdapted.compatibleRemplissages
      : seed.compatibleRemplissages,
    badges: !isEmpty(sanityAdapted.badges) ? sanityAdapted.badges : seed.badges,
    // Visuels : on garde la stratégie actuelle (images masquées)
    heroImage: sanityAdapted.heroImage,
    configuratorImageUrl: sanityAdapted.configuratorImageUrl,
  };
}

export async function fetchAllDoors(): Promise<DoorProduct[]> {
  if (!isSanityConfigured()) return fallbackDoors;
  try {
    const res = await sanityClient.fetch<SanityDoor[]>(doorsQuery);
    if (!res || res.length === 0) return fallbackDoors;
    // NDWi configurables → merge intelligent (Sanity > seed champ par champ).
    // NDO → adapter direct Sanity uniquement.
    const sanityDoors = res
      .map((d) => (isNdwiConfigurable(d.slug) ? mergeNdwi(d.slug, d) : adapt(d)))
      .filter((d): d is DoorProduct => d !== null);
    // Augmente avec les modèles présents uniquement dans le seed (ex. AURÈS).
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
    if (isNdwiConfigurable(slug)) {
      return mergeNdwi(slug, res);
    }
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
