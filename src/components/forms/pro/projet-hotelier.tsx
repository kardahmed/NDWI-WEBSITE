'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { wilayaNames, getWilayaLabel } from '@/lib/data/wilayas';
import {
  leadProHotelierSchema,
  type LeadProHotelierInput,
  hotelChambresValues,
  hotelEtoilesValues,
  hotelPhaseValues,
} from '@/lib/schemas/lead-pro-hotelier';
import { submitLead } from '@/lib/forms/submit-lead';
import { Field, inputCls, textareaCls, RadioPills, CheckboxPills } from '../_shared/field';
import { Honeypot } from '../_shared/honeypot';
import { ConsentRgpd } from '../_shared/consent-rgpd';
import { FormSuccess } from '../_shared/form-success';
import { ErrorBanner } from '../_shared/error-banner';
import { SubmitButton } from '../_shared/submit-button';

interface Props {
  sourcePage?: string;
}

const L_FR = {
  title: 'Projet hôtelier — équipement chambre',
  intro: 'NDWI équipe les hôtels en Algérie : portes pleines, mobilier sur-mesure, finitions hôtelières. Notre cellule projets revient sous 48 h ouvrées avec un cahier des charges adapté.',
  etablissement: 'Établissement',
  raisonSociale: 'Chaîne / établissement',
  fonction: 'Votre fonction',
  fonctionPh: 'Directeur achats, DG, architecte…',
  wilaya: 'Wilaya principale',
  multisite: 'Périmètre',
  monosite: 'Un seul site',
  multisiteOpt: 'Multi-sites',
  etoiles: 'Catégorie',
  etoiles3: '3 étoiles',
  etoiles4: '4 étoiles',
  etoiles5: '5 étoiles',
  etoilesLuxe: 'Luxe / boutique',
  nombreChambres: 'Nombre de chambres',
  ch1: '< 30',
  ch2: '30 — 80',
  ch3: '80 — 150',
  ch4: '150 et +',
  phase: 'Phase actuelle du projet',
  phaseEtude: 'Étude',
  phaseConcept: 'Conception',
  phaseChantier: 'Chantier en cours',
  phaseReno: 'Rénovation',
  phaseOuv: 'Ouverture imminente',
  deadline: 'Deadline d\'ouverture (si connue)',
  deadlinePh: 'ex. Q3 2027',
  besoins: 'Périmètre des besoins',
  besoinChambres: 'Mobilier chambres',
  besoinPortes: 'Portes',
  besoinPublic: 'Mobilier espaces publics',
  besoinCuisine: 'Cuisine pro / back of house',
  besoinSdb: 'Meubles salle de bain',
  fullName: 'Contact — Nom complet',
  email: 'Email pro',
  phone: 'Téléphone direct',
  message: 'Détails du projet',
  messagePh: 'Concept, ambiance recherchée, plans disponibles, contraintes…',
};

const L_AR: typeof L_FR = {
  title: 'مشروع فندقي — تجهيز الغرف',
  intro: 'NDWI تجهز الفنادق في الجزائر: أبواب مصمتة، أثاث مخصص، تشطيبات فندقية. خلية المشاريع لدينا ترد خلال 48 ساعة عمل.',
  etablissement: 'المؤسسة',
  raisonSociale: 'سلسلة / مؤسسة',
  fonction: 'وظيفتك',
  fonctionPh: 'مدير المشتريات، مدير عام، مهندس…',
  wilaya: 'الولاية الرئيسية',
  multisite: 'النطاق',
  monosite: 'موقع واحد',
  multisiteOpt: 'عدة مواقع',
  etoiles: 'الفئة',
  etoiles3: '3 نجوم',
  etoiles4: '4 نجوم',
  etoiles5: '5 نجوم',
  etoilesLuxe: 'فاخر / بوتيك',
  nombreChambres: 'عدد الغرف',
  ch1: 'أقل من 30',
  ch2: '30 — 80',
  ch3: '80 — 150',
  ch4: '150 وأكثر',
  phase: 'المرحلة الحالية',
  phaseEtude: 'دراسة',
  phaseConcept: 'تصميم',
  phaseChantier: 'ورشة جارية',
  phaseReno: 'تجديد',
  phaseOuv: 'افتتاح وشيك',
  deadline: 'موعد الافتتاح المتوقع',
  deadlinePh: 'مثال Q3 2027',
  besoins: 'نطاق الاحتياجات',
  besoinChambres: 'أثاث الغرف',
  besoinPortes: 'أبواب',
  besoinPublic: 'أثاث المساحات العامة',
  besoinCuisine: 'مطبخ مهني',
  besoinSdb: 'أثاث الحمامات',
  fullName: 'جهة الاتصال — الاسم الكامل',
  email: 'البريد المهني',
  phone: 'الهاتف المباشر',
  message: 'تفاصيل المشروع',
  messagePh: 'المفهوم، الأجواء المطلوبة، المخططات المتوفرة، القيود…',
};

const BESOINS = ['chambres', 'portes', 'mobilier-public', 'cuisine-pro', 'salle-de-bain'] as const;

export function ProjetHotelierForm({ sourcePage }: Props) {
  const locale = useLocale() as Locale;
  const L = locale === 'ar' ? L_AR : L_FR;
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const form = useForm<LeadProHotelierInput>({
    resolver: zodResolver(leadProHotelierSchema),
    mode: 'onBlur',
    defaultValues: { sourcePage, locale, hp_field: '', besoins: [] },
  });
  const { register, handleSubmit, watch, formState: { errors } } = form;
  const besoinsVal = (watch('besoins') ?? []) as Array<typeof BESOINS[number]>;

  const onSubmit = async (data: LeadProHotelierInput) => {
    setStatus('submitting');
    const res = await submitLead('pro-hotelier', data);
    if (res.ok) setStatus('success');
    else {
      setStatus('error');
      setErrorMsg(res.error);
    }
  };

  if (status === 'success') return <FormSuccess />;

  const besoinsLabels: Record<typeof BESOINS[number], string> = {
    chambres: L.besoinChambres,
    portes: L.besoinPortes,
    'mobilier-public': L.besoinPublic,
    'cuisine-pro': L.besoinCuisine,
    'salle-de-bain': L.besoinSdb,
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="bg-bone-50 border border-ink/10 p-8 lg:p-12 space-y-7">
      <Honeypot register={register} />

      <div>
        <h3 className="heading-display text-2xl">{L.title}</h3>
        <p className="text-sm text-ink/60 mt-2">{L.intro}</p>
      </div>

      <p className="eyebrow text-copper-500">{L.etablissement}</p>

      <Field label={L.raisonSociale} error={errors.raisonSociale?.message}>
        <input type="text" className={inputCls} {...register('raisonSociale')} />
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

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label={L.multisite} optional>
          <RadioPills
            name="multisite"
            register={register as never}
            columns={2}
            options={[
              { value: 'monosite', label: L.monosite },
              { value: 'multisite', label: L.multisiteOpt },
            ]}
          />
        </Field>
        <Field label={L.etoiles} optional>
          <select className={inputCls} {...register('etoiles')}>
            <option value="">—</option>
            {hotelEtoilesValues.map((v) => (
              <option key={v} value={v}>{{ '3': L.etoiles3, '4': L.etoiles4, '5': L.etoiles5, luxe: L.etoilesLuxe }[v]}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label={L.nombreChambres} error={errors.nombreChambres?.message}>
        <RadioPills
          name="nombreChambres"
          register={register as never}
          columns={4}
          options={hotelChambresValues.map((v) => ({
            value: v,
            label: { lt30: L.ch1, '30-80': L.ch2, '80-150': L.ch3, '150+': L.ch4 }[v],
          }))}
        />
      </Field>

      <Field label={L.phase} error={errors.phase?.message}>
        <RadioPills
          name="phase"
          register={register as never}
          columns={3}
          options={hotelPhaseValues.map((v) => ({
            value: v,
            label: { etude: L.phaseEtude, conception: L.phaseConcept, chantier: L.phaseChantier, renovation: L.phaseReno, ouverture: L.phaseOuv }[v],
          }))}
        />
      </Field>

      <Field label={L.deadline} optional>
        <input type="text" placeholder={L.deadlinePh} className={inputCls} {...register('deadlineOuverture')} />
      </Field>

      <Field label={L.besoins} optional>
        <CheckboxPills
          name="besoins"
          register={register as never}
          selected={besoinsVal}
          columns={3}
          options={BESOINS.map((v) => ({ value: v, label: besoinsLabels[v] }))}
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
          <textarea rows={5} placeholder={L.messagePh} className={textareaCls} {...register('message')} />
        </Field>
        <ConsentRgpd register={register} error={errors.consent?.message} />
      </div>

      {status === 'error' && <ErrorBanner detail={errorMsg} />}

      <div className="pt-2">
        <SubmitButton status={status} />
      </div>
    </form>
  );
}
