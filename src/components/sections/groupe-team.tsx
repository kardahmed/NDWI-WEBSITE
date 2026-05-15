import { useLocale, useTranslations } from 'next-intl';
import { teamMembers } from '@/lib/data/groupe';
import type { Locale } from '@/i18n/routing';

export function GroupeTeam() {
  const locale = useLocale() as Locale;
  const t = useTranslations('groupe.team');

  return (
    <section className="bg-bone-200/40 border-y border-ink/10 py-24 lg:py-32">
      <div className="container-page">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
          <p className="mt-6 text-base leading-relaxed text-ink/70 max-w-prose">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid gap-px bg-ink/10 border border-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((m) => (
            <div key={m.name} className="bg-bone-50 p-8 flex flex-col">
              <div className="aspect-square bg-gradient-to-br from-bone-200 to-bone-100 mb-6 flex items-center justify-center">
                <span className="font-display text-5xl text-ink/15">
                  {m.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <p className="font-display text-xl text-ink">{m.name}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-copper-500">
                {m.role[locale]}
              </p>
              {m.bio && (
                <p className="mt-4 text-sm leading-relaxed text-ink/60">{m.bio[locale]}</p>
              )}
            </div>
          ))}

          {/* Placeholder pour futurs membres */}
          {teamMembers.length < 4 && (
            <div className="bg-bone-50/50 p-8 flex items-center justify-center min-h-[20rem] text-center border border-dashed border-ink/10">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/30">
                {t('moreSoon')}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
