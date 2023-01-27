import React from 'react';
import ThreeColumns from './ThreeColumns';
import StoryRouter from 'storybook-react-router';   

export default {
    title: 'BBG/Layouts/ThreeColumn',
    component: ThreeColumns,
    decorators: [StoryRouter()],

    argTypes: {
        firstColumnTitle: { control: 'text' },
        secondColumnTitle: { control: 'text' },
        thirdColumnTitle: { control: 'text' }
    }
}

const Template = (args) => <ThreeColumns {...args} />

export const Default = Template.bind({})
Default.args = {
    firstColumnTitle: 'Bundles',
    secondColumnTitle: 'Programs',
    thirdColumnTitle: 'Bundle: Premier Fixtures Package'
}
