# Ambiances HDR — Configurateur NDWi

Photos panoramiques 360° HDR utilisées comme arrière-plan et source d'éclairage PBR par le configurateur.

| Fichier | Source | Titre original |
|---|---|---|
| `brown_photostudio_02.hdr` | [PolyHaven](https://polyhaven.com/a/brown_photostudio_02) | Brown Photostudio 02 — studio photo brun |
| `large_corridor.hdr` | [PolyHaven](https://polyhaven.com/a/large_corridor) | Large Corridor — hall victorien arché |
| `entrance_hall.hdr` | [PolyHaven](https://polyhaven.com/a/entrance_hall) | Entrance Hall — entrée résidentielle victorienne |

## Licence

Tous les fichiers PolyHaven sont distribués en **CC0** (domaine public) — usage commercial libre, sans attribution requise.

## Format

- `.hdr` Equirectangular HDR (Radiance, RGBE encoding)
- Résolution 1k (suffisant pour environnement PBR avec blur)
- ~1.5-1.7 MB par fichier

## Remplacer une ambiance

1. Télécharge un autre HDR sur [polyhaven.com/hdris](https://polyhaven.com/hdris) (filtre "indoor")
2. Choisis la résolution 1k (.hdr)
3. Remplace le fichier dans ce dossier en gardant le même nom — ou modifie le chemin dans
   `src/components/configurator-3d/door-scene.tsx` (objet `PRESET_CONFIG`)

## Workflow avancé (futur)

Pour permettre à NDWi d'uploader ses propres panoramas (photos showroom Oran avec Insta360 ou
Theta), créer un schema Sanity `hdrAmbiance` avec champ file accepting `.hdr/.jpg/.exr`.
