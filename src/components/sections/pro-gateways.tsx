import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function ProGateways() {
  const t = useTranslations('home.pro');

  const items = [
    { key: 'architectes', href: '/pro/architectes', image: '/images/pro/architectes.jpg' },
    { key: 'promoteurs', href: '/pro/promoteurs', image: '/images/pro/promoteurs.jpg' },
    { key: 'hoteliers', href: '/pro/hoteliers', image: '/images/pro/hoteliers.jpg' },
    { key: 'distributeurs', href: '/pro/distributeurs', image: '/images/pro/distributeurs.jpg' },
  ] as const;

  return (
    <section className="container-page py-12 lg:py-16">
      <div className="max-w-2xl mb-12">
        <span className="eyebrow">05 — B2B</span>
        <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
        <p className="mt-6 text-base leading-relaxed text-ink/70">{t('subtitle')}</p>
      </div>

      <div className="grid gap-px bg-ink/10 border border-ink/10 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Link
            key={item.key}
            href={item.href}
            className="group relative overflow-hidden bg-ink p-8 min-h-[22rem] flex flex-col justify-between text-bone-50"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out-soft group-hover:scale-105"
              style={{ backgroundImage: `url(${item.image})` }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/25" aria-hidden />
            <span className="relative text-xs tracking-[0.18em] text-bone-200/70">
              0{i + 1}
            </span>
            <div className="relative">
              <p className="font-display text-2xl text-bone-50">{t(item.key)}</p>
              <ArrowUpRight size={20} className="mt-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 rtl:group-hover:-translate-x-1 rtl:rotate-90" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
