import { z } from 'zod';
import { leadCommonSchema, wilayasMajeures } from './lead-common';

export const distribClienteleValues = ['particuliers', 'pros', 'mixte'] as const;
export const distribVolumeValues = ['lt100k', '100-500k', '500k-2m', '2m+'] as const;
export const distribTypePartenariatValues = ['revendeur', 'franchise', 'distributeur-exclusif'] as const;

export const leadProDistributeurSchema = leadCommonSchema.extend({
  raisonSociale: z.string().min(2, 'Raison sociale requise').max(120),
  rcOuNif: z.string().max(40).optional(),
  wilaya: z.enum(wilayasMajeures, {
    errorMap: () => ({ message: 'Wilaya requise' }),
  }),
  fonction: z.string().min(2, 'Votre fonction').max(80),
  clientele: z.enum(distribClienteleValues).optional(),
  volumeAnnuelCible: z.enum(distribVolumeValues).optional(),
  typePartenariat: z.enum(distribTypePartenariatValues, {
    errorMap: () => ({ message: 'Choisissez un type de partenariat' }),
  }),
  showroomExistant: z.enum(['oui', 'non', 'projet']).optional(),
});

export type LeadProDistributeurInput = z.infer<typeof leadProDistributeurSchema>;
