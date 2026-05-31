import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { siteConfig } from '@/lib/site';

export function ShowroomsTeaser() {
  const t = useTranslations('home.showrooms');

  return (
    <section className="bg-ink text-bone-50 py-16 lg:py-20">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
          <div>
            <span className="eyebrow">04 — {t('title')}</span>
            <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
            <p className="mt-6 text-base leading-relaxed text-bone-200/70 max-w-md">{t('subtitle')}</p>
            <Link href="/showrooms" className="mt-8 inline-flex items-center gap-3 text-sm uppercase tracking-[0.14em] text-copper-400 hover:text-copper-100">
              {t('cta')}
              <ArrowUpRight size={18} className="rtl:rotate-90" />
            </Link>
          </div>

          <ul className="grid grid-cols-2 gap-px bg-bone-200/10 border border-bone-200/10">
            {siteConfig.showrooms.map((slug, i) => (
              <li key={slug} className="bg-ink">
                <Link
                  href={`/showrooms/${slug}`}
                  className="block p-8 transition-colors hover:bg-ink-700"
                >
                  <span className="text-xs tracking-[0.18em] text-bone-200/40">0{i + 1}</span>
                  <p className="mt-4 font-display text-2xl capitalize">{slug}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
