import { imageMeta } from 'data/utils'

export const instructorListQuery = ` _type == 'instructorList' => {
    _type,
    heading,
    paragraph,
    instructors[]{
      name,
      description,
      link{
        title,
        "url": url.current,
        target
      },
      color,
      image {
        ${imageMeta}
      }
    }
  }`
