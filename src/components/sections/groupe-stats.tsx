'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import type { Locale } from '@/i18n/routing';
import { NumberTicker } from '@/components/ui/number-ticker';

/**
 * Bande de chiffres-clés sous le hero — communique immédiatement la dimension du groupe.
 * Les 5 KPIs racontent : ancienneté · réseau · offre · profondeur · clients prestigieux.
 *
 * Phase Design 5.1 : les valeurs numériques s'animent (count-up) quand
 * la section entre dans le viewport via NumberTicker.
 */
const stats = [
  {
    /** value entière pour le ticker, suffix pour le visuel. */
    num: 20,
    suffix: '+',
    label: { fr: "années d'expérience", ar: 'سنوات من الخبرة' },
    note: { fr: 'Fondée en 2005', ar: 'تأسست في 2005' },
  },
  {
    num: 3,
    suffix: '',
    label: { fr: 'showrooms en Algérie', ar: 'معارض في الجزائر' },
    note: { fr: 'Oran · Alger · Sétif', ar: 'وهران · الجزائر · سطيف' },
  },
  {
    num: 2,
    suffix: '',
    label: { fr: 'marques jumelles', ar: 'ماركتان توأمتان' },
    note: { fr: 'NDWi locale · NDO importée', ar: 'NDWi محلي · NDO مستورد' },
  },
  {
    num: 7,
    suffix: '',
    label: { fr: 'univers produits', ar: 'فئات منتجات' },
    note: {
      fr: 'Portes · Cuisines · Chambres · Dressing · Bureaux · Salons · Hôtellerie',
      ar: 'أبواب · مطابخ · غرف · خزائن · مكاتب · صالونات · فندقي',
    },
  },
  {
    num: 6,
    suffix: '',
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
              key={s.num}
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
                <NumberTicker
                  value={s.num}
                  suffix={s.suffix}
                  duration={1600 + i * 80}
                />
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
