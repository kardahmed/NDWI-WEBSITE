import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import {
  fetchNdoProductBySlug,
  fetchAllNdoProductSlugs,
  NDO_CATEGORY_LABELS,
  NDO_MANUFACTURER_LABELS,
} from '@/sanity/queries/ndoProducts';
import type { Locale } from '@/i18n/routing';
import { NdoProductDetail } from '@/components/sections/ndo-product-detail';
import { siteConfig } from '@/lib/site';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await fetchAllNdoProductSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((s) => ({ locale, category: s.category, slug: s.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await fetchNdoProductBySlug(slug);
  if (!product) return {};
  const L = locale as Locale;
  return {
    title: `${product.name} — ${NDO_MANUFACTURER_LABELS[product.manufacturer]} | NDO`,
    description: product.shortDescription[L],
    openGraph: {
      title: `${product.name} — ${NDO_MANUFACTURER_LABELS[product.manufacturer]}`,
      description: product.shortDescription[L],
      images: [product.heroImageUrl],
      url: `${siteConfig.url}/${locale}/ndo/${product.category}/${product.slug}`,
    },
  };
}

export default async function NdoProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;
  setRequestLocale(locale);

  const product = await fetchNdoProductBySlug(slug);
  if (!product) notFound();
  // Vérifier que la catégorie URL correspond au produit
  if (product.category !== category) notFound();
  // Touch NDO_CATEGORY_LABELS pour s'assurer que le mapping existe (raise au build si pas)
  if (!NDO_CATEGORY_LABELS[product.category]) notFound();

  return <NdoProductDetail product={product} />;
}
