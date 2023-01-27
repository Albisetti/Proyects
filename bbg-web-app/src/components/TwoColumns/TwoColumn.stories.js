import React from 'react';
import TwoColumn from './TwoColumn';
import StoryRouter from 'storybook-react-router';   

export default {
    title: 'BBG/Layouts/TwoColumn',
    component: TwoColumn,
    decorators: [StoryRouter()],
    argTypes: {
        secondColumnTitle: { control: 'text' },
    }
}

const Template = (args) => <TwoColumn {...args} />

export const Default = Template.bind({})
Default.args = {
    secondColumnTitle: 'Supplier Sam Program',
}
