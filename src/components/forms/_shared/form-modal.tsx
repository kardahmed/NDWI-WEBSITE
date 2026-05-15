'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';

interface FormModalTriggerProps {
  label: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  /** Le formulaire rendu à l'intérieur de la modale. */
  children: React.ReactNode;
}

/**
 * Bouton qui ouvre une modale contenant un formulaire arbitraire.
 * Pattern partagé : verrouille le scroll, ferme via X / clic backdrop / Esc.
 */
export function FormModalTrigger({ label, variant = 'primary', className, children }: FormModalTriggerProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${className ?? ''}`}
      >
        {label}
        <ArrowUpRight size={16} className="rtl:rotate-90" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto mt-12 lg:mt-20 max-w-2xl w-[calc(100%-32px)] max-h-[calc(100vh-96px)] overflow-y-auto bg-bone-50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute top-5 end-5 z-10 h-9 w-9 flex items-center justify-center bg-bone-50 border border-ink/10 hover:bg-bone-200 transition-colors"
              >
                <X size={18} />
              </button>
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
