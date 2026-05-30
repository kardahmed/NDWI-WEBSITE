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
