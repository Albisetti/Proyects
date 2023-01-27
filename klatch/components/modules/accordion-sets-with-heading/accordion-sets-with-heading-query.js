export const accordionSetsWithHeadingQuery = ` _type == 'accordionSetsWithHeading' => {
    _type,
    heading,
    accordionSet[]{
      title,
      accordions[]{
        title,
        content
      }
    }
  }`
