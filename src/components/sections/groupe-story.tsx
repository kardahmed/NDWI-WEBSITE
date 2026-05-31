import { useTranslations } from 'next-intl';

export function GroupeStory() {
  const t = useTranslations('groupe.story');

  return (
    <section className="container-page py-12 lg:py-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
        <div>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
        </div>
        <div className="space-y-6 text-base lg:text-lg leading-relaxed text-ink/75 max-w-prose">
          <p>{t('p1')}</p>
          <p>{t('p2')}</p>
          <p>{t('p3')}</p>
        </div>
      </div>
    </section>
  );
}
