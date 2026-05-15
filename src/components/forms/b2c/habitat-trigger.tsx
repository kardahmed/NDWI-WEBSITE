'use client';

import { FormModalTrigger } from '../_shared/form-modal';
import { DevisPorteForm } from './devis-porte';
import { DevisCuisineForm } from './devis-cuisine';
import { DevisChambreForm } from './devis-chambre';
import { DevisDressingForm } from './devis-dressing';
import { DevisBureauForm } from './devis-bureau';
import { DevisSalonForm } from './devis-salon';
import { DevisHotellerieB2CForm } from './devis-hotellerie';
import { ContactGeneralForm } from '../contact-general';

export type HabitatUnivers =
  | 'portes'
  | 'cuisines'
  | 'chambres'
  | 'dressing'
  | 'bureaux'
  | 'salons'
  | 'hotellerie'
  | 'workspace'
  | 'autre';

interface Props {
  univers: HabitatUnivers;
  productSlug?: string;
  sourcePage: string;
  label: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

/**
 * Sélectionne le formulaire B2C dédié à la catégorie habitat.
 * `workspace` est traité comme `bureaux` (alias historique).
 * `autre` retombe sur le formulaire contact général.
 */
export function HabitatTrigger({ univers, productSlug, sourcePage, label, variant, className }: Props) {
  return (
    <FormModalTrigger label={label} variant={variant} className={className}>
      {univers === 'portes' && <DevisPorteForm productSlug={productSlug} sourcePage={sourcePage} />}
      {univers === 'cuisines' && <DevisCuisineForm productSlug={productSlug} sourcePage={sourcePage} />}
      {univers === 'chambres' && <DevisChambreForm productSlug={productSlug} sourcePage={sourcePage} />}
      {univers === 'dressing' && <DevisDressingForm productSlug={productSlug} sourcePage={sourcePage} />}
      {(univers === 'bureaux' || univers === 'workspace') && <DevisBureauForm productSlug={productSlug} sourcePage={sourcePage} />}
      {univers === 'salons' && <DevisSalonForm productSlug={productSlug} sourcePage={sourcePage} />}
      {univers === 'hotellerie' && <DevisHotellerieB2CForm productSlug={productSlug} sourcePage={sourcePage} />}
      {univers === 'autre' && <ContactGeneralForm sourcePage={sourcePage} />}
    </FormModalTrigger>
  );
}
