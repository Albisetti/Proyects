export const landingContainer = `_type == 'landingContainer' => {
    _type,
    _key,
    landingContent{
      title,
      subtitleBullets[],
      carousel{
        items[]{
          title,
          item[],
        },
      },
      'image': image.asset->url,
      galleryArrow,
    },
  }`
