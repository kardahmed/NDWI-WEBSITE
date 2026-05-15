import { useLocale, useTranslations } from 'next-intl';
import { workspaceProcess } from '@/lib/data/workspace';
import type { Locale } from '@/i18n/routing';

export function WorkspaceProcess() {
  const locale = useLocale() as Locale;
  const t = useTranslations('workspace.process');

  return (
    <section className="bg-bone-200/40 border-y border-ink/10 py-24 lg:py-32">
      <div className="container-page">
        <div className="max-w-2xl mb-16">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
          <p className="mt-6 text-base leading-relaxed text-ink/70 max-w-prose">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {workspaceProcess.map((s) => (
            <div key={s.step} className="relative">
              <p className="font-display text-5xl text-copper-500/40">{s.step}</p>
              <h3 className="mt-4 font-display text-xl text-ink">{s.title[locale]}</h3>
              <p className="mt-3 text-sm text-ink/60 leading-relaxed">{s.desc[locale]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
