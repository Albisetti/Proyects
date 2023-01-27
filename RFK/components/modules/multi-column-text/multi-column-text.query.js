import { ptContent } from 'data/utils'

export const multiColumnTextQuery = `_type == 'multiColumnText' => {
  _type,
  _key,
  title,
  includeTopBorder,
  textColumns[]{
    content[]{
      ${ptContent}
    }
  }
}
`
