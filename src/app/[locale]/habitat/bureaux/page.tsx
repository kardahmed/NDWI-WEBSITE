import { setRequestLocale } from 'next-intl/server';
import { getStaticAlternates } from '@/lib/seo/alternates';
import { HabitatSubpage } from '@/components/sections/habitat-subpage';
import { ProductGrid } from '@/components/sections/product-grid';
import { fetchProductsByCategory } from '@/sanity/queries/products';

export const revalidate = 60;

export const metadata = {
  title: 'Bureaux & mobilier workspace — NDWi · NDO',
  description:
    "Mobilier de bureau exécutif et open-space. Production locale Algérie NDWi + importation italienne NDO. Direction, réunion, réception, cloisons modulaires.",
    alternates: getStaticAlternates('/habitat/bureaux'),
};

export default async function BureauxPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const bureaux = await fetchProductsByCategory('bureau');
  return (
    <>
      <HabitatSubpage
        slug="bureaux"
        univers="bureaux"
        bullets={[
          {
            fr: 'Deux gammes complémentaires : NDWi pour la production locale en Algérie (livraison rapide, prix maîtrisés) et NDO pour l\'importation italienne (signatures haut de gamme).',
            ar: 'مجموعتان متكاملتان: NDWi للإنتاج المحلي في الجزائر (تسليم سريع، أسعار مدروسة) و NDO للاستيراد الإيطالي (توقيعات راقية).',
          },
          {
            fr: 'Direction · Open-space · Salle de réunion · Réception · Cloisons modulaires. Du poste individuel à l\'aménagement d\'étage complet.',
            ar: 'إدارة · فضاء مفتوح · قاعة اجتماعات · استقبال · جدران معيارية. من المكتب الفردي إلى تجهيز طابق كامل.',
          },
          {
            fr: 'Conception 3D personnalisée, livraison et installation par nos équipes, SAV 5 ans sur toute la quincaillerie.',
            ar: 'تصميم ثلاثي الأبعاد مخصص، التسليم والتركيب من قبل فرقنا، خدمة ما بعد البيع 5 سنوات على كل الإكسسوارات.',
          },
        ]}
      />
      <ProductGrid products={bureaux} />
    </>
  );
}
