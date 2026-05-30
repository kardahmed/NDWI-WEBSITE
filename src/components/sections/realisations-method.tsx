'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';

interface Step {
  num: string;
  fr: { title: string; body: string };
  ar: { title: string; body: string };
}

const steps: Step[] = [
  {
    num: '01',
    fr: {
      title: 'Étude technique',
      body: 'Visite de chantier, prise de cotes, analyse des contraintes (acoustique, sécurité, normes). Devis détaillé sous 7 jours.',
    },
    ar: {
      title: 'الدراسة التقنية',
      body: 'زيارة الموقع، أخذ المقاسات، تحليل القيود (الصوتية، الأمنية، المعايير). عرض تفصيلي خلال 7 أيام.',
    },
  },
  {
    num: '02',
    fr: {
      title: 'Conception 3D',
      body: 'Plans techniques + rendus 3D photoréalistes. Validation client à chaque jalon avant lancement production.',
    },
    ar: {
      title: 'تصميم ثلاثي الأبعاد',
      body: 'مخططات تقنية + عروض ثلاثية الأبعاد واقعية. اعتماد العميل عند كل مرحلة قبل بدء الإنتاج.',
    },
  },
  {
    num: '03',
    fr: {
      title: 'Fabrication Oran',
      body: 'Production locale dans notre usine — bois massif, panneaux nobles, finitions italiennes. Contrôle qualité à chaque poste.',
    },
    ar: {
      title: 'التصنيع بوهران',
      body: 'إنتاج محلي في مصنعنا — خشب صلب، ألواح راقية، تشطيبات إيطالية. مراقبة جودة في كل مرحلة.',
    },
  },
  {
    num: '04',
    fr: {
      title: 'Pose & SAV',
      body: 'Pose par nos équipes certifiées. PV de réception signé. Garantie & SAV assurés directement par NDWI, sans intermédiaire.',
    },
    ar: {
      title: 'التركيب وخدمة ما بعد البيع',
      body: 'تركيب بواسطة فرقنا المعتمدة. محضر استلام موقّع. الضمان والخدمة مباشرة من NDWI، دون وسيط.',
    },
  },
];

export function RealisationsMethod() {
  const locale = useLocale() as Locale;

  return (
    <section className="bg-ink py-24 text-bone-50 lg:py-32">
      <div className="container-page">
        <div className="mb-16 max-w-2xl">
          <span className="eyebrow text-copper-400">
            {locale === 'ar' ? 'منهجيتنا' : 'Notre méthode'}
          </span>
          <h2 className="heading-display mt-4 text-display-md text-bone-50 lg:text-display-lg">
            {locale === 'ar'
              ? 'من النية إلى التسليم — أربع مراحل.'
              : "De l'intention à la livraison — quatre étapes."}
          </h2>
          <p className="mt-6 max-w-prose text-base leading-relaxed text-bone-200/70">
            {locale === 'ar'
              ? 'لا ارتجال. كل مشروع يتبع نفس التسلسل المنظم الذي يضمن الالتزام بالآجال والجودة.'
              : "Pas d'improvisation. Chaque projet suit la même séquence rigoureuse — garantie de tenue des délais et de la qualité."}
          </p>
        </div>

        <div className="grid gap-px border border-bone-200/10 bg-bone-200/10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const c = locale === 'ar' ? s.ar : s.fr;
            return (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative bg-ink p-8 lg:p-10"
              >
                <span className="font-display text-5xl text-copper-500/80 lg:text-6xl">
                  {s.num}
                </span>
                <h3 className="heading-display mt-6 text-xl text-bone-50 lg:text-2xl">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-bone-200/70">{c.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
