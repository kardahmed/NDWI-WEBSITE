import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import {
  ArrowLeft,
  ShieldCheck,
  Volume2,
  Flame,
  Ruler,
  Check,
  Sparkles,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { doorCategoryLabels, getDoorBrand, doorBrandLabels } from '@/lib/data/doors';
import {
  getRevetementBySlug,
  getPoigneeBySlug,
  getSerrureBySlug,
  remplissages as allRemplissages,
  vitrages as allVitrages,
  sensOuvertureLabels,
} from '@/lib/data/door-options';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { FormModalTrigger } from '@/components/forms/_shared/form-modal';
import { DevisPorteForm } from '@/components/forms/b2c/devis-porte';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { fetchAllDoorSlugs, fetchDoorBySlug } from '@/sanity/queries/doors';
import { ProductLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/site';
import { formatPriceFrom, priceOnRequestLabel } from '@/lib/format/price';

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
  const brand = getDoorBrand(door);
  const isNdwi = brand === 'ndwi';

  // Données enrichies — résolution des slugs vers les objets options.
  const revetements = (door.compatibleRevetements ?? [])
    .map(getRevetementBySlug)
    .filter((r): r is NonNullable<typeof r> => !!r);
  const poignees = (door.compatiblePoignees ?? [])
    .map(getPoigneeBySlug)
    .filter((p): p is NonNullable<typeof p> => !!p);
  const serrures = (door.compatibleSerrures ?? [])
    .map(getSerrureBySlug)
    .filter((s): s is NonNullable<typeof s> => !!s);
  const remplissages = (door.compatibleRemplissages ?? [])
    .map((slug) => allRemplissages.find((r) => r.slug === slug))
    .filter((r): r is NonNullable<typeof r> => !!r);
  const vitrages = (door.compatibleVitrages ?? [])
    .map((slug) => allVitrages.find((v) => v.slug === slug))
    .filter((v): v is NonNullable<typeof v> => !!v);

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

      {/* ───────── HERO 2 colonnes : visuel + infos clés ───────── */}
      <section className="container-page pt-10 pb-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Visual placeholder */}
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
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-medium ${
                  isNdwi ? 'bg-copper-500 text-bone-50' : 'bg-ink text-bone-50'
                }`}
                title={doorBrandLabels[brand].tagline[L]}
              >
                {doorBrandLabels[brand][L]}
              </span>
              <span className="text-xs uppercase tracking-[0.16em] text-ink/50">
                {doorBrandLabels[brand].tagline[L]}
              </span>
              {isNdwi && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-copper-500/10 text-copper-600 text-[10px] uppercase tracking-[0.16em] font-medium border border-copper-500/30">
                  <Sparkles size={11} />
                  {L === 'ar' ? 'قابل للتخصيص' : 'Configurable'}
                </span>
              )}
            </div>
            <span className="eyebrow mt-5 block">
              {doorCategoryLabels[door.category][L]} · {door.serie}
            </span>
            <h1 className="heading-display mt-3 text-display-lg">{door.name}</h1>

            {/* Prix indicatif */}
            <div className="mt-5 pb-1 border-b border-ink/10">
              {door.priceFromDZD ? (
                <div>
                  <p className="font-display text-3xl text-ink leading-none tabular-nums">
                    {formatPriceFrom(door.priceFromDZD, L)}
                  </p>
                  <p className="mt-2 text-xs text-ink/45 leading-snug">
                    {L === 'ar'
                      ? 'سعر إرشادي للتكوين الأساسي — الخيارات (الكسوة، المقبض، الأبعاد) قد تعدّل السعر النهائي.'
                      : 'Prix indicatif pour la config de base — les options (revêtement, poignée, dimensions) peuvent ajuster le tarif final.'}
                  </p>
                </div>
              ) : (
                <p className="font-display text-2xl text-ink/65">
                  {priceOnRequestLabel(L)}
                </p>
              )}
            </div>

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
                  value={door.technicalSpecs.thicknessExact ?? door.thicknesses.join(' · ')}
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
              {isNdwi && (
                <Link
                  href={`/configurateur/portes?m=${door.slug}`}
                  className="btn-primary w-full !bg-copper-500 !border-copper-500 hover:!bg-copper-600 hover:!border-copper-600"
                >
                  {t('cta.configure')}
                </Link>
              )}
              <AddToCartButton
                variant={isNdwi ? 'secondary' : 'primary'}
                openOnAdd
                className="w-full"
                payload={{
                  productType: 'porte',
                  productSlug: door.slug,
                  productName: door.name,
                  brand,
                  productHref: `/habitat/portes/${door.slug}`,
                  quantity: 1,
                  priceFromDZD: door.priceFromDZD,
                }}
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <FormModalTrigger
                  label={t('cta.devis')}
                  className="flex-1"
                >
                  <DevisPorteForm
                    productSlug={door.slug}
                    sourcePage={`/habitat/portes/${door.slug}`}
                  />
                </FormModalTrigger>
                <Link href="/showrooms" className="btn-secondary flex-1">
                  {t('cta.showroom')}
                </Link>
              </div>
              {!isNdwi && (
                <p className="pt-2 text-xs text-ink/50 leading-relaxed">
                  {L === 'ar'
                    ? 'منتج إيطالي مستورد — يُسلَّم بتشطيبه النهائي. خيارات الألوان متاحة عند توفرها.'
                    : 'Produit italien importé — livré dans sa finition d’origine. Variantes couleur disponibles selon le modèle.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── COMPOSITION (description technique riche) ───────── */}
      {door.composition && (
        <section className="border-t border-ink/10 bg-bone-100">
          <div className="container-page py-16 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
              <div>
                <span className="eyebrow">{L === 'ar' ? 'التركيب' : 'Composition'}</span>
                <h2 className="heading-display mt-4 text-display-sm">
                  {L === 'ar' ? 'بناء دقيق.' : 'Une construction précise.'}
                </h2>
              </div>
              <p className="text-base leading-relaxed text-ink/75 lg:text-lg">
                {door.composition[L]}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ───────── CERTIFICATIONS (Aurès uniquement pour l'instant) ───────── */}
      {door.certifications && door.certifications.length > 0 && (
        <section className="border-t border-ink/10 bg-ink text-bone-50">
          <div className="container-page py-16 lg:py-20">
            <div className="max-w-2xl">
              <span className="eyebrow text-copper-400">
                {L === 'ar' ? 'الشهادات' : 'Certifications'}
              </span>
              <h2 className="heading-display mt-4 text-display-sm text-bone-50">
                {L === 'ar' ? 'مطابق للمعايير الأكثر تطلباً.' : 'Conforme aux standards les plus exigeants.'}
              </h2>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {door.certifications.map((c, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 border border-bone-50/15 bg-ink/40 p-4"
                >
                  <Check size={16} className="mt-0.5 flex-shrink-0 text-copper-400" strokeWidth={2.5} />
                  <span className="text-sm leading-snug text-bone-50/90">{c[L]}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ───────── FINITIONS DISPONIBLES (pastilles hex) ───────── */}
      {revetements.length > 0 && (
        <section className="border-t border-ink/10">
          <div className="container-page py-16 lg:py-20">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow">{L === 'ar' ? 'التشطيبات المتاحة' : 'Finitions disponibles'}</span>
                <h2 className="heading-display mt-4 text-display-sm">
                  {revetements.length}{' '}
                  {L === 'ar' ? 'كسوة CPL هيدروفوجية' : revetements.length > 1 ? 'revêtements CPL hydrofuges' : 'revêtement CPL hydrofuge'}
                </h2>
              </div>
              <p className="text-xs uppercase tracking-[0.14em] text-ink/45">
                {L === 'ar' ? 'كود الكتالوج' : 'Code catalogue'}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {revetements.map((r) => (
                <div
                  key={r.slug}
                  className="group flex items-center gap-4 border border-ink/10 bg-bone-50 p-3 transition-all hover:border-ink/30 hover:-translate-y-0.5 duration-300"
                >
                  <span
                    className="h-14 w-14 flex-shrink-0 border border-ink/15 shadow-inner"
                    style={{ backgroundColor: r.hex }}
                    title={r.name}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="font-display text-base text-ink leading-tight truncate">{r.name}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-copper-500 tabular-nums">
                      {r.code}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-ink/45 leading-relaxed max-w-prose">
              {L === 'ar'
                ? 'الألوان معروضة بشكل تقريبي — التشطيبات الفعلية يجب رؤيتها في صالة العرض.'
                : 'Les pastilles sont indicatives — la matière exacte se découvre en showroom.'}
            </p>
          </div>
        </section>
      )}

      {/* ───────── POIGNÉES / SERRURES / VITRAGES ───────── */}
      {(poignees.length > 0 || serrures.length > 0 || vitrages.length > 0) && (
        <section className="border-t border-ink/10 bg-bone-100">
          <div className="container-page py-16 lg:py-20">
            <div className="mb-12 max-w-2xl">
              <span className="eyebrow">{L === 'ar' ? 'الإكسسوارات والخيارات' : 'Accessoires & options'}</span>
              <h2 className="heading-display mt-4 text-display-sm">
                {L === 'ar' ? 'كل التفاصيل تُختار.' : 'Chaque détail se choisit.'}
              </h2>
            </div>

            <div className="grid gap-px border border-ink/10 bg-ink/10 md:grid-cols-2 lg:grid-cols-3">
              {/* Poignées */}
              {poignees.length > 0 && (
                <div className="bg-bone-50 p-6 lg:p-8">
                  <p className="eyebrow !text-ink/40">{L === 'ar' ? 'المقابض' : 'Poignées'}</p>
                  <ul className="mt-5 space-y-3">
                    {poignees.map((p) => (
                      <li key={p.slug} className="flex items-start gap-3 text-sm">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-copper-500" />
                        <div>
                          <span className="font-display text-base text-ink">{p.name}</span>
                          <span className="mt-0.5 block text-[10px] uppercase tracking-[0.14em] text-ink/50">
                            {p.finition.replace('-', ' ')}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Serrures */}
              {serrures.length > 0 && (
                <div className="bg-bone-50 p-6 lg:p-8">
                  <p className="eyebrow !text-ink/40">{L === 'ar' ? 'الأقفال' : 'Serrures'}</p>
                  <ul className="mt-5 space-y-4">
                    {serrures.map((s) => (
                      <li key={s.slug}>
                        <p className="font-display text-base text-ink">{s.name[L]}</p>
                        {s.description && (
                          <p className="mt-1 text-xs text-ink/55 leading-snug">{s.description[L]}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Vitrages / variantes panneau */}
              {vitrages.length > 0 && (
                <div className="bg-bone-50 p-6 lg:p-8">
                  <p className="eyebrow !text-ink/40">{L === 'ar' ? 'الزجاج وإصدارات اللوح' : 'Vitrages & variantes panneau'}</p>
                  <div className="mt-5 space-y-4">
                    {(['plein', 'vitre-standard', 'insert-metal', 'vitre-sur-commande'] as const).map(
                      (cat) => {
                        const list = vitrages.filter((v) => v.category === cat);
                        if (list.length === 0) return null;
                        const catLabel: Record<typeof cat, string> = {
                          plein: L === 'ar' ? 'كامل' : 'Plein',
                          'vitre-standard': L === 'ar' ? 'مزجج معياري' : 'Vitré standard',
                          'insert-metal': L === 'ar' ? 'إدراج معدني' : 'Insert métal',
                          'vitre-sur-commande': L === 'ar' ? 'حسب الطلب' : 'Sur commande',
                        };
                        return (
                          <div key={cat}>
                            <p className="text-[10px] uppercase tracking-[0.14em] text-ink/45">
                              {catLabel[cat]}
                            </p>
                            <p className="mt-1 text-sm text-ink/75 leading-snug">
                              {list.map((v) => v.name).join(' · ')}
                            </p>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ───────── SENS · DIMENSIONS · REMPLISSAGE ───────── */}
      {(door.compatibleSens || door.dimensionsRange || remplissages.length > 0) && (
        <section className="border-t border-ink/10">
          <div className="container-page py-16 lg:py-20">
            <div className="grid gap-px border border-ink/10 bg-ink/10 md:grid-cols-3">
              {door.compatibleSens && door.compatibleSens.length > 0 && (
                <div className="bg-bone-50 p-6 lg:p-8">
                  <p className="eyebrow !text-ink/40">{L === 'ar' ? 'اتجاه الفتح' : 'Sens d’ouverture'}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {door.compatibleSens.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 border border-ink/20 text-xs font-medium text-ink/80"
                      >
                        {sensOuvertureLabels[s][L]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {remplissages.length > 0 && (
                <div className="bg-bone-50 p-6 lg:p-8">
                  <p className="eyebrow !text-ink/40">{L === 'ar' ? 'الحشو' : 'Remplissage'}</p>
                  <ul className="mt-5 space-y-2">
                    {remplissages.map((r) => (
                      <li key={r.slug} className="text-sm text-ink/80">
                        {r.name[L]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {door.dimensionsRange && (
                <div className="bg-bone-50 p-6 lg:p-8">
                  <p className="eyebrow !text-ink/40">{L === 'ar' ? 'الأبعاد (سم)' : 'Dimensions (cm)'}</p>
                  <div className="mt-5 space-y-1.5 text-sm text-ink/80">
                    <p>
                      <span className="text-ink/50">{L === 'ar' ? 'العرض' : 'Largeur'} :</span>{' '}
                      <span className="font-medium tabular-nums">
                        {door.dimensionsRange.largeurMin}–{door.dimensionsRange.largeurMax} cm
                      </span>
                    </p>
                    <p>
                      <span className="text-ink/50">{L === 'ar' ? 'الارتفاع' : 'Hauteur'} :</span>{' '}
                      <span className="font-medium tabular-nums">
                        {door.dimensionsRange.hauteurMin}–{door.dimensionsRange.hauteurMax} cm
                      </span>
                    </p>
                    <p className="mt-3 text-[11px] text-ink/45 leading-snug">
                      {L === 'ar'
                        ? 'مقاسات حسب الطلب — على القياس بدون رسوم إضافية في النطاق المذكور.'
                        : 'Sur-mesure — toute dimension dans cette plage, sans surcoût.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
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
