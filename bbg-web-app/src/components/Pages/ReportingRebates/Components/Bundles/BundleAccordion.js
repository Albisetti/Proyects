import React, { useState, useEffect } from "react";

const BundleAccordion = ({
  Data,
  component,
  onClick,
  fromAddress,
  closeAccordian = true,
  revealSearch,
  rebateReport,
  reset,
  selectedProducts
}) => {
  const [clicked, setClicked] = useState(false);

  const toggle = (index) => {

    if (clicked === index ) {
      //if clicked question is already active, then close it
      return setClicked(false);
    }
    setClicked(index);
  };

  useEffect(() => {
    if(reset === true) 
    setClicked()
  }, [reset])

  // useEffect(() => {
  //   if (revealSearch) {
  //     const updateScroll = function (e) {
  //       if (e.deltaY < 0) {
  //         revealSearch(true);
  //       } else if (e.deltaY > 0) {
  //         revealSearch(false);
  //       }
  //     };
  //     window.addEventListener("wheel", updateScroll);
  //     return function () {
  //       window.removeEventListener("wheel", updateScroll);
  //     };
  //   }
  //   // eslint-disable-next-line
  // }, []);


  return (
    <div className="flex flex-col w-full items-start justify-start bg-white">
      <div
        className={`overflow-auto w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 `}
      >
        {Data &&
          Data.length !== 0 &&
          Data.map((item, index) => {
          
            let arr2 = item?.node?.products?.edges?.map((item) => item?.node?.id);
            const found = selectedProducts?.some(r => arr2.includes(r?.node?.id));
            return (
              <div className={` ${rebateReport ? "border-l border-b border-l-white" : "border-b"}`}>
                <div
                  className={`flex group py-1 justify-between items-center w-full cursor-pointer transition-all border-l-4 hover:border-l-6  ${(clicked === index && closeAccordian) || found
                      ? "bg-gray-300 border-l-6 border-gold"
                      : "bg-white border-primary"
                    } `}
                  onClick={() => {
                    onClick(item);
                    toggle(index);

                  }}
                  key={index}
                >
                  <div className={`py-2 px-2 text-sm flex flex-col text-darkgray75   ${fromAddress && rebateReport ? "px-6" : "px-2"}`}>
                    <p className="font-semibold"> {item?.node?.name}</p> 
                    <p className="text-sm text-gray-500 capitalize">{item?.node?.type?.toLowerCase()}</p>
                  </div>
                  
                  <span className="mr-5">
                    {clicked === index && closeAccordian ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-secondary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : null}
                    {clicked !== index ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="opacity-0 transition-opacity duration-150 h-6 w-6 group-hover:opacity-100 text-secondary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    ) : null}
                  </span>
                </div>
                {clicked === index && closeAccordian ? (
                  <div className="bg-red w-full  flex flex-col justify-around  transition-all duration-1000 ">
                    {component}
                  </div>
                ) : null}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default BundleAccordion;
