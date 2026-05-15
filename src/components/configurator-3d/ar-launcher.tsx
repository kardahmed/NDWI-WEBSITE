'use client';

import { useEffect, useRef, useState } from 'react';
import { Box } from 'lucide-react';

interface ARLauncherProps {
  /** URL du GLB à projeter en AR (iOS Quick Look + Android Scene Viewer). */
  glbUrl?: string;
  /** Optionnel : URL du fichier USDZ pour iOS Quick Look natif (sans cela, model-viewer convertit). */
  usdzUrl?: string;
  locale: 'fr' | 'ar';
}

/**
 * Bouton "Voir chez moi (AR)" qui n'apparaît qu'au mobile et seulement si un GLB Sanity est disponible.
 * Le rendu AR utilise model-viewer (Google) en parallèle de R3F — UNIQUEMENT pour le clic AR,
 * pas pour le rendu interactif principal du configurateur.
 */
export function ARLauncher({ glbUrl, usdzUrl, locale }: ARLauncherProps) {
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mvRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Charger model-viewer côté client (lourd, lazy)
    import('@google/model-viewer').then(() => setLoaded(true));
    // Détecter mobile (l'AR n'a aucun sens sur desktop)
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  if (!glbUrl || !isMobile || !loaded) return null;

  const handleLaunchAR = () => {
    const mv = mvRef.current as any;
    if (mv?.activateAR) {
      mv.activateAR();
    }
  };

  return (
    <>
      <button
        onClick={handleLaunchAR}
        className="flex items-center gap-2 bg-bone-50/90 backdrop-blur px-3 py-2 text-[11px] uppercase tracking-[0.12em] hover:bg-bone-50 transition-colors"
        title={locale === 'ar' ? 'العرض في الواقع المعزز' : 'Voir en réalité augmentée'}
      >
        <Box size={14} />
        {locale === 'ar' ? 'AR' : 'AR chez moi'}
      </button>
      {/* model-viewer caché — seulement pour activer l'AR */}
      <div style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}>
        {/* @ts-expect-error — model-viewer custom element */}
        <model-viewer
          ref={mvRef as any}
          src={glbUrl}
          ios-src={usdzUrl}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="fixed"
        />
      </div>
    </>
  );
}
