import { z } from 'zod';
import { leadCommonSchema } from './lead-common';

export const contactSujetValues = [
  'info-produit',
  'sav',
  'rdv-showroom',
  'presse',
  'recrutement',
  'autre',
] as const;

export const leadContactSchema = leadCommonSchema.extend({
  sujet: z.enum(contactSujetValues, {
    errorMap: () => ({ message: 'Choisissez un sujet' }),
  }),
  // pour contact, le message devient obligatoire
  message: z.string().min(10, 'Décrivez votre demande (10 caractères min.)').max(2000),
});

export type LeadContactInput = z.infer<typeof leadContactSchema>;
