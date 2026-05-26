'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import type { Locale } from '@/i18n/routing';

/**
 * Bande de chiffres-clés sous le hero — communique immédiatement la dimension du groupe.
 * Les 5 KPIs racontent : ancienneté · réseau · offre · profondeur · clients prestigieux.
 */
const stats = [
  {
    value: '20+',
    label: { fr: "années d'expérience", ar: 'سنوات من الخبرة' },
    note: { fr: 'Fondée en 2005', ar: 'تأسست في 2005' },
  },
  {
    value: '3',
    label: { fr: 'showrooms en Algérie', ar: 'معارض في الجزائر' },
    note: { fr: 'Oran · Alger · Sétif', ar: 'وهران · الجزائر · سطيف' },
  },
  {
    value: '2',
    label: { fr: 'marques jumelles', ar: 'ماركتان توأمتان' },
    note: { fr: 'NDWi locale · NDO importée', ar: 'NDWi محلي · NDO مستورد' },
  },
  {
    value: '7',
    label: { fr: 'univers produits', ar: 'فئات منتجات' },
    note: {
      fr: 'Portes · Cuisines · Chambres · Dressing · Bureaux · Salons · Hôtellerie',
      ar: 'أبواب · مطابخ · غرف · خزائن · مكاتب · صالونات · فندقي',
    },
  },
  {
    value: '6',
    label: { fr: 'institutions publiques', ar: 'مؤسسات عمومية' },
    note: {
      fr: "Grande Mosquée d'Alger · 5 ministères",
      ar: 'الجامع الكبير بالجزائر · 5 وزارات',
    },
  },
] as const;

export function GroupeStats() {
  const locale = useLocale() as Locale;
  return (
    <section className="bg-ink text-bone-50 border-y border-ink/20">
      <div className="container-page py-14 lg:py-18">
        <div className="grid gap-px bg-bone-50/10 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.6,
                delay: Math.min(i * 0.08, 0.4),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="bg-ink p-6 lg:p-8 flex flex-col"
            >
              <p className="font-display text-5xl lg:text-6xl text-copper-500 leading-none">
                {s.value}
              </p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-bone-50/85">
                {s.label[locale]}
              </p>
              <p className="mt-2 text-[10px] text-bone-50/45 leading-snug flex-1">
                {s.note[locale]}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
