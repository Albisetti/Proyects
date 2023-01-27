export const buildingInfo = `_type == 'buildingInfo' => {
    _type,
    _key,
    leftSection{
      title,
      items[],
      "document": document.asset->url,
      "background": background.asset->url,
    },
    rightSection{
      designFeatures{
        title,
        features[]{
          number,
          unit,
          subtitle,
        }
      },
      sustainability{
        title,
        subtitle,
        images[]{
          "image": image.asset->url,
          epigraph
        }
      },
    }
  }`
