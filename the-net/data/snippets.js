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
    "url": hrefInternal
  },
  linkType == "external" => {
    "url": hrefExternal
  },
  target,
  arrowLink,
  menuSlug,
`
