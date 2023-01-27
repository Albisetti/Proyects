import { buildingContainer } from '@components/modules/building-section/building-container/building-container.query'
import { buildingContent } from '@components/modules/building-section/building-content/building-content.query'
import { buildingInfo } from '@components/modules/building-section/building-info/building-info.query'
import { buildingContainerQuery } from '@components/modules/building-section/brand-video/brand-video.query'
import { collectionGridQuery } from '@components/modules/collection-grid/collection-grid.query'
import { dividerPhotoQuery } from '@components/modules/divider-photo/divider-photo.query'
import { linksList } from '@components/modules/global/links-list/links-list.query'
import { gridQuery } from '@components/modules/grid/grid.query'
import { heroQuery } from '@components/modules/hero/hero.query'
import { marqueeQuery } from '@components/modules/marquee/marquee.query'
import { productHeroQuery } from '@components/modules/product-hero/product-hero.query'
import { verticalNavigationQuery } from '@components/modules/global/vertical-navigation/vertical-navigation.query'
import { floorContentQuery } from '@components/modules/floor-section/floor-content/floor-content.query'
import { floorContainerQuery } from '@components/modules/floor-section/floor-container/building-container.query'
import { galleryQuery } from '@components/modules/global/gallery/gallery.query'
import { floorDetailsQuery } from '@components/modules/floor-section/floor-details/floor-details.query'

import { amenitiesContainer } from '@components/modules/amenities-section/amenities-container/amenities-container.query'
import { landingContainer } from '@components/modules/landing-section/landing-container/landing-container.query'
import { teamContainer } from '@components/modules/team-section/team-container/team-container.query'
import { galleryModalQuery } from '@components/modules/global/gallery-modal/gallery-modal.query'

import { link, product, ptContent } from './utils'
import { locationContainerQuery } from '@components/modules/location-section/location-container/location-container.query'

// Construct our "image meta" GROQ
export const imageMeta = `
  "alt": coalesce(alt, asset->altText),
  asset,
  crop,
  customRatio,
  hotspot,
  "id": asset->assetId,
  "type": asset->mimeType,
  "aspectRatio": asset->metadata.dimensions.aspectRatio,
  "lqip": asset->metadata.lqip
`

// Construct our content "modules" GROQ
export const modules = `
  ${gridQuery},
  ${heroQuery},
  ${marqueeQuery},
  ${dividerPhotoQuery},
  ${productHeroQuery},
  ${collectionGridQuery},
  ${verticalNavigationQuery},
  ${linksList},
  ${buildingContent},
  ${buildingContainer},
  ${buildingInfo},  
  ${floorContentQuery},
  ${floorContainerQuery},
  ${locationContainerQuery},
  ${galleryQuery},
  ${amenitiesContainer},
  ${landingContainer},
  ${teamContainer},
  ${floorDetailsQuery},
  ${galleryModalQuery},
  ${buildingContainerQuery},
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
      navMenuImages{
        "imgSkyPark": imgSkyPark.asset->url,
        "imgFloor": imgFloor.asset->url,
        "imgAmenities": imgAmenities.asset->url,
        "imgBuilding": imgBuilding.asset->url,
        "imgLocation": imgLocation.asset->url,
        "imgTeam": imgTeam.asset->url
      }
    },
    "footer": *[_type == "footerSettings"][0]{
      "blocks": [
        {
          "title": blockTitle1,
          newsletter{
            "id": "footer",
            klaviyoListID,
            submit,
            successMsg[]{
              ${ptContent}
            },
            errorMsg[]{
              ${ptContent}
            },
            terms[]{
              ${ptContent}
            }
          }
        },
        {
          "title": blockTitle2,
          "menu": blockMenu2->{
            items[]{
              ${link}
            }
          }
        },
        {
          "title": blockTitle3,
          "menu": blockMenu3->{
            items[]{
              ${link}
            }
          }
        },
        {
          "title": blockTitle4,
          social[]{
            icon,
            url
          }
        }
      ]
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
