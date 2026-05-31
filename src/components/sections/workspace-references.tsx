import { useLocale, useTranslations } from 'next-intl';
import { workspaceReferences } from '@/lib/data/workspace';
import type { Locale } from '@/i18n/routing';

export function WorkspaceReferences() {
  const locale = useLocale() as Locale;
  const t = useTranslations('workspace.references');

  // Tant qu'il n'y a pas de références confirmées + logos, on n'affiche pas la section.
  if (workspaceReferences.length === 0) return null;

  return (
    <section className="container-page py-12 lg:py-16">
      <div className="max-w-2xl mb-12">
        <span className="eyebrow">{t('eyebrow')}</span>
        <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
        <p className="mt-6 text-base leading-relaxed text-ink/70 max-w-prose">
          {t('subtitle')}
        </p>
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-ink/10 border border-ink/10">
        {workspaceReferences.map((ref) => (
          <li
            key={ref.name}
            className="bg-bone-50 p-6 flex flex-col items-center justify-center text-center min-h-[7rem]"
          >
            <p className="font-display text-lg text-ink">{ref.name}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink/40">
              {ref.sector[locale]}
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-xs text-ink/40 italic">
        * {t('disclaimer')}
      </p>
    </section>
  );
}
