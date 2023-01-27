import React from "react";

const TextField = ({
  parentClass,
  label,
  textarea,
  type,
  name,
  id,
  placeholder,
  error,
  width,
  flex,
  disabled,
  value,
  onChange,
  defaultValue,
  required,
  autoFocus,
  errorMessage,
  errorClassName,
  inputClass,
  errorBelow,
  labelClass,
  isDollar,
  isPercent,
  min,
  max,
}) => {

  return (
    <div
      className={`${flex
        ? "flex flex-col sm:grid sm:grid-cols-3  items-start justify-between px-4 xl:px-4 sm:items-center w-full"
        : width ? "" : "w-full"
        } ${disabled ? "opacity-50" : ""} ${parentClass}`}
    >
      <label
        htmlFor={id}
        className={`block ${labelClass ? labelClass : "w-full"} text-md font-medium text-secondary`}
      >
        {label}
        {required ? <span className="text-brickRed">*</span> : null}
      </label>
      {textarea ?
        <div>
          <textarea
            onChange={onChange}
            disabled={disabled}
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            id={id}
            className={`mt-1 block ${width ? width : "w-full"} ${error ? "input-error" : "input-no-error"
              } focus:outline-none shadow-sm sm:text-sm rounded-md`}
          />
          {error && errorBelow ? (
            <p className="self-end mt-1  text-xs text-brickRed font-medium">
              {errorMessage}
            </p>
          ) : null}
        </div>
        :
        <div className={`relative ${inputClass}`}>
          <input
            onChange={onChange}
            disabled={disabled}
            type={type}
            name={name}
            value={value}
            defaultValue={defaultValue}
            autoFocus={autoFocus}
            placeholder={placeholder}
            id={id}
            className={` block ${width ? width : "w-full"} ${error ? "input-error" : "input-no-error"
              } focus:outline-none shadow-sm sm:text-sm ${isDollar ? "pl-5" : ""}  rounded-md`}
            min={min}
            max={max}
            onKeyUp={(event) => {
              if (!max) return
              if (!min) return

              if (event?.target?.value > parseInt(max)) {
                event.target.value = parseInt(max);
              } else if (event?.target?.value < parseInt(min)) {
                event.target.value = null;
              }
            }}
          />
          {isDollar ?
            <span className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none" style={{ paddingTop: "2px" }}>
              $
            </span> :
            ""
          }
          {isPercent ?
            <span className="absolute inset-y-0 right-2 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none" style={{ paddingTop: "2px" }}>
              %
            </span> :
            ""
          }
          {error && errorBelow ?
            <p className="self-end mt-1 absolute text-xs text-brickRed font-medium">
              {errorMessage}
            </p>
            : null}
        </div>
      }
      {error && !errorBelow ?
        <p className={`self-end pl-2 text-xs text-brickRed font-medium  ${errorClassName}`}>
          {errorMessage}
        </p>
        : null}
    </div>
  );
};

export default TextField;
