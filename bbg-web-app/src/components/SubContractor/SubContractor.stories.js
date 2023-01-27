import React from 'react';
import SubContractor from './SubContractor';
import StoryRouter from 'storybook-react-router';   

export default {
    decorators: [StoryRouter()],

    title: 'BBG/Screens/Subcontractors',
    component: SubContractor,
    argTypes: {
        
    }
}

const Template = (args) => <SubContractor {...args} />

export const Default = Template.bind({})
Default.args = {
    
}
