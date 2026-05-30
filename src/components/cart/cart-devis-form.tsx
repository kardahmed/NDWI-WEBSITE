'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale } from 'next-intl';
import { algerianPhoneRegex } from '@/lib/schemas/lead-common';
import { submitLead } from '@/lib/forms/submit-lead';
import { useCart } from '@/lib/cart/cart-context';
import type { CartItem } from '@/lib/cart/types';
import { Field, inputCls, textareaCls } from '@/components/forms/_shared/field';
import { Honeypot } from '@/components/forms/_shared/honeypot';
import { ConsentRgpd } from '@/components/forms/_shared/consent-rgpd';
import { ErrorBanner } from '@/components/forms/_shared/error-banner';
import { SubmitButton } from '@/components/forms/_shared/submit-button';
import { FormSuccess } from '@/components/forms/_shared/form-success';

const schema = z.object({
  fullName: z.string().min(2, 'Nom requis').max(100),
  email: z.string().email('Email invalide').max(120),
  phone: z
    .string()
    .min(8, 'Téléphone trop court')
    .max(20)
    .regex(algerianPhoneRegex, 'Numéro algérien attendu (+213… ou 0…)'),
  societe: z.string().max(120).optional(),
  message: z.string().max(2000).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'Acceptation requise' }) }),
  hp_field: z.string().optional().default(''),
});

type FormInput = z.infer<typeof schema>;

const L_FR = {
  title: 'Vos coordonnées',
  intro: 'Nous vous recontactons sous 72 h ouvrées avec un devis détaillé pour les produits de votre panier.',
  fullName: 'Nom complet',
  email: 'Email',
  phone: 'Téléphone',
  societe: 'Société',
  message: 'Message complémentaire',
  messagePh: 'Délai souhaité, contraintes, contexte du projet…',
  empty: 'Votre panier est vide.',
  successTitle: 'Demande envoyée',
  successBody: 'Votre panier de devis a bien été transmis. Notre équipe vous contacte sous 72 h ouvrées.',
};

const L_AR = {
  title: 'بياناتك',
  intro: 'سنعود إليك خلال 72 ساعة عمل بعرض سعر تفصيلي للمنتجات في سلتك.',
  fullName: 'الاسم الكامل',
  email: 'البريد الإلكتروني',
  phone: 'الهاتف',
  societe: 'الشركة',
  message: 'رسالة إضافية',
  messagePh: 'المهلة المطلوبة، القيود، سياق المشروع…',
  empty: 'سلتك فارغة.',
  successTitle: 'تم الإرسال',
  successBody: 'تم إرسال طلب التسعير. سيتواصل معك فريقنا خلال 72 ساعة عمل.',
};

/** Formate la liste du panier en texte lisible pour le message d'envoi. */
function formatItemsForMessage(items: CartItem[], locale: 'fr' | 'ar'): string {
  return items
    .map((it, i) => {
      const lines: string[] = [];
      const brand = it.brand ? ` [${it.brand.toUpperCase()}]` : '';
      lines.push(
        `${i + 1}. ${it.productName}${brand} × ${it.quantity} (${it.productType})`
      );
      const cfg = it.configuration;
      if (cfg?.revetement) lines.push(`   - ${locale === 'ar' ? 'الكسوة' : 'Revêtement'}: ${cfg.revetement.label}`);
      if (cfg?.poignee) lines.push(`   - ${locale === 'ar' ? 'المقبض' : 'Poignée'}: ${cfg.poignee.label}`);
      if (cfg?.sensOuverture) lines.push(`   - ${locale === 'ar' ? 'الفتح' : 'Sens'}: ${cfg.sensOuverture}`);
      if (cfg?.dimensions)
        lines.push(
          `   - ${locale === 'ar' ? 'الأبعاد' : 'Dimensions'}: ${cfg.dimensions.largeur} × ${cfg.dimensions.hauteur} ${cfg.dimensions.unit}`
        );
      if (cfg?.accessoires && cfg.accessoires.length > 0)
        lines.push(
          `   - ${locale === 'ar' ? 'إكسسوارات' : 'Accessoires'}: ${cfg.accessoires.map((a) => a.label).join(', ')}`
        );
      if (it.variant) lines.push(`   - ${locale === 'ar' ? 'الخيار' : 'Variante'}: ${it.variant.label}`);
      if (it.notes) lines.push(`   - ${locale === 'ar' ? 'الملاحظات' : 'Notes'}: ${it.notes}`);
      lines.push(`   - ${locale === 'ar' ? 'الرابط' : 'Lien'}: ${it.productHref}`);
      return lines.join('\n');
    })
    .join('\n\n');
}

interface Props {
  /** Appelée après envoi réussi (p.ex. pour vider le panier ou fermer le drawer). */
  onSubmitted?: () => void;
}

export function CartDevisForm({ onSubmitted }: Props) {
  const locale = useLocale() as 'fr' | 'ar';
  const L = locale === 'ar' ? L_AR : L_FR;
  const { items, clear } = useCart();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { hp_field: '' },
  });
  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: FormInput) => {
    if (items.length === 0) return;
    setStatus('submitting');

    const header =
      locale === 'ar'
        ? `[سلة طلب تسعير — ${items.length} منتج · إجمالي ${items.reduce((s, it) => s + it.quantity, 0)} قطعة]`
        : `[Panier devis — ${items.length} produit(s) · ${items.reduce((s, it) => s + it.quantity, 0)} pièce(s) au total]`;
    const societeLine = data.societe
      ? `\n${locale === 'ar' ? 'الشركة' : 'Société'} : ${data.societe}`
      : '';
    const userMsg = data.message
      ? `\n\n--- ${locale === 'ar' ? 'رسالة العميل' : 'Message client'} ---\n${data.message}`
      : '';

    const body = `${header}${societeLine}\n\n${formatItemsForMessage(items, locale)}${userMsg}`;

    const res = await submitLead('contact-general', {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      message: body,
      consent: data.consent,
      sourcePage: '/panier-devis',
      locale,
      hp_field: data.hp_field ?? '',
      sujet: 'autre' as const,
    });

    if (res.ok) {
      setStatus('success');
      clear();
      onSubmitted?.();
    } else {
      setStatus('error');
      setErrorMsg(res.error);
    }
  };

  if (status === 'success') {
    return (
      <div className="p-6">
        <FormSuccess />
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-5">
      <Honeypot register={register} />

      <div>
        <h3 className="heading-display text-xl">{L.title}</h3>
        <p className="mt-1.5 text-xs text-ink/60 leading-relaxed">{L.intro}</p>
      </div>

      <Field label={L.fullName} error={errors.fullName?.message}>
        <input type="text" autoComplete="name" className={inputCls} {...register('fullName')} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
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

      <Field label={L.societe} optional error={errors.societe?.message}>
        <input type="text" className={inputCls} {...register('societe')} />
      </Field>

      <Field label={L.message} optional error={errors.message?.message}>
        <textarea rows={3} placeholder={L.messagePh} className={textareaCls} {...register('message')} />
      </Field>

      <ConsentRgpd register={register} error={errors.consent?.message} />

      {status === 'error' && <ErrorBanner detail={errorMsg} />}

      <SubmitButton status={status} />
    </form>
  );
}
