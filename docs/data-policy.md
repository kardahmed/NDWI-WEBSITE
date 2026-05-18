# Politique data — Sanity = Source of Truth

À partir de 2026-05-17, **Sanity CMS** est la source unique de vérité pour tous les
contenus modifiables côté business : modèles de portes, finitions, poignées, produits
NDO, réalisations, partenaires, showrooms.

Les fichiers TypeScript sous `src/lib/data/*.ts` deviennent des **fallbacks de seed**
uniquement, utilisés en dernier recours quand l'API Sanity est indisponible.

---

## Règles d'or

1. **Toute donnée éditable par un non-développeur vit dans Sanity.**
2. **Les composants fetchent depuis Sanity** via `src/sanity/queries/*`.
3. **Les fichiers `lib/data/` restent uniquement pour** :
   - Constantes système (regex, locales, structure du site)
   - Données techniques figées (catégories d'univers, brand identity)
   - Fallback si Sanity timeout (graceful degradation)
4. **Toute édition de produit / image / texte se fait dans Sanity Studio**, pas dans le code.
5. **Le webhook Sanity → revalidation Next.js** (configuré sur `/api/revalidate`)
   garantit que les changements sont visibles en moins d'1 minute, sans rebuild.

## Mapping marques

| Marque | Origine | Type de produit | Configurable ? |
|---|---|---|---|
| **NDWi** | Production locale Algérie (Oran) | Portes, cuisines, chambres, dressing, salons, bureaux, hotellerie | ✅ Oui (configurateur 3D) |
| **NDO** | Importation Italie (ARAN, PAIL, ICA) | Produits finis | ❌ Non (catalogue e-commerce) |

## Source par type de contenu

| Contenu | Source autoritative | `lib/data/` | Notes |
|---|---|---|---|
| Modèles de portes (NDWi) | **Sanity** `doorModel` | seed `doors.ts` | Migration prévue Phase 1 |
| Finitions / textures | **Sanity** `finition` | — | Déjà en Sanity |
| Poignées | **Sanity** `handle` | seed `handles.ts` | À créer dans Sanity |
| Accessoires (vitrage, serrure...) | **Sanity** `accessory` | — | À créer |
| Produits NDO (e-commerce) | **Sanity** `ndoProduct` | — | À créer + remplir |
| Réalisations / projets | **Sanity** `realisation` | seed `realisations.ts` | À migrer |
| Showrooms | **Sanity** `showroom` | `showrooms.ts` | OK static (rarement changeant) |
| Partenaires | **Sanity** `partner` | seed `partners.ts` | À migrer |
| Configuration brand identity | `lib/data/brands.ts` | static OK | Identité de marque, change rarement |
| Catégories habitat (slugs) | `lib/data/habitat.ts` | static OK | Architecture du site |
| Labels FR/AR système | `messages/fr.json`, `messages/ar.json` | static | i18n technique |

## Workflow d'ajout d'un nouveau produit

### Pour un nouveau modèle de porte NDWi (configurable)

1. **Modélisateur 3D** : produit le GLB selon la convention (`docs/glb-convention.md`)
2. **Photographe** : prend photos hero + galerie (ratio 4:5, ≥ 1600px)
3. **Équipe NDWI** dans Sanity Studio :
   - Créer un doc `doorModel`
   - Upload GLB + thumbnail + galerie
   - Renseigner `panelMeshName`, `frameMeshName`, etc.
   - Cocher les `finitions` compatibles
   - Cocher les `handles` compatibles
   - Renseigner specs techniques (épaisseur, certifications)
   - Publier
4. **Webhook** : déclenche revalidation Next.js → porte visible sur site en < 1 min

### Pour un nouveau produit NDO (e-commerce)

1. **Photographe** : photos haute résolution
2. **Équipe NDWI** dans Sanity Studio :
   - Créer un doc `ndoProduct`
   - Sélectionner la marque (ARAN / PAIL / ICA)
   - Upload images
   - Renseigner caractéristiques, couleurs disponibles, prix "à partir de" (optionnel)
   - Publier
3. **Webhook** revalide → produit visible

## Migration des données existantes

Les **20+ portes NDWi** actuellement dans `lib/data/doors.ts` seront migrées en Sanity
via un script `scripts/migrate-doors-to-sanity.ts` qui crée les `doorModel` correspondants.

Après vérification que tout est bien en Sanity, `doors.ts` sera réduit aux types et un
fallback minimal.

## Gouvernance

- **Modification de schéma Sanity** : nécessite revue dev (impact rendering)
- **Création de contenu** : autonomie totale de l'équipe NDWI dans Studio
- **Suppression de contenu** : Sanity garde l'historique, mais préférer "unpublish" plutôt que delete

---

**Version du document** : 1.0 — 2026-05-17
