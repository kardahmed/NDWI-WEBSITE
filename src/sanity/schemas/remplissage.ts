import { defineType, defineField } from 'sanity';

export const remplissageSchema = defineType({
  name: 'remplissage',
  title: 'Remplissage (intérieur du panneau)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'localeString',
      description: 'Ex. Nid d\'abeille, Tubulaire, Acier galvanisé blindé',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: (doc) => (doc as { name?: { fr?: string } }).name?.fr ?? '' },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
      description: 'Une phrase technique (ex. "Structure nid d\'abeille pour légèreté et isolation").',
    }),
    defineField({
      name: 'image',
      title: 'Photo coupe (optionnel)',
      type: 'image',
      options: { hotspot: true },
      description: 'Photo en coupe montrant la structure interne (ex. nid d\'abeille vu de côté).',
    }),
    defineField({
      name: 'order',
      title: 'Ordre',
      type: 'number',
      initialValue: 100,
    }),
  ],
  preview: { select: { title: 'name.fr' } },
});
