import React from "react";
import Checkbox from "./index";

const options = {
  title: "Inputs/CustomCheckbox",
  component: Checkbox,
  argTypes: {
    name: {
      control: { type: "text" },
    },
    label: {
      control: { type: "text" },
    },
    checked: {
      control: { type: "boolean" },
    },
    size: {
      control: { type: "text" },
    },
  },
};
export default options;

const Template = (args) => <Checkbox {...args} />;

export const CustomCheckbox = Template.bind({});
CustomCheckbox.args = {
  name: "signUp",
  label: "Sign Up",
  checked: false,
  size: "",
};
