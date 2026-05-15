'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { wilayasMajeures } from '@/lib/schemas/lead-common';
import {
  leadProDistributeurSchema,
  type LeadProDistributeurInput,
  distribClienteleValues,
  distribVolumeValues,
  distribTypePartenariatValues,
} from '@/lib/schemas/lead-pro-distributeur';
import { submitLead } from '@/lib/forms/submit-lead';
import { Field, inputCls, textareaCls, RadioPills } from '../_shared/field';
import { Honeypot } from '../_shared/honeypot';
import { ConsentRgpd } from '../_shared/consent-rgpd';
import { FormSuccess } from '../_shared/form-success';
import { ErrorBanner } from '../_shared/error-banner';
import { SubmitButton } from '../_shared/submit-button';

interface Props {
  sourcePage?: string;
}

const L_FR = {
  title: 'Devenir partenaire distributeur',
  intro: 'Rejoignez le réseau NDWI / NDO en Algérie. Notre équipe développement réseau revient sous 48 h ouvrées.',
  societe: 'Société',
  raisonSociale: 'Raison sociale',
  rcOuNif: 'RC ou NIF',
  rcPh: 'numéro registre commerce / NIF',
  wilaya: 'Wilaya',
  fonction: 'Votre fonction',
  fonctionPh: 'Gérant, directeur commercial…',
  typePartenariat: 'Type de partenariat visé',
  revendeur: 'Revendeur',
  franchise: 'Franchise',
  exclusif: 'Distributeur exclusif',
  clientele: 'Clientèle ciblée',
  clientelePart: 'Particuliers',
  clientelePro: 'Pros / B2B',
  clienteleMixte: 'Mixte',
  volume: 'Volume annuel cible (DZD)',
  vol1: '< 100 K',
  vol2: '100 K — 500 K',
  vol3: '500 K — 2 M',
  vol4: '2 M et +',
  showroom: 'Showroom existant ?',
  showroomOui: 'Oui',
  showroomNon: 'Non',
  showroomProjet: 'En projet',
  fullName: 'Contact — Nom complet',
  email: 'Email pro',
  phone: 'Téléphone direct',
  message: 'Présentation rapide',
  messagePh: 'Historique, zones couvertes, produits déjà distribués…',
};

const L_AR = {
  title: 'كن شريكًا موزعًا',
  intro: 'انضم إلى شبكة NDWI / NDO في الجزائر. سيتواصل فريق تطوير الشبكة خلال 48 ساعة عمل.',
  societe: 'الشركة',
  raisonSociale: 'الاسم التجاري',
  rcOuNif: 'السجل التجاري أو NIF',
  rcPh: 'رقم السجل / NIF',
  wilaya: 'الولاية',
  fonction: 'وظيفتك',
  fonctionPh: 'مدير، مسؤول تجاري…',
  typePartenariat: 'نوع الشراكة المرغوبة',
  revendeur: 'موزع',
  franchise: 'امتياز',
  exclusif: 'موزع حصري',
  clientele: 'الزبائن المستهدفة',
  clientelePart: 'أفراد',
  clientelePro: 'محترفون / B2B',
  clienteleMixte: 'مختلط',
  volume: 'حجم سنوي مستهدف (دج)',
  vol1: 'أقل من 100 ألف',
  vol2: '100 ألف — 500 ألف',
  vol3: '500 ألف — 2 مليون',
  vol4: '2 مليون وأكثر',
  showroom: 'هل لديك معرض؟',
  showroomOui: 'نعم',
  showroomNon: 'لا',
  showroomProjet: 'قيد الإنشاء',
  fullName: 'جهة الاتصال — الاسم الكامل',
  email: 'البريد المهني',
  phone: 'الهاتف المباشر',
  message: 'تقديم سريع',
  messagePh: 'تاريخ، مناطق التغطية، منتجات سابقة…',
};

export function DevenirDistributeurForm({ sourcePage }: Props) {
  const locale = useLocale() as Locale;
  const L = locale === 'ar' ? L_AR : L_FR;
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const form = useForm<LeadProDistributeurInput>({
    resolver: zodResolver(leadProDistributeurSchema),
    mode: 'onBlur',
    defaultValues: { sourcePage, locale, hp_field: '' },
  });
  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: LeadProDistributeurInput) => {
    setStatus('submitting');
    const res = await submitLead('pro-distributeur', data);
    if (res.ok) setStatus('success');
    else {
      setStatus('error');
      setErrorMsg(res.error);
    }
  };

  if (status === 'success') return <FormSuccess />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="bg-bone-50 border border-ink/10 p-8 lg:p-12 space-y-7">
      <Honeypot register={register} />

      <div>
        <h3 className="heading-display text-2xl">{L.title}</h3>
        <p className="text-sm text-ink/60 mt-2">{L.intro}</p>
      </div>

      <p className="eyebrow text-copper-500">{L.societe}</p>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label={L.raisonSociale} error={errors.raisonSociale?.message}>
          <input type="text" className={inputCls} {...register('raisonSociale')} />
        </Field>
        <Field label={L.rcOuNif} optional>
          <input type="text" placeholder={L.rcPh} className={inputCls} {...register('rcOuNif')} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label={L.wilaya} error={errors.wilaya?.message}>
          <select className={inputCls} {...register('wilaya')}>
            <option value="">—</option>
            {wilayasMajeures.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </Field>
        <Field label={L.fonction} error={errors.fonction?.message}>
          <input type="text" placeholder={L.fonctionPh} className={inputCls} {...register('fonction')} />
        </Field>
      </div>

      <Field label={L.typePartenariat} error={errors.typePartenariat?.message}>
        <RadioPills
          name="typePartenariat"
          register={register as never}
          columns={3}
          options={distribTypePartenariatValues.map((v) => ({
            value: v,
            label: { 'revendeur': L.revendeur, 'franchise': L.franchise, 'distributeur-exclusif': L.exclusif }[v],
          }))}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label={L.clientele} optional>
          <select className={inputCls} {...register('clientele')}>
            <option value="">—</option>
            {distribClienteleValues.map((v) => (
              <option key={v} value={v}>{{ particuliers: L.clientelePart, pros: L.clientelePro, mixte: L.clienteleMixte }[v]}</option>
            ))}
          </select>
        </Field>
        <Field label={L.volume} optional>
          <select className={inputCls} {...register('volumeAnnuelCible')}>
            <option value="">—</option>
            {distribVolumeValues.map((v) => (
              <option key={v} value={v}>{{ lt100k: L.vol1, '100-500k': L.vol2, '500k-2m': L.vol3, '2m+': L.vol4 }[v]}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label={L.showroom} optional>
        <RadioPills
          name="showroomExistant"
          register={register as never}
          columns={3}
          options={[
            { value: 'oui', label: L.showroomOui },
            { value: 'non', label: L.showroomNon },
            { value: 'projet', label: L.showroomProjet },
          ]}
        />
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

      <div className="pt-2">
        <SubmitButton status={status === 'success' ? 'idle' : status} />
      </div>
    </form>
  );
}
