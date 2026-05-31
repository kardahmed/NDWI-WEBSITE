'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ProAudienceContent } from '@/lib/data/pro';
import type { Locale } from '@/i18n/routing';
import { ProAudienceTrigger } from '@/components/forms/pro/pro-audience-trigger';

interface ProDetailProps {
  audience: ProAudienceContent;
}

export function ProDetail({ audience }: ProDetailProps) {
  const locale = useLocale() as Locale;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-ink text-bone-50 overflow-hidden">
        {audience.image ? (
          <div className="absolute inset-0">
            <Image
              src={audience.image}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40" aria-hidden />
          </div>
        ) : (
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink-800 to-ink" />
            <div className="absolute -right-1/4 top-1/4 h-[50vw] w-[50vw] rounded-full bg-copper-700/10 blur-3xl" />
          </div>
        )}

        <div className="relative container-page pt-24 pb-28 lg:pt-32 lg:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <span className="eyebrow !text-copper-400">{audience.eyebrow[locale]}</span>
            <h1 className="heading-display mt-6 text-display-xl">{audience.title[locale]}</h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-bone-200/70 md:text-xl">
              {audience.subtitle[locale]}
            </p>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <ProAudienceTrigger
                audienceSlug={audience.slug}
                sourcePage={`/pro/${audience.slug}`}
                label={audience.ctaPrimary[locale]}
                className="!bg-copper-500 !border-copper-500 hover:!bg-copper-600 hover:!border-copper-600"
              />
              {audience.ctaSecondary && (
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 border border-bone-200/30 px-7 py-4 text-sm uppercase tracking-[0.14em] text-bone-50 transition-all hover:border-bone-50"
                >
                  {audience.ctaSecondary[locale]}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="container-page py-12 lg:py-16">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow">{audience.promise[locale]}</span>
          <h2 className="heading-display mt-4 text-display-lg">
            {audience.slug === 'architectes' && (locale === 'fr' ? 'Tout ce qu\'il vous faut.' : 'كل ما تحتاجه.')}
            {audience.slug === 'promoteurs' && (locale === 'fr' ? 'Notre engagement.' : 'التزامنا.')}
            {audience.slug === 'hoteliers' && (locale === 'fr' ? 'Pourquoi NDWI.' : 'لماذا NDWI.')}
            {audience.slug === 'distributeurs' && (locale === 'fr' ? 'Le programme.' : 'البرنامج.')}
          </h2>
        </div>

        <div className="grid gap-px bg-ink/10 border border-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {audience.benefits.map((b, i) => (
            <div key={i} className="bg-bone-50 p-7 lg:p-8">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 h-9 w-9 border border-copper-500/30 text-copper-500 flex items-center justify-center">
                  <Check size={16} strokeWidth={2} />
                </span>
                <div className="flex-1">
                  <h3 className="font-display text-xl text-ink">{b.title[locale]}</h3>
                  <p className="mt-3 text-sm text-ink/65 leading-relaxed">{b.description[locale]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-bone-200/40 border-y border-ink/10 py-12 lg:py-16">
        <div className="container-page">
          <div className="max-w-2xl mx-auto text-center">
            <span className="eyebrow">{locale === 'fr' ? 'Démarrer' : 'البدء'}</span>
            <h2 className="heading-display mt-4 text-display-md">
              {audience.slug === 'architectes' && (locale === 'fr' ? 'Rejoignez l\'Architects Club aujourd\'hui.' : 'انضم إلى Architects Club اليوم.')}
              {audience.slug === 'promoteurs' && (locale === 'fr' ? 'Parlons de votre prochain programme.' : 'لنتحدّث عن برنامجكم القادم.')}
              {audience.slug === 'hoteliers' && (locale === 'fr' ? 'Étudions votre projet hôtelier.' : 'لندرس مشروعكم الفندقي.')}
              {audience.slug === 'distributeurs' && (locale === 'fr' ? 'Candidatez pour rejoindre notre réseau.' : 'ترشّحوا للانضمام إلى شبكتنا.')}
            </h2>
            <p className="mt-6 text-base text-ink/70 max-w-prose mx-auto">
              {audience.subtitle[locale]}
            </p>
            <div className="mt-8 flex justify-center">
              <ProAudienceTrigger
                audienceSlug={audience.slug}
                sourcePage={`/pro/${audience.slug}`}
                label={audience.ctaPrimary[locale]}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
