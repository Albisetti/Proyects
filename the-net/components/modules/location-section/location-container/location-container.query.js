export const locationContainerQuery = `_type == 'locationContainer' => {
    _type,
    _key,
    locationContent{
      title,
      firstDescription,
      mapButtonText,
      secondDescription,
      waterfrontButtonText,
      mapSettings,
      waterfrontSection{
        description,
        slideImages[]{
          imageTitle,
          "image": image.asset->url
        }
      }
    },
  }`
