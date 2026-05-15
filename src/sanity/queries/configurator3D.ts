import { groq } from 'next-sanity';
import { sanityClient, isSanityConfigured, urlFor } from '../client';

// ───────── Types ─────────

export interface Finition3D {
  slug: string;
  name: string;
  nameAr?: string;
  category: 'wood' | 'lacquer' | 'natural' | 'metallic' | 'laminate';
  baseColor: string; // hex
  roughness: number; // 0-1
  metallic: number; // 0-1
  woodTextureUrl?: string;
  normalMapUrl?: string;
  swatchUrl?: string;
  order: number;
}

export interface Door3DModel {
  slug: string;
  name: string;
  glbUrl: string;
  thumbnailUrl?: string;
  applicableDoorSlugs: string[];
  /** Slugs des finitions Sanity disponibles pour ce modèle. Vide = toutes. */
  availableFinitionSlugs: string[];
  panelMeshName: string;
  handleAttachMeshName?: string;
  handleAttachX: number;
  handleAttachY: number;
  scale: number;
}

export interface Handle3D {
  slug: string;
  name: string;
  nameAr?: string;
  style: 'classic' | 'curved' | 'knob' | 'pull';
  glbUrl?: string;
  thumbnailUrl?: string;
  baseColor: string;
  metallic: number;
  roughness: number;
  order: number;
}

// ───────── GROQ queries ─────────

type SanityImage = { _type: 'image'; asset?: { _ref: string } } | undefined;
type SanityFile = { _type: 'file'; asset?: { _ref: string; url?: string } } | undefined;

function imageUrl(img: SanityImage, width = 1024): string | undefined {
  if (!img?.asset?._ref) return undefined;
  try {
    return urlFor(img).width(width).fit('max').auto('format').url();
  } catch {
    return undefined;
  }
}

function fileUrl(file: SanityFile): string | undefined {
  if (!file?.asset?._ref) return undefined;
  // _ref format: file-<assetId>-<extension>
  const ref = file.asset._ref;
  const parts = ref.split('-');
  if (parts.length < 3 || parts[0] !== 'file') return undefined;
  const ext = parts.pop();
  const assetId = parts.slice(1).join('-');
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ykqpckdm';
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetId}.${ext}`;
}

// ───────── Finitions ─────────

const finitionsQuery = groq`
  *[_type == "finition" && published == true] | order(category asc, order asc) {
    "slug": slug.current, name, nameAr, category,
    baseColor, roughness, metallic,
    woodTexture, normalMap, swatch,
    order
  }
`;

interface SanityFinition {
  slug: string;
  name: string;
  nameAr?: string;
  category: Finition3D['category'];
  baseColor?: string;
  roughness?: number;
  metallic?: number;
  woodTexture?: SanityImage;
  normalMap?: SanityImage;
  swatch?: SanityImage;
  order?: number;
}

export async function fetchFinitions(): Promise<Finition3D[]> {
  if (!isSanityConfigured()) return [];
  try {
    const raw = await sanityClient.fetch<SanityFinition[]>(finitionsQuery);
    return raw.map((f) => ({
      slug: f.slug,
      name: f.name,
      nameAr: f.nameAr,
      category: f.category,
      baseColor: f.baseColor ?? '#8B6F47',
      roughness: f.roughness ?? 0.55,
      metallic: f.metallic ?? 0,
      woodTextureUrl: imageUrl(f.woodTexture, 2048),
      normalMapUrl: imageUrl(f.normalMap, 2048),
      swatchUrl: imageUrl(f.swatch, 400),
      order: f.order ?? 100,
    }));
  } catch (e) {
    console.warn('[sanity] fetchFinitions failed', e);
    return [];
  }
}

// ───────── Door 3D Models ─────────

const door3DModelsQuery = groq`
  *[_type == "door3DModel" && published == true] {
    "slug": slug.current, name,
    glbFile, thumbnail,
    "applicableDoorSlugs": applicableDoors[]->slug.current,
    "availableFinitionSlugs": availableFinitions[]->slug.current,
    panelMeshName, handleAttachMeshName,
    handleAttachX, handleAttachY, scale
  }
`;

interface SanityDoor3DModel {
  slug: string;
  name: string;
  glbFile?: SanityFile;
  thumbnail?: SanityImage;
  applicableDoorSlugs?: string[];
  availableFinitionSlugs?: string[];
  panelMeshName?: string;
  handleAttachMeshName?: string;
  handleAttachX?: number;
  handleAttachY?: number;
  scale?: number;
}

export async function fetchDoor3DModels(): Promise<Door3DModel[]> {
  if (!isSanityConfigured()) return [];
  try {
    const raw = await sanityClient.fetch<SanityDoor3DModel[]>(door3DModelsQuery);
    return raw
      .filter((m) => !!fileUrl(m.glbFile))
      .map((m) => ({
        slug: m.slug,
        name: m.name,
        glbUrl: fileUrl(m.glbFile)!,
        thumbnailUrl: imageUrl(m.thumbnail, 800),
        applicableDoorSlugs: m.applicableDoorSlugs ?? [],
        availableFinitionSlugs: m.availableFinitionSlugs ?? [],
        panelMeshName: m.panelMeshName ?? 'Mesh1',
        handleAttachMeshName: m.handleAttachMeshName,
        handleAttachX: m.handleAttachX ?? 0.35,
        handleAttachY: m.handleAttachY ?? 0.45,
        scale: m.scale ?? 1,
      }));
  } catch (e) {
    console.warn('[sanity] fetchDoor3DModels failed', e);
    return [];
  }
}

/** Trouve le Door3DModel applicable pour une porte donnée (par son slug). */
export function findModelForDoor(models: Door3DModel[], doorSlug: string): Door3DModel | undefined {
  return models.find((m) => m.applicableDoorSlugs.includes(doorSlug));
}

// ───────── Handles 3D ─────────

const handlesQuery = groq`
  *[_type == "handle3D" && published == true] | order(order asc) {
    "slug": slug.current, name, nameAr, style,
    glbFile, thumbnail,
    baseColor, metallic, roughness,
    order
  }
`;

interface SanityHandle3D {
  slug: string;
  name: string;
  nameAr?: string;
  style?: Handle3D['style'];
  glbFile?: SanityFile;
  thumbnail?: SanityImage;
  baseColor?: string;
  metallic?: number;
  roughness?: number;
  order?: number;
}

export async function fetchHandles3D(): Promise<Handle3D[]> {
  if (!isSanityConfigured()) return [];
  try {
    const raw = await sanityClient.fetch<SanityHandle3D[]>(handlesQuery);
    return raw.map((h) => ({
      slug: h.slug,
      name: h.name,
      nameAr: h.nameAr,
      style: h.style ?? 'classic',
      glbUrl: fileUrl(h.glbFile),
      thumbnailUrl: imageUrl(h.thumbnail, 400),
      baseColor: h.baseColor ?? '#C0C0C0',
      metallic: h.metallic ?? 0.9,
      roughness: h.roughness ?? 0.2,
      order: h.order ?? 100,
    }));
  } catch (e) {
    console.warn('[sanity] fetchHandles3D failed', e);
    return [];
  }
}
