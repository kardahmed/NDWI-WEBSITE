import { setRequestLocale } from 'next-intl/server';
import { getStaticAlternates } from '@/lib/seo/alternates';
import { HabitatSubpage } from '@/components/sections/habitat-subpage';

export const metadata = {
  title: 'Dressings sur-mesure',
  description:
    "Dressings modulaires ou intégrés, walk-in closet, îlots centraux. Conception 3D, finitions PAIL, fabrication Oran.",
    alternates: getStaticAlternates('/habitat/dressing'),
};

export default async function DressingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <HabitatSubpage
      slug="dressing"
      univers="dressing"
      bullets={[
        {
          fr: 'Modulables, intégrés ou walk-in closet : adaptation au volume de chaque pièce, du studio au master bedroom.',
          ar: 'معيارية، مدمجة أو خزائن قابلة للدخول: تكيف مع حجم كل غرفة، من الاستوديو إلى غرفة النوم الرئيسية.',
        },
        {
          fr: 'Aménagements intelligents : penderies coulissantes, tiroirs à fermeture amortie, cravatières, range-chaussures lumineux.',
          ar: 'ترتيبات ذكية: علاقات منزلقة، أدراج بإغلاق ممتص، أدراج للربطات، خزائن أحذية مضاءة.',
        },
        {
          fr: 'Finitions raffinées : placage noyer, chêne brossé, laqué effet velours, miroirs intégrés, éclairage LED.',
          ar: 'تشطيبات راقية: قشرة جوز، سنديان مصقول، مطلي بتأثير المخمل، مرايا مدمجة، إضاءة LED.',
        },
        {
          fr: 'Plans 3D inclus, conception en showroom, pose par notre équipe spécialisée.',
          ar: 'مخططات ثلاثية الأبعاد مشمولة، التصميم في المعرض، التركيب بواسطة فريقنا المتخصص.',
        },
      ]}
    />
  );
}
