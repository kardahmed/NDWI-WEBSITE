import { localeString, localeText, localeRichText } from './localeString';
import { doorSchema } from './door';
import { realisationSchema } from './realisation';
import { showroomSchema } from './showroom';
import { blogPostSchema } from './blogPost';
import { productSchema } from './product';
import { revetementSchema } from './revetement';
import { poigneeSchema } from './poignee';
import { serrureSchema } from './serrure';
import { vitrageSchema } from './vitrage';
import { remplissageSchema } from './remplissage';

export const schemaTypes = [
  // Objets utilitaires
  localeString,
  localeText,
  localeRichText,
  // Documents catalogue
  doorSchema,
  productSchema,
  realisationSchema,
  showroomSchema,
  blogPostSchema,
  // Options catalogue NDWi (configurateur catalog-driven)
  revetementSchema,
  poigneeSchema,
  serrureSchema,
  vitrageSchema,
  remplissageSchema,
];
