import { notFound } from 'next/navigation';
import { getLocalizedAlternates } from '@/lib/seo/alternates';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { getProAudience } from '@/lib/data/pro';
import { ProDetail } from '@/components/sections/pro-detail';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const a = getProAudience('architectes');
  if (!a) return {};
  return {
    title: a.title[locale as Locale],
    description: a.subtitle[locale as Locale],
    alternates: getLocalizedAlternates('/pro/architectes', locale),
  };
}

export default async function ArchitectesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const audience = getProAudience('architectes');
  if (!audience) notFound();
  return <ProDetail audience={audience} />;
}
