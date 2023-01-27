import React, { useState } from "react";
import BatchCorrectionAccordion from "./BatchCorrectionAccordion";

const BatchCorrectionSubdivisionAccordion = ({
    Data,
    fromAddress,
    closeAccordian = true,
    handleAccordianEachAddress,
    handleAccordianSubdivisionAddresses,
    activeAddresses,
    cleanUpAction,
}) => {
    const [clicked, setClicked] = useState([]);

    const toggle = (index) => {
        if (clicked.includes(index)) {
            //if clicked question is already active, then close it
            setClicked(clicked.filter((item) => item !== index));
        } else {
            setClicked([...clicked, index]);
        }
    };


    const component = (node, subdivisionName, subdivisionId) => {
        return (
            <BatchCorrectionAccordion
                Data={node}
                fromAddress
                rebateReport
                subdivisionName={subdivisionName}
                subdivisionId={subdivisionId}
                cleanUpAction={cleanUpAction}
                DataArray={Data}
                handleAccordianEachAddress={handleAccordianEachAddress}
                activeAddresses={activeAddresses}
            />
        );
    };

    return (
        <div className="flex flex-col w-full items-start justify-start bg-white">
            <div
                className={`overflow-auto w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 `}
            >
                {Data?.map((item, index) => {
                        let checked =item.houses.length > 0 && item.houses.map((item) => parseInt(item.house.id)).every((val) => activeAddresses?.map((item) => parseInt(item.id)).includes(val) );
                        return (
                            <div className={`border-b`}>
                                <div
                                    className={`flex group py-1 justify-between items-center w-full text-center cursor-pointer transition-all  border-l-4 hover:border-l-6 ${
                                        clicked.includes(index) &&
                                        closeAccordian
                                            ? "bg-gray-300 border-l-6 border-gold"
                                            : "bg-white border-primary"
                                    }`}
                                    key={index}
                                >
                                    <div className="flex w-full items-center px-2">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="checkSubdivision"
                                                name="checkSubdivision"
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => {
                                                    handleAccordianSubdivisionAddresses(
                                                        item.houses,
                                                        checked
                                                    );
                                                }}
                                                className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                                            />
                                        </div>
                                        <div
                                            className="py-2 px-2 w-full flex justify-between text-sm text-darkgray75 font-semibold"
                                            onClick={() => {
                                                toggle(index);
                                            }}
                                        >
                                            <p className="">{item.name}</p>
                                            <div
                                                className={`grid grid-cols-2 `}
                                            >
                                                <span className=" place-self-end">
                                                    {clicked.includes(index) &&
                                                    closeAccordian ? (
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
                                                    {!clicked.includes(
                                                        index
                                                    ) ? (
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
                                        </div>
                                    </div>
                                </div>
                                {clicked.includes(index) && closeAccordian ? (
                                    <div className="bg-red w-full  flex flex-col justify-around items-center transition-all duration-1000 ">
                                        {component(
                                            item.houses,
                                            item?.name,
                                            item?.id
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default BatchCorrectionSubdivisionAccordion;
