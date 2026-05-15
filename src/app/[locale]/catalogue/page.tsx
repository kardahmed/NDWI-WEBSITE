import { setRequestLocale, getTranslations } from 'next-intl/server';
import { CatalogueHero } from '@/components/sections/catalogue-hero';
import { CatalogueComposition } from '@/components/sections/catalogue-composition';
import { CatalogueModels } from '@/components/sections/catalogue-models';
import { CatalogueFinishes } from '@/components/sections/catalogue-finishes';
import { CatalogueHandles } from '@/components/sections/catalogue-handles';
import { CatalogueHardware } from '@/components/sections/catalogue-hardware';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'catalogue' });
  return { title: t('meta.title'), description: t('meta.description') };
}

export default async function CataloguePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <CatalogueHero />
      <CatalogueComposition />
      <CatalogueModels />
      <CatalogueFinishes />
      <CatalogueHandles />
      <CatalogueHardware />
    </>
  );
}
