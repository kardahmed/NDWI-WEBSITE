import { z } from 'zod';
import { leadCommonSchema, wilayasMajeures } from './lead-common';

export const hotelEtoilesValues = ['3', '4', '5', 'luxe'] as const;
export const hotelChambresValues = ['lt30', '30-80', '80-150', '150+'] as const;
export const hotelPhaseValues = ['etude', 'conception', 'chantier', 'renovation', 'ouverture'] as const;

export const leadProHotelierSchema = leadCommonSchema.extend({
  raisonSociale: z.string().min(2, 'Nom de la chaîne / établissement').max(120),
  fonction: z.string().min(2, 'Votre fonction').max(80),
  wilaya: z.enum(wilayasMajeures, {
    errorMap: () => ({ message: 'Wilaya requise' }),
  }),
  multisite: z.enum(['monosite', 'multisite']).optional(),
  etoiles: z.enum(hotelEtoilesValues).optional(),
  nombreChambres: z.enum(hotelChambresValues, {
    errorMap: () => ({ message: 'Précisez le nombre de chambres' }),
  }),
  phase: z.enum(hotelPhaseValues, {
    errorMap: () => ({ message: 'Précisez la phase du projet' }),
  }),
  deadlineOuverture: z.string().max(40).optional(),
  besoins: z.array(z.enum(['chambres', 'portes', 'mobilier-public', 'cuisine-pro', 'salle-de-bain'])).optional(),
});

export type LeadProHotelierInput = z.infer<typeof leadProHotelierSchema>;
