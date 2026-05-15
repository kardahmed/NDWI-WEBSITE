'use client';

import { FormModalTrigger } from './_shared/form-modal';
import { ContactGeneralForm } from './contact-general';
import type { contactSujetValues } from '@/lib/schemas/lead-contact';

type Sujet = (typeof contactSujetValues)[number];

interface Props {
  sourcePage: string;
  label: string;
  defaultSujet?: Sujet;
  variant?: 'primary' | 'secondary';
  className?: string;
}

/** Bouton qui ouvre le formulaire de contact général dans une modale. */
export function ContactTrigger({ sourcePage, label, defaultSujet, variant, className }: Props) {
  return (
    <FormModalTrigger label={label} variant={variant} className={className}>
      <ContactGeneralForm sourcePage={sourcePage} defaultSujet={defaultSujet} />
    </FormModalTrigger>
  );
}
