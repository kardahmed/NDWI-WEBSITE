import { defineType, defineField } from 'sanity';

/**
 * Accessoires modulaires applicables aux portes configurables :
 * vitrage, serrure, paumelles, encadrement, plinthe, etc.
 *
 * Chaque accessoire peut être référencé par un ou plusieurs `door` (champ
 * compatibleAccessories) pour qu'il apparaisse dans le configurateur de cette porte.
 */
export const accessorySchema = defineType({
  name: 'accessory',
  title: 'Accessoires (vitrage, serrure, etc.)',
  type: 'document',
  groups: [
    { name: 'main', title: 'Principal' },
    { name: 'visual', title: 'Visuel' },
    { name: 'tech', title: 'Paramètres 3D' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nom (FR)',
      type: 'string',
      group: 'main',
      description: 'Ex: Vitrage clair sablé, Serrure magnétique, Paumelles invisibles',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'nameAr',
      title: 'Nom (AR)',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'slug',
      title: 'Slug technique',
      type: 'slug',
      group: 'main',
      description: 'Ex: glass-sandblasted, lock-magnetic, hinges-invisible',
      options: { source: 'name', maxLength: 60 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type d\'accessoire',
      type: 'string',
      group: 'main',
      description: 'Détermine la section du configurateur où il apparaît.',
      options: {
        list: [
          { title: 'Vitrage', value: 'glass' },
          { title: 'Serrure', value: 'lock' },
          { title: 'Paumelles (charnières)', value: 'hinges' },
          { title: 'Butée de porte', value: 'stopper' },
          { title: 'Cache-paumelle', value: 'hinge-cover' },
          { title: 'Encadrement / chambranle', value: 'frame' },
          { title: 'Plinthe', value: 'plinth' },
          { title: 'Autre', value: 'other' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description courte (FR)',
      type: 'string',
      group: 'main',
      description: 'Ex: "Verre trempé 6mm sablé, transparence 60%"',
    }),
    defineField({
      name: 'descriptionAr',
      title: 'Description courte (AR)',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Miniature catalogue',
      type: 'image',
      group: 'visual',
      description: 'Pastille affichée dans le sélecteur (200×200 idéal).',
      options: { hotspot: false },
    }),
    defineField({
      name: 'baseColor',
      title: 'Couleur de base (hex)',
      type: 'string',
      group: 'visual',
      description: 'Hex code pour rendu 3D. Glass clair = #FFFFFF, sablé = #DDDDDD.',
      validation: (R) => R.regex(/^#[0-9a-fA-F]{6}$/).warning('Format attendu : #RRGGBB'),
    }),
    defineField({
      name: 'opacity',
      title: 'Opacité (0–1, vitrage uniquement)',
      type: 'number',
      group: 'tech',
      description: 'Vitrage clair ≈ 0.15, sablé ≈ 0.5, fumé ≈ 0.75.',
      validation: (R) => R.min(0).max(1),
      initialValue: 1,
    }),
    defineField({
      name: 'roughness',
      title: 'Rugosité PBR',
      type: 'number',
      group: 'tech',
      description: 'Vitrage clair = 0.05, sablé = 0.6, métal = 0.2.',
      validation: (R) => R.min(0).max(1),
      initialValue: 0.5,
    }),
    defineField({
      name: 'metallic',
      title: 'Métallicité PBR',
      type: 'number',
      group: 'tech',
      validation: (R) => R.min(0).max(1),
      initialValue: 0,
    }),
    defineField({
      name: 'glbFile',
      title: 'Modèle 3D (GLB, optionnel)',
      type: 'file',
      group: 'tech',
      description: 'Pour serrures/poignées spéciales nécessitant un mesh dédié.',
      options: { accept: '.glb,.gltf' },
    }),
    defineField({
      name: 'priceAdjustment',
      title: 'Supplément prix (DZD, optionnel)',
      type: 'number',
      group: 'main',
      description: 'Coût additionnel si cet accessoire est sélectionné (laisser vide si neutre).',
    }),
    defineField({
      name: 'order',
      title: "Ordre d'affichage",
      type: 'number',
      group: 'main',
      initialValue: 100,
    }),
    defineField({
      name: 'published',
      title: 'Publié',
      type: 'boolean',
      group: 'main',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'type', media: 'thumbnail' },
  },
  orderings: [
    {
      title: 'Type + ordre',
      name: 'typeOrder',
      by: [
        { field: 'type', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
});
