-- Migration : nouvelle architecture de formulaires (12 types de lead)
-- Ajoute lead_type étendu + colonnes jsonb pour stocker données communes/spécifiques.
-- À exécuter dans Supabase Dashboard > SQL Editor.

-- 1) Colonnes jsonb pour le nouveau format d'enveloppe
alter table public.leads
  add column if not exists common_data jsonb,
  add column if not exists specific_data jsonb,
  add column if not exists consent boolean;

-- 2) Index utiles pour le filtrage côté admin
create index if not exists leads_lead_type_idx on public.leads (lead_type);
create index if not exists leads_created_at_desc_idx on public.leads (created_at desc);

-- 3) Commentaires (documentation inline)
comment on column public.leads.lead_type is
  'Discriminant du formulaire : devis-porte, devis-cuisine, devis-chambre, devis-dressing, devis-bureau, devis-salon, devis-hotellerie, pro-distributeur, pro-hotelier, pro-architecte, pro-promoteur, contact-general, devis (legacy)';
comment on column public.leads.common_data is
  'Champs communs à tous les formulaires : fullName, email, phone, message, consent, sourcePage, locale';
comment on column public.leads.specific_data is
  'Champs spécifiques au lead_type (ex. categorie+quantite pour porte, nbChambres+etoiles pour hotelier, etc.)';
