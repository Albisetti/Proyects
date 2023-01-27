import { announcementCarouselQuery } from '@components/modules/announcement-carousel/announcement-carousel-query'
import { collectionGridQuery } from '@components/modules/collection-grid/collection-grid.query'
import { columnsWithLinksQuery } from '@components/modules/columns-with-links/columns-with-links.query'
import { dividerPhotoQuery } from '@components/modules/divider-photo/divider-photo.query'
import { gridQuery } from '@components/modules/grid/grid.query'
import { heroQuery } from '@components/modules/hero/hero.query'
import { tabsWithSidenavQuery } from '@components/modules/tabs-with-sidenav/tabs-with-sidenav.query'
import { internalHeroQuery } from '@components/modules/internal-hero/internal-hero.query'
import { testHeroQuery } from '@components/modules/testHero/testHero.query'
import { marqueeQuery } from '@components/modules/marquee/marquee.query'
import { productHeroQuery } from '@components/modules/product-hero/product-hero.query'
import { careersJobBlocksQuery } from '@components/modules/careers-job-blocks/careers-job-blocks.query'
import { testimonialBlocksQuery } from '@components/modules/testimonial-blocks/testimonial-blocks.query'
import { timelineQuery } from '@components/modules/timeline/timeline.query'
import { twoColWithImage } from '@components/modules/two-col-with-image/two-col-with-image.query'
import { ctaSectionsWithSideNav } from '@components/modules/cta-sections-with-side-nav/cta-sections-with-side-nav.query'
import { careersBenefitsSectionQuery } from '@components/modules/careers-benefits-section/careers-benefits-section.query'
import { audienceGridQuery } from '@components/modules/audience-grid/audience-grid.query'
import { ctaCircleImageQuery } from '@components/modules/cta-circle-image/cta-circle-image.query'
import { howToReachUsQuery } from '@components/modules/how-to-reach-us/how-to-reach-us.query'
import { fullBackgroundImageCTAQuery } from '@components/modules/full-background-image-cta/full-background-image-cta.query'
import { featureCarouselQuery } from '@components/modules/feature-carousel/feature-carousel.query'
import { featuredEventQuery } from '@components/modules/featured-event/featured-event.query'
import { eventGridQuery } from '@components/modules/event-grid/event-grid.query'
import { postGridQuery } from '@components/modules/post-grid/post-grid.query'
import { multiColumnTextQuery } from '@components/modules/multi-column-text/multi-column-text.query'
import { connectedNodesGridQuery } from '@components/modules/connected-nodes-grid/connected-nodes-grid.query'
import { waveLinesQuery } from '@components/modules/wave-lines/wave-lines.query'

import { link, product, ptContent } from './utils'

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
  ${internalHeroQuery},
  ${ctaSectionsWithSideNav},
  ${tabsWithSidenavQuery},
  ${internalHeroQuery},
  ${testHeroQuery},
  ${twoColWithImage},
  ${announcementCarouselQuery},
  ${audienceGridQuery},
  ${careersJobBlocksQuery},
  ${columnsWithLinksQuery},
  ${featureCarouselQuery},
  ${featuredEventQuery},
  ${eventGridQuery},
  ${postGridQuery},
  ${careersBenefitsSectionQuery},
  ${ctaCircleImageQuery},
  ${howToReachUsQuery},
  ${testimonialBlocksQuery},
  ${timelineQuery},
  ${fullBackgroundImageCTAQuery},
  ${multiColumnTextQuery},
  ${connectedNodesGridQuery},
  ${waveLinesQuery}
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
      "logoImg": logoImg.asset->url,
      "logoImgBright": logoImgBright.asset->url,
      logoText,
      navItems[]{
        title,
        type,
        dropdownSmallMenu->{
          items[]{
            ${link}
          }
        },
        dropdownMediumMenu[]{
          title,
          column,
          menu->{
            items[]{
              ${link}
            }
          }
        },
        navLink->{
          "slug": slug.current
        }
      },
      buttons[]{
        title,
        bgFilled,
        linkType,
        pageLink->{
          "slug": slug.current
        },
        externalLink
      }
    },
    "footer": *[_type == "footerSettings"][0]{
      "blocks": [
        {
          howToReachUsTitle,
          howToReachUsDescription,
          social[]{
            icon,
            url
          }
        },
        {
          rfkCommunityAllianceAddressTitle,
          street,
          city,
          phoneNumber
        },
        {
          newsLetterTitle,
          newsLetterDescription
        },
        {
          copyrightTitle,
          taxID,
          termOfUseUrl,
          privacyPolicyUrl,
        },
        {
          "findSupportMenu": findSupportMenu->{
            items[]{
              ${link}
            }
          },
          "ourServicesMenu": ourServicesMenu->{
            items[]{
              ${link}
            }
          },
          "ourApproachMenu": ourApproachMenu->{
            items[]{
              ${link}
            }
          },
          "aboutUsMenu": aboutUsMenu->{
            items[]{
              ${link}
            }
          },
          "newsEventsMenu": newsEventsMenu->{
            items[]{
              ${link}
            }
          },
          "careersMenu": careersMenu->{
            items[]{
              ${link}
            }
          },
          "getInvolvedPage": getInvolvedPage->slug.current,
          "contactUsPage": contactUsPage->slug.current
        }
      ],
      donationCOTitle,
      donationCODescription,
      donationCOLink
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
  *[_type == "product" && wasDeleted != true && isDraft != true${preview?.active ? ' && _id in path("drafts.**")' : ''
  }]${product} | order(title asc)
`

// Event
export const event = `
  _type,
  title,
  "slug": slug.current,
  "date": scheduledFor,
  location,
  registrationLink{
    title,
    linkType == "internal" => {
      "url": hrefInternal
    },
    linkType == "external" => {
      "url": hrefExternal
    },
    target
  },
  speaker,
  category->{
    title,
    "slug": slug.current
  },
  excerpt,
  featuredImage,
  content[]{
    ${ptContent}
  },
  seo,
  "updatedAt": _updatedAt,
  "createdAt": _createdAt
`

// Event Category
export const eventCategory = `
  title,
  "slug": slug.current,
  seo
`

// Post
export const post = `
  _type,
  title,
  "author": author->name,
  "slug": slug.current,
  category->{
    title,
    "slug": slug.current
  },
  featuredImage,
  alternateImage,
  excerpt,
  content[]{
    ${ptContent}
  },
  seo,
  publishedAt
`

// Post Category
export const postCategory = `
  title,
  "slug": slug.current,
  seo
`
