'use client';

import { ArrowRight, Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';

const COPY: Record<Locale, { idle: string; loading: string }> = {
  fr: { idle: 'Envoyer ma demande', loading: 'Envoi en cours…' },
  ar: { idle: 'إرسال طلبي', loading: 'جاري الإرسال…' },
};

export function SubmitButton({
  status,
  labelIdle,
  className = 'btn-primary flex-1 disabled:opacity-60',
}: {
  status: 'idle' | 'submitting' | 'error';
  labelIdle?: string;
  className?: string;
}) {
  const locale = useLocale() as Locale;
  const c = COPY[locale] ?? COPY.fr;
  return (
    <button type="submit" disabled={status === 'submitting'} className={className}>
      {status === 'submitting' ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {c.loading}
        </>
      ) : (
        <>
          {labelIdle ?? c.idle}
          <ArrowRight size={16} className="rtl:rotate-180" />
        </>
      )}
    </button>
  );
}
