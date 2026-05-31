import { useLocale, useTranslations } from 'next-intl';
import { Hammer, Sparkles, HandshakeIcon, Flag } from 'lucide-react';
import { groupeValues } from '@/lib/data/groupe';
import type { Locale } from '@/i18n/routing';

const iconMap = {
  craft: <Hammer size={22} />,
  italian: <Sparkles size={22} />,
  service: <HandshakeIcon size={22} />,
  algerian: <Flag size={22} />,
} as const;

export function GroupeValues() {
  const locale = useLocale() as Locale;
  const t = useTranslations('groupe.values');

  return (
    <section className="bg-bone-200/40 border-y border-ink/10 py-12 lg:py-16">
      <div className="container-page">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
        </div>

        <div className="grid gap-px bg-ink/10 border border-ink/10 sm:grid-cols-2">
          {groupeValues.map((v) => (
            <div key={v.icon} className="bg-bone-50 p-8 lg:p-10">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-copper-500/30 text-copper-500 mb-6">
                {iconMap[v.icon as keyof typeof iconMap]}
              </span>
              <h3 className="font-display text-2xl text-ink">{v.title[locale]}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ink/70 max-w-prose">
                {v.body[locale]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
