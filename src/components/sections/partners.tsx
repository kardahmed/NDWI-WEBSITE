import { useTranslations } from 'next-intl';
import { siteConfig } from '@/lib/site';

export function Partners() {
  const t = useTranslations('home.partners');

  return (
    <section className="container-page py-16 lg:py-20">
      <div className="max-w-2xl">
        <span className="eyebrow">Made with Italy</span>
        <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
        <p className="mt-6 text-base leading-relaxed text-ink/70 max-w-prose">
          {t('subtitle')}
        </p>
      </div>

      <div className="mt-14 grid grid-cols-3 gap-px bg-ink/10 border border-ink/10">
        {siteConfig.partners.map((partner) => (
          <div
            key={partner}
            className="bg-bone-50 flex items-center justify-center py-14 font-display text-3xl tracking-tight text-ink/70"
          >
            {partner}
          </div>
        ))}
      </div>
    </section>
  );
}
