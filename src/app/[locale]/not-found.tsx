import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-32 text-center">
      <span className="eyebrow text-copper-500">{t('eyebrow')}</span>
      <h1 className="heading-display mt-5 text-display-xl">{t('title')}</h1>
      <p className="mt-4 max-w-md text-ink/70">{t('description')}</p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 px-6 py-3 bg-ink text-bone-50 text-xs uppercase tracking-[0.14em] hover:bg-copper-500 transition-colors"
      >
        {t('cta')}
      </Link>
    </section>
  );
}
