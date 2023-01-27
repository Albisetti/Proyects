import React from 'react'
import { Info, ImageSquare } from 'phosphor-react'
import sanityClient from 'part:@sanity/base/client'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(sanityClient)

const urlFor = (source) => {
  return builder.image(source)
}

const Preview = ({ value }) => {
  if (!value) return null
  const { asset, alt, style, alignment } = value

  return (
    <>
      {asset && (
        <img
          src={urlFor(asset).width(900).height(630).url()}
          style={{
            marginTop: 0,
            width: '100%',
            height: '300px',
            objectFit: 'cover',
          }}
        />
      )}
      <p style={{ marginTop: 0, marginBottom: 0 }}>
        <ImageSquare /> <b>Style: </b>
        {style}
        {style === 'Inline' && (
          <>
            , <b>Alignment:</b> {alignment}
          </>
        )}
        <br />
        <Info />{' '}
        {!alt ? (
          'Missing alt text.'
        ) : (
          <>
            <b>Alt:</b> {alt}
          </>
        )}
      </p>
    </>
  )
}

export default {
  title: 'Photo',
  name: 'portableImage',
  type: 'image',
  icon: ImageSquare,
  fields: [
    {
      title: 'Style',
      name: 'style',
      type: 'string',
      options: {
        list: [
          { title: 'Block', value: 'block' },
          { title: 'Inline', value: 'inline' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'block',
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'Alignment',
      name: 'alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'left',
      hidden: ({ parent }) => parent.style !== 'inline',
    },
  ],
  preview: {
    select: {
      asset: 'asset',
      alt: 'asset.alt',
      style: 'style',
      alignment: 'alignment',
    },
    component: Preview,
  },
}
