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
    }
  }`