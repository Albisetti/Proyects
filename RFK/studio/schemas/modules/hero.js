import { Star } from 'phosphor-react'

export default {
  title: 'Hero',
  name: 'hero',
  type: 'object',
  icon: Star,
  fields: [
    {
      title: 'Top Navbar Spacing',
      name: 'topNavSpace',
      description:
        'Adds some space at the top of the hero to account for a transparent navbar',
      type: 'boolean',
      initialValue: false
    },
    {
      title: 'Title',
      name: 'title',
      type: 'text'
    },
    {
      title: 'Subtitle',
      name: 'subtitle',
      type: 'text'
    },
    {
      title: 'Content',
      name: 'content',
      type: 'text'
    },
    {
      name: 'cta',
      type: 'cta',
      title: 'Main CTA Button',
      description: 'Expand to see more options',
      validation: Rule => Rule.required()
    },
    {
      title: 'Right Image',
      name: 'rightImg',
      type: 'image',
      description: 'Right Shape Image',
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      photo: 'rightImg',
      subtitle: 'subtitle'
    },
    prepare({ photo, subtitle }) {
      return {
        title: 'Hero',
        subtitle: subtitle,
        media: photo
      }
    }
  }
}
