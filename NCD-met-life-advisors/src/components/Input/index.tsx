import React, { FC } from "react";

type InputProps = {
  action?: () => void;
  text?: string;
  type?: string;
  placeholderText?: string;
};

const Input: FC<InputProps> = ({
  text,
  placeholderText,
  type,
  action,
}: InputProps) => {
  return (
    <div className="flex flex-col">
      <label className="font-semibold">{text}</label>
      <input
        className="h-10 w-36 border-b border-solid border-b-navyBlue focus:outline-none"
        placeholder={placeholderText}
        type={type}
        onChange={() => action}
      />
    </div>
  );
};

export default Input;
