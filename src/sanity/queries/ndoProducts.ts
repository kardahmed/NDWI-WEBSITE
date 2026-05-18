import { sanityClient, isSanityConfigured, urlFor } from '../client';

export type NdoManufacturer = 'aran' | 'pail' | 'ica' | 'other';
export type NdoCategory = 'cuisines' | 'portes' | 'dressing' | 'sdb' | 'salons' | 'chambres';

export interface NdoColorOption {
  name: string;
  nameAr?: string;
  hex?: string;
  imageUrl?: string;
}

export interface NdoSpec {
  label: string;
  value: string;
}

export interface NdoProduct {
  slug: string;
  name: string;
  manufacturer: NdoManufacturer;
  category: NdoCategory;
  collection?: string;
  shortDescription: { fr: string; ar: string };
  description?: { fr: string; ar: string };
  styles?: string[];
  colors?: NdoColorOption[];
  materials?: string[];
  dimensions?: string;
  specs?: NdoSpec[];
  heroImageUrl: string;
  galleryUrls: string[];
  priceFrom?: number;
  leadTime?: string;
  inStock?: boolean;
  showroomDisplay?: boolean;
  tags?: string[];
  order?: number;
}

interface RawColor {
  name: string;
  nameAr?: string;
  hex?: string;
  image?: { _ref: string };
}

interface RawNdoProduct {
  slug: string;
  name: string;
  manufacturer: NdoManufacturer;
  category: NdoCategory;
  collection?: string;
  shortDescription?: string;
  shortDescriptionAr?: string;
  description?: string;
  descriptionAr?: string;
  styles?: string[];
  colors?: RawColor[];
  materials?: string[];
  dimensions?: string;
  specs?: NdoSpec[];
  heroImage: { _ref: string };
  gallery?: Array<{ _ref: string }>;
  priceFrom?: number;
  leadTime?: string;
  inStock?: boolean;
  showroomDisplay?: boolean;
  tags?: string[];
  order?: number;
}

const NDO_PRODUCTS_QUERY = `*[_type == "ndoProduct" && published == true] | order(category asc, order asc, name asc) {
  "slug": slug.current, name, manufacturer, category, collection,
  shortDescription, shortDescriptionAr, description, descriptionAr,
  styles, colors, materials, dimensions, specs,
  heroImage, gallery,
  priceFrom, leadTime, inStock, showroomDisplay, tags, order
}`;

const NDO_PRODUCT_BY_SLUG_QUERY = `*[_type == "ndoProduct" && slug.current == $slug][0] {
  "slug": slug.current, name, manufacturer, category, collection,
  shortDescription, shortDescriptionAr, description, descriptionAr,
  styles, colors, materials, dimensions, specs,
  heroImage, gallery,
  priceFrom, leadTime, inStock, showroomDisplay, tags, order
}`;

function mapColor(c: RawColor): NdoColorOption {
  return {
    name: c.name,
    nameAr: c.nameAr,
    hex: c.hex,
    imageUrl: c.image ? urlFor(c.image).width(800).quality(85).url() : undefined,
  };
}

function mapNdo(p: RawNdoProduct): NdoProduct {
  return {
    slug: p.slug,
    name: p.name,
    manufacturer: p.manufacturer,
    category: p.category,
    collection: p.collection,
    shortDescription: {
      fr: p.shortDescription ?? '',
      ar: p.shortDescriptionAr ?? p.shortDescription ?? '',
    },
    description: p.description
      ? { fr: p.description, ar: p.descriptionAr ?? p.description }
      : undefined,
    styles: p.styles,
    colors: p.colors?.map(mapColor),
    materials: p.materials,
    dimensions: p.dimensions,
    specs: p.specs,
    heroImageUrl: urlFor(p.heroImage).width(1600).quality(88).url(),
    galleryUrls: (p.gallery ?? []).map((g) => urlFor(g).width(1600).quality(85).url()),
    priceFrom: p.priceFrom,
    leadTime: p.leadTime,
    inStock: p.inStock,
    showroomDisplay: p.showroomDisplay,
    tags: p.tags,
    order: p.order,
  };
}

export async function fetchAllNdoProducts(): Promise<NdoProduct[]> {
  if (!isSanityConfigured()) return [];
  try {
    const res = await sanityClient.fetch<RawNdoProduct[]>(NDO_PRODUCTS_QUERY);
    if (!res) return [];
    return res.map(mapNdo);
  } catch (e) {
    console.warn('[sanity] fetchAllNdoProducts failed', e);
    return [];
  }
}

export async function fetchNdoProductsByCategory(cat: NdoCategory): Promise<NdoProduct[]> {
  const all = await fetchAllNdoProducts();
  return all.filter((p) => p.category === cat);
}

export async function fetchNdoProductBySlug(slug: string): Promise<NdoProduct | null> {
  if (!isSanityConfigured()) return null;
  try {
    const res = await sanityClient.fetch<RawNdoProduct | null>(NDO_PRODUCT_BY_SLUG_QUERY, { slug });
    return res ? mapNdo(res) : null;
  } catch (e) {
    console.warn('[sanity] fetchNdoProductBySlug failed', e);
    return null;
  }
}

export async function fetchAllNdoProductSlugs(): Promise<Array<{ slug: string; category: NdoCategory }>> {
  if (!isSanityConfigured()) return [];
  try {
    const res = await sanityClient.fetch<Array<{ slug: string; category: NdoCategory }>>(
      `*[_type == "ndoProduct" && published == true]{ "slug": slug.current, category }`
    );
    return res ?? [];
  } catch (e) {
    console.warn('[sanity] fetchAllNdoProductSlugs failed', e);
    return [];
  }
}

export const NDO_MANUFACTURER_LABELS: Record<NdoManufacturer, string> = {
  aran: 'ARAN Cucine',
  pail: 'PAIL',
  ica: 'ICA',
  other: 'Partenaire italien',
};

export const NDO_CATEGORY_LABELS: Record<NdoCategory, { fr: string; ar: string }> = {
  cuisines: { fr: 'Cuisines', ar: 'مطابخ' },
  portes: { fr: 'Portes', ar: 'أبواب' },
  dressing: { fr: 'Dressing', ar: 'خزائن' },
  sdb: { fr: 'Salle de bain', ar: 'حمامات' },
  salons: { fr: 'Salons', ar: 'صالونات' },
  chambres: { fr: 'Chambres', ar: 'غرف' },
};
