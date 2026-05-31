import { setRequestLocale } from 'next-intl/server';
import { getStaticAlternates } from '@/lib/seo/alternates';
import { HabitatSubpage } from '@/components/sections/habitat-subpage';

export const metadata = {
  title: 'Gamme de finitions — 32 nuances PAIL',
  description:
    "Catalogue complet des finitions PAIL Italie : frêne, chêne, rovere, laqués, effet cuir, métal, brillants. 32 nuances disponibles en showroom.",
    alternates: getStaticAlternates('/habitat/finitions'),
};

export default async function FinitionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <HabitatSubpage
      slug="finitions"
      univers="autre"
      partnerName="PAIL Italie"
      bullets={[
        {
          fr: '32 nuances officielles PAIL — frêne délavé, chêne brossé, rovere fumé, laqués mat ou brillant, effet cuir.',
          ar: '32 لوناً رسمياً من PAIL — دردار باهت، سنديان مصقول، روفير مدخن، مطلي مطفأ أو لامع، تأثير جلد.',
        },
        {
          fr: 'Codes PAIL officiels (0118, 6312, 8765, 8849, 8046...) garantissant la traçabilité et la reproductibilité.',
          ar: 'رموز PAIL رسمية (0118، 6312، 8765، 8849، 8046...) تضمن إمكانية التتبع والتكرار.',
        },
        {
          fr: 'Tous les échantillons matériels disponibles en showroom — toucher, comparer, valider avant production.',
          ar: 'كل العينات المادية متوفرة في المعرض — اللمس، المقارنة، التصديق قبل الإنتاج.',
        },
        {
          fr: 'Vernis ICA pour la durabilité : protection UV, résistance à l\'usure, conformité normes européennes.',
          ar: 'ورنيش ICA للديمومة: حماية UV، مقاومة للاحتكاك، توافق مع المعايير الأوروبية.',
        },
      ]}
    />
  );
}
