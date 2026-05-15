import { z } from 'zod';
import { leadCommonSchema } from './lead-common';

export const porteCategorieValues = ['interieure', 'blindee', 'technique', 'coulissante'] as const;
export const porteFinitionValues = ['bois', 'laque', 'placage', 'verre', 'mixte'] as const;
export const porteQuantiteValues = ['1', '2-5', '6-15', '16+'] as const;
export const porteDelaiValues = ['immediat', '1mois', '3mois', '6mois', 'reflexion'] as const;

export const leadDevisPorteSchema = leadCommonSchema.extend({
  productSlug: z.string().optional(),
  categorie: z.enum(porteCategorieValues, {
    errorMap: () => ({ message: 'Choisissez une catégorie' }),
  }),
  finition: z.enum(porteFinitionValues).optional(),
  quantite: z.enum(porteQuantiteValues, {
    errorMap: () => ({ message: 'Précisez la quantité' }),
  }),
  delai: z.enum(porteDelaiValues).optional(),
  dimensions: z.string().max(120).optional(),
  city: z.string().min(2, 'Ville requise').max(60),
});

export type LeadDevisPorteInput = z.infer<typeof leadDevisPorteSchema>;
