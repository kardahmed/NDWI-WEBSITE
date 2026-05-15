import { useTranslations } from 'next-intl';
import { Sliders, ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function ConfiguratorTeaser() {
  const t = useTranslations('configuratorTeaser');

  return (
    <section className="container-page pb-12 -mt-8">
      <Link
        href="/configurateur/portes"
        className="group flex flex-col lg:flex-row gap-6 lg:gap-10 lg:items-center bg-ink text-bone-50 p-6 lg:p-10 border border-ink hover:bg-copper-700 transition-colors"
      >
        <div className="flex-shrink-0 h-14 w-14 lg:h-16 lg:w-16 border border-bone-200/30 flex items-center justify-center">
          <Sliders size={26} strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.18em] text-copper-400">{t('eyebrow')}</p>
          <h3 className="mt-2 font-display text-2xl lg:text-3xl">{t('title')}</h3>
          <p className="mt-2 text-sm text-bone-200/70 max-w-2xl">{t('body')}</p>
        </div>
        <div className="flex-shrink-0 inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-copper-400 group-hover:text-bone-50 transition-colors">
          {t('cta')}
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 rtl:rotate-90" />
        </div>
      </Link>
    </section>
  );
}
