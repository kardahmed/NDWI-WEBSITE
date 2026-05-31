import { useLocale } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { NDWI_CONFIGURABLE_SLUGS, doors } from '@/lib/data/doors';
import type { Locale } from '@/i18n/routing';

/**
 * Sélecteur d'entrée du configurateur 3D.
 *
 * Affiché quand l'utilisateur arrive sur /configurateur/portes sans modèle
 * (ou avec un slug invalide / non-NDWi). Force le choix parmi les 4 modèles
 * NDWi vraiment configurables avant de lancer la 3D.
 */
export function ConfiguratorModelPicker() {
  const locale = useLocale() as Locale;

  // On récupère les fiches des modèles NDWi depuis le seed local (toujours dispo).
  const ndwiDoors = NDWI_CONFIGURABLE_SLUGS.map((slug) => doors.find((d) => d.slug === slug)).filter(
    (d): d is NonNullable<typeof d> => d != null
  );

  const L = {
    eyebrow: locale === 'ar' ? 'المُكوِّن ثلاثي الأبعاد' : 'Configurateur 3D',
    title:
      locale === 'ar'
        ? 'اختر طرازك للبدء.'
        : 'Choisissez votre modèle pour commencer.',
    sub:
      locale === 'ar'
        ? 'فقط أبواب NDWi المصنوعة محليًا قابلة للتخصيص (الكسوة، المقبض، الفتح، الأبعاد). أبواب NDO المستوردة تُسلَّم بتشطيبها النهائي.'
        : "Seules les portes NDWi fabriquées localement sont personnalisables (revêtement, poignée, sens, dimensions). Les portes NDO importées sont livrées dans leur finition d’origine.",
    cta: locale === 'ar' ? 'تخصيص هذا الطراز' : 'Configurer ce modèle',
    notSure: locale === 'ar' ? 'لست متأكدًا ؟' : 'Vous hésitez ?',
    browseAll:
      locale === 'ar'
        ? 'تصفح الكتالوج الكامل'
        : 'Parcourir le catalogue complet',
  };

  return (
    <section className="container-page py-12 lg:py-16">
      <div className="max-w-2xl">
        <span className="eyebrow text-copper-500">{L.eyebrow}</span>
        <h1 className="heading-display mt-4 text-display-lg lg:text-display-xl leading-[1.05]">
          {L.title}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-ink/70 lg:text-lg">{L.sub}</p>
      </div>

      <div className="mt-12 grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
        {ndwiDoors.map((door) => (
          <Link
            key={door.slug}
            href={`/configurateur/portes?m=${door.slug}`}
            className="group relative flex flex-col bg-bone-50 p-6 lg:p-8 hover:bg-bone-100 transition-colors min-h-[280px]"
          >
            <div className="flex-1 flex items-center justify-center py-8">
              <p className="font-display text-4xl lg:text-5xl text-ink/20 group-hover:text-ink/30 transition-colors text-center leading-tight">
                {door.name}
              </p>
            </div>
            <div className="border-t border-ink/10 pt-4">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display text-xl text-ink">{door.name}</span>
                <span className="text-[10px] uppercase tracking-[0.16em] text-copper-500">
                  {door.serie}
                </span>
              </div>
              <p className="mt-2 text-xs text-ink/55 line-clamp-2 leading-snug">
                {door.shortDescription[locale]}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-copper-500 group-hover:gap-3 transition-all">
                {L.cta}
                <ArrowUpRight size={14} className="rtl:rotate-90" />
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-baseline gap-4 text-sm text-ink/55">
        <span>{L.notSure}</span>
        <Link href="/habitat/portes" className="link-underline text-copper-500">
          {L.browseAll}
        </Link>
      </div>
    </section>
  );
}
