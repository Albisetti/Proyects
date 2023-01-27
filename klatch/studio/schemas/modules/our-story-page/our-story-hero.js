import { Star } from 'phosphor-react'

import customImage from '../../../lib/custom-image'

export default {
  title: 'Our Story Hero',
  name: 'ourStoryHero',
  type: 'object',
  icon: Star,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'text'
    },
    customImage({
      title: 'Side Image',
      name: 'sideImg'
    }),
    {
      title: 'Frame Image Side Title',
      name: 'frameTitle',
      type: 'string'
    },
    {
      title: 'Frame Image Side Text',
      name: 'frameText',
      type: 'text'
    },
    customImage({
      title: 'Frame Image',
      name: 'frameImg',
      description: 'Image to go within the frame'
    })
  ],
  preview: {
    select: {
      heroTitle: 'title'
    },
    prepare({ heroTitle }) {
      return {
        title: 'Our Story Hero',
        subtitle: heroTitle
      }
    }
  }
}
