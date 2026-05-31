import { setRequestLocale, getTranslations } from 'next-intl/server';
import { HeroStory } from '@/components/ui/hero-story';
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
      <HeroStory
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        theme="dark"
        height="md"
        scrollCueId="map"
      />
      <section id="map" className="container-page py-12">
        <ShowroomsMapWrapper />
      </section>
      <ShowroomsList />
    </>
  );
}
