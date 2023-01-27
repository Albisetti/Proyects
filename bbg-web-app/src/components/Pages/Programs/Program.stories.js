import React from 'react';
import Program from './Program';
import StoryRouter from 'storybook-react-router';


export default {
    
    title: 'BBG/Screens/Program',
    decorators: [StoryRouter()],
    component: Program,
    argTypes: {
        
    }
}

const Template = (args) => <Program {...args} />


export const Default = Template.bind({})
Default.args = {
    
}
