'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function Hero() {
  const t = useTranslations('home.hero');

  return (
    <section className="relative isolate overflow-hidden bg-bone-100 min-h-[72vh] lg:min-h-[80vh] flex items-end">
      {/* Vidéo plein cadre — object-position décale vers le bas pour éviter
          le plafond sombre en haut du cadre */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: 'center 70%' }}
        src="/videos/groupe-hero.mp4"
        poster="/videos/groupe-hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />

      {/* Overlay lisibilité — gradient diagonal qui laisse la vidéo respirer côté droit */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-bone-50/95 via-bone-50/75 to-bone-50/20"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-bone-50/85 via-transparent to-transparent"
        aria-hidden
      />

      {/* Contenu */}
      <div className="relative container-page pt-24 pb-16 lg:pt-32 lg:pb-20 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow">{t('eyebrow')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="heading-display mt-6 text-display-xl"
          >
            {t('title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/75 md:text-xl"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Link href="/ndwi" className="btn-primary">
              {t('ctaPrimary')}
              <ArrowRight size={16} className="rtl:rotate-180" />
            </Link>
            <Link href="/showrooms" className="btn-secondary">
              <MapPin size={16} />
              {t('ctaSecondary')}
            </Link>
          </motion.div>
        </div>

        {/* Caption références prestige — coin bas-droit */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block absolute end-16 bottom-16 max-w-xs bg-bone-50/90 backdrop-blur-sm px-5 py-4 border-l-2 border-copper-500"
        >
          <p className="text-[10px] uppercase tracking-[0.18em] text-copper-500">
            {t('captionPrestige')}
          </p>
          <p className="mt-1 text-xs text-ink/70 leading-snug">
            {t('captionExcellence')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
