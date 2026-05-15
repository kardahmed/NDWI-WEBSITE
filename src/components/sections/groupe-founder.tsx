'use client';

import { useLocale } from 'next-intl';
import { founder } from '@/lib/data/groupe';
import type { Locale } from '@/i18n/routing';

export function GroupeFounder() {
  const locale = useLocale() as Locale;
  return (
    <section className="container-page py-24 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16 items-center">
        <div className="relative aspect-[4/5] bg-bone-200 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/team/mohamed-bahri.jpg"
            alt={founder.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div>
          <span className="eyebrow text-copper-500">
            {locale === 'ar' ? 'الفنون' : 'Le fondateur'}
          </span>
          <h2 className="heading-display mt-4 text-display-lg leading-tight">{founder.name}.</h2>
          <p className="mt-3 text-base uppercase tracking-[0.18em] text-ink/50">
            {founder.role[locale]}
          </p>
          {founder.bio && (
            <p className="mt-8 text-base lg:text-lg leading-relaxed text-ink/75 max-w-prose">
              {founder.bio[locale]}
            </p>
          )}
          {founder.vision && (
            <blockquote className="mt-8 border-s-2 border-copper-500 ps-6 italic text-lg text-ink/80 leading-relaxed max-w-prose">
              {founder.vision[locale]}
            </blockquote>
          )}
        </div>
      </div>
    </section>
  );
}
