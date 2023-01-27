import React from 'react'

const Preview = ({ value }) => {
  if (!value) return null

  const { url } = value
  return (
    <img
      src={url}
      style={{
        width: '100%',
        height: 'auto',
        maxHeight: '300px',
        objectFit: 'contain'
      }}
    />
  )
}

export default ({ hasDisplayOptions = true, ...props } = {}) => {
  const crops = [
    { title: 'Original', value: 0 },
    { title: '1 : 1 (square)', value: 1 },
    { title: '5 : 7', value: 0.7142857143 },
    { title: '4 : 6', value: 0.6666666667 },
    { title: '16 : 9', value: 1.7777777778 }
  ]

  return {
    title: 'Photo',
    name: 'photo',
    type: 'image',
    options: {
      hotspot: true
    },
    fields: [
      ...(hasDisplayOptions
        ? [
            {
              title: 'Display Size (aspect ratio)',
              name: 'customRatio',
              type: 'number',
              options: {
                isHighlighted: true,
                list: crops
              },
              validation: Rule => {
                return Rule.custom((field, context) =>
                  'asset' in context.parent && field === undefined
                    ? 'Required!'
                    : true
                )
              },
              initialValue: 0
            }
          ]
        : []),
      {
        title: 'Alternative text',
        name: 'alt',
        type: 'string',
        description: 'Important for SEO and accessiblity.'
      }
    ],
    preview: {
      select: {
        url: 'asset.url',
        asset: 'asset',
        alt: 'asset.alt',
        customAlt: 'alt',
        customRatio: 'customRatio'
      },
      // prepare({ alt, customAlt, customRatio, asset }) {
      //   const crop = crops.find(crop => crop.value === customRatio)

      //   return {
      //     title: customAlt ?? alt ?? '(alt text missing)',
      //     subtitle: crop.title,
      //     media: asset
      //   }
      // },
      component: Preview
    },
    ...props
  }
}
