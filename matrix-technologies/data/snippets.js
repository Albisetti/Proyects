/*
  This is an example of the conditional syntax in GROQ, in short, 
  making a projection based upon a conditional statement.

  Using this generic link object in our schema, instead of checking
  if the link is internal or external in the front-end, we simply
  project the proper field based on the "linkType" value.

  This allows us to leverage the URL validation for hrefExternal,
  but also leave some flexibility to hrefInternal for paths to be 
  handled by Next.js links, all the while the proper URL is returned
  to the front-end in a single property.
*/
export const link = `
  title,
  linkType == "internal" => {
    "url": hrefInternal->slug.current
  },
  linkType == "external" => {
    "url": hrefExternal
  },
  target
`

/*
  This is an example of querying for a simple/complexPortableText
  field type. It should be known that without this approach, there
  were broken references in the query causing any internal links
  created in portable text content to be broken.
*/
import { ptContent } from 'data/utils'

export const richTextQuery = `_type == 'richText' => {
  _type,
  _key,
  heading,
  content[]{
    ${ptContent}
  }
}`

/*
  This is an example of querying a custom-image field, using this 
  util to feature ensure to include all underlying meta fields.
*/
import { imageMeta } from 'data/utils'

export const imageSliderQuery = `_type == 'imageSlider' => {
  _type,
  _key,
  title,
  slides[]{
    image{
      ${imageMeta}
    }
  }
}`
