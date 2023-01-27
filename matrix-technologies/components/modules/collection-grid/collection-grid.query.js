import { sortFallbacks, ptContent } from 'data/utils';

export const collectionGridQuery = `_type == 'collectionGrid' => {
    _type,
    _key,
    "title": ^.title,
    "paginationLimit": *[_type == "shopSettings"][0].paginationLimit,
    "filter": *[_type == "shopSettings"][0].filter{
      isActive,
      groups[]{
        "id": _key,
        title,
        "slug": slug.current,
        display,
        options[]->{
          type,
          title,
          "slug": slug.current,
          "color": color->color
        }
      }
    },
    "sort": *[_type == "shopSettings"][0].sort{
      isActive,
      options[]{
        "slug": type,
        "title": coalesce(title, select(
          ${sortFallbacks}
        ))
      }
    },
    "noFilterResults": *[_type == "shopSettings"][0].noFilterResults[]{
      ${ptContent}
    },
  }`;