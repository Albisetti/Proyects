import React from 'react'
import dynamic from 'next/dynamic'

const Grid = dynamic(() => import('./grid'))
const Hero = dynamic(() => import('./hero'))
const ProductHero = dynamic(() => import('./product-hero'))
const Collection = dynamic(() => import('./collection-grid'))
const AccordionSetsWithHeading = dynamic(() =>
  import('./accordion-sets-with-heading')
)
const ImageSlider = dynamic(() => import('./image-slider'))
const RichText = dynamic(() => import('./rich-text'))
const Video = dynamic(() => import('./video'))

export const Module = ({
  index,
  module,
  product,
  activeVariant,
  onVariantChange,
  collectionProducts,
}) => {
  const type = module._type

  switch (type) {
    case 'grid':
      return <Grid index={index} data={module} />
    case 'hero':
      return <Hero index={index} data={module} />
    case 'productHero':
      return (
        <ProductHero
          index={index}
          product={product}
          activeVariant={activeVariant}
          onVariantChange={onVariantChange}
        />
      )
    case 'collectionGrid':
      return (
        <Collection
          index={index}
          data={{ ...module, products: collectionProducts }}
        />
      )
    case 'accordionSetsWithHeading':
      return <AccordionSetsWithHeading index={index} data={module} />
    case 'imageSlider':
      return <ImageSlider index={index} data={module} />
    case 'richText':
      return <RichText index={index} data={module} />
    case 'video':
      return <Video index={index} data={module} />
    default:
      return null
  }
}
