/**
 * Crée le document Door AURÈS dans Sanity à partir du seed local.
 * One-shot — utilisé une seule fois car AURÈS est un nouveau modèle qui
 * n'existait pas dans Sanity Studio.
 *
 * Après ça, relance scripts/seed-sanity-options.ts pour le patcher avec
 * les prix + refs aux options.
 *
 * Usage : SANITY_MIGRATION_TOKEN=sk... npx tsx scripts/seed-aures-door.ts
 */

import { createClient } from '@sanity/client';
import { doors } from '../src/lib/data/doors';

const token = process.env.SANITY_MIGRATION_TOKEN;
if (!token) {
  console.error('❌ SANITY_MIGRATION_TOKEN required');
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ykqpckdm',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token,
  useCdn: false,
});

async function main() {
  const aures = doors.find((d) => d.slug === 'aures');
  if (!aures) {
    console.error('❌ AURÈS introuvable dans le seed');
    process.exit(1);
  }

  console.log('📦 Création du document Door AURÈS dans Sanity…');

  await client.createOrReplace({
    _id: 'door.aures',
    _type: 'door',
    name: aures.name,
    slug: { _type: 'slug', current: aures.slug },
    serie: aures.serie,
    brand: 'ndwi',
    category: aures.category,
    shortDescription: aures.shortDescription,
    description: aures.description,
    finishes: aures.finishes,
    thicknesses: aures.thicknesses,
    features: aures.features,
    securityClass: aures.technicalSpecs?.securityClass,
    acousticDb: aures.technicalSpecs?.acousticDb,
    thicknessExact: aures.technicalSpecs?.thicknessExact,
    composition: aures.composition,
    certifications: aures.certifications,
    priceFromDZD: aures.priceFromDZD,
    dimensionsRange: aures.dimensionsRange,
    compatibleSens: aures.compatibleSens,
    compatibleRevetements: (aures.compatibleRevetements ?? []).map((s) => ({
      _type: 'reference',
      _ref: `revetement.${s}`,
    })),
    compatiblePoignees: (aures.compatiblePoignees ?? []).map((s) => ({
      _type: 'reference',
      _ref: `poignee.${s}`,
    })),
    compatibleSerrures: (aures.compatibleSerrures ?? []).map((s) => ({
      _type: 'reference',
      _ref: `serrure.${s}`,
    })),
    compatibleVitrages: (aures.compatibleVitrages ?? []).map((s) => ({
      _type: 'reference',
      _ref: `vitrage.${s}`,
    })),
    compatibleRemplissages: (aures.compatibleRemplissages ?? []).map((s) => ({
      _type: 'reference',
      _ref: `remplissage.${s}`,
    })),
    badges: aures.badges,
    order: 4,
  });

  console.log('✅ door.aures créé avec succès');
  console.log('   Tu peux maintenant le modifier dans Sanity Studio (/admin).');
}

main().catch((e) => {
  console.error('❌', e);
  process.exit(1);
});
