import { setRequestLocale, getTranslations } from 'next-intl/server';
import { RealisationsCatalogue } from '@/components/sections/realisations-catalogue';
import { RealisationsValueProps } from '@/components/sections/realisations-value-props';
import { RealisationsMethod } from '@/components/sections/realisations-method';
import { RealisationsBeforeAfter } from '@/components/sections/realisations-before-after';
import { RealisationsProjectForm } from '@/components/sections/realisations-project-form';
import { ShowroomsTeaser } from '@/components/sections/showrooms-teaser';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'realisations' });
  return { title: t('meta.title'), description: t('meta.description') };
}

export default async function RealisationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('realisations');

  return (
    <>
      <header className="relative overflow-hidden bg-bone-100">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/realisations-hero.mp4"
          poster="/videos/realisations-hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bone-50/85 via-bone-50/70 to-bone-50/90" aria-hidden />
        <div className="relative container-page pt-24 pb-12 lg:pt-32 lg:pb-16">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h1 className="heading-display mt-5 text-display-lg">{t('title')}</h1>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink/70">
            {t('subtitle')}
          </p>
        </div>
      </header>
      {/* 1. Pourquoi ils nous choisissent — 4 différenciateurs */}
      <RealisationsValueProps />

      {/* 2. Le catalogue logos (19 références) */}
      <RealisationsCatalogue />

      {/* 3. Notre méthode — 4 étapes */}
      <RealisationsMethod />

      {/* 4. Avant / Après pose (slider drag-to-reveal) */}
      <RealisationsBeforeAfter />

      {/* 5. Form lead-magnet "Discuter mon projet" */}
      <RealisationsProjectForm />

      {/* 5. CTA Showrooms */}
      <ShowroomsTeaser />
    </>
  );
}
