import { useEffect, useState } from "react";

export function useWindowSizeAdjustments() {
  const [windowWidth, setWindowWidth] = useState(undefined);
  const [windowHeight, setWindowHeight] = useState(
    undefined
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("resize", handleResize);

    handleResize();

    // Custom css property to handle mobile browser bars.
    const vh = innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const windowIsLoaded = windowWidth !== undefined;

  function handleResize() {
    const innerWidth = window.innerWidth >= 1920 ? 1920 : window.innerWidth;
    const innerHeight = window.innerHeight;

    setWindowWidth(innerWidth);
    setWindowHeight(innerHeight);

    // Only update vh on desktop, to prevent content shifting on mobile due to browser bars.
    if (innerHeight >= 1024) {
      const vh = innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    const vw = innerWidth * 0.01;
    document.documentElement.style.setProperty("--vw", `${vw}px`);
  }

  return {
    windowWidth,
    windowHeight,
    windowIsLoaded,
    isDesktop: windowIsLoaded && windowWidth >= 1024,
  };
}
