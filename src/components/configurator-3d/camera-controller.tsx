'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export type CameraPreset = 'face' | 'three-quarter' | 'profile' | 'handle-detail' | 'free';

interface PresetState {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

export const CAMERA_PRESETS: Record<Exclude<CameraPreset, 'free'>, PresetState> = {
  face: { position: [0, 1.0, 3.4], target: [0, 1.0, 0], fov: 28 },
  'three-quarter': { position: [2.2, 1.0, 3.0], target: [0, 1.0, 0], fov: 32 },
  profile: { position: [3.0, 1.0, 0.6], target: [0, 1.0, 0], fov: 30 },
  'handle-detail': { position: [0.9, 1.0, 1.1], target: [0.35, 1.0, 0.0], fov: 22 },
};

interface CameraControllerProps {
  preset: CameraPreset;
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
}

/** Composant à placer INSIDE le Canvas R3F.
 *
 *  Comportement :
 *  - Preset != "free" → lerp jusqu'à la position cible, puis s'arrête (animation one-shot).
 *  - Si l'utilisateur interagit avec OrbitControls (drag/zoom), le lerp s'annule immédiatement.
 *  - Preset === "free" → ne touche jamais à la caméra (contrôle 100% libre).
 */
export function CameraController({ preset, controlsRef }: CameraControllerProps) {
  const { camera } = useThree();
  const targetPos = useRef(new Vector3());
  const targetTarget = useRef(new Vector3());
  const isAnimating = useRef(false);
  const userInteracting = useRef(false);

  // Écoute des événements OrbitControls : si l'utilisateur drag/zoom, on annule le lerp.
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const onStart = () => {
      userInteracting.current = true;
      isAnimating.current = false;
    };
    const onEnd = () => {
      userInteracting.current = false;
    };
    controls.addEventListener('start', onStart);
    controls.addEventListener('end', onEnd);
    return () => {
      controls.removeEventListener('start', onStart);
      controls.removeEventListener('end', onEnd);
    };
  }, [controlsRef]);

  useEffect(() => {
    if (preset === 'free') {
      isAnimating.current = false;
      return;
    }
    const p = CAMERA_PRESETS[preset];
    targetPos.current.set(...p.position);
    targetTarget.current.set(...p.target);
    if (p.fov && 'fov' in camera) {
      (camera as any).fov = p.fov;
      (camera as any).updateProjectionMatrix();
    }
    isAnimating.current = true;
  }, [preset, camera]);

  useFrame(() => {
    if (!isAnimating.current || userInteracting.current) return;
    camera.position.lerp(targetPos.current, 0.08);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetTarget.current, 0.08);
      controlsRef.current.update();
    }
    // Stop quand on est suffisamment proche de la cible (évite le snap-back permanent)
    if (camera.position.distanceTo(targetPos.current) < 0.01) {
      isAnimating.current = false;
    }
  });

  return null;
}
