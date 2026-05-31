import { setRequestLocale } from 'next-intl/server';
import { getStaticAlternates } from '@/lib/seo/alternates';
import { BrandLanding } from '@/components/sections/brand-landing';
import { getBrand } from '@/lib/data/brands';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'NDO — Importation Italie | Groupe NDWI',
  description:
    'NDO importe les signatures italiennes premium : portes PAIL, cuisines ARAN Cucine, finitions ICA. Le meilleur du design transalpin disponible en Algérie.',
    alternates: getStaticAlternates('/ndo'),
};

export default async function NdoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const brand = getBrand('ndo');
  if (!brand) notFound();
  return <BrandLanding brand={brand} />;
}
