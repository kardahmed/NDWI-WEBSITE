'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import {
  leadDevisSalonSchema,
  type LeadDevisSalonInput,
  salonTypeValues,
  salonStyleValues,
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
  title: 'Devis salon sur-mesure',
  intro: 'Composez votre salon — un conseiller revient sous 48 h avec une proposition adaptée.',
  type: 'Type de salon',
  tCan: 'Canapé', tAng: 'D\'angle', tMod: 'Modulable', tMar: 'Salon marocain',
  style: 'Style',
  sCon: 'Contemporain', sCla: 'Classique', sOri: 'Oriental', sMix: 'Mixte',
  couleur: 'Couleur dominante souhaitée',
  couleurPh: 'ex. terracotta, beige, vert sauge…',
  delai: 'Délai',
  delImmediat: 'Immédiat', del1: '< 1 mois', del3: '< 3 mois', del6: '< 6 mois', delReflexion: 'En réflexion',
  city: 'Ville / Wilaya',
  fullName: 'Nom complet', email: 'Email', phone: 'Téléphone',
  message: 'Détails complémentaires', messagePh: 'Dimensions de la pièce, tissus appréciés, contraintes…',
};

const L_AR: typeof L_FR = {
  title: 'عرض سعر صالون مخصص',
  intro: 'كوّن صالونك — مستشار سيرد خلال 48 ساعة بعرض مناسب.',
  type: 'نوع الصالون',
  tCan: 'كنبة', tAng: 'زاوية', tMod: 'قابل للتعديل', tMar: 'صالون مغربي',
  style: 'الأسلوب',
  sCon: 'معاصر', sCla: 'كلاسيكي', sOri: 'شرقي', sMix: 'مختلط',
  couleur: 'اللون السائد المرغوب',
  couleurPh: 'مثال طيني، بيج، أخضر…',
  delai: 'المهلة',
  delImmediat: 'فوري', del1: 'أقل من شهر', del3: 'أقل من 3 أشهر', del6: 'أقل من 6 أشهر', delReflexion: 'قيد التفكير',
  city: 'المدينة / الولاية',
  fullName: 'الاسم الكامل', email: 'البريد', phone: 'الهاتف',
  message: 'تفاصيل إضافية', messagePh: 'أبعاد الغرفة، الأقمشة المفضلة، القيود…',
};

export function DevisSalonForm({ productSlug, sourcePage }: Props) {
  const locale = useLocale() as Locale;
  const L = locale === 'ar' ? L_AR : L_FR;
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const form = useForm<LeadDevisSalonInput>({
    resolver: zodResolver(leadDevisSalonSchema), mode: 'onBlur',
    defaultValues: { productSlug, sourcePage, locale, hp_field: '' },
  });
  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: LeadDevisSalonInput) => {
    setStatus('submitting');
    const res = await submitLead('devis-salon', data);
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
        <RadioPills name="type" register={register as never} columns={4}
          options={salonTypeValues.map((v) => ({ value: v, label: { canape: L.tCan, angle: L.tAng, modulable: L.tMod, 'salon-marocain': L.tMar }[v] }))} />
      </Field>

      <Field label={L.style} optional>
        <RadioPills name="style" register={register as never} columns={4}
          options={salonStyleValues.map((v) => ({ value: v, label: { contemporain: L.sCon, classique: L.sCla, oriental: L.sOri, mixte: L.sMix }[v] }))} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label={L.couleur} optional>
          <input type="text" placeholder={L.couleurPh} className={inputCls} {...register('couleurDominante')} />
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
