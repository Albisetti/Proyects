import { link } from 'data/utils'

export const fullBackgroundImageCTAQuery = `_type == 'fullBackgroundImageCTA' => {
  _type,
  _key,
  sections[]{
    _type == 'imageCTA' => {
        title,
        description,
        link,
        backgroundColor,
        "image": image.asset->url,
        whiteCTA,
        imageOnTheRight,
        secondarySection,
        quoteSlides[]{
          _type == 'slide' => {
            quote,
            authorTitle,
            author
          }
        },
        linkList{
          title,
          style,
          arrows,
          title,
          menu->{
            items[]{
              ${link}
            }
          },  
        }
    }
  }
}
`
