import { sanityClient, isSanityConfigured, urlFor } from '../client';
import type { Product, ProductCategory, ProductBrand } from '@/lib/data/products';
import { products as fallbackProducts } from '@/lib/data/products';

interface SanityProduct {
  slug: string;
  name: string;
  category: ProductCategory;
  brand?: ProductBrand;
  collection?: string;
  shortDescription: { fr?: string; ar?: string };
  description?: { fr?: string; ar?: string };
  image: { _ref: string } & Record<string, unknown>;
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
  image,
  aspectRatio,
  tags,
  order
}`;

export async function fetchAllProducts(): Promise<Product[]> {
  if (!isSanityConfigured()) return fallbackProducts;
  try {
    const res = await sanityClient.fetch<SanityProduct[]>(productsQuery);
    if (!res || res.length === 0) return fallbackProducts;
    return res.map<Product>((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      brand: p.brand ?? 'ndwi',
      collection: p.collection,
      shortDescription: {
        fr: p.shortDescription?.fr ?? '',
        ar: p.shortDescription?.ar ?? p.shortDescription?.fr ?? '',
      },
      description: p.description
        ? {
            fr: p.description.fr ?? '',
            ar: p.description.ar ?? p.description.fr ?? '',
          }
        : undefined,
      image: urlFor(p.image).width(1400).quality(88).url(),
      aspectRatio: p.aspectRatio ?? '1:1',
      tags: p.tags,
    }));
  } catch (e) {
    console.warn('[sanity] fetchAllProducts failed, fallback to static data', e);
    return fallbackProducts;
  }
}

export async function fetchProductsByCategory(cat: ProductCategory): Promise<Product[]> {
  const all = await fetchAllProducts();
  return all.filter((p) => p.category === cat);
}
