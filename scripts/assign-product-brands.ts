/**
 * Assigne automatiquement les brands aux 23 produits Sanity sans marque :
 *  - cuisines (15) → NDO  (ARAN importé d'Italie)
 *  - bureaux  (8)  → NDWi (production locale)
 *
 * Tu pourras ajuster au cas par cas dans Studio si certains produits
 * sont des exceptions.
 *
 * Usage : SANITY_MIGRATION_TOKEN=sk... npx tsx scripts/assign-product-brands.ts
 */

import { createClient } from '@sanity/client';

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

const RULES: Record<string, 'ndwi' | 'ndo'> = {
  cuisine: 'ndo',
  bureau: 'ndwi',
  chambre: 'ndwi',
  dressing: 'ndwi',
  salon: 'ndo',
};

async function main() {
  console.log('🏷  Attribution automatique des brands aux produits sans marque\n');

  const products = await client.fetch<Array<{ _id: string; slug: { current: string }; name: string; category: string; brand?: string }>>(
    `*[_type == "product" && !defined(brand)]{ _id, slug, name, category, brand }`
  );

  console.log(`Trouvé ${products.length} produits sans brand.\n`);

  let n = 0;
  for (const p of products) {
    const assigned = RULES[p.category];
    if (!assigned) {
      console.log(`  - ${p.slug.current} (cat=${p.category}) : pas de règle, skip`);
      continue;
    }
    await client.patch(p._id).set({ brand: assigned }).commit();
    console.log(`  ✓ ${p.slug.current.padEnd(40)} → ${assigned.toUpperCase()} (${p.category})`);
    n++;
  }

  console.log(`\n✅ ${n} produits taggés.`);
  console.log('\n💡 Tu peux ajuster au cas par cas dans Sanity Studio (Cuisines & Bureaux).');
}

main().catch((e) => {
  console.error('❌', e);
  process.exit(1);
});
