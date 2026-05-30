import { defineType, defineField } from 'sanity';

export const serrureSchema = defineType({
  name: 'serrure',
  title: 'Serrure',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'localeString',
      description: 'Ex. Serrure normale, Serrure magnétique, Serrure multi-point',
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
      name: 'appliesTo',
      title: 'S’applique à',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Porte intérieure', value: 'porte-interieure' },
          { title: 'Porte d’entrée', value: 'porte-entree' },
          { title: 'Porte blindée', value: 'porte-blindee' },
        ],
      },
      description: 'Type(s) de porte pour lesquels cette serrure est proposée.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
      description: 'Une phrase courte décrivant la serrure (sécurité, confort, etc.).',
    }),
    defineField({
      name: 'image',
      title: 'Photo de la serrure (optionnel)',
      type: 'image',
      options: { hotspot: true },
      description: 'Photo HD sur fond neutre. Affichée dans le configurateur si présente.',
    }),
    defineField({
      name: 'priceSupplementDZD',
      title: 'Supplément de prix (DZD, optionnel)',
      type: 'number',
      description: 'Si cette serrure coûte en plus du prix de base de la porte. Laisser vide si incluse.',
      validation: (R) => R.min(0),
    }),
    defineField({
      name: 'order',
      title: 'Ordre d\'affichage',
      type: 'number',
      initialValue: 100,
    }),
  ],
  preview: { select: { title: 'name.fr' } },
});
