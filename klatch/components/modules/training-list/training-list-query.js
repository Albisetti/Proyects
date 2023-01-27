import { imageMeta } from 'data/utils'

export const trainingListQuery = ` _type == 'tastingTrainingList' => {
    _type,
    heading,
    paragraphMobile,
    paragraphDesktop,
    categoryFilters[]->{
      title
    },
    items[]->{
      name,
      description,
      "category": category->title,
      "url": page->slug.current,
      image{
        ${imageMeta}
      },
      imageMobile{
        ${imageMeta}
      },
      imageDesktop{
        ${imageMeta}
      }
    }
  }`
