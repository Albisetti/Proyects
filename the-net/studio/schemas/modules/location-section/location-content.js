import { Article, Square } from 'phosphor-react'

export default {
  title: 'LOCATION - Location Content',
  name: 'locationContent',
  type: 'object',
  icon: Article,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'First Description',
      name: 'firstDescription',
      type: 'text'
    },
    {
      title: 'Map Button Text',
      name: 'mapButtonText',
      type: 'string'
    },
    {
      title: 'Second Description',
      name: 'secondDescription',
      type: 'text'
    },
    {
      title: 'Waterfront Button Text',
      name: 'waterfrontButtonText',
      type: 'string'
    },
    {
      title: 'Location Map Settings',
      name: 'mapSettings',
      type: 'object',
      options: { collapsible: true },
      fields: [
        {
          title: 'Center Latitude',
          name: 'centerLat',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          title: 'Center Longitude',
          name: 'centerLng',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          title: 'Starting Zoom Level',
          name: 'zoomLevel',
          type: 'number',
          initialValue: 16,
          validation: Rule => Rule.min(1)
        }
      ]
    },
    {
      title: 'Waterfront Section',
      name: 'waterfrontSection',
      type: 'object',
      options: { collapsible: true },
      fields: [
        {
          title: 'Description',
          name: 'description',
          type: 'text'
        },
        {
          title: 'Slide Images',
          name: 'slideImages',
          type: 'array',
          of: [
            {
              title: 'Slide',
              name: 'slide',
              type: 'object',
              icon: Square,
              fields: [
                {
                  title: 'Image Title',
                  name: 'imageTitle',
                  type: 'string'
                },
                {
                  title: 'Slide Image',
                  name: 'image',
                  type: 'image'
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
        title: 'Location Content'
      }
    }
  }
}
