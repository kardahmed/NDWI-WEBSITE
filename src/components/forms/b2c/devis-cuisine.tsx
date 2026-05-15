'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import {
  leadDevisCuisineSchema,
  type LeadDevisCuisineInput,
  cuisineFormeValues,
  cuisineFinitionValues,
  surfaceValues,
  delaiValues,
  budgetValuesB2C,
} from '@/lib/schemas/lead-devis-b2c';
import { submitLead } from '@/lib/forms/submit-lead';
import { Field, inputCls, textareaCls, RadioPills } from '../_shared/field';
import { Honeypot } from '../_shared/honeypot';
import { ConsentRgpd } from '../_shared/consent-rgpd';
import { FormSuccess } from '../_shared/form-success';
import { ErrorBanner } from '../_shared/error-banner';
import { SubmitButton } from '../_shared/submit-button';

interface Props {
  productSlug?: string;
  sourcePage?: string;
}

const L_FR = {
  title: 'Devis cuisine sur-mesure',
  intro: 'Composez votre projet — un cuisiniste NDWI revient sous 48 h avec une étude personnalisée.',
  surface: 'Surface de la cuisine (m²)',
  s1: '< 15 m²',
  s2: '15 — 30 m²',
  s3: '30 — 60 m²',
  s4: '60 m² et +',
  forme: 'Forme souhaitée',
  fLin: 'Linéaire',
  fL: 'En L',
  fU: 'En U',
  fIlot: 'Avec îlot',
  fPara: 'Parallèle',
  finition: 'Finition principale',
  finBois: 'Bois',
  finLaque: 'Laquée',
  finInox: 'Inox',
  finMin: 'Minéral',
  finMix: 'Mixte',
  electro: 'Inclure l\'électroménager dans le devis',
  delai: 'Délai installation',
  budget: 'Budget indicatif (DZD)',
  b1: '< 300 K',
  b2: '300 — 800 K',
  b3: '800 K — 2 M',
  b4: '2 — 5 M',
  b5: '5 M et +',
  bu: 'Je ne sais pas encore',
  city: 'Ville / Wilaya',
  fullName: 'Nom complet',
  email: 'Email',
  phone: 'Téléphone',
  message: 'Détails complémentaires',
  messagePh: 'Style recherché, contraintes (plomberie, électricité)…',
  delImmediat: 'Immédiat', del1: '< 1 mois', del3: '< 3 mois', del6: '< 6 mois', delReflexion: 'En réflexion',
};

const L_AR: typeof L_FR = {
  title: 'عرض سعر مطبخ مخصص',
  intro: 'كوّن مشروعك — مصمم مطابخ NDWI سيرد خلال 48 ساعة بدراسة شخصية.',
  surface: 'مساحة المطبخ (م²)',
  s1: 'أقل من 15 م²', s2: '15 — 30 م²', s3: '30 — 60 م²', s4: '60 م² وأكثر',
  forme: 'الشكل المطلوب',
  fLin: 'خطي', fL: 'حرف L', fU: 'حرف U', fIlot: 'مع جزيرة', fPara: 'متوازي',
  finition: 'التشطيب الرئيسي',
  finBois: 'خشب', finLaque: 'لاكيه', finInox: 'ستانلس', finMin: 'حجري', finMix: 'مختلط',
  electro: 'تضمين الأجهزة الكهرومنزلية',
  delai: 'مهلة التركيب',
  budget: 'الميزانية المؤشر (دج)',
  b1: 'أقل من 300 ألف', b2: '300 — 800 ألف', b3: '800 ألف — 2 مليون', b4: '2 — 5 مليون', b5: '5 مليون وأكثر',
  bu: 'لا أعرف بعد',
  city: 'المدينة / الولاية',
  fullName: 'الاسم الكامل', email: 'البريد الإلكتروني', phone: 'الهاتف',
  message: 'تفاصيل إضافية',
  messagePh: 'الأسلوب المطلوب، القيود (سباكة، كهرباء)…',
  delImmediat: 'فوري', del1: 'أقل من شهر', del3: 'أقل من 3 أشهر', del6: 'أقل من 6 أشهر', delReflexion: 'قيد التفكير',
};

export function DevisCuisineForm({ productSlug, sourcePage }: Props) {
  const locale = useLocale() as Locale;
  const L = locale === 'ar' ? L_AR : L_FR;
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const form = useForm<LeadDevisCuisineInput>({
    resolver: zodResolver(leadDevisCuisineSchema),
    mode: 'onBlur',
    defaultValues: { productSlug, sourcePage, locale, hp_field: '' },
  });
  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: LeadDevisCuisineInput) => {
    setStatus('submitting');
    const res = await submitLead('devis-cuisine', data);
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

      <Field label={L.surface} error={errors.surface?.message}>
        <RadioPills name="surface" register={register as never} columns={4}
          options={surfaceValues.map((v) => ({ value: v, label: { lt15: L.s1, '15-30': L.s2, '30-60': L.s3, '60+': L.s4 }[v] }))} />
      </Field>

      <Field label={L.forme} optional>
        <RadioPills name="forme" register={register as never} columns={3}
          options={cuisineFormeValues.map((v) => ({ value: v, label: { lineaire: L.fLin, L: L.fL, U: L.fU, ilot: L.fIlot, parallele: L.fPara }[v] }))} />
      </Field>

      <Field label={L.finition} optional>
        <RadioPills name="finition" register={register as never} columns={3}
          options={cuisineFinitionValues.map((v) => ({ value: v, label: { bois: L.finBois, laque: L.finLaque, inox: L.finInox, mineral: L.finMin, mixte: L.finMix }[v] }))} />
      </Field>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" {...register('electromenager')} className="h-4 w-4 accent-copper-500" />
        <span className="text-sm text-ink/80">{L.electro}</span>
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
        <Field label={L.budget} optional>
          <select className={inputCls} {...register('budget')}>
            <option value="">—</option>
            {budgetValuesB2C.map((v) => (
              <option key={v} value={v}>{{ lt300k: L.b1, '300-800k': L.b2, '800k-2m': L.b3, '2-5m': L.b4, '5m+': L.b5, unknown: L.bu }[v]}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label={L.city} error={errors.city?.message}>
        <input type="text" className={inputCls} {...register('city')} />
      </Field>

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
      <div className="pt-2"><SubmitButton status={status === 'success' ? 'idle' : status} /></div>
    </form>
  );
}
