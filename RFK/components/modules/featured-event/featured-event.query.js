export const featuredEventQuery = `_type == 'featuredEvent' => {
  _type,
  _key,
  event->{
    "category": category->title,
    "date": scheduledFor,
    speaker,
    "link": registrationLink{
      title,
      linkType == 'internal' => {
        "url": hrefInternal
      },
      linkType == 'external' => {
        "url": hrefExternal
      },
      target
    },
    featuredImage
  }
}`
