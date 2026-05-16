'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { wilayaNames, getWilayaLabel } from '@/lib/data/wilayas';
import {
  leadProArchitecteSchema,
  type LeadProArchitecteInput,
  archiSpecialiteValues,
  archiProjetsValues,
} from '@/lib/schemas/lead-pro-architecte';
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
  title: 'Architects Club — partenariat',
  intro: 'Bibliothèque BIM, visites usine, prix réseau, samples gratuits. Rejoignez les architectes partenaires NDWI.',
  agence: 'Agence',
  agenceLabel: 'Nom de l\'agence',
  fonction: 'Votre fonction',
  fonctionPh: 'Architecte associé, chef de projet…',
  wilaya: 'Wilaya principale',
  siteWeb: 'Site web ou portfolio',
  siteWebPh: 'https://…',
  specialite: 'Spécialité dominante',
  specRes: 'Résidentiel',
  specTer: 'Tertiaire',
  specHot: 'Hôtelier',
  specCom: 'Commercial',
  specMix: 'Mixte',
  projets: 'Projets livrés / an',
  proj1: '< 5',
  proj2: '5 — 15',
  proj3: '15 — 30',
  proj4: '30 et +',
  besoins: 'Ce qui vous intéresse',
  besoinSamples: 'Samples / nuanciers gratuits',
  besoinBim: 'Bibliothèque BIM / CAD',
  besoinVisite: 'Visite usine NDWI Oran',
  fullName: 'Contact — Nom complet',
  email: 'Email pro',
  phone: 'Téléphone direct',
  message: 'Projets en cours / besoins spécifiques',
  messagePh: 'Décrivez vos projets actuels, vos contraintes techniques…',
};

const L_AR: typeof L_FR = {
  title: 'Architects Club — شراكة',
  intro: 'مكتبة BIM، زيارات للمصنع، أسعار خاصة، عينات مجانية. انضم إلى المعماريين الشركاء.',
  agence: 'المكتب',
  agenceLabel: 'اسم المكتب',
  fonction: 'وظيفتك',
  fonctionPh: 'معماري شريك، مدير مشروع…',
  wilaya: 'الولاية الرئيسية',
  siteWeb: 'الموقع أو معرض الأعمال',
  siteWebPh: 'https://…',
  specialite: 'التخصص الرئيسي',
  specRes: 'سكني',
  specTer: 'خدمي',
  specHot: 'فندقي',
  specCom: 'تجاري',
  specMix: 'مختلط',
  projets: 'مشاريع منجزة سنويًا',
  proj1: 'أقل من 5',
  proj2: '5 — 15',
  proj3: '15 — 30',
  proj4: '30 وأكثر',
  besoins: 'ما يهمك',
  besoinSamples: 'عينات / لوحات ألوان مجانية',
  besoinBim: 'مكتبة BIM / CAD',
  besoinVisite: 'زيارة المصنع NDWI وهران',
  fullName: 'جهة الاتصال — الاسم الكامل',
  email: 'البريد المهني',
  phone: 'الهاتف المباشر',
  message: 'مشاريع جارية / احتياجات خاصة',
  messagePh: 'صف مشاريعك الحالية، قيودك التقنية…',
};

export function PartenariatArchitecteForm({ sourcePage }: Props) {
  const locale = useLocale() as Locale;
  const L = locale === 'ar' ? L_AR : L_FR;
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const form = useForm<LeadProArchitecteInput>({
    resolver: zodResolver(leadProArchitecteSchema),
    mode: 'onBlur',
    defaultValues: { sourcePage, locale, hp_field: '' },
  });
  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: LeadProArchitecteInput) => {
    setStatus('submitting');
    const res = await submitLead('pro-architecte', data);
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

      <p className="eyebrow text-copper-500">{L.agence}</p>

      <Field label={L.agenceLabel} error={errors.agence?.message}>
        <input type="text" className={inputCls} {...register('agence')} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label={L.fonction} error={errors.fonction?.message}>
          <input type="text" placeholder={L.fonctionPh} className={inputCls} {...register('fonction')} />
        </Field>
        <Field label={L.wilaya} error={errors.wilaya?.message}>
          <select className={inputCls} {...register('wilaya')}>
            <option value="">—</option>
            {wilayaNames.map((w) => (
              <option key={w} value={w}>{getWilayaLabel(w, locale)}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label={L.siteWeb} optional error={errors.siteWeb?.message}>
        <input type="url" placeholder={L.siteWebPh} className={inputCls} {...register('siteWeb')} />
      </Field>

      <Field label={L.specialite} error={errors.specialite?.message}>
        <RadioPills
          name="specialite"
          register={register as never}
          columns={3}
          options={archiSpecialiteValues.map((v) => ({
            value: v,
            label: { residentiel: L.specRes, tertiaire: L.specTer, hotelier: L.specHot, commercial: L.specCom, mixte: L.specMix }[v],
          }))}
        />
      </Field>

      <Field label={L.projets} optional>
        <RadioPills
          name="nbProjetsAnnuels"
          register={register as never}
          columns={4}
          options={archiProjetsValues.map((v) => ({
            value: v,
            label: { lt5: L.proj1, '5-15': L.proj2, '15-30': L.proj3, '30+': L.proj4 }[v],
          }))}
        />
      </Field>

      <Field label={L.besoins} optional>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('besoinSamples')} className="h-4 w-4 accent-copper-500" />
            <span className="text-sm text-ink/80">{L.besoinSamples}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('besoinBim')} className="h-4 w-4 accent-copper-500" />
            <span className="text-sm text-ink/80">{L.besoinBim}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('besoinVisite')} className="h-4 w-4 accent-copper-500" />
            <span className="text-sm text-ink/80">{L.besoinVisite}</span>
          </label>
        </div>
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
          <textarea rows={5} placeholder={L.messagePh} className={textareaCls} {...register('message')} />
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
