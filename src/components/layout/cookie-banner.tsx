'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';

const STORAGE_KEY = 'ndwi_cookie_consent';

type Consent = 'accepted' | 'rejected';

export function CookieBanner() {
  const t = useTranslations('cookies');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const handleConsent = (value: Consent) => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
    // Dispatch event so analytics scripts can react
    window.dispatchEvent(new CustomEvent('ndwi:consent', { detail: value }));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 inset-x-4 lg:bottom-6 lg:start-6 lg:end-auto lg:max-w-md z-40"
          role="dialog"
          aria-label={t('label')}
        >
          <div className="bg-ink text-bone-50 border border-bone-200/10 p-5 lg:p-6 shadow-lg">
            <p className="font-display text-lg mb-2">{t('title')}</p>
            <p className="text-xs leading-relaxed text-bone-200/70">
              {t('body')}{' '}
              <Link href="/privacy" className="text-copper-400 underline underline-offset-2 hover:text-copper-300">
                {t('learnMore')}
              </Link>
              .
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => handleConsent('rejected')}
                className="px-4 py-2.5 border border-bone-200/30 text-xs uppercase tracking-[0.14em] text-bone-50 hover:border-bone-50 transition-colors"
              >
                {t('reject')}
              </button>
              <button
                onClick={() => handleConsent('accepted')}
                className="px-4 py-2.5 bg-copper-500 hover:bg-copper-600 text-xs uppercase tracking-[0.14em] text-bone-50 transition-colors"
              >
                {t('accept')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
