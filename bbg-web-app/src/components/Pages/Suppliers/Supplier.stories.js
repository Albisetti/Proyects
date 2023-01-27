import React from 'react';
import Supplier from './Supplier';
import StoryRouter from 'storybook-react-router';


export default {
    
    title: 'BBG/Screens/Supplier',
    decorators: [StoryRouter()],
    component: Supplier,
    argTypes: {
        
    }
}

const Template = (args) => <Supplier {...args} />


export const Default = Template.bind({})
Default.args = {
    edit:true

}
