import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type ButtonProps = {
  url?: string;
  action?: () => void;
  text?: string;
  submit?: boolean;
  disabled?: boolean;
  mainPath?: boolean;
  loadingIcon?: boolean;
};

const Button: FC<ButtonProps> = ({
  url,
  action,
  text,
  submit = false,
  disabled = false,
  mainPath = false,
  loadingIcon = false,
}: ButtonProps) => {
  const navigate = useNavigate();
  const [loadingIconState, setLoadingIconState] = useState(loadingIcon);

  useEffect(() => {
    setLoadingIconState(loadingIcon);
  }, [loadingIcon]);

  return (
    <>
      {submit ? (
        <button
          type="submit"
          className={`flex h-full w-full cursor-pointer items-center justify-center rounded-full ${
            mainPath ? "bg-orange" : "bg-lightBlue disabled:bg-grey"
          } p-2 text-center text-white hover:shadow-lg disabled:cursor-default `}
          disabled={disabled}
        >
          {text}
        </button>
      ) : (
        <button
          type="button"
          className={`flex h-full w-full cursor-pointer items-center justify-center rounded-full ${
            mainPath ? "bg-orange" : "bg-lightBlue disabled:bg-grey"
          } ${loadingIconState && "disabled:bg-grey"} p-2 text-center text-white
          hover:shadow-lg disabled:cursor-default `}
          onClick={() => {
            if (action) action();
            if (url) navigate(url);
          }}
          disabled={disabled}
        >
          {loadingIconState ? (
            <svg
              className="h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <>{text}</>
          )}
        </button>
      )}
    </>
  );
};

export default Button;
