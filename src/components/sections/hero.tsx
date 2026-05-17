'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function Hero() {
  const t = useTranslations('home.hero');

  return (
    <section className="relative overflow-hidden bg-bone-100">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-bone-100 via-bone-50 to-bone-200" />
        <div className="absolute -right-1/4 -top-1/4 h-[60vw] w-[60vw] rounded-full bg-copper-50/40 blur-3xl" />
      </div>

      <div className="container-page pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow">{t('eyebrow')}</span>
            <h1 className="heading-display mt-6 text-display-xl">
              {t('title')}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/70 md:text-xl">
              {t('subtitle')}
            </p>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Link href="/ndwi" className="btn-primary">
                {t('ctaPrimary')}
                <ArrowRight size={16} className="rtl:rotate-180" />
              </Link>
              <Link href="/showrooms" className="btn-secondary">
                <MapPin size={16} />
                {t('ctaSecondary')}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] lg:aspect-[4/5] overflow-hidden bg-ink/5 shadow-2xl shadow-ink/10"
          >
            <Image
              src="/images/hero/living-room.jpg"
              alt=""
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute bottom-6 left-6 right-6 bg-bone-50/95 backdrop-blur-sm px-5 py-4 border-l-2 border-copper-500">
              <p className="text-[10px] uppercase tracking-[0.18em] text-copper-500">Marriott · Rodina · Ibiris</p>
              <p className="mt-1 text-xs text-ink/70 leading-snug">Plus de 25 ans d&apos;excellence menuiserie</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
