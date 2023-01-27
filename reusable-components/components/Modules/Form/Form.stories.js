import React from "react";

import Form from "./index";

const options = {
  title: "Modules/FormWithValidation",
  component: Form,
  argTypes: {
    className: {
      control: { type: "text" },
    },
  },
};
export default options;

const Template = (args) => <Form {...args} />;

export const FormWithValidation = Template.bind({});
FormWithValidation.args = {
  className: "w-[800px] max-w-full mx-auto",
};
