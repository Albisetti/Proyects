import { ListNumbers } from 'phosphor-react'

export default {
    title: 'FLOOR - Floor Container',
    name: 'floorContainer',
    type: 'object',
    icon: ListNumbers,
    fields: [
        {
            title: 'Floor Content',
            name: 'floorContent',
            type: 'floorContent'
        }
    ],
    preview: {
        prepare() {
            return {
                title: 'Floor Container'
            }
        }
    }
}