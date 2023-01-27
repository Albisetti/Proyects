import { Circle, Info } from 'phosphor-react'

export default {
  title: 'BUILDING - Building Info',
  name: 'buildingInfo',
  type: 'object',
  icon: Info,
  fields: [
    {
      title: 'Left Section',
      name: 'leftSection',
      type: 'object',
      fields: [
        {
          title: 'Title',
          name: 'title',
          type: 'text'
        },
        {
          title: 'Items',
          name: 'items',
          type: 'array',
          of: [{ type: 'string' }]
        },
        {
          title: 'Document',
          name: 'document',
          type: 'file'
        },
        { title: 'Background', name: 'background', type: 'image' }
      ]
    },
    {
      title: 'Right Section',
      name: 'rightSection',
      type: 'object',
      fields: [
        {
          title: 'Design Features',
          name: 'designFeatures',
          type: 'object',
          fields: [
            {
              title: 'Title',
              name: 'title',
              type: 'string'
            },
            {
              title: 'Features',
              name: 'features',
              type: 'array',
              of: [
                {
                  title: 'Feautre',
                  name: 'feature',
                  type: 'object',
                  icon: Circle,
                  fields: [
                    {
                      title: 'Number',
                      name: 'number',
                      type: 'string'
                    },
                    {
                      title: 'Unit',
                      name: 'unit',
                      type: 'string'
                    },
                    {
                      title: 'Subtitle',
                      name: 'subtitle',
                      type: 'string'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Sustainability',
          name: 'sustainability',
          type: 'object',
          fields: [
            {
              title: 'Title',
              name: 'title',
              type: 'string'
            },
            {
              title: 'Subtitle',
              name: 'subtitle',
              type: 'string'
            },
            {
              title: 'Images',
              name: 'images',
              type: 'array',
              of: [
                {
                  title: 'item',
                  name: 'item',
                  type: 'object',
                  fields: [
                    {
                      title: 'Image',
                      name: 'image',
                      type: 'image'
                    },
                    {
                      title: 'Epigraph',
                      name: 'epigraph',
                      type: 'string'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Building Info'
      }
    }
  }
}
