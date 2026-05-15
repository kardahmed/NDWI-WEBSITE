'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Joue des sons MP3 préchargés (Mixkit Free SFX) avec toggle persisté.
 * Les fichiers sont dans `/public/sounds/` — voir le README pour les sources et licences.
 */
export type SoundName = 'click' | 'door-open' | 'door-close';

const SOUND_FILES: Record<SoundName, string> = {
  click: '/sounds/click.mp3',
  'door-open': '/sounds/door-open.mp3',
  'door-close': '/sounds/door-close.mp3',
};

const SOUND_VOLUME: Record<SoundName, number> = {
  click: 0.25,
  'door-open': 0.4,
  'door-close': 0.4,
};

const STORAGE_KEY = 'ndwi-configurator-sound';

export function useSoundFx() {
  const [enabled, setEnabled] = useState(false);
  // Cache d'Audio elements (1 par son, ré-utilisé via clone pour permettre overlap)
  const audioCache = useRef<Record<SoundName, HTMLAudioElement | null>>({
    click: null,
    'door-open': null,
    'door-close': null,
  });

  // Restore préférence depuis localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setEnabled(window.localStorage.getItem(STORAGE_KEY) === '1');
  }, []);

  // Précharge les MP3 au mount (rapide, ~165 KB total)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    (Object.keys(SOUND_FILES) as SoundName[]).forEach((name) => {
      if (audioCache.current[name]) return;
      const audio = new Audio(SOUND_FILES[name]);
      audio.preload = 'auto';
      audio.volume = SOUND_VOLUME[name];
      audioCache.current[name] = audio;
    });
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      } catch {}
      return next;
    });
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled || typeof window === 'undefined') return;
      const base = audioCache.current[name];
      if (!base) return;
      // Clone le node pour permettre plusieurs sons simultanés (sinon "click click" rapide tronque)
      const node = base.cloneNode(true) as HTMLAudioElement;
      node.volume = SOUND_VOLUME[name];
      node.play().catch(() => {
        /* Autoplay bloqué : silencieux. L'utilisateur doit avoir interagi avec la page. */
      });
    },
    [enabled]
  );

  return { enabled, toggle, play };
}
