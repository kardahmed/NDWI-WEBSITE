-- Migration : élargir la contrainte CHECK sur leads.lead_type pour accepter les 12 nouveaux types.
-- L'ancienne contrainte n'autorisait que 'devis' (architecture mono-formulaire).
-- À exécuter dans Supabase Dashboard > SQL Editor.

-- 1) Drop l'ancienne contrainte si elle existe
alter table public.leads drop constraint if exists leads_lead_type_check;

-- 2) Recrée la contrainte avec la liste complète
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
    -- Legacy (rétro-compat)
    'devis'
  ));
