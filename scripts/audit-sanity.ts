/**
 * Audit Sanity — comptage par type + détection données orphelines.
 * Usage : SANITY_MIGRATION_TOKEN=sk... npx tsx scripts/audit-sanity.ts
 */

import { createClient } from '@sanity/client';

const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ykqpckdm',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: process.env.SANITY_MIGRATION_TOKEN,
  useCdn: false,
});

const types = [
  'door', 'product', 'ndoProduct', 'realisation', 'showroom', 'blogPost',
  'finition', 'door3DModel', 'handle3D', 'accessory',
  'revetement', 'poignee', 'serrure', 'vitrage', 'remplissage',
];

async function main() {
  console.log('📊 Sanity inventory\n');
  for (const t of types) {
    const n = await c.fetch<number>(`count(*[_type == "${t}"])`);
    console.log(`  ${t.padEnd(15)} ${String(n).padStart(4)}`);
  }

  console.log('\n🔍 Door categories distribution');
  const cats = await c.fetch<Array<{ category: string; n: number }>>(
    `*[_type == "door" && defined(category)] | { category } | { "category": category, "n": count(*[_type=="door" && category == ^.category]) }`
  );
  const counted: Record<string, number> = {};
  for (const c of cats) counted[c.category] = (counted[c.category] || 0) + 1;
  for (const [cat, n] of Object.entries(counted)) {
    const obs = ['blindee', 'technique', 'interieure'].includes(cat);
    console.log(`  ${cat.padEnd(15)} ${String(n).padStart(4)}${obs ? '  ⚠️  obsolète, à migrer vers interieur/entree' : ''}`);
  }

  console.log('\n🚪 Doors with no priceFromDZD set:');
  const noPrice = await c.fetch<Array<{ slug: { current: string }; name: string }>>(
    `*[_type == "door" && !defined(priceFromDZD)]{ slug, name }`
  );
  noPrice.forEach((d) => console.log(`  - ${d.slug.current} (${d.name})`));
  if (noPrice.length === 0) console.log('  (aucun)');

  console.log('\n🚪 Doors NDWi avec/sans compatibleRevetements ref:');
  const ndwiSlugs = ['tolga', 'djado', 'phoenix', 'aures'];
  for (const slug of ndwiSlugs) {
    const d = await c.fetch<{
      compatibleRevetements?: unknown[];
      compatiblePoignees?: unknown[];
      priceFromDZD?: number;
      composition?: unknown;
    } | null>(
      `*[_type == "door" && slug.current == "${slug}"][0]{ compatibleRevetements, compatiblePoignees, priceFromDZD, composition }`
    );
    if (!d) {
      console.log(`  ${slug.padEnd(10)} ❌ MANQUE dans Sanity`);
    } else {
      const rev = d.compatibleRevetements?.length ?? 0;
      const poi = d.compatiblePoignees?.length ?? 0;
      const price = d.priceFromDZD ? `${d.priceFromDZD} DZD` : 'PAS DE PRIX';
      const comp = d.composition ? '✓ comp' : '× comp';
      console.log(`  ${slug.padEnd(10)} ${rev} revêtements · ${poi} poignées · ${price} · ${comp}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
