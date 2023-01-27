import { SquareHalf } from 'phosphor-react'

export default {
  title: 'Full Background Image CTA',
  name: 'fullBackgroundImageCTA',
  type: 'object',
  icon: SquareHalf,
  fields: [
    {
      title: 'CTA Sections',
      name: 'sections',
      type: 'array',
      of: [
        {
          type: 'imageCTA'
        }
      ]
    }
  ],
  preview: {
    select: {
      itemCount: 'sections.length'
    },
    prepare({ itemCount }) {
      return {
        title: 'Full Background CTA',
        subtitle: `${itemCount} item${itemCount === 1 ? '' : 's'}`
      }
    }
  }
}
