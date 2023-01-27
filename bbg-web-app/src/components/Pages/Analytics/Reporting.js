import { useLazyQuery } from "@apollo/client";
import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import {
    ANALYTICS_PRODUCTS,
    ANALYTICS_PROGRAMS,
    ANALYTICS_REPORT_BY_BUILDERS,
    ANALYTICS_REPORT_BY_PROGRAMS,
    ANALYTICS_REPORT_BY_PRODUCTS,
    ANALYTICS_REPORT_BY_TMS,
    CLAIM_CHART_REPORT,
} from "../../../lib/analytics";
import { GET_TERRITORY_MANAGERS } from "../../../lib/builders";
import { FETCH_STATES_QUERY } from "../../../lib/common";
import { FETCH_ORGANIZATIONS_QUERY } from "../../../lib/organization";
import Button from "../../Buttons";
import HelperModal from "../../Modal/HelperModal";
import CommonSelect from "../../Select";
import Loader from "../../Loader/Loader";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import { AuthContext } from "../../../contexts/auth";
import { formatterForCurrency } from "../../../util/generic"
import {APP_TITLE} from "../../../util/constants";


const Reporting = () => {

    
    const [enabled, setEnabled] = useState("builders");
    const [programParticipants, setProgramParticipants] = useState([]);
    const [programSelection, setProgramSelection] = useState([]);
    const [productSelection, setProductSelection] = useState([]);
    const [stateSelection, setStateSelection] = useState([]);
    const [tmSelection, setTmSelection] = useState([]);
    const [defaultFilters, setDefaultFilters] = useState(true);
    const [currentYearQuarter, setCurrentYearQuarter] = useState();
    const [showFilters, setShowFilters] = useState(false);

    const {type} = useContext(AuthContext);

    useEffect(() => {
        setCurrentYearandQuarter();
        participants();
    }, []);

    const setCurrentYearandQuarter = () => {
        var today = new Date();
        var quarter = Math.floor((today.getMonth() + 3) / 3);
        var year = today.getFullYear();
        setCurrentYearQuarter({
            year: year,
            quarter: quarter,
        });
    };

    const handleBoolChange = (e, type) => {
        if (type === "select") {
            setEnabled(e.target.id);
        }
    };

    const SwitchButton = ({ array, type, wFull }) => {
        return (
            <div
                className={
                    wFull
                        ? "w-full rounded-lg rounded-b-none  overflow-hidden border-b"
                        : ""
                }
            >
                <div
                    className="flex flex-row w-full hover:bg-gray-100"
                    style={{ maxHeight: "59px" }}
                >
                    {array?.map((item) => {
                        return (
                            <button
                                type="button"
                                onClick={(e) => handleBoolChange(e, type)}
                                id={item?.value}
                                className={`inline-flex ${
                                    wFull
                                        ? "w-full text-lg py-4 "
                                        : "px-4 py-2 m-1 rounded-md rounded-r-none"
                                } justify-center items-center text-center  mr-0  shadow-sm text-sm font-title font-medium text-white ${
                                    enabled === item?.value
                                        ? "bg-secondary border-secondary"
                                        : "text-secondary bg-white hover:bg-gray-50"
                                }  focus:outline-none `}
                            >
                                {item?.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const handleTerritoryManagersForSelect = (items) => {
        let objectToSend = {};

        let values = items?.map((item) => {
            let parentObject = {};
            let object = {};
            object.name = item?.node?.fullName;
            object.id = item?.node?.id;
            parentObject.node = object;
            return parentObject;
        });

        objectToSend.edges = values;
        return objectToSend;
    };

    useEffect(() => {
        getOrganizations();
        getPrograms();
        getProducts();
        getStates();
        getTms();
        // eslint-disable-next-line
    }, []);

    const array = [
        {
            value: "builders",
            label: "By Builder",
        },
        {
            value: "programs",
            label: "By Program",
        },
        {
            value: "products",
            label: "By Product",
        },
        {
            value: "tms",
            label: "By TM",
        },
    ];

    const [getOrganizations, { data: organizations }] = useLazyQuery(
        FETCH_ORGANIZATIONS_QUERY,
        {
            variables: {
                organization_type: ["BUILDERS"],
                first: 200000,
            },
            fetchPolicy: "network-only",
            notifyOnNetworkStatusChange: false,
        }
    );

    const [getPrograms, { data: programs }] = useLazyQuery(ANALYTICS_PROGRAMS, {
        variables: {
            first: 200000,
        },
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange: false,
    });

    const [getProducts, { data: products }] = useLazyQuery(ANALYTICS_PRODUCTS, {
        variables: {
            first: 200000,
        },
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange: false,
    });

    const [getStates, { data: states }] = useLazyQuery(FETCH_STATES_QUERY, {
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange: false,
    });

    const [getTms, { data: territoryManagers }] = useLazyQuery(
        GET_TERRITORY_MANAGERS,
        {
            variables: {
                builderIds: programParticipants?.map((item) => item?.value)
            },
            fetchPolicy: "network-only",
            notifyOnNetworkStatusChange: false,
        }
    );

    const [
        getAnalyticsReportByBuilders,
        { data: analyticsByBuilders, loading: builderLoading },
    ] = useLazyQuery(ANALYTICS_REPORT_BY_BUILDERS, {
        variables: {
            builderIds: programParticipants?.map((item) => item?.value)
        },
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange: false,
    });

    const [
        getAnalyticsReportByPrograms,
        { data: analyticsByPrograms, loading: programLoading },
    ] = useLazyQuery(ANALYTICS_REPORT_BY_PROGRAMS, {
        variables: {
            builderIds: programParticipants?.map((item) => item?.value)
        },
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange: false,
    });

    const [
        getAnalyticsReportByProducts,
        { data: analyticsByProducts, loading: productLoading },
    ] = useLazyQuery(ANALYTICS_REPORT_BY_PRODUCTS, {
        variables: {
            builderIds: programParticipants?.map((item) => item?.value)
        },
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange: false,
    });

    const [
        getAnalyticsReportByTMs,
        { data: analyticsByTMs, loading: tmLoading },
    ] = useLazyQuery(ANALYTICS_REPORT_BY_TMS, {
        variables: {
            builderIds: programParticipants?.map((item) => item?.value)
        },
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange: false,
    });

    useEffect(() => {
        if (enabled === "builders") {
            getAnalyticsReportByBuilders({
                variables: {
                    builderIds: programParticipants?.map((item) => item?.value),
                    programIds: programSelection?.map((item) => item?.value),
                    productIds: productSelection?.map((item) => item?.value),
                    regionIds: stateSelection?.map((item) => item?.value),
                    territoryManagerIds: tmSelection?.map(
                        (item) => item?.value
                    ),
                },
            });
        } else if (enabled === "programs") {
            getAnalyticsReportByPrograms({
                variables: {
                    builderIds: programParticipants?.map((item) => item?.value),
                    programIds: programSelection?.map((item) => item?.value),
                    productIds: productSelection?.map((item) => item?.value),
                    regionIds: stateSelection?.map((item) => item?.value),
                    territoryManagerIds: tmSelection?.map(
                        (item) => item?.value
                    ),
                },
            });
        } else if (enabled === "products") {
            getAnalyticsReportByProducts({
                variables: {
                    builderIds: programParticipants?.map((item) => item?.value),
                    programIds: programSelection?.map((item) => item?.value),
                    productIds: productSelection?.map((item) => item?.value),
                    regionIds: stateSelection?.map((item) => item?.value),
                    territoryManagerIds: tmSelection?.map(
                        (item) => item?.value
                    ),
                },
            });
        } else if (enabled === "tms") {
            getAnalyticsReportByTMs({
                variables: {
                    builderIds: programParticipants?.map((item) => item?.value),
                    programIds: programSelection?.map((item) => item?.value),
                    productIds: productSelection?.map((item) => item?.value),
                    regionIds: stateSelection?.map((item) => item?.value),
                    territoryManagerIds: tmSelection?.map(
                        (item) => item?.value
                    ),
                },
            });
        }

        // eslint-disable-next-line
    }, [enabled]);

    useEffect(() => {
        if (currentYearQuarter?.year && currentYearQuarter?.quarter) {
            getAnalyticsData({
                variables: {
                    year: currentYearQuarter?.year,
                    quarter: currentYearQuarter?.quarter,
                    builderIds: programParticipants?.map((item) => item?.value),
                    programIds: programSelection?.map((item) => item?.value),
                    productIds: productSelection?.map((item) => item?.value),
                    regionIds: stateSelection?.map((item) => item?.value),
                    territoryManagerIds: tmSelection?.map(
                        (item) => item?.value
                    ),
                },
            });
        }
        // eslint-disable-next-line
    }, [currentYearQuarter]);

    const [
        getAnalyticsData,
        { data: analyticsData, loading: chartLoading },
    ] = useLazyQuery(CLAIM_CHART_REPORT, {});

    const fetchQueries = () => {
        if (enabled === "builders") {
            getAnalyticsReportByBuilders({
                variables: {
                    builderIds: programParticipants?.map((item) => item?.value),
                    programIds: programSelection?.map((item) => item?.value),
                    productIds: productSelection?.map((item) => item?.value),
                    regionIds: stateSelection?.map((item) => item?.value),
                    territoryManagerIds: tmSelection?.map(
                        (item) => item?.value
                    ),
                },
            });
        } else if (enabled === "programs") {
            getAnalyticsReportByPrograms({
                variables: {
                    builderIds: programParticipants?.map((item) => item?.value),
                    programIds: programSelection?.map((item) => item?.value),
                    productIds: productSelection?.map((item) => item?.value),
                    regionIds: stateSelection?.map((item) => item?.value),
                    territoryManagerIds: tmSelection?.map(
                        (item) => item?.value
                    ),
                },
            });
        } else if (enabled === "products") {
            getAnalyticsReportByProducts({
                variables: {
                    builderIds: programParticipants?.map((item) => item?.value),
                    programIds: programSelection?.map((item) => item?.value),
                    productIds: productSelection?.map((item) => item?.value),
                    regionIds: stateSelection?.map((item) => item?.value),
                    territoryManagerIds: tmSelection?.map(
                        (item) => item?.value
                    ),
                },
            });
        } else if (enabled === "tms") {
            getAnalyticsReportByTMs({
                variables: {
                    builderIds: programParticipants?.map((item) => item?.value),
                    programIds: programSelection?.map((item) => item?.value),
                    productIds: productSelection?.map((item) => item?.value),
                    regionIds: stateSelection?.map((item) => item?.value),
                    territoryManagerIds: tmSelection?.map(
                        (item) => item?.value
                    ),
                },
            });
        }

        getAnalyticsData({
            variables: {
                year: currentYearQuarter?.year,
                quarter: currentYearQuarter?.quarter,
                builderIds: programParticipants?.map((item) => item?.value),
                programIds: programSelection?.map((item) => item?.value),
                productIds: productSelection?.map((item) => item?.value),
                regionIds: stateSelection?.map((item) => item?.value),
                territoryManagerIds: tmSelection?.map((item) => item?.value),
            },
        });
        setShowFilters(false);
    };

    useEffect(() => {
        if (
            programParticipants?.length === 0 &&
            programSelection?.length === 0 &&
            productSelection?.length === 0 &&
            stateSelection?.length === 0 &&
            tmSelection?.length === 0
        ) {
            setDefaultFilters(true);
        } else {
            setDefaultFilters(false);
        }
    }, [
        programParticipants,
        programSelection,
        productSelection,
        stateSelection,
        tmSelection,
    ]);

    const participants = (e) => {
        let array = [];
        e?.forEach((item) => {
            let object = {};
            object.value = item.value;
            object.label = item.label;
            array.push(object);
        });

        setProgramParticipants(array);
    };

    const programHandler = (e) => {
        let array = [];
        e?.forEach((item) => {
            let object = {};
            object.value = item.value;
            object.label = item.label;
            array.push(object);
        });
        setProgramSelection(array);
    };

    const productHandler = (e) => {
        let array = [];
        e?.forEach((item) => {
            let object = {};
            object.value = item.value;
            object.label = item.label;
            array.push(object);
        });
        setProductSelection(array);
    };

    const stateHandler = (e) => {
        let array = [];
        e?.forEach((item) => {
            let object = {};
            object.value = item.value;
            object.label = item.label;
            array.push(object);
        });
        setStateSelection(array);
    };

    const TMHandler = (e) => {
        let array = [];
        e?.forEach((item) => {
            let object = {};
            object.value = item.value;
            object.label = item.label;
            array.push(object);
        });
        setTmSelection(array);
    };

    const makeGraphs = () => {
        let report = analyticsData?.claimChartReport;

        let yearCloseMax = Math.max(
            report?.yearCloseClaims?.factoryTotal +
                report?.yearCloseClaims?.volumeTotal,
            report?.yearCloseClaims?.previousResults?.factoryTotal +
                report?.yearCloseClaims?.previousResults?.volumeTotal
        );

        let periodCloseMax = Math.max(
            report?.periodCloseClaims?.factoryTotal +
                report?.periodCloseClaims?.volumeTotal,
            report?.periodCloseClaims?.previousResults?.factoryTotal +
                report?.periodCloseClaims?.previousResults?.volumeTotal
        );

        let totalMax = Math.max(yearCloseMax, periodCloseMax);

        let maxHeight = 500;

        if (window?.innerWidth < 1500) {
            maxHeight = 450;
        }
        const findHeight = (value, relative) => {
            return (value * maxHeight) / relative;
        };

        let currentPeriodHeight = findHeight(
            report?.periodCloseClaims?.factoryTotal +
                report?.periodCloseClaims?.volumeTotal,
            totalMax
        );
        let pastPeriodHeight = findHeight(
            report?.periodCloseClaims?.previousResults?.factoryTotal +
                report?.periodCloseClaims?.previousResults?.volumeTotal,
            totalMax
        );

        let currentYearHeight = findHeight(
            report?.yearCloseClaims?.factoryTotal +
                report?.yearCloseClaims?.volumeTotal,
            totalMax
        );

        let pastYearHeight = findHeight(
            report?.yearCloseClaims?.previousResults?.factoryTotal +
                report?.yearCloseClaims?.previousResults?.volumeTotal,
            totalMax
        );

        return (
            <div className="flex w-full h-full  4xl:space-x-5">
                <div className="flex py-1  w-full px-2 space-x-2  4xl:space-x-10">
                    <div className="flex flex-col w-full justify-end items-center 4xl:pl-5">
                        <div className="flex   items-end justify-center w-full">
                            <div
                                className="w-full text-center flex flex-col   font-medium "
                                style={{ maxWidth: "200px" }}
                            >
                                <div className=" ">
                                    {formatterForCurrency.format(
                                        report?.periodCloseClaims
                                            ?.previousResults?.factoryTotal +
                                        report?.periodCloseClaims
                                            ?.previousResults?.volumeTotal
                                    )}
                                    <div
                                        className="bg-darkgray75 w-full duration-250 border-b-2 border-black transition-height"
                                        style={{
                                            height: `${
                                                isNaN(pastPeriodHeight)
                                                    ? "0"
                                                    : pastPeriodHeight
                                            }px`,
                                        }}
                                    >
                                        &nbsp;
                                    </div>
                                    <p className="pt-2">
                                        Q{currentYearQuarter?.quarter - 1}
                                    </p>
                                </div>
                            </div>
                            <div
                                className="w-full text-center flex flex-col   font-medium"
                                style={{ maxWidth: "200px" }}
                            >
                                <div className=" ">
                                    {formatterForCurrency.format(
                                        report?.periodCloseClaims
                                            ?.factoryTotal +
                                        report?.periodCloseClaims?.volumeTotal
                                    )}
                                    <div
                                        className="bg-secondary w-full duration-250 border-b-2 border-black transition-height"
                                        style={{
                                            height: `${
                                                isNaN(currentPeriodHeight)
                                                    ? "0"
                                                    : currentPeriodHeight
                                            }px`,
                                        }}
                                    >
                                        &nbsp;
                                    </div>
                                    <p className="pt-2">
                                        Q{currentYearQuarter?.quarter}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className=" text-secondary font-title text-xl">
                            Reporting Period
                        </p>
                    </div>
                    <div className="flex flex-col w-full justify-end items-center pr-5 ">
                        <div className="flex     items-end justify-center w-full">
                            <div
                                className="w-full text-center flex flex-col   font-medium"
                                style={{ maxWidth: "200px" }}
                            >
                                <div className=" ">
                                    {formatterForCurrency.format(
                                        report?.yearCloseClaims?.previousResults
                                            ?.factoryTotal +
                                        report?.yearCloseClaims?.previousResults
                                            ?.volumeTotal
                                    )}
                                    <div
                                        className="bg-darkgray75 w-full duration-250 border-b-2 border-black transition-height"
                                        style={{
                                            height: `${
                                                isNaN(pastYearHeight)
                                                    ? "0"
                                                    : pastYearHeight
                                            }px`,
                                        }}
                                    >
                                        &nbsp;
                                    </div>
                                    <p className="pt-2">
                                        {currentYearQuarter?.year - 1}
                                    </p>
                                </div>
                            </div>
                            <div
                                className="w-full text-center flex flex-col   font-medium"
                                style={{ maxWidth: "200px" }}
                            >
                                <div className=" ">
                                    {formatterForCurrency.format(
                                        report?.yearCloseClaims?.factoryTotal +
                                        report?.yearCloseClaims?.volumeTotal
                                    )}
                                    <div
                                        className="bg-secondary w-full duration-250 border-b-2 border-black transition-height"
                                        style={{
                                            height: `${
                                                isNaN(currentYearHeight)
                                                    ? "0"
                                                    : currentYearHeight
                                            }px`,
                                        }}
                                    >
                                        &nbsp;
                                    </div>
                                    <p className="pt-2">
                                        {currentYearQuarter?.year}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className=" text-secondary font-title text-xl">
                            Total
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex-1 pb-5 3xl:pb-0">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Reporting</title>
            </Helmet>
            <div className="flex flex-col h-full pb-5">
                <main className="flex-1">
                    <div className="max-w-8xl flex flex-col h-full w-8xl mx-auto px-4 sm:px-6 lg:px-32">
                        <div className=" flex flex-col h-full gap-5 xl:flex-row rounded-lg">
                            <div className="w-full">
                                <div className="grid gap-5 grid-cols-10 min-h-layout   overflow-hidden">
                                    <div className="col-span-10 bg-white rounded-lg py-4  px-4 h1 flex flex-col ">
                                        <div className="flex items-center justify-between  ">
                                            <div className="flex items-start justify-center">
                                                <p> Reporting</p>
                                                <HelperModal
                                                    type={"reporting"}
                                                    title="Reporting Information"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg font-title font-semibold col-span-10">
                                    <div
                                            className="flex 6xl:gap-0 6xl:flex w-full space-x-5   6xl:justify-between py-2 px-4   cursor-pointer "
                                            onClick={() =>
                                                setShowFilters(!showFilters)
                                            }
                                        >
                                            <div className="flex ">
                                                <div className="flex space-x-2 items-center pr-5">
                                                    <span className=" text-sm  text-secondary ">
                                                        Filters
                                                    </span>
                                                    <div
                                                        className="border-r pr-5"
                                                        style={{
                                                            maxHeight:
                                                                "1.25rem",
                                                        }}
                                                    >
                                                        {showFilters ? (
                                                            <ChevronUpIcon className="text-secondary w-5 h-5 " />
                                                        ) : (
                                                            <ChevronDownIcon className="text-secondary w-5 h-5 " />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-10 w-full ">
                                                {   
                                                type !== "BUILDERS"?

                                                
                                                <div className=" col-span-2">
                                                    {defaultFilters ? (
                                                        <span className="ml-2 text-sm  text-secondary">
                                                            Builders:{" "}
                                                            <span className="text-gray-500">
                                                                {" "}
                                                                All{" "}
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <div className="flex flex-col ">
                                                            <span className="ml-2 text-sm  text-secondary">
                                                                Builders:
                                                            </span>
                                                            {programParticipants?.length >
                                                            0 ? (
                                                                programParticipants?.map(
                                                                    (item) => {
                                                                        return (
                                                                            <span className="ml-2 text-sm  text-gray-500">
                                                                                {
                                                                                    item?.label
                                                                                }
                                                                            </span>
                                                                        );
                                                                    }
                                                                )
                                                            ) : (
                                                                <span className="ml-2 text-sm  text-gray-500">
                                                                    All
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div> : null
}
                                                <div className=" col-span-2">
                                                    {defaultFilters ? (
                                                        <span className="ml-2 text-sm  text-secondary">
                                                            Programs:{" "}
                                                            <span className="text-gray-500">
                                                                {" "}
                                                                All{" "}
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <div className="flex flex-col ">
                                                            <span className="ml-2 text-sm  text-secondary">
                                                                Programs:
                                                            </span>
                                                            {programSelection?.length >
                                                            0 ? (
                                                                programSelection?.map(
                                                                    (item) => {
                                                                        return (
                                                                            <span className="ml-2 text-sm  text-gray-500">
                                                                                {
                                                                                    item?.label
                                                                                }
                                                                            </span>
                                                                        );
                                                                    }
                                                                )
                                                            ) : (
                                                                <span className="ml-2 text-sm  text-gray-500">
                                                                    All
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className=" col-span-2">
                                                    {defaultFilters ? (
                                                        <span className="ml-2 text-sm  text-secondary">
                                                            Products:{" "}
                                                            <span className="text-gray-500">
                                                                {" "}
                                                                All{" "}
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <div className="flex flex-col ">
                                                            <span className="ml-2 text-sm  text-secondary">
                                                                Products:
                                                            </span>
                                                            {productSelection?.length >
                                                            0 ? (
                                                                productSelection?.map(
                                                                    (item) => {
                                                                        return (
                                                                            <span className="ml-2 text-sm  text-gray-500">
                                                                                {
                                                                                    item?.label
                                                                                }
                                                                            </span>
                                                                        );
                                                                    }
                                                                )
                                                            ) : (
                                                                <span className="ml-2 text-sm  text-gray-500">
                                                                    All
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className=" col-span-2">
                                                    {defaultFilters ? (
                                                        <span className="ml-2 text-sm  text-secondary">
                                                            States:{" "}
                                                            <span className="text-gray-500">
                                                                {" "}
                                                                All{" "}
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <div className="flex flex-col ">
                                                            <span className="ml-2 text-sm  text-secondary">
                                                                States:
                                                            </span>
                                                            {stateSelection?.length >
                                                            0 ? (
                                                                stateSelection?.map(
                                                                    (item) => {
                                                                        return (
                                                                            <span className="ml-2 text-sm  text-gray-500">
                                                                                {
                                                                                    item?.label
                                                                                }
                                                                            </span>
                                                                        );
                                                                    }
                                                                )
                                                            ) : (
                                                                <span className="ml-2 text-sm  text-gray-500">
                                                                    All
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                { type !== "BUILDERS" && type !== "TERRITORY_MANAGER"?
                                                <div className=" col-span-2">
                                                    {defaultFilters ? (
                                                        <span className="ml-2 text-sm  text-secondary">
                                                            TM:{" "}
                                                            <span className="text-gray-500">
                                                                {" "}
                                                                All{" "}
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <div className="flex flex-col ">
                                                            <span className="ml-2 text-sm  text-secondary">
                                                                TM:
                                                            </span>
                                                            {tmSelection?.length >
                                                            0 ? (
                                                                tmSelection?.map(
                                                                    (item) => {
                                                                        return (
                                                                            <span className="ml-2 text-sm  text-gray-500">
                                                                                {
                                                                                    item?.label
                                                                                }
                                                                            </span>
                                                                        );
                                                                    }
                                                                )
                                                            ) : (
                                                                <span className="ml-2 text-sm  text-gray-500">
                                                                    All
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div> : null
}
                                            </div>
                                        </div>
                                        {showFilters ? (
                                            <div className="grid grid-cols-3 gap-5 6xl:gap-0 pb-4 px-4">
                                                { type !== "BUILDERS"?
                                                <div className="flex flex-col">
                                                    <span className=" text-sm  text-secondary">
                                                        Builders
                                                    </span>
                                                    <CommonSelect
                                                        // eslint-disable-next-line
                                                        value={
                                                            programParticipants
                                                        }
                                                        options={organizations?.organizations?.edges
                                                            ?.map(
                                                                (
                                                                    item
                                                                    // eslint-disable-next-line
                                                                ) => {
                                                                    if (
                                                                        item
                                                                            .node
                                                                            .organization_type ===
                                                                        "BUILDERS"
                                                                    ) {
                                                                        return item;
                                                                    }
                                                                }
                                                            )
                                                            .filter(
                                                                (element) =>
                                                                    element !==
                                                                    undefined
                                                            )}
                                                        className=" "
                                                        from="createProgram"
                                                        placeHolder="Builders"
                                                        isMulti
                                                        menuPlacement={"bottom"}
                                                        onChange={(e) => {
                                                            participants(e);
                                                        }}
                                                    />
                                                </div> : null
}
                                                <div className="flex flex-col">
                                                    <span className=" text-sm  text-secondary">
                                                        Programs
                                                    </span>
                                                    <CommonSelect
                                                        // eslint-disable-next-line
                                                        value={programSelection}
                                                        options={
                                                            programs?.programs
                                                                ?.edges
                                                        }
                                                        className=" "
                                                        from="createProgram"
                                                        noOptionsMessage="No Programs Found"
                                                        placeHolder="Programs"
                                                        isMulti
                                                        menuPlacement={"bottom"}
                                                        onChange={(e) => {
                                                            programHandler(e);
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm  text-secondary">
                                                        Products
                                                    </span>
                                                    <CommonSelect
                                                        // eslint-disable-next-line
                                                        value={productSelection}
                                                        options={
                                                            products?.products
                                                                ?.edges
                                                        }
                                                        className=" "
                                                        from="createProgram"
                                                        noOptionsMessage="No Products Found"
                                                        placeHolder="Products"
                                                        isMulti
                                                        menuPlacement={"bottom"}
                                                        onChange={(e) => {
                                                            productHandler(e);
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className=" text-sm  text-secondary">
                                                        States
                                                    </span>
                                                    <CommonSelect
                                                        // eslint-disable-next-line
                                                        value={stateSelection}
                                                        options={
                                                            states?.states
                                                                ?.edges
                                                        }
                                                        className=" "
                                                        from="createProgram"
                                                        noOptionsMessage="No States/Provinces Found"
                                                        placeHolder="States"
                                                        isMulti
                                                        menuPlacement={"bottom"}
                                                        onChange={(e) => {
                                                            stateHandler(e);
                                                        }}
                                                    />
                                                </div>
                                                {type !== "BUILDERS" && type !== "TERRITORY_MANAGER"?
                                                <div className="flex flex-col">
                                                    <span className=" text-sm  text-secondary">
                                                        TM
                                                    </span>
                                                    <CommonSelect
                                                        // eslint-disable-next-line
                                                        value={tmSelection}
                                                        options={handleTerritoryManagersForSelect(
                                                            territoryManagers
                                                                ?.users?.edges
                                                        )}
                                                        className=" "
                                                        from="createProgram"
                                                        noOptionsMessage="No TMs Found"
                                                        placeHolder="Territory Manager"
                                                        isMulti
                                                        menuPlacement={"bottom"}
                                                        onChange={(e) => {
                                                            TMHandler(e);
                                                        }}
                                                    />
                                                </div> : null
}
                                                <div className={`${type === "BUILDERS"? "col-span-3": type === "TERRITORY_MANAGER"?  "col-span-2": "" } flex justify-end items-end ml-5 `}>
                                                    <Button
                                                        title="Apply"
                                                        color="secondary "
                                                        buttonClass="px-2"
                                                        onClick={() =>
                                                            fetchQueries()
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ) : null}

                                    </div>
                                    <div className="bg-white rounded-lg col-span-9 lg:col-span-4">
                                        <div className="">
                                            <div className="    border-gray-200  rounded-lg  flex flex-col">
                                                <SwitchButton
                                                    wFull
                                                    type="select"
                                                    array={array}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="h-full overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400"
                                            style={{
                                                minHeight: "68vh",
                                                maxHeight: "68vh",
                                            }}
                                        >
                                            {enabled === "builders" ? (
                                                builderLoading ? (
                                                    <Loader className="col-span-2" />
                                                ) : (
                                                    analyticsByBuilders?.claimReportByBuilder?.map(
                                                        (item) => {
                                                            return (
                                                                <div className="flex  3xl:grid grid-cols-2 px-4 border-b py-1">
                                                                    <div className="w-full  flex flex-col">
                                                                        <p className="text-darkgray75 font-semibold">
                                                                            {" "}
                                                                            {
                                                                                item?.name
                                                                            }{" "}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex w-full  3xl:grid grid-cols-2">
                                                                        <p className=" text-darkgray75 font-semibold">
                                                                            {" "}
                                                                            Open:
                                                                            {formatterForCurrency.format(
                                                                                item
                                                                                    ?.openClaimsSum
                                                                                    ?.volumeTotal +
                                                                                item
                                                                                    ?.openClaimsSum
                                                                                    ?.factoryTotal
                                                                            )}{" "}
                                                                        </p>
                                                                        {item?.lastCloseClaim ? (
                                                                            <p className="ml-2 3xl:ml-0 text-darkgray75 font-semibold">
                                                                                {" "}
                                                                                Last
                                                                                Claim:
                                                                                {formatterForCurrency.format(item?.lastCloseClaim?.calculateCurrentTotal?.total)}{" "}
                                                                            </p>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                )
                                            ) : null}

                                            {enabled === "programs" ? (
                                                programLoading ? (
                                                    <Loader className="col-span-2" />
                                                ) : (
                                                    analyticsByPrograms?.claimReportByProgram?.map(
                                                        (item) => {
                                                            return (
                                                                <div className="flex 3xl:grid grid-cols-2 px-4 border-b py-1">
                                                                    <div className="w-full  flex flex-col">
                                                                        <p className="text-darkgray75 font-semibold">
                                                                            {" "}
                                                                            {
                                                                                item?.name
                                                                            }{" "}
                                                                        </p>
                                                                        <div className="flex ">
                                                                            <p className="text-sm text-gray-500 capitalize ">
                                                                                {item?.type?.toLowerCase()}
                                                                            </p>
                                                                            <p className="mx-1">
                                                                                -
                                                                            </p>
                                                                            <p className="text-sm text-gray-500 capitalize ">
                                                                                {item?.company?.name?.toLowerCase()}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="w-full flex 3xl:grid grid-cols-2">
                                                                        <p className=" text-darkgray75 font-semibold">
                                                                            {" "}
                                                                            Open:
                                                                            {formatterForCurrency.format(
                                                                                item
                                                                                    ?.openClaimsSum
                                                                                    ?.volumeTotal +
                                                                                item
                                                                                    ?.openClaimsSum
                                                                                    ?.factoryTotal
                                                                            )}{" "}
                                                                        </p>
                                                                        {item?.lastCloseClaim ? (
                                                                            <p className="ml-2 3xl:ml-0 text-darkgray75 font-semibold">
                                                                                {" "}
                                                                                Last
                                                                                Claim:
                                                                                {formatterForCurrency.format(item?.lastCloseClaim?.calculateCurrentTotal?.total)}{" "}
                                                                            </p>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                )
                                            ) : null}

                                            {enabled === "products" ? (
                                                productLoading ? (
                                                    <Loader className="col-span-2" />
                                                ) : (
                                                    analyticsByProducts?.claimReportByProduct?.map(
                                                        (item) => {
                                                            return (
                                                                <div className="flex 3xl:grid grid-cols-2 px-4 border-b py-1">
                                                                    <div className="w-full  flex flex-col">
                                                                        <div className="flex flex-col text-xs text-gray-500 italic">
                                                                            {item?.category &&
                                                                                item
                                                                                    ?.category
                                                                                    ?.name}
                                                                        </div>
                                                                        <div className="group relative   flex justify-between items-center">
                                                                            <div className="text-sm font-semibold text-gray-500">
                                                                                <div className="  focus:outline-none">
                                                                                    <span
                                                                                        className="absolute inset-0"
                                                                                        aria-hidden="true"
                                                                                    ></span>
                                                                                    {item?.bbg_product_code
                                                                                        ? item?.bbg_product_code +
                                                                                          " - "
                                                                                        : ""}
                                                                                    {
                                                                                        item?.name
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className=" flex flex-col text-xs text-gray-500">
                                                                            {item?.programs?.edges?.map(
                                                                                (
                                                                                    item
                                                                                ) => {
                                                                                    return (
                                                                                        <div className="flex flex-col">
                                                                                            <span className="">
                                                                                                {
                                                                                                    item
                                                                                                        .node
                                                                                                        .name
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="w-full flex 3xl:grid grid-cols-2">
                                                                        <p className=" text-darkgray75 font-semibold">
                                                                            {" "}
                                                                            Open:
                                                                            {formatterForCurrency.format(
                                                                                item
                                                                                    ?.openClaimsSum
                                                                                    ?.volumeTotal +
                                                                                item
                                                                                    ?.openClaimsSum
                                                                                    ?.factoryTotal
                                                                            )}{" "}
                                                                        </p>
                                                                        {item?.lastCloseClaim ? (
                                                                            <p className="ml-2 3xl:ml-0 text-darkgray75 font-semibold">
                                                                                {" "}
                                                                                Last
                                                                                Claim:
                                                                                {formatterForCurrency.format(item?.lastCloseClaim?.calculateCurrentTotal?.total)}{" "}
                                                                            </p>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                )
                                            ) : null}

                                            {enabled === "tms" ? (
                                                tmLoading ? (
                                                    <Loader className="col-span-2" />
                                                ) : (
                                                    analyticsByTMs?.claimReportByTM?.map(
                                                        (item) => {
                                                            return (
                                                                <div className="flex 3xl:grid grid-cols-2 px-4 border-b py-1">
                                                                    <div className="w-full  flex flex-col">
                                                                        <p className="text-darkgray75 font-semibold">
                                                                            {" "}
                                                                            {
                                                                                item?.fullName
                                                                            }{" "}
                                                                        </p>
                                                                    </div>
                                                                    <div className="w-full  flex 3xl:grid grid-cols-2">
                                                                        <p className=" text-darkgray75 font-semibold">
                                                                            {" "}
                                                                            Open:
                                                                            {formatterForCurrency.format(
                                                                                item
                                                                                    ?.openClaimsSum
                                                                                    ?.volumeTotal +
                                                                                item
                                                                                    ?.openClaimsSum
                                                                                    ?.factoryTotal
                                                                            )}{" "}
                                                                        </p>
                                                                        {item?.lastCloseClaim ? (
                                                                            <p className="ml-2 3xl:ml-0 text-darkgray75 font-semibold">
                                                                                {" "}
                                                                                Last
                                                                                Claim:
                                                                                {formatterForCurrency.format(item?.lastCloseClaim?.calculateCurrentTotal?.total)}{" "}
                                                                            </p>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                )
                                            ) : null}
                                        </div>
                                    </div>
                                    <div
                                        className="bg-white rounded-lg col-span-9 lg:col-span-6"
                                        style={{
                                            minHeight: "74.25vh",
                                            maxHeight: "74.25vh",
                                        }}
                                    >
                                        <div className="h-full relative">
                                            <div className=" inset-0    border-gray-200  rounded-lg h-full flex flex-col py-5">
                                                {chartLoading ? (
                                                    <Loader />
                                                ) : (
                                                    makeGraphs()
                                                )}
                                                <div className="flex items-center justify-center">
                                                    <p className="text-secondary font-title text-xl mt-5">
                                                        {" "}
                                                        All :
                                                        {formatterForCurrency.format(!analyticsData
                                                            ?.claimChartReport
                                                            ?.allCloseClaimsTotal
                                                            ?.total
                                                            ? "0"
                                                            : analyticsData?.claimChartReport?.allCloseClaimsTotal?.total)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Reporting;
