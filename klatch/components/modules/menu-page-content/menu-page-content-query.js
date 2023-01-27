import { imageMeta } from 'data/utils'

const filterQuery = 'title, "slug": slug.current'

export const menuPageContentQuery = `_type == 'menuPageContent' => {
    _type,
    _key,
    title,
    leftButtonTitle,
    leftButtonLink,
    rightButtonTitle,
    rightButtonLink,
    categories[]{
      name,
      filter->{
        ${filterQuery}
      },
      subCategories[]{
        title,
        filter->{
          ${filterQuery}
        }
      }
    },
    sampleCoffees[]{
      title,
      filters[]->{
        ${filterQuery}
      },
      items[]{
        name,
        image{
          ${imageMeta}
        }
      }
    }
  }`
