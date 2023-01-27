import { CirclesFour } from 'phosphor-react'

export default {
  title: 'Careers - Benefits Section',
  name: 'careersBenefitsSection',
  type: 'object',
  icon: CirclesFour,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Slider Images',
      name: 'sliderImages',
      type: 'array',
      of: [{ type: 'image' }]
    },
    {
      title: 'Benefit Items',
      name: 'items',
      type: 'array',
      of: [
        {
          title: 'Benefit Item',
          name: 'simple',
          type: 'object',
          fields: [
            {
              title: 'Icon Image',
              name: 'image',
              type: 'image',
              validation: Rule => Rule.required()
            },
            {
              title: 'Title First Line',
              name: 'titleFirst',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              title: 'Title Second Line',
              name: 'titleSecond',
              type: 'string'
            }
          ],
          preview: {
            select: {
              text: 'titleFirst',
              img: 'image'
            },
            prepare({ text, img }) {
              return {
                title: text,
                media: img
              }
            }
          }
        }
      ],
      validation: Rule => Rule.min(1).required()
    },
    {
      title: 'Apply Horizontal Padding to Items',
      name: 'itemsPadding',
      description:
        'Adds some left and right spacing to the whole items container.',
      type: 'boolean',
      initialValue: false
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Careers - Benefits Section'
      }
    }
  }
}
