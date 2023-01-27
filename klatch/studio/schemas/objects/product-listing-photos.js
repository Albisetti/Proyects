import { Stack } from 'phosphor-react'

import customImage from '../../lib/custom-image'

export default {
  title: 'Listing Photos',
  name: 'productListingPhotos',
  type: 'object',
  icon: Stack,
  fields: [
    {
      title: 'Which Variants is this for?',
      name: 'forOption',
      type: 'string',
      options: {
        list: [{ title: 'All', value: '' }],
        from: 'options',
        fromData: { title: 'name' },
        joinWith: 'values'
      }
    },
    customImage({
      title: 'Thumbnail',
      name: 'listingPhoto'
    }),
    customImage({
      title: 'Thumbnail (hover)',
      name: 'listingPhotoHover'
    }),
    customImage({
      title: 'Background Image (optional)',
      name: 'backgroundImg'
    }),
    {
      title: 'Background Side Images',
      name: 'sideImageList',
      type: 'array',
      description:
        "Up to multiple side images to display behind the products' image, in configurable positions",
      of: [
        {
          title: 'Background Side Image',
          name: 'sideImage',
          type: 'object',
          fields: [
            customImage({
              title: 'Image',
              name: 'image'
            }),
            {
              title: 'Position',
              name: 'position',
              type: 'string',
              options: {
                list: [
                  { title: 'Center', value: 'center' },
                  { title: 'Top-Left', value: 'topLeft' },
                  { title: 'Top', value: 'top' },
                  { title: 'Top-Right', value: 'topRight' },
                  { title: 'Right', value: 'right' },
                  { title: 'Bottom-Right', value: 'bottomRight' },
                  { title: 'Bottom', value: 'bottom' },
                  { title: 'Bottom-Left', value: 'bottomLeft' },
                  { title: 'Left', value: 'left' }
                ]
              }
            }
          ]
        }
      ],
      hidden: ({ parent }) => {
        return !parent.backgroundImg
      }
    },
    {
      title: 'Text Annotation',
      name: 'textAnnotation',
      type: 'string',
      description:
        'Bit of text to display with an arrow pointing to the product, e.g. "Barista\'s Choice"'
    }
  ],
  preview: {
    select: {
      listingPhoto: 'listingPhoto',
      forOption: 'forOption'
    },
    prepare({ listingPhoto, forOption }) {
      const option = forOption ? forOption.split(':') : null
      return {
        title:
          option && option.length > 1
            ? `${option[0]}: ${option[1]}`
            : 'All Variants',
        media: listingPhoto ? listingPhoto : null
      }
    }
  }
}
