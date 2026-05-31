import { setRequestLocale } from 'next-intl/server';
import { BrandCategoryPage } from '@/components/sections/brand-category-page';
import { brandCategories } from '@/lib/data/brands';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n/routing';
import { getLocalizedAlternates } from '@/lib/seo/alternates';

export const revalidate = 60;

export async function generateStaticParams() {
  return brandCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const L = locale as Locale;
  const cat = brandCategories.find((c) => c.slug === category);
  const suffix = { fr: 'NDO — Importation Italie premium', ar: 'NDO — استيراد إيطالي راقٍ' };
  const descSuffix = {
    fr: 'Sélection italienne importée par NDO — PAIL, ARAN, ICA.',
    ar: 'تشكيلة إيطالية مستوردة من NDO — PAIL وARAN وICA.',
  };
  return {
    title: cat ? `${cat.name[L]} ${suffix[L]}` : 'NDO',
    description: cat ? `${cat.description[L]} ${descSuffix[L]}` : '',
    alternates: getLocalizedAlternates(`/ndo/${category}`, locale),
  };
}

export default async function NdoCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  if (!brandCategories.find((c) => c.slug === category)) notFound();
  return <BrandCategoryPage brandSlug="ndo" categorySlug={category} locale={locale} />;
}
