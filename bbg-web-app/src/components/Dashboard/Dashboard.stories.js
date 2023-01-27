import React from 'react';
import Dashboard from './Dashboard';
import StoryRouter from 'storybook-react-router';


export default {
    title: 'BBG/Screens/Dashboard',
    decorators: [StoryRouter()],
    component: Dashboard,
    argTypes: {
        
    }
}

const Template = (args) => <Dashboard {...args} />

export const Default = Template.bind({})
Default.args = {
    
}
