import { useLocale, useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getFeaturedRealisations, realisationCategoryLabels } from '@/lib/data/realisations';
import type { Locale } from '@/i18n/routing';

const CATEGORY_FALLBACK_IMAGE: Record<string, string> = {
  hotellerie: '/images/categories/hotellerie.jpg',
  workspace: '/images/workspace/direction.jpg',
  residentiel: '/images/categories/cuisines.jpg',
  promotion: '/images/categories/chambres.jpg',
};

export function FeaturedRealisations() {
  const locale = useLocale() as Locale;
  const t = useTranslations('home.realisations');

  const items = getFeaturedRealisations(6);

  return (
    <section className="container-page py-24 lg:py-32">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between mb-14">
        <div className="max-w-xl">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
          <p className="mt-6 text-base leading-relaxed text-ink/70">{t('subtitle')}</p>
        </div>
        <Link
          href="/realisations"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] link-underline self-start"
        >
          {t('cta')}
          <ArrowUpRight size={16} className="rtl:rotate-90" />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => (
          <Link
            key={r.slug}
            href={`/realisations/${r.slug}`}
            className="group bg-bone-50 border border-ink/10 transition-all hover:border-ink/30 hover:-translate-y-1 duration-500 ease-out-soft"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-bone-100">
              <img
                src={r.image || CATEGORY_FALLBACK_IMAGE[r.category] || '/images/categories/hotellerie.jpg'}
                alt=""
                className="h-full w-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" aria-hidden />
              <div className="absolute top-4 start-4">
                <span className="px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] bg-ink/85 text-bone-50">
                  {realisationCategoryLabels[r.category][locale]}
                </span>
              </div>
              {r.clientLogo && (
                <div className="absolute top-3 end-3 h-10 w-10 bg-bone-50/95 backdrop-blur-sm flex items-center justify-center p-1">
                  <img
                    src={r.clientLogo}
                    alt={typeof r.client === 'string' ? r.client : r.client[locale]}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-ink/40">
                {r.year} · {r.city[locale]}
              </p>
              <h3 className="mt-3 font-display text-xl text-ink line-clamp-2">{r.title[locale]}</h3>
              <ArrowUpRight
                size={16}
                className="mt-5 text-ink/40 group-hover:text-copper-500 transition-colors rtl:rotate-90"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
