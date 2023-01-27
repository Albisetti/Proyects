import { Funnel } from 'phosphor-react'

export default {
  title: 'Tasting & Training List with Filters',
  name: 'tastingTrainingList',
  type: 'object',
  icon: Funnel,
  fields: [
    {
      title: 'Heading',
      name: 'heading',
      type: 'string',
      initialValue: 'Learn Our Family Recipe'
    },
    {
      title: 'Paragraph (Mobile)',
      name: 'paragraphMobile',
      type: 'simplePortableText'
    },
    {
      title: 'Paragraph (Desktop)',
      name: 'paragraphDesktop',
      type: 'simplePortableText'
    },
    {
      title: 'Category Filters',
      name: 'categoryFilters',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {
              type: 'tastingTrainingCategory'
            }
          ]
        }
      ]
    },
    {
      title: 'Items',
      name: 'items',
      description:
        'List the items in the order in which they will appear in their respective categories.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {
              type: 'tastingTrainingItem'
            }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      filters: 'categoryFilters.length'
    },
    prepare({ filters }) {
      return {
        title: 'Tasting & Training List with Filters',
        subtitle: `Filtering ${filters || 'no'} categor${
          filters === 1 ? 'y' : 'ies'
        }`
      }
    }
  }
}
