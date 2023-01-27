import { imageMeta } from './utils'
import { sortTypes } from '../studio/schemas/objects/shop-sort'
import { awardsQuery } from '@components/modules/awards/awards-query'
import { heroQuery } from '@components/modules/hero/hero-query'
import { dividerPhotoQuery } from '@components/modules/divider-photo/divider-photo-query'
import { productHeroQuery } from '@components/modules/product-hero/product-hero-query'
import { productsSliderQuery } from '@components/modules/products-slider/products-slider-query'
import { stayInTouchQuery } from '@components/modules/stay-in-touch/stay-in-touch-query'
import { tagsSliderQuery } from '@components/modules/tags-slider/tags-slider-query'
import { twoColCtaQuery } from '@components/modules/two-col-cta/two-col-cta-query'
import { collectionGridQuery } from '@components/modules/collection-grid/collection-grid-query'
import { awardsHeroQuery } from '@components/modules/awards-hero/awards-hero-query'
import { subscriptionsPageContentQuery } from '@components/modules/subscriptions-page-content/subscriptions-page-content-query'
import { twoColWithImagesAndTextQuery } from '@components/modules/two-col-with-images-and-text/two-col-with-images-and-text-query'
import { locationGridQuery } from '@components/modules/location-grid/location-grid-query'
import { bookQuery } from '@components/modules/book/book-query'
import { findYourRoastHeroQuery } from '@components/modules/find-your-roast/find-your-roast-query'
import { brewGuideGridQuery } from '@components/modules/brew-guide-grid/brew-guide-grid-query'
import { clipboardQuery } from '@components/modules/clipboard/clipboard-query'
import { twoColTextAndClipboardQuery } from '@components/modules/two-col-text-and-clipboard/two-col-text-and-clipboard-query'
import { ourStoryFamilyBiosQuery } from '@components/modules/our-story-family-bios/our-story-family-bios-query'
import { ourStoryNotesSectionQuery } from '@components/modules/our-story-notes-section/our-story-notes-section-query'
import { ourStoryHeroQuery } from '@components/modules/our-story-hero/our-story-hero-query'
import { trainingListQuery } from '@components/modules/training-list/training-list-query'
import { videoProjectorModuleQuery } from '@components/modules/video-projector-module/video-projector-query'
import { ourStoryMoreInfoQuery } from '@components/modules/our-story-more-info/our-story-more-info-query'
import { ourStoryImageCTAQuery } from '@components/modules/our-story-image-cta/our-story-image-cta-query'
import { wholesaleHeadingQuery } from '@components/modules/wholesale-heading/wholesale-heading-query'
import { wholesaleBackgroundWithCardsQuery } from '@components/modules/wholesale-background-with-cards/wholesale-background-with-cards-query'
import { campusInformation } from '@components/modules/campus-information/campus-information-query'
import { instructorListQuery } from '@components/modules/instructor-list/instructor-list-query'
import { wholesaleFirstSectionQuery } from '@components/modules/wholesale-first-section/wholesale-first-section-query'
import { shopCrowdPleasersQuery } from '@components/modules/shop-crowd-pleasers/shop-crowd-pleasers-query'
import { shopCollectionDisplayQuery } from '@components/modules/shop-collection-display/shop-collection-display-query'
import { wholesaleTwoColWithCtaAndClipboardQuery } from '@components/modules/wholesale-two-col-with-cta-and-clipboard/wholesale-two-col-with-cta-and-clipboard-query'
import { threeColCtaWithImagesQuery } from '@components/modules/three-col-cta-with-images/three-col-cta-with-images-query'
import { twoColCtaWithRichTextQuery } from '@components/modules/two-col-cta-with-rich-text/two-col-cta-with-rich-text-query'
import { careersPageContentQuery } from '@components/modules/careers-page-content/careers-page-content-query'
import { menuPageContentQuery } from '@components/modules/menu-page-content/menu-page-content-query'
import { accordionSetsWithHeadingQuery } from '@components/modules/accordion-sets-with-heading/accordion-sets-with-heading-query'
import { productsListQuery } from '@components/modules/products-list/products-list-query'
import { promotionQuery } from '@components/modules/promotion/promotion-query'

// Create our sorting fallback titles from Sanity
const sortFallbacks = sortTypes
  .map((type) => `type == "${type.value}" => "${type.title}"`)
  .join(',')

// Construct our "home" and "error" page GROQ
export const homeID = `*[_type=="generalSettings"][0].home->_id`
export const shopID = `*[_type=="generalSettings"][0].shop->_id`
export const errorID = `*[_type=="generalSettings"][0].error->_id`

// Construct our "page" GROQ
export const page = `
  "type": _type,
  "slug": slug.current,
  "isHome": _id == ${homeID},
  "isShop": _id == ${shopID}
`

// Construct our "brewGuide" GROQ
export const brewGuide = `
  name,
  slug,
  image,
  imageCaption,
  "pdfText": printablePDFText,
  "pdfURL": printablePDF.asset->url,
  videoType == "upload" => {
    "videoURL": videoUpload.asset->url
  },
  videoType == "embed" => {
    "videoURL": videoEmbedURL
  },
  videoPreviewImage,
  details[]{
    key,
    value
  },
  steps,
  seo
`

// Construct our "link" GROQ
export const link = `
  _key,
  _type,
  title,
  url,
  "page": page->{
    ${page}
  }
`
// Construct our "portable text content" GROQ
export const ptContent = `
  ...,
  markDefs[]{
    ...,
    _type == "link" => {
      "url": @.url,
      "isButton": @.isButton,
      "styles": @.styles{style, isLarge, isBlock},
      "page":@.page->{
        ${page}
      }
    }
  },
  _type == "photo" => {
    ${imageMeta}
  }
`

// Construct our "product" GROQ
export const product = `
  {
    "publishDate": coalesce(publishDate, _createdAt),
    "slug": slug.current,
    "id": productID,
    title,
    book,
    price,
    comparePrice,
    description,
    "photos": {
      "main": galleryPhotos[]{
        forOption,
        photos[]{
          ${imageMeta}
        }
      },
      "listing": listingPhotos[]{
        forOption,
        "default": listingPhoto{
          ${imageMeta}
        },
        "hover": listingPhotoHover{
          ${imageMeta}
        },
        "background": backgroundImg{
          ${imageMeta}
        },
        sideImageList[]{
          image{
            ${imageMeta}
          },
          position
        },
        textAnnotation
      },
      "sideBgImage": sideBgImage{
        image{
          ${imageMeta}
        }
      }
    },
    inStock,
    lowStock,
    useGallery,
    surfaceOption,
    options[]{
      name,
      position,
      values[]
    },
    optionSettings[]{
      forOption,
      "color": color->color,
    },
    "variants": *[_type == "productVariant" && productID == ^.productID && wasDeleted != true && isDraft != true]{
      "id": variantID,
      title,
      price,
      comparePrice,
      inStock,
      lowStock,
      options[]{
        name,
        position,
        value
      },
      seo
    },
    "klaviyoAccountID": *[_type == "generalSettings"][0].klaviyoAccountID,
    "filters": filters[]{
      "slug": filter->slug.current,
      forOption
    }
  }
`

// Construct our "trainingClass" GROQ
export const trainingClass = `
  classProduct->${product},
  "videoURL": videoUpload.asset->url,
  videoEmbedURL,
  firstPolaroidImage,
  secondPolaroidImage,
  seo
`

// Construct our "blocks" GROQ
export const blocks = `
  ${clipboardQuery},
  _type == 'freeform' => {
    _type,
    _key,
    content[]{
      ${ptContent}
    },
    textAlign,
    maxWidth
  },
  _type == 'accordions' => {
    _type,
    _key,
    items[]{
      "id": _key,
      title,
      content[]{
        ${ptContent}
      }
    }
  },
  _type == 'productCard' => {
    _type,
    _key,
    product->${product}
  }
`

// Construct our content "modules" GROQ
export const modules = `
  ${awardsQuery},
  ${stayInTouchQuery},
  ${heroQuery},
  ${promotionQuery},
  ${twoColCtaQuery},
  ${dividerPhotoQuery},
  ${productHeroQuery},
  ${productsListQuery},
  ${tagsSliderQuery},
  ${productsSliderQuery},
  ${awardsHeroQuery},
  ${subscriptionsPageContentQuery(product)},
  ${twoColWithImagesAndTextQuery},
  ${locationGridQuery},
  ${bookQuery},
  ${findYourRoastHeroQuery},
  ${brewGuideGridQuery},
  ${twoColTextAndClipboardQuery},
  ${ourStoryFamilyBiosQuery},
  ${ourStoryHeroQuery},
  ${trainingListQuery},
  ${videoProjectorModuleQuery},
  ${ourStoryMoreInfoQuery},
  ${ourStoryNotesSectionQuery},
  ${ourStoryImageCTAQuery},
  ${wholesaleHeadingQuery},
  ${wholesaleBackgroundWithCardsQuery},
  ${campusInformation},
  ${instructorListQuery},
  ${wholesaleFirstSectionQuery},
  ${shopCrowdPleasersQuery(product)},
  ${shopCollectionDisplayQuery(product)},
  ${wholesaleTwoColWithCtaAndClipboardQuery},
  ${threeColCtaWithImagesQuery},
  ${twoColCtaWithRichTextQuery},
  ${careersPageContentQuery},
  ${menuPageContentQuery},
  ${accordionSetsWithHeadingQuery},
  _type == 'marquee' => {
    _key,
    items[]{
      _type == 'simple' => {
        _type,
        text
      },
      _type == 'photo' => {
        _type,
        "photo": {
          ${imageMeta}
        }
      },
      _type == 'product' => {
        _type,
        _id,
        "product": *[_type == "product" && _id == ^ ._ref][0]${product}
      }
    },
    speed,
    reverse,
    pausable
  },
  _type == 'grid' => {
    _type,
    _key,
    size,
    columns[]{
      sizes[]{
        breakpoint,
        width,
        justify,
        align,
        start
      },
      blocks[]{
        ${blocks}
      }
    }
  },
  ${collectionGridQuery},
  "sort": *[_type == "shopSettings"][0].sort{
      isActive,
      options[]{
        "slug": type,
        "title": coalesce(title, select(
          ${sortFallbacks}
        ))
      }
    },
  "noFilterResults": *[_type == "shopSettings"][0].noFilterResults[]{
      ${ptContent}
    },
`

// Construct our "site" GROQ
export const site = `
  "site": {
    "title": *[_type == "generalSettings"][0].siteTitle,
    "rootDomain": *[_type == "generalSettings"][0].siteURL,
    "shop": *[_type == "shopSettings"][0]{
      storeURL,
      cartMessage
    },
    "productCounts": [ {"slug": "all", "count": count(*[_type == "product"])} ] + *[_type == "collection"]{
      "slug": slug.current,
      "count": count(products)
    },
    "cookieConsent": *[_type == "cookieSettings"][0]{
      enabled,
      message,
      "link": link->{"type": _type, "slug": slug.current}
    },
    "header": *[_type == "headerSettings"][0]{
      "promo": *[_type == "promoSettings"][0]{
        enabled,
        display,
        text,
        "link": link->{
          ${page}
        }
      },
      mainMenu {
        _type == 'reference' => @->{
          title,
          items[] {
            _type != "navLinkWithDropdown" => {
              title,
              "slug": page->slug.current
            },
            _type == "navLinkWithDropdown" => {
              "title": link.title,
              "slug": link.page->slug.current
            },
            dropdownItems[]{
              title,
              _type == 'navLink' => {
                "slug": url.current
              },
              _type == 'navPage' => {
                "slug": page->slug.current
              }
            }
          }
        }
      },
      logo {
        ${imageMeta}
      }
    },
    "footer": *[_type == "footerSettings"][0]{
      menu {
        _type == 'reference' => @->{
          title,
          items[] {
            title,
            "slug": page->slug.current
          }
        }
      },
      image {
        ${imageMeta}
      },
      social[] {
        target,
        title,
        "url": url.current
      }
    },
    "seo": *[_type == "seoSettings"][0]{
      metaTitle,
      metaDesc,
      shareTitle,
      shareDesc,
      shareGraphic,
      "favicon": favicon.asset->url,
      "faviconLegacy": faviconLegacy.asset->url,
      touchIcon
    },
    "gtmID": *[_type == "generalSettings"][0].gtmID,
  }
`

// All Products
export const allProducts = (preview) => `
  *[_type == "product" && wasDeleted != true && isDraft != true${
    preview?.active ? ' && _id in path("drafts.**")' : ''
  }]${product} | order(title asc)
`
