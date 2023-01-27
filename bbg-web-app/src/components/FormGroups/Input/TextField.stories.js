import React from 'react';
import TextField from './TextField';

export default {
    title: 'BBG/FormGroup/Input',
    component: TextField,
    argTypes: {
        
    }
}

const Template = (args) => <TextField {...args} />

export const Default = Template.bind({})
Default.args = {
    parentClass:"w-96",
    label:'Email',
    labelSize:'sm',
    labelColor:'primary',
    labelWeight:'medium',
    type:'email',
    id:'email',
    name:'email',
    placeholder:'Enter Email',
    error:false,
}
