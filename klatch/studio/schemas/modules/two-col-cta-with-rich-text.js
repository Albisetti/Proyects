import { Columns } from 'phosphor-react'

export default {
  title: 'Two Col CTA with Rich Text',
  name: 'twoColCtaWithRichText',
  type: 'object',
  icon: Columns,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'text',
      description: 'Text to display as title for the call-to-action.',
      rows: 2
    },
    {
      title: 'Title Size',
      name: 'titleSize',
      type: 'string',
      description: 'Size in which to display the title.',
      options: {
        list: [
          { title: 'H1', value: 'h1' },
          { title: 'H2', value: 'h2' }
        ]
      },
      layout: 'radio',
      direction: 'horizontal'
    },
    {
      title: 'Subtitle',
      name: 'subtitle',
      type: 'complexPortableText',
      description: 'Text to display as description for the call-to-action.'
    },
    {
      title: 'Subtitle Size',
      name: 'subtitleSize',
      type: 'string',
      description: 'Size in which to display the subtitle.',
      options: {
        list: [
          { title: 'Large', value: 'large' },
          { title: 'Regular', value: 'regular' }
        ]
      }
    },
    {
      title: 'CTA Button',
      name: 'cta',
      type: 'cta',
      description: 'Button to display for the call-to-action.'
    },
    {
      title: 'Block Flow',
      name: 'direction',
      type: 'string',
      options: {
        list: [
          {
            title: 'Left to Right',
            value: 'leftToRight'
          },
          {
            title: 'Right to Left',
            value: 'rightToLeft'
          }
        ]
      },
      layout: 'radio',
      direction: 'horizontal',
      initialValue: 'rightToLeft',
      validation: Rule => Rule.required()
    },
    {
      title: 'Image',
      name: 'image',
      type: 'image',
      description:
        'Image to display in the column opposite of the text (encapsulated in polaroid).'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Two Col CTA with Rich Text'
      }
    }
  }
}
