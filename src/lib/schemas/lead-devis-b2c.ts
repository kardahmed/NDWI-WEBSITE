import { z } from 'zod';
import { leadCommonSchema } from './lead-common';

export const projectContextValues = ['construction', 'renovation', 'amenagement-neuf'] as const;
export const surfaceValues = ['lt15', '15-30', '30-60', '60+'] as const;
export const delaiValues = ['immediat', '1mois', '3mois', '6mois', 'reflexion'] as const;
export const budgetValuesB2C = ['lt300k', '300-800k', '800k-2m', '2-5m', '5m+', 'unknown'] as const;

// ─── Cuisine ──────────────────────────────────────────────────────────────────
export const cuisineFormeValues = ['lineaire', 'L', 'U', 'ilot', 'parallele'] as const;
export const cuisineFinitionValues = ['bois', 'laque', 'inox', 'mineral', 'mixte'] as const;

export const leadDevisCuisineSchema = leadCommonSchema.extend({
  productSlug: z.string().optional(),
  contexte: z.enum(projectContextValues).optional(),
  surface: z.enum(surfaceValues, {
    errorMap: () => ({ message: 'Précisez la surface (m²)' }),
  }),
  forme: z.enum(cuisineFormeValues).optional(),
  finition: z.enum(cuisineFinitionValues).optional(),
  electromenager: z.boolean().optional(),
  delai: z.enum(delaiValues).optional(),
  budget: z.enum(budgetValuesB2C).optional(),
  city: z.string().min(2, 'Ville requise').max(60),
});
export type LeadDevisCuisineInput = z.infer<typeof leadDevisCuisineSchema>;

// ─── Chambre ──────────────────────────────────────────────────────────────────
export const chambrePieceValues = ['maitre', 'enfant', 'adulte-secondaire', 'invites'] as const;
export const chambrePackValues = ['lit-seul', 'lit-chevet', 'pack-complet', 'sur-mesure'] as const;

export const leadDevisChambreSchema = leadCommonSchema.extend({
  productSlug: z.string().optional(),
  piece: z.enum(chambrePieceValues, {
    errorMap: () => ({ message: 'Précisez le type de pièce' }),
  }),
  pack: z.enum(chambrePackValues).optional(),
  surface: z.enum(surfaceValues).optional(),
  delai: z.enum(delaiValues).optional(),
  city: z.string().min(2).max(60),
});
export type LeadDevisChambreInput = z.infer<typeof leadDevisChambreSchema>;

// ─── Dressing ─────────────────────────────────────────────────────────────────
export const dressingTypeValues = ['ouvert', 'ferme', 'walk-in'] as const;
export const dressingNiveauValues = ['standard', 'sur-mesure', 'premium'] as const;

export const leadDevisDressingSchema = leadCommonSchema.extend({
  productSlug: z.string().optional(),
  type: z.enum(dressingTypeValues, {
    errorMap: () => ({ message: 'Précisez le type de dressing' }),
  }),
  niveau: z.enum(dressingNiveauValues).optional(),
  surface: z.enum(surfaceValues).optional(),
  delai: z.enum(delaiValues).optional(),
  city: z.string().min(2).max(60),
});
export type LeadDevisDressingInput = z.infer<typeof leadDevisDressingSchema>;

// ─── Bureau ───────────────────────────────────────────────────────────────────
export const bureauTypeValues = ['direction', 'open-space', 'reunion', 'reception', 'mixte'] as const;
export const bureauPostesValues = ['1-5', '5-15', '15-40', '40-100', '100+'] as const;

export const leadDevisBureauSchema = leadCommonSchema.extend({
  productSlug: z.string().optional(),
  type: z.enum(bureauTypeValues, {
    errorMap: () => ({ message: 'Type d\'aménagement requis' }),
  }),
  nbPostes: z.enum(bureauPostesValues, {
    errorMap: () => ({ message: 'Nombre de postes requis' }),
  }),
  surface: z.enum(surfaceValues).optional(),
  planDispo: z.boolean().optional(),
  delai: z.enum(delaiValues).optional(),
  city: z.string().min(2).max(60),
});
export type LeadDevisBureauInput = z.infer<typeof leadDevisBureauSchema>;

// ─── Salon ────────────────────────────────────────────────────────────────────
export const salonTypeValues = ['canape', 'angle', 'modulable', 'salon-marocain'] as const;
export const salonStyleValues = ['contemporain', 'classique', 'oriental', 'mixte'] as const;

export const leadDevisSalonSchema = leadCommonSchema.extend({
  productSlug: z.string().optional(),
  type: z.enum(salonTypeValues, {
    errorMap: () => ({ message: 'Type de salon requis' }),
  }),
  style: z.enum(salonStyleValues).optional(),
  couleurDominante: z.string().max(60).optional(),
  delai: z.enum(delaiValues).optional(),
  city: z.string().min(2).max(60),
});
export type LeadDevisSalonInput = z.infer<typeof leadDevisSalonSchema>;

// ─── Hôtellerie B2C / Maison d'hôtes ──────────────────────────────────────────
export const hotellerieTypeValuesB2C = ['maison-hotes', 'gite', 'airbnb', 'residence-courte'] as const;
export const hotellerieChambresB2C = ['1-3', '4-8', '9-15'] as const;

export const leadDevisHotellerieB2CSchema = leadCommonSchema.extend({
  productSlug: z.string().optional(),
  type: z.enum(hotellerieTypeValuesB2C, {
    errorMap: () => ({ message: 'Type d\'hébergement requis' }),
  }),
  nbChambres: z.enum(hotellerieChambresB2C, {
    errorMap: () => ({ message: 'Nombre de chambres' }),
  }),
  delai: z.enum(delaiValues).optional(),
  city: z.string().min(2).max(60),
});
export type LeadDevisHotellerieB2CInput = z.infer<typeof leadDevisHotellerieB2CSchema>;
