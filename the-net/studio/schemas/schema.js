import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'

// Document types
import page from './documents/page'
import product from './documents/shopify-product'
import productVariant from './documents/shopify-variant'
import collection from './documents/shopify-collection'
import filter from './documents/filter'
import solidColor from './documents/color'

import generalSettings from './documents/settings-general'
import cookieSettings from './documents/settings-cookie'
import promoSettings from './documents/settings-promo'
import headerSettings from './documents/settings-header'
import footerSettings from './documents/settings-footer'
import shopSettings from './documents/settings-shop'
import seoSettings from './documents/settings-seo'
import menu from './documents/menu'
import redirect from './documents/redirect'

// Module types
import grid from './modules/grid'
import hero from './modules/hero'
import marquee from './modules/marquee'
import dividerPhoto from './modules/divider-photo'
import title from './modules/title'
import newsletter from './modules/newsletter'
import productHero from './modules/product-hero'
import collectionGrid from './modules/collection-grid'
import verticalNav from './modules/global/vertical-navigation'

import linksList from './modules/global/links-list'
import buildingContent from './modules/building-section/building-content'
import buildingContainer from './modules/building-section/building-container'
import brandVideo from './modules/building-section/brand-video'
import amenitiesContent from './modules/amenities-section/amenities-content'
import amenitiesContainer from './modules/amenities-section/amenities-container'
import landingContent from './modules/sky-park/landing-content'
import landingContainer from './modules/sky-park/landing-container'
import teamContent from './modules/team-section/team-content'
import teamContainer from './modules/team-section/team-container'
import teamMembers from './modules/team-section/team-members'
import buildingInfo from './modules/building-section/building-info'
import floorContent from './modules/floor-section/floor-content'
import floorContainer from './modules/floor-section/floor-container'
import floorDetails from './modules/floor-section/floor-details'
import gallery from './modules/global/gallery'
import galleryModal from './modules/global/gallery-modal'
import locationContent from './modules/location-section/location-content'
import locationContainer from './modules/location-section/location-container'

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
import link from './objects/link'

import simplePortableText from './objects/portable-simple'
import complexPortableText from './objects/portable-complex'

import freeform from './objects/freeform'
import accordions from './objects/accordions'
import accordion from './objects/accordion'
import productCard from './objects/product-card'

import participant from './objects/participant'
import carousel from './objects/carousel'
import imageWithTitle from './objects/image-with-title'

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

    generalSettings,
    cookieSettings,
    promoSettings,
    headerSettings,
    footerSettings,
    shopSettings,
    seoSettings,
    menu,
    redirect,

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
    verticalNav,
    linksList,
    buildingContent,
    buildingContainer,
    brandVideo,
    amenitiesContent,
    amenitiesContainer,
    landingContent,
    landingContainer,
    teamContent,
    teamContainer,
    locationContent,
    locationContainer,
    teamMembers,
    buildingInfo,
    floorContent,
    floorContainer,
    floorDetails,
    gallery,
    galleryModal,

    /* ----------------------- */
    /* 3: Generic Object types */
    gridColumn,
    gridSize,
    seo,

    shopFilter,
    shopSort,

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
    link,

    simplePortableText,
    complexPortableText,

    freeform,
    accordions,
    accordion,
    productCard,

    participant,
    carousel,
    imageWithTitle
  ])
})
