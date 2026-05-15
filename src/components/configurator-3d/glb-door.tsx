'use client';

/**
 * Composant qui charge une porte 3D depuis un GLB Sanity (upload NDWi)
 * et applique la finition sélectionnée en temps réel.
 *
 * CONVENTIONS attendues sur le GLB :
 *   • Mesh "Door_Main"  → reçoit la couleur/texture de la finition Sanity
 *   • Mesh "Frame"      → conserve son matériau (cadre fixe)
 *   • Mesh "Glass"      → matériau transparent automatique si présent
 *   • Pivot du panneau  → côté charnière (le node parent du panneau pivote)
 *
 * Si une convention manque, le composant tombe en mode "best effort"
 * (applique la finition au premier mesh disponible).
 */

import { useEffect, useMemo, useRef, Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import {
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
} from 'three';
import type { DoorConfig3D } from './types';
import { finishRoughness } from './types';

interface GLBDoorProps {
  glbUrl: string;
  config: DoorConfig3D;
}

/** Sous-composant qui charge la texture bois si une URL est fournie (avec Suspense). */
function useFinitionTexture(textureUrl?: string) {
  // useLoader exige une URL — si pas de texture, retourne null.
  // On fournit une URL "vide" innocue pour éviter un appel conditionnel de hook.
  const placeholder = '/_next/image?url=%2Ffavicon.ico&w=16&q=1';
  const tex = useLoader(TextureLoader, textureUrl || placeholder);
  if (!textureUrl) return null;
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.repeat.set(1.5, 3);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

function GLBDoorInner({ glbUrl, config }: GLBDoorProps) {
  const { scene } = useGLTF(glbUrl);
  const pivotRef = useRef<Group>(null);

  // Cloner la scène pour pouvoir modifier les matériaux sans toucher au cache GLTF partagé.
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const woodTexture = useFinitionTexture(config.textureUrl);

  // Trouver les meshes nommés (cache au mount + à chaque clone)
  const meshes = useMemo(() => {
    const map: Record<string, Mesh> = {};
    cloned.traverse((obj) => {
      if ((obj as Mesh).isMesh) {
        const name = obj.name;
        if (name) map[name] = obj as Mesh;
      }
    });
    return map;
  }, [cloned]);

  // Appliquer la finition en live au mesh "Door_Main" (ou fallback au premier mesh)
  useEffect(() => {
    const panel =
      meshes['Door_Main'] ??
      meshes['Panel'] ??
      Object.values(meshes).find((m) => /panel|door|porte/i.test(m.name)) ??
      Object.values(meshes)[0];
    if (!panel) return;
    let mat = panel.material;
    if (Array.isArray(mat)) mat = mat[0];
    if (!mat) return;
    const std = mat as MeshStandardMaterial;
    std.color = new Color(config.colorHex);
    std.roughness = finishRoughness[config.finish];
    std.metalness = config.material === 'metal' ? 0.7 : 0;
    if (woodTexture && 'map' in std) {
      std.map = woodTexture;
    } else if ('map' in std) {
      std.map = null;
    }
    std.needsUpdate = true;
  }, [meshes, config.colorHex, config.finish, config.material, woodTexture]);

  // Mesh "Glass" → matériau transparent automatique
  useEffect(() => {
    const glass = meshes['Glass'] ?? meshes['Vitrage'] ?? meshes['glass'];
    if (!glass) return;
    glass.material = new MeshPhysicalMaterial({
      color: '#cfd8e3',
      roughness: 0.08,
      metalness: 0,
      transmission: 0.92,
      thickness: 0.01,
      transparent: true,
      opacity: 0.55,
      ior: 1.45,
    });
    glass.visible = config.hasGlass;
  }, [meshes, config.hasGlass]);

  // Animation d'ouverture autour du pivot
  const isLeftHinge = config.hingeSide === 'gauche';
  const openSign = isLeftHinge ? -1 : 1;
  const directionSign = config.openingDirection === 'interieur' ? 1 : -1;
  const targetRotY = openSign * directionSign * config.openAmount * (Math.PI / 2);

  useFrame(() => {
    if (!pivotRef.current) return;
    pivotRef.current.rotation.y = MathUtils.lerp(
      pivotRef.current.rotation.y,
      targetRotY,
      0.08
    );
  });

  // Échelle GLB pour adapter aux dimensions configurées (largeur cible / largeur GLB)
  // Le GLB est supposé être à dimensions standard 0.9m × 2.05m.
  const targetWidth = config.widthCm / 100;
  const targetHeight = config.heightCm / 100;
  const scaleX = targetWidth / 0.9;
  const scaleY = targetHeight / 2.05;

  return (
    <group ref={pivotRef} scale={[scaleX, scaleY, 1]}>
      <primitive object={cloned} />
    </group>
  );
}

/** Wrapper avec Suspense pour gérer le chargement du GLB sans crash. */
export function GLBDoor(props: GLBDoorProps) {
  return (
    <Suspense fallback={null}>
      <GLBDoorInner {...props} />
    </Suspense>
  );
}

// Preload helpers pour les pages serveur
GLBDoor.preload = (url: string) => useGLTF.preload(url);
