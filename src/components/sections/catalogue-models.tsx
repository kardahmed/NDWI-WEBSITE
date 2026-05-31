import { useLocale, useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { doors, getDoorBrand } from '@/lib/data/doors';
import type { Locale } from '@/i18n/routing';
import type { DoorProduct } from '@/lib/data/types';

export function CatalogueModels() {
  const locale = useLocale() as Locale;
  const t = useTranslations('catalogue.models');

  const interieures = doors.filter((d) => d.category === 'interieur');
  const entrees = doors.filter((d) => d.category === 'entree');

  return (
    <section className="container-page py-12 lg:py-16">
      <div className="max-w-2xl mb-12">
        <span className="eyebrow">{t('eyebrow')}</span>
        <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
        <p className="mt-6 text-base leading-relaxed text-ink/70 max-w-prose">
          {t('lead')}
        </p>
      </div>

      {/* Portes intérieures */}
      <DoorSection
        title={locale === 'ar' ? 'أبواب داخلية' : 'Portes intérieures'}
        items={interieures}
        locale={locale}
        modelsLabel={t('models')}
        finitionsLabel={t('finitions')}
      />

      {/* Portes d'entrée */}
      {entrees.length > 0 && (
        <DoorSection
          title={locale === 'ar' ? 'أبواب المدخل' : "Portes d’entrée"}
          items={entrees}
          locale={locale}
          modelsLabel={t('models')}
          finitionsLabel={t('finitions')}
          className="mt-20"
        />
      )}
    </section>
  );
}

interface DoorSectionProps {
  title: string;
  items: DoorProduct[];
  locale: Locale;
  modelsLabel: string;
  finitionsLabel: string;
  className?: string;
}

function DoorSection({ title, items, locale, modelsLabel, finitionsLabel, className }: DoorSectionProps) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-ink/10">
        <h3 className="font-display text-2xl text-ink">{title}</h3>
        <span className="text-xs uppercase tracking-[0.18em] text-ink/40">
          {items.length} {modelsLabel}
        </span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((d) => {
          const brand = getDoorBrand(d);
          const isNdwi = brand === 'ndwi';
          return (
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
                {/* Badge marque (NDWi copper / NDO ink) */}
                <div className="absolute top-3 start-3 flex flex-wrap gap-2">
                  <span
                    className={`px-2 py-1 text-[10px] uppercase tracking-[0.16em] font-medium ${
                      isNdwi ? 'bg-copper-500 text-bone-50' : 'bg-ink text-bone-50'
                    }`}
                    title={isNdwi ? 'Production locale Algérie' : 'Importation Italie'}
                  >
                    {isNdwi ? 'NDWi' : 'NDO'}
                  </span>
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
                  {d.thicknesses.join(' · ')} · {d.finishes.length} {finitionsLabel}
                  {isNdwi && (
                    <span className="ms-2 ps-2 border-s border-copper-500/40">
                      {locale === 'ar' ? 'قابل للتخصيص' : 'Configurable'}
                    </span>
                  )}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
