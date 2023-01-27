import { ImageSquare } from 'phosphor-react'

import customImage from '../../lib/custom-image'

export default {
  title: 'Our Story Image & CTA',
  name: 'ourStoryImageCTA',
  type: 'object',
  icon: ImageSquare,
  fields: [
    {
      title: 'CTA Settings',
      name: 'cta',
      type: 'cta',
      description: 'Expand to see more options',
      validation: Rule => Rule.required()
    },
    {
      title: 'CTA Text Content',
      name: 'ctaText',
      type: 'text'
    },
    {
      title: 'CTA Button Text',
      name: 'ctaButtonText',
      type: 'string'
    },
    customImage({
      title: 'Left Bottom Image',
      name: 'leftBottomImage'
    }),
    customImage({
      title: 'Left Top Image',
      name: 'leftTopImage'
    })
  ],
  preview: {
    select: {
      ctaTitle: 'cta.title'
    },
    prepare({ ctaTitle }) {
      return {
        title: 'Our Story Image & CTA',
        subtitle: ctaTitle
      }
    }
  }
}
