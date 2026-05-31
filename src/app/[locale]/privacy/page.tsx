import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getLocalizedAlternates } from '@/lib/seo/alternates';
import { LegalDoc } from '@/components/sections/legal-doc';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: getLocalizedAlternates('/privacy', locale),
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <LegalDoc
      namespace="privacy"
      sectionKeys={['controller', 'data', 'purposes', 'retention', 'rights', 'cookies', 'security']}
    />
  );
}
