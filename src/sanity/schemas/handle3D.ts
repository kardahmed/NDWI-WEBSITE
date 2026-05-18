import { defineType, defineField } from 'sanity';

export const handle3DSchema = defineType({
  name: 'handle3D',
  title: 'Poignées 3D',
  type: 'document',
  groups: [
    { name: 'main', title: 'Principal' },
    { name: 'visual', title: 'Visuel' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      group: 'main',
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
      title: 'Slug',
      type: 'slug',
      group: 'main',
      options: { source: 'name', maxLength: 60 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      group: 'main',
      options: {
        list: [
          { title: 'Classique droite', value: 'classic' },
          { title: 'Arrondie / courbe', value: 'curved' },
          { title: 'Bouton rond', value: 'knob' },
          { title: 'Pull moderne', value: 'pull' },
        ],
      },
    }),
    defineField({
      name: 'glbFile',
      title: 'Fichier GLB (3D)',
      type: 'file',
      group: 'visual',
      description: 'Modèle 3D de la poignée — chargé dynamiquement sur la porte sélectionnée.',
      options: { accept: '.glb,.gltf' },
    }),
    defineField({
      name: 'thumbnail',
      title: 'Aperçu image',
      type: 'image',
      group: 'visual',
      description: 'Image 2D affichée dans la liste du configurateur (fallback si pas de GLB).',
    }),
    defineField({
      name: 'baseColor',
      title: 'Couleur métal',
      type: 'string',
      group: 'visual',
      description: 'Hex pour teinter le matériau (chromé = #C0C0C0, doré = #D4AF37, noir mat = #1A1A1A).',
      initialValue: '#C0C0C0',
    }),
    defineField({
      name: 'metallic',
      title: 'Métallicité',
      type: 'number',
      group: 'visual',
      initialValue: 0.9,
      validation: (R) => R.min(0).max(1),
    }),
    defineField({
      name: 'roughness',
      title: 'Rugosité',
      type: 'number',
      group: 'visual',
      initialValue: 0.2,
      validation: (R) => R.min(0).max(1),
    }),
    defineField({
      name: 'compatibleDoors',
      title: 'Portes compatibles',
      type: 'array',
      group: 'main',
      of: [{ type: 'reference', to: [{ type: 'door' }] }],
      description:
        "Si renseigné, cette poignée n'apparaîtra que pour les portes sélectionnées. Laisser vide pour autoriser sur toutes les portes.",
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
    select: { title: 'name', subtitle: 'style', media: 'thumbnail' },
  },
});
