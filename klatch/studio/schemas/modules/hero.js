import { Star } from 'phosphor-react'

export default {
  title: 'Hero',
  name: 'hero',
  type: 'object',
  icon: Star,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'text'
    },
    {
      title: 'Title Size',
      type: 'string',
      name: 'titleSize',
      options: {
        list: [
          {title: 'H1', value: 'h1'},
          {title: 'H2', value: 'h2'},
        ]
      }
    },
    {
      title: 'Subtitle',
      name: 'subtitle',
      type: 'text'
    },
    {
      title: 'Subtitle Size',
      type: 'string',
      name: 'subTitleSize',
      options: {
        list: [
          {title: 'Large', value: 'large'},
          {title: 'Regular', value: 'regular'},
        ]
      }
    },
    {
      name: 'cta',
      type: 'cta',
      title: 'Main CTA Button',
      description: 'Expand to see more options',
      validation: Rule => Rule.required()
    },
    {
      title: 'Left Image',
      name: 'leftImg',
      type: 'object',
      fields: [
        {title: 'Background Image', type: 'image', description: 'Family Image', name: 'firstImage'},
        {title: 'Image Caption', type: 'string', description: 'Family Image caption', name: 'imageCaption'},
      ],
      validation: Rule => Rule.required()
    },
    {
      title: 'Right Images',
      name: 'rightImg',
      type: 'object',
      fields: [
      { title: 'First Collage Image', type: 'image', description: 'Background Image', name: 'firstImage' },
      { title: 'Second Collage Image', type: 'image', description: 'Animal Image', name: 'secondImage' },
      { title: 'Third Collage Image', type: 'image', description: 'Coffee/Product Image', name: 'thirdImage' },
      { title: 'Fourth Collage Image', type: 'image', description: 'Beans Image', name: 'fourthImage' },
    ],
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      photo: 'photo',
      content: 'content.0.children'
    },
    prepare({ photo, content }) {
      return {
        title: 'Hero',
        subtitle: content && content[0]?.text,
        media: photo
      }
    }
  }
}
