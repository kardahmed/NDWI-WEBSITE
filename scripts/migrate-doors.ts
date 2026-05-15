/**
 * Migration one-shot : importe les 12 portes statiques de src/lib/data/doors.ts
 * dans le dataset Sanity "production".
 *
 * Usage :
 *   SANITY_MIGRATION_TOKEN=sk... npx tsx scripts/migrate-doors.ts
 *
 * Idempotent : utilise createOrReplace avec un _id déterministe basé sur le slug.
 */

import { createClient } from '@sanity/client';
import { doors } from '../src/lib/data/doors';

const token = process.env.SANITY_MIGRATION_TOKEN;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ykqpckdm';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

if (!token) {
  console.error('❌ SANITY_MIGRATION_TOKEN env var required (Editor or Administrator token)');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-01',
  token,
  useCdn: false,
});

async function migrate() {
  console.log(`🚀 Migration vers projet ${projectId} / dataset ${dataset}`);
  console.log(`📦 ${doors.length} portes à importer\n`);

  let order = 10;
  for (const door of doors) {
    const docId = `door-${door.slug}`;
    const doc = {
      _id: docId,
      _type: 'door',
      name: door.name,
      slug: { _type: 'slug', current: door.slug },
      serie: door.serie,
      category: door.category,
      shortDescription: { _type: 'localeString', fr: door.shortDescription.fr, ar: door.shortDescription.ar },
      description: { _type: 'localeText', fr: door.description.fr, ar: door.description.ar },
      finishes: door.finishes,
      thicknesses: door.thicknesses,
      features: door.features.map((f) => ({ _type: 'localeString', fr: f.fr, ar: f.ar })),
      fireRating: door.technicalSpecs?.fireRating ?? '',
      acousticDb: door.technicalSpecs?.acousticDb,
      securityClass: door.technicalSpecs?.securityClass ?? '',
      badges: door.badges ?? [],
      order,
    };
    order += 10;

    try {
      await client.createOrReplace(doc);
      console.log(`  ✅ ${door.name.padEnd(22)} (${door.slug})`);
    } catch (e) {
      console.error(`  ❌ ${door.name}:`, e instanceof Error ? e.message : e);
    }
  }

  console.log('\n✨ Migration terminée. Vérifiez dans le Studio : http://localhost:3000/admin');
  console.log('⚠️  N\'oubliez pas de SUPPRIMER le token de migration depuis sanity.io/manage/project/' + projectId + '/api');
}

migrate().catch((e) => {
  console.error('Migration failed:', e);
  process.exit(1);
});
