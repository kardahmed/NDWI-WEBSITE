'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import {
  leadDevisDressingSchema,
  type LeadDevisDressingInput,
  dressingTypeValues,
  dressingNiveauValues,
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
  title: 'Devis dressing sur-mesure',
  intro: 'Configurez votre dressing — un conseiller revient sous 48 h.',
  type: 'Type de dressing',
  tOuvert: 'Dressing ouvert', tFerme: 'Dressing fermé', tWalk: 'Walk-in',
  niveau: 'Niveau d\'aménagement',
  nStd: 'Standard', nSur: 'Sur-mesure', nPrem: 'Premium',
  surface: 'Surface (m²)',
  s1: '< 5', s2: '5 — 10', s3: '10 — 20', s4: '20 et +',
  delai: 'Délai',
  delImmediat: 'Immédiat', del1: '< 1 mois', del3: '< 3 mois', del6: '< 6 mois', delReflexion: 'En réflexion',
  city: 'Ville / Wilaya',
  fullName: 'Nom complet', email: 'Email', phone: 'Téléphone',
  message: 'Détails complémentaires', messagePh: 'Style, accessoires souhaités (LED, miroir, tiroirs intérieurs)…',
};

const L_AR: typeof L_FR = {
  title: 'عرض سعر خزانة ملابس مخصصة',
  intro: 'كوّن خزانتك — مستشار سيرد خلال 48 ساعة.',
  type: 'نوع الخزانة',
  tOuvert: 'مفتوحة', tFerme: 'مغلقة', tWalk: 'غرفة ملابس',
  niveau: 'مستوى التجهيز',
  nStd: 'قياسي', nSur: 'حسب الطلب', nPrem: 'فاخر',
  surface: 'المساحة (م²)',
  s1: 'أقل من 5', s2: '5 — 10', s3: '10 — 20', s4: '20 وأكثر',
  delai: 'المهلة',
  delImmediat: 'فوري', del1: 'أقل من شهر', del3: 'أقل من 3 أشهر', del6: 'أقل من 6 أشهر', delReflexion: 'قيد التفكير',
  city: 'المدينة / الولاية',
  fullName: 'الاسم الكامل', email: 'البريد', phone: 'الهاتف',
  message: 'تفاصيل إضافية', messagePh: 'الأسلوب، الإكسسوارات (إضاءة LED، مرآة، أدراج داخلية)…',
};

export function DevisDressingForm({ productSlug, sourcePage }: Props) {
  const locale = useLocale() as Locale;
  const L = locale === 'ar' ? L_AR : L_FR;
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const form = useForm<LeadDevisDressingInput>({
    resolver: zodResolver(leadDevisDressingSchema), mode: 'onBlur',
    defaultValues: { productSlug, sourcePage, locale, hp_field: '' },
  });
  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: LeadDevisDressingInput) => {
    setStatus('submitting');
    const res = await submitLead('devis-dressing', data);
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
          options={dressingTypeValues.map((v) => ({ value: v, label: { ouvert: L.tOuvert, ferme: L.tFerme, 'walk-in': L.tWalk }[v] }))} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label={L.niveau} optional>
          <RadioPills name="niveau" register={register as never} columns={3}
            options={dressingNiveauValues.map((v) => ({ value: v, label: { standard: L.nStd, 'sur-mesure': L.nSur, premium: L.nPrem }[v] }))} />
        </Field>
        <Field label={L.delai} optional>
          <select className={inputCls} {...register('delai')}>
            <option value="">—</option>
            {delaiValues.map((v) => (
              <option key={v} value={v}>{{ immediat: L.delImmediat, '1mois': L.del1, '3mois': L.del3, '6mois': L.del6, reflexion: L.delReflexion }[v]}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label={L.surface} optional>
        <RadioPills name="surface" register={register as never} columns={4}
          options={surfaceValues.map((v) => ({ value: v, label: { lt15: L.s1, '15-30': L.s2, '30-60': L.s3, '60+': L.s4 }[v] }))} />
      </Field>

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
      <div className="pt-2"><SubmitButton status={status} /></div>
    </form>
  );
}
