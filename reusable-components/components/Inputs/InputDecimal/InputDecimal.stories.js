import React from "react";

import { InputDecimal } from "./InputDecimal";

export default {
  title: "Inputs/InputDecimal",
  component: InputDecimal,
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <InputDecimal {...args} />;

export const SimpleTwoDecimalPlaces = Template.bind({});
SimpleTwoDecimalPlaces.args = {
  wholeNumbers: 16,
  decimals: 2,
  placeholder: "0.00",
};

export const SimpleFourDecimalPlaces = Template.bind({});
SimpleFourDecimalPlaces.args = {
  wholeNumbers: 4,
  decimals: 4,
  placeholder: "0.0000",
};

export const StyledTwoDecimalPlaces = Template.bind({});
StyledTwoDecimalPlaces.args = {
  wholeNumbers: 16,
  decimals: 2,
  placeholder: "0.00",
  className:
    "w-32 block outline-slate-100 pl-4 shadow-sm sm:text-sm rounded-md",
};

export const StyledFourDecimalPlaces = Template.bind({});
StyledFourDecimalPlaces.args = {
  wholeNumbers: 4,
  decimals: 4,
  placeholder: "0.0000",
  className:
    "w-32 block outline-slate-100 pl-4 shadow-sm sm:text-sm rounded-md",
};

export const TwoDecimalPlacesWithFunctionality = Template.bind({});
TwoDecimalPlacesWithFunctionality.args = {
  wholeNumbers: 4,
  decimals: 4,
  placeholder: "0.0000",
  onChangeFunction: () => {
    window.alert("You changed the value");
  },
};
