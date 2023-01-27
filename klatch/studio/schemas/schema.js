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
import cafe from './documents/cafe'
import author from './documents/author'
import blogPost from './documents/blog-post'
import category from './documents/category'
import comment from './documents/comment'

// Module types
import awards from './modules/awards'
import grid from './modules/grid'
import hero from './modules/hero'
import TwoColCta from './modules/two-col-cta'
import marquee from './modules/marquee'
import dividerPhoto from './modules/divider-photo'
import newsletter from './modules/newsletter'
import productHero from './modules/product-hero'
import collectionGrid from './modules/collection-grid'
import stayInTouch from './modules/stay-in-touch'
import book from './modules/book'
import tagsSlider from './modules/tags-slider'
import productsSlider from './modules/products-slider'
import locationGrid from './modules/location-grid'
import subscriptionsPageContent from './modules/subscriptions-page-content'
import subscriptionsPlanDisplay from './modules/subscriptions-plan-display'
import awardsHero from './modules/awards-hero'
import findYourBeansHero from './modules/find-your-beans-hero'
import twoColWithImagesAndText from './modules/two-col-with-images-and-text'
import brewGuideGrid from './modules/brew-guide-grid'
import ourStoryFamilyBios from './modules/our-story-family-bios'
import ourStoryHero from './modules/our-story-page/our-story-hero'
import tastingTrainingList from './modules/tasting-training-list'
import videoProjector from './modules/video-projector'
import ourStoryMoreInfo from './modules/our-story-more-info'
import ourStoryImageCta from './modules/our-story-image-cta'
import wholesaleHeading from './modules/wholesale-heading/wholesale-heading'
import wholesaleFirstSection from './modules/wholesale-first-section/wholesale-first-section'
import shopCrowdPleasers from './modules/shop-crowd-pleasers'
import wholesaleTwoColWithCtaAndClipboard from './modules/wholesale-two-col-with-cta-and-clipboard/wholesale-two-col-with-cta-and-clipboard'
import careersPageContent from './modules/careers-page-content'
import shopCollectionDisplay from './modules/shop-collection-display'
import menuPageContent from './modules/menu-page-content'

import twoColTextAndClipboard from './modules/two-col-text-and-clipboard'
import ourStoryNotesSection from './modules/our-story-notes-section'
import clipboard from './modules/clipboard'
import card from './modules/wholesale-background-with-cards/card'
import wholesaleBackgroundWithCards from './modules/wholesale-background-with-cards/wholesale-background-with-cards'
import campusInformation from './modules/campus-information'
import instructorList from './modules/instructor-list'
import accordionSetsWithHeading from './modules/accordion-sets-with-heading'
import threeColCtaWithImages from './modules/three-col-cta-with-images'
import twoColCtaWithRichText from './modules/two-col-cta-with-rich-text'

// Object types
import gridColumn from './objects/grid-column'
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
import navLinkWithDropdown from './objects/nav-link-with-dropdown'
import socialLink from './objects/social-link'
import horizontalRule from './objects/horizontal-rule'
import gridSize from './objects/grid-size'

import simplePortableText from './objects/portable-simple'
import complexPortableText from './objects/portable-complex'

import freeform from './objects/freeform'
import accordionSet from './objects/accordion-set'
import accordion from './objects/accordion'
import productCard from './objects/product-card'

import participant from './objects/participant'
import cta from './objects/cta'
import stickyNote from './objects/sticky-note'
import bookPages from './objects/book-page'
import bookSheet from './objects/book-sheet'
import bookTemplates from './documents/book-templates'
import event from './objects/event'
import brewGuide from './documents/brew-guide'
import trainingClass from './documents/training-class'
import tastingTrainingCategory from './documents/tasting-training-category'
import tastingTrainingItem from './documents/tasting-training-item'
import keyValue from './objects/key-value'
import instructor from './objects/instructor'
import productsList from './modules/products-list'
import promotion from './modules/promotion'

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
    bookTemplates,
    cafe,
    author,
    blogPost,
    category,
    comment,

    /* --------------- */
    /* 2: Module types */
    awards,
    grid,
    hero,
    promotion,
    marquee,
    dividerPhoto,
    newsletter,
    productHero,
    productsList,
    collectionGrid,
    TwoColCta,
    stayInTouch,
    book,
    tagsSlider,
    productsSlider,
    locationGrid,
    subscriptionsPageContent,
    subscriptionsPlanDisplay,
    awardsHero,
    twoColWithImagesAndText,
    findYourBeansHero,
    videoProjector,
    menuPageContent,

    clipboard,
    brewGuideGrid,
    twoColTextAndClipboard,
    ourStoryFamilyBios,
    ourStoryNotesSection,
    ourStoryHero,
    tastingTrainingList,
    ourStoryMoreInfo,
    ourStoryImageCta,
    wholesaleHeading,
    card,
    wholesaleBackgroundWithCards,
    campusInformation,
    instructorList,
    wholesaleFirstSection,
    shopCrowdPleasers,
    shopCollectionDisplay,
    wholesaleTwoColWithCtaAndClipboard,
    accordionSetsWithHeading,
    threeColCtaWithImages,
    twoColCtaWithRichText,
    careersPageContent,

    /* --------------- */
    /* 3: Object types */
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
    navLinkWithDropdown,
    socialLink,
    horizontalRule,

    simplePortableText,
    complexPortableText,

    freeform,
    accordionSet,
    accordion,
    productCard,

    participant,
    cta,
    stickyNote,
    bookPages,
    bookSheet,
    event,
    brewGuide,
    trainingClass,
    keyValue,
    instructor,
    tastingTrainingCategory,
    tastingTrainingItem
  ])
})
