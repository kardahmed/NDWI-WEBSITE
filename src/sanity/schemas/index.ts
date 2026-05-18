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
  // 3D / Configurator
  finitionSchema,
  door3DModelSchema,
  handle3DSchema,
  accessorySchema,
];
