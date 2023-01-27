import { useLazyQuery } from "@apollo/client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet";
import {
    FETCH_CONVERSION_REVENUE_WITHOUT_PROGRAM_ID,
    FETCH_CONVERSION_REVENUE_WITH_PROGRAM_ID,
} from "../../../../../lib/claims";
import {
    FETCH_PROGRAM,
    FETCH_PROGRAMS_QUERY,
    FETCH_SEARCHED_PROGRAMS,
} from "../../../../../lib/programs";
import { useDebounce } from "../../../../../util/hooks";
import Loader from "../../../../Loader/Loader";
import HelperModal from "../../../../Modal/HelperModal";
import RevenueSection from "./RevenueSection";
import { formatterForCurrency } from "../../../../../util/generic";
import {APP_TITLE} from "../../../../../util/constants";

const ConversionRevenue = () => {
    const [searchString, setSearchString] = useState("");
    const [searched, setSearched] = useState();
    const [active, setActive] = useState();
    const [userData, setUserData] = useState();
    const [revenueData, setRevenueData] = useState();
    const first = 100;
    const programObserver = useRef();

    // eslint-disable-next-line
    const lastProgramElement = useCallback((node) => {
        if (programObserver.current) programObserver.current.disconnect();
        programObserver.current = new IntersectionObserver((entries) => {
            if (
                entries[0].isIntersecting &&
                data.programs.pageInfo.hasNextPage
            ) {
                fetchMore({
                    variables: {
                        first,
                        after: data.programs.pageInfo.endCursor,
                    },
                });
            }
        });
        if (node) programObserver.current.observe(node);
    });

    useEffect(() => {
        getPrograms();
        getConversionRevenueWithoutProgram();
        // eslint-disable-next-line
    }, []);

    const [
        getPrograms,
        { data, loading: programLoading, fetchMore },
    ] = useLazyQuery(FETCH_PROGRAMS_QUERY, {
        notifyOnNetworkStatusChange: false,
    });

    const [getEachProgram, { loading: eachProgramLoading }] = useLazyQuery(
        FETCH_PROGRAM,
        {
            notifyOnNetworkStatusChange: false,
            variables: {
                id: active,
            },
            fetchPolicy: "no-cache",
            onCompleted: (data) => {
                if (data?.program?.id) {
                    setSearched(false);
                    setUserData(data?.program);
                    setSearchString("");
                }
            },
        }
    );

    const getMonthYear = (date) => {
        var month = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        return month[date.getMonth()] + " " + date.getFullYear();
    };

    const [
        getConversionRevenueForProgram,
        { loading: withProgramLoading },
    ] = useLazyQuery(FETCH_CONVERSION_REVENUE_WITH_PROGRAM_ID, {
        notifyOnNetworkStatusChange: false,
        variables: {
            id: active,
        },
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            setRevenueData(data);
        },
    });

    const [
        getConversionRevenueWithoutProgram,
        { loading: withoutProgramLoading },
    ] = useLazyQuery(FETCH_CONVERSION_REVENUE_WITHOUT_PROGRAM_ID, {
        notifyOnNetworkStatusChange: false,
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            setRevenueData(data);
        },
    });

    const handleChange = (e) => {
        setSearchString(e.target.value);
    };

    const debouncedValue = useDebounce(searchString, 160);

    useEffect(() => {
        if (searchString?.length > 0) {
            setSearched(true);
            searchPrograms();
        }
        // eslint-disable-next-line
    }, [debouncedValue]);

    const [
        searchPrograms,
        { data: searchedPrograms, loading: searchedLoading },
    ] = useLazyQuery(FETCH_SEARCHED_PROGRAMS, {
        variables: {
            search: debouncedValue,
        },
        notifyOnNetworkStatusChange: false,
    });

    const setData = (eachUser) => {
        if (active === eachUser?.id) {
            setActive("");
            getConversionRevenueWithoutProgram();
        } else {
            setActive(eachUser.id);
            getEachProgram();
            getConversionRevenueForProgram();
        }
    };

    const refetch = (id) => {
        setActive(id);
        getEachProgram();
    };

    return (
        <div className="min-h-smallMin  max-w-8xl flex flex-col gap-5 h-full w-8xl mx-auto px-4 sm:px-6 lg:px-32">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Conversion Revenue</title>
            </Helmet>

            <div className=" bg-white rounded-lg py-4  px-4 h1 flex w-full justify-between items-center">
                <div className="flex items-center">
                    <p>Conversion Revenue</p>

                    <HelperModal
                        type={"conversionrevenue"}
                        title="Conversion Revenue Information"
                    />
                </div>
            </div>
            <div
                className="flex space-x-5   overflow-hidden mb-10"
                style={{ minHeight: "79vh", maxHeight: "79vh" }}
            >
                <div className="bg-white border w-full max-w-xs rounded-lg  ">
                    <div className="inset-0    h-full flex ">
                        <div className="flex flex-col w-full h-full  border-b">
                            <div className="font-title py-2 border-b  px-4 text-start h2 flex items-center justify-between">
                                <p> Programs</p>

                                <div className=" flex rounded-md shadow-sm">
                                    <div className="relative flex items-stretch flex-grow focus-within:z-10">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                                        <input
                                            type="text"
                                            name="searchPrograms"
                                            value={searchString}
                                            id="searchPrograms"
                                            className="focus:ring-secondary focus:border-secondary block w-full rounded-md  sm:text-sm border-gray-300"
                                            placeholder="Find or Add"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg   col-span-9 2xl:col-span-2 h-full">
                                <div className="h-full relative">
                                    <div className=" inset-0    border-gray-200  rounded-lg h-full flex flex-col">
                                        <div className="flex  w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                            <div className="w-full flex flex-col h-full border-r scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                <ul className=" flex-0 w-full h-full  overflow-auto border-l  border-white scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                    {searched ? (
                                                        searchedLoading ? (
                                                            <Loader />
                                                        ) : searchedPrograms
                                                              ?.searchPrograms
                                                              ?.edges
                                                              ?.length === 0 ? (
                                                            <div className="border-b py-2 px-2 text-secondary font-title font-semibold flex items-center justify-between">
                                                                <p>
                                                                    {" "}
                                                                    No Results
                                                                    Found{" "}
                                                                </p>
                                                                <span
                                                                    className="underline cursor-pointer text-brickRed"
                                                                    onClick={() => {
                                                                        setSearchString(
                                                                            ""
                                                                        );
                                                                        setSearched(
                                                                            false
                                                                        );
                                                                    }}
                                                                >
                                                                    {" "}
                                                                    Reset{" "}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            searchedPrograms &&
                                                            searchedPrograms.searchPrograms &&
                                                            searchedPrograms
                                                                .searchPrograms
                                                                .edges
                                                                .length !== 0 &&
                                                            searchedPrograms?.searchPrograms?.edges?.map(
                                                                (
                                                                    eachData,
                                                                    index
                                                                ) => {
                                                                    if (
                                                                        index ===
                                                                        data
                                                                            ?.subcontractors
                                                                            ?.edges
                                                                            ?.length -
                                                                            1
                                                                    ) {
                                                                        return (
                                                                            <li
                                                                                className={`  border-b transition-all  border-l-4  hover:border-l-6   ${
                                                                                    active ===
                                                                                    eachData
                                                                                        .node
                                                                                        .id
                                                                                        ? "bg-gray-100 border-l-gold border-l-6  text-darkgray75 "
                                                                                        : "text-darkgray75 border-l-primary"
                                                                                }`}
                                                                                onClick={() =>
                                                                                    setData(
                                                                                        eachData.node
                                                                                    )
                                                                                }
                                                                                ref={
                                                                                    lastProgramElement
                                                                                }
                                                                            >
                                                                                <div className="relative flex flex-col py-3  ">
                                                                                    <div className="text-sm px-2 font-semibold  ">
                                                                                        <div className="  focus:outline-none">
                                                                                            <span
                                                                                                className="absolute inset-0"
                                                                                                aria-hidden="true"
                                                                                            ></span>
                                                                                            {
                                                                                                eachData
                                                                                                    .node
                                                                                                    .name
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-start px-2">
                                                                                        <p
                                                                                            className="text-sm text-gray-500 capitalize "
                                                                                            style={{
                                                                                                minWidth:
                                                                                                    "58px",
                                                                                            }}
                                                                                        >
                                                                                            {eachData?.node?.type?.toLowerCase()}{" "}
                                                                                            {eachData
                                                                                                ?.node
                                                                                                ?.company
                                                                                                ?.name
                                                                                                ? "-"
                                                                                                : ""}
                                                                                        </p>
                                                                                        <p className="text-sm text-gray-500 capitalize">
                                                                                            {eachData
                                                                                                ?.node
                                                                                                ?.company
                                                                                                ?.name
                                                                                                ? eachData
                                                                                                      ?.node
                                                                                                      ?.company
                                                                                                      ?.name
                                                                                                : ""}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        );
                                                                    }
                                                                    return (
                                                                        <li
                                                                            className={`  border-b transition-all border-l-4   hover:border-l-6   ${
                                                                                active ===
                                                                                eachData
                                                                                    .node
                                                                                    .id
                                                                                    ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                                    : "text-darkgray75 border-l-primary"
                                                                            }`}
                                                                            onClick={() =>
                                                                                setData(
                                                                                    eachData.node
                                                                                )
                                                                            }
                                                                        >
                                                                            <div className="relative flex flex-col py-3  ">
                                                                                <div className="text-sm px-2 font-semibold  ">
                                                                                    <div className="  focus:outline-none">
                                                                                        <span
                                                                                            className="absolute inset-0"
                                                                                            aria-hidden="true"
                                                                                        ></span>
                                                                                        {
                                                                                            eachData
                                                                                                .node
                                                                                                .name
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex items-start px-2">
                                                                                    <p
                                                                                        className="text-sm text-gray-500 capitalize "
                                                                                        style={{
                                                                                            minWidth:
                                                                                                "58px",
                                                                                        }}
                                                                                    >
                                                                                        {eachData?.node?.type?.toLowerCase()}{" "}
                                                                                        {eachData
                                                                                            ?.node
                                                                                            ?.company
                                                                                            ?.name
                                                                                            ? "-"
                                                                                            : ""}
                                                                                    </p>
                                                                                    <p className="text-sm text-gray-500 capitalize">
                                                                                        {eachData
                                                                                            ?.node
                                                                                            ?.company
                                                                                            ?.name
                                                                                            ? eachData
                                                                                                  ?.node
                                                                                                  ?.company
                                                                                                  ?.name
                                                                                            : ""}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    );
                                                                }
                                                            )
                                                        )
                                                    ) : programLoading ? (
                                                        <Loader />
                                                    ) : (
                                                        data &&
                                                        data.programs &&
                                                        data.programs.edges
                                                            .length !== 0 &&
                                                        data.programs.edges.map(
                                                            (
                                                                eachData,
                                                                index
                                                            ) => {
                                                                if (
                                                                    index ===
                                                                    data
                                                                        .programs
                                                                        .edges
                                                                        .length -
                                                                        1
                                                                ) {
                                                                    return (
                                                                        <li
                                                                            className={`  border-b transition-all  border-l-4    hover:border-l-6   ${
                                                                                active ===
                                                                                eachData
                                                                                    .node
                                                                                    .id
                                                                                    ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                                    : "text-darkgray75 border-l-primary"
                                                                            }`}
                                                                            onClick={() =>
                                                                                setData(
                                                                                    eachData.node
                                                                                )
                                                                            }
                                                                            ref={
                                                                                lastProgramElement
                                                                            }
                                                                        >
                                                                            <div className="relative flex flex-col py-3  ">
                                                                                <div className="text-sm px-2 font-semibold  ">
                                                                                    <div className="  focus:outline-none">
                                                                                        <span
                                                                                            className="absolute inset-0"
                                                                                            aria-hidden="true"
                                                                                        ></span>
                                                                                        {
                                                                                            eachData
                                                                                                .node
                                                                                                .name
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex items-start px-2">
                                                                                    <p
                                                                                        className="text-sm text-gray-500 capitalize "
                                                                                        style={{
                                                                                            minWidth:
                                                                                                "58px",
                                                                                        }}
                                                                                    >
                                                                                        {eachData?.node?.type?.toLowerCase()}{" "}
                                                                                        {eachData
                                                                                            ?.node
                                                                                            ?.company
                                                                                            ?.name
                                                                                            ? "-"
                                                                                            : ""}
                                                                                    </p>
                                                                                    <p className="text-sm text-gray-500 capitalize">
                                                                                        {eachData
                                                                                            ?.node
                                                                                            ?.company
                                                                                            ?.name
                                                                                            ? eachData
                                                                                                  ?.node
                                                                                                  ?.company
                                                                                                  ?.name
                                                                                            : ""}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    );
                                                                }
                                                                return (
                                                                    <li
                                                                        className={`  border-b transition-all  border-l-4    hover:border-l-6  ${
                                                                            active ===
                                                                            eachData
                                                                                .node
                                                                                .id
                                                                                ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                                : "text-darkgray75 border-l-primary"
                                                                        }`}
                                                                        onClick={() =>
                                                                            setData(
                                                                                eachData.node
                                                                            )
                                                                        }
                                                                    >
                                                                        <div className="relative flex flex-col py-3  ">
                                                                            <div className="text-sm px-2 font-semibold  ">
                                                                                <div className="  focus:outline-none">
                                                                                    <span
                                                                                        className="absolute inset-0"
                                                                                        aria-hidden="true"
                                                                                    ></span>
                                                                                    {
                                                                                        eachData
                                                                                            .node
                                                                                            .name
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-start px-2">
                                                                                <p
                                                                                    className="text-sm text-gray-500 capitalize "
                                                                                    style={{
                                                                                        minWidth:
                                                                                            "58px",
                                                                                    }}
                                                                                >
                                                                                    {eachData?.node?.type?.toLowerCase()}{" "}
                                                                                    {eachData
                                                                                        ?.node
                                                                                        ?.company
                                                                                        ?.name
                                                                                        ? "-"
                                                                                        : ""}
                                                                                </p>
                                                                                <p className="text-sm text-gray-500 capitalize">
                                                                                    {eachData
                                                                                        ?.node
                                                                                        ?.company
                                                                                        ?.name
                                                                                        ? eachData
                                                                                              ?.node
                                                                                              ?.company
                                                                                              ?.name
                                                                                        : ""}
                                                                                </p>
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

                                        <div className="flex flex-col w-full py-2 border-t justify-end items-center">
                                            <div className="  text-secondary font-bold">
                                                Total:{" "}
                                                {searched
                                                    ? searchedPrograms &&
                                                      searchedPrograms.searchPrograms &&
                                                      searchedPrograms
                                                          .searchPrograms.edges
                                                          .length
                                                    : data &&
                                                      data.programs &&
                                                      data.programs.pageInfo
                                                          .total}{" "}
                                                Programs
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border w-full max-w-xs  2xl:max-w-lg  rounded-lg  ">
                    <div className="h-full relative">
                        <div className="    h-full flex flex-col">
                            <div className="flex px-4 flex-col md:flex-row justify-between items-center border-b">
                                <div className="font-title  py-4 text-left h2 flex items-center justify-between">
                                    Conversion Revenue
                                    {withProgramLoading ||
                                    eachProgramLoading ? (
                                        <Loader width={25} height={25} />
                                    ) : active && userData?.name ? (
                                        ": " + userData?.name
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                            {active ? (
                                <RevenueSection
                                    program={userData}
                                    refetch={(id) => refetch(id)}
                                    revenueData={revenueData}
                                    loading={
                                        withProgramLoading ||
                                        withoutProgramLoading
                                    }
                                />
                            ) : null}
                            {active? (
                                <div className="flex flex-col w-full py-2 border-t justify-end items-center">
                                    <div className="  text-secondary font-bold font-title flex items-center justify-between">
                                        Total Program Conversion Revenue :{" "}
                                        {withProgramLoading ||
                                        withoutProgramLoading ? (
                                            <Loader width={25} height={25} />
                                        ) : 
                                            formatterForCurrency.format(revenueData?.conversionRevenue?.yearTotal?.total)
                                        }
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="bg-white border  w-full rounded-lg">
                    <div className="h-full relative ">
                        <div className="h-full flex flex-col">
                            <div className="flex px-4 flex-col md:flex-row justify-between items-center border-b">
                                <div className=" font-title flex items-center  py-4 text-left h2 ">
                                    Summary
                                    {withProgramLoading ||
                                    eachProgramLoading ? (
                                        <Loader width={25} height={25} />
                                    ) : active && userData?.name ? (
                                        ": " + userData?.name
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                            <div className="h-full flex flex-col">
                                <div className="border-b">
                                    <p className="font-title  py-2 text-start px-4 h2">
                                        Conversion Revenue
                                    </p>
                                    <div className="grid grid-cols-4 ">
                                        {withProgramLoading ||
                                        withoutProgramLoading ? (
                                            <div className="flex items-center justify-center col-span-4">
                                                <Loader />
                                            </div>
                                        ) : (
                                            <>
                                                <p className="font-title   text-start px-4 text-darkgray75 font-semibold">
                                                    Quarter
                                                </p>
                                                <p className="font-title   text-start px-4 text-darkgray75 font-semibold">
                                                    Start Date
                                                </p>
                                                <p className="font-title   text-start px-4 text-darkgray75 font-semibold">
                                                    End Date
                                                </p>
                                                <p className="font-title   text-start px-4 text-darkgray75 font-semibold">
                                                    Total
                                                </p>
                                                <ul className="grid grid-cols-4 col-span-4 max-h-32 overflow-auto  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                    {revenueData?.conversionRevenue?.quarterly?.map(
                                                        (item) => {
                                                            return (
                                                                <li className="grid grid-cols-4 col-span-4">
                                                                    <p className="font-body   text-start px-4 text-darkgray75">
                                                                        {
                                                                            item?.displayName
                                                                        }
                                                                    </p>
                                                                    <p className="font-body   text-start px-4 text-darkgray75">
                                                                        {getMonthYear(
                                                                            new Date(
                                                                                item?.start
                                                                            )
                                                                        )}
                                                                    </p>
                                                                    <p className="font-body   text-start px-4 text-darkgray75">
                                                                        {getMonthYear(
                                                                            new Date(
                                                                                item?.end
                                                                            )
                                                                        )}
                                                                    </p>
                                                                    <p className="font-body   text-start px-4 text-darkgray75">
                                                                        {formatterForCurrency.format(item?.total)}
                                                                    </p>
                                                                </li>
                                                            );
                                                        }
                                                    )}
                                                </ul>

                                                <div className="col-span-4 grid grid-cols-4 ">
                                                    <p className="font-title col-span-2   text-start px-4 text-secondary font-semibold">
                                                        {
                                                            revenueData
                                                                ?.conversionRevenue
                                                                ?.yearTotal
                                                                ?.year
                                                        }
                                                    </p>
                                                    <p className="font-title col-span-2 col-start-4 text-start px-4 text-secondary font-semibold">
                                                        {formatterForCurrency.format(revenueData?.conversionRevenue?.yearTotal?.total)}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="border-b h-full overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 pb-16">
                                    <p className="font-title  py-2 text-start px-4 h2">
                                        Payments Due
                                    </p>
                                    {withProgramLoading ||
                                    withoutProgramLoading ? (
                                        <Loader />
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-3">
                                                <p className="font-title   text-start px-4 text-darkgray75 font-semibold">
                                                    Program
                                                </p>
                                                <p className="font-title   text-start px-4 text-darkgray75 font-semibold">
                                                    Due Date
                                                </p>
                                                <p className="font-title   text-start px-4 text-darkgray75 font-semibold">
                                                    Payments Owed
                                                </p>
                                                <ul className="col-span-3 overflow-auto">
                                                    {revenueData?.paymentsDue?.conversionPaymentDue?.map(
                                                        (item) => {
                                                            return (
                                                                <li className="grid grid-cols-3 w-full">
                                                                    <p className="font-body   text-start px-4 text-darkgray75">
                                                                        {active
                                                                            ? item
                                                                                  ?.conversion
                                                                                  ?.name
                                                                            : item
                                                                                  ?.program
                                                                                  ?.name}
                                                                    </p>
                                                                    <p className="font-body   text-start px-4 text-darkgray75">
                                                                        {getMonthYear(
                                                                            new Date(
                                                                                item?.due_date
                                                                            )
                                                                        )}
                                                                    </p>
                                                                    {item
                                                                        ?.conversion
                                                                        ?.__typename ===
                                                                    "ConversionTieredPercent" ? (
                                                                        <div>
                                                                            {item?.conversion?.tiers?.edges?.map(
                                                                                (
                                                                                    item
                                                                                ) => {
                                                                                    return (
                                                                                        <p className="font-body   text-start px-4 text-darkgray75">
                                                                                            {
                                                                                                item
                                                                                                    ?.node
                                                                                                    ?.bonus_amount
                                                                                            }{" "}
                                                                                            %
                                                                                            if
                                                                                            spend
                                                                                            is
                                                                                            {formatterForCurrency.format(item?.node?.spend_exceed)}
                                                                                        </p>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <p className="font-body   text-start px-4 text-darkgray75">
                                                                            
                                                                            {formatterForCurrency.format(
                                                                                item?.payment_owed
                                                                            )}
                                                                        </p>
                                                                    )}
                                                                </li>
                                                            );
                                                        }
                                                    )}
                                                </ul>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConversionRevenue;
