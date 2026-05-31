import { setRequestLocale } from 'next-intl/server';
import { getStaticAlternates } from '@/lib/seo/alternates';
import { HabitatSubpage } from '@/components/sections/habitat-subpage';

export const metadata = {
  title: 'Chambres complètes sur-mesure',
  description:
    "Têtes de lit capitonnées, rangements intégrés, dressings ouverts. Cohérence avec vos portes intérieures NDWi. Fabrication Oran, finitions PAIL.",
    alternates: getStaticAlternates('/habitat/chambres'),
};

export default async function ChambresPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <HabitatSubpage
      slug="chambres"
      univers="chambres"
      bullets={[
        {
          fr: 'Têtes de lit capitonnées sur-mesure, rangements intégrés (commodes, chevets, coiffeuses) coordonnés avec vos portes.',
          ar: 'رؤوس سرير منجدة حسب الطلب، خزائن مدمجة (كومودينات، طاولات جانبية، طاولات تزيين) منسقة مع أبوابك.',
        },
        {
          fr: 'Choix illimité de tissus et placages : velours, lin, cuir pleine fleur, noyer, chêne, laqués mat ou brillant.',
          ar: 'اختيار غير محدود من الأقمشة والقشور: مخمل، كتان، جلد طبيعي، جوز، سنديان، مطلي مطفأ أو لامع.',
        },
        {
          fr: 'Plans 3D et planches d\'ambiance fournis avant production, validation client systématique.',
          ar: 'مخططات ثلاثية الأبعاد ولوحات أجواء قبل الإنتاج، تصديق العميل بشكل منهجي.',
        },
        {
          fr: 'Compatible avec nos portes palières acoustiques EI30 pour les programmes résidentiels et hôteliers.',
          ar: 'متوافق مع أبواب الطوابق العازلة للصوت EI30 للبرامج السكنية والفندقية.',
        },
      ]}
    />
  );
}
