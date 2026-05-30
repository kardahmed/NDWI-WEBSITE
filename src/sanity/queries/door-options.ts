/**
 * Queries Sanity pour les options du configurateur.
 *
 * Stratégie : on tire les options depuis Sanity Studio (où l'utilisateur
 * upload les photos), puis on FUSIONNE avec le seed local. Le seed reste
 * la source de vérité pour le contenu de base (codes catalogue, hex,
 * familles…), Sanity vient enrichir (image, description, supplément).
 *
 * Si une option existe dans Sanity (par slug), on prend ses champs Sanity
 * en priorité. Sinon on garde le seed.
 */

import { sanityClient, isSanityConfigured, urlFor } from '../client';
import {
  revetements as seedRevetements,
  poignees as seedPoignees,
  serrures as seedSerrures,
  vitrages as seedVitrages,
  remplissages as seedRemplissages,
  type DoorRevetement,
  type DoorPoignee,
  type DoorSerrure,
  type DoorVitrage,
  type DoorRemplissage,
} from '@/lib/data/door-options';
import type { LocalizedString } from '@/lib/data/types';

type SanityImage = { _ref?: string; asset?: { _ref: string }; _type?: 'image' } | undefined;

function imageUrl(img: SanityImage, width = 600): string | undefined {
  if (!img) return undefined;
  try {
    return urlFor(img).width(width).fit('max').auto('format').url();
  } catch {
    return undefined;
  }
}

function locStr(v: { fr?: string; ar?: string } | undefined): LocalizedString | undefined {
  if (!v) return undefined;
  return { fr: v.fr ?? '', ar: v.ar ?? v.fr ?? '' };
}

// ─── REVÊTEMENTS ──────────────────────────────────────────────────

interface SanityRevetement {
  slug: { current: string };
  name: string;
  code: string;
  family?: DoorRevetement['family'];
  hex: string;
  image?: SanityImage;
  priceSupplementDZD?: number;
}

export async function fetchRevetements(): Promise<DoorRevetement[]> {
  if (!isSanityConfigured()) return seedRevetements;
  try {
    const res = await sanityClient.fetch<SanityRevetement[]>(
      `*[_type == "revetement"] | order(order asc, code asc){ slug, name, code, family, hex, image, priceSupplementDZD }`
    );
    if (!res || res.length === 0) return seedRevetements;
    const map = new Map<string, DoorRevetement>(seedRevetements.map((s) => [s.slug, s]));
    for (const r of res) {
      const seed = map.get(r.slug.current);
      map.set(r.slug.current, {
        slug: r.slug.current,
        name: r.name || seed?.name || '',
        code: r.code || seed?.code || '',
        family: r.family || seed?.family || 'gris',
        hex: r.hex || seed?.hex || '#ccc',
        image: imageUrl(r.image, 800) ?? seed?.image,
        priceSupplementDZD: r.priceSupplementDZD ?? seed?.priceSupplementDZD,
      });
    }
    return Array.from(map.values());
  } catch (e) {
    console.warn('[sanity] fetchRevetements failed', e);
    return seedRevetements;
  }
}

// ─── POIGNÉES ─────────────────────────────────────────────────────

interface SanityPoignee {
  slug: { current: string };
  name: string;
  type?: DoorPoignee['type'];
  shape?: DoorPoignee['shape'];
  finition?: DoorPoignee['finition'];
  image?: SanityImage;
  description?: { fr?: string; ar?: string };
  priceSupplementDZD?: number;
}

export async function fetchPoignees(): Promise<DoorPoignee[]> {
  if (!isSanityConfigured()) return seedPoignees;
  try {
    const res = await sanityClient.fetch<SanityPoignee[]>(
      `*[_type == "poignee"] | order(order asc){ slug, name, type, shape, finition, image, description, priceSupplementDZD }`
    );
    if (!res || res.length === 0) return seedPoignees;
    const map = new Map<string, DoorPoignee>(seedPoignees.map((s) => [s.slug, s]));
    for (const p of res) {
      const seed = map.get(p.slug.current);
      map.set(p.slug.current, {
        slug: p.slug.current,
        name: p.name || seed?.name || '',
        type: p.type || seed?.type || 'porte-interieure',
        shape: p.shape || seed?.shape || 'courbe',
        finition: p.finition || seed?.finition || 'inox',
        image: imageUrl(p.image, 500) ?? seed?.image,
        description: locStr(p.description) ?? seed?.description,
        priceSupplementDZD: p.priceSupplementDZD ?? seed?.priceSupplementDZD,
      });
    }
    return Array.from(map.values());
  } catch (e) {
    console.warn('[sanity] fetchPoignees failed', e);
    return seedPoignees;
  }
}

// ─── SERRURES ─────────────────────────────────────────────────────

interface SanitySerrure {
  slug: { current: string };
  name: { fr?: string; ar?: string };
  appliesTo?: DoorSerrure['appliesTo'];
  description?: { fr?: string; ar?: string };
  image?: SanityImage;
  priceSupplementDZD?: number;
}

export async function fetchSerrures(): Promise<DoorSerrure[]> {
  if (!isSanityConfigured()) return seedSerrures;
  try {
    const res = await sanityClient.fetch<SanitySerrure[]>(
      `*[_type == "serrure"] | order(order asc){ slug, name, appliesTo, description, image, priceSupplementDZD }`
    );
    if (!res || res.length === 0) return seedSerrures;
    const map = new Map<string, DoorSerrure>(seedSerrures.map((s) => [s.slug, s]));
    for (const s of res) {
      const seed = map.get(s.slug.current);
      map.set(s.slug.current, {
        slug: s.slug.current,
        name: locStr(s.name) ?? seed?.name ?? { fr: '', ar: '' },
        appliesTo: s.appliesTo || seed?.appliesTo || ['porte-interieure'],
        description: locStr(s.description) ?? seed?.description,
        image: imageUrl(s.image, 500) ?? seed?.image,
        priceSupplementDZD: s.priceSupplementDZD ?? seed?.priceSupplementDZD,
      });
    }
    return Array.from(map.values());
  } catch (e) {
    console.warn('[sanity] fetchSerrures failed', e);
    return seedSerrures;
  }
}

// ─── VITRAGES ─────────────────────────────────────────────────────

interface SanityVitrage {
  slug: { current: string };
  name: string;
  category?: DoorVitrage['category'];
  description?: { fr?: string; ar?: string };
  image?: SanityImage;
  priceSupplementDZD?: number;
}

export async function fetchVitrages(): Promise<DoorVitrage[]> {
  if (!isSanityConfigured()) return seedVitrages;
  try {
    const res = await sanityClient.fetch<SanityVitrage[]>(
      `*[_type == "vitrage"] | order(order asc){ slug, name, category, description, image, priceSupplementDZD }`
    );
    if (!res || res.length === 0) return seedVitrages;
    const map = new Map<string, DoorVitrage>(seedVitrages.map((s) => [s.slug, s]));
    for (const v of res) {
      const seed = map.get(v.slug.current);
      map.set(v.slug.current, {
        slug: v.slug.current,
        name: v.name || seed?.name || '',
        category: v.category || seed?.category || 'plein',
        description: locStr(v.description) ?? seed?.description,
        image: imageUrl(v.image, 600) ?? seed?.image,
        priceSupplementDZD: v.priceSupplementDZD ?? seed?.priceSupplementDZD,
      });
    }
    return Array.from(map.values());
  } catch (e) {
    console.warn('[sanity] fetchVitrages failed', e);
    return seedVitrages;
  }
}

// ─── REMPLISSAGES ─────────────────────────────────────────────────

interface SanityRemplissage {
  slug: { current: string };
  name: { fr?: string; ar?: string };
  description?: { fr?: string; ar?: string };
  image?: SanityImage;
}

export async function fetchRemplissages(): Promise<DoorRemplissage[]> {
  if (!isSanityConfigured()) return seedRemplissages;
  try {
    const res = await sanityClient.fetch<SanityRemplissage[]>(
      `*[_type == "remplissage"] | order(order asc){ slug, name, description, image }`
    );
    if (!res || res.length === 0) return seedRemplissages;
    const map = new Map<string, DoorRemplissage>(seedRemplissages.map((s) => [s.slug, s]));
    for (const r of res) {
      const seed = map.get(r.slug.current);
      map.set(r.slug.current, {
        slug: r.slug.current,
        name: locStr(r.name) ?? seed?.name ?? { fr: '', ar: '' },
        description: locStr(r.description) ?? seed?.description,
        image: imageUrl(r.image, 500) ?? seed?.image,
      });
    }
    return Array.from(map.values());
  } catch (e) {
    console.warn('[sanity] fetchRemplissages failed', e);
    return seedRemplissages;
  }
}

// ─── Bundle helper ────────────────────────────────────────────────

export interface ConfiguratorOptionsBundle {
  revetements: DoorRevetement[];
  poignees: DoorPoignee[];
  serrures: DoorSerrure[];
  vitrages: DoorVitrage[];
  remplissages: DoorRemplissage[];
}

export async function fetchConfiguratorOptions(): Promise<ConfiguratorOptionsBundle> {
  const [revetements, poignees, serrures, vitrages, remplissages] = await Promise.all([
    fetchRevetements(),
    fetchPoignees(),
    fetchSerrures(),
    fetchVitrages(),
    fetchRemplissages(),
  ]);
  return { revetements, poignees, serrures, vitrages, remplissages };
}
