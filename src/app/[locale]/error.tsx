'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('error');
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-32 text-center">
      <span className="eyebrow text-copper-500">{t('eyebrow')}</span>
      <h1 className="heading-display mt-5 text-display-xl">{t('title')}</h1>
      <p className="mt-4 max-w-md text-ink/70">{t('description')}</p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-bone-50 text-xs uppercase tracking-[0.14em] hover:bg-copper-500 transition-colors"
        >
          {t('retry')}
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 border border-ink/20 text-xs uppercase tracking-[0.14em] hover:border-copper-500 transition-colors"
        >
          {t('home')}
        </Link>
      </div>
    </section>
  );
}
