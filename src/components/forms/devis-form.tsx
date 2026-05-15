'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Loader2, AlertCircle } from 'lucide-react';
import { leadSchema, type LeadInput, universValues, type Univers } from '@/lib/schemas/lead';
import { SUBMIT_LEAD_URL } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n/routing';

interface DevisFormProps {
  /** Univers pré-sélectionnés (multi). Accepte string (legacy) ou tableau. */
  defaultUnivers?: Univers | Univers[];
  defaultProductSlug?: string;
  sourcePage?: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function DevisForm({ defaultUnivers, defaultProductSlug, sourcePage }: DevisFormProps) {
  const t = useTranslations('devisForm');
  const locale = useLocale() as Locale;
  const [step, setStep] = useState<1 | 2>(1);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const initialUnivers: Univers[] = Array.isArray(defaultUnivers)
    ? defaultUnivers
    : defaultUnivers
    ? [defaultUnivers]
    : [];

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    mode: 'onBlur',
    defaultValues: {
      univers: initialUnivers,
      productSlug: defaultProductSlug,
      sourcePage,
      locale,
      hp_field: '',
    },
  });

  const { register, handleSubmit, formState: { errors }, trigger, watch } = form;
  const universVal = (watch('univers') ?? []) as Univers[];
  const cityVal = watch('city');

  const goNext = async () => {
    const valid = await trigger(['univers', 'city', 'timeline', 'budgetRange', 'projectType']);
    if (valid) setStep(2);
  };

  const onSubmit = async (data: LeadInput) => {
    console.log('[DevisForm] onSubmit called with', data);
    console.log('[DevisForm] SUBMIT_LEAD_URL =', SUBMIT_LEAD_URL);
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch(SUBMIT_LEAD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify(data),
      });
      console.log('[DevisForm] fetch returned status', res.status);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const body = await res.json().catch(() => ({}));
      console.log('[DevisForm] success body', body);
      setStatus('success');
    } catch (e) {
      console.error('[DevisForm] error', e);
      setStatus('error');
      setErrorMsg(e instanceof Error ? e.message : 'unknown');
    }
  };

  const onError = (errs: typeof errors) => {
    console.warn('[DevisForm] validation failed', errs);
    setErrorMsg(
      'Validation: ' +
        Object.entries(errs)
          .map(([k, v]) => `${k}=${(v as { message?: string })?.message ?? 'invalid'}`)
          .join(' · ')
    );
    setStatus('error');
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
      onSubmit={handleSubmit(onSubmit, onError)}
      autoComplete="off"
      className="bg-bone-50 border border-ink/10 p-8 lg:p-12"
    >
      {/* Honeypot anti-spam (caché aux humains et désactivé pour l'auto-saisie) */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
        <label>
          Ne pas remplir
          <input
            type="text"
            tabIndex={-1}
            autoComplete="new-password"
            data-1p-ignore
            data-lpignore="true"
            {...register('hp_field')}
          />
        </label>
      </div>

      <StepIndicator currentStep={step} t={t} />

      {/* Bandeau d'erreur global (debug) */}
      {status === 'error' && errorMsg && (
        <div className="mt-6 flex items-start gap-3 p-4 border border-red-500/40 bg-red-50 text-sm">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-red-800">Erreur (debug)</p>
            <p className="text-red-700 mt-1 break-words">{errorMsg}</p>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8 mt-10"
          >
            <Field label={t('fields.univers')} error={errors.univers?.message} help={t('fields.universHelp')}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {universValues.map((u) => {
                  const checked = universVal.includes(u);
                  return (
                    <label
                      key={u}
                      className={cn(
                        'relative cursor-pointer border px-4 py-3 text-sm text-center transition-colors',
                        checked
                          ? 'border-ink bg-ink text-bone-50'
                          : 'border-ink/15 text-ink/70 hover:border-ink/40'
                      )}
                    >
                      <input
                        type="checkbox"
                        value={u}
                        {...register('univers')}
                        className="sr-only"
                      />
                      {checked && (
                        <span className="absolute top-1.5 end-1.5 h-1.5 w-1.5 rounded-full bg-copper-500" />
                      )}
                      {t(`univers.${u}`)}
                    </label>
                  );
                })}
              </div>
              {universVal.length > 1 && (
                <p className="mt-2 text-xs text-copper-500">
                  {t('fields.universSelectedCount', { count: universVal.length })}
                </p>
              )}
            </Field>

            <Field label={t('fields.productsOfInterest')} optional t={t} help={t('fields.productsOfInterestHelp')}>
              <input
                type="text"
                placeholder={t('placeholders.productsOfInterest')}
                className={inputCls}
                {...register('productsOfInterest')}
              />
            </Field>

            <Field label={t('fields.projectType')} optional t={t}>
              <div className="grid grid-cols-2 gap-2">
                {(['construction', 'renovation', 'amenagement', 'b2b'] as const).map((p) => (
                  <label
                    key={p}
                    className="cursor-pointer border border-ink/15 px-4 py-3 text-sm hover:border-ink/40 transition-colors has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-bone-50"
                  >
                    <input type="radio" value={p} {...register('projectType')} className="sr-only" />
                    {t(`projectType.${p}`)}
                  </label>
                ))}
              </div>
            </Field>

            <div className="grid sm:grid-cols-2 gap-6">
              <Field label={t('fields.city')} error={errors.city?.message}>
                <input
                  type="text"
                  placeholder={t('placeholders.city')}
                  className={inputCls}
                  {...register('city')}
                />
              </Field>

              <Field label={t('fields.timeline')} optional t={t}>
                <select className={inputCls} {...register('timeline')}>
                  <option value="">—</option>
                  {(['immediat', '3mois', '6mois', '12mois', 'reflexion'] as const).map((v) => (
                    <option key={v} value={v}>{t(`timeline.${v}`)}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label={t('fields.budgetRange')} optional t={t}>
              <select className={inputCls} {...register('budgetRange')}>
                <option value="">—</option>
                {(['lt500k', '500-1m', '1-3m', '3-10m', 'gt10m', 'unknown'] as const).map((v) => (
                  <option key={v} value={v}>{t(`budget.${v}`)}</option>
                ))}
              </select>
            </Field>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={goNext}
                disabled={universVal.length === 0 || !cityVal}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t('next')}
                <ArrowRight size={16} className="rtl:rotate-180" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 mt-10"
          >
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

            <Field label={t('fields.message')} optional t={t} error={errors.message?.message}>
              <textarea
                rows={5}
                placeholder={t('placeholders.message')}
                className={cn(inputCls, 'resize-none')}
                {...register('message')}
              />
            </Field>

            {status === 'error' && (
              <div className="flex items-start gap-3 p-4 border border-red-500/30 bg-red-50/40 text-sm">
                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">{t('error.title')}</p>
                  <p className="text-red-700 mt-1">{t('error.body')}</p>
                  {errorMsg && <p className="text-red-600/70 mt-2 text-xs">({errorMsg})</p>}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={status === 'submitting'}
                className="btn-secondary"
              >
                <ArrowLeft size={16} className="rtl:rotate-180" />
                {t('back')}
              </button>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary flex-1 disabled:opacity-60"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {t('submitting')}
                  </>
                ) : (
                  <>
                    {t('submit')}
                    <ArrowRight size={16} className="rtl:rotate-180" />
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-ink/50 pt-2">{t('privacy')}</p>
          </motion.div>
        )}
      </AnimatePresence>
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
  help,
  t,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  optional?: boolean;
  help?: string;
  t?: (k: string) => string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.14em] text-ink/60 mb-3">
        {label}
        {optional && t && <span className="ms-2 text-ink/30 normal-case tracking-normal">({t('optional')})</span>}
      </label>
      {help && <p className="text-xs text-ink/50 mb-3 -mt-2">{help}</p>}
      {children}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function StepIndicator({ currentStep, t }: { currentStep: 1 | 2; t: (k: string) => string }) {
  return (
    <div className="flex items-center gap-3">
      {[1, 2].map((n) => (
        <div key={n} className="flex items-center gap-3 flex-1">
          <div
            className={cn(
              'h-8 w-8 flex items-center justify-center text-xs font-medium border transition-colors',
              currentStep >= n ? 'bg-ink text-bone-50 border-ink' : 'bg-transparent text-ink/40 border-ink/20'
            )}
          >
            {currentStep > n ? <Check size={14} /> : n}
          </div>
          <div className="flex-1">
            <p className={cn('text-xs uppercase tracking-[0.14em]', currentStep >= n ? 'text-ink' : 'text-ink/40')}>
              {t(`steps.${n}`)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
