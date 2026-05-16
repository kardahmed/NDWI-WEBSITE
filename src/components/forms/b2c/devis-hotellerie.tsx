'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import {
  leadDevisHotellerieB2CSchema,
  type LeadDevisHotellerieB2CInput,
  hotellerieTypeValuesB2C,
  hotellerieChambresB2C,
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
  title: 'Équipement maison d\'hôtes / petit hébergement',
  intro: 'Pour les chaînes hôtelières (> 15 chambres), passez par notre formulaire dédié. Pour les petits hébergements, remplissez ci-dessous — réponse sous 48 h.',
  type: 'Type d\'hébergement',
  tMh: 'Maison d\'hôtes', tGi: 'Gîte', tAi: 'Airbnb / location courte', tRes: 'Résidence courte durée',
  nbChambres: 'Nombre de chambres à équiper',
  c1: '1 — 3', c2: '4 — 8', c3: '9 — 15',
  delai: 'Délai',
  delImmediat: 'Immédiat', del1: '< 1 mois', del3: '< 3 mois', del6: '< 6 mois', delReflexion: 'En réflexion',
  city: 'Ville / Wilaya',
  fullName: 'Nom complet', email: 'Email', phone: 'Téléphone',
  message: 'Détails projet', messagePh: 'Concept de l\'hébergement, style recherché…',
};

const L_AR: typeof L_FR = {
  title: 'تجهيز دار ضيافة / إقامة صغيرة',
  intro: 'للسلاسل الفندقية (أكثر من 15 غرفة)، استخدم النموذج المخصص. للإقامات الصغيرة، املأ أدناه — رد خلال 48 ساعة.',
  type: 'نوع الإقامة',
  tMh: 'دار ضيافة', tGi: 'بيت ريفي', tAi: 'Airbnb / إيجار قصير', tRes: 'إقامة قصيرة المدة',
  nbChambres: 'عدد الغرف للتجهيز',
  c1: '1 — 3', c2: '4 — 8', c3: '9 — 15',
  delai: 'المهلة',
  delImmediat: 'فوري', del1: 'أقل من شهر', del3: 'أقل من 3 أشهر', del6: 'أقل من 6 أشهر', delReflexion: 'قيد التفكير',
  city: 'المدينة / الولاية',
  fullName: 'الاسم الكامل', email: 'البريد', phone: 'الهاتف',
  message: 'تفاصيل المشروع', messagePh: 'مفهوم الإقامة، الأسلوب المطلوب…',
};

export function DevisHotellerieB2CForm({ productSlug, sourcePage }: Props) {
  const locale = useLocale() as Locale;
  const L = locale === 'ar' ? L_AR : L_FR;
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const form = useForm<LeadDevisHotellerieB2CInput>({
    resolver: zodResolver(leadDevisHotellerieB2CSchema), mode: 'onBlur',
    defaultValues: { productSlug, sourcePage, locale, hp_field: '' },
  });
  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: LeadDevisHotellerieB2CInput) => {
    setStatus('submitting');
    const res = await submitLead('devis-hotellerie', data);
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
        <RadioPills name="type" register={register as never} columns={2}
          options={hotellerieTypeValuesB2C.map((v) => ({ value: v, label: { 'maison-hotes': L.tMh, gite: L.tGi, airbnb: L.tAi, 'residence-courte': L.tRes }[v] }))} />
      </Field>

      <Field label={L.nbChambres} error={errors.nbChambres?.message}>
        <RadioPills name="nbChambres" register={register as never} columns={3}
          options={hotellerieChambresB2C.map((v) => ({ value: v, label: { '1-3': L.c1, '4-8': L.c2, '9-15': L.c3 }[v] }))} />
      </Field>

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
