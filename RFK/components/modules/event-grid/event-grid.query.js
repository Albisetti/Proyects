export const eventGridQuery = `_type == 'eventGrid' => {
  _type,
  _key,
  title,
  layout,
  "events": *[_type == "event" && visibility == "visible" && dateTime(scheduledFor) >= dateTime(now())] | order(scheduledFor asc) [0..2]{
    featuredImage,
    title,
    "date": scheduledFor,
    registrationLink{
      title,
      linkType == "internal" => {
        "url": hrefInternal
      },
      linkType == "external" => {
        "url": hrefExternal
      },
      target
    }
  }
}`
