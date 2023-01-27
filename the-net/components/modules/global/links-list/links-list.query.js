import { link } from 'data/snippets'

export const linksList = `_type == 'linksList' => {
    _type,
    _key,
    links[]{${link}},
    linksAlignment,
  }`
