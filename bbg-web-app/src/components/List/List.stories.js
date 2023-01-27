import React from 'react';
import List from './List';
import StoryRouter from 'storybook-react-router';

export default {
    title: 'BBG/Components/List',
    component: List,
    decorators: [StoryRouter()],
    argTypes: {
        compWrapper: { control: 'text' },
        subCompWrapper:{control:'text'},
        topTitle:{control:'boolean'},
        bottomButton:{control:'boolean'},
    }
}

const Template = (args) => <List {...args} />

export const Default = Template.bind({})
Default.args = {
    compWrapper: 'mt-8 max-w-8xl w-8xl mx-auto inset-0  border   border-gray-200  rounded-lg h-full',
    subCompWrapper: 'inset-0 overflow-hidden   rounded-lg h-full flex flex-col',
    topTitle:true,
    bottomButton:true
}
