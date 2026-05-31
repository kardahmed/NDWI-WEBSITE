import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getLocalizedAlternates } from '@/lib/seo/alternates';
import { CareersHero } from '@/components/sections/careers-hero';
import { CareersReasons } from '@/components/sections/careers-reasons';
import { CareersJobs } from '@/components/sections/careers-jobs';
import { CareersApplication } from '@/components/sections/careers-application';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'careers' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: getLocalizedAlternates('/carrieres', locale),
  };
}

export default async function CarrieresPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <CareersHero />
      <CareersReasons />
      <CareersJobs />
      <CareersApplication />
    </>
  );
}
