'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { DoorProduct } from '@/lib/data/types';
import type {
  DoorRevetement,
  DoorPoignee,
  DoorVitrage,
  SensOuverture,
} from '@/lib/data/door-options';

/**
 * Aperçu live du configurateur — APPROCHE PHOTO + OVERLAY COULEUR.
 *
 * Inspirée de la technique utilisée par Garofoli, PAIL, Bertolotto :
 * - une photo HD réelle de la porte (vue de face, finition neutre claire)
 *   est uploadée par l'utilisateur dans Sanity (champ door.configuratorImage)
 * - quand le client choisit un revêtement, on superpose la couleur en
 *   `mix-blend-mode: multiply` → tinte la photo en gardant ombres et grain
 * - le sens d'ouverture flippe horizontalement la photo (la poignée passe
 *   de gauche à droite)
 * - si vitrage non-plein → un cadre verre translucide apparaît en surimpression
 *
 * Si pas de photo uploadée → placeholder typographique stylé avec la
 * couleur appliquée sur un faux panneau, qui reste fonctionnel et propre.
 */

interface DoorPhotoPreviewProps {
  door: DoorProduct;
  revetement?: DoorRevetement;
  poignee?: DoorPoignee;
  vitrage?: DoorVitrage;
  sens?: SensOuverture;
}

export function DoorPhotoPreview({
  door,
  revetement,
  poignee,
  vitrage,
  sens = 'droite',
}: DoorPhotoPreviewProps) {
  const photoUrl = door.configuratorImageUrl;
  const overlayColor = revetement?.hex ?? '#a89478';
  const overlayImage = revetement?.image; // texture HD si dispo
  const hasGlass = vitrage ? vitrage.slug !== 'porte-pleine' : false;

  // Si sens=gauche, on flippe horizontalement la photo pour que la poignée
  // passe à gauche (en partant du principe que la photo est avec poignée à droite).
  const flipped = sens === 'gauche';

  return (
    <div className="relative aspect-[3/5] w-full overflow-hidden bg-gradient-to-br from-bone-100 to-bone-200">
      {photoUrl ? (
        // ─── Mode PHOTO + OVERLAY ───
        <div
          className="relative h-full w-full"
          style={{ transform: flipped ? 'scaleX(-1)' : undefined }}
        >
          {/* Photo de base */}
          <Image
            src={photoUrl}
            alt={door.name}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 380px"
            priority
          />

          {/* Overlay couleur revêtement — change instantanément au clic */}
          <AnimatePresence mode="wait">
            <motion.div
              key={revetement?.slug ?? 'none'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 pointer-events-none mix-blend-multiply"
              style={
                overlayImage
                  ? {
                      backgroundImage: `url(${overlayImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : { backgroundColor: overlayColor }
              }
              aria-hidden
            />
          </AnimatePresence>

          {/* Glow subtil pour éviter overlay flat */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(120deg, rgba(255,255,255,0.07) 0%, rgba(0,0,0,0.06) 60%)',
              mixBlendMode: 'overlay',
            }}
            aria-hidden
          />

          {/* Vitrage : carré translucide vers le haut de la porte */}
          {hasGlass && (
            <div
              className="absolute pointer-events-none border border-white/30"
              style={{
                top: '22%',
                left: '22%',
                right: '22%',
                height: '22%',
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.45), rgba(220,235,245,0.30))',
                backdropFilter: 'blur(2px)',
                boxShadow: 'inset 0 0 12px rgba(255,255,255,0.4)',
              }}
              aria-hidden
            />
          )}
        </div>
      ) : (
        // ─── Mode FALLBACK : photo absente → placeholder typo stylé ───
        <PlaceholderDoor
          name={door.name}
          color={overlayColor}
          flipped={flipped}
          hasGlass={hasGlass}
          handleShape={poignee?.shape}
        />
      )}

      {/* Caption info + état */}
      <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-3 pb-1.5 text-[10px] uppercase tracking-[0.14em] text-ink/40">
        <span>
          {sens === 'gauche' ? '← Ouverture gauche' : 'Ouverture droite →'}
        </span>
        {!photoUrl && (
          <span className="text-copper-500/80">Photo configurateur à uploader</span>
        )}
      </div>
    </div>
  );
}

// ─── Placeholder stylé quand pas de photo ─────────────────────────

function PlaceholderDoor({
  name,
  color,
  flipped,
  hasGlass,
  handleShape,
}: {
  name: string;
  color: string;
  flipped: boolean;
  hasGlass: boolean;
  handleShape?: DoorPoignee['shape'];
}) {
  return (
    <div className="relative h-full w-full p-6">
      {/* Panneau de fond avec la couleur du revêtement */}
      <motion.div
        key={color}
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="absolute inset-x-6 inset-y-4 border border-ink/15 shadow-inner"
        style={{ backgroundColor: color, transform: flipped ? 'scaleX(-1)' : undefined }}
      >
        {/* Effet de panneau (cadre intérieur léger) */}
        <div className="absolute inset-x-3 inset-y-3 border border-white/5" aria-hidden />

        {/* Vitrage placeholder */}
        {hasGlass && (
          <div
            className="absolute border border-white/40"
            style={{
              top: '22%',
              left: '15%',
              right: '15%',
              height: '22%',
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.5), rgba(220,235,245,0.35))',
            }}
            aria-hidden
          />
        )}

        {/* Poignée stylée — simple barre verticale ou bouton selon forme */}
        <div
          className={
            handleShape === 'bouton'
              ? 'absolute h-3 w-3 rounded-full bg-white/85 shadow-md'
              : 'absolute h-10 w-1 rounded-full bg-white/85 shadow-md'
          }
          style={{
            top: '62%',
            right: '8%',
          }}
          aria-hidden
        />
      </motion.div>

      {/* Nom au bas */}
      <div className="absolute inset-x-0 bottom-6 text-center">
        <p className="font-display text-2xl text-ink/35">{name}</p>
      </div>
    </div>
  );
}
