'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { wilayasMajeures } from '@/lib/schemas/lead-common';
import {
  leadProPromoteurSchema,
  type LeadProPromoteurInput,
  promoLogementsValues,
  promoPhaseValues,
  promoBudgetValues,
} from '@/lib/schemas/lead-pro-promoteur';
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
  title: 'Programme immobilier — aménagement clé en main',
  intro: 'NDWI équipe les programmes neufs et rénovations en Algérie : portes, cuisines, dressing, finitions. Devis volumétrique sous 72 h ouvrées.',
  societe: 'Société',
  raisonSociale: 'Raison sociale du promoteur',
  fonction: 'Votre fonction',
  fonctionPh: 'Directeur technique, DG, DAF…',
  wilaya: 'Wilaya du programme',
  nomProgramme: 'Nom du programme',
  nomProgrammePh: 'ex. Résidence Les Pins',
  nbLogements: 'Nombre de logements',
  log1: '< 20',
  log2: '20 — 50',
  log3: '50 — 150',
  log4: '150 — 500',
  log5: '500 et +',
  phase: 'Phase actuelle',
  phaseEtude: 'Étude',
  phasePermis: 'Permis obtenu',
  phaseGros: 'Gros œuvre',
  phaseSec: 'Second œuvre',
  phaseLiv: 'Livraison imminente',
  budget: 'Enveloppe aménagement (DZD)',
  bud1: '< 50 M',
  bud2: '50 — 200 M',
  bud3: '200 — 500 M',
  bud4: '500 M et +',
  besoins: 'Lots concernés',
  besoinPortes: 'Portes',
  besoinCuisines: 'Cuisines',
  besoinDressing: 'Dressing',
  besoinSdb: 'Salle de bain',
  besoinFinitions: 'Finitions',
  fullName: 'Contact — Nom complet',
  email: 'Email pro',
  phone: 'Téléphone direct',
  message: 'Détails du programme',
  messagePh: 'Concept, typologies, niveau de standing, deadline livraison…',
};

const L_AR: typeof L_FR = {
  title: 'برنامج عقاري — تجهيز شامل',
  intro: 'NDWI تجهز البرامج الجديدة وأعمال التجديد في الجزائر. عرض حجمي خلال 72 ساعة عمل.',
  societe: 'الشركة',
  raisonSociale: 'الاسم التجاري للمروج',
  fonction: 'وظيفتك',
  fonctionPh: 'مدير تقني، مدير عام، مدير مالي…',
  wilaya: 'ولاية البرنامج',
  nomProgramme: 'اسم البرنامج',
  nomProgrammePh: 'مثال إقامة الصنوبر',
  nbLogements: 'عدد المساكن',
  log1: 'أقل من 20',
  log2: '20 — 50',
  log3: '50 — 150',
  log4: '150 — 500',
  log5: '500 وأكثر',
  phase: 'المرحلة الحالية',
  phaseEtude: 'دراسة',
  phasePermis: 'رخصة محصلة',
  phaseGros: 'الهيكل الإنشائي',
  phaseSec: 'التشطيب',
  phaseLiv: 'تسليم وشيك',
  budget: 'ميزانية التجهيز (دج)',
  bud1: 'أقل من 50 م',
  bud2: '50 — 200 م',
  bud3: '200 — 500 م',
  bud4: '500 م وأكثر',
  besoins: 'الأقسام المعنية',
  besoinPortes: 'أبواب',
  besoinCuisines: 'مطابخ',
  besoinDressing: 'خزائن',
  besoinSdb: 'حمامات',
  besoinFinitions: 'تشطيبات',
  fullName: 'جهة الاتصال — الاسم الكامل',
  email: 'البريد المهني',
  phone: 'الهاتف المباشر',
  message: 'تفاصيل البرنامج',
  messagePh: 'المفهوم، الأنماط، مستوى الفخامة، موعد التسليم…',
};

const BESOINS = ['portes', 'cuisines', 'dressing', 'salle-de-bain', 'finitions'] as const;

export function PromotionImmobiliereForm({ sourcePage }: Props) {
  const locale = useLocale() as Locale;
  const L = locale === 'ar' ? L_AR : L_FR;
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const form = useForm<LeadProPromoteurInput>({
    resolver: zodResolver(leadProPromoteurSchema),
    mode: 'onBlur',
    defaultValues: { sourcePage, locale, hp_field: '', besoins: [] },
  });
  const { register, handleSubmit, watch, formState: { errors } } = form;
  const besoinsVal = (watch('besoins') ?? []) as Array<typeof BESOINS[number]>;

  const onSubmit = async (data: LeadProPromoteurInput) => {
    setStatus('submitting');
    const res = await submitLead('pro-promoteur', data);
    if (res.ok) setStatus('success');
    else {
      setStatus('error');
      setErrorMsg(res.error);
    }
  };

  if (status === 'success') return <FormSuccess />;

  const besoinsLabels: Record<typeof BESOINS[number], string> = {
    portes: L.besoinPortes,
    cuisines: L.besoinCuisines,
    dressing: L.besoinDressing,
    'salle-de-bain': L.besoinSdb,
    finitions: L.besoinFinitions,
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="bg-bone-50 border border-ink/10 p-8 lg:p-12 space-y-7">
      <Honeypot register={register} />

      <div>
        <h3 className="heading-display text-2xl">{L.title}</h3>
        <p className="text-sm text-ink/60 mt-2">{L.intro}</p>
      </div>

      <p className="eyebrow text-copper-500">{L.societe}</p>

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
            {wilayasMajeures.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label={L.nomProgramme} optional>
        <input type="text" placeholder={L.nomProgrammePh} className={inputCls} {...register('nomProgramme')} />
      </Field>

      <Field label={L.nbLogements} error={errors.nbLogements?.message}>
        <RadioPills
          name="nbLogements"
          register={register as never}
          columns={3}
          options={promoLogementsValues.map((v) => ({
            value: v,
            label: { lt20: L.log1, '20-50': L.log2, '50-150': L.log3, '150-500': L.log4, '500+': L.log5 }[v],
          }))}
        />
      </Field>

      <Field label={L.phase} error={errors.phase?.message}>
        <RadioPills
          name="phase"
          register={register as never}
          columns={3}
          options={promoPhaseValues.map((v) => ({
            value: v,
            label: { etude: L.phaseEtude, permis: L.phasePermis, 'gros-oeuvre': L.phaseGros, 'second-oeuvre': L.phaseSec, livraison: L.phaseLiv }[v],
          }))}
        />
      </Field>

      <Field label={L.budget} optional>
        <RadioPills
          name="budgetAmenagement"
          register={register as never}
          columns={4}
          options={promoBudgetValues.map((v) => ({
            value: v,
            label: { lt50m: L.bud1, '50-200m': L.bud2, '200-500m': L.bud3, '500m+': L.bud4 }[v],
          }))}
        />
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
        <SubmitButton status={status === 'success' ? 'idle' : status} />
      </div>
    </form>
  );
}
