'use client';

import { useLocale } from 'next-intl';
import { Check } from 'lucide-react';
import { nextProject } from '@/lib/data/groupe';
import type { Locale } from '@/i18n/routing';

export function GroupeNextProject() {
  const locale = useLocale() as Locale;
  return (
    <section className="bg-ink text-bone-50 py-24 lg:py-32">
      <div className="container-page grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16 items-start">
        <div>
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 border border-copper-500/40 text-copper-500 text-[10px] uppercase tracking-[0.18em]">
            <span className="h-1.5 w-1.5 rounded-full bg-copper-500 animate-pulse" />
            {nextProject.status[locale]}
          </div>
          <span className="eyebrow text-copper-500">
            {locale === 'ar' ? 'فصلنا القادم' : 'Notre prochain chapitre'}
          </span>
          <h2 className="heading-display mt-4 text-display-lg leading-tight">
            {nextProject.title[locale]}
          </h2>
          <p className="mt-8 text-base lg:text-lg leading-relaxed text-bone-50/70 max-w-prose">
            {nextProject.description[locale]}
          </p>
        </div>

        <ul className="space-y-4 lg:pt-20">
          {nextProject.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-3 border-b border-bone-50/10 pb-4">
              <Check size={18} className="text-copper-500 flex-shrink-0 mt-0.5" />
              <span className="text-base text-bone-50/85">{h[locale]}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
