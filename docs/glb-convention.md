# Convention GLB officielle — Configurateur 3D NDWI

Document de référence à fournir aux modélisateurs 3D qui produisent les fichiers GLB
des portes NDWi (et plus tard des autres produits configurables).

**Tout GLB ne respectant pas cette convention sera rejeté en intégration.**

---

## 1. Format & compression

- **Format** : `.glb` (binary), `.gltf` non accepté
- **Compression** : Draco mesh compression **obligatoire** (sauf si le modèle < 500 KB)
- **Texture KTX2** : recommandé pour les textures > 1 MB
- **Poids cible** : ≤ 2 MB par GLB final (compression incluse)
- **Triangles** : ≤ 50 000 triangles par modèle complet

## 2. Coordonnées et pivot

- **Système d'axes** : Y-up (standard glTF)
- **Origine du modèle** : pied de la porte côté charnière (pivot d'ouverture)
- **Unités** : mètres (1 unité Three.js = 1 mètre IRL)
- **Échelle réelle** : porte standard ≈ 0.9 × 2.1 × 0.04 (largeur × hauteur × épaisseur)

## 3. Hiérarchie des meshes (nommage obligatoire)

Chaque GLB doit contenir cette structure exactement :

```
Door_Main (mesh racine, animation d'ouverture appliquée ici)
├── Panel              ← surface principale (reçoit la finition)
├── Frame              ← encadrement / chambranle (reçoit finition séparée ou même)
├── Glass              ← vitrage (optionnel, matériau verre par défaut)
├── Hinges             ← paumelles (optionnel, matériau métal)
├── Handle_Attach      ← Empty/Locator (POSITION poignée, pas un mesh visible)
└── Lock_Attach        ← Empty/Locator (POSITION serrure, pas un mesh visible)
```

### Règles strictes

- `Door_Main` est le **parent** de tous les autres
- `Panel` et `Frame` doivent avoir des **groupes de matériaux séparés** (matSlot 0 et 1) pour permettre des finitions distinctes
- `Handle_Attach` et `Lock_Attach` sont des **Empty/Locator nodes** (sans géométrie) — leur position locale détermine où le moteur 3D vient greffer la poignée et la serrure
- `Glass` est optionnel — si présent, il sera caché si l'utilisateur désélectionne "avec vitrage" dans le configurateur
- `Hinges` est optionnel mais recommandé pour le rendu premium

## 4. Matériaux par défaut

Le modélisateur livre le GLB avec des matériaux de base, mais ils seront **remplacés à l'exécution** par les finitions Sanity. Cependant :

- **Panel** doit avoir une UV map propre (pour les textures bois/laqué)
- **Glass** doit utiliser un matériau transparent (opacity ≤ 0.7, ior 1.5)
- **Hinges** matériau metalness ≥ 0.8, roughness ≤ 0.3

## 5. Animations (optionnel)

Si une animation d'ouverture est incluse :
- Nom de l'animation : `OpenDoor`
- Durée : 1.5 secondes
- Easing : ease-in-out
- Angle : 90° autour de Y (par défaut), depuis l'origine au pivot

## 6. Métadonnées Sanity associées

Pour chaque GLB uploadé dans Sanity, le doc `doorModel` doit renseigner :

| Champ Sanity | Valeur attendue |
|---|---|
| `panelMeshName` | `"Panel"` (toujours, sauf cas exceptionnel) |
| `frameMeshName` | `"Frame"` |
| `handleAttachMeshName` | `"Handle_Attach"` |
| `lockAttachMeshName` | `"Lock_Attach"` |
| `glassMeshName` | `"Glass"` (vide si pas de vitrage) |
| `defaultScale` | `1.0` (sauf modèle hors échelle, à corriger préférablement à l'export) |
| `pivotOffsetX/Y/Z` | rarement nécessaire si origine respectée |

## 7. Checklist QA avant livraison

Le modélisateur doit valider chaque point avant d'envoyer le GLB :

- [ ] Hiérarchie respectée (`Door_Main` parent, meshes nommés exactement)
- [ ] Pivot à la charnière côté pied
- [ ] Échelle réelle en mètres
- [ ] Panel et Frame en groupes de matériaux séparés
- [ ] `Handle_Attach` et `Lock_Attach` présents (Empty nodes)
- [ ] UV map propre sur Panel
- [ ] Poids final ≤ 2 MB
- [ ] Animation `OpenDoor` (si applicable) testée
- [ ] Validation visuelle dans https://gltf-viewer.donmccurdy.com

## 8. Convention de nommage des fichiers

```
porte-{slug}-{version}.glb
```

Exemples :
- `porte-tolga-blanche-v1.glb`
- `porte-djado-chene-v2.glb`
- `porte-phoenix-noir-v1.glb`

Stocker dans : Sanity Studio → asset upload (jamais en commit direct dans le repo).

---

**Contact technique** : pour toute question sur cette convention, contacter l'équipe dev NDWI.

**Version du document** : 1.0 — 2026-05-17
