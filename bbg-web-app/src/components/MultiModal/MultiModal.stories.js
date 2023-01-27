import React,{useState} from 'react';
import MultiModal from './MultiModal';

export default {
    
    title: 'BBG/Components/MultiModal',
    component: MultiModal,
    argTypes: {
        
    }
}

const Template = (args) => <MultiModal {...args} />

const Content = () => {
    return(
        <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.
              </p>
            </div>
    )
}

const IconJSX = () => {
    return (
        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
    )
}

const onSubmit = () => {
    
}



export const Default = Template.bind({})
Default.args = {
    show:true,
    onSubmit:onSubmit,
    title:"Deactivate account",
    Content:(<Content/>),
    IconJSX:(<IconJSX/>),
    submitLabel:'Confirm',

}
