// Import styles for Storybook
import "../styles/global.css";

// Import custom viewports for the Storybook canvas
import viewports from "./viewports";

// Use the unoptimized prop for Next.js Images in Storybook
import * as NextImage from "next/image";

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: { viewports },
};
