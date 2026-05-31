import { useTranslations } from 'next-intl';
import { ApplicationForm } from '@/components/forms/application-form';

export function CareersApplication() {
  const t = useTranslations('careers.application');

  return (
    <section className="container-page py-16 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <div>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
          <p className="mt-6 text-base leading-relaxed text-ink/70 max-w-prose">
            {t('subtitle')}
          </p>

          <div className="mt-10 space-y-4 text-sm text-ink/70">
            <p className="font-medium text-ink">{t('process.title')}</p>
            <ol className="space-y-3 list-none">
              {[1, 2, 3].map((n) => (
                <li key={n} className="flex gap-4">
                  <span className="font-display text-2xl text-copper-500/40 leading-none">
                    0{n}
                  </span>
                  <span className="leading-relaxed">{t(`process.step${n}`)}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div>
          <ApplicationForm />
        </div>
      </div>
    </section>
  );
}
