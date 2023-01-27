import { Medal } from 'phosphor-react'

export default {
  title: 'Awards',
  name: 'awards',
  type: 'object',
  icon: Medal,
  fields: [
    {
      title: 'Title Line 1',
      name: 'title1',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      title: 'Title Line 2',
      name: 'title2',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
        title: 'Awards List',
        name: 'awardsList',
        type: 'array',
        of: [{ type: 'text' }],
        description: 'List of Awards'
    },
    {
      title: 'Awards Images',
      name: 'awardsImages',
      type: 'object',
      fields: [
        { title: 'Polaroid Image', type: 'image', name: 'polaroidImage' },
        { title: 'Medal Image', type: 'image', name: 'awardImage'},
        { title: 'Product Image', type: 'image', name: 'productImage'},
        { title: 'Annotation Image', type: 'image', name: 'annotationImage'},
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Awards',
      }
    }
  }
}
