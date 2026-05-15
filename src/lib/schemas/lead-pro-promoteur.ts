import { z } from 'zod';
import { leadCommonSchema, wilayasMajeures } from './lead-common';

export const promoLogementsValues = ['lt20', '20-50', '50-150', '150-500', '500+'] as const;
export const promoPhaseValues = ['etude', 'permis', 'gros-oeuvre', 'second-oeuvre', 'livraison'] as const;
export const promoBudgetValues = ['lt50m', '50-200m', '200-500m', '500m+'] as const; // DZD

export const leadProPromoteurSchema = leadCommonSchema.extend({
  raisonSociale: z.string().min(2, 'Nom du promoteur').max(120),
  fonction: z.string().min(2, 'Votre fonction').max(80),
  wilaya: z.enum(wilayasMajeures, {
    errorMap: () => ({ message: 'Wilaya requise' }),
  }),
  nomProgramme: z.string().max(120).optional(),
  nbLogements: z.enum(promoLogementsValues, {
    errorMap: () => ({ message: 'Précisez le nombre de logements' }),
  }),
  phase: z.enum(promoPhaseValues, {
    errorMap: () => ({ message: 'Précisez la phase' }),
  }),
  budgetAmenagement: z.enum(promoBudgetValues).optional(),
  besoins: z.array(z.enum(['portes', 'cuisines', 'dressing', 'salle-de-bain', 'finitions'])).optional(),
});

export type LeadProPromoteurInput = z.infer<typeof leadProPromoteurSchema>;
