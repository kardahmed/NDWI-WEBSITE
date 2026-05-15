import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { getProAudience } from '@/lib/data/pro';
import { ProDetail } from '@/components/sections/pro-detail';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const a = getProAudience('promoteurs');
  if (!a) return {};
  return {
    title: a.title[locale as Locale],
    description: a.subtitle[locale as Locale],
  };
}

export default async function PromoteursPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const audience = getProAudience('promoteurs');
  if (!audience) notFound();
  return <ProDetail audience={audience} />;
}
