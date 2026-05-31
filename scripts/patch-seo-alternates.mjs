#!/usr/bin/env node
// One-shot script : ajoute getLocalizedAlternates aux pages qui n'en ont pas.
// Idempotent — peut être relancé sans risque.
//
// Usage : node scripts/patch-seo-alternates.mjs

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const PAGES = [
  ['habitat/cuisines', '/habitat/cuisines'],
  ['habitat/bureaux', '/habitat/bureaux'],
  ['habitat/chambres', '/habitat/chambres'],
  ['habitat/dressing', '/habitat/dressing'],
  ['habitat/salons', '/habitat/salons'],
  ['habitat/hotellerie', '/habitat/hotellerie'],
  ['habitat/finitions', '/habitat/finitions'],
  ['habitat', '/habitat'],
  ['showrooms', '/showrooms'],
  ['pro', '/pro'],
  ['realisations', '/realisations'],
  ['ndwi', '/ndwi'],
  ['ndo', '/ndo'],
  ['contact', '/contact'],
  ['workspace', '/workspace'],
];

let patched = 0;
let skipped = 0;

for (const [route, path] of PAGES) {
  const file = resolve('src/app/[locale]', route, 'page.tsx');
  if (!existsSync(file)) {
    console.log(`  - ${route} : page.tsx introuvable, skip`);
    skipped++;
    continue;
  }
  let src = readFileSync(file, 'utf8');

  if (src.includes('getLocalizedAlternates')) {
    console.log(`  - ${route} : déjà patchée, skip`);
    skipped++;
    continue;
  }

  // 1. Ajoute l'import APRÈS le dernier import next-intl/server
  const importLine = `import { getLocalizedAlternates } from '@/lib/seo/alternates';\n`;
  src = src.replace(
    /(import .* from ['"]next-intl\/server['"];\n)/,
    `$1${importLine}`
  );

  // 2. Ajoute alternates dans le return de generateMetadata
  // Cible : ligne `description: ...,` et insère `alternates: ...,` juste après.
  const altLine = `    alternates: getLocalizedAlternates('${path}', locale),\n`;
  src = src.replace(
    /(description:\s*[^\n]+,\n)/,
    `$1${altLine}`
  );

  writeFileSync(file, src);
  console.log(`  ✓ ${route}`);
  patched++;
}

console.log(`\n✅ ${patched} fichiers patchés, ${skipped} ignorés.`);
