import { setRequestLocale } from 'next-intl/server';
import { getStaticAlternates } from '@/lib/seo/alternates';
import { BrandLanding } from '@/components/sections/brand-landing';
import { getBrand } from '@/lib/data/brands';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'NDWi — Production locale Algérie | Groupe NDWI',
  description:
    'NDWi conçoit et fabrique à Oran : portes, cuisines, dressing, chambres, bureaux, salons et mobilier hôtelier. Production locale, livraison rapide, finitions premium.',
    alternates: getStaticAlternates('/ndwi'),
};

export default async function NdwiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const brand = getBrand('ndwi');
  if (!brand) notFound();
  return <BrandLanding brand={brand} />;
}
