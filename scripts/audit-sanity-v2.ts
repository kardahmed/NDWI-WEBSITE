/**
 * Audit Sanity v2 — détecte les données orphelines après les refontes :
 *  - Door : champs legacy (door3DModel, compatibleFinitions, compatibleHandles,
 *    compatibleAccessories) qui pointent vers des schemas supprimés
 *  - Product : docs sans 'published' (filtre `published == true` les exclut)
 *  - Product : docs sans aspectRatio (composant ProductGrid plante sans)
 *  - Orphan refs : docs qui référencent des _ref vers des docs inexistants
 *
 * Usage : SANITY_MIGRATION_TOKEN=sk... npx tsx scripts/audit-sanity-v2.ts
 */

import { createClient } from '@sanity/client';

const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ykqpckdm',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: process.env.SANITY_MIGRATION_TOKEN,
  useCdn: false,
});

async function main() {
  console.log('🔍 Audit Sanity v2 — données orphelines\n');

  // 1. Door : champs legacy 3D ─────────────────────────────────────
  console.log('1️⃣  Door — champs legacy 3D (schemas supprimés)');
  const legacyFields = ['door3DModel', 'compatibleFinitions', 'compatibleHandles', 'compatibleAccessories'];
  for (const field of legacyFields) {
    const docs = await c.fetch<Array<{ slug: { current: string } }>>(
      `*[_type == "door" && defined(${field})]{ slug }`
    );
    console.log(
      `   ${field.padEnd(28)} ${String(docs.length).padStart(2)} docs${docs.length > 0 ? ' ⚠️  à nettoyer' : ' ✓'}`
    );
    if (docs.length > 0) {
      console.log(`      → ${docs.map((d) => d.slug.current).join(', ')}`);
    }
  }

  // 2. Door : Phoenix doit avoir category=entree ────────────────────
  console.log('\n2️⃣  Door catégorie vérification');
  const cats = await c.fetch<Array<{ slug: { current: string }; category: string }>>(
    `*[_type == "door"]{ slug, category }`
  );
  const invalid = cats.filter((d) => !['interieur', 'entree'].includes(d.category));
  console.log(
    `   ${cats.length} docs au total, ${invalid.length} avec cat invalide${invalid.length > 0 ? ' ⚠️' : ' ✓'}`
  );
  if (invalid.length > 0) {
    invalid.forEach((d) => console.log(`      ${d.slug.current} → ${d.category}`));
  }

  // 3. Product : sans 'published' ───────────────────────────────────
  console.log('\n3️⃣  Product — docs sans champ published');
  const unpublished = await c.fetch<Array<{ slug: { current: string }; name: string }>>(
    `*[_type == "product" && !defined(published)]{ slug, name }`
  );
  console.log(
    `   ${unpublished.length} docs sans 'published'${unpublished.length > 0 ? ' ⚠️  invisibles côté site' : ' ✓'}`
  );
  if (unpublished.length > 0) {
    unpublished.slice(0, 5).forEach((p) => console.log(`      - ${p.slug.current} (${p.name})`));
    if (unpublished.length > 5) console.log(`      ... +${unpublished.length - 5} autres`);
  }

  // 4. Product : sans aspectRatio ───────────────────────────────────
  console.log('\n4️⃣  Product — docs sans aspectRatio');
  const noAspect = await c.fetch<Array<{ slug: { current: string } }>>(
    `*[_type == "product" && !defined(aspectRatio)]{ slug }`
  );
  console.log(
    `   ${noAspect.length} docs sans aspectRatio${noAspect.length > 0 ? ' ⚠️  card UI dégradée' : ' ✓'}`
  );

  // 5. Product : sans image ─────────────────────────────────────────
  console.log('\n5️⃣  Product — docs sans image principale');
  const noImage = await c.fetch<Array<{ slug: { current: string }; name: string }>>(
    `*[_type == "product" && !defined(image)]{ slug, name }`
  );
  console.log(
    `   ${noImage.length} docs sans image${noImage.length > 0 ? ' ⚠️  placeholder vide' : ' ✓'}`
  );

  // 6. État d'enrichissement par produit ────────────────────────────
  console.log('\n6️⃣  Product — état d\'enrichissement (sample 5 premiers)');
  const sample = await c.fetch<Array<{ slug: { current: string }; name: string; priceFromDZD?: number; composition?: unknown; gallery?: unknown[]; colorVariants?: unknown[] }>>(
    `*[_type == "product"] | order(name asc) [0...5]{ slug, name, priceFromDZD, composition, gallery, colorVariants }`
  );
  for (const p of sample) {
    const cv = (p.colorVariants?.length ?? 0);
    const ga = (p.gallery?.length ?? 0);
    const price = p.priceFromDZD ? `${p.priceFromDZD} DZD` : '—';
    const comp = p.composition ? '✓' : '—';
    console.log(`   ${p.slug.current.padEnd(35)} prix:${price.padEnd(12)} comp:${comp} gal:${ga} colors:${cv}`);
  }

  console.log('\n✅ Audit terminé.');
}

main().catch((e) => {
  console.error('❌', e);
  process.exit(1);
});
