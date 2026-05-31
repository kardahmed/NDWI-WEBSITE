import { useLocale } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { workspaceCategories } from '@/lib/data/workspace';
import type { Locale } from '@/i18n/routing';

export function WorkspaceGrid() {
  const locale = useLocale() as Locale;

  return (
    <section id="categories" className="container-page py-12 lg:py-16">
      <div className="grid gap-px bg-ink/10 border border-ink/10 sm:grid-cols-2 lg:grid-cols-3">
        {workspaceCategories.map((cat, i) => (
          <Link
            key={cat.slug}
            href={`/workspace/${cat.slug}`}
            className="group relative overflow-hidden bg-ink p-8 lg:p-10 flex flex-col min-h-[26rem] text-bone-50 transition-transform duration-500 ease-out-soft hover:-translate-y-1"
          >
            {cat.image && (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out-soft group-hover:scale-105"
                  style={{ backgroundImage: `url(${cat.image})` }}
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/25" aria-hidden />
              </>
            )}

            <div className="relative flex items-start justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-bone-200/70">
                {String(i + 1).padStart(2, '0')}
              </span>
              <ArrowUpRight size={18} className="text-bone-200/70 rtl:rotate-90" />
            </div>

            <div className="relative mt-auto">
              <h3 className="heading-display text-3xl text-bone-50">{cat.name[locale]}</h3>
              <p className="mt-3 text-sm text-bone-100/80 leading-relaxed">
                {cat.shortDesc[locale]}
              </p>

              <ul className="mt-6 space-y-2.5">
                {cat.features.slice(0, 3).map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-bone-100/90">
                    <span className="mt-1.5 h-px w-3 bg-copper-400 flex-shrink-0" />
                    {f[locale]}
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
