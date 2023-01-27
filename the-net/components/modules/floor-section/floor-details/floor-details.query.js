export const floorDetailsQuery = `_type == 'floorDetails' => {
    _type,
    _key,
    floorsList[]{
        floorName,
        multipleFloors,
        lowestFloorHeight,
        highestFloorHeight,
        floorProperties[],
        "floorPlansPDF": floorPlansPDF.asset->url,
        "floorPlansImage": floorPlansImage.asset->url,
        "panoramicView": panoramicView.asset->url
    }
  }`
