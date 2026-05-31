import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { DoorProduct } from '@/lib/data/types';
import type { Locale } from '@/i18n/routing';
import { getDoorBrand } from '@/lib/data/doors';
import { formatPriceFrom, priceOnRequestLabel } from '@/lib/format/price';

const badgeStyles: Record<string, string> = {
  nouveau: 'bg-copper-500 text-bone-50',
  'best-seller': 'bg-ink text-bone-50',
  'sur-mesure': 'bg-bone-200 text-ink',
};

const badgeLabels: Record<string, Record<Locale, string>> = {
  nouveau: { fr: 'Nouveau', ar: 'جديد' },
  'best-seller': { fr: 'Best-seller', ar: 'الأكثر مبيعاً' },
  'sur-mesure': { fr: 'Sur-mesure', ar: 'حسب الطلب' },
};

interface ProductCardProps {
  product: DoorProduct;
  locale: Locale;
  href: string;
}

/**
 * Card premium — niveau Apple/Hermes :
 *  - Visuel avec hover scale + light overlay
 *  - Shadow stratifié smooth (card → card-hover)
 *  - Lift translate vertical (-4 px) avec spring easing
 *  - Pied de card cuir naturel discret au survol
 *  - Title qui glisse en copper avec ornement chevron
 *  - Image overlay gradient + cue chevron qui apparaît
 */
export function ProductCard({ product, locale, href }: ProductCardProps) {
  const brand = getDoorBrand(product);
  return (
    <Link
      href={href}
      className="group relative flex flex-col bg-bone-50 border border-ink/10 shadow-card transition-all duration-500 ease-out-soft hover:border-ink/25 hover:shadow-card-hover hover:-translate-y-1"
    >
      {/* ─── Visuel ─── */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-bone-200 via-bone-100 to-bone-200">
        {product.heroImage ? (
          <Image
            src={product.heroImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-[1.2s] ease-out-soft group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-display text-6xl text-ink/12 tracking-tight transition-colors duration-500 group-hover:text-ink/20">
            {product.name}
          </div>
        )}

        {/* Overlay gradient au survol — donne profondeur + lisibilité au coin */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/0 via-ink/0 to-ink/0 group-hover:from-ink/15 transition-all duration-500" aria-hidden />

        {/* Badges marque + tags */}
        <div className="absolute top-4 start-4 flex flex-wrap gap-1.5 z-10">
          <span
            className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-medium shadow-sm ${
              brand === 'ndwi' ? 'bg-copper-500 text-bone-50' : 'bg-ink text-bone-50'
            }`}
            title={brand === 'ndwi' ? 'Production locale Algérie' : 'Importation'}
          >
            {brand === 'ndwi' ? 'NDWi' : 'NDO'}
          </span>
          {product.badges?.map((b) => (
            <span
              key={b}
              className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-medium shadow-sm ${badgeStyles[b]}`}
            >
              {badgeLabels[b][locale]}
            </span>
          ))}
        </div>

        {/* Arrow cue en haut à droite — apparaît au hover */}
        <div className="absolute top-4 end-4 z-10 flex h-10 w-10 items-center justify-center bg-bone-50/0 group-hover:bg-bone-50 transition-all duration-300 group-hover:shadow-md">
          <ArrowUpRight
            size={16}
            strokeWidth={1.8}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-90"
          />
        </div>

        {/* Liseré copper en bas du visuel qui apparaît au hover (signature) */}
        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-copper-500 scale-x-0 group-hover:scale-x-100 origin-start transition-transform duration-500 ease-out-soft" aria-hidden />
      </div>

      {/* ─── Bloc texte ─── */}
      <div className="relative p-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-ink/40 font-medium">
          {product.serie}
        </p>
        <h3 className="mt-2 font-display text-2xl text-ink leading-tight transition-colors duration-300 group-hover:text-copper-600">
          {product.name}
        </h3>
        <p className="mt-3 text-sm text-ink/60 line-clamp-2 leading-relaxed">
          {product.shortDescription[locale]}
        </p>

        <div className="mt-5 pt-5 border-t border-ink/10 flex items-end justify-between gap-3">
          <div className="text-[11px] text-ink/50 leading-snug">
            <p className="tabular-nums">{product.thicknesses.join(' · ')}</p>
            <p className="mt-0.5">{product.finishes.length} finitions</p>
          </div>
          <div className="text-end">
            {product.priceFromDZD ? (
              <p className="font-display text-base text-ink leading-tight tabular-nums">
                {formatPriceFrom(product.priceFromDZD, locale)}
              </p>
            ) : (
              <p className="text-[10px] uppercase tracking-[0.16em] text-cuir-600">
                {priceOnRequestLabel(locale)}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
