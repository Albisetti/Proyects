import { PencilIcon } from "@heroicons/react/solid";
import React, { useState, useEffect } from "react";

const ClaimsAccordion = ({
    Data,
    component,
    onClick,
    closeAccordian = true,
    rebateReport,
    reset,
    editClick,
    claimNode
}) => {
    const [clicked, setClicked] = useState(false);

    const toggle = (index) => {
        if (clicked === index) {
            //if clicked question is already active, then close it
            return setClicked(false);
        }
        setClicked(index);
    };

    useEffect(() => {
        if (reset === true) setClicked();
    }, [reset]);

    return (
        <div className="flex flex-col w-full overflow-auto items-start h-full justify-start bg-white scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
            <div className={` w-full  `}>
                {Data &&
                    Data.length !== 0 &&
                    Data.map((item, index) => {
                        return (
                            <div
                                className={` ${rebateReport
                                    ? "border-l border-b border-l-white"
                                    : "border-b"
                                    }`}
                            >
                                <div
                                    className={`flex group py-1 justify-between items-center w-full text-center cursor-pointer transition-all  border-l-4 hover:border-l-6  ${clicked === index && closeAccordian
                                        ? "bg-gray-300 border-l-6 border-gold"
                                        : "bg-white border-primary"
                                        } `}
                                    onClick={() => {
                                        onClick(item);
                                        toggle(index);
                                    }}
                                    key={index}
                                >
                                    <div
                                        className={`py-2 px-2 text-sm text-darkgray75`}
                                    >
                                        <p className="font-semibold">
                                            {" "}

                                            {item?.name}

                                            {!isNaN(item?.factory_overwrite?.overwrite) ? <span className="text-brickGreen text-md "> (Overwritten)</span> : null}

                                        </p>
                                    </div>
                                    <span className="mr-5 flex">
                                        {clicked === index && closeAccordian ? (
                                            <>
                                                {claimNode?.status !== "PROCESSING" && claimNode?.status ===
                                                    "OPEN" && claimNode?.claim_type !== "VOLUME" ? (
                                                    <PencilIcon
                                                        className="w-5 h-5 mr-2 text-secondary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            editClick();
                                                        }}
                                                    />
                                                ) : null}
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
                                            </>
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

export default ClaimsAccordion;
