import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLazyQuery } from "@apollo/client";
import { Helmet } from "react-helmet";
import {
    FETCH_ORGANIZATION_WITH_REBATE,
    NEW_PREPARE_QUERY,
    SEARCH_ORGANIZATION_WITH_REBATE,
} from "../../../../../lib/addresses";
import BuilderList from "../BuilderList";
import Loader from "../../../../Loader/Loader";
import MultiRebateAccordian from "./MultiRebateAccordian";
import { useDebounce } from "../../../../../util/hooks";
import { APP_TITLE } from "../../../../../util/constants";

const ActionRequired = ({ type }) => {
    const [houseProofPoints, setHouseProofPoints] = useState([]);
    const [productProofPoints, setProductProofPoints] = useState([]);
    const [array, setArray] = useState();
    const [houses, setHouses] = useState();
    const [readyHouses, setReadyHouses] = useState();
    const [actionHouses, setActionHouses] = useState();
    const [allHouses, setAllHouses] = useState();
    const [active, setActive] = useState();
    const [activeIsPeriodClosing, setActiveIsPeriodClosing] = useState();
    const supplierObserver = useRef();
    const first = 20;
    const [searched, setSearched] = useState();
    const [searchString, setSearchString] = useState();

    // eslint-disable-next-line
    const lastsupplierElement = useCallback((node) => {
        if (supplierObserver.current) supplierObserver.current.disconnect();
        supplierObserver.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && data.organizationsWithRebate.pageInfo.hasNextPage) {
                fetchMore({
                    variables: {
                        first,
                        after: data?.organizationsWithRebate?.pageInfo?.endCursor,
                    },
                });
            }
        });
        if (node) supplierObserver.current.observe(node);
    });

    const [rebateQuery1, { data: rebateData, loading: reportDataLoading }] = useLazyQuery(NEW_PREPARE_QUERY, {
        variables: {
            orgId: active,
        },
        notifyOnNetworkStatusChange: false,
        fetchPolicy: "network-only",
    });

    const handleManipulations = (type) => {
        let filteredDataWithHouseId = rebateData?.ProductsFromOrganization?.filter((item) => item?.house_id !== null);
        let actionHouses =
            type !== "all"
                ? filteredDataWithHouseId?.filter((item) => item?.rebate_status === type)
                : filteredDataWithHouseId;
        let houses = [];
        let houseIds = [];
        actionHouses?.forEach((item, index) => {
            let insideObject = {};
            let mainObject = {};
            if (!houseIds.includes(item?.house_id)) {
                mainObject.model = {
                    id: item?.house_id,
                    address: item?.house_address,
                    address2: item?.house_address2,
                    project_number: item?.project_number,
                    lot_number: item?.lot_number,
                    model: item?.model,
                    confirmed_occupancy: item?.confirmed_occupancy,
                    subdivision: {
                        name: item?.subdivision_name,
                        id: item?.house_subdivision_id,
                    },
                }; // house model

                let pivots = actionHouses
                    ?.filter((house) => parseInt(house?.house_id) === parseInt(item?.house_id))
                    ?.map((item) => item);
                let newPivots = pivots?.map((item) => {
                    let object = {};
                    object.id = item?.id;
                    object.status = item?.rebate_status;
                    object.product_quantity = item?.product_quantity;
                    object.claimed = item?.claimed;
                    object.isModifiable = item?.isModifiable;
                    object.product_serial_number = item?.product_serial_number;
                    object.product_model_number = item?.product_model_number;
                    object.product_brand = item?.product_brand;
                    object.product_date_of_installation = item?.product_date_of_installation;
                    object.product_date_of_purchase = item?.product_date_of_purchase;
                    object.subcontractorProvider = {
                        id: item?.subcontractor_id,
                        company_name: item?.company_name,
                    };
                    object.products = {
                        id: item?.product_id,
                        name: item?.product_name,
                        minimum_unit: item?.minimum_unit,
                        bbg_product_code: item?.bbg_product_code,
                        require_quantity_reporting: item?.require_quantity_reporting,
                        category: {
                            name: item?.product_categories_name,
                            id: item?.product_categories_id,
                        },
                        programs: item?.programs,
                    };
                    return object;
                });
                mainObject.pivots = newPivots;
                houseIds.push(item?.house_id);
                insideObject.node = mainObject;
                houses.push(insideObject);
            }
        });
        return houses;
    };

    useEffect(() => {
        handleManipulations("ACTION_REQUIRED");
        // eslint-disable-next-line
    }, [rebateData]);

    const [buildersQuery, { data, loading: builderLoading, fetchMore }] = useLazyQuery(FETCH_ORGANIZATION_WITH_REBATE, {
        variables: {
            status: type === "action" ? "ACTION_REQUIRED" : type === "ready" ? "REBATE_READY" : "COMPLETED",
        },
        notifyOnNetworkStatusChange: false,
        fetchPolicy: "network-only",
        onCompleted: () => {
            setActive(data?.organizationsWithRebate?.edges?.[0]?.node?.id);
            setActiveIsPeriodClosing(data?.organizationsWithRebate?.edges?.[0]?.node?.isPeriodClosing);
        },
    });

    const debouncedValue = useDebounce(searchString, 160);

    useEffect(() => {
        if (debouncedValue?.length > 0) {
            searchBuilderQuery();
        }
        // eslint-disable-next-line
    }, [debouncedValue]);

    const [searchBuilderQuery, { data: searchedOrganizations, loading: seaarchedBuilderLoading }] = useLazyQuery(
        SEARCH_ORGANIZATION_WITH_REBATE,
        {
            variables: {
                search: searchString,
                status: type === "action" ? "ACTION_REQUIRED" : type === "ready" ? "REBATE_READY" : "COMPLETED",
            },
            notifyOnNetworkStatusChange: false,
            fetchPolicy: "network-only",
        }
    );

    useEffect(() => {
        buildersQuery();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (active) {
            rebateQuery1();
        }
        // eslint-disable-next-line
    }, [active]);

    const refetch = () => {
        rebateQuery1();
    };

    useEffect(() => {
        if (type === "action") {
            if (rebateData?.ProductsFromOrganization?.length > 0) {
                dataChange(handleManipulations("ACTION_REQUIRED"));
                getAllProductsInEnd(handleManipulations("all"), "ACTION_REQUIRED");
                setAllHouses(handleManipulations("all"));
                getReadyProductsInEnd(handleManipulations("REBATE_READY"));
                setActionHouses(handleManipulations("ACTION_REQUIRED"));
                proofPointsManipulation(handleManipulations("ACTION_REQUIRED"));
            }
        } else if (type === "ready") {
            if (rebateData?.ProductsFromOrganization?.length > 0) {
                dataChange(handleManipulations("REBATE_READY"));
                setAllHouses(handleManipulations("all"));
                getAllProductsInEnd(handleManipulations("all"), "REBATE_READY");
                getReadyProductsInEnd(handleManipulations("REBATE_READY"));
                proofPointsManipulation(handleManipulations("REBATE_READY"));
                setActionHouses(handleManipulations("ACTION_REQUIRED"));
            }
        } else if (type === "completed") {
            if (rebateData?.ProductsFromOrganization?.length > 0) {
                dataChange(handleManipulations("COMPLETED"));
                proofPointsManipulation(handleManipulations("COMPLETED"));
            }
        }
        // eslint-disable-next-line
    }, [rebateData]);

    const dataChange = (Data) => {
        let array = [];
        let ids = [];
        Data &&
            Data.forEach((item, index) => {
                let object = { rebateIds: [] };
                item?.node?.pivots?.forEach((pivot) => {
                    object.rebateIds.push(pivot?.id);
                });
                if (!ids.includes(item?.node?.model?.subdivision?.id)) {
                    ids.push(item?.node?.model?.subdivision?.id);
                    object.subdivisionId = item?.node?.model?.subdivision?.id;
                    object.subdivisionName = item?.node?.model?.subdivision.name;
                    object.houses = [item];
                    array.push(object);
                } else {
                    array.forEach((element) => {
                        if (element.subdivisionId === item?.node?.model?.subdivision?.id) {
                            let house = [item];
                            let updatedHouse = [...element.houses, ...house];
                            element.houses = updatedHouse;
                        }
                    });
                }
            });
        setArray(array);
        return array;
    };

    const getAllProductsInEnd = (Data, tab) => {
        let array = [];
        let ids = [];

        Data &&
            Data.forEach((item, index) => {
                let object = { rebateIds: [] };
                item?.node?.pivots?.forEach((pivot) => {
                    object.rebateIds.push(pivot?.id);
                });
                if (!ids.includes(item?.node?.model?.subdivision?.id)) {
                    let passed;
                    item?.node?.pivots?.forEach((pivot) => {
                        if (pivot?.status === tab && !passed) {
                            passed = true;
                            ids.push(item?.node?.model?.subdivision?.id);
                            object.subdivisionId = item?.node?.model?.subdivision.id;
                            object.subdivisionName = item?.node?.model?.subdivision.name;
                            object.houses = [item];
                            array.push(object);
                        }
                    });
                    passed = false;
                } else {
                    array.forEach((element) => {
                        if (element.subdivisionId === item?.node?.model?.subdivision?.id) {
                            let passed;
                            item?.node?.pivots?.forEach((pivot) => {
                                if (pivot?.status === tab && !passed) {
                                    passed = true;
                                    let house = [item];
                                    let updatedHouse = [...element.houses, ...house];
                                    element.houses = updatedHouse;
                                }
                            });
                            passed = false;
                        }
                    });
                }
            });
        setHouses(array);
        setArray(array);
        return array;
    };

    const getReadyProductsInEnd = (Data) => {
        let array = [];
        let ids = [];

        Data &&
            Data.forEach((item, index) => {
                let object = {};
                if (!ids.includes(item?.node?.model?.subdivision?.id)) {
                    ids.push(item?.node?.model?.subdivision?.id);
                    object.subdivisionId = item?.node?.model?.subdivision.id;
                    object.subdivisionName = item?.node?.model?.subdivision.name;
                    object.houses = [item];
                    array.push(object);
                } else {
                    array.forEach((element) => {
                        if (element.subdivisionId === item?.node?.model?.subdivision?.id) {
                            let house = [item];
                            let updatedHouse = [...element.houses, ...house];
                            element.houses = updatedHouse;
                        }
                    });
                }
            });
        setReadyHouses(array);
        return array;
    };

    let productProofPointsArray = [
        "require_brand",
        "require_serial_number",
        "require_model_number",
        "require_date_of_installation",
        "require_date_of_purchase",
        "require_distributor",
    ];

    let houseProofPointsArray = ["require_certificate_occupancy"];

    const proofPointsManipulation = (Data) => {
        let houseProofPoints = [];
        let houseProofPointsId = [];
        let productProofPoints = [];
        let productProofPointsId = [];
        Data &&
            Data.forEach((item) => {
                item?.node?.pivots?.forEach((insideItem) => {
                    insideItem?.products?.programs?.forEach((eachProgram) => {
                        //House Proof Points
                        houseProofPointsArray.forEach((array) => {
                            if (
                                eachProgram[array] &&
                                houseProofPoints.findIndex(
                                    (element) =>
                                        element.productId === insideItem?.products?.id &&
                                        element.type === array &&
                                        element?.houseId === item?.node?.model?.id
                                ) < 0
                            ) {
                                let object = {};
                                object.productId = insideItem?.products?.id;
                                object.name = insideItem?.products?.name;
                                object.type = array;
                                object.confirmed_occupancy = item?.model?.confirmed_occupancy;
                                object.subdivisionId = item?.node?.model?.subdivision?.id;
                                object.houseId = item?.node?.model?.id;
                                houseProofPoints.push(object);
                                houseProofPointsId.push(item?.node?.model?.id);
                            }
                        });
                        //Product Proof Points
                        productProofPointsArray.forEach((array) => {
                            if (
                                eachProgram[array] &&
                                productProofPoints.findIndex(
                                    (element) =>
                                        element.productId === insideItem?.products?.id &&
                                        element.houseId === item?.node?.model?.id &&
                                        element.type === array
                                ) < 0
                            ) {
                                let object = {};
                                object.productId = insideItem?.products?.id;
                                object.name = insideItem?.products?.name;
                                object.category = insideItem?.products?.category;
                                object.programs = insideItem?.products?.programs;
                                object.rebateReportPivot = {
                                    product_brand: insideItem?.product_brand,
                                    product_serial_number: insideItem?.product_serial_number,
                                    subcontractorProvider: insideItem?.subcontractorProvider,
                                    product_model_number: insideItem?.product_model_number,
                                    product_date_of_purchase: insideItem?.product_date_of_purchase,
                                    product_date_of_installation: insideItem?.product_date_of_installation,
                                };
                                object.bbg_product_code = insideItem?.products?.bbg_product_code;
                                object.type = array;
                                object.houseId = item?.node?.model?.id;
                                object.subdivisionId = item?.node?.model?.subdivision?.id;
                                productProofPoints.push(object);
                                productProofPointsId.push(insideItem?.products?.id);
                            }
                        });
                    });
                });
            });
        productProofPointsPerHouse(productProofPoints);
        houseProofPointsPerSubdivision(houseProofPoints);
    };

    const productProofPointsPerHouse = (array) => {
        let anotherArray = [];
        let ids = [];
        array.forEach((item) => {
            if (!ids.includes(item.houseId)) {
                let object = {};
                object.houseId = item.houseId;
                ids.push(item.houseId);
                object.productProofPoints = [item];
                anotherArray.push(object);
            } else {
                anotherArray.forEach((element) => {
                    if (element.houseId === item.houseId) {
                        let productProofPoints = [item];
                        let updatedProofPoints = [...element.productProofPoints, ...productProofPoints];
                        element.productProofPoints = updatedProofPoints;
                    }
                });
            }
        });
        setProductProofPoints(anotherArray);
    };

    const houseProofPointsPerSubdivision = (array) => {
        let anotherArray = [];
        let ids = [];
        array.forEach((item) => {
            if (!ids.includes(item.houseId)) {
                let object = {};
                object.houseId = item.houseId;
                ids.push(item.houseId);
                object.houseProofPoints = [item];
                anotherArray.push(object);
            } else {
                anotherArray.forEach((element) => {
                    if (element.houseId === item.houseId) {
                        let houseProofPoints = [item];
                        let updatedProofPoints = [...element.houseProofPoints, ...houseProofPoints];
                        element.houseProofPoints = updatedProofPoints;
                    }
                });
            }
        });
        setHouseProofPoints(anotherArray);
    };

    const handleChange = (e) => {
        setSearchString(e.target.value);

        if (searchString?.length > 0) {
            setSearched(true);
            searchBuilderQuery();
        }
    };

    return (
        <div
            className="flex w-full flex-col mt-5 bg-white rounded-lg xl:mb-5 overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400"
            style={{ minHeight: "79vh", maxHeight: "79vh" }}
        >
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Prepare Rebates - Action Required</title>
            </Helmet>

            <div className="">
                <div className="grid  grid-cols-9 min-h-layout  overflow-hidden">
                    <BuilderList
                        searchString={searchString}
                        handleChange={handleChange}
                        searched={searched}
                        seaarchedBuilderLoading={seaarchedBuilderLoading}
                        searchedOrganizations={searchedOrganizations}
                        setSearchString={setSearchString}
                        setSearched={setSearched}
                        active={active}
                        lastsupplierElement={lastsupplierElement}
                        setActive={setActive}
                        setActiveIsPeriodClosing={setActiveIsPeriodClosing}
                        builderLoading={builderLoading}
                        data={data}
                    />

                    <div
                        className="flex flex-col col-span-7 lg:col-span-7 h-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 "
                        style={{
                            minHeight: "79vh",
                            maxHeight: "79vh",
                        }}
                    >
                        <>
                            {reportDataLoading ? (
                                <Loader />
                            ) : (
                                <MultiRebateAccordian
                                    refetch={refetch}
                                    reportId={
                                        rebateData?.ProductsFromOrganization?.filter(
                                            (item) => item?.house_id !== null
                                        )?.[0]?.rebateReport_id
                                    }
                                    isModifiable={
                                        rebateData?.ProductsFromOrganization?.filter(
                                            (item) => item?.house_id !== null
                                        )?.[0]?.isModifiable
                                    }
                                    disputes={
                                        rebateData?.ProductsFromOrganization?.filter(
                                            (item) => item?.house_id !== null
                                        )?.[0]?.disputes
                                    }
                                    houses={houses}
                                    readyHouses={readyHouses}
                                    actionHouses={actionHouses}
                                    allHouses={allHouses}
                                    houseProofPoints={houseProofPoints}
                                    productProofPoints={productProofPoints}
                                    Data={array}
                                    organizationId={active}
                                    isPeriodClosing={activeIsPeriodClosing}
                                    type={type}
                                />
                            )}
                        </>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionRequired;
