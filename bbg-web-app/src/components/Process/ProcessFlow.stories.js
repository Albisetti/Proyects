import React from 'react';
import ProcessFlow from './ProcessFlow';
import StoryRouter from 'storybook-react-router';

export default {
    title: 'BBG/Components/ProcessFlow',
    decorators: [StoryRouter()],
    component: ProcessFlow,
    argTypes: {
        completed:{ control: 'boolean' },
        current:{ control: 'boolean' },
        future:{ control: 'boolean' },
    }
}

const Template = (args) => <ProcessFlow {...args} />

export const Default = Template.bind({})
Default.args = {
    completed:true,
    current:false,
    future:true
}
