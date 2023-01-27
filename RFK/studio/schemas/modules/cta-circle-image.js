import { ArrowCircleRight } from 'phosphor-react'

import customImage from '../../lib/custom-image'

export default {
  title: 'CTA with Circle Image',
  name: 'ctaCircle',
  type: 'object',
  icon: ArrowCircleRight,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Content',
      name: 'content',
      type: 'simplePortableText'
    },
    customImage({ title: 'Image', name: 'image' }),
    {
      title: 'Link',
      name: 'link',
      type: 'link'
    },
    {
      title: 'Background',
      name: 'background',
      description:
        'Activating this adds a background in which the content will fit',
      type: 'boolean'
    },
    {
      title: 'Larger Content Max Width',
      name: 'largerMaxWidth',
      type: 'boolean',
      initialValue: false
    }
  ],
  preview: {
    select: {
      title: 'title'
    }
  }
}
