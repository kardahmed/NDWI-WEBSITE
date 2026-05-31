'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Layout sticky-scroll Apple Pro style.
 *
 * Colonne GAUCHE (texte) reste sticky pendant que la colonne DROITE
 * (images/chapitres) scrolle. Quand on entre dans une nouvelle "section"
 * de la colonne droite, on peut mettre à jour le contenu gauche
 * (via le système de chapitres).
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
 * 2. Mode chapitres synchronisés — le texte gauche change selon la progression :
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
    return (
      <ChaptersMode chapters={chapters} bg={bg} className={className} />
    );
  }

  if (!leftSticky || !rightChapters) return null;

  return (
    <section className={cn(bg, className)}>
      <div className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Colonne gauche sticky */}
          <div className="lg:sticky lg:top-32 lg:self-start lg:h-fit">
            {leftSticky}
          </div>

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

// ─── Mode chapitres synchronisés ─────────────────────────────────

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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Index du chapitre actuel (0..n-1) en fonction du scroll progress.
  // Quand on est à 0%, chapitre 0. Quand on est à 100%, dernier chapitre.
  const activeIndex = useTransform(scrollYProgress, (v) => {
    return Math.min(Math.floor(v * chapters.length), chapters.length - 1);
  });

  return (
    <section
      ref={containerRef}
      className={cn(bg, 'relative', className)}
      style={{ minHeight: `${chapters.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center">
        <div className="container-page w-full">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Texte gauche — change selon le chapitre actif */}
            <div className="space-y-6">
              {chapters.map((c, i) => (
                <ChapterText key={i} index={i} activeIndex={activeIndex} chapter={c} />
              ))}
            </div>

            {/* Média droite — change selon le chapitre actif */}
            <div className="relative aspect-[4/5] lg:aspect-[3/4]">
              {chapters.map((c, i) => (
                <ChapterMedia key={i} index={i} activeIndex={activeIndex} media={c.media} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChapterText({
  index,
  activeIndex,
  chapter,
}: {
  index: number;
  activeIndex: ReturnType<typeof useTransform<number, number>>;
  chapter: StickyChapter;
}) {
  const opacity = useTransform(activeIndex, (v) => (v === index ? 1 : 0));
  return (
    <motion.div
      style={{ opacity, position: index === 0 ? 'relative' : 'absolute' }}
      transition={{ duration: 0.5 }}
      className="lg:max-w-md"
    >
      {chapter.eyebrow && (
        <p className="text-xs uppercase tracking-[0.18em] text-copper-500 font-medium">
          {chapter.eyebrow}
        </p>
      )}
      <h2 className="heading-display mt-3 text-display-md lg:text-display-lg leading-tight">
        {chapter.title}
      </h2>
      {chapter.body && (
        <p className="mt-5 text-base lg:text-lg text-ink/70 leading-relaxed">
          {chapter.body}
        </p>
      )}
    </motion.div>
  );
}

function ChapterMedia({
  index,
  activeIndex,
  media,
}: {
  index: number;
  activeIndex: ReturnType<typeof useTransform<number, number>>;
  media: ReactNode;
}) {
  const opacity = useTransform(activeIndex, (v) => (v === index ? 1 : 0));
  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      {media}
    </motion.div>
  );
}
