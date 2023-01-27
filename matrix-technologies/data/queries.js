import { collectionGridQuery } from '@components/modules/collection-grid/collection-grid.query'
import { gridQuery } from '@components/modules/grid/grid.query'
import { heroQuery } from '@components/modules/hero/hero.query'
import { productHeroQuery } from '@components/modules/product-hero/product-hero.query'
import { accordionSetsWithHeadingQuery } from '@components/modules/accordion-sets-with-heading/accordion-sets-with-heading.query'
import { imageSliderQuery } from '@components/modules/image-slider/image-slider.query'
import { richTextQuery } from '@components/modules/rich-text/rich-text.query'
import { videoQuery } from '@components/modules/video/video.query'

import { link, page, product, ptContent, simpleLink } from './utils'

// Construct our "image meta" GROQ
export const imageMeta = `
  "alt": coalesce(alt, asset->altText),
  asset,
  crop,
  customRatio,
  hotspot,
  "url": asset->url,
  "id": asset->assetId,
  "type": asset->mimeType,
  "aspectRatio": asset->metadata.dimensions.aspectRatio,
  "lqip": asset->metadata.lqip
`

// Construct our content "modules" GROQ
export const modules = `
  ${gridQuery},
  ${heroQuery},
  ${productHeroQuery},
  ${collectionGridQuery},
  ${accordionSetsWithHeadingQuery},
  ${imageSliderQuery},
  ${richTextQuery},
  ${videoQuery}
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
      logo{
        ${imageMeta}
      },
      emergencySupportMessage,
      menu->{
        items[]{
          ${link},
          dropdownItems[]{
            ${link}
          }
        }
      }
    },
    "footer": *[_type == "footerSettings"][0]{
      logo{
        ${imageMeta}
      },
      hubspotId,
      social[]{
        icon,
        url
      },
      termsOfUse[]{${simpleLink}},
      linksByCategory[]{
        categoryName[]{${simpleLink}},
        linkList[]{${simpleLink}},
      },
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

// Post
export const post = `
  _type,
  title,
  "slug": slug.current,
  publishedAt,
  "author": author->name,
  category->{
    title,
    "slug": slug.current
  },
  featuredImage{
    ${imageMeta}
  },
  content[]{
    ${ptContent}
  },
  excerpt,
  seo
`

// Post Category
export const postCategory = `
  title,
  "slug": slug.current,
  seo
`
