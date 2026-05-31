import { useTranslations } from 'next-intl';
import { Ship, Globe2, Award, Clock } from 'lucide-react';

export function WorkspaceImport() {
  const t = useTranslations('workspace.importExplained');

  const points = [
    { icon: <Globe2 size={22} />, key: 'origin' },
    { icon: <Award size={22} />, key: 'brands' },
    { icon: <Ship size={22} />, key: 'logistics' },
    { icon: <Clock size={22} />, key: 'delays' },
  ];

  return (
    <section className="bg-ink text-bone-50 py-12 lg:py-16">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="eyebrow !text-copper-400">{t('eyebrow')}</span>
            <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
            <p className="mt-6 text-base leading-relaxed text-bone-200/70 max-w-prose">
              {t('description')}
            </p>
          </div>

          <ul className="grid gap-px bg-bone-200/10 border border-bone-200/10">
            {points.map((p) => (
              <li key={p.key} className="bg-ink p-6 flex items-start gap-5">
                <span className="text-copper-400 flex-shrink-0 mt-1">{p.icon}</span>
                <div>
                  <p className="font-display text-xl">{t(`points.${p.key}.title`)}</p>
                  <p className="mt-2 text-sm text-bone-200/60 leading-relaxed">
                    {t(`points.${p.key}.body`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
