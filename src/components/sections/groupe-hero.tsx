'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function GroupeHero() {
  const t = useTranslations('groupe.hero');

  return (
    <section className="relative bg-ink overflow-hidden text-bone-50">
      <div className="absolute inset-0 -z-0">
        <Image
          src="/images/groupe/usine-ndwi.jpg"
          alt="Usine NDWi — Zone d'activités Nedjma, Oran"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/75 to-ink/45" />
      </div>

      <div className="relative container-page pt-28 pb-24 lg:pt-36 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <span className="eyebrow !text-copper-400">{t('eyebrow')}</span>
          <h1 className="heading-display mt-6 text-display-xl text-bone-50">{t('title')}</h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-bone-100/80 md:text-xl">
            {t('lead')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
