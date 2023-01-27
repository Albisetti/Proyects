import { ArrowsVertical } from 'phosphor-react'

export default {
    title: 'Vertical Navigation',
    name: 'verticalNav',
    type: 'object',
    icon: ArrowsVertical,
    fields: [
        { name: 'skyParkLabel', type: 'string', title: 'Sky Park Label' },
        { name: 'floorLabel', type: 'string', title: 'Floor Label' },
        { name: 'amenitiesLabel', type: 'string', title: 'Amenities Label' },
        { name: 'buildingLabel', type: 'string', title: 'Building Label' },
        { name: 'locationLabel', type: 'string', title: 'Location Label' },
        { name: 'teamLabel', type: 'string', title: 'Team Label' },
    ],
    preview: {
        prepare() {
            return {
                title: 'Vertical Navigation',
                subtitle: 'Displays the vertical navigation to the left of the building'
            }
        }
    }
}