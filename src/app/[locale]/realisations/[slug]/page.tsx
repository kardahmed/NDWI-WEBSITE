import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, ArrowUpRight, MapPin, User, Calendar } from 'lucide-react';
import { Link, routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import {
  realisations,
  realisationCategoryLabels,
  getRealisationBySlug,
} from '@/lib/data/realisations';
import { localized } from '@/lib/data/realisations-utils';
import { ContactTrigger } from '@/components/forms/contact-trigger';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    realisations.map((r) => ({ locale, slug: r.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const r = getRealisationBySlug(slug);
  if (!r) return {};
  const L = locale as Locale;
  return {
    title: r.title[L],
    description: r.summary[L],
  };
}

export default async function RealisationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const r = getRealisationBySlug(slug);
  if (!r) notFound();

  const t = await getTranslations('realisationDetail');
  const L = locale as Locale;

  // 3 autres réalisations à proposer (même catégorie)
  const related = realisations
    .filter((x) => x.slug !== r.slug && x.category === r.category)
    .slice(0, 3);

  return (
    <>
      <div className="container-page pt-10">
        <Link
          href="/realisations"
          className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-copper-500 transition-colors"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" />
          {t('back')}
        </Link>
      </div>

      {/* Hero case study */}
      <section className="container-page pt-10 pb-16">
        <div className="max-w-4xl">
          <span className="eyebrow">
            {realisationCategoryLabels[r.category][L]} · {r.year}
          </span>
          <h1 className="heading-display mt-5 text-display-xl">{r.title[L]}</h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-ink/70">
            {r.summary[L]}
          </p>
        </div>

        {/* Meta info */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-ink/10 border border-ink/10">
          <MetaCell icon={<User size={16} />} label={t('client')} value={localized(r.client, L)} />
          <MetaCell icon={<MapPin size={16} />} label={t('city')} value={r.city[L]} />
          <MetaCell icon={<Calendar size={16} />} label={t('year')} value={String(r.year)} />
          <MetaCell
            label={t('universes')}
            value={r.universes.map((u) => u).join(' · ')}
          />
        </div>
      </section>

      {/* Hero visual */}
      <section className="container-page mb-16">
        <div className="aspect-[21/9] bg-gradient-to-br from-bone-200 to-bone-100 border border-ink/10 flex items-center justify-center">
          <p className="font-display text-6xl text-ink/15">{r.title[L]}</p>
        </div>
        <p className="mt-3 text-xs text-ink/40">{t('photoSoon')}</p>
      </section>

      {/* Body */}
      <section className="container-page pb-20">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr] lg:gap-16">
          <article className="prose-custom space-y-6">
            {r.body.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-ink/80 max-w-prose">
                {p[L]}
              </p>
            ))}
          </article>

          <aside>
            {r.metrics && r.metrics.length > 0 && (
              <div className="bg-ink text-bone-50 p-8">
                <p className="eyebrow !text-copper-400 mb-6">{t('metrics')}</p>
                <ul className="space-y-6">
                  {r.metrics.map((m, i) => (
                    <li key={i}>
                      <p className="font-display text-4xl text-bone-50">{m.value}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-bone-200/60">
                        {m.label[L]}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 space-y-3">
              <ContactTrigger
                sourcePage={`/realisations/${r.slug}`}
                defaultSujet="info-produit"
                label={t('cta.similar')}
                className="w-full"
              />
              <Link href="/contact" className="btn-secondary w-full">
                {t('cta.contact')}
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-bone-200/40 border-t border-ink/10 py-20">
          <div className="container-page">
            <div className="mb-10">
              <span className="eyebrow">{t('related.eyebrow')}</span>
              <h2 className="heading-display mt-4 text-display-md">
                {t('related.title', { category: realisationCategoryLabels[r.category][L].toLowerCase() })}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((x) => (
                <Link
                  key={x.slug}
                  href={`/realisations/${x.slug}`}
                  className="group bg-bone-50 border border-ink/10 p-7 hover:border-ink/30 transition-colors"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-ink/40">
                    {x.year} · {x.city[L]}
                  </p>
                  <h3 className="mt-3 font-display text-xl text-ink">{x.title[L]}</h3>
                  <p className="mt-3 text-sm text-ink/60 line-clamp-2">{x.summary[L]}</p>
                  <ArrowUpRight
                    size={16}
                    className="mt-5 text-ink/40 group-hover:text-copper-500 transition-colors rtl:rotate-90"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function MetaCell({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-bone-50 p-5">
      <div className="flex items-center gap-2 text-ink/40">
        {icon}
        <span className="text-[10px] uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className="mt-2 text-sm text-ink font-medium capitalize">{value || '—'}</p>
    </div>
  );
}
