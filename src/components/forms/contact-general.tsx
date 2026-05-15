'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import {
  leadContactSchema,
  type LeadContactInput,
  contactSujetValues,
} from '@/lib/schemas/lead-contact';
import { submitLead } from '@/lib/forms/submit-lead';
import { Field, inputCls, textareaCls, RadioPills } from './_shared/field';
import { Honeypot } from './_shared/honeypot';
import { ConsentRgpd } from './_shared/consent-rgpd';
import { FormSuccess } from './_shared/form-success';
import { ErrorBanner } from './_shared/error-banner';
import { SubmitButton } from './_shared/submit-button';

interface Props {
  sourcePage?: string;
  defaultSujet?: (typeof contactSujetValues)[number];
}

const L_FR = {
  title: 'Nous contacter',
  intro: 'Envoyez-nous un message — nous revenons sous 48 h ouvrées.',
  sujet: 'Sujet',
  sujInfo: 'Info produit',
  sujSav: 'SAV / service après-vente',
  sujRdv: 'RDV showroom',
  sujPresse: 'Presse / média',
  sujRecrut: 'Recrutement',
  sujAutre: 'Autre',
  fullName: 'Nom complet',
  email: 'Email',
  phone: 'Téléphone',
  message: 'Votre message',
  messagePh: 'Décrivez votre demande…',
};

const L_AR: typeof L_FR = {
  title: 'تواصلوا معنا',
  intro: 'أرسلوا لنا رسالة — سنرد خلال 48 ساعة عمل.',
  sujet: 'الموضوع',
  sujInfo: 'معلومات منتج',
  sujSav: 'خدمة ما بعد البيع',
  sujRdv: 'موعد في المعرض',
  sujPresse: 'إعلام / صحافة',
  sujRecrut: 'توظيف',
  sujAutre: 'أخرى',
  fullName: 'الاسم الكامل',
  email: 'البريد الإلكتروني',
  phone: 'الهاتف',
  message: 'رسالتكم',
  messagePh: 'صف طلبك…',
};

export function ContactGeneralForm({ sourcePage, defaultSujet }: Props) {
  const locale = useLocale() as Locale;
  const L = locale === 'ar' ? L_AR : L_FR;
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const form = useForm<LeadContactInput>({
    resolver: zodResolver(leadContactSchema),
    mode: 'onBlur',
    defaultValues: { sourcePage, locale, hp_field: '', sujet: defaultSujet },
  });
  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: LeadContactInput) => {
    setStatus('submitting');
    const res = await submitLead('contact-general', data);
    if (res.ok) setStatus('success');
    else {
      setStatus('error');
      setErrorMsg(res.error);
    }
  };

  if (status === 'success') return <FormSuccess />;

  const sujetLabels: Record<(typeof contactSujetValues)[number], string> = {
    'info-produit': L.sujInfo,
    sav: L.sujSav,
    'rdv-showroom': L.sujRdv,
    presse: L.sujPresse,
    recrutement: L.sujRecrut,
    autre: L.sujAutre,
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="bg-bone-50 border border-ink/10 p-8 lg:p-12 space-y-7">
      <Honeypot register={register} />

      <div>
        <h3 className="heading-display text-2xl">{L.title}</h3>
        <p className="text-sm text-ink/60 mt-2">{L.intro}</p>
      </div>

      <Field label={L.sujet} error={errors.sujet?.message}>
        <RadioPills
          name="sujet"
          register={register as never}
          columns={3}
          options={contactSujetValues.map((v) => ({ value: v, label: sujetLabels[v] }))}
        />
      </Field>

      <Field label={L.fullName} error={errors.fullName?.message}>
        <input type="text" autoComplete="name" className={inputCls} {...register('fullName')} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label={L.email} error={errors.email?.message}>
          <input type="email" autoComplete="email" placeholder="vous@example.com" className={inputCls} {...register('email')} />
        </Field>
        <Field label={L.phone} error={errors.phone?.message}>
          <input type="tel" autoComplete="tel" placeholder="+213 …" className={inputCls} {...register('phone')} />
        </Field>
      </div>

      <Field label={L.message} error={errors.message?.message}>
        <textarea rows={6} placeholder={L.messagePh} className={textareaCls} {...register('message')} />
      </Field>

      <ConsentRgpd register={register} error={errors.consent?.message} />

      {status === 'error' && <ErrorBanner detail={errorMsg} />}

      <div className="pt-2">
        <SubmitButton status={status === 'success' ? 'idle' : status} />
      </div>
    </form>
  );
}
