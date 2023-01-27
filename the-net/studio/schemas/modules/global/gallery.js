import { ImageSquare } from 'phosphor-react'

export default {
    title: 'GLOBAL - Gallery',
    name: 'gallery',
    type: 'object',
    icon: ImageSquare,
    fields: [
        {
            title: 'Images',
            name: 'images',
            type: 'array',
            of: [{ type: 'imageWithTitle' }]
        },
    ],
    preview: {
        prepare() {
            return {
                title: 'Gallery',
            }
        }
    }
}
