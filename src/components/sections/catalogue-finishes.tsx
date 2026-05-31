'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { finishes, finishCategoryLabels, getFinishImageUrl, type FinishCategory } from '@/lib/data/door-finishes';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const categoryOrder: FinishCategory[] = ['frene', 'laque', 'rovere', 'bois', 'pelle', 'metal', 'shiny', 'special'];

export function CatalogueFinishes() {
  const locale = useLocale() as Locale;
  const t = useTranslations('catalogue.finishes');
  const [activeCategory, setActiveCategory] = useState<FinishCategory | 'all'>('all');

  const visibleFinishes =
    activeCategory === 'all' ? finishes : finishes.filter((f) => f.category === activeCategory);

  return (
    <section className="bg-bone-200/40 border-y border-ink/10 py-12 lg:py-16">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16 mb-12 lg:items-end">
          <div>
            <span className="eyebrow">{t('eyebrow')}</span>
            <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
            <p className="mt-6 text-base leading-relaxed text-ink/70 max-w-prose">
              {t('lead')}
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.16em] text-copper-500">
            {finishes.length} {t('options')}
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={cn(
              'px-4 py-2 text-xs uppercase tracking-[0.14em] border transition-colors',
              activeCategory === 'all'
                ? 'border-ink bg-ink text-bone-50'
                : 'border-ink/15 text-ink/70 hover:border-ink/40'
            )}
          >
            {t('all')} ({finishes.length})
          </button>
          {categoryOrder.map((c) => {
            const count = finishes.filter((f) => f.category === c).length;
            if (count === 0) return null;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCategory(c)}
                className={cn(
                  'px-4 py-2 text-xs uppercase tracking-[0.14em] border transition-colors',
                  activeCategory === c
                    ? 'border-ink bg-ink text-bone-50'
                    : 'border-ink/15 text-ink/70 hover:border-ink/40'
                )}
              >
                {finishCategoryLabels[c][locale]} ({count})
              </button>
            );
          })}
        </div>

        {/* Finishes grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {visibleFinishes.map((f) => (
            <div key={f.slug} className="bg-bone-50 border border-ink/10 p-3">
              <div
                className="aspect-[16/10] mb-3 border border-ink/5 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${getFinishImageUrl(f)})`,
                  backgroundColor: f.cssColor,
                }}
              />
              <p className="text-xs font-medium text-ink leading-tight">{f.name[locale]}</p>
              {f.code && (
                <p className="text-[10px] uppercase tracking-[0.14em] text-ink/40 mt-1">
                  {f.code}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* PAIL partnership note */}
        <p className="mt-8 text-xs text-ink/50 italic">
          {t('pailNote')}
        </p>
      </div>
    </section>
  );
}
