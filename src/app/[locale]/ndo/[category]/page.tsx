import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n/routing';
import { PageHeader } from '@/components/ui/page-header';
import { NdoCatalogue } from '@/components/sections/ndo-catalogue';
import {
  fetchNdoProductsByCategory,
  NDO_CATEGORY_LABELS,
  type NdoCategory,
} from '@/sanity/queries/ndoProducts';
import { getBrand } from '@/lib/data/brands';

export const revalidate = 60;

const NDO_CATEGORIES: NdoCategory[] = ['cuisines', 'portes', 'dressing', 'sdb', 'salons', 'chambres'];

function isNdoCategory(value: string): value is NdoCategory {
  return (NDO_CATEGORIES as string[]).includes(value);
}

export async function generateStaticParams() {
  return NDO_CATEGORIES.map((c) => ({ category: c }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  if (!isNdoCategory(category)) return {};
  const L = locale as Locale;
  const catLabel = NDO_CATEGORY_LABELS[category][L];
  return {
    title: `${catLabel} NDO — Importation Italie | Groupe NDWI`,
    description:
      L === 'ar'
        ? `${catLabel} مستوردة من إيطاليا (ARAN, PAIL, ICA) عبر NDO. مجموعة فاخرة في الجزائر.`
        : `${catLabel} importés d'Italie (ARAN, PAIL, ICA) par NDO. Sélection premium disponible en Algérie.`,
  };
}

export default async function NdoCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  if (!isNdoCategory(category)) notFound();

  const brand = getBrand('ndo');
  if (!brand) notFound();

  const L = locale as Locale;
  const catLabel = NDO_CATEGORY_LABELS[category][L];

  const products = await fetchNdoProductsByCategory(category);

  return (
    <>
      <PageHeader
        eyebrow={`${brand.tagline[L]} · ${catLabel}`}
        title={`${catLabel} ${brand.name[L]}.`}
        subtitle={
          L === 'ar'
            ? `سلسلة ${catLabel} المستوردة من إيطاليا، اختيار بعناية من قبل خبراء NDO.`
            : `Sélection ${catLabel.toLowerCase()} importées d'Italie, curatée par les experts NDO.`
        }
      />
      <NdoCatalogue category={category} products={products} />
    </>
  );
}
