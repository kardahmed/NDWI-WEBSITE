'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Compass, Factory, Hammer, ShieldCheck } from 'lucide-react';
import type { Locale } from '@/i18n/routing';

interface ValueProp {
  icon: typeof Compass;
  fr: { title: string; body: string };
  ar: { title: string; body: string };
}

const props: ValueProp[] = [
  {
    icon: Compass,
    fr: {
      title: 'Sur-mesure intégral',
      body: "Chaque ouverture, chaque pièce, chaque finition est dessinée pour le projet. Pas de catalogue figé.",
    },
    ar: {
      title: 'تفصيل كامل حسب الطلب',
      body: 'كل فتحة، كل قطعة، كل تشطيب يُصمَّم خصيصًا للمشروع. لا كتالوج جاهز.',
    },
  },
  {
    icon: Factory,
    fr: {
      title: 'Capacité industrielle Oran',
      body: 'Notre usine d\'Oran absorbe les gros volumes — programmes immobiliers, ministères, hôtels — sans casser les délais.',
    },
    ar: {
      title: 'طاقة صناعية بوهران',
      body: 'مصنعنا بوهران يستوعب الكميات الكبيرة — برامج عقارية، وزارات، فنادق — دون إخلال بالآجال.',
    },
  },
  {
    icon: Hammer,
    fr: {
      title: 'Process italien certifié',
      body: 'Machines et finitions transalpines, équipes formées par nos partenaires italiens. La même exigence du dessin à la pose.',
    },
    ar: {
      title: 'منهج إيطالي معتمد',
      body: 'آلات وتشطيبات إيطالية، فرق مدربة من قبل شركائنا الإيطاليين. نفس الدقة من التصميم إلى التركيب.',
    },
  },
  {
    icon: ShieldCheck,
    fr: {
      title: 'Suivi de chantier dédié',
      body: 'Un référent NDWI sur chaque projet, de la prise de cote au PV de réception. Vous parlez à une seule personne.',
    },
    ar: {
      title: 'متابعة ميدانية مخصصة',
      body: 'مرجع واحد من NDWI لكل مشروع، من أخذ المقاسات إلى محضر الاستلام. تتواصلون مع شخص واحد فقط.',
    },
  },
];

export function RealisationsValueProps() {
  const locale = useLocale() as Locale;

  return (
    <section className="border-t border-ink/10 bg-bone-50 py-16 lg:py-20">
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <span className="eyebrow">
            {locale === 'ar' ? 'لماذا يثقون بنا' : 'Pourquoi ils nous choisissent'}
          </span>
          <h2 className="heading-display mt-4 text-display-md lg:text-display-lg">
            {locale === 'ar'
              ? 'أربعة التزامات. سجلّ مرجعي.'
              : 'Quatre engagements. Un palmarès qui parle.'}
          </h2>
        </div>

        <div className="grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {props.map((p, i) => {
            const Icon = p.icon;
            const content = locale === 'ar' ? p.ar : p.fr;
            return (
              <motion.div
                key={p.fr.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="bg-bone-50 p-8 lg:p-10"
              >
                <Icon
                  size={28}
                  strokeWidth={1.5}
                  className="text-copper-500"
                  aria-hidden
                />
                <h3 className="heading-display mt-6 text-xl lg:text-2xl">{content.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{content.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
