'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DevisForm } from './devis-form';
import type { Univers } from '@/lib/schemas/lead';

interface DevisModalTriggerProps {
  /** Univers pré-sélectionnés (un seul ou plusieurs). */
  defaultUnivers?: Univers | Univers[];
  defaultProductSlug?: string;
  sourcePage?: string;
  label?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function DevisModalTrigger({
  defaultUnivers,
  defaultProductSlug,
  sourcePage,
  label,
  variant = 'primary',
  className,
}: DevisModalTriggerProps) {
  const t = useTranslations('devisForm');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${className ?? ''}`}
      >
        {label ?? t('triggerLabel')}
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
            onClick={() => setOpen(false)}
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
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute top-5 end-5 z-10 h-9 w-9 flex items-center justify-center bg-bone-50 border border-ink/10 hover:bg-bone-200 transition-colors"
              >
                <X size={18} />
              </button>
              <DevisForm
                defaultUnivers={defaultUnivers}
                defaultProductSlug={defaultProductSlug}
                sourcePage={sourcePage}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
