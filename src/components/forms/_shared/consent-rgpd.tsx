'use client';

import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';

const COPY: Record<Locale, { label: string; error: string }> = {
  fr: {
    label:
      "J'accepte que mes données soient utilisées pour répondre à ma demande, conformément à la politique de confidentialité.",
    error: 'Acceptation requise pour traiter votre demande.',
  },
  ar: {
    label:
      'أوافق على استخدام بياناتي للرد على طلبي، وفقًا لسياسة الخصوصية.',
    error: 'الموافقة مطلوبة لمعالجة طلبك.',
  },
};

export function ConsentRgpd<T extends FieldValues>({
  register,
  error,
}: {
  register: UseFormRegister<T>;
  error?: string;
}) {
  const locale = useLocale() as Locale;
  const copy = COPY[locale] ?? COPY.fr;
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          {...register('consent' as Path<T>)}
          className="mt-1 h-4 w-4 accent-copper-500 flex-shrink-0"
        />
        <span className="text-xs text-ink/60 leading-relaxed">{copy.label}</span>
      </label>
      {error && <p className="mt-2 text-xs text-red-600">{copy.error}</p>}
    </div>
  );
}
