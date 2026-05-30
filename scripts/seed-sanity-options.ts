/**
 * Migration Sanity Phase 4 — Pousse tout le catalogue options vers Sanity Studio.
 *
 * Crée ou met à jour 34 documents (revêtements, poignées, serrures, vitrages,
 * remplissages) + enrichit les 4 NDWi configurables avec :
 *   - prix public (priceFromDZD)
 *   - composition technique
 *   - certifications
 *   - plage dimensions
 *   - thicknessExact
 *   - compatibleSens
 *   - références aux options (compatibleRevetements, Poignees, Serrures,
 *     Vitrages, Remplissages)
 *
 * Usage :
 *   SANITY_MIGRATION_TOKEN=sk... npx tsx scripts/seed-sanity-options.ts
 *
 * Idempotent : utilise createOrReplace avec _id déterministe basé sur slug.
 * Si tu modifies un revêtement dans Studio, NE PAS relancer ce script — il
 * écrasera tes modifs. À utiliser uniquement pour le seed initial.
 */

import { createClient } from '@sanity/client';
import {
  revetements,
  poignees,
  serrures,
  remplissages,
  vitrages,
} from '../src/lib/data/door-options';
import { doors, NDWI_CONFIGURABLE_SLUGS } from '../src/lib/data/doors';

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

// ─── Helpers ────────────────────────────────────────────────────────

function makeId(type: string, slug: string): string {
  return `${type}.${slug}`;
}

function makeRef(type: string, slug: string) {
  return { _type: 'reference', _ref: makeId(type, slug) };
}

function makeSlug(current: string) {
  return { _type: 'slug', current };
}

// ─── Création des docs Options ──────────────────────────────────────

async function seedRevetements() {
  console.log(`\n📦 Pousse ${revetements.length} revêtements…`);
  let n = 0;
  for (const r of revetements) {
    await client.createOrReplace({
      _id: makeId('revetement', r.slug),
      _type: 'revetement',
      name: r.name,
      slug: makeSlug(r.slug),
      code: r.code,
      family: r.family,
      hex: r.hex,
      order: n++,
    });
    console.log(`  ✓ revetement.${r.slug} (${r.code})`);
  }
}

async function seedPoignees() {
  console.log(`\n📦 Pousse ${poignees.length} poignées…`);
  let n = 0;
  for (const p of poignees) {
    await client.createOrReplace({
      _id: makeId('poignee', p.slug),
      _type: 'poignee',
      name: p.name,
      slug: makeSlug(p.slug),
      type: p.type,
      shape: p.shape,
      finition: p.finition,
      order: n++,
    });
    console.log(`  ✓ poignee.${p.slug}`);
  }
}

async function seedSerrures() {
  console.log(`\n📦 Pousse ${serrures.length} serrures…`);
  let n = 0;
  for (const s of serrures) {
    await client.createOrReplace({
      _id: makeId('serrure', s.slug),
      _type: 'serrure',
      name: s.name,
      slug: makeSlug(s.slug),
      appliesTo: s.appliesTo,
      description: s.description,
      order: n++,
    });
    console.log(`  ✓ serrure.${s.slug}`);
  }
}

async function seedVitrages() {
  console.log(`\n📦 Pousse ${vitrages.length} vitrages…`);
  let n = 0;
  for (const v of vitrages) {
    await client.createOrReplace({
      _id: makeId('vitrage', v.slug),
      _type: 'vitrage',
      name: v.name,
      slug: makeSlug(v.slug),
      category: v.category,
      order: n++,
    });
    console.log(`  ✓ vitrage.${v.slug}`);
  }
}

async function seedRemplissages() {
  console.log(`\n📦 Pousse ${remplissages.length} remplissages…`);
  let n = 0;
  for (const r of remplissages) {
    await client.createOrReplace({
      _id: makeId('remplissage', r.slug),
      _type: 'remplissage',
      name: r.name,
      slug: makeSlug(r.slug),
      order: n++,
    });
    console.log(`  ✓ remplissage.${r.slug}`);
  }
}

// ─── Patch des 4 NDWi avec les nouveaux champs ──────────────────────

async function enrichNdwiDoors() {
  console.log(`\n📦 Enrichit ${NDWI_CONFIGURABLE_SLUGS.length} portes NDWi avec les nouveaux champs…`);

  for (const slug of NDWI_CONFIGURABLE_SLUGS) {
    const door = doors.find((d) => d.slug === slug);
    if (!door) {
      console.warn(`  ⚠️  ${slug} introuvable dans le seed, skip.`);
      continue;
    }

    // Cherche le document Sanity existant pour cette porte.
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "door" && slug.current == $slug][0]{ _id }`,
      { slug }
    );

    if (!existing) {
      console.warn(
        `  ⚠️  Door "${slug}" n'existe pas encore dans Sanity. Crée la fiche d'abord dans Studio, puis relance ce script.`
      );
      continue;
    }

    const patch = client
      .patch(existing._id)
      .set({
        priceFromDZD: door.priceFromDZD,
        composition: door.composition,
        certifications: door.certifications,
        thicknessExact: door.technicalSpecs?.thicknessExact,
        dimensionsRange: door.dimensionsRange,
        compatibleSens: door.compatibleSens,
        compatibleRevetements: (door.compatibleRevetements ?? []).map((s) =>
          makeRef('revetement', s)
        ),
        compatiblePoignees: (door.compatiblePoignees ?? []).map((s) => makeRef('poignee', s)),
        compatibleSerrures: (door.compatibleSerrures ?? []).map((s) => makeRef('serrure', s)),
        compatibleVitrages: (door.compatibleVitrages ?? []).map((s) => makeRef('vitrage', s)),
        compatibleRemplissages: (door.compatibleRemplissages ?? []).map((s) =>
          makeRef('remplissage', s)
        ),
      });

    await patch.commit();
    console.log(`  ✓ door.${slug} patched (price ${door.priceFromDZD} DZD)`);
  }
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Migration Phase 4 — Options + prix Sanity');
  console.log(`   project: ${projectId} · dataset: ${dataset}\n`);

  try {
    await seedRevetements();
    await seedPoignees();
    await seedSerrures();
    await seedVitrages();
    await seedRemplissages();
    await enrichNdwiDoors();

    console.log('\n✅ Migration terminée.');
    console.log('\n💡 Maintenant, ouvre Sanity Studio (/admin) :');
    console.log('   - Modifie les prix dans Door > Prix');
    console.log('   - Ajoute des photos aux Revêtements (Studio > Revêtement)');
    console.log('   - Les changements remontent automatiquement sur le site.');
  } catch (e) {
    console.error('\n❌ Migration failed:', e);
    process.exit(1);
  }
}

main();
