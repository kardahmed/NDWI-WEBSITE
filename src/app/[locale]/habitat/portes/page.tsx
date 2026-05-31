import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/ui/page-header';
import { DoorsCatalogue } from '@/components/sections/doors-catalogue';
import { ConfiguratorTeaser } from '@/components/sections/configurator-teaser';
import { fetchAllDoors } from '@/sanity/queries/doors';
import { getLocalizedAlternates } from '@/lib/seo/alternates';

export const revalidate = 60; // ISR : revalide toutes les 60s (et à la demande via webhook Sanity)

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'doors' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: getLocalizedAlternates('/habitat/portes', locale),
    openGraph: { title: t('meta.title'), description: t('meta.description'), type: 'website' },
  };
}

export default async function PortesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('doors');

  const doors = await fetchAllDoors();

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
      <ConfiguratorTeaser />
      <DoorsCatalogue doors={doors} />
    </>
  );
}
