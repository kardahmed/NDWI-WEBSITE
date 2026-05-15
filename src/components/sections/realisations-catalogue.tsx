'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { realisations, realisationCategoryLabels } from '@/lib/data/realisations';
import type { RealisationCategory, Realisation } from '@/lib/data/realisations';
import type { Locale } from '@/i18n/routing';
import { localized } from '@/lib/data/realisations-utils';
import { cn } from '@/lib/utils';

const allCategories: RealisationCategory[] = ['residentiel', 'promotion', 'hotellerie', 'workspace'];

export function RealisationsCatalogue() {
  const locale = useLocale() as Locale;
  const t = useTranslations('realisations');

  const [category, setCategory] = useState<RealisationCategory | 'all'>('all');

  const filtered = useMemo(() => {
    if (category === 'all') return realisations;
    return realisations.filter((r) => r.category === category);
  }, [category]);

  return (
    <section className="container-page pb-32">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-10 pb-6 border-b border-ink/10">
        <button
          onClick={() => setCategory('all')}
          className={cn(
            'px-4 py-2 text-xs uppercase tracking-[0.14em] border transition-colors',
            category === 'all'
              ? 'border-ink bg-ink text-bone-50'
              : 'border-ink/15 text-ink/70 hover:border-ink/40'
          )}
        >
          {t('filters.all')} ({realisations.length})
        </button>
        {allCategories.map((c) => {
          const count = realisations.filter((r) => r.category === c).length;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                'px-4 py-2 text-xs uppercase tracking-[0.14em] border transition-colors',
                category === c
                  ? 'border-ink bg-ink text-bone-50'
                  : 'border-ink/15 text-ink/70 hover:border-ink/40'
              )}
            >
              {realisationCategoryLabels[c][locale]} ({count})
            </button>
          );
        })}
      </div>

      <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((r) => (
            <motion.div
              key={r.slug}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <RealisationCard r={r} locale={locale} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function RealisationCard({ r, locale }: { r: Realisation; locale: Locale }) {
  return (
    <Link
      href={`/realisations/${r.slug}`}
      className="group relative flex flex-col bg-bone-50 border border-ink/10 transition-all duration-500 ease-out-soft hover:border-ink/30 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bone-100">
        <img
          src={
            r.image ||
            (r.category === 'workspace'
              ? '/images/workspace/direction.jpg'
              : r.category === 'residentiel'
                ? '/images/categories/cuisines.jpg'
                : r.category === 'promotion'
                  ? '/images/categories/chambres.jpg'
                  : '/images/categories/hotellerie.jpg')
          }
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" aria-hidden />
        <div className="absolute top-4 start-4">
          <span className="px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] bg-ink/85 text-bone-50 backdrop-blur-sm">
            {realisationCategoryLabels[r.category][locale]}
          </span>
        </div>
        <div className="absolute top-4 end-4 h-9 w-9 bg-bone-50/0 group-hover:bg-bone-50 flex items-center justify-center transition-colors">
          <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity rtl:rotate-90" />
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink/40">
          <span>{r.year}</span>
          <span>·</span>
          <span>{r.city[locale]}</span>
        </div>
        <h3 className="mt-3 font-display text-2xl text-ink line-clamp-2">{r.title[locale]}</h3>
        <p className="mt-2 text-xs text-ink/50">{localized(r.client, locale)}</p>
        <p className="mt-4 text-sm text-ink/70 line-clamp-2">{r.summary[locale]}</p>
      </div>
    </Link>
  );
}
