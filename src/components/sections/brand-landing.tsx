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
  const accent = brand.slug === 'ndwi' ? 'copper-500' : 'ink';

  return (
    <>
      {/* Hero */}
      <section
        className={cn(
          'relative overflow-hidden border-b border-ink/10',
          brand.slug === 'ndwi' ? 'bg-bone-100' : 'bg-ink text-bone-50'
        )}
      >
        <div className="container-page py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p
              className={cn(
                'eyebrow',
                brand.slug === 'ndwi' ? 'text-copper-500' : 'text-copper-500'
              )}
            >
              {brand.slug === 'ndwi' ? '🇩🇿 PRODUCTION ALGÉRIE' : '🇮🇹 IMPORTATION ITALIE'}
            </p>
            <h1 className="heading-display mt-4 text-display-lg leading-[1.1]">
              {brand.name[locale]}
              <span className={cn(brand.slug === 'ndwi' ? 'text-copper-500' : 'text-copper-500')}>
                .
              </span>
            </h1>
            <p
              className={cn(
                'mt-3 text-xl',
                brand.slug === 'ndwi' ? 'text-ink/70' : 'text-bone-50/70'
              )}
            >
              {brand.tagline[locale]}
            </p>
            <p
              className={cn(
                'mt-6 text-base leading-relaxed max-w-xl',
                brand.slug === 'ndwi' ? 'text-ink/60' : 'text-bone-50/60'
              )}
            >
              {brand.description[locale]}
            </p>
            <p
              className={cn(
                'mt-8 text-xs uppercase tracking-[0.18em]',
                brand.slug === 'ndwi' ? 'text-ink/40' : 'text-bone-50/40'
              )}
            >
              {brand.origin[locale]}
            </p>
          </div>
          {brand.heroImage && (
            <div className="relative aspect-[4/5] lg:aspect-[5/6] bg-bone-200">
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

      {/* Grid catégories */}
      <section className="container-page py-20 lg:py-28">
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
