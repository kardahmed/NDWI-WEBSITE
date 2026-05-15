import { useLocale, useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { doors } from '@/lib/data/doors';
import type { Locale } from '@/i18n/routing';

export function CatalogueModels() {
  const locale = useLocale() as Locale;
  const t = useTranslations('catalogue.models');

  const interieures = doors.filter((d) => d.category === 'interieure');
  const blindees = doors.filter((d) => d.category === 'blindee');
  const techniques = doors.filter((d) => d.category === 'technique');

  return (
    <section className="container-page py-24 lg:py-32">
      <div className="max-w-2xl mb-12">
        <span className="eyebrow">{t('eyebrow')}</span>
        <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
        <p className="mt-6 text-base leading-relaxed text-ink/70 max-w-prose">
          {t('lead')}
        </p>
      </div>

      {/* Portes intérieures */}
      <div className="mb-20">
        <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-ink/10">
          <h3 className="font-display text-2xl text-ink">{t('interieures')}</h3>
          <span className="text-xs uppercase tracking-[0.18em] text-ink/40">
            {interieures.length} {t('models')}
          </span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {interieures.map((d) => (
            <Link
              key={d.slug}
              href={`/habitat/portes/${d.slug}`}
              className="group bg-bone-50 border border-ink/10 transition-all hover:border-ink/30 hover:-translate-y-1 duration-500 ease-out-soft"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-bone-100">
                {d.heroImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={d.heroImage}
                    alt={d.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="font-display text-3xl text-ink/15">{d.name}</p>
                  </div>
                )}
                <div className="absolute top-3 start-3">
                  <span className="px-2 py-1 bg-ink/85 text-bone-50 text-[10px] uppercase tracking-[0.16em] backdrop-blur-sm">
                    {d.serie}
                  </span>
                </div>
                <div className="absolute top-3 end-3 h-9 w-9 bg-bone-50/0 group-hover:bg-bone-50 flex items-center justify-center transition-colors">
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity rtl:rotate-90" />
                </div>
              </div>
              <div className="p-5">
                <p className="font-display text-xl text-ink">{d.name}</p>
                <p className="mt-2 text-xs text-ink/55 line-clamp-2">{d.shortDescription[locale]}</p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-copper-500">
                  {d.thicknesses.join(' · ')} · {d.finishes.length} {t('finitions')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Portes blindées */}
      {blindees.length > 0 && (
        <div className="mb-20">
          <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-ink/10">
            <h3 className="font-display text-2xl text-ink">{t('blindees')}</h3>
            <span className="text-xs uppercase tracking-[0.18em] text-ink/40">
              {blindees.length} {t('models')}
            </span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blindees.map((d) => (
              <Link
                key={d.slug}
                href={`/habitat/portes/${d.slug}`}
                className="group bg-bone-50 border border-ink/10 p-6 transition-colors hover:border-ink/30"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-copper-500">
                  {d.serie}
                </p>
                <h4 className="mt-2 font-display text-xl text-ink">{d.name}</h4>
                <p className="mt-3 text-xs text-ink/55 line-clamp-3">{d.shortDescription[locale]}</p>
                {d.technicalSpecs?.securityClass && (
                  <p className="mt-3 inline-block px-2 py-1 bg-ink text-bone-50 text-[10px] uppercase tracking-[0.16em]">
                    Classe {d.technicalSpecs.securityClass}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Portes techniques */}
      {techniques.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-ink/10">
            <h3 className="font-display text-2xl text-ink">{t('techniques')}</h3>
            <span className="text-xs uppercase tracking-[0.18em] text-ink/40">
              {techniques.length} {t('models')}
            </span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {techniques.map((d) => (
              <Link
                key={d.slug}
                href={`/habitat/portes/${d.slug}`}
                className="group bg-bone-50 border border-ink/10 p-6 transition-colors hover:border-ink/30"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-copper-500">
                  {d.serie}
                </p>
                <h4 className="mt-2 font-display text-xl text-ink">{d.name}</h4>
                <p className="mt-3 text-xs text-ink/55 line-clamp-3">{d.shortDescription[locale]}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {d.technicalSpecs?.fireRating && (
                    <span className="inline-block px-2 py-1 bg-bone-200 text-ink text-[10px] uppercase tracking-[0.16em]">
                      {d.technicalSpecs.fireRating}
                    </span>
                  )}
                  {d.technicalSpecs?.acousticDb && (
                    <span className="inline-block px-2 py-1 bg-bone-200 text-ink text-[10px] uppercase tracking-[0.16em]">
                      {d.technicalSpecs.acousticDb} dB
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
