'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, Loader2, AlertCircle } from 'lucide-react';
import { SUBMIT_LEAD_URL } from '@/lib/supabase';
import type { Locale } from '@/i18n/routing';

const schema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2).max(100).default('Newsletter subscriber'),
  hp_field: z.string().optional().default(''),
});

type FormData = z.infer<typeof schema>;
type Status = 'idle' | 'submitting' | 'success' | 'error';

export function NewsletterSignup() {
  const t = useTranslations('newsletter');
  const locale = useLocale() as Locale;
  const [status, setStatus] = useState<Status>('idle');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: 'Newsletter subscriber', hp_field: '' },
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
          lead_type: 'newsletter',
          common: {
            fullName: data.fullName,
            email: data.email,
            phone: '',
            consent: true,
            sourcePage: '/inspiration',
            locale,
          },
          specific: {},
          hp_field: data.hp_field,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="bg-ink text-bone-50 py-20">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:items-center">
          <div>
            <span className="eyebrow !text-copper-400">{t('eyebrow')}</span>
            <h2 className="heading-display mt-4 text-display-md">{t('title')}</h2>
            <p className="mt-5 text-base leading-relaxed text-bone-200/70 max-w-prose">
              {t('subtitle')}
            </p>
          </div>

          <div>
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-4 p-5 border border-copper-500/40 bg-copper-500/10"
                >
                  <span className="h-10 w-10 rounded-full bg-copper-500 flex items-center justify-center flex-shrink-0">
                    <Check size={18} strokeWidth={2.5} />
                  </span>
                  <div>
                    <p className="font-display text-xl">{t('success.title')}</p>
                    <p className="mt-1 text-sm text-bone-200/70">{t('success.body')}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-3"
                  autoComplete="off"
                >
                  {/* Honeypot */}
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
                    <input type="text" tabIndex={-1} autoComplete="new-password" data-1p-ignore {...register('hp_field')} />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex-1 relative">
                      <Mail
                        size={18}
                        className="absolute start-4 top-1/2 -translate-y-1/2 text-bone-200/40"
                      />
                      <input
                        type="email"
                        autoComplete="email"
                        placeholder={t('placeholder')}
                        className="w-full bg-transparent border border-bone-200/20 px-12 py-4 text-sm text-bone-50 placeholder:text-bone-200/30 focus:outline-none focus:border-bone-50 transition-colors"
                        {...register('email')}
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="inline-flex items-center justify-center gap-2 bg-copper-500 hover:bg-copper-600 px-7 py-4 text-sm uppercase tracking-[0.14em] text-bone-50 transition-colors disabled:opacity-60"
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
                  </div>

                  {errors.email && (
                    <p className="text-xs text-red-400">{t('error.email')}</p>
                  )}
                  {status === 'error' && (
                    <p className="text-xs text-red-400 flex items-center gap-2">
                      <AlertCircle size={12} />
                      {t('error.generic')}
                    </p>
                  )}

                  <p className="text-xs text-bone-200/40 mt-2">{t('privacy')}</p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
