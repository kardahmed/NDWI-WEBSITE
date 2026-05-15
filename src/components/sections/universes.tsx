'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { brandCategories } from '@/lib/data/brands';
import type { Locale } from '@/i18n/routing';

/**
 * Section "Notre catalogue" — grid des 7 catégories produits, accessibles via /habitat/[category]
 * pour une vue combinée NDWi + NDO. Chaque carte montre une catégorie, le client choisit ensuite
 * la marque selon son budget/style.
 */
export function Universes() {
  const locale = useLocale() as Locale;
  return (
    <section className="container-page py-24 lg:py-32">
      <div className="max-w-2xl mb-14">
        <span className="eyebrow text-copper-500">
          {locale === 'ar' ? 'كتالوجنا' : 'Notre catalogue'}
        </span>
        <h2 className="heading-display mt-4 text-display-lg leading-tight">
          {locale === 'ar' ? 'سبع فئات. ماركتان.' : 'Sept catégories. Deux marques.'}
        </h2>
        <p className="mt-6 text-base leading-relaxed text-ink/70 max-w-prose">
          {locale === 'ar'
            ? 'كل فئة متوفرة بإصدار NDWi (إنتاج محلي) وإصدار NDO (استيراد إيطالي). انقر لاستكشاف الإصدارين معاً.'
            : 'Chaque catégorie existe en version NDWi (production locale) et NDO (importation italienne). Cliquez pour explorer les deux côte à côte.'}
        </p>
      </div>

      <div className="grid gap-px bg-ink/10 border border-ink/10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {brandCategories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={`/habitat/${cat.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden bg-bone-50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.image}
                alt={cat.name[locale]}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl text-bone-50">{cat.name[locale]}</h3>
                    <p className="mt-1.5 text-xs text-bone-50/70 leading-snug">
                      {cat.description[locale]}
                    </p>
                  </div>
                  <span className="flex-shrink-0 h-9 w-9 bg-bone-50/10 group-hover:bg-bone-50 flex items-center justify-center transition-colors">
                    <ArrowUpRight size={14} className="text-bone-50 group-hover:text-ink rtl:rotate-90" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
