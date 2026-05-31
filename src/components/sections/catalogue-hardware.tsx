import { useLocale, useTranslations } from 'next-intl';
import { hingeTypes, lockTypes } from '@/lib/data/door-variants';
import type { Locale } from '@/i18n/routing';

export function CatalogueHardware() {
  const locale = useLocale() as Locale;
  const t = useTranslations('catalogue.hardware');

  return (
    <section className="bg-ink text-bone-50 py-16 lg:py-20">
      <div className="container-page">
        <div className="max-w-2xl mb-12">
          <span className="eyebrow !text-copper-400">{t('eyebrow')}</span>
          <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
          <p className="mt-6 text-base leading-relaxed text-bone-200/70">{t('lead')}</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Charnières */}
          <div>
            <p className="eyebrow !text-bone-200/40 mb-5">{t('hinges')}</p>
            <ul className="space-y-3">
              {hingeTypes.map((h) => (
                <li key={h.slug} className="border border-bone-200/15 p-5">
                  <p className="font-display text-xl">{h.name}</p>
                  <p className="mt-2 text-sm text-bone-200/70 leading-relaxed">
                    {h.description[locale]}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Serrures */}
          <div>
            <p className="eyebrow !text-bone-200/40 mb-5">{t('locks')}</p>
            <ul className="space-y-3">
              {lockTypes.map((l) => (
                <li key={l.slug} className="border border-bone-200/15 p-5">
                  <p className="font-display text-xl">{l.name}</p>
                  <p className="mt-2 text-sm text-bone-200/70 leading-relaxed">
                    {l.description[locale]}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
