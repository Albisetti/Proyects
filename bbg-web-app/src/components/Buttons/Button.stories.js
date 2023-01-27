import React from 'react';
import Button from './Button';

export default {
    title: 'BBG/Components/Button',
    component: Button,
    argTypes: {
        color: { control: 'text' },
        title: { control: 'text' },
        withIcon:{control:'boolean'},
        
    }
}

const Template = (args) => <Button {...args} />

export const Default = Template.bind({})
Default.args = {
    color:"primary",
    withIcon:false,
    title:'Primary',
}
