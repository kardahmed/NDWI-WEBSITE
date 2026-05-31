-- Migration : durcissement de sécurité / hygiène sur public.leads.
-- À exécuter dans Supabase Dashboard > SQL Editor.
--
-- Contexte : la table a RLS activé avec une policy "no public access" (USING false),
-- et toutes les écritures passent par l'Edge Function en service_role. Les rôles
-- anon/authenticated n'ont donc aucun usage légitime de GRANTs sur cette table.

-- 1) Principe du moindre privilège : retirer les GRANTs larges sur anon/authenticated.
--    (Le service_role utilisé par l'Edge Function n'est PAS affecté.)
revoke all on table public.leads from anon, authenticated;

-- 2) Index dupliqué : leads_created_at_idx == leads_created_at_desc_idx
--    (tous deux btree(created_at desc)). On garde celui de la migration enveloppe.
drop index if exists public.leads_created_at_idx;
