import React from 'react';
import Administrators from './Administrators';
import StoryRouter from 'storybook-react-router';

export default {
    title: 'BBG/Screens/Managing Adminstrators',
    component: Administrators,
    decorators: [StoryRouter()],
    argTypes: {
        
    }
}

const Template = (args) => <Administrators {...args} />

export const Default = Template.bind({})
Default.args = {
    edit:true,
    archieved:true
}
