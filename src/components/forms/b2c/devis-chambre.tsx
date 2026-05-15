'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import {
  leadDevisChambreSchema,
  type LeadDevisChambreInput,
  chambrePieceValues,
  chambrePackValues,
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
  title: 'Devis chambre sur-mesure',
  intro: 'Décrivez la pièce — un conseiller revient sous 48 h.',
  piece: 'Type de pièce',
  pMaitre: 'Suite parentale', pEnfant: 'Chambre enfant', pSec: 'Chambre adulte (secondaire)', pInv: 'Chambre d\'amis',
  pack: 'Composition souhaitée',
  packLit: 'Lit seul', packChev: 'Lit + chevet', packComp: 'Pack complet (lit + armoire + coiffeuse)', packSur: 'Sur-mesure',
  surface: 'Surface (m²)',
  s1: '< 15', s2: '15 — 30', s3: '30 — 60', s4: '60 et +',
  delai: 'Délai',
  delImmediat: 'Immédiat', del1: '< 1 mois', del3: '< 3 mois', del6: '< 6 mois', delReflexion: 'En réflexion',
  city: 'Ville / Wilaya',
  fullName: 'Nom complet', email: 'Email', phone: 'Téléphone',
  message: 'Détails complémentaires', messagePh: 'Style, couleurs, contraintes…',
};

const L_AR: typeof L_FR = {
  title: 'عرض سعر غرفة مخصصة',
  intro: 'صف الغرفة — مستشار سيرد خلال 48 ساعة.',
  piece: 'نوع الغرفة',
  pMaitre: 'جناح رئيسي', pEnfant: 'غرفة أطفال', pSec: 'غرفة بالغين ثانوية', pInv: 'غرفة ضيوف',
  pack: 'التركيب المطلوب',
  packLit: 'سرير فقط', packChev: 'سرير + كومودينو', packComp: 'باقة كاملة', packSur: 'حسب الطلب',
  surface: 'المساحة (م²)',
  s1: 'أقل من 15', s2: '15 — 30', s3: '30 — 60', s4: '60 وأكثر',
  delai: 'المهلة',
  delImmediat: 'فوري', del1: 'أقل من شهر', del3: 'أقل من 3 أشهر', del6: 'أقل من 6 أشهر', delReflexion: 'قيد التفكير',
  city: 'المدينة / الولاية',
  fullName: 'الاسم الكامل', email: 'البريد', phone: 'الهاتف',
  message: 'تفاصيل إضافية', messagePh: 'الأسلوب، الألوان، القيود…',
};

export function DevisChambreForm({ productSlug, sourcePage }: Props) {
  const locale = useLocale() as Locale;
  const L = locale === 'ar' ? L_AR : L_FR;
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const form = useForm<LeadDevisChambreInput>({
    resolver: zodResolver(leadDevisChambreSchema), mode: 'onBlur',
    defaultValues: { productSlug, sourcePage, locale, hp_field: '' },
  });
  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: LeadDevisChambreInput) => {
    setStatus('submitting');
    const res = await submitLead('devis-chambre', data);
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

      <Field label={L.piece} error={errors.piece?.message}>
        <RadioPills name="piece" register={register as never} columns={2}
          options={chambrePieceValues.map((v) => ({ value: v, label: { maitre: L.pMaitre, enfant: L.pEnfant, 'adulte-secondaire': L.pSec, invites: L.pInv }[v] }))} />
      </Field>

      <Field label={L.pack} optional>
        <RadioPills name="pack" register={register as never} columns={2}
          options={chambrePackValues.map((v) => ({ value: v, label: { 'lit-seul': L.packLit, 'lit-chevet': L.packChev, 'pack-complet': L.packComp, 'sur-mesure': L.packSur }[v] }))} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label={L.surface} optional>
          <RadioPills name="surface" register={register as never} columns={4}
            options={surfaceValues.map((v) => ({ value: v, label: { lt15: L.s1, '15-30': L.s2, '30-60': L.s3, '60+': L.s4 }[v] }))} />
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
