'use client';

import { motion } from 'framer-motion';

/**
 * Template Next.js App Router — exécuté à chaque navigation entre routes.
 *
 * Contrairement à layout.tsx (instancié une seule fois), template.tsx
 * remonte le composant à chaque changement de page, ce qui permet de jouer
 * une animation d'entrée à chaque navigation.
 *
 * Effet : fade-up subtil de 8 px en 250 ms. Suffisamment court pour ne pas
 * gêner, suffisamment présent pour donner une sensation d'app premium.
 */
export default function LocaleTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
