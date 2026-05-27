'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { realisations, realisationCategoryLabels } from '@/lib/data/realisations';
import type { RealisationCategory } from '@/lib/data/realisations';
import type { Locale } from '@/i18n/routing';

const groupOrder: RealisationCategory[] = ['institution', 'promotion', 'hotellerie'];

export function RealisationsCatalogue() {
  const locale = useLocale() as Locale;

  return (
    <section className="container-page pb-32 space-y-16">
      {groupOrder.map((cat) => {
        const items = realisations.filter((r) => r.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat}>
            <p className="text-xs uppercase tracking-[0.16em] text-copper-500 mb-6">
              {realisationCategoryLabels[cat][locale]}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-ink/10 border border-ink/10">
              {items.map((r) => {
                const label = locale === 'ar' && r.nameAr ? r.nameAr : r.name;
                return (
                  <div
                    key={r.slug}
                    className="group bg-bone-50 flex flex-col items-center justify-center gap-4 text-center px-5 py-9 lg:py-10 transition-colors hover:bg-bone-100"
                    title={r.name}
                  >
                    {/* Zone logo — hauteur fixe pour aligner toutes les cartes */}
                    <div className="flex items-center justify-center h-20 lg:h-24">
                      {r.logo ? (
                        <Image
                          src={r.logo}
                          alt={r.name}
                          width={240}
                          height={120}
                          className="max-h-20 lg:max-h-24 max-w-[82%] mx-auto w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="font-display text-xl lg:text-2xl text-ink leading-tight">
                          {label}
                        </span>
                      )}
                    </div>
                    {/* Nom (toujours affiché si logo présent) + ville */}
                    {r.logo && (
                      <p className="font-display text-sm lg:text-base text-ink/85 leading-snug max-w-[18ch]">
                        {label}
                      </p>
                    )}
                    {r.city && (
                      <span className="text-[10px] uppercase tracking-[0.18em] text-copper-500/80">
                        {r.city[locale]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
