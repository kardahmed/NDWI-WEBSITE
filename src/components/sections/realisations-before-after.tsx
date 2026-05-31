'use client';

import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { BeforeAfterSlider } from '@/components/ui/before-after';

/**
 * Section démo Avant/Après sur la page Réalisations.
 *
 * Pour l'instant utilise les photos hero existantes en placeholder.
 * Quand le client fournit de vraies paires avant/après pose, remplacer
 * les `beforeSrc` / `afterSrc` ci-dessous (ou plus tard : tirer depuis
 * Sanity sur le doc Realisation).
 */
export function RealisationsBeforeAfter() {
  const locale = useLocale() as Locale;
  const L = locale;

  return (
    <section className="border-t border-ink/10 bg-bone-100 py-12 lg:py-16">
      <div className="container-page">
        <div className="mb-10 max-w-2xl">
          <span className="eyebrow">
            {L === 'ar' ? 'النتيجة' : 'Le résultat'}
          </span>
          <h2 className="heading-display mt-3 text-display-md lg:text-display-lg">
            {L === 'ar' ? 'انظر التحول.' : 'Voyez la transformation.'}
          </h2>
          <p className="mt-5 text-base lg:text-lg text-ink/70 leading-relaxed">
            {L === 'ar'
              ? 'اسحب الشريط الأبيض لمقارنة الحالة قبل التركيب وبعد التركيب من فرقنا.'
              : 'Glissez la poignée pour comparer l’avant et l’après pose par nos équipes.'}
          </p>
        </div>

        <BeforeAfterSlider
          beforeSrc="/images/hero/habitat.jpg"
          afterSrc="/images/hero/luxury-interior.jpg"
          beforeLabel={L === 'ar' ? 'قبل' : 'Avant'}
          afterLabel={L === 'ar' ? 'بعد NDWI' : 'Après NDWI'}
          initial={45}
        />

        <p className="mt-4 text-[11px] text-ink/40 text-center italic">
          {L === 'ar'
            ? 'صور توضيحية — يتم استبدالها بصور المشاريع الحقيقية.'
            : 'Photos illustratives — à remplacer par des vraies paires avant/après pose.'}
        </p>
      </div>
    </section>
  );
}
