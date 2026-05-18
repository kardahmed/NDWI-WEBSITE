'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import {
  leadDevisConfigPorteSchema,
  type LeadDevisConfigPorteInput,
  type DoorConfigSnapshot,
} from '@/lib/schemas/lead-devis-config-porte';
import { submitLead } from '@/lib/forms/submit-lead';
import { Field, inputCls, textareaCls, RadioPills } from '../_shared/field';
import { Honeypot } from '../_shared/honeypot';
import { ConsentRgpd } from '../_shared/consent-rgpd';
import { FormSuccess } from '../_shared/form-success';
import { ErrorBanner } from '../_shared/error-banner';
import { SubmitButton } from '../_shared/submit-button';

interface Props {
  /** Snapshot complet de la config actuelle du configurateur. */
  configuration: DoorConfigSnapshot;
  sourcePage?: string;
  /** Numéro WhatsApp pré-rempli (sans `+`, format 213XXXXXXXXX). */
  whatsappNumber?: string;
}

const L_FR = {
  title: 'Demander un devis pour cette configuration',
  intro:
    'Votre configuration est jointe automatiquement à la demande. Un conseiller vous recontactera sous 24-48h ouvrées.',
  city: 'Ville / Wilaya',
  fullName: 'Nom complet',
  email: 'Email',
  phone: 'Téléphone',
  preferred: 'Préférence de contact',
  prefPhone: 'Téléphone',
  prefWhatsapp: 'WhatsApp',
  prefEmail: 'Email',
  message: 'Message (optionnel)',
  messagePh: 'Précisez une contrainte de pose, un délai souhaité…',
  configSummary: 'Configuration jointe',
  successWhatsappCta: 'Poursuivre la conversation sur WhatsApp',
};

const L_AR: typeof L_FR = {
  title: 'طلب عرض سعر لهذه التهيئة',
  intro: 'تهيئتك مرفقة تلقائيًا بالطلب. سيتصل بك مستشار خلال 24-48 ساعة عمل.',
  city: 'المدينة / الولاية',
  fullName: 'الاسم الكامل',
  email: 'البريد الإلكتروني',
  phone: 'الهاتف',
  preferred: 'وسيلة الاتصال المفضلة',
  prefPhone: 'الهاتف',
  prefWhatsapp: 'واتساب',
  prefEmail: 'البريد',
  message: 'رسالة (اختياري)',
  messagePh: 'حدد قيود التركيب، المهلة المطلوبة…',
  configSummary: 'التهيئة المرفقة',
  successWhatsappCta: 'متابعة المحادثة عبر واتساب',
};

function ConfigSummary({ c, locale }: { c: DoorConfigSnapshot; locale: Locale }) {
  const rows: Array<[string, string]> = [];
  rows.push([locale === 'ar' ? 'الموديل' : 'Modèle', c.modelName ?? c.modelSlug]);
  rows.push([locale === 'ar' ? 'التشطيب' : 'Finition', c.finishName ?? c.finishSlug]);
  if (c.handleName || c.handleSlug)
    rows.push([locale === 'ar' ? 'المقبض' : 'Poignée', c.handleName ?? c.handleSlug ?? '—']);
  rows.push([
    locale === 'ar' ? 'الأبعاد' : 'Dimensions',
    `${c.dimensions.widthCm}×${c.dimensions.heightCm} cm`,
  ]);
  if (c.hasGlass) rows.push([locale === 'ar' ? 'الزجاج' : 'Vitrage', locale === 'ar' ? 'نعم' : 'Oui']);
  if (c.hasLock) rows.push([locale === 'ar' ? 'القفل' : 'Serrure', locale === 'ar' ? 'نعم' : 'Oui']);
  if (c.openingDirection)
    rows.push([
      locale === 'ar' ? 'اتجاه الفتح' : 'Ouverture',
      c.openingDirection === 'inward'
        ? locale === 'ar' ? 'داخلي' : 'Intérieure'
        : locale === 'ar' ? 'خارجي' : 'Extérieure',
    ]);
  return (
    <div className="border border-ink/15 bg-bone-100 p-4 text-xs">
      <p className="uppercase tracking-[0.14em] text-ink/50 mb-2">{rows.length} options</p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-ink/55">{k}</dt>
            <dd className="text-ink/90">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function buildWhatsappUrl(c: DoorConfigSnapshot, number: string | undefined, locale: Locale): string | null {
  if (!number) return null;
  const lines = [
    locale === 'ar' ? 'مرحبًا، أرسلت طلب عرض سعر لهذه التهيئة:' : 'Bonjour, j’ai envoyé une demande de devis pour cette configuration :',
    `• ${locale === 'ar' ? 'الموديل' : 'Modèle'} : ${c.modelName ?? c.modelSlug}`,
    `• ${locale === 'ar' ? 'التشطيب' : 'Finition'} : ${c.finishName ?? c.finishSlug}`,
    c.handleName || c.handleSlug
      ? `• ${locale === 'ar' ? 'المقبض' : 'Poignée'} : ${c.handleName ?? c.handleSlug}`
      : '',
    `• ${locale === 'ar' ? 'الأبعاد' : 'Dimensions'} : ${c.dimensions.widthCm}×${c.dimensions.heightCm} cm`,
    c.configuratorShareUrl ? `${locale === 'ar' ? 'الرابط' : 'Lien'} : ${c.configuratorShareUrl}` : '',
  ].filter(Boolean).join('\n');
  return `https://wa.me/${number}?text=${encodeURIComponent(lines)}`;
}

export function DevisConfigPorteForm({ configuration, sourcePage, whatsappNumber }: Props) {
  const locale = useLocale() as Locale;
  const L = locale === 'ar' ? L_AR : L_FR;
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const form = useForm<LeadDevisConfigPorteInput>({
    resolver: zodResolver(leadDevisConfigPorteSchema),
    mode: 'onBlur',
    defaultValues: {
      sourcePage,
      locale,
      hp_field: '',
      configuration,
    },
  });
  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: LeadDevisConfigPorteInput) => {
    setStatus('submitting');
    const res = await submitLead('devis-porte', data as unknown as Parameters<typeof submitLead>[1]);
    if (res.ok) setStatus('success');
    else {
      setStatus('error');
      setErrorMsg(res.error);
    }
  };

  if (status === 'success') {
    const wa = buildWhatsappUrl(configuration, whatsappNumber, locale);
    return (
      <div>
        <FormSuccess />
        {wa && (
          <div className="mt-6 text-center">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              {L.successWhatsappCta}
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="bg-bone-50 border border-ink/10 p-8 lg:p-12 space-y-6">
      <Honeypot register={register} />

      <div>
        <h3 className="heading-display text-2xl">{L.title}</h3>
        <p className="text-sm text-ink/60 mt-2">{L.intro}</p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-ink/60 mb-2">{L.configSummary}</p>
        <ConfigSummary c={configuration} locale={locale} />
      </div>

      <Field label={L.fullName} error={errors.fullName?.message}>
        <input type="text" autoComplete="name" className={inputCls} {...register('fullName')} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label={L.email} error={errors.email?.message}>
          <input type="email" autoComplete="email" placeholder="vous@example.com" className={inputCls} {...register('email')} />
        </Field>
        <Field label={L.phone} error={errors.phone?.message}>
          <input type="tel" autoComplete="tel" placeholder="+213 555 …" className={inputCls} {...register('phone')} />
        </Field>
      </div>

      <Field label={L.city} error={errors.city?.message}>
        <input type="text" className={inputCls} {...register('city')} />
      </Field>

      <Field label={L.preferred} optional>
        <RadioPills
          name="preferredContact"
          register={register as never}
          columns={3}
          options={[
            { value: 'phone', label: L.prefPhone },
            { value: 'whatsapp', label: L.prefWhatsapp },
            { value: 'email', label: L.prefEmail },
          ]}
        />
      </Field>

      <Field label={L.message} optional>
        <textarea rows={3} placeholder={L.messagePh} className={textareaCls} {...register('message')} />
      </Field>

      <ConsentRgpd register={register} error={errors.consent?.message} />

      {status === 'error' && <ErrorBanner detail={errorMsg} />}

      <div className="pt-2">
        <SubmitButton status={status} />
      </div>
    </form>
  );
}
