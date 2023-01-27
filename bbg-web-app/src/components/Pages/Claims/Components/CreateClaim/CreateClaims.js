import React, { useState, useEffect } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import Button from "../../../../Buttons";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import Loader from "../../../../Loader/Loader";
import StartClaim from "./StartClaim";
import DateRangeSelector from "./DateRangeSelector";
import {
    CREATE_CLAIM,
    FETCH_CLAIMS,
    FETCH_VOLUME_CLAIM,
    UPDATE_CLAIM,
} from "../../../../../lib/claims";
import { useLazyQuery, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import ClaimProductSelect from "./ClaimProductSelect";
import { getFormattedDate, formatterForCurrency } from "../../../../../util/generic";


const CreateClaims = ({
    edit,
    user,
    fillColumns,
    callBack,
    createNew,
    openAbout,
    resetState,
    refetch,
    loading,
    productsDropDown,
    searched,
    noSearchVolumeClaims,
    history,
}) => {
    /* React State Starts */
    const [fields, setFields] = useState(user);
    const [active, setActive] = useState("about");
    const [show, setShow] = useState(false);
    const [claimDateEdited, setClaimDateEdited] = useState(false)
    const [volumeClaimTotalRebateEdited, setVolumeClaimTotalRebateEdited] = useState(false)
    const [startEndDate, setStartEndDate] = useState({});
    const [selectedProductId, setSelectedProductId] = useState();
    const [showClaimFields, setShowClaimFields] = useState();
    const [volumeClaimMode, setVolumeClaimMode] = useState();
    const [newVolumeClaim, setNewVolumeClaim] = useState();
    const [productCustomizeType, setProductCustomizeType] = useState();
    const [mostRecentVolumeClaim, setMostRecentVolumeClaim] = useState();
    const [reportTotal, setReportTotal] = useState();
    const [builderAccordionData, setBuilderAccordionData] = useState();
    const [builderExpandData, setBuilderExpandData] = useState();
    const [claimResult, setClaimResult] = useState();

    const toDate = (date) => {
        if (date) {
            const date1 = new Date(date);
            let a = date1.getTimezoneOffset() * 60000;
            let b = new Date(date1.getTime() + a);
            return b;
        }
    };
    /* Handle Changes Ends */

    useEffect(() => {
        //This Use-Effect fills the Data
        if (edit === true) {
            if (
                user?.claim_type === "FACTORY" &&
                user?.program?.type === "FACTORY"
            ) {
                setFields({
                    ...user,
                    reportingPeriod: {
                        label: user?.report_period,
                        value: {
                            report_year: user?.report_year,
                            report_quarter: user?.report_quarter,
                        },
                    },
                });
                setSelectedProductId("");
                setMostRecentVolumeClaim();
            }
            setShowClaimFields(false);
        }
        if (
            edit &&
            user?.id &&
            (user?.claim_type === "FACTORY" ||
                user?.program?.type === "FACTORY")
        ) {
            let object = {};
            object.to = new Date(user?.claim_end_date);
            object.from = new Date(user?.claim_start_date);
            setStartEndDate(object);
        }

        setBuilderAccordionData(
            user?.calculateCurrentTotal?.builderTotals
        );

        //eslint-disable-next-line
    }, [user, edit]);

    const handleChange = (e) => {
        setVolumeClaimTotalRebateEdited(true)
        const { name, value } = e.target;
        setFields({
            ...fields,
            [name]: value,
        });
    };

    useEffect(() => {
        //Cleans up the fields and state on new program click
        if (edit === false && createNew === true) {
            let object = {};
            let factoryPrevDate = user?.program?.claims
                ? new Date(
                    user?.program?.claims?.edges
                        ?.map((item) =>
                            item?.node?.status === "CLOSE" ||
                                item?.node?.status === "READYTOCLOSE"
                                ? item
                                : null
                        )
                        .filter(
                            (item) => item !== null
                        )?.[0]?.node?.claim_end_date
                )
                : new Date(
                    user?.claims?.edges
                        ?.map((item) =>
                            item?.node?.status === "CLOSE" ||
                                item?.node?.status === "READYTOCLOSE"
                                ? item
                                : null
                        )
                        .filter(
                            (item) => item !== null
                        )?.[0]?.node?.claim_end_date
                );
            if (factoryPrevDate instanceof Date && !isNaN(factoryPrevDate)) {
                object.to = factoryPrevDate;
                object.from = factoryPrevDate;
            } else {
                object.to = new Date();
                object.from = new Date();
            }
            setStartEndDate(object);
            setFields({});
        }
        //eslint-disable-next-line
    }, [edit, createNew]);

    useEffect(() => {
        //fills the data inside the column
        if (openAbout === true && show === false) {
            setActive("about");
            setShow(true);
        }
        // eslint-disable-next-line
    }, [fillColumns, openAbout]);

    const activeHandler = (item) => {
        if (item !== active) {
            setActive(item);
            setShow(true);
        } else {
            resetState();
            setShow(!show);
        }
    };

    useEffect(() => {
        if (user?.program?.type) {
            setActive("about");
        }
    }, [user?.program?.type]);

    const [createClaim, { loading: createClaimLoading }] = useMutation(CREATE_CLAIM, {
        variables: {
            claim_type: user?.program?.type ? user?.program?.type : user?.type,
            claim_start_date:
                startEndDate &&
                startEndDate.from &&
                startEndDate?.from?.toISOString(),
            total_payment_rebate: parseFloat(fields?.total_payment_rebate),
            status: "OPEN",
            report_year: fields?.reportingPeriod?.value?.report_year,
            report_quarter: fields?.reportingPeriod?.value?.report_quarter,
            claim_end_date:
                startEndDate &&
                startEndDate.to &&
                startEndDate?.to?.toISOString(),
            programId: user?.program?.id ? user?.program?.id : user?.id,
            claimTemplateRelationInput:
                user?.program?.type === "VOLUME" || user?.type === "VOLUME"
                    ? {
                        connect: {
                            claim_template_product_type: productCustomizeType,
                            id: selectedProductId?.value?.id,
                        },
                    }
                    : {},
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: FETCH_CLAIMS,
            });

            delete Object.assign(result.data, {
                node: result.data["createClaim"],
            })["createClaim"];

            cache.writeQuery({
                query: FETCH_CLAIMS,
                data: {
                    recentClaimPerProgram: {
                        edges: [
                            result.data,
                            ...data.recentClaimPerProgram.edges,
                        ],
                    },
                },
            });
            callBack(result?.data?.node);
            setNewVolumeClaim(true);
            toast.success("Claim Created.");
        },
    });

    const [editClaim, { loading: updateClaimLoading }] = useMutation(UPDATE_CLAIM, {
        variables: {
            id: user?.id,
            claim_type: user?.program?.type ? user?.program?.type : user?.type,
            claim_start_date: startEndDate?.from?.toISOString(),
            total_payment_rebate: parseFloat(fields?.total_payment_rebate),
            status: "OPEN",
            report_year: fields?.reportingPeriod?.value?.report_year,
            report_quarter: fields?.reportingPeriod?.value?.report_quarter,
            claim_end_date: startEndDate?.to?.toISOString(),
            programId: user?.program?.id ? user?.program?.id : user?.id,
            claimTemplateRelationInput:
                user?.program?.type === "VOLUME" || user?.type === "VOLUME"
                    ? selectedProductId?.value?.id === "all"
                        ? {}
                        : {
                            connect: {
                                claim_template_product_type: productCustomizeType,
                                id: selectedProductId?.value?.id,
                            },
                        }
                    : {},
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: FETCH_CLAIMS,
            });

            delete Object.assign(result.data, {
                node: result.data["updateClaim"],
            })["updateClaim"];

            cache.writeQuery({
                query: FETCH_CLAIMS,
                data: {
                    recentClaimPerProgram: {
                        edges: [
                            result.data,
                            ...data.recentClaimPerProgram.edges.filter(
                                (u) => u.node.id !== result.data.node.id
                            ),
                        ],
                    },
                },
            });
            callBack(result?.data?.node);
            toast.success("Claim Updated.");
            getVolumeClaim();
            setNewVolumeClaim(true);
        },
    });

    const handleClaimMutation = () => {
        setClaimDateEdited(false)
        setVolumeClaimTotalRebateEdited(false)

        if (edit === true || volumeClaimMode === "edit") {
            editClaim();
        } else {
            createClaim();
        }
    };

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

    const handleProductSelection = (e) => {
        setSelectedProductId(e);
        setProductCustomizeType(e?.value?.customization);
    };

    useEffect(() => {
        setSelectedProductId({
            label: "All Products",
            value: {
                id: "all",
            },
        });
    }, []);

    useEffect(() => {
        if (
            selectedProductId?.value?.id &&
            (user?.claim_type !== "FACTORY" ||
                user?.program?.type !== "FACTORY")
        ) {
            getVolumeClaim();
        }
        // eslint-disable-next-line
    }, [selectedProductId]);

    const [getVolumeClaim, { loading: loadingVolumeClaim }] = useLazyQuery(FETCH_VOLUME_CLAIM, {
        notifyOnNetworkStatusChange: false,
        variables: {
            product_id: selectedProductId?.value?.id,
            program_id: !noSearchVolumeClaims ? user?.id : user?.program?.id,
            excludeActionRequired: true,
        },
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            if (
                data?.volumeClaims &&
                data?.volumeClaims?.currentClaim &&
                (data?.volumeClaims?.currentClaim?.status === "OPEN" ||
                    data?.volumeClaims?.currentClaim?.status === "READY")
            ) {
                setFields({
                    ...data?.volumeClaims?.currentClaim,
                    reportingPeriod: {
                        label: data?.volumeClaims?.currentClaim?.report_period,
                        value: {
                            report_year:
                                data?.volumeClaims?.currentClaim?.report_year,
                            report_quarter:
                                data?.volumeClaims?.currentClaim
                                    ?.report_quarter,
                        },
                    },
                });
                let object = {};
                object.to = new Date(
                    data?.volumeClaims?.currentClaim?.claim_end_date
                );
                object.from = new Date(
                    data?.volumeClaims?.currentClaim?.claim_start_date
                );
                setStartEndDate(object);
                setVolumeClaimMode("edit");
                setShowClaimFields(true);

                if (data?.volumeClaims?.lastClosedClaim) {
                    setMostRecentVolumeClaim(
                        data?.volumeClaims?.lastClosedClaim
                    );
                } else {
                    setMostRecentVolumeClaim();
                }
            } else if (
                data?.volumeClaims?.currentClaim?.status === "READYTOCLOSE" ||
                data?.volumeClaims?.currentClaim?.status === "CLOSE"
            ) {
                setVolumeClaimMode("create");
                setShowClaimFields(true);
                setFields({
                    total_payment_rebate: "",
                    reportingPeriod: {
                        label: "",
                        value: "",
                    },
                });
                let object = {};
                object.to = new Date();
                object.from = new Date();
                setStartEndDate(object);

                if (data?.volumeClaims?.lastClosedClaim) {
                    setMostRecentVolumeClaim(
                        data?.volumeClaims?.lastClosedClaim
                    );
                } else {
                    setMostRecentVolumeClaim();
                }
            } else if (!data?.volumeClaims?.currentClaim) {
                setVolumeClaimMode("create");
                setShowClaimFields(true);
                setFields({
                    total_payment_rebate: "",
                    reportingPeriod: {
                        label: "",
                        value: "",
                    },
                });
                let object = {};
                object.to = new Date();
                object.from = new Date();
                setStartEndDate(object);

                if (data?.volumeClaims?.lastClosedClaim) {
                    setMostRecentVolumeClaim(
                        data?.volumeClaims?.lastClosedClaim
                    );
                } else {
                    setMostRecentVolumeClaim();
                }
            }
        },
    });

    const recall = () => {
        getVolumeClaim();
    };

    let productArrayforVolumProgram = () => {
        let array;
        if (user && user.allClaimTemplateProducts) {
            array = user?.allClaimTemplateProducts?.edges?.map((item) => {
                let outObject = {};
                let object = {};
                object.id = {
                    id: item?.node?.id,
                    customization: item?.node?.customization?.id
                        ? "OrganizationCustomProduct"
                        : "ProgramProductsPivot",
                };

                object.name = item?.node?.name;
                outObject.node = object;
                return outObject;
            });
        } else {
            array = user?.program?.allClaimTemplateProducts?.edges?.map(
                (item) => {
                    let outObject = {};
                    let object = {};
                    object.id = {
                        id: item?.node?.id,
                        customization: item?.node?.customization?.id
                            ? "OrganizationCustomProduct"
                            : "ProgramProductsPivot",
                    };
                    object.name = item?.node?.name;
                    outObject.node = object;
                    return outObject;
                }
            );
        }

        let anotherArray = [
            {
                node: {
                    id: {
                        id: "all",
                    },
                    name: "All Products",
                },
            },
        ];

        let finalArray = array.concat(anotherArray);
        return finalArray;
    };

    /* 4 Accordian Steps Starts */
    const accordians = () => {
        let factoryPrevDate = user?.program?.claims
            ? new Date(
                user?.program?.claims?.edges
                    ?.map((item) =>
                        item?.node?.status === "CLOSE" ||
                            item?.node?.status === "READYTOCLOSE"
                            ? item
                            : null
                    )
                    .filter(
                        (item) => item !== null
                    )?.[0]?.node?.claim_end_date
            )
            : new Date(
                user?.claims?.edges
                    ?.map((item) =>
                        item?.node?.status === "CLOSE" ||
                            item?.node?.status === "READYTOCLOSE"
                            ? item
                            : null
                    )
                    .filter(
                        (item) => item !== null
                    )?.[0]?.node?.claim_end_date
            );

        return fillColumns ? (
            <div className="flex flex-col">
                {loading || loadingVolumeClaim ? (
                    <div className="col-span-6 flex items-center justify-center">
                        <Loader />
                    </div>
                ) : (
                    <Disclosure as="div">
                        <Disclosure.Button
                            className={`bg-white w-full  focus:outline-none ${active === "about" && show
                                ? "rounded-lg rounded-b-none"
                                : "rounded-lg"
                                }`}
                        >
                            <div
                                style={{ maxHeight: "68px" }}
                                className={`flex flex-col md:flex-row py-4 px-4 justify-between items-center ${active === "about" && show
                                    ? "border-b-2 border-gray-400"
                                    : ""
                                    }`}
                                onClick={() => activeHandler("about")}
                            >
                                <div className=" font-title  text-center h2">
                                    {!searched
                                        ? user?.claim_type === "VOLUME" || user?.type === "VOLUME"
                                            ? user?.program?.name || user?.name
                                            : edit
                                                ? user?.program?.name
                                                : volumeClaimMode
                                                    ? volumeClaimMode === "create"
                                                        ? "Create Claim: " + user?.name
                                                        : user?.program?.name
                                                    : user?.type === "VOLUME"
                                                        ? "Find Claim: " + user?.name
                                                        : "Create Claim: " + user?.name
                                        : user?.claim_type === "FACTORY"
                                            ? edit
                                                ? user?.program?.name
                                                : "Create Claim: " + user?.name
                                            : user?.program?.name || user?.name}
                                    <span className="py-1 whitespace-nowrap text-sm font-medium text-gray-500">
                                        {!searched
                                            ? user?.claim_type === "VOLUME"
                                                ? " - " + user?.program?.type
                                                : edit
                                                    ? " - " + user?.program?.type
                                                    : volumeClaimMode
                                                        ? volumeClaimMode === "create"
                                                            ? null
                                                            : " - " +
                                                            (user?.program?.type ||
                                                                user?.type)
                                                        : user?.type === "VOLUME"
                                                            ? null
                                                            : null
                                            : user?.claim_type === "FACTORY"
                                                ? edit
                                                    ? " - " + user?.program?.type
                                                    : null
                                                : " - " + (user?.type || user?.program?.type)}
                                    </span>
                                    <span className="px-1 py-1 whitespace-nowrap text-sm font-medium text-gray-500">
                                        {!searched
                                            ? user?.claim_type === "VOLUME" || user?.type === "VOLUME"
                                                ? "- " +
                                                (formatterForCurrency.format(
                                                    fields?.total_payment_rebate
                                                ) || formatterForCurrency.format(
                                                    user?.claims?.edges?.[0]?.node
                                                        ?.total_payment_rebate
                                                ) ||
                                                    fields?.total_payment_rebate ||
                                                    "0")
                                                : null
                                            : user?.type === "VOLUME" &&
                                                user?.claims?.edges?.length > 0
                                                ? "- " +
                                                formatterForCurrency.format(
                                                    user?.claims?.edges?.[0]?.node
                                                        ?.total_payment_rebate
                                                )
                                                : " - " + formatterForCurrency.format(
                                                    user?.total_payment_rebate
                                                )}
                                    </span>
                                </div>

                                {active === "about" && show ? (
                                    <ChevronUpIcon className="h-10 w-10 text-secondary" />
                                ) : (
                                    <ChevronDownIcon className="h-10 w-10 text-secondary" />
                                )}
                            </div>
                        </Disclosure.Button>
                        <Transition
                            show={active === "about" && show}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-150 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Disclosure.Panel static>
                                <div className="grid bg-white  rounded-lg rounded-t-none grid-cols-6 overflow-hidden ">
                                    {loading ? (
                                        <div className="col-span-6 flex items-center justify-center">
                                            <Loader />
                                        </div>
                                    ) : (
                                        <div className="col-span-6 inset-0 flex flex-col">
                                            <div className="flex overflow-auto w-full h-full">
                                                <div className="w-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 overflow-auto">
                                                    <div className="flex flex-col border-b overflow-x-hidden overflow-y-auto">
                                                        {(user?.program?.claims
                                                            ?.edges?.length >
                                                            1 &&
                                                            user?.program
                                                                ?.type ===
                                                            "FACTORY") ||
                                                            (user?.claims?.edges
                                                                ?.length >= 1 &&
                                                                user?.type ===
                                                                "FACTORY") ? (
                                                            <>
                                                                <p className="text-md py-2 sm:py-2 pl-4 font-bold font-title text-secondary">
                                                                    Most Recent
                                                                    Claim
                                                                </p>
                                                                <div className="py-2 overflow-x-auto  scrollbar-thin border-b scrollbar-thumb-lightPrimary scrollbar-track-gray-400 sm:-mx-6 lg:-mx-8">
                                                                    <div className="align-middle inline-block min-w-full sm:px-6 lg:px-9">
                                                                        <div className="py-2 sm:py-0 sm:rounded-lg">
                                                                            <table className="min-w-full mb-2 ">
                                                                                <thead className="">
                                                                                    <tr>
                                                                                        <th
                                                                                            scope="col"
                                                                                            className="px-3 text-md font-medium text-secondary text-left"
                                                                                        >
                                                                                            Status
                                                                                        </th>
                                                                                        <th
                                                                                            scope="col"
                                                                                            className="px-3 text-md font-medium text-secondary text-left "
                                                                                        >
                                                                                            Reporting
                                                                                            Period
                                                                                        </th>
                                                                                        <th
                                                                                            scope="col"
                                                                                            className="px-3 text-md font-medium text-secondary text-left  "
                                                                                        >
                                                                                            Claim
                                                                                            Period
                                                                                        </th>
                                                                                        <th
                                                                                            scope="col"
                                                                                            className="px-3 text-md font-medium text-secondary text-left  "
                                                                                        >
                                                                                            Last
                                                                                            Modified
                                                                                        </th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    <tr className="bg-white">
                                                                                        <td className="px-3 py-1 whitespace-nowrap text-sm font-medium text-gray-500">
                                                                                            {user
                                                                                                ?.program
                                                                                                ?.claims
                                                                                                ? user?.program?.claims?.edges
                                                                                                    ?.map(
                                                                                                        (
                                                                                                            item
                                                                                                        ) =>
                                                                                                            item
                                                                                                                ?.node
                                                                                                                ?.status ===
                                                                                                                "CLOSE" ||
                                                                                                                item
                                                                                                                    ?.node
                                                                                                                    ?.status ===
                                                                                                                "READYTOCLOSE"
                                                                                                                ? item
                                                                                                                : null
                                                                                                    )
                                                                                                    .filter(
                                                                                                        (
                                                                                                            item
                                                                                                        ) =>
                                                                                                            item !==
                                                                                                            null
                                                                                                    )?.[0]
                                                                                                    ?.node
                                                                                                    ?.status
                                                                                                    ? "CLOSE"
                                                                                                    : ""
                                                                                                : user?.claims?.edges
                                                                                                    ?.map(
                                                                                                        (
                                                                                                            item
                                                                                                        ) =>
                                                                                                            item
                                                                                                                ?.node
                                                                                                                ?.status ===
                                                                                                                "CLOSE" ||
                                                                                                                item
                                                                                                                    ?.node
                                                                                                                    ?.status ===
                                                                                                                "READYTOCLOSE"
                                                                                                                ? item
                                                                                                                : null
                                                                                                    )
                                                                                                    .filter(
                                                                                                        (
                                                                                                            item
                                                                                                        ) =>
                                                                                                            item !==
                                                                                                            null
                                                                                                    )?.[0]
                                                                                                    ?.node
                                                                                                    ?.status
                                                                                                    ? "CLOSE"
                                                                                                    : ""}
                                                                                        </td>
                                                                                        <td className="px-3 py-1 whitespace-nowrap text-sm text-gray-500">
                                                                                            {user
                                                                                                ?.program
                                                                                                ?.claims
                                                                                                ? user?.program?.claims?.edges
                                                                                                    ?.map(
                                                                                                        (
                                                                                                            item
                                                                                                        ) =>
                                                                                                            item
                                                                                                                ?.node
                                                                                                                ?.status ===
                                                                                                                "CLOSE" ||
                                                                                                                item
                                                                                                                    ?.node
                                                                                                                    ?.status ===
                                                                                                                "READYTOCLOSE"
                                                                                                                ? item
                                                                                                                : null
                                                                                                    )
                                                                                                    .filter(
                                                                                                        (
                                                                                                            item
                                                                                                        ) =>
                                                                                                            item !==
                                                                                                            null
                                                                                                    )?.[0]
                                                                                                    ?.node
                                                                                                    ?.report_period
                                                                                                : user?.claims?.edges
                                                                                                    ?.map(
                                                                                                        (
                                                                                                            item
                                                                                                        ) =>
                                                                                                            item
                                                                                                                ?.node
                                                                                                                ?.status ===
                                                                                                                "CLOSE" ||
                                                                                                                item
                                                                                                                    ?.node
                                                                                                                    ?.status ===
                                                                                                                "READYTOCLOSE"
                                                                                                                ? item
                                                                                                                : null
                                                                                                    )
                                                                                                    .filter(
                                                                                                        (
                                                                                                            item
                                                                                                        ) =>
                                                                                                            item !==
                                                                                                            null
                                                                                                    )?.[0]
                                                                                                    ?.node
                                                                                                    ?.report_period}
                                                                                        </td>
                                                                                        <td className="px-3 py-1 whitespace-nowrap text-sm text-gray-500">
                                                                                            {user
                                                                                                ?.program
                                                                                                ?.claims
                                                                                                ? getMonthYear(
                                                                                                    new Date(
                                                                                                        user?.program?.claims?.edges
                                                                                                            ?.map(
                                                                                                                (
                                                                                                                    item
                                                                                                                ) =>
                                                                                                                    item
                                                                                                                        ?.node
                                                                                                                        ?.status ===
                                                                                                                        "CLOSE" ||
                                                                                                                        item
                                                                                                                            ?.node
                                                                                                                            ?.status ===
                                                                                                                        "READYTOCLOSE"
                                                                                                                        ? item
                                                                                                                        : null
                                                                                                            )
                                                                                                            .filter(
                                                                                                                (
                                                                                                                    item
                                                                                                                ) =>
                                                                                                                    item !==
                                                                                                                    null
                                                                                                            )?.[0]?.node?.claim_start_date
                                                                                                    )
                                                                                                )
                                                                                                : getMonthYear(
                                                                                                    new Date(
                                                                                                        user?.claims?.edges
                                                                                                            ?.map(
                                                                                                                (
                                                                                                                    item
                                                                                                                ) =>
                                                                                                                    item
                                                                                                                        ?.node
                                                                                                                        ?.status ===
                                                                                                                        "CLOSE" ||
                                                                                                                        item
                                                                                                                            ?.node
                                                                                                                            ?.status ===
                                                                                                                        "READYTOCLOSE"
                                                                                                                        ? item
                                                                                                                        : null
                                                                                                            )
                                                                                                            .filter(
                                                                                                                (
                                                                                                                    item
                                                                                                                ) =>
                                                                                                                    item !==
                                                                                                                    null
                                                                                                            )?.[0]?.node?.claim_start_date
                                                                                                    )
                                                                                                )}

                                                                                            ,{" "}
                                                                                            {user
                                                                                                ?.program
                                                                                                ?.claims
                                                                                                ? getMonthYear(
                                                                                                    new Date(
                                                                                                        user?.program?.claims?.edges
                                                                                                            ?.map(
                                                                                                                (
                                                                                                                    item
                                                                                                                ) =>
                                                                                                                    item
                                                                                                                        ?.node
                                                                                                                        ?.status ===
                                                                                                                        "CLOSE" ||
                                                                                                                        item
                                                                                                                            ?.node
                                                                                                                            ?.status ===
                                                                                                                        "READYTOCLOSE"
                                                                                                                        ? item
                                                                                                                        : null
                                                                                                            )
                                                                                                            .filter(
                                                                                                                (
                                                                                                                    item
                                                                                                                ) =>
                                                                                                                    item !==
                                                                                                                    null
                                                                                                            )?.[0]?.node?.claim_end_date
                                                                                                    )
                                                                                                )
                                                                                                : getMonthYear(
                                                                                                    new Date(
                                                                                                        user?.claims?.edges
                                                                                                            ?.map(
                                                                                                                (
                                                                                                                    item
                                                                                                                ) =>
                                                                                                                    item
                                                                                                                        ?.node
                                                                                                                        ?.status ===
                                                                                                                        "CLOSE" ||
                                                                                                                        item
                                                                                                                            ?.node
                                                                                                                            ?.status ===
                                                                                                                        "READYTOCLOSE"
                                                                                                                        ? item
                                                                                                                        : null
                                                                                                            )
                                                                                                            .filter(
                                                                                                                (
                                                                                                                    item
                                                                                                                ) =>
                                                                                                                    item !==
                                                                                                                    null
                                                                                                            )?.[0]?.node?.claim_end_date
                                                                                                    )
                                                                                                )}
                                                                                        </td>
                                                                                        <td className="px-3 py-1 whitespace-nowrap text-sm text-gray-500">
                                                                                            {user
                                                                                                ?.program
                                                                                                ?.claims
                                                                                                ? getFormattedDate(
                                                                                                    toDate(
                                                                                                        user?.program?.claims?.edges
                                                                                                            ?.map(
                                                                                                                (
                                                                                                                    item
                                                                                                                ) =>
                                                                                                                    item
                                                                                                                        ?.node
                                                                                                                        ?.status ===
                                                                                                                        "CLOSE" ||
                                                                                                                        item
                                                                                                                            ?.node
                                                                                                                            ?.status ===
                                                                                                                        "READYTOCLOSE"
                                                                                                                        ? item
                                                                                                                        : null
                                                                                                            )
                                                                                                            .filter(
                                                                                                                (
                                                                                                                    item
                                                                                                                ) =>
                                                                                                                    item !==
                                                                                                                    null
                                                                                                            )?.[0]
                                                                                                            ?.node
                                                                                                            ?.updated_at
                                                                                                    )
                                                                                                )
                                                                                                : getFormattedDate(
                                                                                                    toDate(
                                                                                                        user?.claims?.edges
                                                                                                            ?.map(
                                                                                                                (
                                                                                                                    item
                                                                                                                ) =>
                                                                                                                    item
                                                                                                                        ?.node
                                                                                                                        ?.status ===
                                                                                                                        "CLOSE" ||
                                                                                                                        item
                                                                                                                            ?.node
                                                                                                                            ?.status ===
                                                                                                                        "READYTOCLOSE"
                                                                                                                        ? item
                                                                                                                        : null
                                                                                                            )
                                                                                                            .filter(
                                                                                                                (
                                                                                                                    item
                                                                                                                ) =>
                                                                                                                    item !==
                                                                                                                    null
                                                                                                            )?.[0]
                                                                                                            ?.node
                                                                                                            ?.updated_at
                                                                                                    )
                                                                                                )}
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : mostRecentVolumeClaim ? (
                                                            <>
                                                                <p className="text-md py-2 sm:py-2 pl-4 font-bold font-title text-secondary">
                                                                    Most Recent
                                                                    Claim
                                                                </p>
                                                                <div className="py-2 overflow-x-auto  scrollbar-thin border-b scrollbar-thumb-lightPrimary scrollbar-track-gray-400 sm:-mx-6 lg:-mx-8">
                                                                    <div className="align-middle inline-block min-w-full sm:px-6 lg:px-9">
                                                                        <div className="py-2 sm:py-0 sm:rounded-lg">
                                                                            <table className="min-w-full mb-2 ">
                                                                                <thead className="">
                                                                                    <tr>
                                                                                        <th
                                                                                            scope="col"
                                                                                            className="px-3 text-md font-medium text-secondary text-left"
                                                                                        >
                                                                                            Status
                                                                                        </th>
                                                                                        <th
                                                                                            scope="col"
                                                                                            className="px-3 text-md font-medium text-secondary text-left "
                                                                                        >
                                                                                            Reporting
                                                                                            Period
                                                                                        </th>
                                                                                        <th
                                                                                            scope="col"
                                                                                            className="px-3 text-md font-medium text-secondary text-left  "
                                                                                        >
                                                                                            Claim
                                                                                            Period
                                                                                        </th>
                                                                                        <th
                                                                                            scope="col"
                                                                                            className="px-3 text-md font-medium text-secondary text-left  "
                                                                                        >
                                                                                            Last
                                                                                            Modified
                                                                                        </th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    <tr className="bg-white">
                                                                                        <td className="px-3 py-1 whitespace-nowrap text-sm font-medium text-gray-500 capitalize">
                                                                                            {mostRecentVolumeClaim?.status ===
                                                                                                "READYTOCLOSE" ||
                                                                                                mostRecentVolumeClaim?.status ===
                                                                                                "CLOSE"
                                                                                                ? "Close"
                                                                                                : mostRecentVolumeClaim?.status}
                                                                                        </td>
                                                                                        <td className="px-3 py-1 whitespace-nowrap text-sm text-gray-500">
                                                                                            {
                                                                                                mostRecentVolumeClaim?.report_period
                                                                                            }
                                                                                        </td>
                                                                                        <td className="px-3 py-1 whitespace-nowrap text-sm text-gray-500">
                                                                                            {getMonthYear(
                                                                                                new Date(
                                                                                                    mostRecentVolumeClaim?.claim_start_date
                                                                                                )
                                                                                            )}

                                                                                            ,{" "}
                                                                                            {getMonthYear(
                                                                                                new Date(
                                                                                                    mostRecentVolumeClaim?.claim_end_date
                                                                                                )
                                                                                            )}
                                                                                        </td>
                                                                                        <td className="px-3 py-1 whitespace-nowrap text-sm text-gray-500">
                                                                                            {getFormattedDate(
                                                                                                toDate(
                                                                                                    mostRecentVolumeClaim?.updated_at
                                                                                                )
                                                                                            )}
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : null}
                                                        <div className="space-y-8 divide-y divide-gray-200  sm:space-y-5">
                                                            <div className="h-full">
                                                                {user?.claim_type ===
                                                                    "VOLUME" ||
                                                                    user?.program
                                                                        ?.type ===
                                                                    "VOLUME" ? (
                                                                    <div>
                                                                        <p className="text-md text-secondary font-bold font-title pl-4 mt-2 sm:mt-2">
                                                                            {volumeClaimMode
                                                                                ? volumeClaimMode ===
                                                                                    "create"
                                                                                    ? "Create Claim"
                                                                                    : "Edit Claim"
                                                                                : "Find or Add Claim"}
                                                                        </p>
                                                                    </div>
                                                                ) : null}

                                                                {productsDropDown ? (
                                                                    <div className="px-4">
                                                                        <ClaimProductSelect
                                                                            optionsToRemove={
                                                                                user?.id
                                                                            }
                                                                            value={
                                                                                selectedProductId
                                                                            }
                                                                            options={
                                                                                newVolumeClaim &&
                                                                                    user &&
                                                                                    user?.program
                                                                                    ? {
                                                                                        edges: [
                                                                                            ...user?.program?.allClaimTemplateProducts?.edges?.map(
                                                                                                (
                                                                                                    item
                                                                                                ) => {
                                                                                                    let outObject = {};
                                                                                                    let object = {};
                                                                                                    object.id = {
                                                                                                        id:
                                                                                                            item
                                                                                                                ?.node
                                                                                                                ?.id,
                                                                                                        customization: item
                                                                                                            ?.node
                                                                                                            ?.customization
                                                                                                            ?.id
                                                                                                            ? "OrganizationCustomProduct"
                                                                                                            : "ProgramProductsPivot",
                                                                                                    };
                                                                                                    object.name =
                                                                                                        item?.node?.name;
                                                                                                    outObject.node = object;
                                                                                                    return outObject;
                                                                                                }
                                                                                            ),
                                                                                            ...[
                                                                                                {
                                                                                                    node: {
                                                                                                        id: {
                                                                                                            id:
                                                                                                                "all",
                                                                                                        },
                                                                                                        name:
                                                                                                            "All Products",
                                                                                                    },
                                                                                                },
                                                                                            ],
                                                                                        ],
                                                                                    }
                                                                                    : {
                                                                                        edges: productArrayforVolumProgram(),
                                                                                    }
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleProductSelection(
                                                                                    e
                                                                                )
                                                                            }
                                                                            className="col-span-1 lg:w-60 py-1 pb-2"
                                                                            placeHolder="Select Products"
                                                                        />
                                                                    </div>
                                                                ) : null}

                                                                {showClaimFields ||
                                                                    user?.type ===
                                                                    "FACTORY" ||
                                                                    user?.program
                                                                        ?.type ===
                                                                    "FACTORY" ? (
                                                                    <div className="py-3  space-y-6 sm:space-y-5 ">
                                                                        <div
                                                                            className={`px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200`}
                                                                        >
                                                                            <label
                                                                                htmlFor="about"
                                                                                className="text-md font-medium text-secondary pt-2"
                                                                            >
                                                                                Claim
                                                                                Period
                                                                            </label>
                                                                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                                                                                <DateRangeSelector
                                                                                    value={
                                                                                        startEndDate
                                                                                            ? startEndDate
                                                                                            : factoryPrevDate
                                                                                                ? {
                                                                                                    to: factoryPrevDate,
                                                                                                    from: factoryPrevDate,
                                                                                                }
                                                                                                : {}
                                                                                    }
                                                                                    disableDays={
                                                                                        (user
                                                                                            ?.program
                                                                                            ?.claims
                                                                                            ?.edges
                                                                                            ?.length >=
                                                                                            1 &&
                                                                                            user
                                                                                                ?.program
                                                                                                ?.type ===
                                                                                            "FACTORY") ||
                                                                                            (user
                                                                                                ?.claims
                                                                                                ?.edges
                                                                                                ?.length >=
                                                                                                1 &&
                                                                                                user?.type ===
                                                                                                "FACTORY")
                                                                                            ? factoryPrevDate
                                                                                            : new Date(
                                                                                                mostRecentVolumeClaim?.claim_end_date
                                                                                            )
                                                                                    }
                                                                                    setTo={(
                                                                                        date
                                                                                    ) => {
                                                                                        setStartEndDate(
                                                                                            {
                                                                                                ...startEndDate,
                                                                                                to: date,
                                                                                            }
                                                                                        )
                                                                                        setClaimDateEdited(true)
                                                                                    }
                                                                                    }
                                                                                    setFrom={(
                                                                                        date
                                                                                    ) => {
                                                                                        setStartEndDate(
                                                                                            {
                                                                                                ...startEndDate,
                                                                                                from: date,
                                                                                            }
                                                                                        )
                                                                                        setClaimDateEdited(true)
                                                                                    }
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {(user?.claim_type ===
                                                                            "VOLUME" ||
                                                                            user
                                                                                ?.program
                                                                                ?.type ===
                                                                            "VOLUME" ||
                                                                            user?.type ===
                                                                            "VOLUME") &&
                                                                            showClaimFields ? (
                                                                            <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 py-3">
                                                                                <label
                                                                                    htmlFor="about"
                                                                                    className="text-md font-medium text-secondary pt-2"
                                                                                >
                                                                                    Total
                                                                                    Rebate
                                                                                </label>
                                                                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                                                                    <div>
                                                                                        <div className="mt-1 relative">
                                                                                            <input
                                                                                                type="number"
                                                                                                className={`shadow-sm placeholder-lightPrimary   ${!fields?.total_payment_rebate
                                                                                                    ? "input-error"
                                                                                                    : " input-no-error"
                                                                                                    } pl-5 block w-48 sm:text-sm rounded-md`}
                                                                                                placeholder="13,425"
                                                                                                aria-describedby="email-description"
                                                                                                name="total_payment_rebate"
                                                                                                onChange={
                                                                                                    handleChange
                                                                                                }
                                                                                                value={
                                                                                                    fields?.total_payment_rebate
                                                                                                }
                                                                                            />
                                                                                            <span
                                                                                                className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                                                                                style={{
                                                                                                    paddingTop:
                                                                                                        "2px",
                                                                                                }}
                                                                                            >
                                                                                                $
                                                                                            </span>
                                                                                            {!fields?.total_payment_rebate ? (
                                                                                                <p
                                                                                                    className={`absolute self-end pl-2 text-xs text-brickRed font-medium`}
                                                                                                >
                                                                                                    Total
                                                                                                    Rebate
                                                                                                    can
                                                                                                    not
                                                                                                    be
                                                                                                    empty
                                                                                                </p>
                                                                                            ) : null}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ) : null}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {fillColumns ? (
                                                <div className="py-2 pr-5 flex flex-col items-end justify-end  border-gray-400">
                                                    <Button
                                                        color="primary"
                                                        disabled={
                                                            (user?.program
                                                                ?.type ===
                                                                "VOLUME"
                                                                ? showClaimFields &&
                                                                !fields?.total_payment_rebate
                                                                : false) || createClaimLoading || updateClaimLoading || (user?.program
                                                                    ?.type ===
                                                                    "FACTORY" && !claimDateEdited) || (user?.program?.type === "VOLUME" && (!volumeClaimTotalRebateEdited && !claimDateEdited)) ||
                                                            (user?.status === "PROCESSING")
                                                        }
                                                        onClick={() => {
                                                            handleClaimMutation();
                                                        }}
                                                        title={
                                                            edit
                                                                ? updateClaimLoading ? "Saving Updates" : "Save Updates"
                                                                : createClaimLoading ? "Saving" : "Save"
                                                        }
                                                    />
                                                </div>
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </Disclosure>
                )}
                {(edit === true || volumeClaimMode === "edit") &&
                    !loadingVolumeClaim ? (
                    <Disclosure as="div" className="mt-5">
                        <Disclosure.Button
                            className={`bg-white w-full  focus:outline-none ${active === "description" && show
                                ? "rounded-lg rounded-b-none"
                                : "rounded-lg"
                                }`}
                        >
                            <div
                                style={{ maxHeight: "68px" }}
                                className={`flex flex-col md:flex-row py-4 px-4 justify-between items-center ${active === "description" && show
                                    ? "border-b-2 border-gray-400"
                                    : ""
                                    }`}
                                onClick={() => activeHandler("description")}
                            >
                                <div className=" font-title  text-center h2">
                                    {startEndDate
                                        ? "Claim Period: " +
                                        startEndDate?.from
                                            ?.toISOString()
                                            .slice(0, 10)
                                            .replace(/-/g, "/") +
                                        " to " +
                                        startEndDate?.to
                                            ?.toISOString()
                                            .slice(0, 10)
                                            .replace(/-/g, "/")
                                        : "Claim Period: " +
                                        startEndDate?.from
                                            ?.toISOString()
                                            .slice(0, 10)
                                            .replace(/-/g, "/") +
                                        " to " +
                                        startEndDate?.to
                                            ?.toISOString()
                                            .slice(0, 10)
                                            .replace(/-/g, "/")}
                                </div>
                                {active === "description" && show ? (
                                    <ChevronUpIcon className="h-10 w-10 text-secondary" />
                                ) : (
                                    <ChevronDownIcon className="h-10 w-10 text-secondary" />
                                )}
                            </div>
                        </Disclosure.Button>
                        <Transition
                            show={active === "description" && show}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-150 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Disclosure.Panel static>
                                <div className="grid bg-white  rounded-lg rounded-t-none grid-cols-6 overflow-hidden min-h-smallMin">
                                    {loading ? (
                                        <div className="col-span-6 flex items-center justify-center">
                                            <Loader />
                                        </div>
                                    ) : (
                                        <div className="col-span-6 inset-0 flex flex-col">
                                            <StartClaim
                                                history={history}
                                                type={user?.program?.type}
                                                claimNode={
                                                    user?.program?.type ===
                                                        "VOLUME" ||
                                                        user?.claim_type ===
                                                        "VOLUME" ||
                                                        user?.type === "VOLUME"
                                                        ? fields
                                                        : user
                                                }
                                                refetch={(id, type) =>
                                                    refetch(id, type)
                                                }
                                                recall={() => recall()}
                                                setClaimTotal={(total)=>{
                                                    setReportTotal(total)
                                                }}
                                                claimTotal={reportTotal}
                                                setBuilderAccordionData={(BuilderAccordionData)=>{
                                                    setBuilderAccordionData(BuilderAccordionData)
                                                }}
                                                builderAccordionData={builderAccordionData}
                                                setBuilderExpandData={(builderExpandData)=>{
                                                    setBuilderExpandData(builderExpandData)
                                                }}
                                                builderExpandData={builderExpandData}
                                                
                                                setClaimResult={(claimResult)=>{
                                                    setClaimResult(claimResult)
                                                }}
                                                claimResult={claimResult}
                                            />
                                        </div>
                                    )}
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </Disclosure>
                ) : null}
            </div>
        ) : null;
    };

    return accordians();
};

export default CreateClaims;
