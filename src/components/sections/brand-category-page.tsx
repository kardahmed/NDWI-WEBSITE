/**
 * Composant rendu par /ndwi/[category] et /ndo/[category].
 * Sait afficher le bon catalogue selon la catégorie demandée (portes / cuisines / chambres / ...).
 */

import { notFound } from 'next/navigation';
import { fetchAllDoors } from '@/sanity/queries/doors';
import { fetchProductsByCategory } from '@/sanity/queries/products';
import { ProductGrid } from '@/components/sections/product-grid';
import { DoorsCatalogue } from '@/components/sections/doors-catalogue';
import { PageHeader } from '@/components/ui/page-header';
import { getBrand, brandCategories } from '@/lib/data/brands';
import { getDoorBrand } from '@/lib/data/doors';
import { getProductBrand } from '@/lib/data/products';
import type { DoorBrand } from '@/lib/data/types';
import type { ProductCategory } from '@/lib/data/products';

interface Props {
  brandSlug: DoorBrand;
  categorySlug: string;
  locale: string;
}

/** Mapping catégorie URL → catégorie produits Sanity. */
const PRODUCT_CATEGORY_MAP: Record<string, ProductCategory> = {
  cuisines: 'cuisine',
  chambres: 'chambre',
  dressing: 'dressing',
  bureaux: 'bureau',
  salons: 'salon',
};

export async function BrandCategoryPage({ brandSlug, categorySlug, locale }: Props) {
  const l: 'fr' | 'ar' = locale === 'ar' ? 'ar' : 'fr';
  const isAr = l === 'ar';
  const brand = getBrand(brandSlug);
  const cat = brandCategories.find((c) => c.slug === categorySlug);
  if (!brand || !cat) notFound();

  const brandLabel = brand.name[l];
  const heroEyebrow = `${brand.tagline[l]} · ${cat.name[l]}`;
  const heroTitle = `${cat.name[l]} ${brandLabel}.`;
  const heroSubtitle = cat.description[l];

  // ───── Portes ─────
  if (categorySlug === 'portes') {
    const allDoors = await fetchAllDoors();
    const doors = allDoors.filter((d) => getDoorBrand(d) === brandSlug);
    return (
      <>
        <PageHeader eyebrow={heroEyebrow} title={heroTitle} subtitle={heroSubtitle} />
        {doors.length > 0 ? (
          <DoorsCatalogue doors={doors} hideBrandTabs />
        ) : (
          <EmptyState brand={brandLabel} cat={cat.name[l]} locale={l} />
        )}
      </>
    );
  }

  // ───── Hôtellerie (segment, pas un type produit dans Sanity) ─────
  if (categorySlug === 'hotellerie') {
    const hotelTitle = isAr ? `حلول فندقية ${brandLabel}.` : `Solutions hôtelières ${brandLabel}.`;
    const hotelSubtitle = isAr
      ? brandSlug === 'ndwi'
        ? 'إنتاج محلي بوهران: أبواب صوتية للطوابق، أثاث الأجنحة، الاستقبال والمطاعم. مراجع Marriott، Rodina، Maraval.'
        : 'تشكيلة إيطالية فاخرة: أبواب فندقية PAIL، أثاث ARAN، تشطيبات ICA. للفنادق من 4 إلى 5 نجوم والمنتجعات.'
      : brandSlug === 'ndwi'
        ? 'Production locale Oran : portes palières acoustiques, mobilier de suite, lobby et restauration. Références Marriott, Rodina, Maraval.'
        : 'Sélection italienne premium : portes hôtelières PAIL, mobilier ARAN, finitions ICA. Pour hôtels 4-5 étoiles et resorts.';
    const hotelBody = isAr
      ? brandSlug === 'ndwi'
        ? 'يتكفل فريقنا الفندقي B2B بمشروعكم من الألف إلى الياء: دراسة تقنية، مخططات، تصنيع وتركيب. آجال من 8 إلى 16 أسبوعًا حسب البرنامج.'
        : 'استيراد مباشر من مصانعنا الشريكة الإيطالية: عرض سعر خلال 7 أيام، تسليم بالحاوية من 6 إلى 10 أسابيع، تركيب من طرف فرقنا.'
      : brandSlug === 'ndwi'
        ? 'Notre équipe hôtellerie B2B prend en charge votre projet de A à Z : étude technique, plans, fabrication et installation. Délai 8 à 16 semaines selon le programme.'
        : 'Importation directe depuis nos usines partenaires italiennes : devis sous 7 jours, livraison conteneur 6 à 10 semaines, installation par nos équipes.';
    return (
      <>
        <PageHeader eyebrow={heroEyebrow} title={hotelTitle} subtitle={hotelSubtitle} />
        <section className="container-page py-12 lg:py-16 text-center">
          <p className="text-base text-ink/70 max-w-2xl mx-auto leading-relaxed">{hotelBody}</p>
        </section>
      </>
    );
  }

  // ───── Catégories produits (cuisines / chambres / dressing / bureaux / salons) ─────
  const productCategory = PRODUCT_CATEGORY_MAP[categorySlug];
  if (!productCategory) notFound();

  const allProducts = await fetchProductsByCategory(productCategory);
  const products = allProducts.filter((p) => getProductBrand(p) === brandSlug);

  return (
    <>
      <PageHeader eyebrow={heroEyebrow} title={heroTitle} subtitle={heroSubtitle} />
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <EmptyState brand={brandLabel} cat={cat.name[l]} locale={l} />
      )}
    </>
  );
}

function EmptyState({ brand, cat, locale }: { brand: string; cat: string; locale: 'fr' | 'ar' }) {
  const isAr = locale === 'ar';
  return (
    <section className="container-page py-12 lg:py-16 text-center">
      <p className="eyebrow text-copper-500 mb-4">
        {isAr ? 'الكتالوج قيد الإعداد' : 'CATALOGUE EN PRÉPARATION'}
      </p>
      <h2 className="heading-display text-display-md mb-4">
        {isAr ? `${cat} ${brand} قريبًا.` : `${cat} ${brand} bientôt disponible.`}
      </h2>
      <p className="max-w-2xl mx-auto text-base text-ink/60 leading-relaxed">
        {isAr
          ? 'يثري فريقنا الكتالوج بانتظام. لاكتشاف القطع المتوفرة أو لإعلامكم فور إضافة موديل جديد، اتصلوا بنا أو زوروا أحد معارضنا.'
          : 'Notre équipe enrichit régulièrement le catalogue. Pour découvrir les pièces existantes ou être notifié dès l’ajout d’un modèle, contactez-nous ou visitez l’un de nos showrooms.'}
      </p>
    </section>
  );
}
