'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { products, getProductBrand } from '@/lib/data/products';
import type { Product } from '@/lib/data/products';
import { cn } from '@/lib/utils';

/** Mix-and-shuffle helper — Fisher-Yates pour ordre aléatoire stable au mount. */
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Section "Découvrez le catalogue" — 10-12 produits aléatoires défilant horizontalement.
 * Scroll natif + boutons flèches sur desktop. Tactile naturel sur mobile.
 */
export function ProductsShowcase() {
  const locale = useLocale() as Locale;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  /** Items affichés. Au SSR : les 12 premiers (ordre stable). Au mount client : shuffle aléatoire. */
  const [items, setItems] = useState<Product[]>(() => products.slice(0, 12));

  useEffect(() => {
    setItems(shuffle(products).slice(0, 12));
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      setCanScrollLeft(el.scrollLeft > 8);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <section className="bg-bone-100 py-12 lg:py-16">
      <div className="container-page">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="eyebrow text-copper-500">
              {locale === 'ar' ? 'استكشف' : 'Pour vous inspirer'}
            </span>
            <h2 className="heading-display mt-4 text-display-lg leading-tight">
              {locale === 'ar' ? 'مختارات من كتالوجنا.' : 'Un échantillon du catalogue.'}
            </h2>
            <p className="mt-5 text-base text-ink/65 max-w-prose">
              {locale === 'ar'
                ? 'مزيج عشوائي من إنتاج NDWi المحلي و استيراد NDO الإيطالي. مرر للجانبين لاكتشاف المزيد.'
                : 'Un mix aléatoire de production NDWi locale et d\'importation NDO italienne. Faites défiler pour découvrir.'}
            </p>
          </div>
          {/* Flèches navigation desktop */}
          <div className="hidden lg:flex gap-2">
            <button
              onClick={() => scrollBy(-600)}
              disabled={!canScrollLeft}
              className={cn(
                'h-11 w-11 border flex items-center justify-center transition-colors',
                canScrollLeft
                  ? 'border-ink hover:bg-ink hover:text-bone-50'
                  : 'border-ink/15 text-ink/25 cursor-not-allowed'
              )}
              aria-label="Précédent"
            >
              <ChevronLeft size={18} className="rtl:rotate-180" />
            </button>
            <button
              onClick={() => scrollBy(600)}
              disabled={!canScrollRight}
              className={cn(
                'h-11 w-11 border flex items-center justify-center transition-colors',
                canScrollRight
                  ? 'border-ink hover:bg-ink hover:text-bone-50'
                  : 'border-ink/15 text-ink/25 cursor-not-allowed'
              )}
              aria-label="Suivant"
            >
              <ChevronRight size={18} className="rtl:rotate-180" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory -mx-4 px-4 lg:-mx-0 lg:px-0"
          style={{ scrollbarWidth: 'thin' }}
        >
          {items.map((p) => {
            const brand = getProductBrand(p);
            const categoryHref = `/habitat/${p.category === 'cuisine' ? 'cuisines' : p.category === 'bureau' ? 'bureaux' : p.category}`;
            return (
              <Link
                key={p.slug}
                href={categoryHref}
                className="group flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[340px] snap-start"
              >
                <div className="relative aspect-square overflow-hidden bg-white border border-ink/5">
                  {p.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={p.image}
                      alt={p.name}
                      className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  )}
                  <span
                    className={cn(
                      'absolute top-3 start-3 px-2 py-1 text-[9px] uppercase tracking-[0.16em] font-medium',
                      brand === 'ndwi' ? 'bg-copper-500 text-bone-50' : 'bg-ink text-bone-50'
                    )}
                  >
                    {brand === 'ndwi' ? 'NDWi' : 'NDO'}
                  </span>
                  <span className="absolute bottom-3 end-3 h-9 w-9 bg-bone-50/0 group-hover:bg-bone-50 flex items-center justify-center transition-colors">
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity rtl:rotate-90" />
                  </span>
                </div>
                <div className="mt-4">
                  {p.collection && (
                    <p className="text-[10px] uppercase tracking-[0.18em] text-copper-500">
                      {p.collection}
                    </p>
                  )}
                  <h3 className="mt-1.5 font-display text-xl text-ink leading-tight">{p.name}</h3>
                  <p className="mt-1.5 text-sm text-ink/55 line-clamp-2">
                    {p.shortDescription[locale]}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Lien fin de scroll vers le catalogue complet */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/habitat"
            className="inline-flex items-center gap-2 px-6 py-3 border border-ink hover:bg-ink hover:text-bone-50 text-xs uppercase tracking-[0.14em] transition-colors"
          >
            {locale === 'ar' ? 'استكشف الكتالوج كاملاً' : 'Explorer tout le catalogue'}
            <ArrowUpRight size={14} className="rtl:rotate-90" />
          </Link>
        </div>
      </div>
    </section>
  );
}
