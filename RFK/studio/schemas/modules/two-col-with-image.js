import { Columns } from 'phosphor-react'

import customImage from '../../../studio/lib/custom-image'

export default {
  title: 'Two Columns with Image',
  name: 'twoColWithImage',
  type: 'object',
  icon: Columns,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Text to display as heading for the section'
    },
    {
      title: 'Left Column Text',
      name: 'textLeft',
      type: 'simplePortableText'
    },
    {
      title: 'Right Column Text',
      name: 'textRight',
      type: 'simplePortableText'
    },
    customImage({ title: 'Image', name: 'image' }),
    {
      title: 'Link',
      name: 'link',
      type: 'link'
    }
  ],
  preview: {
    select: {
      media: 'image'
    },
    prepare({ media }) {
      return {
        title: 'Two Columns with Image',
        media
      }
    }
  }
}
