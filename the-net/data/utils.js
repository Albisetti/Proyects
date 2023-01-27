// Construct our "home" and "error" page GROQ
export const homeID = `*[_type=="generalSettings"][0].home->_id`
export const shopID = `*[_type=="generalSettings"][0].shop->_id`
export const errorID = `*[_type=="generalSettings"][0].error->_id`

import { sortTypes } from 'studio/schemas/objects/shop-sort'

// Create our sorting fallback titles from Sanity
export const sortFallbacks = sortTypes
  .map((type) => `type == "${type.value}" => "${type.title}"`)
  .join(',')

export // Construct our "page" GROQ
const page = `
  "type": _type,
  "slug": slug.current,
  "isHome": _id == ${homeID},
  "isShop": _id == ${shopID}
`

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

export const product = `{
  "publishDate": coalesce(publishDate, _createdAt),
  "slug": slug.current,
  "id": productID,
  title,
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
      }
    },
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
}`

export const link = `
  _key,
  _type,
  title,
  url,
  "page": page->{
    ${page}
  },
  arrowLink
`

export const blocks = `
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
