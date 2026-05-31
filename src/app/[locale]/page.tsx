import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getLocalizedAlternates } from '@/lib/seo/alternates';

// Sections "marketing" home
import { Hero } from '@/components/sections/hero';
import { Universes } from '@/components/sections/universes';
import { ShowroomsTeaser } from '@/components/sections/showrooms-teaser';
import { ProGateways } from '@/components/sections/pro-gateways';

// Sections "storytelling" groupe
import { GroupeStats } from '@/components/sections/groupe-stats';
import { GroupeStory } from '@/components/sections/groupe-story';
import { GroupeFounder } from '@/components/sections/groupe-founder';
import { GroupeBrands } from '@/components/sections/groupe-brands';
import { GroupeFactory } from '@/components/sections/groupe-factory';
import { GroupePartners } from '@/components/sections/groupe-partners';
import { GroupeReferences } from '@/components/sections/groupe-references';
import { GroupeNextProject } from '@/components/sections/groupe-next-project';
import { ProductsShowcase } from '@/components/sections/products-showcase';

/**
 * Home unifiée — flow narratif accroche → preuve → action.
 *
 *  1. ACCROCHE   — Hero (promesse) + Stats (chiffres clés)
 *  2. OFFRE      — Brands (2 marques) + Universes (7 catégories) + Showcase (catalogue)
 *  3. PREUVE     — Références (marquee logos, remonté) + Partenaires + Usine
 *  4. HISTOIRE   — Story (importation → fabrication) + Founder (l'homme)
 *  5. ACTION     — Showrooms + Next + Pro
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'groupe.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: getLocalizedAlternates('', locale),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* 1. ACCROCHE */}
      <Hero />
      <GroupeStats />

      {/* 2. OFFRE */}
      <GroupeBrands />
      <Universes />
      <ProductsShowcase />

      {/* 3. PREUVE — remontée : la confiance des donneurs d'ordre d'abord */}
      <GroupeReferences />
      <GroupePartners />
      <GroupeFactory />

      {/* 4. HISTOIRE */}
      <GroupeStory />
      <GroupeFounder />

      {/* 5. ACTION */}
      <ShowroomsTeaser />
      <GroupeNextProject />
      <ProGateways />
    </>
  );
}
