'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Download, Sliders } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function CatalogueHero() {
  const t = useTranslations('catalogue');

  return (
    <section className="relative bg-bone-100 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-bone-100 via-bone-50 to-bone-200" />
        <div className="absolute -right-1/4 -top-1/4 h-[60vw] w-[60vw] rounded-full bg-copper-50/40 blur-3xl" />
      </div>

      <div className="container-page pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow">NDWi PORTE — Catalogue 2026</span>
            <h1 className="heading-display mt-6 text-display-xl">{t('hero.title')}</h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/70">
              {t('hero.lead')}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/configurateur/portes"
                className="btn-primary !bg-copper-500 !border-copper-500 hover:!bg-copper-600 hover:!border-copper-600"
              >
                <Sliders size={16} />
                {t('hero.ctaConfigurer')}
              </Link>
              <a
                href="/catalogue-ndwi-portes.pdf"
                className="btn-secondary"
                download
              >
                <Download size={16} />
                {t('hero.ctaDownload')}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="relative"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/catalogue/cover-01.jpg"
              alt="Catalogue NDWi PORTE"
              className="w-full max-w-md mx-auto shadow-2xl border border-ink/10"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
