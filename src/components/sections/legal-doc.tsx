import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/ui/page-header';

interface LegalDocProps {
  namespace: 'legal' | 'privacy';
  sectionKeys: string[];
}

export function LegalDoc({ namespace, sectionKeys }: LegalDocProps) {
  const t = useTranslations(namespace);

  return (
    <>
      <PageHeader title={t('title')} />
      <article className="container-page pb-32 max-w-3xl">
        {namespace === 'privacy' && (
          <p className="text-base leading-relaxed text-ink/70 mb-12">{t('intro')}</p>
        )}

        <div className="space-y-12">
          {sectionKeys.map((key) => (
            <section key={key}>
              <h2 className="font-display text-2xl lg:text-3xl text-ink mb-4">
                {t(`sections.${key}.title`)}
              </h2>
              <p className="text-base leading-relaxed text-ink/75 max-w-prose">
                {t(`sections.${key}.body`)}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-16 pt-8 border-t border-ink/10 text-xs text-ink/40 italic">
          {t('lastUpdate')} 2026-05-13
        </p>
      </article>
    </>
  );
}
