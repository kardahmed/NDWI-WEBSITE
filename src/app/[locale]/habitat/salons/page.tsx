import { setRequestLocale } from 'next-intl/server';
import { HabitatSubpage } from '@/components/sections/habitat-subpage';
import { ProductGrid } from '@/components/sections/product-grid';
import { fetchProductsByCategory } from '@/sanity/queries/products';

export const revalidate = 60;

export const metadata = {
  title: 'Salons & espaces de réception — NDWi · NDO',
  description:
    "Canapés, tables basses, meubles TV. Production locale Algérie NDWi + importation italienne NDO. Salons sur-mesure et collections signature.",
};

export default async function SalonsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const salons = await fetchProductsByCategory('salon');
  return (
    <>
      <HabitatSubpage
        slug="salons"
        univers="salons"
        bullets={[
          {
            fr: 'NDWi production locale : canapés et tables basses fabriqués à Oran avec finitions personnalisables (tissu, cuir, bois).',
            ar: 'إنتاج NDWi المحلي: أرائك وطاولات منخفضة مصنوعة في وهران مع تشطيبات قابلة للتخصيص (قماش، جلد، خشب).',
          },
          {
            fr: 'NDO importation : signatures italiennes haut de gamme — éditeurs partenaires sélectionnés pour leur exigence.',
            ar: 'استيراد NDO: توقيعات إيطالية راقية — ناشرون شركاء مختارون بناء على معاييرهم العالية.',
          },
          {
            fr: 'Sélection en showroom Oran, conception 3D, livraison et installation par nos équipes.',
            ar: 'الاختيار في معرض وهران، التصميم ثلاثي الأبعاد، التسليم والتركيب من قبل فرقنا.',
          },
        ]}
      />
      {salons.length > 0 ? (
        <ProductGrid products={salons} />
      ) : (
        <section className="container-page py-12 lg:py-16 text-center">
          <p className="eyebrow text-copper-500 mb-4">CATALOGUE EN PRÉPARATION</p>
          <h2 className="heading-display text-display-md mb-4">
            Notre collection salons arrive bientôt.
          </h2>
          <p className="max-w-2xl mx-auto text-base text-ink/60 leading-relaxed">
            Pour découvrir nos premières pièces NDWi et nos collections NDO,
            contactez-nous directement ou visitez l&apos;un de nos showrooms.
          </p>
        </section>
      )}
    </>
  );
}
