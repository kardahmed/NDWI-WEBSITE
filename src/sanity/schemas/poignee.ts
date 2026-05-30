import { defineType, defineField } from 'sanity';

/**
 * Poignée — option globale partagée par les portes NDWi.
 * Documents référencés par Door.compatiblePoignees[].
 */
export const poigneeSchema = defineType({
  name: 'poignee',
  title: 'Poignée',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom commercial',
      type: 'string',
      description: 'Ex. NDWI Chromée, BASICA 01, Poignée porte d\'entrée',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'name', maxLength: 60 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type de porte cible',
      type: 'string',
      options: {
        list: [
          { title: 'Porte intérieure', value: 'porte-interieure' },
          { title: 'Porte d’entrée', value: 'porte-entree' },
          { title: 'Porte blindée', value: 'porte-blindee' },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'shape',
      title: 'Forme',
      type: 'string',
      options: {
        list: [
          { title: 'Carrée', value: 'carree' },
          { title: 'Courbe', value: 'courbe' },
          { title: 'Tubulaire', value: 'tubulaire' },
          { title: 'Barre verticale', value: 'barre' },
          { title: 'Bouton', value: 'bouton' },
        ],
      },
    }),
    defineField({
      name: 'finition',
      title: 'Finition métal',
      type: 'string',
      options: {
        list: [
          { title: 'Chrome', value: 'chrome' },
          { title: 'Inox', value: 'inox' },
          { title: 'Inox brossé', value: 'inox-brosse' },
          { title: 'Aluminium brossé', value: 'aluminium-brosse' },
          { title: 'Noir mat', value: 'noir-mat' },
        ],
      },
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'order',
      title: 'Ordre',
      type: 'number',
      initialValue: 100,
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'finition', media: 'image' } },
});
