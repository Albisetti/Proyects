import { useLazyQuery } from "@apollo/client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet";
import { FETCH_CLAIM_PERIOD, FETCH_CLAIM_PER_PERIOD } from "../../../../../lib/claimhistory";
import Button from "../../../../Buttons";
import Loader from "../../../../Loader/Loader";
import { formatterForCurrency } from "../../../../../util/generic";
import * as CSV from "csv-string";
import { CSVLink } from "react-csv";
import {
    DOWNLOAD_CLOSE_PERIOD_QUERY,
    DOWNLOAD_CLOSE_PERIOD_QUERY_FACTORY,
    DOWNLOAD_CLOSE_PERIOD_QUERY_VOLUME,
} from "../../../../../lib/claims";
import CommonSelect from "../../../../Select";
import { APP_TITLE } from "../../../../../util/constants";

import { capitalize } from "../../../../../util/string";

const ClaimPeriod = ({ openClaim }) => {
    const [claim, setClaim] = useState();
    const [selectedYear, setSelectedYear] = useState();
    const [selectedQuarter, setSelectedQuarter] = useState();
    const [active, setActive] = useState();
    const [activeClaim, setActiveClaim] = useState();
    const first = 20;
    const programObserver = useRef();
    const [filteredCsvData, setFilteredCsvData] = useState();
    const [clicked, setClicked] = useState();
    const [isCloseClaimsThere, setIsCloseClaimsThere] = useState(false);
    const [filteredCsvDataFactory, setFilteredCsvDataFactory] = useState();
    const [filteredCsvDataFactoryOverwrite, setFilteredCsvDataFactoryOverwrite] = useState();
    const [clickedFactory, setClickedFactory] = useState();
    const [filteredCsvDataVolume, setFilteredCsvDataVolume] = useState();
    const [clickedVolume, setClickedVolume] = useState();
    const [programFilter, setProgramFilter] = useState({
        label: "All",
        value: "ALL",
    });
    // eslint-disable-next-line
    const lastProgramElement = useCallback((node) => {
        if (programObserver.current) programObserver.current.disconnect();
        programObserver.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && claims.claimsForReportPeriod.pageInfo.hasNextPage) {
                fetchMore({
                    variables: {
                        first,
                        after: claims.claimsForReportPeriod.pageInfo.endCursor,
                    },
                });
            }
        });
        if (node) programObserver.current.observe(node);
    });

    const populateClaims = (data) => {
        setSelectedYear(data?.year);
        setIsCloseClaimsThere(false);
        setSelectedQuarter(data?.quarter);
        setActiveClaim(data?.report_period);
        setActive("");
    };

    useEffect(() => {
        getClaims();
        // eslint-disable-next-line
    }, [selectedYear, selectedQuarter]);

    useEffect(() => {
        let button = document.getElementById("csvDownloadHistoryFactory");
        let buttonOverwrites = document.getElementById("csvDownloadHistoryFactoryOverwrite")
        setTimeout(() => {
            if (filteredCsvDataFactory && clickedFactory) {
                button.click();
            }
            if (filteredCsvDataFactoryOverwrite && clickedFactory) {
                buttonOverwrites.click();
            }
        }, 1000);
    }, [filteredCsvDataFactory, filteredCsvDataFactoryOverwrite, clickedFactory]);

    useEffect(() => {
        let button = document.getElementById("csvDownloadHistoryVolume");
        setTimeout(() => {
            if (filteredCsvDataVolume && clickedVolume) {
                button.click();
            }
        }, 1000);
    }, [filteredCsvDataVolume, clickedVolume]);

    const [downloadCSVQueryFactory, { data: csvDataFactory, loading: csvLoadingFactory }] = useLazyQuery(
        DOWNLOAD_CLOSE_PERIOD_QUERY_FACTORY,
        {
            fetchPolicy: "network-only",
            nextFetchPolicy: "network-only",
            onCompleted: () => {
                const arr = csvDataFactory && csvDataFactory?.factoryAllocationCsv?.main && CSV.parse(csvDataFactory?.factoryAllocationCsv?.main);
                const str = arr && CSV.stringify(arr);
                if (str) {
                    setFilteredCsvDataFactory(str);
                }
                if (csvDataFactory?.factoryAllocationCsv?.overwrite) {
                    const arrOverwrite = csvDataFactory && csvDataFactory?.factoryAllocationCsv?.overwrite && CSV.parse(csvDataFactory?.factoryAllocationCsv?.overwrite);
                    const strOverwrite = arrOverwrite && CSV.stringify(arrOverwrite);
                    if (strOverwrite) {
                        setFilteredCsvDataFactoryOverwrite(strOverwrite);
                    }
                }

                setClickedFactory(true);
            },
            onError(error) {
                console.log(error)
            }
        }
    );

    const [downloadCSVQueryVolume, { data: csvDataVolume, loading: csvLoadingVolume }] = useLazyQuery(
        DOWNLOAD_CLOSE_PERIOD_QUERY_VOLUME,
        {
            fetchPolicy: "network-only",
            nextFetchPolicy: "network-only",
            onCompleted: () => {
                const arr =
                    csvDataVolume &&
                    csvDataVolume?.volumeAllocationCsv &&
                    CSV.parse(csvDataVolume?.volumeAllocationCsv);
                const str = arr && CSV.stringify(arr);
                if (str) {
                    setFilteredCsvDataVolume(str);
                }
                setClickedVolume(true);
            },
        }
    );

    const [getClaims, { data: claims, loading: claimsLoading, fetchMore }] = useLazyQuery(FETCH_CLAIM_PER_PERIOD, {
        variables: {
            year: parseInt(selectedYear),
            quarter: parseInt(selectedQuarter),
        },
        notifyOnNetworkStatusChange: false,
        fetchPolicy: "cache-and-network",
        onCompleted: () => {
            let index = claims?.claimsForReportPeriod?.edges?.findIndex(
                (item) => item?.node?.status === "CLOSED" || item?.node?.status === "READYTOCLOSE"
            );
            if (index !== -1) {
                setIsCloseClaimsThere(true);
            }
        },
    });

    useEffect(() => {
        fetchPeriod();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        let button = document.getElementById("csvDownload");
        let buttonOverwrites = document.getElementById("csvDownloadFactoryOverwrite");

        setTimeout(() => {
            if (filteredCsvData && clicked) {
                button.click();
            }
            if (filteredCsvDataFactoryOverwrite && clicked) {
                buttonOverwrites.click()
            }
        }, 1000);
    }, [filteredCsvData, filteredCsvDataFactoryOverwrite, clicked]);

    const [fetchPeriod, { data, loading }] = useLazyQuery(FETCH_CLAIM_PERIOD, {
        notifyOnNetworkStatusChange: false,
        fetchPolicy: "network-only",
    });

    const setData = (data) => {
        setActive(data?.id);
        setClaim(data);
        setClicked(false);
        setFilteredCsvData("");
    };

    const getMonthYear = (quarter, year) => {
        switch (quarter) {
            case 4:
                return `October ${year} - December ${year}  `;
            case 3:
                return `July ${year} - September ${year}  `;
            case 2:
                return `April ${year} - June ${year}  `;
            case 1:
                return `January ${year} - March ${year}  `;

            default:
                break;
        }
    };

    const [downloadCSVQuery, { data: csvData, loading: csvLoading }] = useLazyQuery(DOWNLOAD_CLOSE_PERIOD_QUERY, {
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only",
        onCompleted: () => {
            let arr;
            if (claim?.claim_type === "VOLUME") {
                arr = csvData && csvData?.volumeAllocationCsv && CSV.parse(csvData?.volumeAllocationCsv);
            } else {
                arr = csvData && csvData?.factoryAllocationCsv?.main && CSV.parse(csvData?.factoryAllocationCsv?.main);
                if (csvData?.factoryAllocationCsv?.overwrite) {
                    const arrOverwrite = csvData && csvData?.factoryAllocationCsv?.overwrite && CSV.parse(csvData?.factoryAllocationCsv?.overwrite);
                    const strOverwrite = arrOverwrite && CSV.stringify(arrOverwrite);
                    if (strOverwrite) {
                        setFilteredCsvDataFactoryOverwrite(strOverwrite);
                    }
                }
            }
            const str = arr && CSV.stringify(arr);
            if (str) {
                setFilteredCsvData(str);
            }
            setClicked(true);
        },
    });

    const sortArray = (items) => {
        let copyItems = items?.slice();
        let sortedArray = copyItems?.sort((a, b) => a?.node?.program?.name?.localeCompare(b?.node?.program?.name));
        return sortedArray;
    };

    return (
        <div className="h-full">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Claim History</title>
            </Helmet>
            <div className="flex h-full  gap-5 ">
                <div className="flex-1 flex-col  flex items-stretch sm:flex-row  overflow-hidden ">
                    <div className="flex-grow w-full max-w-8xl mx-auto xl:flex">
                        <div className="flex-1 min-w-0 md:flex">
                            <div className=" flex-1 xl:max-w-xs 3xl:max-w-md  border-r">
                                <div className=" inset-0  bg-white  rounded-lg h-full flex flex-col">
                                    <div className="flex flex-0 px-4 border-b justify-between items-center">
                                        <div className=" py-5 text-center h2 font-title">Reporting Period</div>
                                    </div>
                                    <div className="flex overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 w-full h-full">
                                        <div className="w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                            <ul
                                                style={{ maxHeight: "53.5vh" }}
                                                className=" flex-0 w-full overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400"
                                            >
                                                {loading ? (
                                                    <Loader />
                                                ) : (
                                                    data?.distinctReportPeriodForCloseClaims?.map((eachData) => {
                                                        return (
                                                            <li
                                                                className={`py-3 pl-3 border-b border-l-4  hover:bg-warmGray-100 ${activeClaim === eachData?.report_period
                                                                    ? "border-l-gold border-l-6"
                                                                    : "border-l-primary"
                                                                    }`}
                                                                onClick={() => {
                                                                    populateClaims(eachData);
                                                                }}
                                                            >
                                                                <div className="relative  ">
                                                                    <div className="text-sm font-semibold text-gray-800">
                                                                        <span className="  focus:outline-none">
                                                                            <span
                                                                                className="absolute inset-0"
                                                                                aria-hidden="true"
                                                                            ></span>
                                                                            {getMonthYear(
                                                                                eachData?.quarter,
                                                                                eachData?.year
                                                                            )}
                                                                            ({eachData.report_period})
                                                                        </span>
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

                            <div className=" sm:flex-1 border-r">
                                {activeClaim ? (
                                    <div className="h-full ">
                                        <div className="h-full  relative">
                                            <div className={`flex h-full inset-0 bg-white   flex-col overflow-auto`}>
                                                <div className="flex flex-col md:flex-row border-b justify-between items-center">
                                                    <div className="flex items-center">
                                                        <div className="px-4 py-5 text-center h2 font-title">
                                                            Claims
                                                        </div>
                                                        <CommonSelect
                                                            value={programFilter}
                                                            options={{
                                                                edges: [
                                                                    {
                                                                        node: {
                                                                            name: "All",
                                                                            id: "ALL",
                                                                        },
                                                                    },
                                                                    {
                                                                        node: {
                                                                            name: "Factory",
                                                                            id: "FACTORY",
                                                                        },
                                                                    },
                                                                    {
                                                                        node: {
                                                                            name: "Volume",
                                                                            id: "VOLUME",
                                                                        },
                                                                    },
                                                                ],
                                                            }}
                                                            className="col-span-1 lg:w-44"
                                                            placeHolder="Program Type"
                                                            menuPlacement={"bottom"}
                                                            onChange={(e) =>
                                                                setProgramFilter({ value: e.value, label: e.label })
                                                            }
                                                        />
                                                    </div>
                                                    {isCloseClaimsThere ? (
                                                        <div className="flex items-center">
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
                                                                                year: selectedYear,
                                                                                quarter: selectedQuarter,
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
                                                                    id="csvDownloadHistoryVolume"
                                                                    filename={`${APP_TITLE} - Volume - Builder Allocations - Q${selectedQuarter}-${selectedYear} - ${new Date()
                                                                        ?.toISOString()
                                                                        ?.substr(0, 10)}.csv`}
                                                                    target="_blank"
                                                                >
                                                                    Saving CSV
                                                                </CSVLink>
                                                            )}
                                                            {!clickedFactory ? (
                                                                <Button
                                                                    title={`${csvLoadingFactory
                                                                        ? "Generating CSV"
                                                                        : "Factory CSV"
                                                                        }`}
                                                                    color="primary"
                                                                    onClick={() =>
                                                                        downloadCSVQueryFactory({
                                                                            variables: {
                                                                                year: selectedYear,
                                                                                quarter: selectedQuarter,
                                                                            },
                                                                        })
                                                                    }
                                                                />
                                                            ) : (
                                                                <>
                                                                    <CSVLink
                                                                        data={
                                                                            filteredCsvDataFactory
                                                                                ? filteredCsvDataFactory
                                                                                : ""
                                                                        }
                                                                        asyncOnClick={true}
                                                                        className="text-white font-title bg-brickGreen   px-10 py-2 rounded-lg mr-2 ml-2 text-sm md:text-md"
                                                                        separator={","}
                                                                        onClick={() => {
                                                                            setClickedFactory(false);
                                                                            setFilteredCsvDataFactory("");
                                                                        }}
                                                                        id="csvDownloadHistoryFactory"
                                                                        filename={`${APP_TITLE} - Factory - Builder Allocations - Q${selectedQuarter}-${selectedYear} - ${new Date()
                                                                            ?.toISOString()
                                                                            ?.substr(0, 10)}.csv`}
                                                                        target="_blank"
                                                                    >
                                                                        Saving CSV
                                                                    </CSVLink>

                                                                    <CSVLink
                                                                        data={
                                                                            filteredCsvDataFactoryOverwrite
                                                                                ? filteredCsvDataFactoryOverwrite
                                                                                : ""
                                                                        }
                                                                        asyncOnClick={true}
                                                                        className="hidden"
                                                                        separator={","}
                                                                        onClick={() => {
                                                                            setClickedFactory(false);
                                                                            setFilteredCsvDataFactoryOverwrite("");
                                                                        }}
                                                                        id="csvDownloadHistoryFactoryOverwrite"
                                                                        filename={`${APP_TITLE} - Factory - Builder Overwrites Allocations - Q${selectedQuarter}-${selectedYear
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

                                                <div className="flex flex-col flex-1 overflow-auto w-full">
                                                    <div
                                                        className={`flex flex-col h-full overflow-auto w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400`}
                                                    >
                                                        <div className="w-full  sm:max-h-full ">
                                                            <ul
                                                                style={{
                                                                    maxHeight: "53.5vh",
                                                                }}
                                                                className=" flex-0 w-full overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400"
                                                            >
                                                                {claimsLoading ? (
                                                                    <Loader />
                                                                ) : (
                                                                    claims?.claimsForReportPeriod?.edges?.length !==
                                                                    0 &&
                                                                    sortArray(claims?.claimsForReportPeriod?.edges)
                                                                        ?.filter((item) =>
                                                                            programFilter?.value !== "ALL"
                                                                                ? item?.node?.claim_type ===
                                                                                programFilter?.value
                                                                                : true
                                                                        )
                                                                        ?.map((eachData, index) => {
                                                                            if (
                                                                                index ===
                                                                                claims?.claimsForReportPeriod?.edges
                                                                                    ?.length -
                                                                                1
                                                                            ) {
                                                                                return (
                                                                                    <li
                                                                                        className={`  border-b transition-all  border-l-4    hover:border-l-6   ${active === eachData.node.id
                                                                                            ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                                            : "text-darkgray75 border-l-primary"
                                                                                            }`}
                                                                                        onClick={() =>
                                                                                            setData(eachData.node)
                                                                                        }
                                                                                        ref={lastProgramElement}
                                                                                    >
                                                                                        <div className="relative  ">
                                                                                            <div className="text-sm py-3 px-2 font-semibold flex justify-between">
                                                                                                <div className="relative flex flex-col   ">
                                                                                                    <div className="text-sm px-2 font-semibold  ">
                                                                                                        <div className="  focus:outline-none">
                                                                                                            <span
                                                                                                                className="absolute inset-0"
                                                                                                                aria-hidden="true"
                                                                                                            ></span>
                                                                                                            {
                                                                                                                eachData
                                                                                                                    .node
                                                                                                                    .program
                                                                                                                    .name
                                                                                                            }
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="flex items-start px-2">
                                                                                                        <p className="text-sm text-gray-500 capitalize">
                                                                                                            {eachData
                                                                                                                ?.node
                                                                                                                ?.program
                                                                                                                ?.company
                                                                                                                ?.name
                                                                                                                ? eachData
                                                                                                                    ?.node
                                                                                                                    ?.program
                                                                                                                    ?.company
                                                                                                                    ?.name
                                                                                                                : ""}
                                                                                                        </p>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="px-4">
                                                                                                    {
                                                                                                        eachData?.node
                                                                                                            ?.propertyUnitCount
                                                                                                            ?.count
                                                                                                    }{" "}
                                                                                                    {eachData?.node
                                                                                                        ?.propertyUnitCount
                                                                                                        ?.type ===
                                                                                                        "Per Unit"
                                                                                                        ? " Units"
                                                                                                        : " Properties"}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </li>
                                                                                );
                                                                            }
                                                                            return (
                                                                                <li
                                                                                    className={`  border-b transition-all  border-l-4    hover:border-l-6  ${active === eachData.node.id
                                                                                        ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                                        : "text-darkgray75 border-l-primary"
                                                                                        }`}
                                                                                    onClick={() =>
                                                                                        setData(eachData.node)
                                                                                    }
                                                                                >
                                                                                    <div className="relative  ">
                                                                                        <div className="text-sm py-3 px-2 font-semibold flex justify-between">
                                                                                            <div className="relative flex flex-col  ">
                                                                                                <div className="text-sm px-2 font-semibold  ">
                                                                                                    <div className="  focus:outline-none">
                                                                                                        <span
                                                                                                            className="absolute inset-0"
                                                                                                            aria-hidden="true"
                                                                                                        ></span>
                                                                                                        {
                                                                                                            eachData
                                                                                                                .node
                                                                                                                .program
                                                                                                                .name
                                                                                                        }
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="flex items-start px-2">
                                                                                                    <p className="text-sm text-gray-500 capitalize">
                                                                                                        {eachData?.node
                                                                                                            ?.program
                                                                                                            ?.company
                                                                                                            ?.name
                                                                                                            ? eachData
                                                                                                                ?.node
                                                                                                                ?.program
                                                                                                                ?.company
                                                                                                                ?.name
                                                                                                            : ""}
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="px-4">
                                                                                                {
                                                                                                    eachData?.node
                                                                                                        ?.propertyUnitCount
                                                                                                        ?.count
                                                                                                }{" "}
                                                                                                {eachData?.node
                                                                                                    ?.propertyUnitCount
                                                                                                    ?.type ===
                                                                                                    "Per Unit"
                                                                                                    ? " Units"
                                                                                                    : " Properties"}
                                                                                            </div>
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
                                ) : null}
                            </div>
                        </div>
                        <div className=" flex-1 xl:max-w-xs 3xl:max-w-md mt-5 xl:mt-0">
                            <div className="h-full relative  ">
                                <div className="inset-0  bg-white  rounded-lg h-full flex flex-col">
                                    {active ? (
                                        <div className="flex flex-0 border-b justify-between items-center">
                                            <div className=" py-5 px-4 text-center h2 font-title">
                                                {active ? claim?.program?.name + " - " : ""}{" "}
                                                {active ? capitalize(claim?.program?.type) : ""}
                                            </div>
                                        </div>
                                    ) : null}

                                    {active ? (
                                        <div className="flex flex-col flex-1 overflow-auto w-full h-full">
                                            <ul className="mt-1 mb-1 flex flex-col space-y-5 px-4 h-full py-2">
                                                <li className=" flex border rounded-lg">
                                                    <div
                                                        className={`flex-shrink-0 flex px-2 items-center justify-start w-32  border-r text-xl text-secondary font-medium rounded-l-md`}
                                                    >
                                                        {formatterForCurrency.format(claim?.total_payment_rebate)}
                                                    </div>
                                                    <div className="flex-1 flex items-center justify-between  border-gray-200 bg-white rounded-r-md truncate">
                                                        <div className="flex-1 px-4 py-2 text-md">
                                                            <div className="text-gray-900 font-medium hover:text-gray-600">
                                                                Original Claim
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="border rounded-lg flex">
                                                    <div
                                                        className={`flex-shrink-0 flex px-2 items-center justify-start w-32  text-secondary border-r text-xl font-medium rounded-l-md`}
                                                    >
                                                        {formatterForCurrency.format(claim?.report_total)}
                                                    </div>
                                                    <div className="flex-1 flex items-center justify-between  border-gray-200 bg-white rounded-r-md truncate">
                                                        <div className="flex-1 px-4 py-2 text-md">
                                                            <div className="text-gray-900 font-medium hover:text-gray-600">
                                                                Rebate in Period
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>

                                                <li className=" flex border rounded-lg">
                                                    <div
                                                        className={`flex-shrink-0 flex px-2 items-center justify-start w-32   text-brickRed border-r  text-xl font-medium rounded-l-md`}
                                                    >
                                                        {formatterForCurrency.format(claim?.totalDisputesCount)}
                                                    </div>
                                                    <div className="flex-1 flex items-center justify-between  border-gray-200 bg-white rounded-r-md truncate">
                                                        <div className="flex-1 px-4 py-2 text-md">
                                                            <div className="text-gray-900 font-medium hover:text-gray-600">
                                                                Total Disputes
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className=" flex border rounded-lg">
                                                    <div
                                                        className={`flex-shrink-0 flex px-2 items-center justify-start w-32 text-brickRed border-r  text-xl font-medium rounded-l-md`}
                                                    >
                                                        {formatterForCurrency.format(claim?.openDisputesCount)}
                                                    </div>
                                                    <div className="flex-1 flex items-center justify-between  border-gray-200 bg-white rounded-r-md truncate">
                                                        <div className="flex-1 px-4 py-2 text-md">
                                                            <div className="text-gray-900 font-medium hover:text-gray-600">
                                                                Open Disputes
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className="flex w-full py-1 border-t justify-between items-center">
                                                {!clicked ? (
                                                    <Button
                                                        title={`${csvLoading ? "Generating CSV" : "Generate CSV"}`}
                                                        color="primary"
                                                        onClick={() =>
                                                            downloadCSVQuery({
                                                                variables: {
                                                                    year: selectedYear,
                                                                    quarter: selectedQuarter,
                                                                    claimId: active,
                                                                },
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    <>
                                                        <CSVLink
                                                            data={filteredCsvData ? filteredCsvData : ""}
                                                            asyncOnClick={true}
                                                            className="text-white font-title bg-brickGreen   px-10 py-2 rounded-lg mr-2 ml-2 text-sm md:text-md"
                                                            separator={","}
                                                            onClick={() => {
                                                                setClicked(false);
                                                                setFilteredCsvData("");
                                                            }}
                                                            id="csvDownload"
                                                            filename={`${APP_TITLE} - Q${selectedQuarter}-${selectedYear} - ${claim?.program?.name}.csv`}
                                                            target="_blank"
                                                        >
                                                            Saving CSV
                                                        </CSVLink>

                                                        <CSVLink
                                                            data={
                                                                filteredCsvDataFactoryOverwrite
                                                                    ? filteredCsvDataFactoryOverwrite
                                                                    : ""
                                                            }
                                                            asyncOnClick={true}
                                                            className="hidden"
                                                            separator={","}
                                                            onClick={() => {
                                                                setClicked(false);
                                                                setFilteredCsvDataFactoryOverwrite("");
                                                            }}
                                                            id="csvDownloadFactoryOverwrite"
                                                            filename={`${APP_TITLE} - Factory - Builder Overwrites Allocations - Q${selectedQuarter}-${selectedYear} - ${claim?.program?.name}.csv`}
                                                            target="_blank"
                                                        >
                                                            Saving CSV
                                                        </CSVLink>
                                                    </>
                                                )}
                                                <div className="">
                                                    <Button
                                                        title="Open Claim"
                                                        color="primary"
                                                        onClick={() => openClaim(claim)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClaimPeriod;
