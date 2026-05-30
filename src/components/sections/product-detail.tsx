'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, ShieldCheck, Ruler, MapPin, Award } from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { Product } from '@/lib/data/products';
import { getProductBrand, productBrandLabels } from '@/lib/data/products';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { FormModalTrigger } from '@/components/forms/_shared/form-modal';
import { ContactGeneralForm } from '@/components/forms/contact-general';
import { formatPriceFrom, priceOnRequestLabel } from '@/lib/format/price';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface Props {
  product: Product;
  /** URL de retour vers le listing de la catégorie. */
  backHref: string;
  /** Label de retour (ex. "Retour aux cuisines"). */
  backLabel: string;
}

const CART_TYPE_MAP: Record<string, 'cuisine' | 'chambre' | 'dressing' | 'bureau' | 'salon'> = {
  cuisine: 'cuisine',
  chambre: 'chambre',
  dressing: 'dressing',
  bureau: 'bureau',
  salon: 'salon',
};

export function ProductDetail({ product: p, backHref, backLabel }: Props) {
  const locale = useLocale() as Locale;
  const L = locale;
  const brand = getProductBrand(p);
  const isNdwi = brand === 'ndwi';

  const variants = p.colorVariants ?? [];
  const hasVariants = variants.length > 0;
  const [selectedVariantSlug, setSelectedVariantSlug] = useState<string | undefined>(
    variants[0]?.slug
  );
  const selectedVariant = hasVariants
    ? variants.find((v) => v.slug === selectedVariantSlug)
    : undefined;

  // Image hero = variant active (si dispo) sinon image principale
  const heroImage = selectedVariant?.image || p.image;

  return (
    <>
      {/* Back link */}
      <div className="container-page pt-10">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-copper-500 transition-colors"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" />
          {backLabel}
        </Link>
      </div>

      {/* ─── HERO 2 colonnes ─── */}
      <section className="container-page pt-10 pb-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Visuel + pastilles couleur */}
          <div>
            <motion.div
              key={heroImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className={cn(
                'relative w-full overflow-hidden bg-white border border-ink/10',
                p.aspectRatio === '4:5' ? 'aspect-[4/5]' : 'aspect-square'
              )}
            >
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={p.name}
                  fill
                  priority
                  className="object-contain p-8"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center font-display text-7xl text-ink/15 tracking-tight">
                  {p.name}
                </div>
              )}
              {/* Badges */}
              <div className="absolute top-4 start-4 flex flex-wrap gap-1.5">
                <span
                  className={cn(
                    'px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-medium',
                    isNdwi ? 'bg-copper-500 text-bone-50' : 'bg-ink text-bone-50'
                  )}
                  title={productBrandLabels[brand].tagline[L]}
                >
                  {productBrandLabels[brand][L]}
                </span>
                {p.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-ink/85 text-bone-50 text-[10px] uppercase tracking-[0.16em]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Pastilles couleur Apple-style */}
            {hasVariants && (
              <div className="mt-6">
                <p className="eyebrow !text-ink/40 mb-4">
                  {L === 'ar' ? 'الإصدارات' : 'Variantes'} ({variants.length})
                </p>
                <div className="flex flex-wrap items-start gap-3">
                  {variants.map((v) => {
                    const active = v.slug === selectedVariantSlug;
                    return (
                      <button
                        key={v.slug}
                        type="button"
                        onClick={() => setSelectedVariantSlug(v.slug)}
                        aria-pressed={active}
                        aria-label={v.name[L]}
                        title={v.name[L]}
                        className={cn(
                          'group flex flex-col items-center gap-1.5 transition-transform',
                          active ? 'scale-105' : 'hover:scale-105'
                        )}
                      >
                        <span
                          className={cn(
                            'relative h-11 w-11 rounded-full border-2 shadow-sm transition-all overflow-hidden',
                            active
                              ? 'border-ink ring-2 ring-ink ring-offset-2 ring-offset-bone-50'
                              : 'border-ink/15 group-hover:border-ink/40'
                          )}
                          style={{ backgroundColor: v.hex }}
                        >
                          {active && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <Check
                                size={14}
                                strokeWidth={3}
                                className="text-bone-50 drop-shadow-md"
                              />
                            </span>
                          )}
                        </span>
                        <span
                          className={cn(
                            'text-[10px] uppercase tracking-[0.12em] max-w-[70px] text-center leading-tight',
                            active ? 'text-ink' : 'text-ink/50'
                          )}
                        >
                          {v.name[L]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              {p.collection && (
                <span className="text-[10px] uppercase tracking-[0.18em] text-copper-500">
                  Collection {p.collection}
                </span>
              )}
            </div>
            <h1 className="heading-display mt-3 text-display-lg leading-[1.05]">{p.name}</h1>

            {/* Prix */}
            <div className="mt-5 pb-1 border-b border-ink/10">
              {p.priceFromDZD ? (
                <div>
                  <p className="font-display text-3xl text-ink leading-none tabular-nums">
                    {formatPriceFrom(p.priceFromDZD, L)}
                  </p>
                  <p className="mt-2 text-xs text-ink/45 leading-snug">
                    {L === 'ar'
                      ? 'سعر إرشادي للنموذج الأساسي.'
                      : 'Prix indicatif pour le modèle de base.'}
                  </p>
                </div>
              ) : (
                <p className="font-display text-2xl text-ink/65">{priceOnRequestLabel(L)}</p>
              )}
            </div>

            <p className="mt-6 text-lg leading-relaxed text-ink/70">
              {p.shortDescription[L]}
            </p>
            {p.description && (
              <p className="mt-4 text-base leading-relaxed text-ink/65">{p.description[L]}</p>
            )}

            {/* Features chips (si présent) */}
            {p.features && p.features.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2">
                {p.features.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-ink/15 text-xs text-ink/75"
                  >
                    <Check size={11} className="text-copper-500" strokeWidth={3} />
                    {f[L]}
                  </span>
                ))}
              </div>
            )}

            {/* Specs grid (dimensions, origine, garantie) */}
            {(p.dimensions || p.origine || p.garantie) && (
              <div className="mt-10 grid grid-cols-2 gap-px bg-ink/10 border border-ink/10">
                {p.dimensions && (
                  <SpecCell icon={<Ruler size={18} />} label={L === 'ar' ? 'الأبعاد' : 'Dimensions'} value={p.dimensions} />
                )}
                {p.origine && (
                  <SpecCell
                    icon={<MapPin size={18} />}
                    label={L === 'ar' ? 'المنشأ' : 'Origine'}
                    value={p.origine}
                  />
                )}
                {p.garantie && (
                  <SpecCell
                    icon={<ShieldCheck size={18} />}
                    label={L === 'ar' ? 'الضمان' : 'Garantie'}
                    value={p.garantie}
                  />
                )}
                <SpecCell
                  icon={<Award size={18} />}
                  label={L === 'ar' ? 'الماركة' : 'Marque'}
                  value={productBrandLabels[brand][L]}
                />
              </div>
            )}

            {/* CTAs */}
            <div className="mt-12 space-y-3">
              <AddToCartButton
                variant="primary"
                openOnAdd
                className="w-full"
                payload={{
                  productType: CART_TYPE_MAP[p.category] ?? 'autre',
                  productSlug: p.slug,
                  productName: p.name,
                  brand,
                  productHref: backHref + '/' + p.slug,
                  image: heroImage,
                  quantity: 1,
                  priceFromDZD: p.priceFromDZD,
                  variant: selectedVariant
                    ? { slug: selectedVariant.slug, label: selectedVariant.name[L] }
                    : undefined,
                }}
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <FormModalTrigger
                  label={L === 'ar' ? 'طلب التسعير' : 'Demander un devis'}
                  className="flex-1"
                >
                  <ContactGeneralForm
                    sourcePage={backHref + '/' + p.slug}
                    defaultSujet="info-produit"
                  />
                </FormModalTrigger>
                <Link href="/showrooms" className="btn-secondary flex-1">
                  {L === 'ar' ? 'زيارة المعرض' : 'Voir en showroom'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMPOSITION (si renseignée) ─── */}
      {p.composition && (
        <section className="border-t border-ink/10 bg-bone-100">
          <div className="container-page py-16 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
              <div>
                <span className="eyebrow">{L === 'ar' ? 'التركيب' : 'Composition'}</span>
                <h2 className="heading-display mt-4 text-display-sm">
                  {L === 'ar' ? 'مواد نبيلة.' : 'Matières nobles.'}
                </h2>
              </div>
              <p className="text-base leading-relaxed text-ink/75 lg:text-lg">
                {p.composition[L]}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ─── CARACTÉRISTIQUES ─── */}
      {p.caracteristiques && p.caracteristiques.length > 0 && (
        <section className="border-t border-ink/10">
          <div className="container-page py-16 lg:py-20">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow">{L === 'ar' ? 'الخصائص' : 'Caractéristiques'}</span>
              <h2 className="heading-display mt-4 text-display-sm">
                {L === 'ar' ? 'تفاصيل تقنية.' : 'Détails techniques.'}
              </h2>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {p.caracteristiques.map((c, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 border border-ink/10 bg-bone-50 p-4"
                >
                  <Check
                    size={14}
                    className="mt-0.5 flex-shrink-0 text-copper-500"
                    strokeWidth={3}
                  />
                  <span className="text-sm text-ink/80 leading-snug">{c[L]}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ─── GALERIE ─── */}
      {p.gallery && p.gallery.length > 0 && (
        <section className="border-t border-ink/10 bg-bone-100">
          <div className="container-page py-16 lg:py-20">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow">{L === 'ar' ? 'المعرض' : 'Galerie'}</span>
              <h2 className="heading-display mt-4 text-display-sm">
                {L === 'ar' ? 'انظر تحت كل الزوايا.' : 'Voyez-le sous tous les angles.'}
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {p.gallery.map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden bg-white">
                  <Image
                    src={src}
                    alt={`${p.name} — ${i + 1}`}
                    fill
                    className="object-contain p-4 transition-transform duration-500 hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ))}
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
      <p className="mt-2 font-display text-lg text-ink leading-snug">{value}</p>
    </div>
  );
}
