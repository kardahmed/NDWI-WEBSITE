import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { DoorProduct } from '@/lib/data/types';
import type { Locale } from '@/i18n/routing';
import { getDoorBrand } from '@/lib/data/doors';

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

export function ProductCard({ product, locale, href }: ProductCardProps) {
  const brand = getDoorBrand(product);
  return (
    <Link
      href={href}
      className="group relative flex flex-col bg-bone-50 border border-ink/10 transition-all duration-500 ease-out-soft hover:border-ink/30 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-bone-200 to-bone-100">
        {product.heroImage ? (
          <Image
            src={product.heroImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-display text-5xl text-ink/15 tracking-tight">
            {product.name}
          </div>
        )}

        {/* Badge marque (toujours visible, en haut à gauche) */}
        <div className="absolute top-4 start-4 flex flex-wrap gap-2">
          <span
            className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-medium ${
              brand === 'ndwi'
                ? 'bg-copper-500 text-bone-50'
                : 'bg-ink text-bone-50'
            }`}
            title={
              brand === 'ndwi' ? 'Production locale Algérie' : 'Importation'
            }
          >
            {brand === 'ndwi' ? 'NDWi' : 'NDO'}
          </span>
          {product.badges?.map((b) => (
            <span
              key={b}
              className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${badgeStyles[b]}`}
            >
              {badgeLabels[b][locale]}
            </span>
          ))}
        </div>

        <div className="absolute top-4 end-4 h-9 w-9 bg-bone-50/0 group-hover:bg-bone-50 flex items-center justify-center transition-colors">
          <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity rtl:rotate-90" />
        </div>
      </div>

      <div className="p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-ink/40">{product.serie}</p>
        <h3 className="mt-2 font-display text-2xl text-ink">{product.name}</h3>
        <p className="mt-3 text-sm text-ink/60 line-clamp-2">
          {product.shortDescription[locale]}
        </p>

        <div className="mt-5 pt-5 border-t border-ink/10 flex items-center justify-between text-xs text-ink/50">
          <span>{product.thicknesses.join(' · ')}</span>
          <span>{product.finishes.length} finitions</span>
        </div>
      </div>
    </Link>
  );
}
