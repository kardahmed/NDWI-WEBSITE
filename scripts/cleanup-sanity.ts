/**
 * Cleanup Sanity Phase 4-bis :
 *  1. Migre les catégories obsolètes (interieure/blindee/technique → interieur)
 *  2. Force PHOENIX en 'entree' (porte d'entrée, pas intérieure)
 *  3. Supprime les 2 docs Door orphelins (port-ourida, geo)
 *
 * Usage : SANITY_MIGRATION_TOKEN=sk... npx tsx scripts/cleanup-sanity.ts
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

async function main() {
  console.log('🧹 Cleanup Sanity Phase 4-bis\n');

  // 1. Phoenix → entree (porte d'entrée, doit être catégorisée correctement)
  console.log('1️⃣  Phoenix → category: entree');
  await client
    .patch(`*[_type == "door" && slug.current == "phoenix"][0]._id`)
    .set({ category: 'entree' })
    .commit()
    .catch(async () => {
      // L'_id direct ne marche pas comme ça, utilisons un transaction-via-fetch.
      const phoenix = await client.fetch<{ _id: string } | null>(
        `*[_type == "door" && slug.current == "phoenix"][0]{ _id }`
      );
      if (phoenix) {
        await client.patch(phoenix._id).set({ category: 'entree' }).commit();
        console.log('   ✓ Phoenix patché');
      }
    });

  // 2. Migration des cats obsolètes vers 'interieur' (sauf phoenix déjà traité)
  console.log('\n2️⃣  Migration interieure/blindee/technique → interieur');
  const oldCats = await client.fetch<Array<{ _id: string; slug: { current: string }; category: string }>>(
    `*[_type == "door" && category in ["interieure", "blindee", "technique"]]{ _id, slug, category }`
  );
  let migrated = 0;
  for (const doc of oldCats) {
    if (doc.slug.current === 'phoenix') continue; // déjà traité en entree
    await client.patch(doc._id).set({ category: 'interieur' }).commit();
    console.log(`   ✓ ${doc.slug.current} (${doc.category} → interieur)`);
    migrated++;
  }
  console.log(`   Total : ${migrated} portes migrées`);

  // 3. Suppression des docs orphelins
  console.log('\n3️⃣  Suppression docs orphelins (port-ourida, geo)');
  for (const slug of ['port-ourida', 'geo']) {
    const doc = await client.fetch<{ _id: string } | null>(
      `*[_type == "door" && slug.current == "${slug}"][0]{ _id }`
    );
    if (doc) {
      await client.delete(doc._id);
      console.log(`   ✓ ${slug} supprimé`);
    } else {
      console.log(`   - ${slug} introuvable (déjà supprimé ?)`);
    }
  }

  console.log('\n✅ Cleanup Sanity terminé.');
}

main().catch((e) => {
  console.error('❌', e);
  process.exit(1);
});
