import React, { useState, useEffect, useCallback, useRef } from "react";

import {
    FETCH_ORGANIZATION_WITH_REBATE,
    SEARCH_ORGANIZATION_WITH_REBATE,
    NEW_PREPARE_QUERY,
} from "../../../../../lib/addresses";

import BuilderList from "../BuilderList";
import Loader from "../../../../Loader/Loader";
import RejectedSubdivisionsAccordion from "./RejectedSubvidisionsAccordion";

import { useLazyQuery, useQuery } from "@apollo/client";
import { Helmet } from "react-helmet";
import { APP_TITLE } from "../../../../../util/constants";

const RebateRejected = () => {
    const [searched, setSearched] = useState();
    const [searchString, setSearchString] = useState();
    const [active, setActive] = useState();
    const [rebates, setRebates] = useState();
    const supplierObserver = useRef();
    const first = 20;

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

    const [searchBuilderQuery, { data: searchedOrganizations, loading: seaarchedBuilderLoading }] = useLazyQuery(
        SEARCH_ORGANIZATION_WITH_REBATE,
        {
            variables: {
                search: searchString,
                status: "REJECTED",
            },
            notifyOnNetworkStatusChange: false,
            fetchPolicy: "network-only",
        }
    );

    const [getRebates, { data: rebateData, loading: reportDataLoading }] = useLazyQuery(NEW_PREPARE_QUERY, {
        variables: {
            orgId: active,
        },
        notifyOnNetworkStatusChange: false,
        fetchPolicy: "network-only",
    });

    const {
        data,
        loading: builderLoading,
        fetchMore,
    } = useQuery(FETCH_ORGANIZATION_WITH_REBATE, {
        variables: {
            status: "REJECTED",
        },
        notifyOnNetworkStatusChange: false,
        fetchPolicy: "network-only",
        onCompleted: () => {
            setActive(data?.organizationsWithRebate?.edges?.[0]?.node?.id);
        },
    });

    const handleChange = (e) => {
        setSearchString(e.target.value);

        if (searchString?.length > 0) {
            setSearched(true);
            searchBuilderQuery();
        }
    };

    const dataChange = (Data) => {
        let array = [];
        let ids = [];
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

        setRebates(array);
        return array;
    };

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
                        reject_note: item?.rejects[0]?.reject_note,
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
        if (rebateData?.ProductsFromOrganization?.length > 0) {
            dataChange(handleManipulations("REJECTED"));
        }
        // eslint-disable-next-line
    }, [rebateData]);

    useEffect(() => {
        if (active) {
            getRebates();
        }
        // eslint-disable-next-line
    }, [active]);

    return (
        <div
            className="flex w-full flex-col mt-5 bg-white rounded-lg xl:mb-5 overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400"
            style={{ minHeight: "79vh", maxHeight: "79vh" }}
        >
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Prepare Rebates - Rebate Rejected</title>
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
                        <>{reportDataLoading ? <Loader /> : <RejectedSubdivisionsAccordion rebates={rebates} />}</>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RebateRejected;
