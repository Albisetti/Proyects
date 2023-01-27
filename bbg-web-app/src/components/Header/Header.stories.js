import React from 'react';
import Header from './Header';
import StoryRouter from 'storybook-react-router';

export default {
    title: 'BBG/Components/Header',
    decorators: [StoryRouter()],
    component: Header,
    argTypes: {
        
    }
}

const Template = (args) => <Header {...args} />

export const Default = Template.bind({})
Default.args = {
    
}
