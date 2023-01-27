import { Article } from 'phosphor-react'

export default {
    title: 'FLOOR - Floor Content',
    name: 'floorContent',
    type: 'object',
    icon: Article,
    fields: [
        {
            title: 'Title',
            name: 'title',
            type: 'string'
        },
        {
            title: 'Subtitle',
            name: 'subtitle',
            type: 'string'
        },
        {
            title: 'Floors List',
            name: 'floorList',
            type: 'array',
            of: [{ type: 'string' }],

        }
    ],
    preview: {
        prepare() {
            return {
                title: 'Floor Content'
            }
        }
    }
}
