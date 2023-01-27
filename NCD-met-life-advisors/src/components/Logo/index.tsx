import React, { FC } from "react";

type LogoProps = {
  url?: string;
};

const Logo: FC<LogoProps> = ({ url }: LogoProps) => {
  return <img src={url} className="h-full w-40 pr-3" alt="NCD Logo" />;
};

export default Logo;
