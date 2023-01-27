import React, { useState } from "react";

import RejectedRebateAccordion from "../RejectedRebateAccordion";
import { sortSubdivisionPrepareRebates } from "../../../../../../util/sort";

const RejectedSubdivisionsAccordion = ({ rebates }) => {
    const [clicked, setClicked] = useState([]);

    const toggle = (index) => {
        if (clicked?.includes(index)) {
            //if clicked question is already active, then close it
            setClicked(clicked?.filter((item) => item !== index));
        } else {
            setClicked([...clicked, index]);
        }
    };

    return (
        <div className="flex flex-col w-full items-start justify-start bg-white col-span-4">
            <div className={`w-full scrollbar-thumb-lightPrimary scrollbar-track-gray-400 `}>
                {sortSubdivisionPrepareRebates(rebates)?.map((item, index) => {
                    return (
                        <div className={`border-b`}>
                            <div
                                className={`flex group py-1 justify-between items-center w-full text-center cursor-pointer transition-all  border-l-4 hover:border-l-6 
                  ${
                      clicked?.includes(index) //Condition
                          ? "bg-gray-300 border-l-6 border-gold"
                          : "bg-white border-primary"
                  }`}
                                onClick={() => {
                                    toggle(index);
                                }}
                                key={index}
                            >
                                <div className="flex w-full items-center px-2">
                                    <div className="py-2 px-2 w-full flex justify-between text-sm text-darkgray75 font-semibold">
                                        <p className="">{item?.subdivisionName}</p>
                                        <div className={`flex items-start ${item?.houses?.length < 2 && "pr-3"}`}>
                                            <p>
                                                {" "}
                                                {item?.houses?.length > 1 // if more than 1 house
                                                    ? `(${item?.houses?.length} Properties)`
                                                    : `(${item?.houses?.length} Property)`}{" "}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <span className="mr-5">
                                    {clicked?.includes(index) ? (
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
                                    ) : (
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
                                    )}
                                </span>
                            </div>
                            {clicked?.includes(index) && (
                                <div className="bg-red w-full   flex flex-col justify-around items-center transition-all duration-1000 ">
                                    <RejectedRebateAccordion houses={item?.houses} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RejectedSubdivisionsAccordion;
