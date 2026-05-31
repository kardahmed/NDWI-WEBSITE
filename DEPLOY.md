# Déploiement Hostinger Cloud (Node.js)

Le site Next.js 14 utilise `output: 'standalone'` (cf. `next.config.mjs`) — c'est
une option qui génère un serveur Node minimal autonome dans `.next/standalone/`.

## ⚠️ Piège classique standalone Next.js

Le mode standalone **ne copie PAS automatiquement** :
- `.next/static/` (les chunks CSS et JS générés, dont Tailwind)
- `public/` (logos, vidéos, images statiques)

Si ces dossiers ne sont pas dans `.next/standalone/`, le serveur boot mais
toutes les requêtes vers `/_next/static/*.css` et `/logo/*.png` retournent
404 → la page apparaît en HTML brut sans CSS ni images.

→ **Fix dans `package.json`** : le script `build` enchaîne maintenant
`next build && npm run build:postcopy`, qui copie les 2 dossiers
au bon endroit.

## Configuration côté Hostinger

### Variables d'environnement requises (Panneau Hostinger → Node.js → Environment)

```bash
NODE_ENV=production
PORT=3000                                  # ou ce que Hostinger impose
NEXT_PUBLIC_SITE_URL=https://ndwi-dz.com   # URL publique du site
NEXT_PUBLIC_SANITY_PROJECT_ID=ykqpckdm
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=sk...                # depuis manage.sanity.io
NEXT_PUBLIC_SUPABASE_URL=https://...       # pour les formulaires
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Commandes Hostinger

| Étape | Commande |
|---|---|
| **Install deps** | `npm install` |
| **Build** | `npm run build` (= `next build && npm run build:postcopy`) |
| **Start** | `npm start` (= `node .next/standalone/server.js`) |

### Workspace root / Document root

Le serveur Hostinger doit pointer vers la racine du repo (celle qui contient
`package.json`). Le serveur Next.js standalone détecte automatiquement
`.next/standalone/server.js` qu'il a lui-même généré.

### Auto-deploy GitHub

Si tu as configuré Git auto-deploy :
1. Hostinger pull le repo à chaque push sur `main`
2. Lance `npm install && npm run build`
3. Restart le processus Node qui exécute `npm start`

Si le restart ne se fait pas, vérifier dans le panneau Hostinger qu'un
trigger est bien configuré post-deploy.

## Test en local du standalone

```bash
npm run build
PORT=3000 npm start
# Ouvrir http://localhost:3000/fr
```

Si ça marche en local mais pas sur Hostinger → problème de variables
d'environnement ou de port côté serveur.

## Mode dev (pas pour la prod)

`npm run dev` lance `next dev` classique avec HMR — uniquement en local.
`npm run start:dev` lance `next start` (pas le standalone) — pratique pour
débug rapide en prod-like sans le standalone.
