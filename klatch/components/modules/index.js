import React from 'react'
import dynamic from 'next/dynamic'
import TwoColCTA from './two-col-cta/two-col-cta'
import Book from './book/book'
import RoastHero from './find-your-roast/roast-hero'

const Awards = dynamic(() => import('./awards/awards'))
const Grid = dynamic(() => import('./grid/grid'))
const Hero = dynamic(() => import('./hero/hero'))
const Promotion = dynamic(() => import('./promotion/promotion'))
const Marquee = dynamic(() => import('./marquee/marquee'))
const DividerPhoto = dynamic(() => import('./divider-photo/divider-photo'))
const ProductHero = dynamic(() => import('./product-hero/product-hero'))
const ProductsList = dynamic(() => import('./products-list/products-list'))
const Collection = dynamic(() => import('./collection-grid/collection-grid'))
const StayInTouch = dynamic(() => import('./stay-in-touch/stay-in-touch'))
const TagsSlider = dynamic(() => import('./tags-slider/tags-slider'))
const ProductsSlider = dynamic(() =>
  import('./products-slider/products-slider')
)
const SubscriptionsPageContent = dynamic(() =>
  import('./subscriptions-page-content/subscriptions-page-content')
)
const LocationGrid = dynamic(() => import('./location-grid/location-grid'))
const AwardsHero = dynamic(() => import('./awards-hero/awards-hero'))
const TwoColWithImagesAndText = dynamic(() =>
  import('./two-col-with-images-and-text/two-col-with-images-and-text')
)
const BrewGuideGrid = dynamic(() => import('./brew-guide-grid/brew-guide-grid'))
const TwoColTextAndClipboard = dynamic(() =>
  import('./two-col-text-and-clipboard/two-col-text-and-clipboard')
)
const OurStoryFamilyBios = dynamic(() =>
  import('./our-story-family-bios/our-story-family-bios')
)
const OurStoryNotesSection = dynamic(() =>
  import('./our-story-notes-section/our-story-notes-section')
)
const OurStoryHero = dynamic(() => import('./our-story-hero/our-story-hero'))
const TrainingList = dynamic(() => import('./training-list/training-list'))
const VideoProjectorModule = dynamic(() =>
  import('./video-projector-module/video-projector')
)
const OurStoryMoreInfo = dynamic(() =>
  import('./our-story-more-info/our-story-more-info')
)
const OurStoryImageCTA = dynamic(() =>
  import('./our-story-image-cta/our-story-image-cta')
)
const WholesaleHeading = dynamic(() =>
  import('./wholesale-heading/wholesale-heading')
)
const WholesaleBackgroundWithCards = dynamic(() =>
  import('./wholesale-background-with-cards/wholesale-background-with-cards')
)

const CampusInformation = dynamic(() =>
  import('./campus-information/campus-information')
)
const InstructorList = dynamic(() =>
  import('./instructor-list/instructor-list')
)
const WholesaleFirstSection = dynamic(() =>
  import('./wholesale-first-section/wholesale-first-section')
)
const ShopCrowdPleasers = dynamic(() =>
  import('./shop-crowd-pleasers/shop-crowd-pleasers')
)
const ShopCollectionDisplay = dynamic(() =>
  import('./shop-collection-display/shop-collection-display')
)
const WholesaleTwoColWithCtaAndClipboard = dynamic(() =>
  import(
    './wholesale-two-col-with-cta-and-clipboard/wholesale-two-col-with-cta-and-clipboard'
  )
)
const TwoColCtaWithRichText = dynamic(() =>
  import('./two-col-cta-with-rich-text/two-col-cta-with-rich-text')
)
const ThreeColCtaWithImages = dynamic(() =>
  import('./three-col-cta-with-images/three-col-cta-with-images')
)
const CareersPageContent = dynamic(() =>
  import('./careers-page-content/careers-page-content')
)
const MenuPageContent = dynamic(() =>
  import('./menu-page-content/menu-page-content')
)
const AccordionSetsWithHeading = dynamic(() =>
  import('./accordion-sets-with-heading/accordion-sets-with-heading')
)

export const Module = ({
  index,
  module,
  product,
  activeVariant,
  onVariantChange,
  collectionProducts,
  products
}) => {
  const type = module._type
  switch (type) {
    case 'awards':
      return <Awards index={index} data={module} />
    case 'book':
      return <Book index={index} data={module} />
    case 'stayInTouch':
      return <StayInTouch index={index} data={module} />
    case 'grid':
      return <Grid index={index} data={module} />
    case 'hero':
      return <Hero index={index} data={module} />
    case 'promotional':
      return <Promotion index={index} data={module} />
    case 'marquee':
      return <Marquee index={index} data={module} />
    case 'dividerPhoto':
      return <DividerPhoto index={index} data={module} />
    case 'twoColCTA':
      return <TwoColCTA index={index} data={module} />
    case 'tagsSlider':
      return <TagsSlider index={index} data={module} />
    case 'productsSlider':
      return <ProductsSlider index={index} product={product} data={module} />
    case 'subscriptionsPageContent':
      return <SubscriptionsPageContent index={index} data={module} />
    case 'awardsHero':
      return <AwardsHero index={index} data={module} />
    case 'findYourBeansHero':
      return <RoastHero index={index} data={module} />
    case 'twoColWithImagesAndText':
      return <TwoColWithImagesAndText index={index} data={module} />
    case 'productHero':
      return (
        <ProductHero
          index={index}
          product={product}
          activeVariant={activeVariant}
          onVariantChange={onVariantChange}
        />
      )
    case 'productsList':
      return(
        <ProductsList index={index} data={module} products={products}  />
      )
    case 'collectionGrid':
      return (
        <Collection
          index={index}
          data={{ ...module, products: collectionProducts }}
        />
      )
    case 'locationGrid':
      return <LocationGrid index={index} data={module} />
    case 'brewGuideGrid':
      return <BrewGuideGrid index={index} data={module} />
    case 'clipboard':
      return <Clipboard index={index} data={module} />
    case 'twoColTextAndClipboard':
      return <TwoColTextAndClipboard index={index} data={module} />
    case 'ourStoryFamilyBios':
      return <OurStoryFamilyBios index={index} data={module} />
    case 'ourStoryNotesSection':
      return <OurStoryNotesSection index={index} data={module} />
    case 'ourStoryHero':
      return <OurStoryHero index={index} data={module} />
    case 'tastingTrainingList':
      return <TrainingList index={index} data={module} />
    case 'videoProjector':
      return <VideoProjectorModule index={index} data={module} />
    case 'ourStoryMoreInfo':
      return <OurStoryMoreInfo index={index} data={module} />
    case 'ourStoryImageCTA':
      return <OurStoryImageCTA index={index} data={module} />
    case 'wholesaleHeading':
      return <WholesaleHeading index={index} data={module} />
    case 'wholesaleBackgroundWithCards':
      return <WholesaleBackgroundWithCards index={index} data={module} />
    case 'campusInformation':
      return <CampusInformation index={index} data={module} />
    case 'instructorList':
      return <InstructorList index={index} data={module} />
    case 'wholesaleFirstSection':
      return <WholesaleFirstSection index={index} data={module} />
    case 'shopCrowdPleasers':
      return <ShopCrowdPleasers index={index} data={module} />
    case 'shopCollectionDisplay':
      return <ShopCollectionDisplay index={index} data={module} />
    case 'wholesaleTwoColWithCtaAndClipboard':
      return <WholesaleTwoColWithCtaAndClipboard index={index} data={module} />
    case 'threeColCtaWithImages':
      return <ThreeColCtaWithImages index={index} data={module} />
    case 'twoColCtaWithRichText':
      return <TwoColCtaWithRichText index={index} data={module} />
    case 'careersPageContent':
      return <CareersPageContent index={index} data={module} />
    case 'menuPageContent':
      return <MenuPageContent index={index} data={module} />
    case 'accordionSetsWithHeading':
      return <AccordionSetsWithHeading index={index} data={module} />
    default:
      return null
  }
}
