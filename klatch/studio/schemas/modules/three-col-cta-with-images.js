import { NumberSquareThree, Diamond } from 'phosphor-react'

export default {
  title: 'Three Column CTA with Images',
  name: 'threeColCtaWithImages',
  type: 'object',
  icon: NumberSquareThree,
  fields: [
    {
      title: 'CTA with Image List',
      name: 'ctaWithImageList',
      type: 'array',
      of: [
        {
          title: 'CTA with Image',
          name: 'ctaWithImage',
          type: 'object',
          icon: Diamond,
          fields: [
            {
              title: 'Title',
              name: 'title',
              type: 'string',
              description: 'Text to display as a title within a diamond shape.',
              validation: Rule => Rule.required()
            },
            {
              title: 'Description',
              name: 'description',
              type: 'text',
              description:
                'Text to display as a description for the call-to-action.'
            },
            {
              title: 'CTA Title',
              name: 'ctaTitle',
              type: 'string',
              description:
                'Text to display as the title for the call-to-action button.',
              initialValue: 'View Details',
              validation: Rule => Rule.required()
            },
            {
              title: 'CTA Image',
              name: 'ctaImage',
              type: 'image',
              description:
                'Image to display when the call-to-action button is clicked.',
              validation: Rule => Rule.required()
            }
          ],
          preview: {
            select: {
              title: 'title'
            },
            prepare({ title = 'Untitled' }) {
              return {
                title
              }
            }
          }
        }
      ],
      validation: Rule =>
        Rule.required()
          .min(1)
          .max(3)
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Three Column CTA with Images'
      }
    }
  }
}
