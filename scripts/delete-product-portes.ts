/**
 * Supprime tous les documents de type "product" avec category="porte".
 * Évite la duplication avec le schema "door".
 *
 * Usage :
 *   SANITY_MIGRATION_TOKEN=sk... npx tsx scripts/delete-product-portes.ts
 */

import { createClient } from '@sanity/client';

const token = process.env.SANITY_MIGRATION_TOKEN;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ykqpckdm';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

if (!token) {
  console.error('❌ SANITY_MIGRATION_TOKEN env var required');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-01',
  token,
  useCdn: false,
  timeout: 60000,
  maxRetries: 3,
});

async function run() {
  console.log(`🚀 Suppression des portes du schema "product"`);
  const docs = await client.fetch<{ _id: string; name: string }[]>(
    `*[_type == "product" && category == "porte"] { _id, name }`
  );
  console.log(`📦 ${docs.length} documents à supprimer\n`);

  for (const doc of docs) {
    try {
      // Delete both published and draft versions
      await client.delete(doc._id);
      console.log(`  ✅ ${doc.name}`);
    } catch (e) {
      console.log(`  ❌ ${doc.name}: ${e instanceof Error ? e.message : e}`);
    }
  }
  console.log('\n✨ Nettoyage terminé.');
}

run().catch((e) => {
  console.error('Failed:', e);
  process.exit(1);
});
