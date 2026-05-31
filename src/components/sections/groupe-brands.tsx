'use client';

import { useLocale } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { brands } from '@/lib/data/brands';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/** Présente NDWi et NDO comme les 2 marques jumelles du Groupe — la même offre, deux origines. */
export function GroupeBrands() {
  const locale = useLocale() as Locale;
  return (
    <section className="bg-bone-200/30 border-y border-ink/10 py-16 lg:py-20">
      <div className="container-page">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow text-copper-500">
            {locale === 'ar' ? 'الماركتان' : 'Nos deux marques'}
          </span>
          <h2 className="heading-display mt-4 text-display-lg">
            {locale === 'ar'
              ? 'نفس الاحتياجات، ميزانيتان، توقيعان.'
              : 'Les mêmes besoins, deux budgets, deux signatures.'}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink/70 max-w-prose">
            {locale === 'ar'
              ? 'كل ما يقدمه NDWi محلياً، يقدمه NDO أيضاً مستورداً. خياران للعميل: الإنتاج الجزائري الراقي أو التوقيعات الإيطالية الفاخرة.'
              : 'Tout ce que NDWi produit localement, NDO l\'importe aussi d\'Italie. Au client de choisir : la fabrication algérienne haut de gamme, ou la signature italienne premium.'}
          </p>
        </div>

        <div className="grid gap-px bg-ink/10 border border-ink/10 lg:grid-cols-2">
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/${b.slug}`}
              className={cn(
                'group p-10 lg:p-14 flex flex-col transition-colors',
                b.slug === 'ndwi'
                  ? 'bg-bone-50 hover:bg-bone-100'
                  : 'bg-ink text-bone-50 hover:bg-ink/90'
              )}
            >
              <div className="flex items-start justify-between mb-8">
                <span
                  className={cn(
                    'eyebrow',
                    b.slug === 'ndwi' ? 'text-copper-500' : 'text-copper-500'
                  )}
                >
                  {b.slug === 'ndwi' ? 'Production Algérie' : 'Importation Italie'}
                </span>
                <ArrowUpRight
                  size={20}
                  className={cn(
                    'rtl:rotate-90 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1',
                    b.slug === 'ndwi' ? 'text-ink/40' : 'text-bone-50/60'
                  )}
                />
              </div>
              <h3 className="font-display text-display-md leading-none mb-3">
                {b.name[locale]}<span className="text-copper-500">.</span>
              </h3>
              <p
                className={cn(
                  'text-lg',
                  b.slug === 'ndwi' ? 'text-ink/70' : 'text-bone-50/70'
                )}
              >
                {b.tagline[locale]}
              </p>
              <p
                className={cn(
                  'mt-6 text-base leading-relaxed',
                  b.slug === 'ndwi' ? 'text-ink/60' : 'text-bone-50/60'
                )}
              >
                {b.description[locale]}
              </p>
              <p
                className={cn(
                  'mt-auto pt-10 text-xs uppercase tracking-[0.18em]',
                  b.slug === 'ndwi' ? 'text-ink/40' : 'text-bone-50/40'
                )}
              >
                {b.origin[locale]}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
