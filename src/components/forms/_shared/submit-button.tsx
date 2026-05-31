'use client';

import { ArrowRight, Loader2, Check } from 'lucide-react';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const COPY: Record<Locale, { idle: string; loading: string; success: string }> = {
  fr: { idle: 'Envoyer ma demande', loading: 'Envoi en cours…', success: 'Envoyé' },
  ar: { idle: 'إرسال طلبي', loading: 'جاري الإرسال…', success: 'تم الإرسال' },
};

/**
 * Bouton submit avec 3 états animés :
 *   idle      → label + flèche
 *   submitting → spinner + texte loading (button disabled)
 *   success   → check vert qui pop (transient avant que FormSuccess remplace)
 *   error     → revient à idle (l'erreur se voit via ErrorBanner externe)
 *
 * Le bouton ne change pas de largeur, juste le contenu via AnimatePresence.
 * Compat avec l'ancienne signature (status: 'idle'|'submitting'|'error').
 */
export function SubmitButton({
  status,
  labelIdle,
  className = 'btn-primary flex-1 disabled:opacity-60',
}: {
  status: 'idle' | 'submitting' | 'success' | 'error';
  labelIdle?: string;
  className?: string;
}) {
  const locale = useLocale() as Locale;
  const c = COPY[locale] ?? COPY.fr;
  const isSubmitting = status === 'submitting';
  const isSuccess = status === 'success';

  return (
    <button
      type="submit"
      disabled={isSubmitting || isSuccess}
      className={cn(
        className,
        'relative overflow-hidden transition-colors duration-300',
        isSuccess && '!bg-green-600 !border-green-600 !text-bone-50'
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isSubmitting ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2"
          >
            <Loader2 size={16} className="animate-spin" />
            {c.loading}
          </motion.span>
        ) : isSuccess ? (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className="inline-flex items-center gap-2"
          >
            <Check size={16} strokeWidth={3} />
            {c.success}
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2"
          >
            {labelIdle ?? c.idle}
            <ArrowRight size={16} className="rtl:rotate-180" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
