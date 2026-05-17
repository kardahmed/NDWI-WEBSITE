'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { habitatCategories } from '@/lib/data/habitat';
import { HabitatTrigger } from '@/components/forms/b2c/habitat-trigger';
import type { Locale } from '@/i18n/routing';
import type { LocalizedString } from '@/lib/data/types';

interface HabitatSubpageProps {
  slug: string;
  bullets: LocalizedString[];
  partnerName?: string;
  univers: 'portes' | 'cuisines' | 'chambres' | 'dressing' | 'bureaux' | 'salons' | 'hotellerie' | 'workspace' | 'autre';
}

const L = {
  whyTitle: { fr: 'Notre approche', ar: 'مقاربتنا' },
  whySubtitle: {
    fr: 'Pourquoi le Groupe NDWI ?',
    ar: 'لماذا مجموعة NDWI؟',
  },
  madeWith: { fr: 'Made with', ar: 'بالشراكة مع' },
  ctaTitle: { fr: 'Votre projet, sur-mesure.', ar: 'مشروعك حسب الطلب.' },
  ctaLead: {
    fr: 'Un conseiller dédié vous rappelle sous 24 h pour cadrer votre besoin, planifier une visite showroom et préparer un devis personnalisé.',
    ar: 'مستشار مخصص يتصل بك خلال 24 ساعة لتأطير حاجتك، تنسيق زيارة المعرض وإعداد عرض سعر مخصص.',
  },
  ctaButton: { fr: 'Demander un devis', ar: 'طلب عرض سعر' },
  responseTime: { fr: 'Réponse sous 24h', ar: 'رد خلال 24 ساعة' },
  freeQuote: { fr: 'Devis gratuit', ar: 'عرض سعر مجاني' },
};

export function HabitatSubpage({ slug, bullets, partnerName, univers }: HabitatSubpageProps) {
  const locale = useLocale() as Locale;
  const cat = habitatCategories.find((c) => c.slug === slug);
  if (!cat) return null;

  return (
    <>
      <header className="relative overflow-hidden bg-bone-100">
        {cat.image && (
          <>
            <Image
              src={cat.image}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bone-50/85 via-bone-50/70 to-bone-50/90" aria-hidden />
          </>
        )}
        <div className="relative container-page pt-24 pb-12 lg:pt-32 lg:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="eyebrow">
              <Link href="/habitat" className="hover:text-ink transition-colors">Habitat</Link>
              <span className="mx-2 text-ink/30">/</span>
              {cat.name[locale]}
            </p>
            <h1 className="heading-display mt-5 text-display-lg">{cat.name[locale]}</h1>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink/70">
              {cat.description[locale]}
            </p>
          </motion.div>
        </div>
      </header>

      <section className="container-page py-20 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:items-start">
          <div>
            <span className="eyebrow">{L.whyTitle[locale]}</span>
            <h2 className="heading-display mt-4 text-display-md">{L.whySubtitle[locale]}</h2>
            <ul className="mt-8 space-y-5">
              {bullets.map((b, i) => (
                <li key={i} className="flex gap-4">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center border border-copper-500/30 bg-copper-50/40">
                    <Check size={14} className="text-copper-500" />
                  </span>
                  <p className="text-base leading-relaxed text-ink/80">{b[locale]}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-ink p-10 lg:p-12 text-bone-50">
            {partnerName && (
              <span className="eyebrow !text-copper-400">{L.madeWith[locale]} {partnerName}</span>
            )}
            <h3 className="heading-display mt-4 text-display-md text-bone-50">
              {L.ctaTitle[locale]}
            </h3>
            <p className="mt-5 text-bone-100/80 leading-relaxed">{L.ctaLead[locale]}</p>
            <div className="mt-8">
              <HabitatTrigger
                univers={univers}
                sourcePage={`/habitat/${slug}`}
                label={L.ctaButton[locale]}
                className="!bg-copper-500 !border-copper-500 hover:!bg-copper-600 hover:!border-copper-600"
              />
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-bone-200/40">
              {L.responseTime[locale]} · {L.freeQuote[locale]}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
