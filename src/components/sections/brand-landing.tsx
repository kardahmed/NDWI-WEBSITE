'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { brandCategories, type BrandData } from '@/lib/data/brands';
import { cn } from '@/lib/utils';

interface BrandLandingProps {
  brand: BrandData;
}

export function BrandLanding({ brand }: BrandLandingProps) {
  const locale = useLocale() as Locale;
  const isDark = brand.slug !== 'ndwi';

  return (
    <>
      {/* Hero — vidéo plein cadre si dispo (style Réalisations), sinon split classique */}
      {brand.heroVideo ? (
        <section
          className={cn(
            'relative isolate flex min-h-[88vh] items-end overflow-hidden border-b lg:min-h-[92vh]',
            isDark ? 'border-bone-50/10 bg-ink text-bone-50' : 'border-ink/10 bg-bone-100'
          )}
        >
          {/* Vidéo plein cadre */}
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={brand.heroVideo}
            poster={brand.heroVideoPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />

          {/* Overlay lisibilité — gradient diagonal qui laisse la vidéo respirer côté droit */}
          <div
            className={cn(
              'absolute inset-0',
              isDark
                ? 'bg-gradient-to-r from-ink/95 via-ink/75 to-ink/20'
                : 'bg-gradient-to-r from-bone-50/95 via-bone-50/75 to-bone-50/20'
            )}
            aria-hidden
          />
          <div
            className={cn(
              'absolute inset-0',
              isDark
                ? 'bg-gradient-to-t from-ink/85 via-transparent to-transparent'
                : 'bg-gradient-to-t from-bone-50/85 via-transparent to-transparent'
            )}
            aria-hidden
          />

          {/* Contenu */}
          <div className="container-page relative w-full pb-20 pt-32 lg:pb-24 lg:pt-40">
            <div className="max-w-2xl">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="eyebrow text-copper-500"
              >
                {brand.slug === 'ndwi' ? 'PRODUCTION ALGÉRIE' : 'IMPORTATION ITALIE'}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="heading-display mt-6 text-display-xl leading-[1.05]"
              >
                {brand.name[locale]}
                <span className="text-copper-500">.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'mt-4 text-xl md:text-2xl',
                  isDark ? 'text-bone-50/80' : 'text-ink/75'
                )}
              >
                {brand.tagline[locale]}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'mt-6 max-w-xl text-base leading-relaxed md:text-lg',
                  isDark ? 'text-bone-50/65' : 'text-ink/65'
                )}
              >
                {brand.description[locale]}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'mt-10 text-xs uppercase tracking-[0.18em]',
                  isDark ? 'text-bone-50/45' : 'text-ink/45'
                )}
              >
                {brand.origin[locale]}
              </motion.p>
            </div>
          </div>
        </section>
      ) : (
        <section
          className={cn(
            'relative overflow-hidden border-b border-ink/10',
            isDark ? 'bg-ink text-bone-50' : 'bg-bone-100'
          )}
        >
          <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-20">
            <div>
              <p className="eyebrow text-copper-500">
                {brand.slug === 'ndwi' ? 'PRODUCTION ALGÉRIE' : 'IMPORTATION ITALIE'}
              </p>
              <h1 className="heading-display mt-4 text-display-lg leading-[1.1]">
                {brand.name[locale]}
                <span className="text-copper-500">.</span>
              </h1>
              <p className={cn('mt-3 text-xl', isDark ? 'text-bone-50/70' : 'text-ink/70')}>
                {brand.tagline[locale]}
              </p>
              <p
                className={cn(
                  'mt-6 max-w-xl text-base leading-relaxed',
                  isDark ? 'text-bone-50/60' : 'text-ink/60'
                )}
              >
                {brand.description[locale]}
              </p>
              <p
                className={cn(
                  'mt-8 text-xs uppercase tracking-[0.18em]',
                  isDark ? 'text-bone-50/40' : 'text-ink/40'
                )}
              >
                {brand.origin[locale]}
              </p>
            </div>
            {brand.heroImage && (
              <div className="relative aspect-[4/5] bg-bone-200 lg:aspect-[5/6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.heroImage}
                  alt={brand.name[locale]}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Grid catégories */}
      <section className="container-page py-12 lg:py-16">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-copper-500">CATÉGORIES</p>
            <h2 className="heading-display mt-3 text-display-md">
              {locale === 'ar' ? 'مجموعة كاملة' : 'Une offre complète.'}
            </h2>
          </div>
          <p className="text-sm text-ink/60 max-w-md">
            {locale === 'ar'
              ? `كل ما تحتاجه لتجهيز سكنك أو مكتبك، توقيع ${brand.name[locale]}.`
              : `Tout ce qu'il faut pour aménager votre habitat ou votre espace pro, signé ${brand.name[locale]}.`}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {brandCategories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/${brand.slug}/${cat.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden bg-bone-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name[locale]}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.05]"
                  loading="lazy"
                />
                {/* Overlay gradient pour lisibilité texte */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                {/* Badge marque toujours visible */}
                <span
                  className={cn(
                    'absolute top-4 start-4 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-medium',
                    brand.slug === 'ndwi' ? 'bg-copper-500 text-bone-50' : 'bg-bone-50 text-ink'
                  )}
                >
                  {brand.name[locale]}
                </span>
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h3 className="font-display text-2xl text-bone-50">{cat.name[locale]}</h3>
                      <p className="mt-2 text-xs text-bone-50/70 leading-snug">
                        {cat.description[locale]}
                      </p>
                    </div>
                    <span className="flex-shrink-0 h-9 w-9 bg-bone-50/10 group-hover:bg-bone-50 group-hover:text-ink flex items-center justify-center transition-colors">
                      <ArrowUpRight size={14} className="rtl:rotate-90 text-bone-50 group-hover:text-ink" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
