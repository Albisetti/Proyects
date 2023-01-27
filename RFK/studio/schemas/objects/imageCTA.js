import { Circle, Square } from 'phosphor-react'
import { FaClosedCaptioning } from 'react-icons/fa'
import { colors } from '../../../util/colors.js'

export default {
  title: 'Image CTA',
  name: 'imageCTA',
  type: 'object',
  icon: Square,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Description',
      name: 'description',
      type: 'text'
    },
    {
      title: 'CTA Link',
      name: 'link',
      type: 'link'
    },
    {
      title: 'White CTA',
      name: 'whiteCTA',
      type: 'boolean',
      initialValue: false
    },
    {
      title: 'Background Color',
      name: 'backgroundColor',
      type: 'string',
      options: colors
    },
    {
      title: 'Image',
      name: 'image',
      type: 'image'
    },
    {
      title: 'Image on the right ',
      name: 'imageOnTheRight',
      type: 'boolean',
      initialValue: false,
      description: 'Default value is on the left'
    },
    {
      title: 'Secondary Section',
      name: 'secondarySection',
      type: 'string',
      options: {
        list: [
          { title: 'Quote Slider', value: 'quoteSlides' },
          { title: 'Link List', value: 'linkList' },
          { title: 'None', value: 'none' }
        ]
      },
      initialValue: 'none'
    },
    {
      title: 'Quote Slides',
      name: 'quoteSlides',
      type: 'array',
      of: [
        {
          title: 'Slide',
          name: 'slide',
          type: 'object',
          icon: Circle,
          fields: [
            { title: 'Quote', name: 'quote', type: 'text' },
            { title: 'Author Title', name: 'authorTitle', type: 'string' },
            { title: 'Author', name: 'author', type: 'string' }
          ]
        }
      ],
      hidden: ({ parent }) => parent.secondarySection !== 'quoteSlides'
    },
    {
      title: 'Link list',
      name: 'linkList',
      type: 'object',
      fields: [
        {
          title: 'Title',
          name: 'title',
          type: 'string'
        },
        {
          title: 'Links Menu',
          name: 'menu',
          type: 'reference',
          to: [{ type: 'menu' }]
        },
        {
          title: 'Style',
          name: 'style',
          type: 'string',
          options: {
            list: [
              { title: 'Default', value: 'default' },
              { title: 'Small', value: 'small' }
            ]
          },
          initialValue: 'default'
        },
        {
          title: 'Arrows',
          name: 'arrows',
          type: 'boolean',
          initialValue: false,
          description: 'Bullet style the links with arrows as bullets'
        }
      ],
      hidden: ({ parent }) => parent.secondarySection !== 'linkList'
    }
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare({ title = 'Untitled' }) {
      return {
        title: 'Image CTA',
        subtitle: title
      }
    }
  }
}
