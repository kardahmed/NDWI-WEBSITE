/**
 * Génère un modèle 3D de porte via Meshy AI à partir d'une photo de référence.
 *
 * Usage :
 *   MESHY_API_KEY=msy_... npx tsx scripts/generate-door-meshy.ts <imagePath> <outputName>
 *
 * Exemple :
 *   npx tsx scripts/generate-door-meshy.ts public/images/catalogue/portes/marsia-21.jpg door-flat
 *
 * Le script :
 *   1. Encode la photo en base64 (ou utilise une URL publique)
 *   2. Lance un task Meshy "image-to-3d" avec texture activée
 *   3. Polle l'API jusqu'à la fin de la génération (~5-10 min)
 *   4. Télécharge le GLB final dans public/models/<outputName>.glb
 *
 * Crédits consommés : ~10 (image-to-3d standard) à ~50 (avec texture).
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, basename } from 'path';

const apiKey = process.env.MESHY_API_KEY;
if (!apiKey) {
  console.error('❌ MESHY_API_KEY env var requise.');
  console.error('   Mettez-la dans .env.local ou exportez-la avant lancement.');
  process.exit(1);
}

const [, , imagePath, outputName] = process.argv;
if (!imagePath || !outputName) {
  console.error('❌ Usage : tsx scripts/generate-door-meshy.ts <imagePath> <outputName>');
  process.exit(1);
}

const absImagePath = resolve(process.cwd(), imagePath);
if (!existsSync(absImagePath)) {
  console.error(`❌ Image introuvable : ${absImagePath}`);
  process.exit(1);
}

const MESHY_BASE = 'https://api.meshy.ai';

interface CreateResponse {
  result: string; // task id
}

interface TaskResponse {
  id: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'CANCELED' | 'EXPIRED';
  progress: number;
  model_urls?: { glb?: string; fbx?: string; obj?: string; usdz?: string };
  texture_urls?: { base_color?: string }[];
  task_error?: { message?: string };
  thumbnail_url?: string;
}

async function uploadImageAndCreateTask(imageDataUri: string): Promise<string> {
  const res = await fetch(`${MESHY_BASE}/openapi/v1/image-to-3d`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_url: imageDataUri,
      ai_model: 'meshy-6',
      topology: 'quad',
      target_polycount: 30000,
      should_remesh: true,
      should_texture: true,
      symmetry_mode: 'auto',
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Meshy create task failed [${res.status}]: ${txt}`);
  }
  const data = (await res.json()) as CreateResponse;
  return data.result;
}

async function pollTask(taskId: string): Promise<TaskResponse> {
  let lastProgress = -1;
  while (true) {
    const res = await fetch(`${MESHY_BASE}/openapi/v1/image-to-3d/${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Meshy poll failed [${res.status}]: ${txt}`);
    }
    const data = (await res.json()) as TaskResponse;
    if (data.progress !== lastProgress) {
      process.stdout.write(`\r  ⏳ ${data.status} — ${data.progress}%   `);
      lastProgress = data.progress;
    }
    if (data.status === 'SUCCEEDED') {
      console.log();
      return data;
    }
    if (data.status === 'FAILED' || data.status === 'CANCELED' || data.status === 'EXPIRED') {
      console.log();
      throw new Error(`Task ${data.status} : ${data.task_error?.message ?? 'unknown'}`);
    }
    // attendre 6s entre chaque poll
    await new Promise((r) => setTimeout(r, 6000));
  }
}

async function downloadGlb(url: string, outputPath: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed [${res.status}]`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(outputPath, buf);
}

async function main() {
  console.log(`🚀 Génération Meshy AI`);
  console.log(`   Image source : ${basename(imagePath)}`);
  console.log(`   Modèle cible : ${outputName}.glb`);
  console.log();

  // Lire l'image en base64
  const imgBuf = readFileSync(absImagePath);
  const ext = imagePath.toLowerCase().endsWith('.png') ? 'png' : 'jpeg';
  const dataUri = `data:image/${ext};base64,${imgBuf.toString('base64')}`;

  console.log('→ Création du task Meshy…');
  const taskId = await uploadImageAndCreateTask(dataUri);
  console.log(`  Task ID : ${taskId}`);

  console.log('→ Polling jusqu\'à la fin (≈5-10 min)…');
  const task = await pollTask(taskId);

  const glbUrl = task.model_urls?.glb;
  if (!glbUrl) {
    throw new Error('Pas d\'URL GLB dans la réponse Meshy.');
  }

  const outDir = resolve(process.cwd(), 'public/models');
  const outPath = resolve(outDir, `${outputName}.glb`);
  console.log(`→ Téléchargement vers ${outPath}`);
  await downloadGlb(glbUrl, outPath);

  console.log();
  console.log(`✅ Terminé. Fichier : public/models/${outputName}.glb`);
  console.log(`   Aperçu : ${task.thumbnail_url ?? '—'}`);
  console.log();
  console.log('Prochaine étape :');
  console.log(`  1. Visualisez le modèle sur /fr/test-3d (modifier src dans page.tsx)`);
  console.log(`  2. Si OK, uploadez dans Sanity → Modèles 3D portes → ${outputName}`);
  console.log(`  3. Reliez aux portes du catalogue qu'il couvre`);
}

main().catch((e) => {
  console.error('\n❌', e instanceof Error ? e.message : e);
  process.exit(1);
});
