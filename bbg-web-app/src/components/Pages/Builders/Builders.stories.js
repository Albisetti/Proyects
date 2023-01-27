import React from 'react';
import Builders from './Builders';
import StoryRouter from 'storybook-react-router';


export default {
    
    title: 'BBG/Screens/Builders',
    decorators: [StoryRouter()],
    component: Builders,
    argTypes: {
        
    }
}

const Template = (args) => <Builders {...args} />


export const Default = Template.bind({})
Default.args = {

    location:{ id:1,type:"factory", from:'history' }
}