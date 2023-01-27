import React, { useState, useEffect } from "react";

const AlertAccordian = ({ Data, component, onClick, reset }) => {
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

    const renderNames = (item) => {
        switch (item) {
            case "Period is confirmed as closed":
                return "Period Closed";
            case "Program About To Expire":
                return "Program About to Expire";
            case "Conversion Hit":
                return "Conversion Condition Met";
            case "TM Assignment":
                return "Territory Manager's Builder Assignment";
            case "New Program added":
                return "New Program Added";
            case "Program Has Started":
                return "Program Has Started";
            case "Program Has Ended":
                return "Program Has Ended";
            case "builder first bundle":
                return "Builder First Bundle Created";
            case "New Subdivision added":
                return "New Subdivision Added";
            case "Custom Program":
                return "Custom Program Created";
            case "Dispute initiated":
                return "Dispute Initiated";
            default:
                return item;
        }
    };

    return (
        <div className="flex flex-col w-full items-start justify-start bg-white">
            <div
                className={`overflow-auto w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 `}
            >
                {Data &&
                    Data.length !== 0 &&
                    Data.map((item, index) => {
                        return (
                            <div className={` "border-l border-b border-l-white" : "border-b"}`}>
                                <div
                                    className={`flex group py-1 justify-between items-center w-full text-center cursor-pointer transition-all  border-l-4 hover:border-l-6  ${
                                        clicked === index
                                            ? "bg-gray-300 border-l-6 border-gold"
                                            : "bg-white border-primary"
                                    } `}
                                    onClick={() => {
                                        onClick(item);
                                        toggle(index);
                                    }}
                                    key={index}
                                >
                                    <div className={`py-2 px-2 text-sm text-darkgray75 `}>
                                        <p className="font-semibold"> {renderNames(item)}</p>
                                    </div>
                                    <span className="mr-5 flex items-center">
                                        {clicked === index ? (
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
                                {clicked === index ? (
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

export default AlertAccordian;
