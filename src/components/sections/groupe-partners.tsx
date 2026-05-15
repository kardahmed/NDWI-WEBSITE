import { useLocale, useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';
import { partners } from '@/lib/data/partners';
import type { Locale } from '@/i18n/routing';

export function GroupePartners() {
  const locale = useLocale() as Locale;
  const t = useTranslations('groupe.partners');

  return (
    <section className="container-page py-24 lg:py-32">
      <div className="max-w-2xl mb-14">
        <span className="eyebrow">{t('eyebrow')}</span>
        <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
        <p className="mt-6 text-base leading-relaxed text-ink/70 max-w-prose">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid gap-px bg-ink/10 border border-ink/10 md:grid-cols-3">
        {partners.map((p) => (
          <article key={p.slug} className="bg-bone-50 flex flex-col overflow-hidden">
            {p.image && (
              <div className="relative aspect-[16/10] overflow-hidden bg-bone-100">
                <img
                  src={p.image}
                  alt={`${p.name} — ${p.speciality[locale]}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <div className="p-8 lg:p-10 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-6 gap-4 min-h-[3rem]">
              {p.logo ? (
                <img
                  src={p.logo}
                  alt={p.name}
                  className="h-10 max-w-[140px] object-contain object-left"
                  loading="lazy"
                />
              ) : (
                <p className="font-display text-4xl text-ink">{p.name}</p>
              )}
              <p className="text-xs uppercase tracking-[0.18em] text-ink/40">{p.country[locale]}</p>
            </div>

            <p className="text-xs uppercase tracking-[0.14em] text-copper-500 mb-3">
              {p.speciality[locale]}
            </p>

            <p className="text-sm leading-relaxed text-ink/70 flex-1">
              {p.description[locale]}
            </p>

            {p.founded && (
              <p className="mt-6 pt-6 border-t border-ink/10 text-xs text-ink/50">
                {t('founded')} <span className="text-ink font-medium">{p.founded}</span>
              </p>
            )}

            {p.website && (
              <a
                href={p.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-ink/70 hover:text-copper-500 transition-colors"
              >
                {p.website.replace(/^https?:\/\//, '')}
                <ExternalLink size={12} />
              </a>
            )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
