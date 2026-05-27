'use client';

import { useLocale } from 'next-intl';
import { clientReferences } from '@/lib/data/groupe';
import { LogoMarquee } from '@/components/ui/logo-marquee';
import type { Locale } from '@/i18n/routing';

export function GroupeReferences() {
  const locale = useLocale() as Locale;
  return (
    <section className="py-24 lg:py-32 overflow-hidden">
      <div className="container-page">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow text-copper-500">
            {locale === 'ar' ? 'مراجعنا' : 'Nos références'}
          </span>
          <h2 className="heading-display mt-4 text-display-lg">
            {locale === 'ar' ? 'مشاريع تثبت قدرتنا.' : 'Des projets qui parlent pour nous.'}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink/70 max-w-prose">
            {locale === 'ar'
              ? 'من المؤسسات العمومية الكبرى إلى أرقى المرقّين العقاريين — أصبحنا الشريك المرجعي للمشاريع التي لا تقبل المساومة على الجودة.'
              : "Des grandes institutions publiques aux promoteurs les plus exigeants — nous sommes devenus le partenaire de référence pour les projets qui ne transigent pas sur la qualité."}
          </p>
        </div>
      </div>

      {/* Marquees défilants — un par groupe */}
      <div className="space-y-10">
        {clientReferences.map((group, idx) => (
          <div key={group.category.fr}>
            <div className="container-page">
              <p className="text-xs uppercase tracking-[0.16em] text-copper-500 mb-4">
                {group.category[locale]}
              </p>
            </div>
            <LogoMarquee
              items={group.clients}
              direction={idx % 2 === 1 ? 'rtl' : 'ltr'}
              durationSec={group.clients.length > 6 ? 50 : 38}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
