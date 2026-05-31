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

export async function BrandCategoryPage({ brandSlug, categorySlug }: Props) {
  const brand = getBrand(brandSlug);
  const cat = brandCategories.find((c) => c.slug === categorySlug);
  if (!brand || !cat) notFound();

  const brandLabel = brand.name.fr;
  const heroEyebrow = `${brand.tagline.fr} · ${cat.name.fr}`;
  const heroTitle = `${cat.name.fr} ${brandLabel}.`;
  const heroSubtitle = cat.description.fr;

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
          <EmptyState brand={brandLabel} cat={cat.name.fr} />
        )}
      </>
    );
  }

  // ───── Hôtellerie (segment, pas un type produit dans Sanity) ─────
  if (categorySlug === 'hotellerie') {
    return (
      <>
        <PageHeader
          eyebrow={heroEyebrow}
          title={`Solutions hôtelières ${brandLabel}.`}
          subtitle={
            brandSlug === 'ndwi'
              ? 'Production locale Oran : portes palières acoustiques, mobilier de suite, lobby et restauration. Références Marriott, Rodina, Maraval.'
              : 'Sélection italienne premium : portes hôtelières PAIL, mobilier ARAN, finitions ICA. Pour hôtels 4-5 étoiles et resorts.'
          }
        />
        <section className="container-page py-16 lg:py-20 text-center">
          <p className="text-base text-ink/70 max-w-2xl mx-auto leading-relaxed">
            {brandSlug === 'ndwi'
              ? 'Notre équipe hôtellerie B2B prend en charge votre projet de A à Z : étude technique, plans, fabrication et installation. Délai 8 à 16 semaines selon le programme.'
              : 'Importation directe depuis nos usines partenaires italiennes : devis sous 7 jours, livraison conteneur 6 à 10 semaines, installation par nos équipes.'}
          </p>
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
        <EmptyState brand={brandLabel} cat={cat.name.fr} />
      )}
    </>
  );
}

function EmptyState({ brand, cat }: { brand: string; cat: string }) {
  return (
    <section className="container-page py-16 lg:py-20 text-center">
      <p className="eyebrow text-copper-500 mb-4">CATALOGUE EN PRÉPARATION</p>
      <h2 className="heading-display text-display-md mb-4">
        {cat} {brand} bientôt disponible.
      </h2>
      <p className="max-w-2xl mx-auto text-base text-ink/60 leading-relaxed">
        Notre équipe enrichit régulièrement le catalogue. Pour découvrir les pièces existantes ou
        être notifié dès l&apos;ajout d&apos;un modèle, contactez-nous ou visitez l&apos;un de nos
        showrooms.
      </p>
    </section>
  );
}
