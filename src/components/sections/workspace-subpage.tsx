'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { workspaceCategories } from '@/lib/data/workspace';
import { HabitatTrigger } from '@/components/forms/b2c/habitat-trigger';
import type { Locale } from '@/i18n/routing';
import type { LocalizedString } from '@/lib/data/types';

interface WorkspaceSubpageProps {
  slug: string;
  bullets: LocalizedString[];
}

const L = {
  whyTitle: { fr: 'Notre approche', ar: 'مقاربتنا' },
  whySubtitle: { fr: 'Pourquoi NDO Workspace ?', ar: 'لماذا NDO Workspace؟' },
  ctaTitle: { fr: 'Étudions votre projet workspace.', ar: 'لندرس مشروع فضاء عملك.' },
  ctaLead: {
    fr: 'Un consultant dédié vous rappelle sous 24 h pour cadrer votre projet, planifier une visite showroom et préparer une étude personnalisée.',
    ar: 'مستشار مخصص يتصل بك خلال 24 ساعة لتأطير مشروعك، تنسيق زيارة المعرض وإعداد دراسة مخصصة.',
  },
  ctaButton: { fr: 'Demander une étude', ar: 'طلب دراسة' },
  responseTime: { fr: 'Réponse sous 24h', ar: 'رد خلال 24 ساعة' },
  freeQuote: { fr: 'Étude gratuite', ar: 'دراسة مجانية' },
  backLabel: { fr: 'Workspace', ar: 'فضاء العمل' },
};

export function WorkspaceSubpage({ slug, bullets }: WorkspaceSubpageProps) {
  const locale = useLocale() as Locale;
  const cat = workspaceCategories.find((c) => c.slug === slug);
  if (!cat) return null;

  return (
    <>
      <header className="relative overflow-hidden bg-ink text-bone-50">
        {cat.image && (
          <>
            <img
              src={cat.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/75 to-ink/85" aria-hidden />
          </>
        )}
        <div className="relative container-page pt-24 pb-12 lg:pt-32 lg:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="eyebrow !text-copper-400">
              <Link href="/workspace" className="hover:text-bone-50 transition-colors">
                {L.backLabel[locale]}
              </Link>
              <span className="mx-2 text-bone-200/40">/</span>
              {cat.name[locale]}
            </p>
            <h1 className="heading-display mt-5 text-display-lg text-bone-50">
              {cat.name[locale]}
            </h1>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-bone-100/85">
              {cat.longDesc[locale]}
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
            <h3 className="heading-display text-display-md text-bone-50">
              {L.ctaTitle[locale]}
            </h3>
            <p className="mt-5 text-bone-100/80 leading-relaxed">{L.ctaLead[locale]}</p>
            <div className="mt-8">
              <HabitatTrigger
                univers="workspace"
                sourcePage={`/workspace/${slug}`}
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
