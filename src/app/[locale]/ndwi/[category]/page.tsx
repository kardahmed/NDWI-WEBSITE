import { setRequestLocale } from 'next-intl/server';
import { BrandCategoryPage } from '@/components/sections/brand-category-page';
import { brandCategories } from '@/lib/data/brands';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateStaticParams() {
  return brandCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { category } = await params;
  const cat = brandCategories.find((c) => c.slug === category);
  return {
    title: cat ? `${cat.name.fr} NDWi — Production locale Algérie` : 'NDWi',
    description: cat ? `${cat.description.fr} Fabrication locale à Oran par NDWi.` : '',
  };
}

export default async function NdwiCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  if (!brandCategories.find((c) => c.slug === category)) notFound();
  return <BrandCategoryPage brandSlug="ndwi" categorySlug={category} locale={locale} />;
}
