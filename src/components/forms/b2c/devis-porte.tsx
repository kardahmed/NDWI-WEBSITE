'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import {
  leadDevisPorteSchema,
  type LeadDevisPorteInput,
  porteCategorieValues,
  porteFinitionValues,
  porteQuantiteValues,
  porteDelaiValues,
} from '@/lib/schemas/lead-devis-porte';
import { submitLead } from '@/lib/forms/submit-lead';
import { Field, inputCls, textareaCls, RadioPills } from '../_shared/field';
import { Honeypot } from '../_shared/honeypot';
import { ConsentRgpd } from '../_shared/consent-rgpd';
import { FormSuccess } from '../_shared/form-success';
import { ErrorBanner } from '../_shared/error-banner';
import { SubmitButton } from '../_shared/submit-button';

interface Props {
  productSlug?: string;
  sourcePage?: string;
}

const LABEL: Record<Locale, Record<string, string>> = {
  fr: {
    title: 'Demander un devis porte',
    intro: 'Précisez votre besoin — un conseiller revient vers vous sous 24 à 48 h ouvrées.',
    categorie: 'Type de porte',
    catInterieur: 'Intérieure',
    catEntree: 'Entrée',
    catCoulissante: 'Coulissante',
    quantite: 'Quantité estimée',
    qty1: '1 porte',
    qty25: '2 à 5',
    qty615: '6 à 15',
    qty16: '16 et +',
    finition: 'Finition souhaitée',
    finBois: 'Bois',
    finLaque: 'Laquée',
    finPlacage: 'Placage',
    finVerre: 'Verre',
    finMixte: 'Mixte',
    delai: 'Délai d\'installation',
    delImmediat: 'Immédiat',
    del1: '< 1 mois',
    del3: '< 3 mois',
    del6: '< 6 mois',
    delReflexion: 'En réflexion',
    dimensions: 'Dimensions (L × H, mm)',
    dimensionsPh: 'ex. 900 × 2100',
    city: 'Ville / Wilaya',
    cityPh: 'Oran, Alger, Constantine…',
    fullName: 'Nom complet',
    email: 'Email',
    phone: 'Téléphone',
    message: 'Message complémentaire',
    messagePh: 'Style, ambiance, contraintes spécifiques…',
  },
  ar: {
    title: 'طلب عرض سعر — أبواب',
    intro: 'حدد حاجتك — سيتصل بك مستشار خلال 24 إلى 48 ساعة عمل.',
    categorie: 'نوع الباب',
    catInterieur: 'داخلي',
    catEntree: 'مدخل',
    catCoulissante: 'منزلق',
    quantite: 'الكمية المقدرة',
    qty1: 'باب واحد',
    qty25: '2 إلى 5',
    qty615: '6 إلى 15',
    qty16: '16 وأكثر',
    finition: 'التشطيب المطلوب',
    finBois: 'خشب',
    finLaque: 'لاكيه',
    finPlacage: 'قشرة',
    finVerre: 'زجاج',
    finMixte: 'مختلط',
    delai: 'مهلة التركيب',
    delImmediat: 'فوري',
    del1: 'أقل من شهر',
    del3: 'أقل من 3 أشهر',
    del6: 'أقل من 6 أشهر',
    delReflexion: 'قيد التفكير',
    dimensions: 'الأبعاد (عرض × ارتفاع، مم)',
    dimensionsPh: 'مثال 900 × 2100',
    city: 'المدينة / الولاية',
    cityPh: 'وهران، الجزائر، قسنطينة…',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    message: 'رسالة إضافية',
    messagePh: 'الأسلوب، الأجواء، قيود خاصة…',
  },
};

export function DevisPorteForm({ productSlug, sourcePage }: Props) {
  const locale = useLocale() as Locale;
  const L = LABEL[locale] ?? LABEL.fr;
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const form = useForm<LeadDevisPorteInput>({
    resolver: zodResolver(leadDevisPorteSchema),
    mode: 'onBlur',
    defaultValues: { productSlug, sourcePage, locale, hp_field: '' },
  });
  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: LeadDevisPorteInput) => {
    setStatus('submitting');
    const res = await submitLead('devis-porte', data);
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

      <Field label={L.categorie} error={errors.categorie?.message}>
        <RadioPills
          name="categorie"
          register={register as never}
          columns={4}
          options={porteCategorieValues.map((v) => ({
            value: v,
            label: { interieur: L.catInterieur, entree: L.catEntree, coulissante: L.catCoulissante }[v],
          }))}
        />
      </Field>

      <Field label={L.quantite} error={errors.quantite?.message}>
        <RadioPills
          name="quantite"
          register={register as never}
          columns={4}
          options={porteQuantiteValues.map((v) => ({
            value: v,
            label: { '1': L.qty1, '2-5': L.qty25, '6-15': L.qty615, '16+': L.qty16 }[v],
          }))}
        />
      </Field>

      <Field label={L.finition} optional>
        <RadioPills
          name="finition"
          register={register as never}
          columns={3}
          options={porteFinitionValues.map((v) => ({
            value: v,
            label: { bois: L.finBois, laque: L.finLaque, placage: L.finPlacage, verre: L.finVerre, mixte: L.finMixte }[v],
          }))}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label={L.dimensions} optional>
          <input type="text" placeholder={L.dimensionsPh} className={inputCls} {...register('dimensions')} />
        </Field>
        <Field label={L.delai} optional>
          <select className={inputCls} {...register('delai')}>
            <option value="">—</option>
            {porteDelaiValues.map((v) => (
              <option key={v} value={v}>
                {{ immediat: L.delImmediat, '1mois': L.del1, '3mois': L.del3, '6mois': L.del6, reflexion: L.delReflexion }[v]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label={L.city} error={errors.city?.message}>
        <input type="text" placeholder={L.cityPh} className={inputCls} {...register('city')} />
      </Field>

      <div className="border-t border-ink/10 pt-7 space-y-6">
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
        <Field label={L.message} optional error={errors.message?.message}>
          <textarea rows={4} placeholder={L.messagePh} className={textareaCls} {...register('message')} />
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
