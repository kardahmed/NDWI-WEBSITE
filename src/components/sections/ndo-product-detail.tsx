'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { ArrowLeft, Check } from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import {
  NDO_MANUFACTURER_LABELS,
  NDO_CATEGORY_LABELS,
  type NdoProduct,
} from '@/sanity/queries/ndoProducts';
import { ContactTrigger } from '@/components/forms/contact-trigger';
import { cn } from '@/lib/utils';

interface Props {
  product: NdoProduct;
}

/** Fiche produit NDO — style e-commerce premium. Pas de configurateur 3D. */
export function NdoProductDetail({ product }: Props) {
  const locale = useLocale() as Locale;
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  const desc =
    (locale === 'ar' ? product.description?.ar : product.description?.fr) ||
    product.shortDescription[locale];

  const gallery = product.galleryUrls.length > 0 ? product.galleryUrls : [product.heroImageUrl];
  const selectedColor = product.colors?.[selectedColorIdx];
  const heroImage = selectedColor?.imageUrl ?? product.heroImageUrl;

  return (
    <>
      <div className="container-page pt-10">
        <Link
          href={`/ndo/${product.category}`}
          className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-copper-500 transition-colors"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" />
          {locale === 'ar' ? 'العودة إلى' : 'Retour à'}{' '}
          {NDO_CATEGORY_LABELS[product.category][locale]}
        </Link>
      </div>

      <section className="container-page pt-10 pb-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Galerie */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden bg-bone-100 border border-ink/10">
              <Image
                src={heroImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {gallery.slice(0, 4).map((url, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden bg-bone-100 border border-ink/10"
                  >
                    <Image
                      src={url}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div>
              <p className="eyebrow text-copper-500">
                {NDO_MANUFACTURER_LABELS[product.manufacturer]}
                {product.collection ? ` · ${product.collection}` : ''}
              </p>
              <h1 className="heading-display mt-4 text-display-lg">{product.name}</h1>
              <p className="mt-6 text-lg text-ink/70 leading-relaxed">
                {product.shortDescription[locale]}
              </p>
            </div>

            {/* Prix + dispo */}
            <div className="flex flex-wrap gap-6 items-baseline border-t border-b border-ink/10 py-5">
              {typeof product.priceFrom === 'number' && (
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-ink/40">
                    {locale === 'ar' ? 'ابتداءً من' : 'À partir de'}
                  </p>
                  <p className="font-display text-3xl text-ink mt-1">
                    {product.priceFrom.toLocaleString('fr-DZ')} DZD
                  </p>
                </div>
              )}
              {product.leadTime && (
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-ink/40">
                    {locale === 'ar' ? 'مهلة التسليم' : 'Délai'}
                  </p>
                  <p className="text-sm text-ink/80 mt-1">{product.leadTime}</p>
                </div>
              )}
              {product.inStock && (
                <span className="bg-emerald-700/10 text-emerald-700 px-3 py-1 text-xs uppercase tracking-[0.14em]">
                  {locale === 'ar' ? 'متوفر في المخزن' : 'En stock'}
                </span>
              )}
              {product.showroomDisplay && (
                <span className="bg-copper-500/10 text-copper-600 px-3 py-1 text-xs uppercase tracking-[0.14em]">
                  {locale === 'ar' ? 'معروض في القاعة' : 'Exposé en showroom'}
                </span>
              )}
            </div>

            {/* Sélecteur de couleur */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-ink/60 mb-3">
                  {locale === 'ar' ? 'الألوان المتوفرة' : 'Couleurs disponibles'}
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((c, i) => {
                    const selected = i === selectedColorIdx;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColorIdx(i)}
                        className={cn(
                          'flex items-center gap-2 border px-3 py-2 text-xs transition-colors',
                          selected
                            ? 'border-ink bg-ink text-bone-50'
                            : 'border-ink/20 text-ink/70 hover:border-ink/50'
                        )}
                        aria-pressed={selected}
                      >
                        <span
                          className="h-4 w-4 rounded-full border border-ink/15"
                          style={{ backgroundColor: c.hex ?? '#999' }}
                        />
                        {locale === 'ar' && c.nameAr ? c.nameAr : c.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description longue */}
            {desc && (
              <div>
                <p className="text-base text-ink/80 leading-relaxed whitespace-pre-line">{desc}</p>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <ContactTrigger
                sourcePage={`/ndo/${product.category}/${product.slug}`}
                defaultSujet="info-produit"
                label={locale === 'ar' ? 'طلب عرض سعر' : 'Demander un devis'}
                className="flex-1 !bg-copper-500 !border-copper-500 hover:!bg-copper-600 hover:!border-copper-600"
              />
              <Link href="/showrooms" className="btn-secondary flex-1">
                {locale === 'ar' ? 'زيارة قاعة العرض' : 'Voir au showroom'}
              </Link>
            </div>
          </div>
        </div>

        {/* Specs techniques */}
        {(product.specs?.length ||
          product.materials?.length ||
          product.dimensions ||
          product.styles?.length) && (
          <div className="mt-20 max-w-3xl">
            <p className="eyebrow !text-ink/40 mb-5">
              {locale === 'ar' ? 'المواصفات' : 'Caractéristiques'}
            </p>
            <dl className="grid gap-px bg-ink/10 border border-ink/10 sm:grid-cols-2">
              {product.dimensions && (
                <SpecRow
                  label={locale === 'ar' ? 'الأبعاد' : 'Dimensions'}
                  value={product.dimensions}
                />
              )}
              {product.materials && product.materials.length > 0 && (
                <SpecRow
                  label={locale === 'ar' ? 'المواد' : 'Matériaux'}
                  value={product.materials.join(' · ')}
                />
              )}
              {product.styles && product.styles.length > 0 && (
                <SpecRow
                  label={locale === 'ar' ? 'الأسلوب' : 'Style'}
                  value={product.styles.join(' · ')}
                />
              )}
              {product.specs?.map((s) => (
                <SpecRow key={s.label} label={s.label} value={s.value} />
              ))}
            </dl>
          </div>
        )}

        {/* Galerie complète si plus de 4 images */}
        {gallery.length > 4 && (
          <div className="mt-20">
            <p className="eyebrow !text-ink/40 mb-5">
              {locale === 'ar' ? 'صور إضافية' : 'Galerie'}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.slice(4).map((url, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/5] overflow-hidden bg-bone-100 border border-ink/10"
                >
                  <Image
                    src={url}
                    alt={`${product.name} ${i + 5}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bone-50 p-5">
      <dt className="text-xs uppercase tracking-[0.14em] text-ink/40">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{value}</dd>
    </div>
  );
}

// Évite warning unused — utilisé dans un éventuel header de page si besoin
export { Check };
