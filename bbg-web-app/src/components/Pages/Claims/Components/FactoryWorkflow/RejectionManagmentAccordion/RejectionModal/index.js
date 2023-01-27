import React, { useState } from "react";

const RejectionModal = ({ housesWithItsProducts, rebatesIds, setRebatesIds, setRejectionNote }) => {
    const [clicked, setClicked] = useState([]);

    const toggle = (index) => {
        if (clicked.includes(index)) {
            //if clicked question is already active, then close it
            setClicked(clicked.filter((item) => item !== index));
        } else {
            setClicked([...clicked, index]);
        }
    };

    const checkIfHouseShouldBeChecked = (products) => {
        return products.every((product) => {
            return rebatesIds.includes(product?.pivotId);
        });
    };

    const handleCheckHouse = (products, checked) => {
        let newRebatesIds = [];
        products?.forEach((eachData) => {
            newRebatesIds.push(eachData?.pivotId);
        });
        if (checked) setRebatesIds((current) => [...current, ...newRebatesIds]);
        else setRebatesIds(rebatesIds.filter((rebate) => !newRebatesIds.includes(rebate)));
    };

    const handleCheckProduct = (rebateId, checked) => {
        if (checked) setRebatesIds((current) => [...current, rebateId]);
        else setRebatesIds(rebatesIds.filter((rebate) => rebate !== rebateId));
    };

    const productsComponent = (products) => {
        return (
            <div className="w-full max-h-partial xl:max-h-smallMin sm:max-h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                <ul className=" flex-0 w-full  overflow-auto border-l  border-r border-white ">
                    {products?.map((eachData) => {
                        return (
                            <li
                                className={`bg-gray-50 pl-7 py-2 transition-all border-t  hover:border-l-6 border-l-gold border-l-6`}
                            >
                                <div className="group relative flex items-center">
                                    <div className="flex items-center h-5">
                                        <input
                                            id={`${eachData?.product_name}`}
                                            name={`${eachData?.product_name}`}
                                            type="checkbox"
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(event) =>
                                                handleCheckProduct(eachData?.pivotId, event?.target?.checked)
                                            }
                                            checked={rebatesIds.includes(eachData?.pivotId) ? true : false}
                                            className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                                        />
                                        <div className="text-sm flex-1 ml-2 font-semibold text-gray-500">
                                            <span className="" aria-hidden="true"></span>
                                            {eachData?.bbg_product_code ? eachData?.bbg_product_code + " - " : ""}{" "}
                                            {eachData?.name}{" "}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    {eachData?.programs?.length > 0 &&
                                        eachData?.programs?.map((item) => {
                                            return (
                                                <p className="px-6 flex text-xs text-gray-500">{item?.program_name}</p>
                                            );
                                        })}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    return (
        <div className="flex flex-col w-full items-start justify-start bg-white">
            <div
                className={`overflow-auto w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 `}
            >
                {housesWithItsProducts.map((item, index) => {
                    return (
                        <div className={` border-b`}>
                            <div
                                className={`flex group py-1 justify-between items-center w-full text-center cursor-pointer transition-all  border-l-4 hover:border-l-6  ${
                                    clicked.includes(index)
                                        ? "bg-gray-100 border-l-6 border-gold"
                                        : "bg-white border-primary"
                                } `}
                                onClick={() => {
                                    toggle(index);
                                }}
                                key={index}
                            >
                                <div className="flex w-full items-center pl-4">
                                    <div className="flex items-center h-5">
                                        <input
                                            id={`checkHouse-${item?.id}`}
                                            name={`checkHouse-${item?.id}`}
                                            type="checkbox"
                                            checked={checkIfHouseShouldBeChecked(item?.products)}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleCheckHouse(item?.products, event?.target?.checked);
                                            }}
                                            className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="flex flex-1 w-full">
                                        <div className={`py-2 px-2 text-sm flex w-full`}>
                                            <div className="flex flex-col items-start w-full">
                                                {item?.lot_number ? (
                                                    <p className="font-semibold text-gray-500">
                                                        Lot: {item?.lot_number}
                                                    </p>
                                                ) : null}

                                                {item?.address2 !== null && item?.address2?.trim() !== "" ? (
                                                    <div className="flex justify-between w-full">
                                                        <p className="font-semibold text-gray-500">
                                                            {item?.address2}{" "}
                                                            {item?.address ? " - " + item?.address : ""}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-between w-full">
                                                        <p className="font-semibold text-gray-500">{item?.address} </p>
                                                    </div>
                                                )}
                                                {item?.project_number ? (
                                                    <p className="text-gray-500 text-xs">
                                                        Project: {item?.project_number}
                                                    </p>
                                                ) : null}
                                                {item?.model ? (
                                                    <p className="text-gray-500 capitalize text-xs">
                                                        Build Model: {item?.model}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center w-full justify-end ">
                                    <span className="mr-5 ml-3">
                                        {clicked.includes(index) ? (
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
                                        {!clicked.includes(index) ? (
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
                            {clicked.includes(index) ? productsComponent(item?.products) : null}
                        </div>
                    );
                })}
            </div>
            <div className="w-full items-start justify-start bg-white">
                <div className="grid grid-cols-2 mt-5">
                    <label htmlFor="rejectionNote" className=" px-6 text-gray-700 font-medium text-lg mt-5">
                        Note:
                    </label>
                    <textarea
                        type="text"
                        name="rejectionNote"
                        id="rejectionNote"
                        placeholder="Note"
                        className={`w-10/12 mb-1 ml-2 pt-0.5 pb-0 pl-0.5 rounded-lg rounded-b-none min-w-0 border-0 border-b-2 border-gray-400 text-darkGray75 font-body text-md outline-none focus:outline-none focus:ring-0`}
                        onChange={(event) => setRejectionNote(event?.target?.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default RejectionModal;
