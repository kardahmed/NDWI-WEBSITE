/**
 * Migration des 40 produits NDWi (cuisines + portes historiques + bureaux)
 * de src/lib/data/products.ts vers le dataset Sanity "production".
 *
 * Upload aussi les images packshot depuis public/images/products/.
 *
 * Usage :
 *   SANITY_MIGRATION_TOKEN=sk... npx tsx scripts/migrate-products.ts
 *
 * Idempotent : createOrReplace avec _id déterministe basé sur le slug.
 */

import { createClient } from '@sanity/client';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { products } from '../src/lib/data/products';

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
  requestTagPrefix: 'migrate-products',
  maxRetries: 3,
  timeout: 60000,
});

async function uploadImage(localPath: string, filename: string): Promise<{ _type: 'image'; asset: { _ref: string } } | null> {
  // localPath = /images/products/cuisines/cirta.jpg → public/images/products/cuisines/cirta.jpg
  const fullPath = resolve(process.cwd(), 'public' + localPath);
  if (!existsSync(fullPath)) {
    console.warn(`  ⚠️  image not found: ${fullPath}`);
    return null;
  }
  const buffer = readFileSync(fullPath);
  const asset = await client.assets.upload('image', buffer, { filename });
  return { _type: 'image', asset: { _ref: asset._id } };
}

async function migrate() {
  console.log(`🚀 Migration vers projet ${projectId} / dataset ${dataset}`);
  console.log(`📦 ${products.length} produits à importer\n`);

  let order = 10;
  for (const p of products) {
    const docId = `product-${p.slug}`;
    const filename = `${p.slug}.jpg`;

    process.stdout.write(`→ ${p.name.padEnd(28)} `);
    const image = await uploadImage(p.image, filename);
    if (!image) {
      console.log('❌ (image missing, skip)');
      continue;
    }

    const doc = {
      _id: docId,
      _type: 'product',
      name: p.name,
      slug: { _type: 'slug', current: p.slug },
      category: p.category,
      collection: p.collection ?? '',
      shortDescription: {
        _type: 'localeString',
        fr: p.shortDescription.fr,
        ar: p.shortDescription.ar,
      },
      description: p.description
        ? { _type: 'localeText', fr: p.description.fr, ar: p.description.ar }
        : undefined,
      image,
      aspectRatio: p.aspectRatio,
      tags: p.tags ?? [],
      order,
      published: true,
    };
    order += 10;

    try {
      await client.createOrReplace(doc);
      console.log('✅');
    } catch (e) {
      console.log(`❌ ${e instanceof Error ? e.message : e}`);
    }
  }

  console.log('\n✨ Migration terminée. Vérifiez : http://localhost:3000/admin');
  console.log(`⚠️  Pensez à révoquer le token : https://sanity.io/manage/project/${projectId}/api`);
}

migrate().catch((e) => {
  console.error('Migration failed:', e);
  process.exit(1);
});
