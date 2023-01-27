import React, { useState, useEffect, useContext } from "react";

import { useLazyQuery, useMutation } from "@apollo/client";
import { Switch } from "@headlessui/react";
import { GET_NEW_REPORTDATA, MASS_ASSIGN_PROOF_POINTS } from "./SearchRebates.queries";
import { XIcon } from "@heroicons/react/outline";
import { Transition } from "@headlessui/react";
import MultiAccordian from "../../../MultiAccordian/MultiAccordian";
import Loader from "../../../Loader/Loader";
import { useDebounce, useMandatoryImpersonation } from "../../../../util/hooks";
import { AuthContext } from "../../../../contexts/auth";
import { classNames, frontEndSearch } from "../../../../util/generic";
import Button from "../../../Buttons";
import { toast } from "react-toastify";

const SearchRebates = ({ proofPointsObject, proofPointsObjectValues, hideClaimed }) => {
    const [searchString, setSearchString] = useState("");
    const [activeAddresses, setActiveAddresses] = useState([]);
    const [refetchSubdivisions] = useState([]);
    const [refetchHouses] = useState([]);
    const [refetchProductIds] = useState([]);
    const [reportManipulatedObject, setReportManipulatedObject] = useState();
    const [productSearchBoolean, setProductSearchBoolean] = useState(false);
    const [searchJSONResults, setSearchJSONResults] = useState();
    const [key] = useState(-1);
    const [rebateReportData, setRebateReportData] = useState();
    const [productsToAdd, setProductsToAdd] = useState({});
    const [rebatesIDs, setRebatesIDs] = useState({});
    const [amountOfRebates, setAmountOfRebates] = useState();

    const { impersonator } = useMandatoryImpersonation({
        allowedUserTypes: ["BUILDERS"],
    });

    const { organizationId, organizationNode } = useContext(AuthContext);

    const handleAccordianEachAddress = (node) => {
        if (activeAddresses?.findIndex((element) => element?.id === node?.id) > -1) {
            setActiveAddresses(activeAddresses.filter((item) => item.id !== node.id));
        } else {
            setActiveAddresses(() => [
                ...activeAddresses,
                {
                    ...node,
                    subdivisionName: node?.subdivisionName ? node?.subdivisionName : node?.subdivision?.name,
                    subdivisionId: node?.subdivisionId ? node?.subdivisionId : node?.subdivision?.id,
                },
            ]);
        }
    };

    const handleAccordianSubdivisionAddresses = (node, checked) => {
        let newAddresses = [];
        if (!checked) {
            node?.houses?.edges?.forEach((item) => {
                if (activeAddresses?.findIndex((element) => element?.id === item?.node?.id) < 0) {
                    let object = {};
                    object.name = item?.node?.address;
                    object.id = item?.node?.id;
                    object.subdivisionName = node?.name;
                    object.subdivisionId = node?.id;
                    newAddresses.push({ ...object, ...item.node });
                }
            });
            setActiveAddresses([...activeAddresses, ...newAddresses]);
        }

        if (checked) {
            node?.houses?.edges?.forEach((item) => {
                let object = {};
                object.name = item?.node?.address;
                object.id = item?.node?.id;
                object.subdivisionName = node?.name;
                object.subdivisionId = node?.id;
                newAddresses.push({ ...object, ...item.node });
            });
            let newArray = activeAddresses.filter((el) => !newAddresses.find((rm) => rm.id === el.id));
            setActiveAddresses(newArray);
        }
    };

    const [getReport, { data: rebateData, loading: reportDataLoading }] = useLazyQuery(GET_NEW_REPORTDATA, {
        variables: {
            orgId: organizationId,
        },
        notifyOnNetworkStatusChange: false,
        fetchPolicy: "no-cache",
    });

    useEffect(() => {
        if (rebateData) {
            setRebateReportData(rebateData);
        }
    }, [rebateData]);

    const debouncedValue = useDebounce(searchString, 160);

    useEffect(() => {
        rebateReportDataManipulation();
        // eslint-disable-next-line
    }, [rebateReportData, debouncedValue, productSearchBoolean]);

    const rebateReportDataManipulation = () => {
        let filteredDataWithHouseId;
        filteredDataWithHouseId =
            searchString?.length > 0 && productSearchBoolean
                ? searchJSONResults?.products
                : rebateReportData?.ProductsFromOrganization?.filter((item) => item?.house_id !== null);
        if (refetchSubdivisions?.[key] && refetchHouses?.[key] && refetchProductIds?.[key] && key > -1) {
            filteredDataWithHouseId = filteredDataWithHouseId?.filter(
                (item) =>
                    !(
                        parseInt(refetchSubdivisions?.[key]) === parseInt(item?.house_subdivision_id) &&
                        parseInt(refetchHouses?.[key]) === parseInt(item?.house_id) &&
                        parseInt(refetchProductIds?.[key]) === parseInt(item?.product_id)
                    )
            );
        }
        let allHouseModels = [];
        rebateReportData?.activeSubdivisions?.edges?.forEach((item) => {
            item?.node?.houses?.edges?.forEach((house) => {
                allHouseModels.push(house);
            });
        });
        let finalObject = {};
        let houses = [];
        let houseIds = [];
        filteredDataWithHouseId?.forEach((item, index) => {
            let insideObject = {};
            let mainObject = {};
            if (!houseIds.includes(item.house_id)) {
                mainObject.model = allHouseModels?.find(
                    (house) => parseInt(house.node.id) === parseInt(item.house_id)
                )?.node; // house model
                let pivots = filteredDataWithHouseId
                    ?.filter((house) => parseInt(house?.house_id) === parseInt(item.house_id))
                    ?.map((item) => item);
                mainObject.pivots = pivots;
                houseIds.push(item.house_id);
                insideObject.node = mainObject;
                houses.push(insideObject);
            }
        });
        finalObject.id = organizationNode?.organizations?.edges[0]?.node?.rebateReports?.edges[0]?.node?.id;
        finalObject.houses = { edges: houses };
        setReportManipulatedObject(finalObject);
    };

    useEffect(() => {
        getReport();
        // eslint-disable-next-line
    }, [impersonator]);

    useEffect(() => {
        if (searchString?.length === 0) {
            setSearchJSONResults({});
        }
    }, [searchString]);

    useEffect(() => {
        setSearchJSONResults({});
        setSearchString("");
    }, [productSearchBoolean]);

    useEffect(() => {
        let rebates = Object.entries(productsToAdd).filter((value) => value[1] === true);
        let rebateIds = [];
        rebates?.forEach((rebate) => {
            rebateIds.push(rebate[0]);
        });
        setAmountOfRebates(Object.values(productsToAdd).filter((value) => value === true).length);
        setRebatesIDs(rebateIds);
        // eslint-disable-next-line
    }, [productsToAdd]);

    const tempMethod = (subdivisionId, houseId, productId) => {
        let tempProductArray;
        tempProductArray = [...rebateReportData?.ProductsFromOrganization];
        if (subdivisionId && houseId && productId) {
            tempProductArray = tempProductArray?.filter(
                (item) =>
                    !(
                        parseInt(subdivisionId) === parseInt(item?.house_subdivision_id) &&
                        parseInt(houseId) === parseInt(item?.house_id) &&
                        parseInt(productId) === parseInt(item?.product_id)
                    )
            );
        }
        if (refetchSubdivisions?.[key] && refetchHouses?.[key] && refetchProductIds?.[key]) {
            tempProductArray = tempProductArray?.filter(
                (item) =>
                    !(
                        parseInt(refetchSubdivisions?.[key]) === parseInt(item?.house_subdivision_id) &&
                        parseInt(refetchHouses?.[key]) === parseInt(item?.house_id) &&
                        parseInt(refetchProductIds?.[key]) === parseInt(item?.product_id)
                    )
            );
        }
        let searchedProduct;

        if (productSearchBoolean) {
            searchedProduct = tempProductArray?.filter((item) =>
                frontEndSearch([item.bbg_product_code, item.product_name], searchString)
            );
        } else {
            searchedProduct = [];
            rebateReportData?.activeSubdivisions?.edges?.forEach((item) => {
                let result = item?.node?.houses?.edges?.filter((house) =>
                    frontEndSearch(
                        [house?.node?.zip_postal, house?.node?.address, house?.node?.lot_number, house?.node?.city],
                        searchString
                    )
                );
                searchedProduct = searchedProduct.concat(result);
            });
        }
        let allSearchedHouseId = productSearchBoolean
            ? searchedProduct?.map((item) => item.house_id)
            : searchedProduct?.map((item) => item?.node.id);
        let searchedSubdivisions = rebateReportData?.activeSubdivisions?.edges?.filter((item) => {
            let array = item?.node?.houses?.edges?.map((house) => house.node.id);
            if (array?.some((item) => allSearchedHouseId?.includes(item))) {
                return true;
            } else {
                return false;
            }
        });
        const uniqueHouses = [...new Set(allSearchedHouseId)];
        if (!productSearchBoolean && searchString?.length > 0) {
            searchedSubdivisions?.map((item) => {
                return item?.node?.houses?.edges?.map((house) => allSearchedHouseId?.includes(house?.node?.id));
            });
        }

        setSearchJSONResults({
            products: searchedProduct,
            subdivisions: searchedSubdivisions,
            uniqueHouses: uniqueHouses,
        });
    };

    useEffect(() => {
        if (debouncedValue?.length > 0 && rebateReportData) {
            tempMethod();
        }
        // eslint-disable-next-line
    }, [debouncedValue, searchString, rebateReportData]);

    const handleChange = (e) => {
        setSearchString(e.target.value);
    };

    const [massAssignProofPoints] = useMutation(MASS_ASSIGN_PROOF_POINTS, {
        variables: {
            rebates: rebatesIDs,
            product_serial_number: proofPointsObject?.serialNumber ? proofPointsObjectValues?.serialNumber : undefined,
            product_model_number: proofPointsObject?.modelNumber ? proofPointsObjectValues?.modelNumber : undefined,
            product_brand: proofPointsObject?.brand ? proofPointsObjectValues?.brand : undefined,
            product_date_of_purchase: proofPointsObject?.dateOfPurchase
                ? proofPointsObjectValues?.dateOfPurchase
                : undefined,
            product_date_of_installation: proofPointsObject?.dateOfInstallation
                ? proofPointsObjectValues?.dateOfInstallation
                : undefined,
            subcontractor: proofPointsObject?.subcontratorDistributorProvider
                ? proofPointsObjectValues?.subcontratorDistributorProvider
                : undefined,
        },
        onError: (error) => {
            toast.error(error?.graphQLErrors[0]?.debugMessage);
        },
        onCompleted: () => {
            toast.info("Updating Rebates. A notification will be sent when finished");
        },
    });

    return (
        <div className="w-full">
            <div className="inset-0 w-full bg-white border  rounded-lg h-full relative">
                <div className="inset-0 h-full flex flex-col">
                    <div className="flex justify-between w-full   items-center">
                        <div className={"w-full"}>
                            <div
                                className="flex flex-row w-full bg-gray-50 rounded-md hover:bg-gray-100"
                                style={{ maxHeight: "59px" }}
                            >
                                <p className="w-full text-lg py-4 rounded-lg rounded-b-none justify-center items-center text-center mr-0 border  border-t-0  border-l-0 border-r-0  font-title font-medium text-secondary bg-white ">
                                    Addresses
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 overflow-auto w-full">
                        <div className="flex relative  flex-col h-full  w-full">
                            <div className={`w-full h-full ${true ? "border-t" : ""}  overflow-hidden  `}>
                                <Transition
                                    show={true}
                                    enter="transition ease-out duration-1000"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                >
                                    <div className="pt-3 pb-3 flex flex-col rounded-md">
                                        <Switch.Group
                                            as="div"
                                            className="flex items-center px-4  justify-center mb-1 w-full"
                                        >
                                            <Switch.Label as="span" className="mr-3">
                                                <span className="text-md font-medium text-darkgray75">
                                                    Address Search
                                                </span>
                                            </Switch.Label>
                                            <Switch
                                                checked={productSearchBoolean}
                                                onChange={setProductSearchBoolean}
                                                className={classNames(
                                                    productSearchBoolean ? "bg-secondary" : "bg-secondary",
                                                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none"
                                                )}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={classNames(
                                                        productSearchBoolean ? "translate-x-5" : "translate-x-0",
                                                        "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                                                    )}
                                                />
                                            </Switch>
                                            <Switch.Label as="span" className="ml-3">
                                                <span className="text-md font-medium text-darkgray75">
                                                    Product Search
                                                </span>
                                            </Switch.Label>
                                        </Switch.Group>

                                        <div className="relative flex justify-between items-center w-full px-4 focus-within:z-10">
                                            <div className="relative flex items-stretch flex-grow focus-within:z-10">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                                                <input
                                                    onChange={handleChange}
                                                    type="text"
                                                    name="searchAddresses"
                                                    id="searchAddresses"
                                                    className="focus:ring-secondary focus:border-secondary block w-full  rounded-md  sm:text-sm border-gray-300"
                                                    placeholder={
                                                        productSearchBoolean ? "Find Product(s)" : "Find Address(es)"
                                                    }
                                                    value={searchString}
                                                />
                                                {searchString?.length > 0 ? (
                                                    <XIcon
                                                        onClick={() => setSearchString("")}
                                                        className="cursor-pointer w-6 h-6 text-brickRed absolute right-2 top-1/2 transform -translate-y-1/2 "
                                                    />
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                                <div className="flex h-full overflow-auto w-full">
                                    <div className="flex flex-col h-full overflow-auto w-full">
                                        <div className="w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                            <div className="grid h-full grid-cols-1 gap-6 border-t border-b">
                                                {reportDataLoading ? (
                                                    <Loader />
                                                ) : (
                                                    <MultiAccordian
                                                        handleAccordianSubdivisionAddresses={(node, checked) =>
                                                            handleAccordianSubdivisionAddresses(node, checked)
                                                        }
                                                        handleAccordianEachAddress={(node) =>
                                                            handleAccordianEachAddress(node)
                                                        }
                                                        activeAddresses={activeAddresses}
                                                        Data={
                                                            reportManipulatedObject?.id ? reportManipulatedObject : null
                                                        }
                                                        search={searchString?.length > 0}
                                                        productSearch={searchString?.length > 0 && productSearchBoolean}
                                                        uniqueHouses={
                                                            searchString?.length > 0 && searchJSONResults?.uniqueHouses
                                                        }
                                                        subdivisions={
                                                            searchString?.length > 0
                                                                ? {
                                                                      activeSubdivisions: {
                                                                          edges: searchJSONResults?.subdivisions,
                                                                      },
                                                                  }
                                                                : rebateReportData
                                                        }
                                                        selectableProducts={true}
                                                        productsToAdd={productsToAdd}
                                                        setProductsToAdd={setProductsToAdd}
                                                        hideClaimed={hideClaimed}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {amountOfRebates > 0 ? (
                                <div className="p-4 pb-16 flex flex-col border-t">
                                    <div className="flex">
                                        <p className="text-xl font-title text-secondary font-semibold">
                                            {" "}
                                            Selected Rebates : {amountOfRebates}{" "}
                                        </p>
                                    </div>
                                    <div className="w-full flex justify-end items-center">
                                        <Button
                                            color="primary"
                                            title={"Report"}
                                            disabled={organizationNode?.isPeriodClosing}
                                            onClick={() => massAssignProofPoints()}
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchRebates;
