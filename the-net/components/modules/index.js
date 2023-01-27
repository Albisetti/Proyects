import React from 'react'
import dynamic from 'next/dynamic'

const VerticalNavigation = dynamic(() => import('./global/vertical-navigation'))

const Grid = dynamic(() => import('./grid'))
const Hero = dynamic(() => import('./hero'))
const Marquee = dynamic(() => import('./marquee'))
const DividerPhoto = dynamic(() => import('./divider-photo'))
const ProductHero = dynamic(() => import('./product-hero'))
const Collection = dynamic(() => import('./collection-grid'))
const LinksList = dynamic(() => import('./global/links-list'))
const BuildingContent = dynamic(() =>
  import('./building-section/building-content')
)
const BuildingContainer = dynamic(() =>
  import('./building-section/building-container')
)
const BuildingInfo = dynamic(() => import('./building-section/building-info'))
const FloorContent = dynamic(() => import('./floor-section/floor-content'))
const FloorContainer = dynamic(() => import('./floor-section/floor-container'))
const FloorDetails = dynamic(() => import('./floor-section/floor-details'))
const Gallery = dynamic(() => import('./global/gallery'))
const GalleryModal = dynamic(() => import('./global/gallery-modal'))

const AmenitiesContent = dynamic(() =>
  import('./amenities-section/amenities-content')
)
const AmenitiesContainer = dynamic(() =>
  import('./amenities-section/amenities-container')
)
const LandingContainer = dynamic(() =>
  import('./landing-section/landing-container')
)
const LocationContent = dynamic(() =>
  import('./location-section/location-content')
)
const LocationContainer = dynamic(() =>
  import('./location-section/location-container')
)
const TeamContainer = dynamic(() => import('./team-section/team-container'))
const BrandVideo = dynamic(() => import('./building-section/brand-video'))

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
    case 'title':
      return <Title data={module}></Title>
    case 'grid':
      return <Grid index={index} data={module} />
    case 'hero':
      return <Hero index={index} data={module} />
    case 'marquee':
      return <Marquee index={index} data={module} />
    case 'dividerPhoto':
      return <DividerPhoto index={index} data={module} />
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
    case 'verticalNav':
      return <VerticalNavigation index={index} data={module} />
    case 'linksList':
      return <LinksList index={index} data={module} />
    case 'buildingContent':
      return <BuildingContent index={index} data={module} />
    case 'buildingContainer':
      return <BuildingContainer index={index} data={module} />
    case 'buildingInfo':
      return <BuildingInfo index={index} data={module} />
    case 'floorContent':
      return <FloorContent index={index} data={module} />
    case 'floorContainer':
      return <FloorContainer index={index} data={module} />
    case 'floorDetails':
      return <FloorDetails index={index} data={module} />
    case 'gallery':
      return <Gallery index={index} data={module} />
    case 'amenitiesContent':
      return <AmenitiesContent index={index} data={module} />
    case 'amenitiesContainer':
      return <AmenitiesContainer index={index} data={module} />
    case 'locationContent':
      return <LocationContent index={index} data={module} />
    case 'locationContainer':
      return <LocationContainer index={index} data={module} />
    case 'landingContainer':
      return <LandingContainer index={index} data={module} />
    case 'teamContainer':
      return <TeamContainer index={index} data={module} />
    case 'galleryModal':
      return <GalleryModal data={module} />
    case 'brandVideo':
      return <BrandVideo index={index} data={module} />
    default:
      return null
  }
}
