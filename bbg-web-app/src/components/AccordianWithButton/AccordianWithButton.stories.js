import React from 'react';
import AccordianWithButton from './AccordianWithButton';

export default {
    title: 'BBG/Components/AccordianWithButton',
    component: AccordianWithButton,
    argTypes: {
        
    }
}

const Template = (args) => <AccordianWithButton {...args} />

const Data = [
    {
      name: "Program Name (Volume)",
      color: "red",
    },
    {
      name: "Program Name",
      color: "blue",
    },
    {
      name: "Program Name",
      color: "yellow",
    },
    {
      name: "Program Name (Volume)",
      color: "red",
    },
   
  ];

export const Default = Template.bind({})
Default.args = {
    Data:Data,
    component:"Accordian component"
}
