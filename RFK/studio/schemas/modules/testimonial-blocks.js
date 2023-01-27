import { Info, Quotes, Square } from 'phosphor-react'

export default {
  title: 'Testimonial Blocks',
  name: 'testimonialBlocks',
  type: 'object',
  icon: Quotes,
  fields: [
    {
      name: 'testimonialNote',
      type: 'note',
      options: {
        icon: Info,
        headline: 'Slider Mode',
        message:
          'If you have more than 3 testimonial items, the component will automatically change into a slider, where you can slide between the multiple testimonial blocks.'
      }
    },
    {
      title: 'Testimonials',
      name: 'items',
      type: 'array',
      of: [
        {
          title: 'Testimonial Block',
          name: 'simple',
          type: 'object',
          icon: Square,
          fields: [
            {
              title: 'Image',
              name: 'image',
              type: 'image'
            },
            {
              title: 'Content',
              name: 'content',
              type: 'text',
              validation: Rule => Rule.required()
            },
            {
              title: 'Quotee Name',
              name: 'quoteeName',
              type: 'string'
            },
            {
              title: 'Program Name',
              name: 'programName',
              type: 'string'
            }
          ],
          preview: {
            select: {
              name: 'quoteeName',
              img: 'image'
            },
            prepare({ name, img }) {
              return {
                title: 'Testimonial',
                subtitle: name,
                media: img
              }
            }
          }
        }
      ],
      validation: Rule => Rule.min(1).required()
    }
  ],
  preview: {
    select: {
      itemCount: 'items.length'
    },
    prepare({ itemCount }) {
      return {
        title: 'Testimonial Blocks',
        subtitle: `${itemCount} item${itemCount === 1 ? '' : 's'}`
      }
    }
  }
}
