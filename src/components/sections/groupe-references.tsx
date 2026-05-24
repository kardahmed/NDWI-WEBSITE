'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { references, clientReferences } from '@/lib/data/groupe';
import type { Locale } from '@/i18n/routing';

export function GroupeReferences() {
  const locale = useLocale() as Locale;
  return (
    <section className="container-page py-24 lg:py-32">
      <div className="max-w-2xl mb-14">
        <span className="eyebrow text-copper-500">
          {locale === 'ar' ? 'مراجعنا' : 'Nos références'}
        </span>
        <h2 className="heading-display mt-4 text-display-lg">
          {locale === 'ar'
            ? 'مشاريع تثبت قدرتنا.'
            : 'Des projets qui parlent pour nous.'}
        </h2>
        <p className="mt-6 text-base leading-relaxed text-ink/70 max-w-prose">
          {locale === 'ar'
            ? 'من المؤسسات العمومية الكبرى إلى أرقى المرقّين العقاريين — أصبحنا الشريك المرجعي للمشاريع التي لا تقبل المساومة على الجودة.'
            : "Des grandes institutions publiques aux promoteurs les plus exigeants — nous sommes devenus le partenaire de référence pour les projets qui ne transigent pas sur la qualité."}
        </p>
      </div>

      {/* Références clients officielles — groupées, avec emplacement logo */}
      <div className="space-y-12">
        {clientReferences.map((group) => (
          <div key={group.category.fr}>
            <p className="text-xs uppercase tracking-[0.16em] text-copper-500 mb-5">
              {group.category[locale]}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-ink/10 border border-ink/10">
              {group.clients.map((client) => (
                <div
                  key={client.name}
                  className="bg-bone-50 flex items-center justify-center p-6 aspect-[16/9] text-center"
                  title={client.name}
                >
                  {client.logo ? (
                    <Image
                      src={client.logo}
                      alt={client.name}
                      width={160}
                      height={64}
                      className="max-h-16 w-auto object-contain"
                    />
                  ) : (
                    <span className="font-display text-lg lg:text-xl text-ink leading-tight">
                      {client.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Projets détaillés (hôtellerie) — preuves chiffrées */}
      {references.length > 0 && (
        <>
          <p className="eyebrow !text-ink/40 mt-20 mb-8">
            {locale === 'ar' ? 'مشاريع مفصّلة' : 'Projets détaillés'}
          </p>
          <div className="grid gap-px bg-ink/10 border border-ink/10 sm:grid-cols-2">
            {references.map((r) => (
              <article key={r.client} className="bg-bone-50 p-8 lg:p-10 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="font-display text-2xl lg:text-3xl">{r.client}</h3>
                  {r.year && (
                    <span className="text-xs uppercase tracking-[0.16em] text-ink/40 mt-2">
                      {r.year}
                    </span>
                  )}
                </div>
                <p className="text-xs uppercase tracking-[0.16em] text-copper-500 mb-4">
                  {r.type[locale]}
                </p>
                <p className="text-sm leading-relaxed text-ink/65">{r.scope[locale]}</p>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
