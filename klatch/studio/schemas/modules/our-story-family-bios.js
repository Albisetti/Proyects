import { Cards } from 'phosphor-react'

import customImage from '../../lib/custom-image'

export default {
  title: 'Our Story Family Bios',
  name: 'ourStoryFamilyBios',
  type: 'object',
  icon: Cards,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Members',
      name: 'members',
      type: 'array',
      of: [
        {
          title: 'Family Member',
          name: 'familyMember',
          type: 'object',
          fields: [
            customImage({
              title: 'Image',
              name: 'image'
            }),
            {
              title: 'Name',
              name: 'name',
              type: 'string'
            },
            {
              title: 'Description',
              name: 'description',
              type: 'text'
            }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      sectionTitle: 'title'
    },
    prepare({ sectionTitle }) {
      return {
        title: 'Our Story Family Bios',
        subtitle: sectionTitle
      }
    }
  }
}
