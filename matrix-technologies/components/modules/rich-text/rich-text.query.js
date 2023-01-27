import { ptContent } from 'data/utils'

export const richTextQuery = `_type == 'richText' => {
  _type,
  _key,
  content[]{
    ${ptContent}
  },
  contentAlignment,
  anchor
}`
