import { z } from 'zod';

// Accepte +213 555 535 106, +213555535106, 0555535106, 0555 535 106, etc.
export const algerianPhoneRegex = /^(\+213|00213|0)[\s.-]?[5-7]([\s.-]?\d){8}$/;

export const universValues = [
  'portes',
  'cuisines',
  'chambres',
  'dressing',
  'hotellerie',
  'workspace',
  'autre',
] as const;
export type Univers = (typeof universValues)[number];

export const leadSchema = z.object({
  // Étape 1 — projet (multi-sélection univers)
  univers: z
    .array(z.enum(universValues))
    .min(1, "Sélectionnez au moins un univers")
    .max(7),
  projectType: z.enum(['construction', 'renovation', 'amenagement', 'b2b']).optional(),
  city: z.string().min(2, 'Renseignez votre ville').max(60),
  timeline: z.enum(['immediat', '3mois', '6mois', '12mois', 'reflexion']).optional(),
  budgetRange: z.enum(['lt500k', '500-1m', '1-3m', '3-10m', 'gt10m', 'unknown']).optional(),
  /** Champ libre : produits spécifiques que le prospect a repérés (ex. "Tolga + Phoenix"). */
  productsOfInterest: z.string().max(500).optional(),

  // Étape 2 — coordonnées
  fullName: z.string().min(2, 'Nom requis').max(100),
  email: z.string().email('Email invalide').max(120),
  phone: z
    .string()
    .min(8, 'Téléphone trop court')
    .max(20)
    .regex(algerianPhoneRegex, 'Numéro algérien attendu (+213... ou 0...)'),
  message: z.string().max(2000).optional(),

  // Contexte (auto-rempli)
  productSlug: z.string().optional(),
  sourcePage: z.string().optional(),
  locale: z.enum(['fr', 'ar']).default('fr'),

  // Honeypot anti-spam
  hp_field: z.string().optional().default(''),
});

export type LeadInput = z.infer<typeof leadSchema>;
