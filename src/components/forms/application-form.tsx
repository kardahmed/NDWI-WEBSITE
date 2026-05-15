'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { SUBMIT_LEAD_URL } from '@/lib/supabase';
import { algerianPhoneRegex } from '@/lib/schemas/lead';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const schema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(8).regex(algerianPhoneRegex),
  position: z.string().min(2).max(200),
  message: z.string().min(20).max(2000),
  linkedin: z.string().url().or(z.literal('')).optional(),
  hp_field: z.string().optional().default(''),
});

type FormData = z.infer<typeof schema>;
type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ApplicationForm() {
  const t = useTranslations('careers.application');
  const locale = useLocale() as Locale;
  const [status, setStatus] = useState<Status>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { hp_field: '', linkedin: '' },
  });

  const onSubmit = async (data: FormData) => {
    setStatus('submitting');
    try {
      const res = await fetch(SUBMIT_LEAD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          city: 'N/A',
          univers: ['autre'],
          locale,
          sourcePage: '/carrieres',
          message: `[Candidature spontanée]\nPoste : ${data.position}\n${
            data.linkedin ? `LinkedIn : ${data.linkedin}\n` : ''
          }\n${data.message}`,
          hp_field: data.hp_field,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-bone-50 border border-ink/10 p-10 lg:p-14 text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-copper-500 flex items-center justify-center">
          <Check size={26} className="text-bone-50" strokeWidth={2.5} />
        </div>
        <h3 className="heading-display mt-8 text-3xl">{t('success.title')}</h3>
        <p className="mt-4 text-ink/70 max-w-md mx-auto">{t('success.body')}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="bg-bone-50 border border-ink/10 p-8 lg:p-12 space-y-6"
    >
      {/* Honeypot */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
        <input type="text" tabIndex={-1} autoComplete="new-password" data-1p-ignore {...register('hp_field')} />
      </div>

      <Field label={t('fields.fullName')} error={errors.fullName?.message}>
        <input
          type="text"
          autoComplete="name"
          placeholder={t('placeholders.fullName')}
          className={inputCls}
          {...register('fullName')}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label={t('fields.email')} error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            placeholder="vous@example.com"
            className={inputCls}
            {...register('email')}
          />
        </Field>
        <Field label={t('fields.phone')} error={errors.phone?.message}>
          <input
            type="tel"
            autoComplete="tel"
            placeholder="+213 555 ..."
            className={inputCls}
            {...register('phone')}
          />
        </Field>
      </div>

      <Field label={t('fields.position')} error={errors.position?.message}>
        <input
          type="text"
          placeholder={t('placeholders.position')}
          className={inputCls}
          {...register('position')}
        />
      </Field>

      <Field label={t('fields.linkedin')} optional t={t}>
        <input
          type="url"
          placeholder="https://linkedin.com/in/..."
          className={inputCls}
          {...register('linkedin')}
        />
      </Field>

      <Field label={t('fields.message')} error={errors.message?.message}>
        <textarea
          rows={6}
          placeholder={t('placeholders.message')}
          className={cn(inputCls, 'resize-none')}
          {...register('message')}
        />
      </Field>

      <div className="border border-ink/10 bg-bone-100 p-4 text-xs text-ink/60 leading-relaxed">
        💡 {t('cvNote')}
      </div>

      {status === 'error' && (
        <div className="flex items-start gap-3 p-4 border border-red-500/30 bg-red-50/40 text-sm">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{t('error')}</p>
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn-primary w-full disabled:opacity-60"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t('submitting')}
            </>
          ) : (
            t('submit')
          )}
        </button>
        <p className="mt-3 text-xs text-ink/50">{t('privacy')}</p>
      </div>
    </form>
  );
}

const inputCls =
  'w-full bg-transparent border border-ink/15 px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink transition-colors';

function Field({
  label,
  children,
  error,
  optional,
  t,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  optional?: boolean;
  t?: (k: string) => string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.14em] text-ink/60 mb-3">
        {label}
        {optional && t && <span className="ms-2 text-ink/30 normal-case tracking-normal">({t('optional')})</span>}
      </label>
      {children}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
