'use client';

/**
 * Composants 3D paramétriques composant la porte.
 *
 * Convention de nommage des meshes (alignée sur les specs) :
 *   - Door_Main : panneau principal
 *   - Frame     : encadrement
 *   - Handle    : poignée
 *   - Glass     : vitrage (optionnel)
 *   - Lock      : serrure (optionnel)
 *   - Hinges    : paumelles
 *
 * Toutes les dimensions sont en METRES. Les conversions depuis cm se font en amont.
 */

import { useRef, Suspense } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping, SRGBColorSpace } from 'three';
import * as THREE from 'three';
import type { DoorConfig3D, HandleSlug, MaterialSlug, FinishSlug } from './types';
import { finishRoughness } from './types';

// ───────── Matériau panneau (déclaratif, réactif aux props) ─────────

/** Sous-composant qui charge une texture (avec Suspense). Séparé pour pouvoir le rendre conditionnellement. */
function TexturedPanelMaterial({
  hex,
  roughness,
  metalness,
  textureUrl,
}: {
  hex: string;
  roughness: number;
  metalness: number;
  textureUrl: string;
}) {
  const tex = useLoader(TextureLoader, textureUrl);
  // Tile la texture sur la porte (2x2 par défaut).
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.repeat.set(1.5, 3);
  tex.colorSpace = SRGBColorSpace;
  return (
    <meshStandardMaterial
      color={hex}
      map={tex}
      roughness={roughness}
      metalness={metalness}
      envMapIntensity={1.1}
    />
  );
}

function PanelMaterial({ hex, material, finish, textureUrl }: {
  hex: string;
  material: MaterialSlug;
  finish: FinishSlug;
  textureUrl?: string;
}) {
  const roughness = finishRoughness[finish];
  const metalness = material === 'metal' ? 0.7 : 0;
  if (textureUrl) {
    return (
      <Suspense
        fallback={
          <meshStandardMaterial color={hex} roughness={roughness} metalness={metalness} />
        }
      >
        <TexturedPanelMaterial
          hex={hex}
          roughness={roughness}
          metalness={metalness}
          textureUrl={textureUrl}
        />
      </Suspense>
    );
  }
  return (
    <meshStandardMaterial
      color={hex}
      roughness={roughness}
      metalness={metalness}
      envMapIntensity={1.1}
    />
  );
}

// ───────── Panneau principal (Door_Main) ─────────

function DoorPanel({ width, height, hex, material, finish, hasGlass, textureUrl }: {
  width: number;
  height: number;
  hex: string;
  material: MaterialSlug;
  finish: FinishSlug;
  hasGlass: boolean;
  textureUrl?: string;
}) {
  const thickness = 0.04;

  if (!hasGlass) {
    return (
      <mesh name="Door_Main" castShadow receiveShadow>
        <boxGeometry args={[width, height, thickness]} />
        <PanelMaterial hex={hex} material={material} finish={finish} textureUrl={textureUrl} />
      </mesh>
    );
  }

  const glassHeight = height * 0.35;
  const glassY = height * 0.18;
  const topHeight = height / 2 - glassY - glassHeight / 2;
  const bottomHeight = height / 2 + glassY - glassHeight / 2;

  return (
    <group name="Door_Main">
      <mesh
        name="Door_Main_Top"
        position={[0, height / 2 - topHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, topHeight, thickness]} />
        <PanelMaterial hex={hex} material={material} finish={finish} textureUrl={textureUrl} />
      </mesh>
      <mesh
        name="Door_Main_Bottom"
        position={[0, -height / 2 + bottomHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, bottomHeight, thickness]} />
        <PanelMaterial hex={hex} material={material} finish={finish} textureUrl={textureUrl} />
      </mesh>
    </group>
  );
}

function Glass({ width, height }: { width: number; height: number }) {
  const glassHeight = height * 0.35;
  const glassY = height * 0.18;
  return (
    <mesh name="Glass" position={[0, glassY, 0]}>
      <boxGeometry args={[width * 0.85, glassHeight, 0.012]} />
      <meshPhysicalMaterial
        color="#cfd8e3"
        roughness={0.08}
        metalness={0}
        transmission={0.92}
        thickness={0.01}
        transparent
        opacity={0.55}
        ior={1.45}
      />
    </mesh>
  );
}

// ───────── Encadrement (Frame) ─────────

function FrameMat() {
  return <meshStandardMaterial color="#1a1a1a" roughness={0.55} metalness={0.1} />;
}

function Frame({ width, height }: { width: number; height: number }) {
  const t = 0.05;
  const depth = 0.07;
  const w = width + t * 2;
  const h = height + t * 2;
  return (
    <group name="Frame">
      <mesh position={[0, height / 2 + t / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, t, depth]} />
        <FrameMat />
      </mesh>
      <mesh position={[-width / 2 - t / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[t, h, depth]} />
        <FrameMat />
      </mesh>
      <mesh position={[width / 2 + t / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[t, h, depth]} />
        <FrameMat />
      </mesh>
      <mesh position={[0, -height / 2 - 0.01, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.02, depth]} />
        <FrameMat />
      </mesh>
    </group>
  );
}

// ───────── Poignées (Handle) — 4 variantes ─────────

function MetalMat({ color, metalness = 0.95, roughness = 0.18 }: { color: string; metalness?: number; roughness?: number }) {
  return <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />;
}

type HandleProps = { position: [number, number, number]; signX: number };

function HandleModerne({ position, signX }: HandleProps) {
  return (
    <group name="Handle" position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.045, 0.16, 0.008]} />
        <MetalMat color="#d6d6d6" />
      </mesh>
      <mesh position={[0.06 * signX, 0, 0.025]} castShadow>
        <boxGeometry args={[0.12, 0.015, 0.02]} />
        <MetalMat color="#d6d6d6" />
      </mesh>
      <mesh position={[0, 0, 0.022]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.045, 16]} />
        <MetalMat color="#d6d6d6" />
      </mesh>
    </group>
  );
}

function HandleLuxe({ position, signX }: HandleProps) {
  return (
    <group name="Handle" position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.06, 0.22, 0.012]} />
        <MetalMat color="#d4af37" metalness={0.98} roughness={0.1} />
      </mesh>
      <mesh
        position={[0.07 * signX, 0, 0.03]}
        rotation={[Math.PI / 2, 0, signX < 0 ? Math.PI : 0]}
        castShadow
      >
        <torusGeometry args={[0.05, 0.012, 16, 32, Math.PI]} />
        <MetalMat color="#d4af37" metalness={0.98} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.028]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.06, 24]} />
        <MetalMat color="#d4af37" metalness={0.98} roughness={0.1} />
      </mesh>
    </group>
  );
}

function HandleMinimaliste({ position, signX }: HandleProps) {
  return (
    <group name="Handle" position={position}>
      <mesh position={[0.05 * signX, 0, 0.022]} castShadow>
        <boxGeometry args={[0.1, 0.012, 0.014]} />
        <MetalMat color="#1a1a1a" metalness={0.4} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, 0.02]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.04, 16]} />
        <MetalMat color="#1a1a1a" metalness={0.4} roughness={0.85} />
      </mesh>
    </group>
  );
}

function HandleClassique({ position, signX }: HandleProps) {
  return (
    <group name="Handle" position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.05, 0.18, 0.01]} />
        <MetalMat color="#b08d57" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0.06 * signX, 0, 0.04]} castShadow>
        <sphereGeometry args={[0.035, 32, 16]} />
        <MetalMat color="#b08d57" metalness={0.85} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Handle({ slug, position, signX }: { slug: HandleSlug } & HandleProps) {
  switch (slug) {
    case 'luxe':
      return <HandleLuxe position={position} signX={signX} />;
    case 'minimaliste':
      return <HandleMinimaliste position={position} signX={signX} />;
    case 'classique':
      return <HandleClassique position={position} signX={signX} />;
    default:
      return <HandleModerne position={position} signX={signX} />;
  }
}

// ───────── Serrure (Lock) ─────────

function Lock({ position }: { position: [number, number, number] }) {
  return (
    <mesh name="Lock" position={position} castShadow>
      <boxGeometry args={[0.025, 0.06, 0.025]} />
      <meshStandardMaterial color="#4a4a4a" roughness={0.25} metalness={0.85} />
    </mesh>
  );
}

function Hinges({ x, height }: { x: number; height: number }) {
  return (
    <group name="Hinges">
      {[-height * 0.4, -height * 0.05, height * 0.4].map((y, i) => (
        <mesh key={i} position={[x, y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.05, 16]} />
          <meshStandardMaterial color="#bfbfbf" roughness={0.3} metalness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/** Arc d'ouverture au sol (style plan d'architecte) — indique le sens d'ouverture
 *  intérieur (devant) ou extérieur (derrière) même quand la porte est fermée. */
function SwingArc({
  hingeX,
  width,
  height,
  isLeftHinge,
  directionSign,
}: {
  hingeX: number;
  width: number;
  height: number;
  isLeftHinge: boolean;
  directionSign: number;
}) {
  // Direction de balayage : signe combiné (côté charnière × sens d'ouverture).
  const sweepSign = (isLeftHinge ? -1 : 1) * directionSign;
  // Le torus est plat au sol (rotation X = PI/2), centré sur la charnière, rayon = largeur porte.
  // thetaStart aligne l'arc pour qu'il aille de la position fermée à la position ouverte.
  const thetaStart = isLeftHinge ? 0 : Math.PI;
  // Direction = signe de thetaLength
  const thetaLength = (Math.PI / 2) * (sweepSign > 0 ? 1 : -1);
  return (
    <group position={[hingeX, -height / 2 + 0.01, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[width - 0.02, width, 32, 1, thetaStart, thetaLength]} />
        <meshBasicMaterial color="#b08d57" transparent opacity={0.35} side={2} />
      </mesh>
    </group>
  );
}

// ───────── Composition complète ─────────

/** Identifiants des parties cliquables/hoverables. */
export type DoorPart = 'panel' | 'frame' | 'handle' | 'lock' | 'hinges' | 'glass';

export interface DoorAssemblyProps {
  config: DoorConfig3D;
  /** Callback hover : appelé avec (part, clientX, clientY) ou (null) au unhover. */
  onHoverPart?: (part: DoorPart | null, x?: number, y?: number) => void;
  hoveredPart?: DoorPart | null;
}

/** Wrapper qui ajoute les events hover + outline pour une partie de la porte. */
function HoverableGroup({
  part,
  children,
  onHoverPart,
  hoveredPart,
}: {
  part: DoorPart;
  children: React.ReactNode;
  onHoverPart?: DoorAssemblyProps['onHoverPart'];
  hoveredPart?: DoorPart | null;
}) {
  if (!onHoverPart) return <>{children}</>;
  const isHovered = hoveredPart === part;
  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        onHoverPart(part, e.nativeEvent.clientX, e.nativeEvent.clientY);
      }}
      onPointerMove={(e) => {
        if (isHovered) onHoverPart(part, e.nativeEvent.clientX, e.nativeEvent.clientY);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHoverPart(null);
      }}
    >
      {children}
    </group>
  );
}

export function DoorAssembly({ config, onHoverPart, hoveredPart }: DoorAssemblyProps) {
  const width = config.widthCm / 100;
  const height = config.heightCm / 100;
  const isLeftHinge = config.hingeSide === 'gauche';
  const handleX = isLeftHinge ? width / 2 - 0.07 : -width / 2 + 0.07;
  const handleSignX = isLeftHinge ? -1 : 1;
  const openSign = isLeftHinge ? -1 : 1;
  const directionSign = config.openingDirection === 'interieur' ? 1 : -1;
  // Ouverture max : 90° pile (ressenti standard d'une porte grand ouvert).
  const targetRotY = openSign * directionSign * config.openAmount * (Math.PI / 2);

  // Animation lerp directe sur la rotation du groupe — plus performant qu'un setState par frame.
  const pivotRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!pivotRef.current) return;
    pivotRef.current.rotation.y = THREE.MathUtils.lerp(
      pivotRef.current.rotation.y,
      targetRotY,
      0.08
    );
  });

  return (
    <group>
      <HoverableGroup part="frame" onHoverPart={onHoverPart} hoveredPart={hoveredPart}>
        <Frame width={width} height={height} />
      </HoverableGroup>
      {/* Arc au sol indiquant le sens d'ouverture (toujours visible). */}
      <SwingArc
        hingeX={isLeftHinge ? -width / 2 : width / 2}
        width={width}
        height={height}
        isLeftHinge={isLeftHinge}
        directionSign={directionSign}
      />
      <group
        ref={pivotRef}
        position={[isLeftHinge ? -width / 2 : width / 2, 0, 0]}
      >
        <group position={[isLeftHinge ? width / 2 : -width / 2, 0, 0]}>
          <HoverableGroup part="panel" onHoverPart={onHoverPart} hoveredPart={hoveredPart}>
            <DoorPanel
              width={width}
              height={height}
              hex={config.colorHex}
              material={config.material}
              finish={config.finish}
              hasGlass={config.hasGlass}
              textureUrl={config.textureUrl}
            />
          </HoverableGroup>
          {config.hasGlass && (
            <HoverableGroup part="glass" onHoverPart={onHoverPart} hoveredPart={hoveredPart}>
              <Glass width={width} height={height} />
            </HoverableGroup>
          )}
          <HoverableGroup part="handle" onHoverPart={onHoverPart} hoveredPart={hoveredPart}>
            {/* Poignée FRONT (face avant de la porte, z = +0.045) */}
            <Handle slug={config.handle} position={[handleX, 0, 0.045]} signX={handleSignX} />
          </HoverableGroup>
          {/* Poignée BACK (face arrière, z = -0.045) — rotation 180° autour de Y pour faire
              sortir le lever du bon côté, signX inversé pour pointer dans la même direction
              monde (toujours vers le centre de la porte). */}
          <group rotation={[0, Math.PI, 0]}>
            <Handle
              slug={config.handle}
              position={[-handleX, 0, 0.045]}
              signX={-handleSignX}
            />
          </group>
          {config.hasLock && (
            <HoverableGroup part="lock" onHoverPart={onHoverPart} hoveredPart={hoveredPart}>
              <Lock position={[handleX, -0.12, 0.04]} />
              <Lock position={[handleX, -0.12, -0.04]} />
            </HoverableGroup>
          )}
          <HoverableGroup part="hinges" onHoverPart={onHoverPart} hoveredPart={hoveredPart}>
            <Hinges x={isLeftHinge ? -width / 2 + 0.04 : width / 2 - 0.04} height={height} />
          </HoverableGroup>
        </group>
      </group>
    </group>
  );
}
