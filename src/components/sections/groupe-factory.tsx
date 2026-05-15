import { useLocale, useTranslations } from 'next-intl';
import { groupeFactoryStats } from '@/lib/data/groupe';
import { siteConfig } from '@/lib/site';
import type { Locale } from '@/i18n/routing';

export function GroupeFactory() {
  const locale = useLocale() as Locale;
  const t = useTranslations('groupe.factory');

  return (
    <section className="bg-ink text-bone-50 py-24 lg:py-32">
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20 lg:items-center">
          <div className="relative aspect-[4/3] border border-bone-200/10 overflow-hidden order-2 lg:order-1">
            <img
              src="/images/groupe/usine-ndwi.jpg"
              alt="Usine NDWi — Zone d'activités Nedjma, Oran"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-ink/70 via-ink/20 to-transparent" aria-hidden />
            <div className="absolute bottom-6 left-6">
              <p className="text-xs uppercase tracking-[0.18em] text-copper-400">{t('eyebrow')}</p>
              <p className="mt-2 font-display text-2xl text-bone-50">Oran · El Karma</p>
            </div>
          </div>

          {/* Texte + stats */}
          <div className="order-1 lg:order-2">
            <span className="eyebrow !text-copper-400">{t('eyebrow')}</span>
            <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
            <p className="mt-6 text-base leading-relaxed text-bone-200/70 max-w-prose">
              {t('description')}
            </p>

            <address className="mt-8 not-italic text-sm text-bone-200/60 leading-relaxed">
              {siteConfig.address.line1}
              <br />
              {siteConfig.address.postalCode} {siteConfig.address.city}, {siteConfig.address.region}
              <br />
              {siteConfig.address.country}
            </address>

            <div className="mt-10 grid grid-cols-3 gap-px bg-bone-200/10 border border-bone-200/10">
              {groupeFactoryStats.map((s, i) => (
                <div key={i} className="bg-ink p-5">
                  <p className="font-display text-4xl text-bone-50">{s.value}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-bone-200/50">
                    {s.label[locale]}
                  </p>
                  {s.note && (
                    <p className="mt-2 text-xs text-bone-200/40 leading-snug">
                      {s.note[locale]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-8 text-xs text-bone-200/40 italic">
              * {t('virtualTourSoon')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
