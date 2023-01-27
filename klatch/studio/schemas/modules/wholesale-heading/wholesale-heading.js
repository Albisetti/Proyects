export default {
    title: 'Wholesale Heading',
    name: 'wholesaleHeading',
    type: 'object',
    fields: [
        {
            title: 'Title',
            name: 'title',
            type: 'string',
            validation: Rule => Rule.required()
        },
        {
            title: 'Subtitle',
            name: 'subtitle',
            type: 'string',
        },
        {
            title: 'First CTA',
            name: 'firstCTA',
            type: 'cta'
        },
        {
            title: 'Second CTA',
            name: 'secondCTA',
            type: 'cta'
        },
    ]
}