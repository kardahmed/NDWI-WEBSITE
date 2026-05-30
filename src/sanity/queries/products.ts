import { sanityClient, isSanityConfigured, urlFor } from '../client';
import type { Product, ProductCategory, ProductBrand } from '@/lib/data/products';
import { products as fallbackProducts } from '@/lib/data/products';
import type { LocalizedString } from '@/lib/data/types';

interface SanityImage {
  _ref?: string;
  asset?: { _ref: string };
  _type?: 'image';
}

interface SanityColorVariant {
  slug: { current: string };
  name: { fr?: string; ar?: string };
  hex: string;
  image?: SanityImage;
}

interface SanityProduct {
  slug: string;
  name: string;
  category: ProductCategory;
  brand?: ProductBrand;
  collection?: string;
  shortDescription: { fr?: string; ar?: string };
  description?: { fr?: string; ar?: string };
  composition?: { fr?: string; ar?: string };
  caracteristiques?: Array<{ fr?: string; ar?: string }>;
  features?: Array<{ fr?: string; ar?: string }>;
  dimensions?: string;
  origine?: string;
  garantie?: string;
  priceFromDZD?: number;
  image: SanityImage;
  gallery?: SanityImage[];
  colorVariants?: SanityColorVariant[];
  aspectRatio: '1:1' | '4:5';
  tags?: string[];
  order?: number;
  published?: boolean;
}

const productsQuery = `*[_type == "product" && published == true] | order(category asc, order asc, name asc) {
  "slug": slug.current,
  name,
  category,
  brand,
  collection,
  shortDescription,
  description,
  composition,
  caracteristiques,
  features,
  dimensions,
  origine,
  garantie,
  priceFromDZD,
  image,
  gallery,
  colorVariants[]{
    slug,
    name,
    hex,
    image
  },
  aspectRatio,
  tags,
  order
}`;

function locStr(v: { fr?: string; ar?: string } | undefined): LocalizedString | undefined {
  if (!v) return undefined;
  return { fr: v.fr ?? '', ar: v.ar ?? v.fr ?? '' };
}

function imageUrl(img: SanityImage | undefined, width = 1400): string | undefined {
  if (!img) return undefined;
  try {
    return urlFor(img).width(width).quality(88).url();
  } catch {
    return undefined;
  }
}

function adapt(p: SanityProduct): Product {
  return {
    slug: p.slug,
    name: p.name,
    category: p.category,
    brand: p.brand ?? 'ndwi',
    collection: p.collection,
    shortDescription: locStr(p.shortDescription) ?? { fr: '', ar: '' },
    description: locStr(p.description),
    composition: locStr(p.composition),
    caracteristiques: p.caracteristiques?.map((c) => locStr(c)!).filter(Boolean),
    features: p.features?.map((f) => locStr(f)!).filter(Boolean),
    dimensions: p.dimensions,
    origine: p.origine,
    garantie: p.garantie,
    priceFromDZD: p.priceFromDZD,
    image: imageUrl(p.image, 1400) ?? '',
    gallery: p.gallery?.map((g) => imageUrl(g, 1400)).filter((u): u is string => !!u),
    colorVariants: p.colorVariants
      ?.map((cv) => {
        const name = locStr(cv.name);
        if (!cv.slug?.current || !cv.hex || !name) return null;
        return {
          slug: cv.slug.current,
          name,
          hex: cv.hex,
          image: imageUrl(cv.image, 1400),
        };
      })
      .filter((cv): cv is NonNullable<typeof cv> => !!cv),
    aspectRatio: p.aspectRatio ?? '1:1',
    tags: p.tags,
  };
}

export async function fetchAllProducts(): Promise<Product[]> {
  if (!isSanityConfigured()) return fallbackProducts;
  try {
    const res = await sanityClient.fetch<SanityProduct[]>(productsQuery);
    if (!res || res.length === 0) return fallbackProducts;
    return res.map(adapt);
  } catch (e) {
    console.warn('[sanity] fetchAllProducts failed, fallback to static data', e);
    return fallbackProducts;
  }
}

export async function fetchProductsByCategory(cat: ProductCategory): Promise<Product[]> {
  const all = await fetchAllProducts();
  return all.filter((p) => p.category === cat);
}
