'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Product, ProductBrand } from '@/lib/data/products';
import { getProductBrand, getProductDetailPath } from '@/lib/data/products';
import { Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  showCollectionFilter?: boolean;
}

const L = {
  all: { fr: 'Toute la collection', ar: 'كل المجموعة' },
  results: { fr: 'modèles', ar: 'موديل' },
  brand: { fr: 'Marque', ar: 'الماركة' },
  brandAll: { fr: 'Toutes', ar: 'الكل' },
  ndwi: { fr: 'NDWi (locale)', ar: 'NDWi (محلي)' },
  ndo: { fr: 'NDO (importé)', ar: 'NDO (مستورد)' },
};

export function ProductGrid({ products, showCollectionFilter = true }: ProductGridProps) {
  const locale = useLocale() as Locale;
  const [collection, setCollection] = useState<string | 'all'>('all');
  const [brand, setBrand] = useState<ProductBrand | 'all'>('all');

  const collections = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.collection && set.add(p.collection));
    return Array.from(set);
  }, [products]);

  /** Marques effectivement présentes dans les produits — n'affiche le filtre que si les 2 existent. */
  const brandsPresent = useMemo(() => {
    const set = new Set<ProductBrand>();
    products.forEach((p) => set.add(getProductBrand(p)));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (collection !== 'all' && p.collection !== collection) return false;
      if (brand !== 'all' && getProductBrand(p) !== brand) return false;
      return true;
    });
  }, [products, collection, brand]);

  return (
    <section className="bg-bone-50">
      <div className="container-page py-16 lg:py-20">
        {/* Filtre marque (seulement si les 2 marques sont représentées) */}
        {brandsPresent.length > 1 && (
          <div className="mb-8 flex flex-wrap items-center gap-3 pb-6 border-b border-ink/10">
            <p className="text-[10px] uppercase tracking-[0.18em] text-ink/40 me-2">
              {L.brand[locale]}
            </p>
            {(
              [
                { v: 'all' as const, label: L.brandAll[locale] },
                { v: 'ndwi' as const, label: L.ndwi[locale] },
                { v: 'ndo' as const, label: L.ndo[locale] },
              ]
            ).map(({ v, label }) => (
              <button
                key={v}
                onClick={() => setBrand(v)}
                className={cn(
                  'px-4 py-2 text-xs uppercase tracking-[0.14em] border transition-colors',
                  brand === v
                    ? 'border-copper-500 bg-copper-500 text-bone-50'
                    : 'border-ink/15 text-ink/70 hover:border-ink/40'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {showCollectionFilter && collections.length > 0 && (
          <div className="mb-12 flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-ink/10">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCollection('all')}
                className={cn(
                  'px-4 py-2 text-xs uppercase tracking-[0.14em] border transition-colors',
                  collection === 'all'
                    ? 'border-ink bg-ink text-bone-50'
                    : 'border-ink/15 text-ink/70 hover:border-ink/40'
                )}
              >
                {L.all[locale]} ({products.length})
              </button>
              {collections.map((c) => {
                const count = products.filter((p) => p.collection === c).length;
                return (
                  <button
                    key={c}
                    onClick={() => setCollection(c)}
                    className={cn(
                      'px-4 py-2 text-xs uppercase tracking-[0.14em] border transition-colors',
                      collection === c
                        ? 'border-ink bg-ink text-bone-50'
                        : 'border-ink/15 text-ink/70 hover:border-ink/40'
                    )}
                  >
                    {c} ({count})
                  </button>
                );
              })}
            </div>
            <p className="text-xs uppercase tracking-[0.18em] text-copper-500">
              {filtered.length} {L.results[locale]}
            </p>
          </div>
        )}

        <motion.div
          layout
          className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((p, i) => (
            <motion.article
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <Link href={getProductDetailPath(p)} className="block">
              <div
                className={cn(
                  'relative overflow-hidden bg-white border border-ink/5 transition-shadow duration-500 group-hover:shadow-xl group-hover:shadow-ink/5',
                  p.aspectRatio === '4:5' ? 'aspect-[4/5]' : 'aspect-square'
                )}
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-contain p-6 transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-4 start-4 flex flex-wrap gap-1.5">
                  {/* Badge marque (toujours visible) */}
                  <span
                    className={cn(
                      'px-2 py-1 text-[9px] uppercase tracking-[0.16em] font-medium',
                      getProductBrand(p) === 'ndwi'
                        ? 'bg-copper-500 text-bone-50'
                        : 'bg-ink text-bone-50'
                    )}
                    title={
                      getProductBrand(p) === 'ndwi' ? 'Production locale Algérie' : 'Importation'
                    }
                  >
                    {getProductBrand(p) === 'ndwi' ? 'NDWi' : 'NDO'}
                  </span>
                  {p.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-ink/85 text-bone-50 text-[9px] uppercase tracking-[0.16em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5">
                {p.collection && (
                  <p className="text-[10px] uppercase tracking-[0.18em] text-copper-500">
                    Collection {p.collection}
                  </p>
                )}
                <h3 className="mt-2 font-display text-2xl text-ink group-hover:text-copper-500 transition-colors">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">
                  {p.shortDescription[locale]}
                </p>
              </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
