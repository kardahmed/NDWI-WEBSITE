'use client';

import { Check } from 'lucide-react';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';

interface FormSuccessProps {
  title?: string;
  body?: string;
}

const DEFAULTS: Record<Locale, { title: string; body: string }> = {
  fr: {
    title: 'Demande reçue.',
    body: 'Un conseiller NDWI vous contactera sous 24 à 48 h ouvrées avec une réponse personnalisée.',
  },
  ar: {
    title: 'تم استلام طلبكم.',
    body: 'سيتواصل معكم مستشار NDWI خلال 24 إلى 48 ساعة عمل بإجابة شخصية.',
  },
};

export function FormSuccess({ title, body }: FormSuccessProps) {
  const locale = useLocale() as Locale;
  const d = DEFAULTS[locale] ?? DEFAULTS.fr;
  return (
    <div className="bg-bone-50 border border-ink/10 p-10 lg:p-14 text-center">
      <div className="mx-auto h-14 w-14 rounded-full bg-copper-500 flex items-center justify-center">
        <Check size={26} className="text-bone-50" strokeWidth={2.5} />
      </div>
      <h3 className="heading-display mt-8 text-3xl">{title ?? d.title}</h3>
      <p className="mt-4 text-ink/70 max-w-md mx-auto">{body ?? d.body}</p>
    </div>
  );
}
