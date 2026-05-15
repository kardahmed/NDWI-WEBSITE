'use client';

import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { FormModalTrigger } from '../_shared/form-modal';
import { DevenirDistributeurForm } from './devenir-distributeur';
import { ProjetHotelierForm } from './projet-hotelier';
import { PartenariatArchitecteForm } from './partenariat-architecte';
import { PromotionImmobiliereForm } from './promotion-immobiliere';

type AudienceSlug = 'architectes' | 'distributeurs' | 'hoteliers' | 'promoteurs';

interface Props {
  audienceSlug: AudienceSlug;
  sourcePage: string;
  label: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

/**
 * Sélectionne le formulaire dédié à chaque segment professionnel.
 * Chaque audience a un set de questions et un routage métier différents.
 */
export function ProAudienceTrigger({ audienceSlug, sourcePage, label, variant, className }: Props) {
  const locale = useLocale() as Locale;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = locale;

  return (
    <FormModalTrigger label={label} variant={variant} className={className}>
      {audienceSlug === 'distributeurs' && <DevenirDistributeurForm sourcePage={sourcePage} />}
      {audienceSlug === 'hoteliers' && <ProjetHotelierForm sourcePage={sourcePage} />}
      {audienceSlug === 'architectes' && <PartenariatArchitecteForm sourcePage={sourcePage} />}
      {audienceSlug === 'promoteurs' && <PromotionImmobiliereForm sourcePage={sourcePage} />}
    </FormModalTrigger>
  );
}
