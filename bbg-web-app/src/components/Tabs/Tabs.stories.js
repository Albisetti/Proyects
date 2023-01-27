import React from 'react';
import ClickableTabs from './ClickableTabs';

export default {
    title: 'BBG/Components/Tabs',
    component: ClickableTabs,
    argTypes: {
        
    }
}

const Template = (args) => <ClickableTabs {...args} />

export const Default = Template.bind({})
Default.args = {
    tabs: [{
        name:'My Account',
    },{
        name:'Company'
    },{
        name:'Team'
    },{
        name:'Billing'
    }]
}
