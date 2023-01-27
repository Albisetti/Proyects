import { Link, Star } from 'phosphor-react'

import customImage from '../../lib/custom-image'

export default {
  title: 'Our Story More Info',
  name: 'ourStoryMoreInfo',
  type: 'object',
  icon: Star,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Links',
      name: 'links',
      type: 'array',
      of: [
        {
          title: 'Info Link',
          name: 'infoLink',
          type: 'object',
          icon: Link,
          fields: [
            {
              title: 'Button Title',
              name: 'buttonTitle',
              type: 'string'
            },
            {
              title: 'Link Description',
              name: 'linkDescription',
              type: 'text'
            },
            {
              title: '"Read More" Link Target',
              name: 'linkTarget',
              type: 'url',
              description:
                'Destination link for the Read More button below the description'
            }
          ]
        }
      ]
    },
    customImage({
      title: 'Right Side Background Image',
      name: 'rightBGImage'
    })
  ],
  preview: {
    select: {
      sectionTitle: 'title'
    },
    prepare({ sectionTitle }) {
      return {
        title: 'Our Story More Info Section',
        subtitle: sectionTitle
      }
    }
  }
}
