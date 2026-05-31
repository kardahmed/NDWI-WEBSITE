-- Migration : autoriser le lead_type 'newsletter' dans la contrainte CHECK.
-- Nécessaire pour les inscriptions newsletter (formulaire /inspiration).
-- À exécuter dans Supabase Dashboard > SQL Editor.
--
-- IMPORTANT : déployer aussi l'Edge Function mise à jour qui gère ce type :
--   supabase functions deploy submit-lead --project-ref zcqpzkppycauobhhccqu

alter table public.leads drop constraint if exists leads_lead_type_check;

alter table public.leads
  add constraint leads_lead_type_check
  check (lead_type in (
    -- B2C
    'devis-porte',
    'devis-cuisine',
    'devis-chambre',
    'devis-dressing',
    'devis-bureau',
    'devis-salon',
    'devis-hotellerie',
    -- Pro
    'pro-distributeur',
    'pro-hotelier',
    'pro-architecte',
    'pro-promoteur',
    -- Transverse
    'contact-general',
    'newsletter',
    -- Legacy (rétro-compat)
    'devis'
  ));
