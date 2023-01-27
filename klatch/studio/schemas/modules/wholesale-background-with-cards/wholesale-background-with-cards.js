export default {
    title: 'Wholesale Background',
    name: 'wholesaleBackgroundWithCards',
    type: 'object',
    fields: [
        {
            title: 'Background',
            name: 'background',
            type: 'image',
        },
        {
            title: 'First Card',
            name: 'firstCard',
            type: 'card',
        },
        {
            title: 'Second Card',
            name: 'secondCard',
            type: 'card',
        },
        {
            title: 'Third Card',
            name: 'thirdCard',
            type: 'card'
        },
        {
            title: 'Mobile Background',
            name: 'mobileBackground',
            type: 'image',
        },
        {
            title: 'First Mobile Image',
            name: 'firstMobileImage',
            type: 'image',
        },
        {
            title: 'Second Mobile Image',
            name: 'secondMobileImage',
            type: 'image',
        },
        {
            title: 'Third Mobile Image',
            name: 'thirdMobileImage',
            type: 'image',
        }
    ],
    preview: {
        prepare() {
            return {
                title: 'Wholesale background with 3 cards on top',
            }
        }
    }
}