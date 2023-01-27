import React from "react";

const Button = ({ color, withIcon, title,parentClass,onClick,buttonClass,disabled }) => {
  return (
    <div className={parentClass}>
      <div className={`flex gap-2   sm:flex-row ${buttonClass? buttonClass: "p-2"}`}>
        <button
          disabled={disabled}
          onClick={onClick}
          className={`px-5 break-words flex items-center py-1 transition-colors duration-150  disabled:opacity-50 rounded-lg focus:outline-none  text-white  bg-${color} hover:text-white ${disabled? "opacity-25 cursor-not-allowed":"" }`}
        >
          {withIcon ? (
            <div>
            <svg className={`h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            </div>
          ) : null}
          <div className="p-1 font-title text-sm md:text-md">{title}</div>
        </button>
      </div>
    </div>
  );
};

export default Button;
