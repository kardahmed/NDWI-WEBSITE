import { setRequestLocale, getTranslations } from 'next-intl/server';
import { LegalDoc } from '@/components/sections/legal-doc';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });
  return { title: t('meta.title'), description: t('meta.description') };
}

export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <LegalDoc
      namespace="legal"
      sectionKeys={['publisher', 'hosting', 'ip', 'liability', 'links', 'applicableLaw']}
    />
  );
}
