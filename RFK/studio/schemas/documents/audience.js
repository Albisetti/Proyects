import React from 'react'
import { UsersFour } from 'phosphor-react'
import customImage from '../../../studio/lib/custom-image'

export default {
  title: 'Audience',
  name: 'audience',
  type: 'document',
  icon: () => <UsersFour />,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    customImage({
      title: 'Photo',
      name: 'photo'
    }),
    { title: 'Description', name: 'description', type: 'simplePortableText' }
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title = 'Untitled' }) {
      return {
        title,
      }
    }
  }
}
