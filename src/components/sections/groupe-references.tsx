'use client';

import { useLocale } from 'next-intl';
import { clientReferences } from '@/lib/data/groupe';
import { LogoMarquee } from '@/components/ui/logo-marquee';
import type { Locale } from '@/i18n/routing';

export function GroupeReferences() {
  const locale = useLocale() as Locale;

  // Tous les logos, mélangés en 2 rangées denses (anti-répétition).
  const all = clientReferences.flatMap((g) => g.clients);
  const rowA = all.filter((_, i) => i % 2 === 0);
  const rowB = all.filter((_, i) => i % 2 === 1);

  return (
    <section className="py-16 lg:py-20 overflow-hidden">
      <div className="container-page">
        <div className="max-w-2xl mb-12">
          <span className="eyebrow text-copper-500">
            {locale === 'ar' ? 'مراجعنا' : 'Nos références'}
          </span>
          <h2 className="heading-display mt-4 text-display-lg">
            {locale === 'ar' ? 'مشاريع تثبت قدرتنا.' : 'Des projets qui parlent pour nous.'}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink/70 max-w-prose">
            {locale === 'ar'
              ? 'الجامع الكبير بالجزائر، عدة وزارات، سوناطراك، كبار المرقّين العقاريين وفنادق مرجعية — هم يثقون بنا.'
              : "La Grande Mosquée d'Alger, plusieurs ministères, Sonatrach, les plus grands promoteurs et des hôtels de référence — ils nous font confiance."}
          </p>
        </div>
      </div>

      {/* 2 rangées denses, sens opposés */}
      <div className="space-y-6">
        <LogoMarquee items={rowA} direction="ltr" durationSec={55} />
        <LogoMarquee items={rowB} direction="rtl" durationSec={55} />
      </div>
    </section>
  );
}
