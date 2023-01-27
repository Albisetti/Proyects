import React from 'react';
import CommonSelect from './CommonSelect';

export default {
    title: 'BBG/Components/Select',
    component: CommonSelect,
    argTypes: {   
    }
}


const Template = (args) => <CommonSelect {...args} />

export const Default = Template.bind({})
Default.args = {
     options: [
        { value: "Acme Co. Builders", label: "Acme Co. Builders" },
        { value: "Bob Builders", label: "Bob Builders" },
        { value: "Splice Master Builders", label: "Splice Master Builders" },
      ], 
      placeHolder:'Select Builders',
      isMulti:true
}
