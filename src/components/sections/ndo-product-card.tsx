import Image from 'next/image';
import { Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { NDO_MANUFACTURER_LABELS, type NdoProduct } from '@/sanity/queries/ndoProducts';

interface Props {
  product: NdoProduct;
  locale: Locale;
}

/** Card produit NDO — style e-commerce premium (fond clair, packshot, sans configurateur). */
export function NdoProductCard({ product, locale }: Props) {
  const desc = product.shortDescription[locale] || product.shortDescription.fr;
  const href = `/ndo/${product.category}/${product.slug}`;
  const isNew = product.tags?.includes('nouveau');
  const isBestSeller = product.tags?.includes('best-seller');

  return (
    <Link
      href={href}
      className="group flex flex-col bg-bone-50 border border-ink/10 hover:border-ink/30 transition-colors"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-bone-100">
        <Image
          src={product.heroImageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Badges */}
        <div className="absolute top-3 start-3 flex flex-wrap gap-1.5">
          {isNew && (
            <span className="bg-copper-500 text-bone-50 px-2 py-1 text-[10px] uppercase tracking-[0.14em]">
              {locale === 'ar' ? 'جديد' : 'Nouveau'}
            </span>
          )}
          {isBestSeller && (
            <span className="bg-ink text-bone-50 px-2 py-1 text-[10px] uppercase tracking-[0.14em]">
              Best
            </span>
          )}
          {product.inStock && (
            <span className="bg-emerald-700 text-bone-50 px-2 py-1 text-[10px] uppercase tracking-[0.14em]">
              {locale === 'ar' ? 'متوفر' : 'En stock'}
            </span>
          )}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-[10px] uppercase tracking-[0.16em] text-copper-500">
          {NDO_MANUFACTURER_LABELS[product.manufacturer]}
        </p>
        <h3 className="mt-1.5 font-display text-xl text-ink leading-tight">{product.name}</h3>
        {product.collection && (
          <p className="mt-0.5 text-xs text-ink/50">{product.collection}</p>
        )}
        <p className="mt-2 text-sm text-ink/60 line-clamp-2 flex-1">{desc}</p>
        {/* Palette de couleurs (petits ronds) */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-3 flex gap-1.5">
            {product.colors.slice(0, 5).map((c) => (
              <span
                key={c.name}
                title={locale === 'ar' && c.nameAr ? c.nameAr : c.name}
                className="h-4 w-4 rounded-full border border-ink/15"
                style={{ backgroundColor: c.hex ?? '#999' }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-xs text-ink/50">+{product.colors.length - 5}</span>
            )}
          </div>
        )}
        {/* Prix "à partir de" (optionnel) */}
        {typeof product.priceFrom === 'number' && (
          <p className="mt-3 text-sm text-ink/80">
            {locale === 'ar' ? 'ابتداءً من' : 'À partir de'}{' '}
            <span className="font-medium">{product.priceFrom.toLocaleString('fr-DZ')} DZD</span>
          </p>
        )}
      </div>
    </Link>
  );
}
