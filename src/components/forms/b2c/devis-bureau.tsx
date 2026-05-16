'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import {
  leadDevisBureauSchema,
  type LeadDevisBureauInput,
  bureauTypeValues,
  bureauPostesValues,
  surfaceValues,
  delaiValues,
} from '@/lib/schemas/lead-devis-b2c';
import { submitLead } from '@/lib/forms/submit-lead';
import { Field, inputCls, textareaCls, RadioPills } from '../_shared/field';
import { Honeypot } from '../_shared/honeypot';
import { ConsentRgpd } from '../_shared/consent-rgpd';
import { FormSuccess } from '../_shared/form-success';
import { ErrorBanner } from '../_shared/error-banner';
import { SubmitButton } from '../_shared/submit-button';

interface Props { productSlug?: string; sourcePage?: string; }

const L_FR = {
  title: 'Aménagement bureau / espace de travail',
  intro: 'NDO meuble les bureaux exécutifs et open-spaces en Algérie. Étude gratuite sous 48 h.',
  type: 'Type d\'aménagement',
  tDir: 'Direction', tOpen: 'Open-space', tReu: 'Salle de réunion', tRec: 'Réception / accueil', tMix: 'Mixte',
  nbPostes: 'Nombre de postes',
  p1: '1 — 5', p2: '5 — 15', p3: '15 — 40', p4: '40 — 100', p5: '100 et +',
  surface: 'Surface (m²)',
  s1: '< 50', s2: '50 — 150', s3: '150 — 400', s4: '400 et +',
  plan: 'J\'ai un plan d\'aménagement à partager',
  delai: 'Délai',
  delImmediat: 'Immédiat', del1: '< 1 mois', del3: '< 3 mois', del6: '< 6 mois', delReflexion: 'En réflexion',
  city: 'Ville / Wilaya',
  fullName: 'Contact', email: 'Email pro', phone: 'Téléphone',
  message: 'Contexte / contraintes', messagePh: 'Activité de l\'entreprise, image souhaitée, accessibilité…',
};

const L_AR: typeof L_FR = {
  title: 'تجهيز مكاتب / فضاء عمل',
  intro: 'NDO تجهز المكاتب التنفيذية والفضاءات المشتركة في الجزائر. دراسة مجانية خلال 48 ساعة.',
  type: 'نوع التجهيز',
  tDir: 'إدارة', tOpen: 'فضاء مفتوح', tReu: 'قاعة اجتماعات', tRec: 'استقبال', tMix: 'مختلط',
  nbPostes: 'عدد المناصب',
  p1: '1 — 5', p2: '5 — 15', p3: '15 — 40', p4: '40 — 100', p5: '100 وأكثر',
  surface: 'المساحة (م²)',
  s1: 'أقل من 50', s2: '50 — 150', s3: '150 — 400', s4: '400 وأكثر',
  plan: 'لدي مخطط تجهيز للمشاركة',
  delai: 'المهلة',
  delImmediat: 'فوري', del1: 'أقل من شهر', del3: 'أقل من 3 أشهر', del6: 'أقل من 6 أشهر', delReflexion: 'قيد التفكير',
  city: 'المدينة / الولاية',
  fullName: 'جهة الاتصال', email: 'البريد المهني', phone: 'الهاتف',
  message: 'السياق / القيود', messagePh: 'نشاط الشركة، الصورة المطلوبة، إمكانية الوصول…',
};

export function DevisBureauForm({ productSlug, sourcePage }: Props) {
  const locale = useLocale() as Locale;
  const L = locale === 'ar' ? L_AR : L_FR;
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const form = useForm<LeadDevisBureauInput>({
    resolver: zodResolver(leadDevisBureauSchema), mode: 'onBlur',
    defaultValues: { productSlug, sourcePage, locale, hp_field: '' },
  });
  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: LeadDevisBureauInput) => {
    setStatus('submitting');
    const res = await submitLead('devis-bureau', data);
    if (res.ok) setStatus('success');
    else { setStatus('error'); setErrorMsg(res.error); }
  };

  if (status === 'success') return <FormSuccess />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="bg-bone-50 border border-ink/10 p-8 lg:p-12 space-y-7">
      <Honeypot register={register} />
      <div>
        <h3 className="heading-display text-2xl">{L.title}</h3>
        <p className="text-sm text-ink/60 mt-2">{L.intro}</p>
      </div>

      <Field label={L.type} error={errors.type?.message}>
        <RadioPills name="type" register={register as never} columns={3}
          options={bureauTypeValues.map((v) => ({ value: v, label: { direction: L.tDir, 'open-space': L.tOpen, reunion: L.tReu, reception: L.tRec, mixte: L.tMix }[v] }))} />
      </Field>

      <Field label={L.nbPostes} error={errors.nbPostes?.message}>
        <RadioPills name="nbPostes" register={register as never} columns={3}
          options={bureauPostesValues.map((v) => ({ value: v, label: { '1-5': L.p1, '5-15': L.p2, '15-40': L.p3, '40-100': L.p4, '100+': L.p5 }[v] }))} />
      </Field>

      <Field label={L.surface} optional>
        <RadioPills name="surface" register={register as never} columns={4}
          options={surfaceValues.map((v) => ({ value: v, label: { lt15: L.s1, '15-30': L.s2, '30-60': L.s3, '60+': L.s4 }[v] }))} />
      </Field>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" {...register('planDispo')} className="h-4 w-4 accent-copper-500" />
        <span className="text-sm text-ink/80">{L.plan}</span>
      </label>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label={L.delai} optional>
          <select className={inputCls} {...register('delai')}>
            <option value="">—</option>
            {delaiValues.map((v) => (
              <option key={v} value={v}>{{ immediat: L.delImmediat, '1mois': L.del1, '3mois': L.del3, '6mois': L.del6, reflexion: L.delReflexion }[v]}</option>
            ))}
          </select>
        </Field>
        <Field label={L.city} error={errors.city?.message}>
          <input type="text" className={inputCls} {...register('city')} />
        </Field>
      </div>

      <div className="border-t border-ink/10 pt-7 space-y-6">
        <Field label={L.fullName} error={errors.fullName?.message}>
          <input type="text" autoComplete="name" className={inputCls} {...register('fullName')} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-6">
          <Field label={L.email} error={errors.email?.message}>
            <input type="email" autoComplete="email" className={inputCls} {...register('email')} />
          </Field>
          <Field label={L.phone} error={errors.phone?.message}>
            <input type="tel" autoComplete="tel" placeholder="+213 …" className={inputCls} {...register('phone')} />
          </Field>
        </div>
        <Field label={L.message} optional>
          <textarea rows={4} placeholder={L.messagePh} className={textareaCls} {...register('message')} />
        </Field>
        <ConsentRgpd register={register} error={errors.consent?.message} />
      </div>

      {status === 'error' && <ErrorBanner detail={errorMsg} />}
      <div className="pt-2"><SubmitButton status={status} /></div>
    </form>
  );
}
