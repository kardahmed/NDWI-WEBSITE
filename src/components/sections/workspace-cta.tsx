import { useTranslations } from 'next-intl';
import { HabitatTrigger } from '@/components/forms/b2c/habitat-trigger';
import { Link } from '@/i18n/routing';
import { ArrowUpRight } from 'lucide-react';

export function WorkspaceCta() {
  const t = useTranslations('workspace.cta');

  return (
    <section className="container-page py-12 lg:py-16">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
          <p className="mt-6 text-base leading-relaxed text-ink/70 max-w-prose">
            {t('subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          <HabitatTrigger
            univers="workspace"
            sourcePage="/workspace"
            label={t('ctaPrimary')}
            className="w-full !py-5 text-base"
          />
          <Link
            href="/showrooms"
            className="btn-secondary w-full !py-5 text-base"
          >
            {t('ctaSecondary')}
            <ArrowUpRight size={18} className="rtl:rotate-90" />
          </Link>
          <p className="text-xs text-ink/50 pt-2">{t('disclaimer')}</p>
        </div>
      </div>
    </section>
  );
}
