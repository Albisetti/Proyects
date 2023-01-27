import React from 'react';
import Accordian from './Accordian';

export default {
    title: 'BBG/Components/Accordian',
    component: Accordian,
    argTypes: {
        
    }
}

const Template = (args) => <Accordian {...args} />

const Data = [
    {
      question: "Program Name (Volume)",
      color: "red",
    },
    {
      question: "Program Name",
      color: "blue",
    },
    {
      question: "Program Name",
      color: "yellow",
    },
    {
      question: "Program Name (Volume)",
      color: "red",
    },
   
  ];

export const Default = Template.bind({})
Default.args = {
    Data:Data,
    component:"Accordian component"
}
