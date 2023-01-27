import { link } from 'data/utils'

export const columnsWithLinksQuery = `
_type == 'columnsWithLinks' => {
  _type,
  _key,
  title,
  columns[]{
    linkItems[]{
      title,
      menu->{
        items[]{
          ${link}
        }
      }
    }
  }
}`
