import { Gift } from 'phosphor-react'

export default {
  title: 'Promotional',
  name: 'promotional',
  type: 'object',
  icon: Gift,
  fields: [
    {
      title:'Display',
      name:'display',
      type:'boolean'
    },
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
        {title: 'Polaroid Image', type: 'image', description: 'Polaroid Image', name: 'firstImage'},
        {title: 'Branch Image', type: 'image', description: 'Branch Image', name: 'secondImage'},
      ],
      validation: Rule => Rule.required()
    },
    {
      title: 'Right Images',
      name: 'rightImg',
      type: 'object',
      fields: [
      { title: 'First Collage Image', type: 'image', description: 'Right Branch Image', name: 'firstImage' },
      { title: 'Second Collage Image', type: 'image', description: 'Right Teddy Image', name: 'secondImage' },
      { title: 'Third Collage Image', type: 'image', description: 'Right Berry Image', name: 'thirdImage' },
    ],
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      photo: 'leftImg.firstImage',
      content: 'content.0.children'
    },
    prepare({ photo, content }) {
      return {
        title: 'Promotional',
        subtitle: content && content[0]?.text,
        media: photo
      }
    }
  }
}
