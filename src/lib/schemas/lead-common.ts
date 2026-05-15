import { z } from 'zod';

export const algerianPhoneRegex = /^(\+213|00213|0)[\s.-]?[5-7]([\s.-]?\d){8}$/;

/**
 * Base commune à TOUS les formulaires : coordonnées + anti-spam + RGPD + métadonnées.
 * Chaque formulaire spécialisé étend ce socle avec ses propres champs métier.
 */
export const leadCommonSchema = z.object({
  // Coordonnées
  fullName: z.string().min(2, 'Nom requis').max(100),
  email: z.string().email('Email invalide').max(120),
  phone: z
    .string()
    .min(8, 'Téléphone trop court')
    .max(20)
    .regex(algerianPhoneRegex, 'Numéro algérien attendu (+213... ou 0...)'),
  message: z.string().max(2000).optional(),

  // Consentement RGPD obligatoire
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Acceptation requise' }),
  }),

  // Métadonnées (auto-remplies)
  sourcePage: z.string().optional(),
  locale: z.enum(['fr', 'ar']).default('fr'),

  // Honeypot anti-bot
  hp_field: z.string().optional().default(''),
});

export type LeadCommon = z.infer<typeof leadCommonSchema>;

/** Types de leads — discriminant pour routage côté backend et email. */
export const leadTypes = [
  'devis-porte',
  'devis-cuisine',
  'devis-chambre',
  'devis-dressing',
  'devis-bureau',
  'devis-salon',
  'devis-hotellerie',
  'pro-distributeur',
  'pro-hotelier',
  'pro-architecte',
  'pro-promoteur',
  'contact-general',
] as const;
export type LeadType = (typeof leadTypes)[number];

/** Wilayas principales — sélection ciblée Algérie pour la plupart des champs. */
export const wilayasMajeures = [
  'Alger',
  'Oran',
  'Constantine',
  'Annaba',
  'Sétif',
  'Blida',
  'Batna',
  'Tlemcen',
  'Béjaïa',
  'Tizi Ouzou',
  'Skikda',
  'Mostaganem',
  'Autre',
] as const;
