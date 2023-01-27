import React from 'react';
import Claims from './Claims';
import StoryRouter from 'storybook-react-router';


export default {
    
    title: 'BBG/Screens/Claims',
    decorators: [StoryRouter()],
    component: Claims,
    argTypes: {
        
    }
}

const Template = (args) => <Claims {...args} />


export const Default = Template.bind({})
Default.args = {
    edit:true,
    type:"factory",
    location:{ id:1,type:"factory", from:'history' }
}
