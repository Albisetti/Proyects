import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'

// Document types
import page from './documents/page'
import product from './documents/shopify-product'
import productVariant from './documents/shopify-variant'
import collection from './documents/shopify-collection'
import filter from './documents/filter'
import solidColor from './documents/color'
import audience from './documents/audience'

import generalSettings from './documents/settings-general'
import cookieSettings from './documents/settings-cookie'
import promoSettings from './documents/settings-promo'
import headerSettings from './documents/settings-header'
import footerSettings from './documents/settings-footer'
import shopSettings from './documents/settings-shop'
import seoSettings from './documents/settings-seo'
import menu from './documents/menu'
import redirect from './documents/redirect'
import author from './documents/author'
import eventCategory from './documents/event-category'
import event from './documents/event'
import postCategory from './documents/post-category'
import post from './documents/post'

// Module types
import grid from './modules/grid'
import hero from './modules/hero'
import marquee from './modules/marquee'
import dividerPhoto from './modules/divider-photo'
import title from './modules/title'
import newsletter from './modules/newsletter'
import productHero from './modules/product-hero'
import collectionGrid from './modules/collection-grid'
import tabsWithSidenav from './modules/tabs-with-sidenav'
import internalHero from './modules/internal-hero'
import testHero from './modules/test-module'
import ctaCircle from './modules/cta-circle-image'
import twoColWithImage from './modules/two-col-with-image'
import ctaSectionsWithSideNav from './modules/cta-sections-with-side-nav'
import audienceGrid from './modules/audience-grid'
import connectedNodesGrid from './modules/connected-nodes-grid'
import careersJobBlocks from './modules/careers-job-blocks'
import columnsWithLinks from './modules/columns-with-links'
import howToReachUs from './modules/how-to-reach-us/how-to-reach-us'
import careersBenefitsSection from './modules/careers-benefits-section'
import testimonialBlocks from './modules/testimonial-blocks'
import timeline from './modules/timeline'
import fullBackgroundImageCTA from './modules/full-background-image-cta'
import waveLines from './modules/wave-lines'

import multiColumnText from './modules/multi-column-text'
// Object types
import gridColumn from './objects/grid-column'
import gridSize from './objects/grid-size'
import seo from './objects/seo'

import shopFilter from './objects/shop-filter'
import shopSort from './objects/shop-sort'

import productGalleryPhotos from './objects/product-gallery-photos'
import productListingPhotos from './objects/product-listing-photos'
import productCartPhotos from './objects/product-cart-photos'
import productOption from './objects/product-option'
import productOptionValue from './objects/product-option-value'
import productOptionSettings from './objects/product-option-settings'

import navDropdown from './objects/nav-dropdown'
import navPage from './objects/nav-page'
import navLink from './objects/nav-link'
import socialLink from './objects/social-link'
import horizontalRule from './objects/horizontal-rule'
import navAudience from './objects/nav-audience'

import simplePortableText from './objects/portable-simple'
import complexPortableText from './objects/portable-complex'

import freeform from './objects/freeform'
import accordions from './objects/accordions'
import accordion from './objects/accordion'
import productCard from './objects/product-card'

import participant from './objects/participant'
import cta from './objects/cta'
import link from './objects/link'
import ctaList from './objects/cta-list'
import announcementCarousel from './modules/announcement-carousel'
import announcementObject from './objects/announcement-object'
import featureCarousel from './modules/feature-carousel'
import featuredEvent from './modules/featured-event'
import eventGrid from './modules/event-grid'
import postGrid from './modules/post-grid'

import executiveTab from './objects/tabTypes/executive-tab'
import directorTab from './objects/tabTypes/director-tab'
import freeTab from './objects/tabTypes/free-tab'

import timeEvent from './objects/time-event'

import imageCTA from './objects/imageCTA'

/*  ------------------------------------------ */
/*  Your Schema documents / modules / objects
/*  ------------------------------------------ */
export default createSchema({
  // The name of our schema
  name: 'content',

  types: schemaTypes.concat([
    /* ----------------- */
    /* 1: Document types */
    page,
    product,
    productVariant,
    collection,
    filter,
    solidColor,
    audience,

    generalSettings,
    cookieSettings,
    promoSettings,
    headerSettings,
    footerSettings,
    shopSettings,
    seoSettings,
    menu,
    redirect,

    author,
    eventCategory,
    event,
    postCategory,
    post,

    /* --------------- */
    /* 2: Module types */
    grid,
    hero,
    marquee,
    dividerPhoto,
    newsletter,
    productHero,
    collectionGrid,
    title,
    tabsWithSidenav,
    internalHero,
    testHero,
    ctaCircle,
    twoColWithImage,
    ctaSectionsWithSideNav,
    announcementCarousel,
    audienceGrid,
    connectedNodesGrid,
    careersJobBlocks,
    columnsWithLinks,
    featureCarousel,
    featuredEvent,
    eventGrid,
    postGrid,
    howToReachUs,
    careersBenefitsSection,
    testimonialBlocks,
    timeline,
    fullBackgroundImageCTA,
    multiColumnText,
    waveLines,

    /* ----------------------- */
    /* 3: Generic Object types */
    gridColumn,
    gridSize,
    seo,
    cta,
    link,
    ctaList,
    shopFilter,
    shopSort,
    announcementObject,
    productGalleryPhotos,
    productListingPhotos,
    productCartPhotos,
    productOption,
    productOptionValue,
    productOptionSettings,

    navDropdown,
    navPage,
    navLink,
    socialLink,
    horizontalRule,
    navAudience,

    simplePortableText,
    complexPortableText,

    freeform,
    accordions,
    accordion,
    productCard,

    participant,

    executiveTab,
    directorTab,
    freeTab,

    timeEvent,

    imageCTA
  ])
})
