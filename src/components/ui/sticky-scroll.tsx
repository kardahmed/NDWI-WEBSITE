'use client';

import { useRef, useState, useEffect, type ReactNode } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Layout sticky-scroll Apple Pro style.
 *
 * Colonne GAUCHE (texte) reste sticky pendant que la colonne DROITE
 * (images/chapitres) scrolle. Le chapitre actif change selon la progression
 * du scroll dans le container.
 *
 * Le composant offre 2 modes :
 *
 * 1. Mode simple — un texte sticky fixe + contenu scrollable variable :
 *
 *    <StickyScrollSection
 *      leftSticky={<div>Notre histoire</div>}
 *      rightChapters={[
 *        <img src="2005.jpg" />,
 *        <img src="2010.jpg" />,
 *        <img src="2024.jpg" />,
 *      ]}
 *    />
 *
 * 2. Mode chapitres synchronisés — texte+média changent ensemble :
 *
 *    <StickyScrollSection chapters={[
 *      { eyebrow: '2005', title: 'Fondation', body: '...', media: <img/> },
 *      { eyebrow: '2010', title: 'Croissance', body: '...', media: <img/> },
 *    ]} />
 */

export interface StickyChapter {
  eyebrow?: string;
  title: string;
  body?: string;
  media?: ReactNode;
}

interface StickyScrollProps {
  /** Mode chapitres : liste avec couple texte + média synchronisés. */
  chapters?: StickyChapter[];
  /** Mode simple : élément sticky fixe à gauche. */
  leftSticky?: ReactNode;
  /** Mode simple : éléments qui scrollent à droite (chapitres successifs). */
  rightChapters?: ReactNode[];
  /** Couleur fond. Default bone-100. */
  bg?: string;
  className?: string;
}

export function StickyScrollSection({
  chapters,
  leftSticky,
  rightChapters,
  bg = 'bg-bone-100',
  className,
}: StickyScrollProps) {
  // Mode chapitres : on transforme en mode simple en interne.
  if (chapters && chapters.length > 0) {
    return <ChaptersMode chapters={chapters} bg={bg} className={className} />;
  }

  if (!leftSticky || !rightChapters) return null;

  return (
    <section className={cn(bg, className)}>
      <div className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Colonne gauche sticky */}
          <div className="lg:sticky lg:top-32 lg:self-start lg:h-fit">{leftSticky}</div>

          {/* Colonne droite scrollable */}
          <div className="space-y-16 lg:space-y-32">
            {rightChapters.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                {c}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Mode chapitres synchronisés (refondu — pas d'overlap) ─────────

function ChaptersMode({
  chapters,
  bg,
  className,
}: {
  chapters: StickyChapter[];
  bg: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Synchronise activeIndex sur scroll : on découpe [0..1] en N intervalles égaux.
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(Math.floor(v * chapters.length), chapters.length - 1);
    if (next !== activeIndex) setActiveIndex(next);
  });

  const active = chapters[activeIndex] ?? chapters[0];

  return (
    <section
      ref={containerRef}
      className={cn(bg, 'relative', className)}
      // Hauteur totale = 1 viewport par chapitre. Donne l'espace de scroll au sticky.
      style={{ minHeight: `${chapters.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="container-page w-full">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* ─── Texte gauche : un seul chapitre à la fois ─── */}
            <div className="relative min-h-[220px] lg:min-h-[260px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="lg:max-w-md"
                >
                  {active.eyebrow && (
                    <p className="text-xs uppercase tracking-[0.18em] text-copper-500 font-medium">
                      {active.eyebrow}
                    </p>
                  )}
                  <h2 className="heading-display mt-3 text-display-md lg:text-display-lg leading-tight">
                    {active.title}
                  </h2>
                  {active.body && (
                    <p className="mt-5 text-base lg:text-lg text-ink/70 leading-relaxed">
                      {active.body}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Pagination chapitres — petits dots qui indiquent où on est */}
              <div className="absolute bottom-0 start-0 flex items-center gap-1.5">
                {chapters.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1 transition-all duration-300',
                      i === activeIndex ? 'w-8 bg-copper-500' : 'w-1.5 bg-ink/20'
                    )}
                  />
                ))}
              </div>
            </div>

            {/* ─── Média droite : un seul à la fois ─── */}
            <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  {active.media}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
