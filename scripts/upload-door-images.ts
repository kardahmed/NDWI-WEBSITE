/**
 * Upload les heroImage des portes locales vers Sanity et patch chaque doc.
 *
 * Usage :
 *   SANITY_MIGRATION_TOKEN=sk... npx tsx scripts/upload-door-images.ts
 */

import { createClient } from '@sanity/client';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { doors } from '../src/lib/data/doors';

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
  console.log(`🚀 Upload heroImage portes vers Sanity\n`);

  for (const door of doors) {
    if (!door.heroImage) {
      console.log(`  ⏭️  ${door.name} — pas de heroImage statique`);
      continue;
    }
    const fullPath = resolve(process.cwd(), 'public' + door.heroImage);
    if (!existsSync(fullPath)) {
      console.log(`  ❌ ${door.name} — fichier introuvable: ${fullPath}`);
      continue;
    }

    process.stdout.write(`→ ${door.name.padEnd(22)} `);
    try {
      const buffer = readFileSync(fullPath);
      const asset = await client.assets.upload('image', buffer, {
        filename: `${door.slug}.jpg`,
      });
      const docId = `door-${door.slug}`;
      await client.patch(docId).set({
        heroImage: { _type: 'image', asset: { _ref: asset._id } },
      }).commit();
      console.log('✅');
    } catch (e) {
      console.log(`❌ ${e instanceof Error ? e.message : e}`);
    }
  }

  console.log('\n✨ Upload terminé. Rafraîchissez /admin pour voir les thumbnails.');
}

run().catch((e) => {
  console.error('Failed:', e);
  process.exit(1);
});
