import { TextT } from 'phosphor-react'

export default {
  title: 'Rich Text',
  name: 'richText',
  type: 'object',
  icon: TextT,
  fields: [
    {
      title: 'Content',
      name: 'content',
      type: 'complexPortableText',
    },
    {
      title: 'Content Alignment',
      name: 'contentAlignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'text-left' },
          { title: 'Center', value: 'text-center' },
          { title: 'Right', value: 'text-right' },
        ],
      },
      initialValue: 'text-left',
    },
    {
      title: 'Anchor',
      name: 'anchor',
      type: 'string',
      description: 'Use for linking to this section.',
    },
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({ title }) {
      return {
        title: 'Rich Text',
        subtitle: title,
      }
    },
  },
}
