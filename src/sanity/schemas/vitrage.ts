import { defineType, defineField } from 'sanity';

export const vitrageSchema = defineType({
  name: 'vitrage',
  title: 'Vitrage / Variante panneau',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom commercial',
      type: 'string',
      description: 'Ex. Porte pleine, mod. DMT, mod. AUTUNNO',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 60 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Plein (sans vitrage)', value: 'plein' },
          { title: 'Vitré standard', value: 'vitre-standard' },
          { title: 'Insert métal', value: 'insert-metal' },
          { title: 'Sur commande', value: 'vitre-sur-commande' },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'image',
      title: 'Visuel',
      type: 'image',
      options: { hotspot: true },
      description: 'Photo de face ou rendu de la variante panneau (porte pleine, insert métal, vitrage…). 600×800 portrait recommandé.',
    }),
    defineField({
      name: 'description',
      title: 'Description (optionnel)',
      type: 'localeText',
      description: 'Une phrase pour qualifier ce vitrage (ex. "3 inserts verticaux apportant luminosité").',
    }),
    defineField({
      name: 'priceSupplementDZD',
      title: 'Supplément de prix (DZD, optionnel)',
      type: 'number',
      description: 'Si ce vitrage coûte en plus (les vitrages sur commande sont souvent +). Laisser vide si inclus.',
      validation: (R) => R.min(0),
    }),
    defineField({
      name: 'order',
      title: 'Ordre',
      type: 'number',
      initialValue: 100,
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'category', media: 'image' } },
});
