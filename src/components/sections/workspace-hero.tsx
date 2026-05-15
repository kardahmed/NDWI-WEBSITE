'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { HabitatTrigger } from '@/components/forms/b2c/habitat-trigger';

export function WorkspaceHero() {
  const t = useTranslations('workspace.hero');

  return (
    <section className="relative bg-ink text-bone-50 overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/workspace-hero.mp4"
        poster="/videos/workspace-hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/65 to-ink/50" aria-hidden />

      <div className="relative container-page pt-24 pb-32 lg:pt-32 lg:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <span className="eyebrow !text-copper-400">{t('eyebrow')}</span>
          <h1 className="heading-display mt-6 text-display-xl">
            {t('title')}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-bone-200/70 md:text-xl">
            {t('subtitle')}
          </p>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <HabitatTrigger
              univers="workspace"
              sourcePage="/workspace"
              label={t('ctaPrimary')}
              className="!bg-copper-500 !border-copper-500 hover:!bg-copper-600 hover:!border-copper-600"
            />
            <a
              href="#categories"
              className="inline-flex items-center justify-center gap-2 border border-bone-200/30 px-7 py-4 text-sm uppercase tracking-[0.14em] text-bone-50 transition-all hover:border-bone-50"
            >
              <ArrowDown size={16} />
              {t('ctaSecondary')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
