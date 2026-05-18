import { z } from 'zod';
import { leadCommonSchema } from './lead-common';

/**
 * Lead spécialisé pour les demandes de devis émises depuis le configurateur 3D.
 * Le payload combine les coordonnées client + un snapshot complet de la
 * configuration choisie (modèle, finition, poignée, dimensions, options) +
 * un screenshot dataURL optionnel.
 *
 * Côté Edge Function Supabase, le champ `configuration` est stocké dans
 * `specific_data` pour analyse commerciale et import CRM ultérieur.
 */

const dimensionsSchema = z.object({
  widthCm: z.number().int().positive().max(400),
  heightCm: z.number().int().positive().max(400),
  thicknessMm: z.number().int().positive().max(120).optional(),
});

const doorConfigSnapshotSchema = z.object({
  modelSlug: z.string().min(1).max(80),
  modelName: z.string().max(120).optional(),
  finishSlug: z.string().min(1).max(80),
  finishName: z.string().max(120).optional(),
  handleSlug: z.string().max(80).optional(),
  handleName: z.string().max(120).optional(),
  hingeSide: z.enum(['left', 'right']).optional(),
  openingDirection: z.enum(['inward', 'outward']).optional(),
  hasGlass: z.boolean().optional(),
  hasLock: z.boolean().optional(),
  dimensions: dimensionsSchema,
  accessories: z.array(z.string()).optional(),
  estimatedLeadTime: z.string().max(120).optional(),
  configuratorShareUrl: z.string().url().optional(),
  screenshotDataUrl: z.string().optional(),
});

export type DoorConfigSnapshot = z.infer<typeof doorConfigSnapshotSchema>;

export const leadDevisConfigPorteSchema = leadCommonSchema.extend({
  city: z.string().min(2, 'Ville requise').max(60),
  preferredContact: z.enum(['phone', 'whatsapp', 'email']).optional(),
  configuration: doorConfigSnapshotSchema,
});

export type LeadDevisConfigPorteInput = z.infer<typeof leadDevisConfigPorteSchema>;
