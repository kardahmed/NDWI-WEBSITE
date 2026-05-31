import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getLocalizedAlternates } from '@/lib/seo/alternates';
import { WorkspaceHero } from '@/components/sections/workspace-hero';
import { WorkspaceGrid } from '@/components/sections/workspace-grid';
import { WorkspaceProcess } from '@/components/sections/workspace-process';
import { WorkspaceImport } from '@/components/sections/workspace-import';
import { WorkspaceReferences } from '@/components/sections/workspace-references';
import { WorkspaceCta } from '@/components/sections/workspace-cta';
import { ProductGrid } from '@/components/sections/product-grid';
import { fetchProductsByCategory } from '@/sanity/queries/products';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'workspace' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: getLocalizedAlternates('/workspace', locale),
  };
}

export default async function WorkspacePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const bureaux = await fetchProductsByCategory('bureau');

  return (
    <>
      <WorkspaceHero />
      <WorkspaceGrid />
      <WorkspaceProcess />
      {bureaux.length > 0 && (
        <>
          <div className="container-page py-12 lg:py-20">
            <div className="max-w-2xl">
              <span className="eyebrow">Catalogue NDO bureaux</span>
              <h2 className="heading-display mt-4 text-display-md">Gammes signature, fond blanc.</h2>
              <p className="mt-4 text-base leading-relaxed text-ink/70">
                Nos collections de mobilier de bureau présentées comme dans un catalogue Vitra ou Herman Miller — produit isolé, lumière studio, focus pur.
              </p>
            </div>
          </div>
          <ProductGrid products={bureaux} />
        </>
      )}
      <WorkspaceImport />
      <WorkspaceReferences />
      <WorkspaceCta />
    </>
  );
}
