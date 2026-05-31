'use client';

import { useTranslations, useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { StickyScrollSection, type StickyChapter } from '@/components/ui/sticky-scroll';

/**
 * Section "Notre histoire" — refondue en sticky-scroll Apple Pro style.
 * 3 chapitres synchronisés : le texte gauche change selon le scroll,
 * le visuel droit swap en miroir.
 *
 * Placeholders typographiques (gradients + emblèmes NDO/NDWi/ZELLIGE)
 * pour l'instant. Quand le client fournit les photos historiques (atelier
 * 2005, équipe 2015, usine moderne), remplacer les <ChapterVisual> par
 * <Image fill ... />.
 */
export function GroupeStory() {
  const t = useTranslations('groupe.story');
  const locale = useLocale() as Locale;

  const chapters: StickyChapter[] = [
    {
      eyebrow: locale === 'ar' ? '2005 — التأسيس' : '2005 — Fondation',
      title: locale === 'ar' ? 'البداية بـ NDO.' : 'Le début avec NDO.',
      body: t('p1'),
      media: <ChapterVisual variant="origin" locale={locale} />,
    },
    {
      eyebrow: locale === 'ar' ? 'التطوير' : 'Développement',
      title: locale === 'ar' ? 'الانتقال إلى الإنتاج.' : "Le passage à la fabrication.",
      body: t('p2'),
      media: <ChapterVisual variant="factory" locale={locale} />,
    },
    {
      eyebrow: locale === 'ar' ? 'اليوم' : "Aujourd'hui",
      title: locale === 'ar' ? 'ماركتان توأمتان.' : 'Deux signatures jumelles.',
      body: t('p3'),
      media: <ChapterVisual variant="brands" locale={locale} />,
    },
  ];

  return (
    <>
      {/* Header de la section (titre principal) avant la zone sticky */}
      <div className="container-page pt-12 lg:pt-16 pb-4">
        <span className="eyebrow">{t('eyebrow')}</span>
        <h2 className="heading-display mt-3 text-display-lg">{t('title')}</h2>
      </div>

      <StickyScrollSection chapters={chapters} bg="bg-bone-100" />
    </>
  );
}

// ─── Placeholders typographiques par chapitre ──────────────────────

function ChapterVisual({
  variant,
  locale,
}: {
  variant: 'origin' | 'factory' | 'brands';
  locale: Locale;
}) {
  const styles = {
    origin: {
      bg: 'bg-gradient-to-br from-bone-200 to-bone-100',
      label: 'NDO',
      tag: { fr: 'IMPORTATION ITALIE', ar: 'استيراد من إيطاليا' },
      isDark: false,
    },
    factory: {
      bg: 'bg-gradient-to-br from-ink to-steel-600',
      label: 'NDWi',
      tag: { fr: 'OUVERTURE USINE ORAN', ar: 'افتتاح مصنع وهران' },
      isDark: true,
    },
    brands: {
      bg: 'bg-gradient-to-br from-copper-500 to-copper-700',
      label: 'NDO + NDWi',
      tag: { fr: 'DEUX MARQUES JUMELLES', ar: 'ماركتان توأمان' },
      isDark: true,
    },
  }[variant];

  return (
    <div
      className={`relative h-full w-full ${styles.bg} flex flex-col items-center justify-center p-8 overflow-hidden`}
    >
      <div className="absolute inset-0 bg-zellige opacity-100" aria-hidden />
      <p
        className={`relative font-display text-6xl lg:text-7xl tracking-tight ${styles.isDark ? 'text-bone-50' : 'text-ink'}`}
      >
        {styles.label}
      </p>
      <p
        className={`relative mt-6 text-xs uppercase tracking-[0.18em] ${styles.isDark ? 'text-bone-50/70' : 'text-ink/55'}`}
      >
        {styles.tag[locale]}
      </p>
    </div>
  );
}
