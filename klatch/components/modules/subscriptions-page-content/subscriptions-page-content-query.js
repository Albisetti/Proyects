import { imageMeta } from 'data/utils'

export const subscriptionsPageContentQuery = (product) => {
  return `_type == 'subscriptionsPageContent' => {
    _type,
    _key,
    title,
    subtitle,
    leftImage{
      ${imageMeta}
    },
    rightImage{
      ${imageMeta}
    },
    subscriptionsDisplay{
      backgroundImage{
        ${imageMeta}
      },
      subscriptionPlans[]{
        planProduct->${product},
        giftDescription,
        planGifts[]{
          buttonTitle,
          giftPlanProduct->${product}
        }
      }
    }
  }`
}
