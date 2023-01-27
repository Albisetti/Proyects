export const timelineQuery = `_type == 'timeline' => {
  _type,
  _key,
  title,
  description,
  timeEvents[]{
    date,
    description,
    "image": image.asset->url
  }
}`
