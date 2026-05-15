import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, ShieldCheck, Volume2, Flame, Ruler } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { doorFinishLabels, doorCategoryLabels } from '@/lib/data/doors';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { FormModalTrigger } from '@/components/forms/_shared/form-modal';
import { DevisPorteForm } from '@/components/forms/b2c/devis-porte';
import { fetchAllDoorSlugs, fetchDoorBySlug } from '@/sanity/queries/doors';
import { ProductLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/site';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await fetchAllDoorSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const door = await fetchDoorBySlug(slug);
  if (!door) return {};
  return {
    title: `${door.name} — ${doorCategoryLabels[door.category][locale as Locale]}`,
    description: door.shortDescription[locale as Locale],
  };
}

export default async function DoorDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const door = await fetchDoorBySlug(slug);
  if (!door) notFound();

  const t = await getTranslations('product');
  const L = locale as Locale;

  return (
    <>
      <ProductLd
        name={door.name}
        description={door.shortDescription[L]}
        url={`${siteConfig.url}/${locale}/habitat/portes/${door.slug}`}
        category={doorCategoryLabels[door.category][L]}
        serie={door.serie}
      />
      <div className="container-page pt-10">
        <Link
          href="/habitat/portes"
          className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-copper-500 transition-colors"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" />
          {t('backToCatalogue')}
        </Link>
      </div>

      <section className="container-page pt-10 pb-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Hero visual */}
          <div className="relative aspect-[4/5] bg-gradient-to-br from-bone-200 to-bone-100 border border-ink/10 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center font-display text-7xl text-ink/15 tracking-tight">
              {door.name}
            </div>
            {door.badges && (
              <div className="absolute top-6 start-6 flex flex-wrap gap-2">
                {door.badges.map((b) => (
                  <span
                    key={b}
                    className="px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] bg-ink text-bone-50"
                  >
                    {b === 'nouveau' ? t('badges.new') : b === 'best-seller' ? t('badges.bestSeller') : t('badges.custom')}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <span className="eyebrow">{doorCategoryLabels[door.category][L]} · {door.serie}</span>
            <h1 className="heading-display mt-5 text-display-lg">{door.name}</h1>
            <p className="mt-6 text-lg leading-relaxed text-ink/70">{door.description[L]}</p>

            {/* Tech specs grid */}
            {door.technicalSpecs && (
              <div className="mt-10 grid grid-cols-2 gap-px bg-ink/10 border border-ink/10">
                {door.technicalSpecs.fireRating && (
                  <SpecCell icon={<Flame size={18} />} label={t('specs.fireRating')} value={door.technicalSpecs.fireRating} />
                )}
                {door.technicalSpecs.acousticDb && (
                  <SpecCell
                    icon={<Volume2 size={18} />}
                    label={t('specs.acoustic')}
                    value={`${door.technicalSpecs.acousticDb} dB`}
                  />
                )}
                {door.technicalSpecs.securityClass && (
                  <SpecCell
                    icon={<ShieldCheck size={18} />}
                    label={t('specs.security')}
                    value={door.technicalSpecs.securityClass}
                  />
                )}
                <SpecCell
                  icon={<Ruler size={18} />}
                  label={t('specs.thickness')}
                  value={door.thicknesses.join(' · ')}
                />
              </div>
            )}

            {/* Features */}
            <div className="mt-10">
              <p className="eyebrow !text-ink/40 mb-5">{t('features')}</p>
              <ul className="space-y-3">
                {door.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-ink/80">
                    <span className="mt-2 h-px w-4 bg-copper-500 flex-shrink-0" />
                    {f[L]}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="mt-12 space-y-3">
              {door.category === 'interieure' && (
                <Link
                  href={`/configurateur/portes?m=${door.slug}`}
                  className="btn-primary w-full !bg-copper-500 !border-copper-500 hover:!bg-copper-600 hover:!border-copper-600"
                >
                  {t('cta.configure')}
                </Link>
              )}
              <div className="flex flex-col gap-3 sm:flex-row">
                <FormModalTrigger label={t('cta.devis')} className="flex-1">
                  <DevisPorteForm
                    productSlug={door.slug}
                    sourcePage={`/habitat/portes/${door.slug}`}
                  />
                </FormModalTrigger>
                <Link href="/showrooms" className="btn-secondary flex-1">
                  {t('cta.showroom')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Finitions */}
        <div className="mt-24">
          <p className="eyebrow !text-ink/40 mb-5">{t('availableFinishes')}</p>
          <h2 className="heading-display text-display-md mb-10">
            {door.finishes.length} {t('finishesCount')}
          </h2>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {door.finishes.map((f) => (
              <div key={f} className="bg-bone-50 border border-ink/10 p-4">
                <div className="h-16 bg-gradient-to-br from-bone-200 to-bone-100 mb-3" />
                <p className="text-sm text-ink/80">{doorFinishLabels[f][L]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SpecCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-bone-50 p-5">
      <div className="flex items-center gap-2 text-ink/40">
        {icon}
        <span className="text-xs uppercase tracking-[0.14em]">{label}</span>
      </div>
      <p className="mt-2 font-display text-2xl text-ink">{value}</p>
    </div>
  );
}
