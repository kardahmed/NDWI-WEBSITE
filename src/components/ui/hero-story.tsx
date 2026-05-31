'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Hero éditorial réutilisable — remplace PageHeader sur les pages signature
 * (Habitat, Réalisations, Showrooms, Pro). Apporte un caractère cinématique
 * vs le PageHeader text-only.
 *
 * Composé d'un fond (image, vidéo ou couleur unie) + gradient lisibilité
 * + bloc texte aligné bas-gauche, avec animations Framer en cascade.
 * Optionnellement un scroll cue chevron animé en bas.
 *
 * Usage typique :
 *   <HeroStory
 *     eyebrow="Habitat"
 *     title="L'habitat algérien réinventé."
 *     subtitle="Portes, cuisines, dressing, chambres — la totale NDWi."
 *     bgImage="/images/heroes/habitat.jpg"
 *     theme="dark"
 *     scrollCueId="categories"
 *   />
 */

interface HeroStoryProps {
  /** Petit texte au-dessus du titre (style copper uppercase). */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Photo de fond pleine largeur. */
  bgImage?: string;
  /** Vidéo de fond pleine largeur (prend le pas sur bgImage). */
  bgVideo?: string;
  /** Image poster pour la vidéo (fallback avant lecture). */
  bgPoster?: string;
  /** Couleur de fond fallback si pas d'image/vidéo. */
  bgColor?: string;
  /** Thème texte : 'light' (texte ink sur fond clair) | 'dark' (texte bone sur fond sombre).
   *  Défaut 'dark' si image/vidéo (gradient sombre auto), 'light' sinon. */
  theme?: 'light' | 'dark';
  /** Hauteur. Default 'md' (~60vh). 'sm' (~45vh) pour pages moins prio, 'lg' (~75vh) pour pages héros. */
  height?: 'sm' | 'md' | 'lg';
  /** Si fourni, affiche un chevron scroll cue qui scrolle vers cet ID. */
  scrollCueId?: string;
  /** Contenu additionnel à droite (badge / chiffres-clés / etc.). */
  rightSlot?: React.ReactNode;
  className?: string;
}

const heightClasses: Record<NonNullable<HeroStoryProps['height']>, string> = {
  sm: 'min-h-[45vh] lg:min-h-[50vh]',
  md: 'min-h-[55vh] lg:min-h-[65vh]',
  lg: 'min-h-[70vh] lg:min-h-[80vh]',
};

export function HeroStory({
  eyebrow,
  title,
  subtitle,
  bgImage,
  bgVideo,
  bgPoster,
  bgColor = '#1f1b16',
  theme,
  height = 'md',
  scrollCueId,
  rightSlot,
  className,
}: HeroStoryProps) {
  // Auto-détection du thème : si media de fond → dark (text clair sur overlay sombre)
  const effectiveTheme = theme ?? (bgImage || bgVideo ? 'dark' : 'light');
  const isDark = effectiveTheme === 'dark';

  const onScrollCue = () => {
    if (!scrollCueId) return;
    const target = document.getElementById(scrollCueId);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      className={cn(
        'relative isolate overflow-hidden flex items-end',
        heightClasses[height],
        !bgImage && !bgVideo && (isDark ? 'bg-ink' : 'bg-bone-100'),
        className
      )}
      style={!bgImage && !bgVideo ? { backgroundColor: bgColor } : undefined}
    >
      {/* Media de fond */}
      {bgVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={bgVideo}
          poster={bgPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        />
      ) : bgImage ? (
        <Image
          src={bgImage}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
          aria-hidden
        />
      ) : null}

      {/* Overlay lisibilité — gradient adaptatif au thème */}
      {(bgImage || bgVideo) && (
        <>
          <div
            className={cn(
              'absolute inset-0',
              isDark
                ? 'bg-gradient-to-r from-ink/90 via-ink/65 to-ink/15'
                : 'bg-gradient-to-r from-bone-50/95 via-bone-50/70 to-bone-50/20'
            )}
            aria-hidden
          />
          <div
            className={cn(
              'absolute inset-0',
              isDark
                ? 'bg-gradient-to-t from-ink/80 via-transparent to-transparent'
                : 'bg-gradient-to-t from-bone-50/80 via-transparent to-transparent'
            )}
            aria-hidden
          />
        </>
      )}

      {/* Contenu en cascade */}
      <div className="relative container-page pt-24 pb-16 lg:pt-32 lg:pb-20 w-full">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            {eyebrow && (
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'inline-block text-xs uppercase tracking-[0.18em] font-medium',
                  isDark ? 'text-copper-400' : 'text-copper-500'
                )}
              >
                {eyebrow}
              </motion.span>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'heading-display mt-5 text-display-lg lg:text-display-xl leading-[1.05]',
                isDark ? 'text-bone-50' : 'text-ink'
              )}
            >
              {title}
            </motion.h1>

            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'mt-6 max-w-2xl text-lg leading-relaxed md:text-xl',
                  isDark ? 'text-bone-50/75' : 'text-ink/70'
                )}
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          {/* Slot droit (badges, chiffres-clés…) */}
          {rightSlot && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="lg:max-w-xs"
            >
              {rightSlot}
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll cue chevron en bas */}
      {scrollCueId && (
        <motion.button
          type="button"
          onClick={onScrollCue}
          aria-label="Faire défiler"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className={cn(
            'absolute bottom-6 left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full border transition-colors',
            isDark
              ? 'border-bone-50/30 text-bone-50/60 hover:border-bone-50/60 hover:text-bone-50'
              : 'border-ink/30 text-ink/60 hover:border-ink/60 hover:text-ink'
          )}
        >
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="inline-flex"
          >
            <ChevronDown size={18} />
          </motion.span>
        </motion.button>
      )}
    </section>
  );
}
