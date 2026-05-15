import { setRequestLocale } from 'next-intl/server';
import { HabitatSubpage } from '@/components/sections/habitat-subpage';
import { ProductGrid } from '@/components/sections/product-grid';
import { fetchProductsByCategory } from '@/sanity/queries/products';

export const revalidate = 60;

export const metadata = {
  title: 'Cuisines équipées sur-mesure',
  description:
    "Cuisines en partenariat avec ARAN Cucine Italie. Façades laquées, marbre, chêne massif, finitions PAIL. Conception, fabrication à Oran, pose clé en main.",
};

export default async function CuisinesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cuisines = await fetchProductsByCategory('cuisine');
  return (
    <>
    <HabitatSubpage
      slug="cuisines"
      univers="cuisines"
      partnerName="ARAN Cucine"
      bullets={[
        {
          fr: 'Partenariat exclusif ARAN Cucine Italie — composants, finitions, charnières et systèmes coulissants premium.',
          ar: 'شراكة حصرية مع ARAN Cucine إيطاليا — مكونات وتشطيبات ومفصلات وأنظمة انزلاقية فاخرة.',
        },
        {
          fr: 'Plans 3D personnalisés, choix des matériaux en showroom (laqué, chêne massif, placage noyer, marbre Calacatta).',
          ar: 'مخططات ثلاثية الأبعاد مخصصة، اختيار المواد في المعرض (مطلي، سنديان مصمت، قشرة جوز، رخام كالاكاتا).',
        },
        {
          fr: 'Fabrication à Oran, pose clé en main par nos équipes formées aux process italiens, garantie 5 ans.',
          ar: 'تصنيع في وهران، تركيب جاهز للاستخدام بواسطة فرقنا المدربة على الأساليب الإيطالية، ضمان 5 سنوات.',
        },
        {
          fr: 'SAV intégré : intervention sous 72h dans toutes les wilayas où nos showrooms sont implantés.',
          ar: 'خدمة ما بعد البيع المدمجة: تدخل خلال 72 ساعة في كل الولايات التي تتواجد فيها معارضنا.',
        },
      ]}
    />
    <ProductGrid products={cuisines} />
    </>
  );
}
