import { imageMeta, ptContent } from 'data/utils'

export const audienceGridQuery = `_type == 'audienceGrid' => {
  _type,
  _key,
  audiences[]->{
      _type,
      _id,
      title,
      photo{
        ${imageMeta}
      },
      description[]{
        ${ptContent}
      }
    },
  "backgroundImage": backgroundImage.asset->url,
}`
