import { Activity } from 'phosphor-react'

export default {
  title: 'Tasting & Training Item',
  name: 'tastingTrainingItem',
  type: 'document',
  icon: Activity,
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      title: 'Description',
      name: 'description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required()
    },
    {
      title: 'Category',
      name: 'category',
      type: 'reference',
      to: [{ type: 'tastingTrainingCategory' }],
      validation: Rule => Rule.required()
    },
    {
      title: 'Associated Page',
      name: 'page',
      type: 'reference',
      to: [{ type: 'page' }]
    },
    {
      title: 'Preview Image (Mobile)',
      name: 'imageMobile',
      type: 'image'
    },
    {
      title: 'Preview Image (Desktop)',
      name: 'imageDesktop',
      type: 'image'
    }
  ],
  preview: {
    select: {
      name: 'name',
      category: 'category.title'
    },
    prepare({ name = 'Untitled', category }) {
      return {
        title: name,
        subtitle: category
      }
    }
  }
}
