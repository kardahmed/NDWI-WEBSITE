'use client';

import { motion } from 'framer-motion';

/**
 * Template Next.js App Router — exécuté à chaque navigation entre routes.
 *
 * Contrairement à layout.tsx (instancié une seule fois), template.tsx
 * remonte le composant à chaque changement de page, ce qui permet de jouer
 * une animation d'entrée à chaque navigation.
 *
 * Effet : fondu d'entrée subtil en 250 ms.
 *
 * IMPORTANT — pas d'animation `y`/transform ici : un `transform` (même résiduel)
 * sur ce wrapper crée un containing block qui CASSE le `position: sticky` des
 * sections enfants (ex. StickyScroll de « Notre histoire ») → contenu décroché
 * et grand vide blanc. On anime donc uniquement l'opacité.
 */
export default function LocaleTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
