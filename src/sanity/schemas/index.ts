import { localeString, localeText, localeRichText } from './localeString';
import { doorSchema } from './door';
import { realisationSchema } from './realisation';
import { showroomSchema } from './showroom';
import { blogPostSchema } from './blogPost';
import { productSchema } from './product';
import { finitionSchema } from './finition';
import { door3DModelSchema } from './door3DModel';
import { handle3DSchema } from './handle3D';
import { accessorySchema } from './accessory';
import { ndoProductSchema } from './ndoProduct';
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
  ndoProductSchema,
  realisationSchema,
  showroomSchema,
  blogPostSchema,
  // 3D / Configurator (héritage — pour usage futur 3D)
  finitionSchema,
  door3DModelSchema,
  handle3DSchema,
  accessorySchema,
  // Options catalogue NDWi (configurateur catalog-driven)
  revetementSchema,
  poigneeSchema,
  serrureSchema,
  vitrageSchema,
  remplissageSchema,
];
