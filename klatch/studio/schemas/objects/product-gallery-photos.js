import { Stack } from 'phosphor-react';
import customImage from '../../lib/custom-image';

export default {
  title: 'Gallery',
  name: 'productGalleryPhotos',
  type: 'object',
  icon: Stack,
  fields: [
    {
      title: 'Gallery Photo(s)',
      name: 'photos',
      type: 'array',
      of: [customImage({
        fields:[{
          title: 'Which Variants is this for?',
          name: 'forOption',
          type: 'string',
          options: {
            list: [{ title: 'All', value: '' }],
            from: 'options',
            fromData: { title: 'name' },
            joinWith: 'values'
          }
        }]
      })],
      options: {
        layout: 'grid',
      }
    },
    {
      title: 'Shopify Photo(s)',
      name: 'shopifyPhotos',
      type: 'array',
      of: [
          {
            title: 'Shopify URL',
            type: 'object',
            fields: [{
              type: 'url',
              name: 'url',
              title: 'Shopify URL'
            },
            {
              type: 'array',
              name: 'variants',
              title: 'For Variants:',
              of: [{ type: 'number'}]}
          ]
        },
      ],
      options: {
        layout: 'grid',
      },
      preview: {
        select: {
          image: "shopifyPhotos"
        },
        prepare({image}) {
          const [url] = image || [];
          return {
            title: 'Shopify Image',
            media: url || ''
          }
        }
      }
    }
  ],
  preview: {
    select: {
      photos: 'photos',
      sphotos: 'shopifyPhotos',
    },
    prepare({ photos, sphotos, forOption }) {
      
      
      return {
        title:  sphotos?.length > 0 ? 'Shopify Photos' : 'All Variants',
        media: photos
          ? photos[0] 
          : sphotos 
            ? sphotos[0]
            : null
      }
    }
  }
}
