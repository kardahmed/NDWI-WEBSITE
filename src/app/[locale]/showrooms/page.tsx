import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/ui/page-header';
import { ShowroomsMapWrapper } from '@/components/sections/showrooms-map-wrapper';
import { ShowroomsList } from '@/components/sections/showrooms-list';
import { ShowroomsLd } from '@/components/seo/json-ld';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'showrooms' });
  return { title: t('meta.title'), description: t('meta.description') };
}

export default async function ShowroomsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('showrooms');

  return (
    <>
      <ShowroomsLd />
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
      <section className="container-page mb-12">
        <ShowroomsMapWrapper />
      </section>
      <ShowroomsList />
    </>
  );
}
