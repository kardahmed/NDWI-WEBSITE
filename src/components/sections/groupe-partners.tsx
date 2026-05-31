import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';
import { partners, partnerRoster } from '@/lib/data/partners';
import type { Locale } from '@/i18n/routing';

export function GroupePartners() {
  const locale = useLocale() as Locale;
  const t = useTranslations('groupe.partners');

  return (
    <section className="container-page py-16 lg:py-20">
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
                <Image
                  src={p.image}
                  alt={`${p.name} — ${p.speciality[locale]}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
            <div className="p-8 lg:p-10 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-6 gap-4 min-h-[3rem]">
              {p.logo ? (
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={140}
                  height={40}
                  className="h-10 max-w-[140px] object-contain object-left"
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

      {/* Roster complet — fournisseurs & partenaires industriels, groupés */}
      <div className="mt-20 space-y-12">
        <p className="text-sm text-ink/60 max-w-prose">
          {locale === 'ar'
            ? 'يرافق هؤلاء الشركاء الدوليون NDWI في تطوير حلول عالية الجودة للأبواب الداخلية والمطابخ والأثاث السكني وأثاث المكاتب والمشاريع الفندقية.'
            : 'Ces partenaires internationaux accompagnent NDWI dans le développement de solutions de haute qualité pour les portes intérieures, cuisines, mobilier résidentiel, mobilier de bureau et projets hôteliers.'}
        </p>

        {partnerRoster.map((group) => (
          <div key={group.category.fr}>
            <p className="text-xs uppercase tracking-[0.16em] text-copper-500 mb-5">
              {group.category[locale]}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-ink/10 border border-ink/10">
              {group.items.map((item) => (
                <div
                  key={item.name}
                  className="bg-bone-50 flex items-center justify-center p-6 aspect-[3/2]"
                  title={item.name}
                >
                  {item.logo ? (
                    <Image
                      src={item.logo}
                      alt={item.name}
                      width={120}
                      height={48}
                      className="max-h-12 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition"
                    />
                  ) : (
                    <span className="font-display text-lg text-ink/55 text-center leading-tight">
                      {item.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
