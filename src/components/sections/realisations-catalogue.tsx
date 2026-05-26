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
                    className="bg-bone-50 flex flex-col items-center justify-center text-center p-6 aspect-[16/10]"
                    title={r.name}
                  >
                    {r.logo ? (
                      <Image
                        src={r.logo}
                        alt={r.name}
                        width={160}
                        height={64}
                        className="max-h-14 w-auto object-contain"
                      />
                    ) : (
                      <span className="font-display text-base lg:text-lg text-ink leading-tight">
                        {label}
                      </span>
                    )}
                    {r.city && (
                      <span className="mt-2 text-[10px] uppercase tracking-[0.16em] text-ink/40">
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
