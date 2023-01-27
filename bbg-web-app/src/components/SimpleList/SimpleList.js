import React from "react";

const SimpleList = ({ list, withButton, iconJSX,maxHeight,onClick,width }) => {
  return (
    <div className={"flex-1 flex flex-col "} >
        <ul className={`scrollbar-thin flex flex-col scrollbar-thumb-lightPrimary scrollbar-track-gray-400  overflow-auto`} style={{maxHeight:maxHeight}}>
          {list.map((item) => {
            return (
              <li className={`py-1 border-l-4 border-b border-l-${item.color?item.color:''}-500 px-5`}>
                <div className="grid items-center grid-cols-2">
                  <div className="min-w-0 max-w-xs col-start-1 col-span-2">
                    <p className="text-md font-medium text-primary ">{item.title? item.title:item}</p>
                  </div>
                  {withButton ? (
                    <div className="ml-5 col-start-3">
                      <button
                        type="button"
                        className="inline-flex items-center  border border-transparent rounded-full  text-white  focus:outline-none "
                      >
                        {iconJSX ? (
                          iconJSX
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-red-500 hover:text-red-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
    </div>
  );
};

export default SimpleList;
