export default {
  title: 'Header Settings',
  name: 'headerSettings',
  type: 'document',
  fields: [
    {
      title: 'Navigation Menu Images',
      name: 'navMenuImages',
      type: 'object',
      options: { collapsible: true },
      fields: [
        {
          title: 'Sky Park Image',
          name: 'imgSkyPark',
          type: 'image'
        },
        {
          title: 'Floor Image',
          name: 'imgFloor',
          type: 'image'
        },
        {
          title: 'Amenities Image',
          name: 'imgAmenities',
          type: 'image'
        },
        {
          title: 'Building Image',
          name: 'imgBuilding',
          type: 'image'
        },
        {
          title: 'Location Image',
          name: 'imgLocation',
          type: 'image'
        },
        {
          title: 'Team Image',
          name: 'imgTeam',
          type: 'image'
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Header Settings'
      }
    }
  }
}
