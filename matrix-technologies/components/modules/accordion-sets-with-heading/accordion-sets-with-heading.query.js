import { ptContent } from 'data/utils'

export const accordionSetsWithHeadingQuery = ` _type == 'accordionSetsWithHeading' => {
  _type,
  _key,
  heading,
  accordionSet[]{
    title,
    accordions[]{
      title,
      content[]{
        ${ptContent}
      }
    }
  },
  anchor
}`
