import { imageMeta } from 'data/utils'

export const videoQuery = `_type == 'video' => {
  _type,
  _key,
  videoType == "upload" => {
    "url": videoUpload.asset->url
  },
  videoType == "embed" => {
    "url": videoEmbedURL
  },
  previewImage{
    ${imageMeta}
  },
  anchor
}`
