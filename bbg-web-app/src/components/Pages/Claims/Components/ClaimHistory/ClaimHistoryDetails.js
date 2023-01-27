import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import {FETCH_CLAIM_HISTORY, FETCH_DISPUTE_CLAIM } from "../../../../../lib/claims";
import Loader from "../../../../Loader/Loader";
import { formatterForCurrency } from "../../../../../util/generic"
import {APP_TITLE} from "../../../../../util/constants";

const ClaimHistoryDetails = ({ claimId, type, claimData }) => {
    const [claim, setClaim] = useState();
    const [activeBuilder, setActiveBuilder] = useState();
    const [centerColumnList, setCenterColumnList] = useState();
    const [clicked, setClicked] = useState(false);
    const [builderExpandData, setBuilderExpandData] = useState();

    const toggle = (index) => {
        if (clicked === index) {
            //if clicked question is already active, then close it
            return setClicked(null);
        }

        setClicked(index);
    };

    useEffect(() => {
        if (claimId) {
            getEachClaim();
        }
        // eslint-disable-next-line
    }, [claimId]);

    const [getEachClaim, { loading: claimLoading }] = useLazyQuery(
        FETCH_CLAIM_HISTORY,
        {
            notifyOnNetworkStatusChange: false,
            variables: {
                id: claimId,
            },
            fetchPolicy: "no-cache",
            onCompleted: (data) => {
                if (data?.claim?.id) {
                    setClaim(data?.claim);
                }
            },
        }
    );

    const [getClaimForBuilder, { loading }] = useLazyQuery(
        FETCH_DISPUTE_CLAIM,
        {
            notifyOnNetworkStatusChange: false,
            variables: {
                id: claimId,
                orgId: activeBuilder?.builder_id,
            },
            fetchPolicy: "no-cache",
            onCompleted: (data) => {
                if (data?.claim?.id) {
                    setClaim(data?.claim);
                    normalizeTheList(
                        data?.claim?.houseProductsForBuilder?.edges
                    );
                }
            },
        }
    );

    const normalizeTheList = (edges) => {
        let houseIds = [];
        let finalHouseProductArray = [];
        edges?.forEach((item) => {
            if (!houseIds.includes(item?.node?.houses?.id)) {
                let object = {};
                object.house = item?.node?.houses;
                object.products = [
                    {
                        ...item?.node?.products,
                        product_quantity: item?.node?.product_quantity,
                        dispute: item?.node?.dispute,
                        pivotId: item?.node?.id,
                    },
                ];
                object.dispute = item?.node?.dispute;
                object.disputed = item?.node?.disputed;
                houseIds.push(item?.node?.houses?.id);
                finalHouseProductArray.push(object);
            } else {
                let arrayIndex = finalHouseProductArray.findIndex(
                    (element) => element?.house?.id === item?.node?.houses?.id
                );
                finalHouseProductArray[arrayIndex].products = [
                    ...finalHouseProductArray[arrayIndex].products,
                    {
                        ...item?.node?.products,
                        product_quantity: item?.node?.product_quantity,
                        dispute: item?.node?.dispute,
                        pivotId: item?.node?.id,
                    },
                ];
            }
        });
        setCenterColumnList(finalHouseProductArray);
    };

    const handleBuilderClick = (data) => {
        setActiveBuilder(data);
    };

    useEffect(() => {
        if (activeBuilder?.builder_id && claimId) {
            getClaimForBuilder();
        }
        // eslint-disable-next-line
    }, [activeBuilder, claimId]);

    return (
        <div className="flex-1 flex-col  flex items-stretch sm:flex-row  overflow-hidden">
            <div className="flex-grow w-full max-w-8xl mx-auto 2xl:flex">
                <div className="flex-1 min-w-0 md:flex">
                    <div className=" flex-1 2xl:max-w-xs 3xl:max-w-md xl:flex-shrink-0  ">
                        <div className="h-full">
                            <div className="h-full relative">
                                <div className=" inset-0  border bg-white border-gray-200 h-full flex flex-col">
                                    <div className="flex flex-0 px-4 py-4  border-b justify-between items-center">
                                        <div className="font-title text-center text-secondary font-bold text-lg">
                                            {"Builders Claiming"}
                                        </div>
                                    </div>

                                    <div className="flex overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 w-full h-full">
                                        <div className="w-full  border-l border-white border-r sm:max-h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                            <ul
                                                className=" flex-0 w-full  overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400"
                                                style={{
                                                    minHeight: "60vh",
                                                    maxHeight: "60vh",
                                                }}
                                            >
                                                {claimLoading ? (
                                                    <Loader />
                                                ) : (
                                                    claim?.calculateCurrentTotal?.builderTotals?.map(
                                                        (eachData, key) => {
                                                            return (
                                                                <li
                                                                    key={key}
                                                                    onClick={() => type === "FACTORY"?
                                                                        handleBuilderClick(
                                                                            eachData
                                                                        ) : {}
                                                                    }
                                                                    className={`py-3 pl-3 transition-all border-b border-l-4  hover:border-l-6 hover:bg-gray-100 ${
                                                                        type ===
                                                                        "FACTORY"
                                                                            ? "cursor-pointer"
                                                                            : ""
                                                                    } ${
                                                                        activeBuilder?.builder_id ===
                                                                        eachData?.builder_id
                                                                            ? "border-l-gold border-l-6"
                                                                            : eachData?.disputed
                                                                            ? "border-l-brickRed"
                                                                            : "border-l-primary"
                                                                    }`}
                                                                >
                                                                    <div className="relative  ">
                                                                        <div className="text-sm font-semibold text-darkgray75">
                                                                            <div className="focus:outline-none">
                                                                                {
                                                                                    eachData.name
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        }
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sm:flex-1 flex">
                        <div className=" flex-1 ">
                            <div className="h-full relative  md:pr-3 lg:pr-0 xl:pr-3 2xl:pr-0">
                                {type === "FACTORY" ? (
                                    <div className="inset-0  border  bg-white  h-full flex flex-col">
                                        <div className=" px-4 border-b">
                                            <div className="py-4 font-title  text-secondary font-bold text-lg flex justify-between">
                                                <p>
                                                    Rebate Report{" "}
                                                    {activeBuilder?.name
                                                        ? ": " +
                                                          activeBuilder?.name
                                                        : ""}
                                                </p>
                                                {loading ? (
                                                    <Loader
                                                        width={25}
                                                        height={25}
                                                    />
                                                ) : (
                                                    <p>
                                                        {
                                                            centerColumnList?.length
                                                        }{" "}
                                                        {centerColumnList?.length >
                                                        1
                                                            ? "Properties"
                                                            : "Property"}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col flex-1 overflow-auto w-full">
                                            <div
                                                style={{
                                                    minHeight: "60vh",
                                                    maxHeight: "60vh",
                                                }}
                                                className={`flex flex-col  h-full w-full scrollbar-thin overflow-auto scrollbar-thumb-lightPrimary scrollbar-track-gray-400`}
                                            >
                                                {loading ? (
                                                    <Loader />
                                                ) : (
                                                    centerColumnList?.map(
                                                        (eachData, key) => {
                                                            return (
                                                                <div
                                                                    key={key}
                                                                    className={`flex px-2 group justify-between py-3 w-full transition-all border-b  `}
                                                                >
                                                                    <div className="flex items-center">
                                                                        <p className="text-sm px-2  font-semibold text-darkgray75 ">
                                                                            {eachData
                                                                                ?.house
                                                                                ?.lot_number
                                                                                ? eachData
                                                                                      ?.house
                                                                                      ?.lot_number +
                                                                                  " | " +
                                                                                  eachData
                                                                                      ?.house
                                                                                      ?.address +
                                                                                  " " +
                                                                                  eachData
                                                                                      ?.house
                                                                                      ?.address2
                                                                                : eachData
                                                                                      ?.house
                                                                                      ?.address +
                                                                                  " " +
                                                                                  eachData
                                                                                      ?.house
                                                                                      ?.address2}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className=" px-4 border-b">
                                            <div className="py-4 font-title  text-secondary font-bold text-lg flex justify-between">
                                                <p>
                                                    Rebate Report:{" "}
                                                    {claim?.program?.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className=" flex-0 w-full scrollbar-thin overflow-auto scrollbar-thumb-lightPrimary scrollbar-track-gray-400"
                                            style={{
                                                minHeight: "60vh",
                                                maxHeight: "60vh",
                                            }}
                                        >
                                            {claimLoading ? (
                                                <Loader />
                                            ) : (
                                                claim?.calculateCurrentTotal?.builderTotals?.map(
                                                    (item, index) => {
                                                        return (
                                                            <div className="border-b px-4 py-2 cursor-pointer">
                                                                <div
                                                                    className="flex flex-row justify-between"
                                                                    onClick={() => {
                                                                        toggle(
                                                                            index
                                                                        );
                                                                        setBuilderExpandData(
                                                                            item
                                                                        );
                                                                    }}
                                                                    key={index}
                                                                >
                                                                    <div className="text-sm font-semibold text-darkgray75">
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </div>
                                                                    <span className="mr-5">
                                                                        {clicked ===
                                                                        index ? (
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
                                                                                className="h-6 w-6 text-secondary"
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
                                                                {clicked ===
                                                                index ? (
                                                                    <>
                                                                        <ul className="mt-1 mb-1 flex flex-col space-y-5 px-4">
                                                                            <li className="col-span-1 flex shadow-sm border rounded-md">
                                                                                <div
                                                                                    className={`flex-shrink-0 flex items-center justify-center w-48 text-secondary85 text-white text-lg font-medium rounded-l-md`}
                                                                                >
                                                                                    {
                                                                                        formatterForCurrency.format(builderExpandData?.builder_allocation)
                                                                                    }
                                                                                </div>
                                                                                <div className="flex-1 flex items-center justify-between border-l border-gray-200 bg-white rounded-r-md truncate">
                                                                                    <div className="flex-1 px-4 py-4 text-sm">
                                                                                        <div
                                                                                            to="#"
                                                                                            className="text-gray-900 font-medium hover:text-gray-600"
                                                                                        >
                                                                                            Builder
                                                                                            Allocation{" "}
                                                                                            {formatterForCurrency.format(builderExpandData?.builder_tier)}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                            <li className="col-span-1 flex shadow-sm border rounded-md">
                                                                                <div
                                                                                    className={`flex-shrink-0 flex items-center justify-center w-48 text-secondary85 text-white text-lg font-medium rounded-l-md`}
                                                                                >
                                                                                    {formatterForCurrency.format(
                                                                                        builderExpandData?.total -
                                                                                        builderExpandData?.builder_allocation
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex-1 flex items-center justify-between border-l border-gray-200 bg-white rounded-r-md truncate">
                                                                                    <div className="flex-1 px-4 py-4 text-sm">
                                                                                        <div
                                                                                            to="#"
                                                                                            className="text-gray-900 font-medium hover:text-gray-600"
                                                                                        >
                                                                                            {APP_TITLE}
                                                                                            Revenue
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                            <li className="col-span-1 flex shadow-sm border rounded-md">
                                                                                <div
                                                                                    className={`flex-shrink-0 flex items-center justify-center w-48 text-secondary85 text-white text-lg font-medium rounded-l-md`}
                                                                                >
                                                                                    {formatterForCurrency.format(builderExpandData?.total)}
                                                                                </div>
                                                                                <div className="flex-1 flex items-center justify-between border-l border-gray-200 bg-white rounded-r-md truncate">
                                                                                    <div className="flex-1 px-4 py-4 text-sm">
                                                                                        <div
                                                                                            to="#"
                                                                                            className="text-gray-900 font-medium hover:text-gray-600"
                                                                                        >
                                                                                            Total
                                                                                            to
                                                                                            claim
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                            <li className="col-span-1 flex shadow-sm border rounded-md">
                                                                                <div
                                                                                    className={`flex-shrink-0 flex items-center justify-center w-48 text-secondary85 text-white text-lg font-medium rounded-l-md`}
                                                                                >
                                                                                    {formatterForCurrency.format(
                                                                                        builderExpandData?.rebate_earned
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex-1 flex items-center justify-between border-l border-gray-200 bg-white rounded-r-md truncate">
                                                                                    <div className="flex-1 px-4 py-4 text-sm">
                                                                                        <div
                                                                                            to="#"
                                                                                            className="text-gray-900 font-medium hover:text-gray-600"
                                                                                        >
                                                                                            Rebate
                                                                                            Earned
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                            {builderExpandData?.rebate_adjusted ? (
                                                                                <li className="col-span-1 flex shadow-sm border rounded-md">
                                                                                    <div
                                                                                        className={`flex-shrink-0 flex items-center justify-center w-48 text-secondary85 text-white text-lg font-medium rounded-l-md`}
                                                                                    >
                                                                                        {formatterForCurrency.format(builderExpandData?.rebate_adjusted)}
                                                                                    </div>
                                                                                    <div className="flex-1 flex items-center justify-between border-l border-gray-200 bg-white rounded-r-md truncate">
                                                                                        <div className="flex-1 px-4 py-4 text-sm">
                                                                                            <div
                                                                                                to="#"
                                                                                                className="text-gray-900 font-medium hover:text-gray-600"
                                                                                            >
                                                                                                Rebate
                                                                                                Adjusted
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </li>
                                                                            ) : null}
                                                                        </ul>

                                                                        
                                                                        {builderExpandData?.rebate_adjusted ? (
                                                                            <p className="h2 font-title px-4">
                                                                                Reason
                                                                                Note
                                                                                :{" "}
                                                                                {
                                                                                    builderExpandData?.note
                                                                                }
                                                                            </p>
                                                                        ) : null}
                                                                    </>
                                                                ) : null}
                                                            </div>
                                                        );
                                                    }
                                                )
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" flex-1 2xl:max-w-xs 3xl:max-w-md">
                    <div className="h-full relative  md:pr-3 lg:pr-0 xl:pr-3 2xl:pr-0">
                        <div className="inset-0  border  bg-white   h-full flex flex-col">
                            <div className="flex flex-0 px-4 border-b justify-between items-center">
                                <div className="py-4 font-title text-center text-secondary font-bold text-lg">
                                    Summary
                                </div>
                                <div className="flex flex-0 px-4 justify-between items-center space-x-5">
                                    <div className="grid grid-cols-1 w-full ">
                                        {type === "FACTORY" ? null : (
                                            <div className="flex  justify-end items-center  space-x-5">
                                                <p className="font-title text-center text-secondary font-bold text-lg">
                                                    Total Payment
                                                </p>
                                                {claimLoading ? (
                                                    <Loader
                                                        width={25}
                                                        height={25}
                                                    />
                                                ) : (
                                                    <p className="font-title text-center text-secondary font-bold text-lg flex-1">
                                                        {formatterForCurrency.format(claim?.total_payment_rebate)}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex  justify-end items-center  space-x-5">
                                            <p className="font-title text-center text-secondary font-bold text-lg">
                                                Report total
                                            </p>
                                            {claimLoading ? (
                                                <Loader
                                                    width={25}
                                                    height={25}
                                                />
                                            ) : (
                                                <p className="font-title text-center text-secondary font-bold text-lg flex-1">
                                                    {formatterForCurrency.format(claim?.calculateCurrentTotal?.total)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-full flex justify-center items-start h2 font-title text-xl mt-5">
                                {claim?.status === "READYTOCLOSE" ||
                                claim?.status === "CLOSE"
                                    ? "Closed"
                                    : ""}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ClaimHistoryDetails;
