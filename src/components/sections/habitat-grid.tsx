import { useLocale } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { habitatCategories } from '@/lib/data/habitat';
import type { Locale } from '@/i18n/routing';

export function HabitatGrid() {
  const locale = useLocale() as Locale;

  return (
    <section className="container-page pb-24">
      <div className="grid gap-px bg-ink/10 border border-ink/10 sm:grid-cols-2 lg:grid-cols-3">
        {habitatCategories.map((cat, i) => (
          <Link
            key={cat.slug}
            href={`/habitat/${cat.slug}`}
            className="group relative flex flex-col overflow-hidden bg-bone-50 p-8 lg:p-10 min-h-[22rem] text-bone-50 transition-colors"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out-soft group-hover:scale-105"
              style={{ backgroundImage: `url(${cat.image})` }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/20 transition-opacity group-hover:from-ink/95" aria-hidden />

            <div className="relative flex items-start justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-bone-200/70">
                {String(i + 1).padStart(2, '0')}
              </span>
              {cat.count && (
                <span className="text-xs tracking-[0.14em] text-bone-200/70">
                  {cat.count} {cat.slug === 'finitions' ? 'nuances' : 'références'}
                </span>
              )}
            </div>

            <div className="relative mt-auto">
              <h3 className="heading-display text-3xl lg:text-4xl text-bone-50">{cat.name[locale]}</h3>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone-100/80">
                {cat.description[locale]}
              </p>
              <ArrowUpRight
                size={20}
                className="mt-8 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 rtl:group-hover:-translate-x-1 rtl:rotate-90"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
