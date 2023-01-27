import React from "react";

import TwoColumn from "./index";

const options = {
  title: "Layouts/TwoColumnLayout",
  component: TwoColumn,
  argTypes: {
    contentLeft: {
      control: { type: "text" },
    },
    contentRight: {
      control: { type: "text" },
    },
    contentLeftAlignment: {
      control: { type: "radio" },
    },
    contentRightAlignment: {
      control: { type: "radio" },
    },
  },
};
export default options;

const Template = (args) => <TwoColumn {...args} />;

export const TwoColumnLayout = Template.bind({});
TwoColumnLayout.args = {
  contentLeft: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  contentRight:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sodales nisi sed felis cursus, a congue est pharetra. Ut tincidunt, tortor a bibendum convallis, odio felis commodo sem, id mollis massa nisl quis ligula.",
  contentLeftAlignment: "text-left",
  contentRightAlignment: "text-left",
  flip: false,
};
