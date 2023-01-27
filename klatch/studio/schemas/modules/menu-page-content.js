import { Coffee, Star, Tag } from 'phosphor-react'

import customImage from '../../lib/custom-image'

export default {
  title: 'Menu Page Content',
  name: 'menuPageContent',
  type: 'object',
  icon: Star,
  fieldsets: [
    {
      title: 'Left Button Settings',
      name: 'leftButtonSettings',
      options: {
        collapsible: true
      }
    },
    {
      title: 'Right Button Settings',
      name: 'rightButtonSettings',
      options: {
        collapsible: true
      }
    }
  ],
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Left Button Title',
      name: 'leftButtonTitle',
      type: 'string',
      fieldset: 'leftButtonSettings'
    },
    {
      title: 'Left Button Link',
      name: 'leftButtonLink',
      description: 'External link URL',
      type: 'url',
      fieldset: 'leftButtonSettings'
    },
    {
      title: 'Right Button Title',
      name: 'rightButtonTitle',
      type: 'string',
      fieldset: 'rightButtonSettings'
    },
    {
      title: 'Right Button Link',
      name: 'rightButtonLink',
      description: 'External link URL',
      type: 'url',
      fieldset: 'rightButtonSettings'
    },
    {
      title: 'Categories',
      name: 'categories',
      type: 'array',
      of: [
        {
          title: 'Category',
          name: 'category',
          type: 'object',
          icon: Tag,
          fields: [
            {
              title: 'Name',
              name: 'name',
              type: 'string'
            },
            {
              title: 'Filter Type',
              name: 'filter',
              description:
                'Optional. Not used if there are sub-categories (these have their own filter type each).',
              type: 'reference',
              to: [{ type: 'filter' }]
            },
            {
              title: 'Sub-categories',
              name: 'subCategories',
              type: 'array',
              of: [
                {
                  title: 'Sub-category',
                  name: 'subcategory',
                  type: 'object',
                  icon: Tag,
                  fields: [
                    {
                      title: 'Title',
                      name: 'title',
                      type: 'string',
                      validation: Rule => Rule.required()
                    },
                    {
                      title: 'Filter Type',
                      name: 'filter',
                      type: 'reference',
                      to: [{ type: 'filter' }]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'Menu Items',
      name: 'sampleCoffees',
      type: 'array',
      of: [
        {
          title: 'Item Group',
          name: 'itemGroup',
          type: 'object',
          fields: [
            {
              title: 'Title',
              name: 'title',
              type: 'string'
            },
            {
              title: 'Associated Filters',
              name: 'filters',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'filter' }] }]
            },
            {
              title: 'Items',
              name: 'items',
              type: 'array',
              of: [
                {
                  title: 'Menu Item',
                  name: 'sampleCoffee',
                  type: 'object',
                  icon: Coffee,
                  fields: [
                    {
                      title: 'Name',
                      name: 'name',
                      type: 'string'
                    },
                    customImage({
                      title: 'Image',
                      name: 'image'
                    })
                  ]
                }
              ]
            }
          ],
          preview: {
            select: {
              title: 'title',
              items: 'items.length'
            },
            prepare({ title, items }) {
              return {
                title: title,
                subtitle: `${items || 0} item${items === 1 ? '' : 's'}`
              }
            }
          }
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Menu Page Content'
      }
    }
  }
}
