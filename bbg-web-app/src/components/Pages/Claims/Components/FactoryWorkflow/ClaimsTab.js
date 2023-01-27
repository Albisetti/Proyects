import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useState, useEffect } from "react";
import {
    GET_CLAIM_FOR_JUST_TOTAL,
    GET_CLAIM_PER_STATUS,
    UPDATE_CLAIM_SUBMIITED,
} from "../../../../../lib/factoryworkflow";
import Loader from "../../../../Loader/Loader";
import Modal from "../../../../Modal";
import { formatterForCurrency } from "../../../../../util/generic";
import { toast } from "react-toastify";
import * as CSV from "csv-string";
import { CSVLink } from "react-csv";
import {
    DOWNLOAD_CLOSE_PERIOD_QUERY_FACTORY,
    DOWNLOAD_CLOSE_PERIOD_QUERY_FACTORY_CLAIM_ID_ONLY,
    UPDATE_CLAIM_TOTAL_MANUAL_OVERWRITE,
} from "../../../../../lib/claims";
import { APP_TITLE } from "../../../../../util/constants";

export const ClaimsTab = ({ openDisputeTab, openRejectedRebatesTab, claimType = "FACTORY" }) => {
    const [showModal, setShowModal] = useState(false);
    const [id, setId] = useState();
    const [thirdColumnId, setThirdColumnId] = useState();
    const [openDispute, setOpenDispute] = useState();
    const [approveClaimNode, setApproveClaimNode] = useState();
    const [filteredCsvData, setFilteredCsvData] = useState();
    const [filteredCsvDataReadyForSubmittal, setFilteredCsvDataReadyForSubmittal] = useState();
    const [filteredCsvDataFactoryOverwrite, setFilteredCsvDataFactoryOverwrite] = useState();
    const [clicked, setClicked] = useState();
    const [downloadId, setDownloadId] = useState();
    const [csvGenerated, setCsvGenerated] = useState(false);
    const [quarterYear, setQuarterYear] = useState({});
    const [overwriteTotalClaimValue, setOverwriteTotalClaimValue] = useState();

    const moveToSubmitted = (id) => {
        setId(id);
    };

    useEffect(() => {
        if (id) {
            submitClaim();
        }
        // eslint-disable-next-line
    }, [id]);

    const [submitClaim] = useMutation(UPDATE_CLAIM_SUBMIITED, {
        variables: {
            status: "SUBMITTED",
            id: id,
        },
        update(cache, result) {
            getReadyClaimsPerStatus({
                variables: {
                    status: ["READY"],
                    claim_type: claimType,
                },
            });
            getSubmittedDisputedClaimsPerStatus({
                variables: {
                    status: ["SUBMITTED", "DISPUTED"],
                    claim_type: claimType,
                },
            });
        },
    });

    useEffect(() => {
        let button = document.getElementById("csvDownloadModal");
        setTimeout(() => {
            if (filteredCsvData && clicked) {
                button.click();
            }
        }, 1000);
    }, [filteredCsvData, clicked]);

    useEffect(() => {
        let button = document.getElementById(`csvDownloadFactory-${downloadId}`);
        let buttonOverwrite = document.getElementById(`csvDownloadFactoryOverwrite-${downloadId}`);

        setTimeout(() => {
            if (button && filteredCsvDataReadyForSubmittal && csvGenerated) {
                button.click();
            }
            if (buttonOverwrite && filteredCsvDataFactoryOverwrite && csvGenerated) {
                buttonOverwrite.click();
            }
        }, 2000);
    }, [filteredCsvDataReadyForSubmittal, filteredCsvDataFactoryOverwrite, csvGenerated, downloadId]);

    const [downloadCSVQuery, { data: csvData, loading: csvLoading }] = useLazyQuery(
        DOWNLOAD_CLOSE_PERIOD_QUERY_FACTORY,
        {
            fetchPolicy: "network-only",
            nextFetchPolicy: "network-only",
            onCompleted: () => {
                const arr =
                    csvData && csvData?.factoryAllocationCsv?.main && CSV.parse(csvData?.factoryAllocationCsv?.main);
                const str = arr && CSV.stringify(arr);
                if (str) {
                    setFilteredCsvData(str);
                }
                if (csvData?.factoryAllocationCsv?.overwrite) {
                    const arrOverwrite =
                        csvData &&
                        csvData?.factoryAllocationCsv?.overwrite &&
                        CSV.parse(csvData?.factoryAllocationCsv?.overwrite);
                    const strOverwrite = arrOverwrite && CSV.stringify(arrOverwrite);
                    if (strOverwrite) {
                        setFilteredCsvDataFactoryOverwrite(strOverwrite);
                    }
                }
                setCsvGenerated(true);
            },
        }
    );

    const [downloadCSVQueryClaimIdOnly, { data: csvDataClaimIdOnly, loading: csvLoadingClaimIdOnly }] = useLazyQuery(
        DOWNLOAD_CLOSE_PERIOD_QUERY_FACTORY_CLAIM_ID_ONLY,
        {
            fetchPolicy: "network-only",
            nextFetchPolicy: "network-only",
            onCompleted: () => {
                const arr =
                    csvDataClaimIdOnly &&
                    csvDataClaimIdOnly?.factoryAllocationCsvClaimOnly?.main &&
                    CSV.parse(csvDataClaimIdOnly?.factoryAllocationCsvClaimOnly?.main);
                const str = arr && CSV.stringify(arr);
                if (str) {
                    setFilteredCsvDataReadyForSubmittal(str);
                }
                if (csvDataClaimIdOnly?.factoryAllocationCsvClaimOnly?.overwrite) {
                    const arrOverwrite =
                        csvDataClaimIdOnly &&
                        csvDataClaimIdOnly?.factoryAllocationCsvClaimOnly?.overwrite &&
                        CSV.parse(csvDataClaimIdOnly?.factoryAllocationCsvClaimOnly?.overwrite);
                    const strOverwrite = arrOverwrite && CSV.stringify(arrOverwrite);
                    if (strOverwrite) {
                        setFilteredCsvDataFactoryOverwrite(strOverwrite);
                    }
                }
                setCsvGenerated(true);
            },
        }
    );

    useEffect(() => {
        if (openDispute) {
            openDisputeTab(openDispute.id, openDispute.name);
        }
        // eslint-disable-next-line
    }, [openDispute]);

    useEffect(() => {
        getOpenClaimsPerStatus({
            variables: {
                status: ["OPEN"],
                claim_type: claimType,
            },
        });
        getReadyClaimsPerStatus({
            variables: {
                status: claimType === "FACTORY" ? ["READY"] : ["READYTOCLOSE"],
                claim_type: claimType,
            },
        });
        getSubmittedDisputedClaimsPerStatus({
            variables: {
                status: claimType === "FACTORY" ? ["SUBMITTED", "DISPUTED"] : ["CLOSE"],
                claim_type: claimType,
            },
        });
        // eslint-disable-next-line
    }, []);

    const [getOpenClaimsPerStatus, { data: openClaims, loading: openClaimLoading }] = useLazyQuery(
        GET_CLAIM_PER_STATUS,
        {
            fetchPolicy: "no-cache",
            notifyOnNetworkStatusChange: false,
        }
    );

    const [getReadyClaimsPerStatus, { data: readyClaims, loading: readyClaimLoading }] = useLazyQuery(
        GET_CLAIM_PER_STATUS,
        {
            fetchPolicy: "no-cache",
            notifyOnNetworkStatusChange: false,
        }
    );

    const [
        getSubmittedDisputedClaimsPerStatus,
        { data: submittedDisputedClaims, loading: submittedDisputedClaimLoading },
    ] = useLazyQuery(GET_CLAIM_PER_STATUS, {
        fetchPolicy: "no-cache",
        notifyOnNetworkStatusChange: false,
    });

    const [getClaimNode, { loading: claimNodeLoading }] = useLazyQuery(GET_CLAIM_FOR_JUST_TOTAL, {
        fetchPolicy: "no-cache",
        onCompleted: (result) => {
            setApproveClaimNode(result.claim);
            setThirdColumnId(result.claim.id);
            setShowModal(true);
        },
    });

    const [approveClaim, { loading: approveClaimLoading }] = useMutation(UPDATE_CLAIM_SUBMIITED, {
        variables: {
            status: "READYTOCLOSE",
            id: thirdColumnId,
        },
        update(cache, result) {
            getSubmittedDisputedClaimsPerStatus({
                variables: {
                    status: ["SUBMITTED", "DISPUTED"],
                    claim_type: claimType,
                },
            });
            toast.success("Claim Approved");
            setQuarterYear({
                year: result?.data?.updateClaim?.report_year,
                quarter: result?.data?.updateClaim?.report_quarter,
            });
            if (clicked) {
                downloadCSVQuery({
                    variables: {
                        year: result?.data?.updateClaim?.report_year,
                        quarter: result?.data?.updateClaim?.report_quarter,
                        claimId: result?.data?.updateClaim?.id,
                    },
                });
            } else {
                setShowModal(false);
                setThirdColumnId("");
            }
        },
    });

    const [updateClaimManualOverwrite] = useMutation(UPDATE_CLAIM_TOTAL_MANUAL_OVERWRITE, {
        update(cache, result) {
            setOverwriteTotalClaimValue("");
            setApproveClaimNode({ ...approveClaimNode, ...result?.data?.updateClaim });
            toast.success(
                `Claim manual overwrite set to: ${formatterForCurrency.format(
                    overwriteTotalClaimValue || approveClaimNode?.calculateCurrentTotal?.total
                )}`
            );
        },
        onError(error) {
            console.error(error);
            toast.error("Error setting manual overwrite");
        },
    });

    useEffect(() => {
        if (clicked) {
            onSubmit();
        }
        // eslint-disable-next-line
    }, [clicked]);

    const onSubmit = () => {
        approveClaim();
    };

    const cleanUp = () => {
        setClicked(false);
        setShowModal(false);
        setThirdColumnId("");
        setFilteredCsvData("");
        setCsvGenerated(false);
    };

    const modal = () => {
        return (
            <>
                <Modal
                    onSubmit={() => onSubmit()}
                    title={approveClaimNode?.program?.name}
                    Content={ModalContent(approveClaimNode)}
                    submitLabel={approveClaimLoading && !clicked ? "Approving" : "Approve"}
                    onClose={() => setShowModal(false)}
                    show={showModal}
                    extraActionButton={true}
                    extraAction={() => {
                        setClicked(true);
                    }}
                    width={"3xl"}
                    extraLabel={`${
                        approveClaimLoading && clicked
                            ? "Approving Claim"
                            : csvLoading
                            ? "Generating CSV"
                            : "Approve & Save CSV"
                    }`}
                    renderCSVLink={csvGenerated}
                    csvData={filteredCsvData}
                    csvDataOverwrite={filteredCsvDataFactoryOverwrite}
                    cleanUp={() => cleanUp()}
                    csvFileName={`${APP_TITLE} - Q${quarterYear?.quarter}-${quarterYear?.year} - ${approveClaimNode?.program?.name}.csv`}
                    csvFileNameOverwrite={`${APP_TITLE} - Q${quarterYear?.quarter}-${quarterYear?.year} Overwrite - ${approveClaimNode?.program?.name}.csv`}
                    thirdActionButton={true}
                    thirdAction={() => {
                        updateClaimManualOverwrite({
                            variables: {
                                id: thirdColumnId,
                                total_manual_set: true,
                                report_total: overwriteTotalClaimValue,
                            },
                        });
                    }}
                    thirdLabel={"Overwrite Total"}
                    fourthActionButton={true}
                    fourthAction={() => {
                        updateClaimManualOverwrite({
                            variables: {
                                id: thirdColumnId,
                                total_manual_set: false,
                                report_total: approveClaimNode?.calculateCurrentTotal?.total,
                            },
                        });
                    }}
                    fourthLabel={"Remove Overwrite"}
                />
            </>
        );
    };

    const getMonthYear = (date) => {
        var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return month[date.getMonth()] + " " + date.getFullYear();
    };

    const handleTotalOverwriteChange = (e) => {
        setOverwriteTotalClaimValue(parseFloat(e.target.value));
    };

    const ModalContent = (item) => {
        return (
            <div className="flex flex-col flex-1 overflow-auto w-full">
                <p className="px-6 text-gray-500  font-body font-medium text-lg">
                    Claim Period : {getMonthYear(new Date(item?.claim_start_date))} -{" "}
                    {getMonthYear(new Date(item?.claim_end_date))}
                </p>
                <p className="px-6 text-gray-500  font-body font-medium text-lg">
                    Submitted Claim :{" "}
                    {item?.total_manual_set
                        ? formatterForCurrency.format(item?.report_total)
                        : formatterForCurrency.format(item?.calculateCurrentTotal?.total)}
                </p>

                <div className="flex items-center mt-5 space-x-5 px-6">
                    <label htmlFor="claimTotalOverwrite" className=" text-gray-700 font-medium text-lg">
                        Overwrite total:
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
                        <input
                            type="number"
                            value={overwriteTotalClaimValue}
                            name="claimTotalOverwrite"
                            id="claimTotalOverwrite"
                            placeholder="Overwrite total value"
                            className={`w-10/12 mb-1 pt-0.5 pb-0 pl-0.5 rounded-lg rounded-b-none min-w-0 border-0 border-b-2 border-b-secondary border-gray-400 text-secondary font-medium text-lg outline-none focus:outline-none focus:ring-0`}
                            onChange={(e) => {
                                handleTotalOverwriteChange(e);
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const sortArray = (items) => {
        let copyItems = items?.slice();
        let sortedArray = copyItems?.sort((a, b) => a.node.program.name.localeCompare(b.node.program.name));
        return sortedArray;
    };

    return (
        <div className="flex-1 flex-col  flex items-stretch sm:flex-row  overflow-hidden">
            <div className="flex-grow w-full max-w-8xl mx-auto xl:flex ">
                <div className="flex-1 min-w-0  md:flex">
                    <div className="flex-1 2xl:max-w-xs 3xl:max-w-md xl:flex-shrink-0">
                        <div className="h-full ">
                            <div className="h-full relative">
                                <div className=" inset-0  bg-white rounded-lg h-full flex flex-col">
                                    <div className="flex flex-0 px-4 border-b justify-between items-center">
                                        <div className=" py-5 text-center  font-title h2">In Progress</div>
                                    </div>

                                    <div className="flex overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 w-full h-full">
                                        <div className="w-full border-l border-r border-white sm:max-h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                            <ul
                                                style={{ maxHeight: "51vh" }}
                                                className=" flex-0 w-full overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400"
                                            >
                                                {openClaimLoading ? (
                                                    <Loader />
                                                ) : (
                                                    sortArray(openClaims?.claimsPerStatus?.edges)?.map((eachData) => {
                                                        return (
                                                            <li
                                                                className={`py-3 transition pl-3 border-b border-l-4 border-l-primary hover:border-l-6 hover:bg-gray-100`}
                                                            >
                                                                <div className="relative  ">
                                                                    <div className="text-sm font-semibold text-gray-800">
                                                                        {eachData?.node?.program?.name}
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        );
                                                    })
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full border-l">
                        <div className="h-full">
                            <div className="h-full  relative">
                                <div className={`flex h-full inset-0  bg-white rounded-lg flex-col overflow-auto`}>
                                    <div className="flex flex-col md:flex-row border-b justify-between items-center">
                                        <div className="py-5 px-4 text-center  font-title h2">Ready for Submittal</div>
                                    </div>

                                    <div className="flex flex-col flex-1 overflow-auto w-full">
                                        <div
                                            className={`flex flex-col h-full overflow-auto w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400`}
                                        >
                                            <div className="w-full  sm:max-h-full ">
                                                <ul
                                                    style={{ maxHeight: "51vh" }}
                                                    className=" flex-0 w-full overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400"
                                                >
                                                    {readyClaimLoading ? (
                                                        <Loader />
                                                    ) : (
                                                        sortArray(readyClaims?.claimsPerStatus?.edges)?.map(
                                                            (item, index) => {
                                                                return (
                                                                    <div className="border-b px-4 py-3">
                                                                        <div className="flex flex-row justify-between">
                                                                            <div className="text-sm font-semibold text-gray-800 w-full">
                                                                                {item?.node?.program?.name}
                                                                            </div>
                                                                            <div className="text-sm font-semibold text-gray-800 w-full">
                                                                                {item?.node?.propertyUnitCount?.type ===
                                                                                "Per Unit"
                                                                                    ? item?.node?.propertyUnitCount
                                                                                          ?.count > 1
                                                                                        ? item?.node?.propertyUnitCount
                                                                                              ?.count + " Units"
                                                                                        : item?.node?.propertyUnitCount
                                                                                              ?.count + " Unit"
                                                                                    : item?.node?.propertyUnitCount
                                                                                          ?.count > 1
                                                                                    ? item?.node?.propertyUnitCount
                                                                                          ?.count + " Properties"
                                                                                    : item?.node?.propertyUnitCount
                                                                                          ?.count + " Property"}
                                                                            </div>
                                                                            <span
                                                                                className="cursor-pointer mr-5 hover:opacity-70 font-medium"
                                                                                onClick={() => {
                                                                                    setDownloadId(item?.node?.id);
                                                                                    downloadCSVQueryClaimIdOnly({
                                                                                        variables: {
                                                                                            claimId: item?.node?.id,
                                                                                        },
                                                                                    });
                                                                                }}
                                                                            >
                                                                                {csvLoadingClaimIdOnly ? (
                                                                                    <Loader />
                                                                                ) : (
                                                                                    <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        className="h-5 w-6 text-primary"
                                                                                        fill="none"
                                                                                        viewBox="0 0 24 24"
                                                                                        stroke="currentColor"
                                                                                        stroke-width="2"
                                                                                    >
                                                                                        <path
                                                                                            stroke-linecap="round"
                                                                                            stroke-linejoin="round"
                                                                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                                        />
                                                                                    </svg>
                                                                                )}
                                                                            </span>
                                                                            <CSVLink
                                                                                data={
                                                                                    filteredCsvDataReadyForSubmittal
                                                                                        ? filteredCsvDataReadyForSubmittal
                                                                                        : ""
                                                                                }
                                                                                asyncOnClick={true}
                                                                                className="hidden"
                                                                                separator=","
                                                                                onClick={() => {
                                                                                    setCsvGenerated(false);
                                                                                }}
                                                                                id={`csvDownloadFactory-${item?.node?.id}`}
                                                                                filename={`${APP_TITLE} - Factory - Builder Allocations - ${
                                                                                    item?.node?.program?.name
                                                                                } ${item?.node?.id} - ${new Date()
                                                                                    ?.toISOString()
                                                                                    ?.substr(0, 10)}.csv`}
                                                                                target="_blank"
                                                                            ></CSVLink>
                                                                            <CSVLink
                                                                                data={
                                                                                    filteredCsvDataFactoryOverwrite
                                                                                        ? filteredCsvDataFactoryOverwrite
                                                                                        : ""
                                                                                }
                                                                                asyncOnClick={true}
                                                                                className="hidden"
                                                                                separator=","
                                                                                onClick={() => {
                                                                                    setCsvGenerated(false);
                                                                                }}
                                                                                id={`csvDownloadFactoryOverwrite-${item?.node?.id}`}
                                                                                filename={`${APP_TITLE} - Factory - Builder Overwrites Allocations - ${
                                                                                    item?.node?.program?.name
                                                                                } ${item?.node?.id} - ${new Date()
                                                                                    ?.toISOString()
                                                                                    ?.substr(0, 10)}.csv`}
                                                                                target="_blank"
                                                                            ></CSVLink>
                                                                            <span
                                                                                className="mr-5 cursor-pointer hover:opacity-70"
                                                                                onClick={() =>
                                                                                    moveToSubmitted(item?.node?.id)
                                                                                }
                                                                            >
                                                                                <svg
                                                                                    transform="rotate(45)"
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    className="h-5 w-6 text-primary"
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    stroke="currentColor"
                                                                                >
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        strokeWidth="2"
                                                                                        d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
                                                                                    />
                                                                                </svg>
                                                                            </span>
                                                                        </div>
                                                                    </div>
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
                    </div>
                </div>
                <div className=" flex-1 xl:max-w-xs 3xl:max-w-md mt-5 xl:mt-0 border-l  ">
                    <div className="h-full relative md:pr-3 lg:pr-0 xl:pr-3 2xl:pr-0">
                        <div className="inset-0  bg-white  rounded-lg h-full flex flex-col">
                            <div className="flex flex-0 border-b justify-between items-center">
                                <div className="py-5 px-4 text-center h2 font-title ">Submitted</div>
                            </div>

                            <div className="flex flex-col flex-1 overflow-auto w-full">
                                <div className="flex flex-col h-full overflow-auto w-full">
                                    <div className="w-full  max-h-smallMin sm:max-h-full border-l border-r border-white scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                        <ul
                                            style={{ maxHeight: "51vh" }}
                                            className=" flex-0 w-full overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400"
                                        >
                                            {submittedDisputedClaimLoading ? (
                                                <Loader />
                                            ) : (
                                                sortArray(submittedDisputedClaims?.claimsPerStatus?.edges)?.map(
                                                    (eachData) => {
                                                        return (
                                                            <li className="py-3 px-3 transition-all border-b border-l-4 border-l-primary hover:border-l-6 hover:bg-gray-100">
                                                                <div className="relative flex justify-between">
                                                                    <p className="text-sm font-semibold text-gray-800">
                                                                        <div className="  focus:outline-none">
                                                                            {eachData?.node?.program?.name}
                                                                        </div>
                                                                    </p>
                                                                    <div className="flex ">
                                                                        {claimNodeLoading &&
                                                                        thirdColumnId === eachData.node.id ? (
                                                                            <Loader
                                                                                className={"mr-5"}
                                                                                width={25}
                                                                                height={25}
                                                                            />
                                                                        ) : (
                                                                            <span
                                                                                className="mr-5 cursor-pointer hover:opacity-70"
                                                                                onClick={() => {
                                                                                    setThirdColumnId(eachData.node.id);
                                                                                    getClaimNode({
                                                                                        variables: {
                                                                                            id: eachData.node.id,
                                                                                        },
                                                                                    });
                                                                                }}
                                                                            >
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    className="h-6 w-6 text-green-600"
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    stroke="currentColor"
                                                                                >
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        strokeWidth="2"
                                                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                                    />
                                                                                </svg>
                                                                            </span>
                                                                        )}
                                                                        <span
                                                                            className="mr-5 cursor-pointer hover:opacity-70"
                                                                            onClick={() => {
                                                                                setOpenDispute({
                                                                                    id: eachData?.node?.id,
                                                                                    name: eachData?.node?.program?.name,
                                                                                });
                                                                            }}
                                                                        >
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                className="h-6 w-6 text-orange-600"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                stroke="currentColor"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth="2"
                                                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                                />
                                                                            </svg>
                                                                        </span>
                                                                        <span
                                                                            className="mr-5 cursor-pointer hover:opacity-70"
                                                                            onClick={() => {
                                                                                openRejectedRebatesTab(
                                                                                    eachData?.node?.id,
                                                                                    eachData?.node?.program?.name
                                                                                );
                                                                            }}
                                                                        >
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                class="h-6 w-6 text-red-600"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                stroke="currentColor"
                                                                                stroke-width="2"
                                                                            >
                                                                                <path
                                                                                    stroke-linecap="round"
                                                                                    stroke-linejoin="round"
                                                                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                                />
                                                                            </svg>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        );
                                                    }
                                                )
                                            )}
                                        </ul>
                                    </div>
                                    {modal()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
