import { useLocale, useTranslations } from 'next-intl';
import { careerReasons } from '@/lib/data/carrieres';
import type { Locale } from '@/i18n/routing';

export function CareersReasons() {
  const locale = useLocale() as Locale;
  const t = useTranslations('careers.reasons');

  return (
    <section className="container-page py-12 lg:py-16">
      <div className="max-w-2xl mb-14">
        <span className="eyebrow">{t('eyebrow')}</span>
        <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
        <p className="mt-6 text-base leading-relaxed text-ink/70 max-w-prose">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid gap-px bg-ink/10 border border-ink/10 sm:grid-cols-2 lg:grid-cols-3">
        {careerReasons.map((r, i) => (
          <div key={i} className="bg-bone-50 p-8 lg:p-10">
            <span className="font-display text-5xl text-copper-500/40">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-4 font-display text-xl text-ink">{r.title[locale]}</h3>
            <p className="mt-3 text-sm text-ink/65 leading-relaxed">{r.body[locale]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
