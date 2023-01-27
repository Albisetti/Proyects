import React from 'react'
import { Code } from 'phosphor-react'

const Preview = ({ value }) => {
  const { code } = value
  const src = code?.match(/src="([^"]*)/)?.[1]
  return (
    <iframe
      src={src}
      width="100%"
      frameBorder="no"
      allowFullScreen
      loading="lazy"
      style={{ border: 0, aspectRatio: '16 / 9' }}
    />
  )
}

export default {
  title: 'Embed',
  name: 'embed',
  type: 'object',
  icon: Code,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'The title of the embedded content.'
    },
    {
      title: 'Code',
      name: 'code',
      type: 'text',
      description: 'The code for the embedded content.',
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'title',
      code: 'code'
    },
    component: Preview
  }
}
