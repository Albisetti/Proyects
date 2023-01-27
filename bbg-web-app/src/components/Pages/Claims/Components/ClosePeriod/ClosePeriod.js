import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet";
import HelperModal from "../../../../Modal/HelperModal";
import {
    APPROVE_READY_TO_CLOSE_CLAIMS,
    CLOSE_PERIOD,
    CREATE_DUE_PAYMENT,
    FETCH_CLOSE_PERIOD_BUILDERS,
    FETCH_ORGANIZATION_DUE,
} from "../../../../../lib/closeperiod";
import Button from "../../../../Buttons";
import { DOWNLOAD_CLOSE_PERIOD_QUERY_FACTORY, DOWNLOAD_CLOSE_PERIOD_QUERY_VOLUME, GET_BUILDER_REBATES, GET_UNAVAILABLE_REBATES } from "../../../../../lib/claims";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import Loader from "../../../../Loader/Loader";
import { formatterForCurrency } from "../../../../../util/generic";
import Modal from "../../../../Modal";
import { InputDecimal } from "../../../../InputDecimal/InputDecimal";

import * as CSV from "csv-string";
import { APP_TITLE } from "../../../../../util/constants";

const ClosePeriod = ({ claimId, type, claimData }) => {
    const [activeBuilder, setActiveBuilder] = useState();
    const [centerColumnData, setCenterColumnData] = useState();
    const [buildersLeft, setBuildersLeft] = useState([]);
    const [showInputField, setShowInputField] = useState(false);
    const [amount, setAmount] = useState();
    const [finalApprovalClicked, setFinalApprovalClicked] = useState(false);
    const [filteredCsvData, setFilteredCsvData] = useState();
    const [filteredCsvDataOverwrite, setFilteredCsvDataOverwrite] = useState();
    const [clicked, setClicked] = useState();
    const [filteredCsvDataVolume, setFilteredCsvDataVolume] = useState();
    const [clickedVolume, setClickedVolume] = useState();
    const [showFinalApprovalModal, setShowFinalApprovalModal] = useState(false)
    const [amountPaid, setAmountPaid] = useState()
    const [finalApprovalNote, setFinalApprovalNote] = useState()



    const history = useHistory();

    useEffect(() => {
        getBuilders();

        // eslint-disable-next-line
    }, []);

    const [
        getBuilders,
        { data: builders, loading: buildersLoading },
    ] = useLazyQuery(FETCH_CLOSE_PERIOD_BUILDERS, {
        notifyOnNetworkStatusChange: false,
        fetchPolicy: "cache-and-network",
    });

    const [
        getBuilderRebates,
        { data: builderRebates },
    ] = useLazyQuery(GET_BUILDER_REBATES, {
        notifyOnNetworkStatusChange: false,
        fetchPolicy: "cache-and-network",
    });

    const [
        getUnavailableRebates,
        { data: unavailableRebates },
    ] = useLazyQuery(GET_UNAVAILABLE_REBATES, {
        notifyOnNetworkStatusChange: false,
        fetchPolicy: "cache-and-network",
    });


    useEffect(() => {
        setBuildersLeft(
            builders?.buildersWithClaimsDuringOldestUnclosedReportPeriod
        );
    }, [builders]);

    const [
        getCenterColumnData,
        { loading: organizationDueLoading },
    ] = useLazyQuery(FETCH_ORGANIZATION_DUE, {
        notifyOnNetworkStatusChange: false,
        variables: {
            id: activeBuilder?.id,
            year: buildersLeft?.year,
            quarter: buildersLeft?.quarter,
        },
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            setCenterColumnData(data?.organization);
            setAmountPaid(data?.organization?.calculateClaimTotal?.total)
        },
    });

    const handleBuilderClick = (data) => {
        setActiveBuilder(data);
        setFinalApprovalClicked(false);
    };

    useEffect(() => {
        if (activeBuilder?.id) {
            getCenterColumnData();
            getBuilderRebates({ variables: { orgId: activeBuilder?.id } });
            getUnavailableRebates();
        }
        // eslint-disable-next-line
    }, [activeBuilder?.id]);

    const [addDuePayment, { loading: duePaymentLoading }] = useMutation(CREATE_DUE_PAYMENT, {
        variables: {
            amount: amount,
            payment_year: buildersLeft?.year,
            payment_quarter: buildersLeft?.quarter,
            id: centerColumnData?.annualDue?.id,
        },
        update(cache, result) {
            setAmount("");
            toast.success("Due Payment Added");
            getCenterColumnData();
        },
    });

    const [finalApproval] = useMutation(APPROVE_READY_TO_CLOSE_CLAIMS, {
        variables: {
            org_id: activeBuilder?.id,
            year: buildersLeft?.year,
            quarter: buildersLeft?.quarter,
            paid: Number(amountPaid),
            owed: Number(centerColumnData?.calculateClaimTotal?.total),
            note: finalApprovalNote
        },
        update(cache, result) {
            setFinalApprovalClicked(true);
            setShowFinalApprovalModal(false)
        },
        onCompleted() {
            toast.info("Final Approval Queued")
            setTimeout(() => {
                getBuilders();
            }, 1500)
        }
    });

    const [closePeriod] = useMutation(CLOSE_PERIOD, {
        variables: {
            year: buildersLeft?.year,
            quarter: buildersLeft?.quarter,
        },
        update(cache, result) {
            toast.success(
                `Q${buildersLeft?.quarter}-${buildersLeft?.year} is closed!`
            );
            history.push({
                pathname: "/claims/claimhistory",
                state: { open: "claimHistory" },
            });
        },
    });

    useEffect(() => {
        let button = document.getElementById("csvDownloadFactory");
        let buttonOverwrites = document.getElementById("csvDownloadFactoryOverwrite");
        setTimeout(() => {
            if (filteredCsvData && clicked) {
                button.click();
            }
            if (filteredCsvDataOverwrite && clicked) {
                buttonOverwrites.click()
            }
        }, 1000);
    }, [filteredCsvData, filteredCsvDataOverwrite, clicked]);

    useEffect(() => {
        let button = document.getElementById("csvDownloadVolume");
        setTimeout(() => {
            if (filteredCsvDataVolume && clickedVolume) {
                button.click();
            }
        }, 1000);
    }, [filteredCsvDataVolume, clickedVolume]);

    const [downloadCSVQuery, { data: csvData, loading: csvLoading }] = useLazyQuery(DOWNLOAD_CLOSE_PERIOD_QUERY_FACTORY, {
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only",
        onCompleted: () => {
            const arr = csvData && csvData?.factoryAllocationCsv?.main && CSV.parse(csvData?.factoryAllocationCsv?.main);
            const str = arr && CSV.stringify(arr);
            if (str) {
                setFilteredCsvData(str);
            }
            if (csvData?.factoryAllocationCsv?.overwrite) {
                const arrOverwrite = csvData && csvData?.factoryAllocationCsv?.overwrite && CSV.parse(csvData?.factoryAllocationCsv?.overwrite);
                const strOverwrite = arrOverwrite && CSV.stringify(arrOverwrite);
                if (strOverwrite) {
                    setFilteredCsvDataOverwrite(strOverwrite);
                }
            }
            setClicked(true);
        },
        onError(error) {
            console.log(error)
        }
    });

    const [downloadCSVQueryVolume, { data: csvDataVolume, loading: csvLoadingVolume }] = useLazyQuery(DOWNLOAD_CLOSE_PERIOD_QUERY_VOLUME, {
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only",
        onCompleted: () => {
            const arr = csvDataVolume && csvDataVolume?.volumeAllocationCsv && CSV.parse(csvDataVolume?.volumeAllocationCsv);
            const str = arr && CSV.stringify(arr);
            if (str) {
                setFilteredCsvDataVolume(str);
            }
            setClickedVolume(true);
        },
    });

    const sortFirstColumn = (items) => {
        let copyItems = items?.slice();
        let sortedArray = copyItems?.sort((a, b) => a?.name?.localeCompare(b?.name));
        return sortedArray;
    };

    const sortSecondColumn = (items) => {
        let copyItems = items?.slice();
        let sortedArray = copyItems?.sort((a, b) => a?.builder?.name.localeCompare(b?.builder?.name));
        return sortedArray;
    };

    const handleInputChange = (callback, value) => {
        callback(value)
    }

    const checkIfRebatesAreAvailable = () => {
        let availableRebates = true;
        builderRebates?.ProductsFromOrganization?.forEach((rebate) => {
            if (unavailableRebates?.getUnavailableRebates?.includes(rebate?.id)) {
                availableRebates = false
            }
        });
        return availableRebates
    }

    const finalApprovalModal = () => {
        return (
            <>
                <Modal
                    onSubmit={() => {
                        if (checkIfRebatesAreAvailable()) {
                            finalApproval()
                        } else {
                            toast.error("Rebates are being processed try again later")
                        }
                    }}
                    title={"Final Approval"}
                    Content={finalApprovalModalContent()}
                    submitLabelColor={"primary"}
                    submitLabel={"Close Builder Claim"}
                    onClose={() => setShowFinalApprovalModal(false)}
                    disabled={!amountPaid ?? true}
                    show={showFinalApprovalModal}
                />
            </>
        );
    };

    const finalApprovalModalContent = () => {
        return (
            <div className="flex flex-col px-6">
                <div
                    className="flex items-center space-x-5 text-gray-500"
                >
                    <div className="grid grid-cols-2">
                        <div className="grid grid-cols-1">
                            <p className="px-6 text-gray-700 font-medium text-lg mt-5">Current total:</p>
                            <p className="px-6 text-secondary font-medium text-lg">
                                {formatterForCurrency.format(
                                    centerColumnData?.calculateClaimTotal?.total
                                )}
                            </p>
                        </div>
                        <div className="grid grid-cols-1">
                            <label htmlFor="claimTotalOverwrite" className=" text-gray-700 font-medium text-lg mt-5">
                                Amount Paid:
                            </label>
                            <div className="flex flex-row ">
                                <p
                                    className="text-secondary font-medium text-lg"
                                    style={{
                                        paddingTop: "1px",
                                    }}
                                >
                                    $
                                </p>
                                <InputDecimal
                                    name="amountPaid"
                                    id="amountPaid"
                                    placeholder="10.00"
                                    defaultValue={centerColumnData?.calculateClaimTotal?.total ? centerColumnData?.calculateClaimTotal?.total.toFixed(2) : null}
                                    className={`w-10/12 mb-1 pt-0.5 pb-0 pl-0.5 rounded-lg rounded-b-none min-w-0 border-0 border-b-2 border-gray-400 text-secondary font-medium text-lg outline-none focus:outline-none focus:ring-0`}
                                    onChangeFunction={(event) => {
                                        handleInputChange(setAmountPaid, event?.target?.value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 mt-10">
                    <label htmlFor="finalApprovalNote" className=" px-6 text-gray-700 font-medium text-lg mt-5">
                        Note:
                    </label>
                    <textarea
                        type="text"
                        name="finalApprovalNote"
                        id="finalApprovalNote"
                        placeholder="Note"
                        className={`w-10/12 mb-1 ml-2 pt-0.5 pb-0 pl-0.5 rounded-lg rounded-b-none min-w-0 border-0 border-b-2 border-gray-400 text-darkGray75 font-body text-md outline-none focus:outline-none focus:ring-0`}
                        onChange={(event) => {
                            handleInputChange(setFinalApprovalNote, event?.target?.value);
                        }}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex-col  flex  w-8xl mx-auto px-4 sm:px-6 lg:px-32  overflow-hidden">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Close Period</title>
            </Helmet>
            {finalApprovalModal()}

            <div className=" bg-white rounded-lg py-4  px-4 h1 flex w-full justify-between items-center">
                <div className="flex items-center">
                    <p>Close Period</p>

                    <HelperModal type={"closeperiod"} title="Close Period Information" />
                </div>
            </div>
            <div
                className="flex-grow w-full max-w-8xl mx-auto lg:flex mt-5 mb-5 space-x-5"
                style={{ minHeight: "79vh", maxHeight: "79vh" }}
            >
                <div className="flex-1 max-w-xs 3xl:max-w-md xl:flex-shrink-0 rounded-lg">
                    <div className="h-full">
                        <div className="h-full relative">
                            <div className=" inset-0  border bg-white border-gray-200 h-full flex flex-col rounded-lg">
                                <div className="flex flex-0 px-4 py-4  border-b justify-between items-center">
                                    <div className="font-title text-center text-secondary font-bold text-lg">
                                        Builders
                                    </div>
                                </div>

                                <div className="flex overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 w-full h-full">
                                    <div className="w-full  border-l border-white border-r sm:max-h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                        <ul className=" flex-0 w-full  overflow-auto">
                                            {buildersLoading ? (
                                                <Loader />
                                            ) : (
                                                sortFirstColumn(buildersLeft?.uncloseBuilders)?.map(
                                                    (eachData, key) => {
                                                        return (
                                                            <li
                                                                key={key}
                                                                onClick={() =>
                                                                    eachData?.isPeriodClosing ?
                                                                        null
                                                                        :
                                                                        handleBuilderClick(
                                                                            eachData
                                                                        )
                                                                }
                                                                className={`py-3 pl-3 ${eachData?.isPeriodClosing ? "bg-gray-200" : "hover:bg-gray-100 cursor-pointer hover:border-l-6"} transition-all border-b border-l-4 ${activeBuilder?.id ===
                                                                    eachData?.id
                                                                    ? "border-l-gold border-l-6"
                                                                    : "border-l-primary"
                                                                    } `}
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

                <div className="sm:flex-1 flex w-full">
                    <div className="h-full relative bg-white  border rounded-lg flex w-full">
                        {organizationDueLoading ? (
                            <div className="flex w-full items-center">
                                <Loader className={"w-full"} />
                            </div>
                        ) : !finalApprovalClicked ? (
                            buildersLeft?.quarter &&
                                buildersLeft?.year &&
                                centerColumnData ? (
                                <div className="inset-0 h-full flex flex-col w-full">
                                    <div className=" px-4 border-b">
                                        <div className="py-4 font-title  text-secondary font-bold text-lg flex justify-between">
                                            <p>
                                                Q{buildersLeft?.quarter}-
                                                {buildersLeft?.year} Allocation
                                            </p>
                                        </div>
                                    </div>
                                    {activeBuilder?.id ? (
                                        <div className="flex flex-col flex-1 overflow-auto w-full">
                                            <div
                                                className={`flex flex-col px-4  h-full w-full scrollbar-thin overflow-hidden scrollbar-thumb-lightPrimary scrollbar-track-gray-400`}
                                            >
                                                <div className="flex px-4 py-2 mt-2">
                                                    <div
                                                        className={`flex-shrink-0 w-1/2 flex px-2 items-center justify-start  text-secondary border text-lg font-medium rounded-l-md`}
                                                    >
                                                        {centerColumnData?.member_tier.replace("_", " ")}
                                                    </div>
                                                    <div className="flex w-1/2 items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                                                        <div className="flex-1  px-4 py-2 text-md">
                                                            <div className="text-gray-900 font-medium hover:text-gray-600">
                                                                Membership Tier
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex px-4 py-2 mt-2 ">
                                                    <div
                                                        className={`flex-shrink-0 w-1/2 flex px-2 items-center justify-start text-secondary border text-lg font-medium rounded-l-md`}
                                                    >
                                                        {formatterForCurrency.format(
                                                            centerColumnData?.annualDue?.prorated_amount
                                                                ? centerColumnData?.annualDue?.prorated_amount
                                                                : centerColumnData?.annualDue?.annual_dues
                                                                    ? centerColumnData?.annualDue?.annual_dues
                                                                    : 0
                                                        )}
                                                    </div>
                                                    <div className="flex w-1/2  items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                                                        <div className="flex-1 px-4 py-2 text-md">
                                                            <div className="text-gray-900 font-medium hover:text-gray-600">
                                                                Annual Dues
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex px-4 py-2 mt-2">
                                                    <div
                                                        className={`flex-shrink-0 flex w-1/2 px-2 items-center justify-start text-secondary border text-lg font-medium rounded-l-md`}
                                                    >
                                                        {centerColumnData?.annualDue ? formatterForCurrency.format(
                                                            centerColumnData?.annualDue?.totalPayedQuarter
                                                        ) : formatterForCurrency.format("0")}
                                                    </div>
                                                    <div className="flex w-1/2  items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                                                        <div className="flex-1 px-4 py-2 text-md">
                                                            <div className="text-gray-900 font-medium hover:text-gray-600">
                                                                Paid in {buildersLeft?.year}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex px-4 py-2 mt-2">
                                                    <div
                                                        className={`flex-shrink-0 w-1/2 flex px-2 items-center justify-start  text-secondary border text-lg font-medium rounded-l-md`}
                                                    >
                                                        {formatterForCurrency.format(
                                                            centerColumnData?.calculateClaimTotal?.factoryRebate
                                                        )}
                                                    </div>
                                                    <div className="flex w-1/2 items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                                                        <div className="flex-1 px-4 py-2 text-md">
                                                            <div className="text-gray-900 font-medium hover:text-gray-600">
                                                                Factory Rebate
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex px-4 py-2 ">
                                                    <div
                                                        className={`flex-shrink-0 w-1/2 flex px-2 items-center justify-start  text-secondary border text-lg font-medium rounded-l-md`}
                                                    >
                                                        {centerColumnData?.calculateClaimTotal?.volumeRebate === null
                                                            ? 0
                                                            : formatterForCurrency.format(
                                                                centerColumnData?.calculateClaimTotal?.volumeRebate
                                                            )}
                                                    </div>
                                                    <div className="flex w-1/2 items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                                                        <div className="flex-1 px-4 py-2 text-md">
                                                            <div className="text-gray-900 font-medium hover:text-gray-600">
                                                                Volume Rebate
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex px-4 py-2">
                                                    <div
                                                        className={`flex-shrink-0 w-1/2 flex px-2 items-center justify-start  text-secondary border text-lg font-medium rounded-l-md`}
                                                    >
                                                        {formatterForCurrency.format(
                                                            centerColumnData?.calculateClaimTotal?.duePayment
                                                        )}
                                                    </div>
                                                    <div className="flex w-1/2 items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                                                        <div className="flex-1 px-4 py-2 text-md">
                                                            <div className="text-gray-900 font-medium hover:text-gray-600">
                                                                Dues Payment
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex px-4 py-2 ">
                                                    <div
                                                        className={`flex-shrink-0 w-1/2 flex px-2 items-center justify-start text-secondary border text-lg font-medium rounded-l-md`}
                                                    >
                                                        {formatterForCurrency.format(
                                                            centerColumnData?.calculateClaimTotal?.total
                                                        )}
                                                    </div>
                                                    <div className="flex w-1/2 items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                                                        <div className="flex-1 px-4 py-2 text-md">
                                                            <div className="text-gray-900 font-medium hover:text-gray-600">
                                                                Total
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex px-4 py-2 mt-2">
                                                    <div className="flex flex-col mt-2">
                                                        <span
                                                            className=" text-secondary underline cursor-pointer"
                                                            onClick={() => setShowInputField(!showInputField)}
                                                        >
                                                            {" "}
                                                            Due Payment
                                                        </span>
                                                        {showInputField ? (
                                                            <div className="flex w-1/2 items-center space-x-2 relative">
                                                                <input
                                                                    id="duePayment"
                                                                    className={` block input-no-error  focus:outline-none shadow-sm sm:text-sm rounded-md pl-5`}
                                                                    name="duePayment"
                                                                    placeholder="1000"
                                                                    type="number"
                                                                    value={amount}
                                                                    onChange={(e) =>
                                                                        setAmount(parseFloat(e.target.value))
                                                                    }
                                                                />
                                                                <Button
                                                                    title={duePaymentLoading ? "Saving" : "Save"}
                                                                    color="primary"
                                                                    onClick={() => addDuePayment()}
                                                                />
                                                                <span
                                                                    className="absolute inset-y-0 left-0 bottom-1  flex items-center text-sm text-secondary pointer-events-none"
                                                                    style={{
                                                                        paddingTop: "3px",
                                                                    }}
                                                                >
                                                                    $
                                                                </span>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                    {activeBuilder?.id ? (
                                        <div className="flex items-center justify-center border-t">
                                            <Button
                                                title="Final Approval"
                                                color="primary"
                                                disabled={centerColumnData?.isPeriodClosing && !checkIfRebatesAreAvailable()}
                                                onClick={() => setShowFinalApprovalModal(true)}
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            ) : null
                        ) : null}
                    </div>
                </div>
                <div className="flex-1 2xl:max-w-xs 3xl:max-w-md">
                    <div className="h-full relative  md:pr-3 lg:pr-0 xl:pr-3 2xl:pr-0">
                        <div className="inset-0  border  bg-white   h-full flex flex-col rounded-lg">
                            {buildersLeft?.closeBuilders?.length > 0 ? (
                                <div className="flex flex-0 px-4 border-b justify-between items-center ">
                                    <div className="py-4 font-title text-center text-secondary font-bold text-lg">
                                        Approved
                                    </div>
                                </div>
                            ) : null}
                            <div className="flex h-full overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 w-full">
                                <div className="w-full  border-l border-white border-r sm:max-h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                    <ul className=" flex-0 w-full  overflow-auto">
                                        {buildersLoading ? (
                                            <Loader />
                                        ) : (
                                            sortSecondColumn(buildersLeft?.closeBuilders)?.map(
                                                (eachData, key) => {
                                                    return (
                                                        <li
                                                            key={key}
                                                            className={`py-3 pl-3 transition-all border-b border-l-4  hover:border-l-6 hover:bg-gray-100 ${activeBuilder?.id ===
                                                                eachData?.id
                                                                ? "border-l-gold border-l-6"
                                                                : "border-l-primary"
                                                                }`}
                                                        >
                                                            <div className="relative  ">
                                                                <div className="text-sm font-semibold text-darkgray75">
                                                                    <div className="focus:outline-none">
                                                                        {
                                                                            eachData
                                                                                ?.builder
                                                                                ?.name
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
                            {buildersLeft?.closeBuilders?.length > 0 ? (
                                <div className="flex items-center justify-end border-t">
                                    {buildersLeft?.uncloseBuilders?.length === 0 &&
                                        buildersLeft?.closeBuilders?.length > 0 ? (
                                        <Button
                                            title={`Close Q${buildersLeft?.quarter}-${buildersLeft?.year}`}
                                            color="primary hover:opacity-75"
                                            onClick={() => closePeriod()}
                                        />
                                    ) : null}
                                    {!clickedVolume ? (
                                        <Button
                                            title={`${csvLoadingVolume
                                                ? "Generating CSV"
                                                : "Volume CSV"
                                                }`}
                                            color="primary"
                                            onClick={() =>
                                                downloadCSVQueryVolume({
                                                    variables: {
                                                        year:
                                                            buildersLeft?.year,
                                                        quarter:
                                                            buildersLeft?.quarter,
                                                    },
                                                })
                                            }
                                        />
                                    ) : (
                                        <CSVLink
                                            data={
                                                filteredCsvDataVolume
                                                    ? filteredCsvDataVolume
                                                    : ""
                                            }
                                            asyncOnClick={true}
                                            className="text-white font-title bg-brickGreen   px-10 py-2 rounded-lg mr-2 ml-2 text-sm md:text-md"
                                            separator={","}
                                            onClick={() => {
                                                setClickedVolume(false);
                                                setFilteredCsvDataVolume("");
                                            }}
                                            id="csvDownloadVolume"
                                            filename={`${APP_TITLE} - Volume - Builder Allocations - Q${buildersLeft?.quarter}-${buildersLeft?.year
                                                } - ${new Date()?.toISOString()?.substr(0, 10)}.csv`}
                                            target="_blank"
                                        >
                                            Saving CSV
                                        </CSVLink>
                                    )}
                                    {!clicked ? (
                                        <Button
                                            title={`${csvLoading
                                                ? "Generating CSV"
                                                : "Factory CSV"
                                                }`}
                                            color="primary"
                                            onClick={() =>
                                                downloadCSVQuery({
                                                    variables: {
                                                        year:
                                                            buildersLeft?.year,
                                                        quarter:
                                                            buildersLeft?.quarter,
                                                    },
                                                })
                                            }
                                        />
                                    ) : (
                                        <>
                                            <CSVLink
                                                data={
                                                    filteredCsvData
                                                        ? filteredCsvData
                                                        : ""
                                                }
                                                asyncOnClick={true}
                                                className="text-white font-title bg-brickGreen   px-10 py-2 rounded-lg mr-2 ml-2 text-sm md:text-md"
                                                separator={","}
                                                onClick={() => {
                                                    setClicked(false);
                                                    setFilteredCsvData("");
                                                }}
                                                id="csvDownloadFactory"
                                                filename={`${APP_TITLE} - Factory - Builder Allocations - Q${buildersLeft?.quarter}-${buildersLeft?.year
                                                    } - ${new Date()?.toISOString()?.substr(0, 10)}.csv`}
                                                target="_blank"
                                            >
                                                Saving CSV
                                            </CSVLink>

                                            <CSVLink
                                                data={
                                                    filteredCsvDataOverwrite
                                                        ? filteredCsvDataOverwrite
                                                        : ""
                                                }
                                                asyncOnClick={true}
                                                className="hidden"
                                                separator={","}
                                                onClick={() => {
                                                    setClicked(false);
                                                    setFilteredCsvDataOverwrite("");
                                                }}
                                                id="csvDownloadFactoryOverwrite"
                                                filename={`${APP_TITLE} - Factory - Builder Overwrites Allocations - Q${buildersLeft?.quarter}-${buildersLeft?.year
                                                    } - ${new Date()?.toISOString()?.substr(0, 10)}.csv`}
                                                target="_blank"
                                            >
                                                Saving CSV
                                            </CSVLink>
                                        </>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ClosePeriod;
