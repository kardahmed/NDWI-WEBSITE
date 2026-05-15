import { useTranslations } from 'next-intl';

const layers = [
  { num: '01', titleKey: 'layer1Title', descKey: 'layer1Desc' },
  { num: '02', titleKey: 'layer2Title', descKey: 'layer2Desc' },
  { num: '03', titleKey: 'layer3Title', descKey: 'layer3Desc' },
  { num: '04', titleKey: 'layer4Title', descKey: 'layer4Desc' },
  { num: '05', titleKey: 'layer5Title', descKey: 'layer5Desc' },
];

export function CatalogueComposition() {
  const t = useTranslations('catalogue.composition');

  return (
    <section className="container-page py-24 lg:py-32">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
          <p className="mt-6 text-base leading-relaxed text-ink/70 max-w-prose">
            {t('lead')}
          </p>

          <div className="mt-10 inline-flex items-center gap-3 bg-ink text-bone-50 px-6 py-4">
            <span className="font-display text-4xl text-copper-400">4D</span>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-bone-200/60">
                {t('4dTitle')}
              </p>
              <p className="text-sm font-medium">{t('4dSub')}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-ink/10 border border-ink/10">
          {layers.map((l) => (
            <div key={l.num} className="bg-bone-50 p-5 lg:p-6 flex gap-5">
              <p className="font-display text-3xl text-copper-500/50 flex-shrink-0">{l.num}</p>
              <div>
                <p className="font-display text-lg text-ink">{t(l.titleKey)}</p>
                <p className="mt-1 text-sm text-ink/60 leading-relaxed">{t(l.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
