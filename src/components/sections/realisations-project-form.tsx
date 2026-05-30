'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import { z } from 'zod';
import type { Locale } from '@/i18n/routing';
import { algerianPhoneRegex } from '@/lib/schemas/lead-common';
import { wilayaNames, getWilayaLabel } from '@/lib/data/wilayas';
import { submitLead } from '@/lib/forms/submit-lead';
import { Field, inputCls, textareaCls, RadioPills } from '@/components/forms/_shared/field';
import { Honeypot } from '@/components/forms/_shared/honeypot';
import { ConsentRgpd } from '@/components/forms/_shared/consent-rgpd';
import { FormSuccess } from '@/components/forms/_shared/form-success';
import { ErrorBanner } from '@/components/forms/_shared/error-banner';
import { SubmitButton } from '@/components/forms/_shared/submit-button';

const typeProjetValues = ['institution', 'promotion', 'hotellerie', 'architecte', 'autre'] as const;
const envergureValues = ['petit', 'moyen', 'grand', 'tres-grand'] as const;

const schema = z.object({
  fullName: z.string().min(2, 'Nom requis').max(100),
  email: z.string().email('Email invalide').max(120),
  phone: z
    .string()
    .min(8, 'Téléphone trop court')
    .max(20)
    .regex(algerianPhoneRegex, 'Numéro algérien attendu (+213… ou 0…)'),
  societe: z.string().min(2, 'Nom de la structure').max(120),
  typeProjet: z.enum(typeProjetValues, {
    errorMap: () => ({ message: 'Précisez le type de projet' }),
  }),
  wilaya: z.enum(wilayaNames, { errorMap: () => ({ message: 'Wilaya requise' }) }),
  envergure: z.enum(envergureValues).optional(),
  message: z.string().min(10, 'Décrivez votre projet (10 caractères min.)').max(2000),
  consent: z.literal(true, { errorMap: () => ({ message: 'Acceptation requise' }) }),
  hp_field: z.string().optional().default(''),
});

type FormInput = z.infer<typeof schema>;

const L_FR = {
  eyebrow: 'Discuter mon projet',
  title: 'Un projet à équiper ? Parlons-en.',
  intro: 'Promoteur, donneur d\'ordre, architecte, hôtelier — décrivez votre projet, nous revenons sous 72 h ouvrées avec une réponse cadrée.',
  fullName: 'Nom complet',
  email: 'Email professionnel',
  phone: 'Téléphone',
  societe: 'Société / structure',
  societePh: 'ex. Cosider Promotion, Wilaya de…',
  typeProjet: 'Type de projet',
  tpInst: 'Institution publique',
  tpPromo: 'Programme immobilier',
  tpHotel: 'Hôtellerie',
  tpArchi: 'Architecte / BET',
  tpAutre: 'Autre',
  wilaya: 'Wilaya du projet',
  envergure: 'Envergure',
  envPetit: 'Moins de 20 unités',
  envMoyen: '20 — 100 unités',
  envGrand: '100 — 500 unités',
  envTres: '500 unités et +',
  message: 'Décrivez votre projet',
  messagePh: 'Nature du programme, phase, échéance, besoins principaux (portes, cuisines, dressing…)',
};

const L_AR = {
  eyebrow: 'لنناقش مشروعك',
  title: 'مشروع للتجهيز؟ لنتحدث.',
  intro: 'مرقي عقاري، صاحب طلب، مهندس معماري، فندقي — صف مشروعك، نعود إليك خلال 72 ساعة عمل بجواب مدروس.',
  fullName: 'الاسم الكامل',
  email: 'البريد المهني',
  phone: 'الهاتف',
  societe: 'الشركة / الهيكل',
  societePh: 'مثال: كوسيدر، ولاية…',
  typeProjet: 'نوع المشروع',
  tpInst: 'مؤسسة عمومية',
  tpPromo: 'برنامج عقاري',
  tpHotel: 'فندقة',
  tpArchi: 'مهندس / مكتب دراسات',
  tpAutre: 'آخر',
  wilaya: 'ولاية المشروع',
  envergure: 'الحجم',
  envPetit: 'أقل من 20 وحدة',
  envMoyen: '20 — 100 وحدة',
  envGrand: '100 — 500 وحدة',
  envTres: '500 وحدة فأكثر',
  message: 'صف مشروعك',
  messagePh: 'طبيعة البرنامج، المرحلة، الموعد، الاحتياجات الأساسية (أبواب، مطابخ، خزائن…)',
};

export function RealisationsProjectForm() {
  const locale = useLocale() as Locale;
  const L = locale === 'ar' ? L_AR : L_FR;
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { hp_field: '' },
  });
  const { register, handleSubmit, formState: { errors } } = form;

  const typeLabels: Record<(typeof typeProjetValues)[number], string> = {
    institution: L.tpInst,
    promotion: L.tpPromo,
    hotellerie: L.tpHotel,
    architecte: L.tpArchi,
    autre: L.tpAutre,
  };
  const envLabels: Record<(typeof envergureValues)[number], string> = {
    petit: L.envPetit,
    moyen: L.envMoyen,
    grand: L.envGrand,
    'tres-grand': L.envTres,
  };

  const onSubmit = async (data: FormInput) => {
    setStatus('submitting');
    // On enveloppe les extras dans le message pour passer par le lead-type contact-general
    // (compatible avec le backend Edge Function existant, pas de nouveau routage requis).
    const wilayaLabel = getWilayaLabel(data.wilaya, locale);
    const envergureLabel = data.envergure ? envLabels[data.envergure] : '—';
    const header =
      locale === 'ar'
        ? `[مشروع — ${typeLabels[data.typeProjet]}]\nالشركة: ${data.societe}\nالولاية: ${wilayaLabel}\nالحجم: ${envergureLabel}\n\n`
        : `[Projet — ${typeLabels[data.typeProjet]}]\nSociété : ${data.societe}\nWilaya : ${wilayaLabel}\nEnvergure : ${envergureLabel}\n\n`;

    const payload = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      message: header + data.message,
      consent: data.consent,
      sourcePage: '/realisations',
      locale,
      hp_field: data.hp_field ?? '',
      sujet: 'autre' as const,
    };

    const res = await submitLead('contact-general', payload);
    if (res.ok) setStatus('success');
    else {
      setStatus('error');
      setErrorMsg(res.error);
    }
  };

  if (status === 'success') return (
    <section className="border-t border-ink/10 bg-bone-100 py-24 lg:py-28">
      <div className="container-page max-w-3xl">
        <FormSuccess />
      </div>
    </section>
  );

  return (
    <section className="border-t border-ink/10 bg-bone-100 py-24 lg:py-28">
      <div className="container-page max-w-3xl">
        <div className="mb-10">
          <span className="eyebrow">{L.eyebrow}</span>
          <h2 className="heading-display mt-4 text-display-md lg:text-display-lg">{L.title}</h2>
          <p className="mt-5 max-w-prose text-base leading-relaxed text-ink/70">{L.intro}</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="space-y-7 border border-ink/10 bg-bone-50 p-8 lg:p-12"
        >
          <Honeypot register={register} />

          <Field label={L.typeProjet} error={errors.typeProjet?.message}>
            <RadioPills
              name="typeProjet"
              register={register as never}
              columns={3}
              options={typeProjetValues.map((v) => ({ value: v, label: typeLabels[v] }))}
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={L.fullName} error={errors.fullName?.message}>
              <input type="text" autoComplete="name" className={inputCls} {...register('fullName')} />
            </Field>
            <Field label={L.societe} error={errors.societe?.message}>
              <input type="text" placeholder={L.societePh} className={inputCls} {...register('societe')} />
            </Field>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={L.email} error={errors.email?.message}>
              <input
                type="email"
                autoComplete="email"
                placeholder="vous@example.com"
                className={inputCls}
                {...register('email')}
              />
            </Field>
            <Field label={L.phone} error={errors.phone?.message}>
              <input
                type="tel"
                autoComplete="tel"
                placeholder="+213 …"
                className={inputCls}
                {...register('phone')}
              />
            </Field>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={L.wilaya} error={errors.wilaya?.message}>
              <select className={inputCls} defaultValue="" {...register('wilaya')}>
                <option value="" disabled>
                  —
                </option>
                {wilayaNames.map((w) => (
                  <option key={w} value={w}>
                    {getWilayaLabel(w, locale)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={L.envergure} optional error={errors.envergure?.message}>
              <select className={inputCls} defaultValue="" {...register('envergure')}>
                <option value="">—</option>
                {envergureValues.map((v) => (
                  <option key={v} value={v}>
                    {envLabels[v]}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label={L.message} error={errors.message?.message}>
            <textarea
              rows={5}
              placeholder={L.messagePh}
              className={textareaCls}
              {...register('message')}
            />
          </Field>

          <ConsentRgpd register={register} error={errors.consent?.message} />

          {status === 'error' && <ErrorBanner detail={errorMsg} />}

          <div className="pt-2">
            <SubmitButton status={status} />
          </div>
        </form>
      </div>
    </section>
  );
}
