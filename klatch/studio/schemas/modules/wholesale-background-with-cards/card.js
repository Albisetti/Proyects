export default {
    title: 'Card',
    name: 'card',
    type: 'object',
    fields: [
        {
            title: 'Card Image',
            name: 'cardImage',
            type: 'image',
        },
        {
            title: 'Card Content',
            name: 'cardContent',
            type: 'complexPortableText'
        }
    ]
}