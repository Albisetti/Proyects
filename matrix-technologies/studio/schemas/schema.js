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
import settingsLink from './documents/settings-link'
import menu from './documents/menu'
import redirect from './documents/redirect'
import author from './documents/author'
import postCategory from './documents/post-category'
import post from './documents/post'

// Module types
import grid from './modules/grid'
import hero from './modules/hero'
import newsletter from './modules/newsletter'
import productHero from './modules/product-hero'
import collectionGrid from './modules/collection-grid'
import accordionSetsWithHeading from './modules/accordion-sets-with-heading'
import imageSlider from './modules/image-slider'
import richText from './modules/rich-text'
import video from './modules/video'

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
import navSettingsLink from './objects/nav-settings-link'
import socialLink from './objects/social-link'
import horizontalRule from './objects/horizontal-rule'
import link from './objects/link'

import simplePortableText from './objects/portable-simple'
import complexPortableText from './objects/portable-complex'
import portableImage from './objects/portable-image'

import freeform from './objects/freeform'
import accordion from './objects/accordion'
import accordionSet from './objects/accordion-set'
import productCard from './objects/product-card'

import participant from './objects/participant'
import embed from './objects/embed'

/*  ------------------------------------------ */
/*  Your Schema documents / modules / objects
/*  ------------------------------------------ */
export default createSchema({
  // The name of our schema
  name: 'content',

  types: schemaTypes.concat([
    /* ----------------- */
    /* 1: Document types */
    author,
    post,
    postCategory,
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
    settingsLink,
    menu,
    redirect,

    /* --------------- */
    /* 2: Module types */
    grid,
    hero,
    newsletter,
    productHero,
    collectionGrid,
    accordionSetsWithHeading,
    imageSlider,
    richText,
    video,

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
    navSettingsLink,
    socialLink,
    horizontalRule,
    link,

    simplePortableText,
    complexPortableText,
    portableImage,

    freeform,
    accordionSet,
    accordion,
    productCard,

    participant,

    embed,
  ]),
})
