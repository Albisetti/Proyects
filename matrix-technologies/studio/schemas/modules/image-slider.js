import { ImageSquare } from 'phosphor-react'

export default {
  title: 'Image Slider',
  name: 'imageSlider',
  type: 'object',
  icon: ImageSquare,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'text',
      rows: 2,
    },
    {
      title: 'Slides',
      name: 'slides',
      type: 'array',
      of: [
        {
          title: 'Slide',
          name: 'slide',
          type: 'object',
          fields: [{ title: 'Image', name: 'image', type: 'image' }],
          validation: (Rule) => Rule.required(),
          preview: {
            select: {
              media: 'image',
            },
            prepare({ media }) {
              return {
                title: 'Slide',
                media,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
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
      media: 'slides.0.image',
    },
    prepare({ media }) {
      return {
        title: 'Image Slider',
        subtitle: 'Displays an image slider.',
        media,
      }
    },
  },
}
