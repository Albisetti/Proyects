import React from "react";

import { addDecorator } from '@storybook/react';

import StorybookPreviewLayout from './StorybookPreviewLayout';

addDecorator((storyFn) => (
  <StorybookPreviewLayout>{storyFn()}</StorybookPreviewLayout>
));

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}