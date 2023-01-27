import { UsersFour } from 'phosphor-react'

export default {
  title: 'Audience Grid',
  name: 'audienceGrid',
  type: 'object',
  icon: UsersFour,
  fields: [
    {
      title: 'Audiences',
      name: 'audiences',
      type: 'array',
      of: [
        {
            title: 'Audience',
            name: 'audience',
            type: 'reference',
            to: [{ type: 'audience' }],
          }
      ],
      validation: Rule => Rule.required()
    },
    {
      title: 'Background Image',
      name: 'backgroundImage',
      type: 'image',
    }
  ],
  preview: {
    select: {
      itemCount: 'audiences.length'
    },
    prepare({ itemCount }) {
      return {
        title: 'Audience Grid',
        subtitle: `${itemCount} audience${itemCount === 1 ? '' : 's'}`
      }
    }
  }
}
