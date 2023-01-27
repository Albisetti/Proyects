import React from 'react'
import dynamic from 'next/dynamic'
import AnnouncementCarousel from './announcement-carousel'

const Grid = dynamic(() => import('./grid'))
const Hero = dynamic(() => import('./hero'))
const Marquee = dynamic(() => import('./marquee'))
const DividerPhoto = dynamic(() => import('./divider-photo'))
const ProductHero = dynamic(() => import('./product-hero'))
const Collection = dynamic(() => import('./collection-grid'))
const TabsWithSidenav = dynamic(() => import('./tabs-with-sidenav'))
const InternalHero = dynamic(() => import('./internal-hero'))
const TestHero = dynamic(() => import('./testHero'))
const TwoColWithImage = dynamic(() => import('./two-col-with-image'))
const CtaSectionsWithSideNav = dynamic(() =>
  import('./cta-sections-with-side-nav')
)
const AudienceGrid = dynamic(() => import('./audience-grid'))
const CareersJobBlocks = dynamic(() => import('./careers-job-blocks'))
const ColumnsWithLinks = dynamic(() => import('./columns-with-links'))
const FeatureCarousel = dynamic(() => import('./feature-carousel'))
const FeaturedEvent = dynamic(() => import('./featured-event'))
const EventGrid = dynamic(() => import('./event-grid'))
const PostGrid = dynamic(() => import('./post-grid'))
const CareersBenefitsSection = dynamic(() =>
  import('./careers-benefits-section')
)
const Timeline = dynamic(() => import('./timeline'))
const CtaCircleImage = dynamic(() => import('./cta-circle-image'))
const HowToReachUs = dynamic(() => import('./how-to-reach-us'))
const TestimonialBlocks = dynamic(() => import('./testimonial-blocks'))
const FullBackgroundImageCTA = dynamic(() =>
  import('./full-background-image-cta')
)
const MultiColumnText = dynamic(() => import('./multi-column-text'))
const ConnectedNodesGrid = dynamic(() => import('./connected-nodes-grid'))
const WaveLines = dynamic(() => import('./wave-lines'))

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
    case 'announcementCarousel':
      return <AnnouncementCarousel index={index} data={module} />
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
    case 'tabsWithSidenav':
      return <TabsWithSidenav index={index} data={module} />
    case 'internalHero':
      return <InternalHero index={index} data={module} />
    case 'testHero':
      return <TestHero index={index} data={module} />
    case 'twoColWithImage':
      return <TwoColWithImage index={index} data={module} />
    case 'ctaSectionsWithSideNav':
      return <CtaSectionsWithSideNav index={index} data={module} />
    case 'audienceGrid':
      return <AudienceGrid index={index} data={module} />
    case 'careersJobBlocks':
      return <CareersJobBlocks index={index} data={module} />
    case 'columnsWithLinks':
      return <ColumnsWithLinks index={index} data={module} />
    case 'featureCarousel':
      return <FeatureCarousel index={index} data={module} />
    case 'featuredEvent':
      return <FeaturedEvent index={index} data={module} />
    case 'eventGrid':
      return <EventGrid index={index} data={module} />
    case 'postGrid':
      return <PostGrid index={index} data={module} />
    case 'careersBenefitsSection':
      return <CareersBenefitsSection index={index} data={module} />
    case 'testimonialBlocks':
      return <TestimonialBlocks index={index} data={module} />
    case 'timeline':
      return <Timeline index={index} data={module} />
    case 'ctaCircle':
      return <CtaCircleImage index={index} data={module} />
    case 'fullBackgroundImageCTA':
      return <FullBackgroundImageCTA index={index} data={module} />
    case 'howToReachUs':
      return <HowToReachUs index={index} data={module} />
    case 'multiColumnText':
      return <MultiColumnText index={index} data={module} />
    case 'connectedNodes':
      return <ConnectedNodesGrid index={index} data={module} />
    case 'waveLines':
      return <WaveLines index={index} data={module} />
    default:
      return null
  }
}
