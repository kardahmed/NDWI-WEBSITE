import { z } from 'zod';
import { leadCommonSchema, wilayasMajeures } from './lead-common';

export const archiSpecialiteValues = ['residentiel', 'tertiaire', 'hotelier', 'commercial', 'mixte'] as const;
export const archiProjetsValues = ['lt5', '5-15', '15-30', '30+'] as const;

export const leadProArchitecteSchema = leadCommonSchema.extend({
  agence: z.string().min(2, 'Nom de l\'agence').max(120),
  fonction: z.string().min(2, 'Votre fonction').max(80),
  wilaya: z.enum(wilayasMajeures, {
    errorMap: () => ({ message: 'Wilaya requise' }),
  }),
  siteWeb: z.string().url('URL invalide').or(z.literal('')).optional(),
  specialite: z.enum(archiSpecialiteValues, {
    errorMap: () => ({ message: 'Précisez votre spécialité' }),
  }),
  nbProjetsAnnuels: z.enum(archiProjetsValues).optional(),
  besoinSamples: z.boolean().optional(),
  besoinBim: z.boolean().optional(),
  besoinVisite: z.boolean().optional(),
});

export type LeadProArchitecteInput = z.infer<typeof leadProArchitecteSchema>;
