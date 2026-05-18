'use client';

import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  PerspectiveCamera,
} from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { DoorAssembly, type DoorPart } from './door-parts';
import { GLBDoor } from './glb-door';
import { CameraController, type CameraPreset } from './camera-controller';
import type { DoorConfig3D } from './types';

export type EnvironmentPreset = 'studio' | 'lobby' | 'apartment';

const PRESET_CONFIG: Record<
  EnvironmentPreset,
  { hdr: string; bg: string; exposure: number; label: { fr: string; ar: string } }
> = {
  studio: {
    hdr: '/hdr/brown_photostudio_02.hdr',
    bg: '#f5f2ee',
    exposure: 1.0,
    label: { fr: 'Studio', ar: 'استوديو' },
  },
  lobby: {
    hdr: '/hdr/large_corridor.hdr',
    bg: '#2a2722',
    exposure: 1.0,
    label: { fr: 'Lobby', ar: 'ردهة' },
  },
  apartment: {
    hdr: '/hdr/entrance_hall.hdr',
    bg: '#ece6dc',
    exposure: 1.05,
    label: { fr: 'Hall', ar: 'مدخل' },
  },
};

export interface DoorSceneProps {
  config: DoorConfig3D;
  /** URL du GLB Sanity à charger. Si défini, remplace la géométrie procédurale. */
  glbUrl?: string;
  /** Document Sanity `door3DModel` complet (mesh names, scale, attach points). */
  model?: import('@/sanity/queries/configurator3D').Door3DModel;
  /** Ambiance HDR à charger. */
  environmentPreset?: EnvironmentPreset;
  /** Preset de caméra (Face / 3-4 / Profil / Détail poignée). */
  cameraPreset?: CameraPreset;
  onHoverPart?: (part: DoorPart | null, x?: number, y?: number) => void;
  hoveredPart?: DoorPart | null;
  /**
   * Active `preserveDrawingBuffer` (requis pour `canvas.toDataURL()` côté screenshot).
   * Vrai par défaut pour ne pas casser la feature screenshot existante.
   * TODO refactor : passer à `false` et implémenter la capture via `gl.render()`
   * à la demande dans un composant CaptureHelper (économie GPU/mémoire mobile).
   */
  captureMode?: boolean;
}

export function DoorScene({
  config,
  glbUrl,
  model,
  environmentPreset = 'studio',
  cameraPreset = 'three-quarter',
  onHoverPart,
  hoveredPart,
  captureMode = true,
}: DoorSceneProps) {
  const env = PRESET_CONFIG[environmentPreset];
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: env.exposure,
        // Préserve le buffer uniquement pendant les captures (économie GPU/mémoire).
        preserveDrawingBuffer: captureMode,
      }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Le fond couleur reste un fallback derrière l'HDR (visible pendant le chargement). */}
      <color attach="background" args={[env.bg]} />

      <PerspectiveCamera makeDefault position={[2.2, 1.0, 3.0]} fov={32} />
      <OrbitControls
        ref={controlsRef as any}
        makeDefault
        enablePan={false}
        minDistance={0.5}
        maxDistance={50}
        zoomSpeed={1.8}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI * 0.6}
        target={[0, 1.0, 0]}
      />
      <CameraController preset={cameraPreset} controlsRef={controlsRef} />

      <Suspense fallback={null}>
        {/* HDR equirectangulaire PolyHaven (CC0) — sert à la fois de fond visible (background)
            ET d'éclairage PBR (reflets réalistes sur la porte). */}
        <Environment files={env.hdr} background blur={0.45} />
      </Suspense>

      {/* Key light directionnel + soft fill */}
      <directionalLight
        castShadow
        position={[4, 6, 5]}
        intensity={1.1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-4, 3, -2]} intensity={0.35} />
      <ambientLight intensity={0.25} />

      <group position={[0, 1.0, 0]}>
        {glbUrl ? (
          <GLBDoor glbUrl={glbUrl} config={config} model={model} />
        ) : (
          <DoorAssembly config={config} onHoverPart={onHoverPart} hoveredPart={hoveredPart} />
        )}
      </group>

      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.55}
        scale={6}
        blur={2}
        far={2.5}
        resolution={1024}
      />
    </Canvas>
  );
}
