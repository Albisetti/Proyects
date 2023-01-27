import React from "react";

import Slider from "./index";

const options = {
  title: "Modules/Slider",
  component: Slider,
  argTypes: {
    slides: {
      control: { type: "file", accept: ".jpg" },
    },
    loop: {
      control: { type: "boolean" },
    },
    autoplay: {
      control: { type: "boolean" },
    },
    delay: {
      control: { type: "range", min: 1000, max: 12000, step: 1000 },
    },
    pagination: {
      control: { type: "boolean" },
    },
    content: {
      control: {
        type: "text",
      },
    },
  },
};
export default options;

const Template = (args) => <Slider {...args} />;

export const ImageSlider = Template.bind({});
ImageSlider.args = {
  slides: ["/img/pen-on-paper.jpg", "/img/person-writing.jpg"],
  loop: true,
  autoplay: true,
  delay: 6000,
  pagination: true,
};

export const ImageSliderWithContent = Template.bind({});
ImageSliderWithContent.args = {
  slides: ["/img/pen-on-paper.jpg", "/img/person-writing.jpg"],
  loop: true,
  autoplay: true,
  delay: 6000,
  pagination: true,
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eleifend vel mi ut ultricies.",
};
