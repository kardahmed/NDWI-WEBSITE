'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function CareersHero() {
  const t = useTranslations('careers.hero');

  return (
    <section className="relative bg-bone-100 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/careers/workshop.jpg"
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bone-50/85 via-bone-50/70 to-bone-50/90" aria-hidden />
      </div>

      <div className="relative container-page pt-24 pb-20 lg:pt-32 lg:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <span className="eyebrow">{t('eyebrow')}</span>
          <h1 className="heading-display mt-6 text-display-xl">{t('title')}</h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/70 md:text-xl">
            {t('lead')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
