'use client';

import { useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PresentationControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { DoorRevetement, DoorPoignee, DoorVitrage, SensOuverture } from '@/lib/data/door-options';

/**
 * Scène 3D procédurale du configurateur.
 *
 * Aucun fichier GLB requis — la porte est construite avec des primitives
 * Three.js (BoxGeometry, PlaneGeometry). La texture du revêtement Sanity
 * s'applique en live sur le panneau. Poignée procédurale au bon endroit
 * selon sens (gauche/droite). Vitrage = sous-plan translucide visible
 * quand un vitrage non-plein est choisi.
 */

interface DoorScene3DProps {
  revetement?: DoorRevetement;
  poignee?: DoorPoignee;
  vitrage?: DoorVitrage;
  sens?: SensOuverture;
  largeur: number;
  hauteur: number;
}

export function DoorScene3D(props: DoorScene3DProps) {
  return (
    <div className="relative aspect-[3/5] w-full overflow-hidden bg-gradient-to-br from-bone-100 to-bone-200">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4], fov: 35 }}
        gl={{ antialias: true, preserveDrawingBuffer: false }}
      >
        <color attach="background" args={['#ecebe6']} />
        <Suspense fallback={null}>
          <Lighting />
          <PresentationControls
            global
            snap
            azimuth={[-Math.PI / 5, Math.PI / 5]}
            polar={[-0.1, 0.2]}
            speed={1.4}
            zoom={1}
          >
            <DoorAssembly {...props} />
          </PresentationControls>
          <Environment preset="apartment" />
        </Suspense>
      </Canvas>
      <p className="pointer-events-none absolute bottom-2 inset-x-0 text-center text-[10px] uppercase tracking-[0.16em] text-ink/35">
        Cliquer-glisser pour tourner
      </p>
    </div>
  );
}

// ─── Éclairage ─────────────────────────────────────────────────────

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <directionalLight position={[-3, 2, 2]} intensity={0.45} color="#fff5e0" />
      <spotLight position={[0, 5, 3]} angle={0.4} penumbra={0.8} intensity={0.5} color="#fff" />
    </>
  );
}

// ─── Assemblage : cadre + panneau + (vitrage) + poignée ────────────

function DoorAssembly({
  revetement,
  poignee,
  vitrage,
  sens = 'droite',
  largeur,
  hauteur,
}: DoorScene3DProps) {
  // Conversion cm → unités scène avec normalisation pour que la porte rentre
  // toujours dans la frame quel que soit le ratio choisi par le client.
  const ratio = largeur / hauteur; // ex. 80/210 ≈ 0.38
  const sceneHeight = 2.6; // hauteur fixe affichée
  const h = sceneHeight;
  const w = sceneHeight * ratio;
  const thickness = 0.06;

  const fallbackColor = revetement?.hex ?? '#a89478'; // brun bois par défaut
  const textureUrl = revetement?.image;

  const handleX = sens === 'gauche' ? -w / 2 + 0.08 : w / 2 - 0.08;
  const hasGlass = vitrage ? vitrage.slug !== 'porte-pleine' : false;

  return (
    <group position={[0, 0, 0]}>
      {/* Cadre dormant — un peu plus grand que la porte */}
      <mesh position={[0, 0, -thickness / 2 - 0.015]}>
        <boxGeometry args={[w + 0.12, h + 0.12, 0.04]} />
        <meshStandardMaterial color="#1f1b16" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Panneau principal */}
      <PanelMesh
        width={w}
        height={h}
        thickness={thickness}
        textureUrl={textureUrl}
        fallbackColor={fallbackColor}
      />

      {/* Vitrage si applicable */}
      {hasGlass && (
        <mesh position={[0, h * 0.18, thickness / 2 + 0.003]}>
          <planeGeometry args={[w * 0.66, h * 0.22]} />
          <meshPhysicalMaterial
            color="#e8f0f5"
            transmission={0.85}
            roughness={0.05}
            metalness={0}
            thickness={0.5}
            ior={1.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      )}

      {/* Poignée procédurale */}
      <HandleMesh shape={poignee?.shape} finition={poignee?.finition} x={handleX} />
    </group>
  );
}

// ─── Panneau avec texture revêtement ───────────────────────────────

/** Wrapper qui choisit entre version-avec-texture et version-couleur-unie
 *  pour éviter le bug "hook conditionnel" si l'URL apparaît/disparaît. */
function PanelMesh(props: {
  width: number;
  height: number;
  thickness: number;
  textureUrl?: string;
  fallbackColor: string;
}) {
  return props.textureUrl ? (
    <PanelMeshTextured {...props} textureUrl={props.textureUrl} />
  ) : (
    <PanelMeshSolid {...props} />
  );
}

function PanelMeshSolid({
  width,
  height,
  thickness,
  fallbackColor,
}: {
  width: number;
  height: number;
  thickness: number;
  fallbackColor: string;
}) {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: fallbackColor,
        roughness: 0.55,
        metalness: 0.05,
      }),
    [fallbackColor]
  );
  return (
    <mesh position={[0, 0, 0]} material={material}>
      <boxGeometry args={[width, height, thickness]} />
    </mesh>
  );
}

function PanelMeshTextured({
  width,
  height,
  thickness,
  textureUrl,
}: {
  width: number;
  height: number;
  thickness: number;
  textureUrl: string;
}) {
  const texture = useTexture(textureUrl);
  const material = useMemo(() => {
    if (Array.isArray(texture)) texture[0].colorSpace = THREE.SRGBColorSpace;
    else {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
    }
    return new THREE.MeshStandardMaterial({
      map: Array.isArray(texture) ? texture[0] : texture,
      roughness: 0.5,
      metalness: 0.05,
    });
  }, [texture]);

  return (
    <mesh position={[0, 0, 0]} material={material}>
      <boxGeometry args={[width, height, thickness]} />
    </mesh>
  );
}

// ─── Poignée procédurale ───────────────────────────────────────────

const HANDLE_COLORS: Record<NonNullable<DoorPoignee['finition']>, string> = {
  chrome: '#d8dde2',
  inox: '#c4c8cc',
  'inox-brosse': '#a8acb0',
  'aluminium-brosse': '#9ea0a3',
  'noir-mat': '#1a1814',
};

function HandleMesh({
  shape = 'courbe',
  finition = 'inox',
  x,
}: {
  shape?: DoorPoignee['shape'];
  finition?: DoorPoignee['finition'];
  x: number;
}) {
  const color = HANDLE_COLORS[finition] ?? '#b5bdc4';
  const metalness = finition === 'noir-mat' ? 0.4 : 0.85;
  const roughness = finition === 'noir-mat' ? 0.7 : 0.25;

  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color, metalness, roughness }),
    [color, metalness, roughness]
  );

  // Hauteur réaliste de la poignée — à -25% de la hauteur de porte (≈90cm dans la vraie vie)
  const handleY = -0.4;
  const Rosace = (
    <mesh position={[x, handleY, 0.045]} material={material} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.04, 0.04, 0.008, 24]} />
    </mesh>
  );

  // Bouton (Aurès blindée)
  if (shape === 'bouton') {
    return (
      <mesh position={[x, handleY, 0.06]} material={material}>
        <sphereGeometry args={[0.035, 24, 24]} />
      </mesh>
    );
  }

  // Barre verticale (Phoenix porte d'entrée)
  if (shape === 'barre') {
    return (
      <group>
        <mesh position={[x, handleY, 0.08]} material={material}>
          <cylinderGeometry args={[0.015, 0.015, 0.8, 16]} />
        </mesh>
        <mesh position={[x, 0.45, 0.04]} material={material}>
          <boxGeometry args={[0.04, 0.04, 0.08]} />
        </mesh>
        <mesh position={[x, -0.35, 0.04]} material={material}>
          <boxGeometry args={[0.04, 0.04, 0.08]} />
        </mesh>
      </group>
    );
  }

  // Tubulaire (BASICA 02)
  if (shape === 'tubulaire') {
    return (
      <group>
        {Rosace}
        <mesh position={[x - 0.07, handleY, 0.08]} material={material} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.14, 16]} />
        </mesh>
      </group>
    );
  }

  // Carrée (NDWI Chromée)
  if (shape === 'carree') {
    return (
      <group>
        <mesh position={[x, handleY, 0.045]} material={material}>
          <boxGeometry args={[0.08, 0.08, 0.008]} />
        </mesh>
        <mesh position={[x - 0.07, handleY, 0.08]} material={material}>
          <boxGeometry args={[0.12, 0.025, 0.025]} />
        </mesh>
      </group>
    );
  }

  // Default : courbe (NDWI Noire / BASICA 01)
  return (
    <group>
      {Rosace}
      <mesh
        position={[x - 0.07, handleY, 0.08]}
        material={material}
        rotation={[0, 0, Math.PI / 12]}
      >
        <capsuleGeometry args={[0.013, 0.11, 8, 16]} />
      </mesh>
    </group>
  );
}
