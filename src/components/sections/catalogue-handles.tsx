import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { doorHandles, handleFinishLabels, getHandleImageUrl } from '@/lib/data/door-handles';
import type { Locale } from '@/i18n/routing';

export function CatalogueHandles() {
  const locale = useLocale() as Locale;
  const t = useTranslations('catalogue.handles');

  return (
    <section className="container-page py-24 lg:py-32">
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16 mb-12 lg:items-end">
        <div>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
          <p className="mt-6 text-base leading-relaxed text-ink/70 max-w-prose">
            {t('lead')}
          </p>
        </div>
        <p className="text-xs uppercase tracking-[0.16em] text-copper-500">
          {doorHandles.length} {t('models')}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {doorHandles.map((h) => (
          <div key={h.slug} className="bg-bone-50 border border-ink/10 p-4 flex flex-col">
            <div className="relative aspect-[16/10] mb-3 bg-bone-100 flex items-center justify-center overflow-hidden">
              <Image
                src={getHandleImageUrl(h)}
                alt={h.name}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
            </div>
            <p className="font-display text-base text-ink">{h.name}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-ink/50 line-clamp-1">
              {h.style[locale]}
            </p>
            <p className="mt-2 text-[10px] text-copper-500 line-clamp-1">
              {handleFinishLabels[h.finishes[0]][locale]}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}
