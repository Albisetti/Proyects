import React, { useState, useRef, useCallback, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Button from "../../../Buttons";
import Modal from "../../../Modal";
import { useLazyQuery, useMutation } from "@apollo/client";
import { FETCH_BUNDLES_QUERY, FETCH_PRODUCTS_PER_BUNDLE } from "../../../../lib/bundles";
import { Switch } from "@headlessui/react";
import {
    CREATE_REBATE_REPORT,
    UPDATE_REBATE_REPORT,
    UPDATE_HOUSES,
    DISCONNECT_HOUSES,
    CREATE_SUBDIVISION_AND_CONNECT_HOUSES,
    GET_NEW_REPORTDATA,
} from "../../../../lib/addresses";
import { ArrowCircleRightIcon, CheckCircleIcon, PlusCircleIcon, XIcon } from "@heroicons/react/outline";
import { ProductAssignlist } from "./Data";
import { Helmet } from "react-helmet";
import { Transition } from "@headlessui/react";
import MultiAccordian from "../../../MultiAccordian/MultiAccordian";
import Loader from "../../../Loader/Loader";
import { toast } from "react-toastify";
import { SEARCH_PRODUCTS } from "../../../../lib/search";
import BundleAccordion from "./Bundles/BundleAccordion";
import HelperModal from "../../../Modal/HelperModal";
import { useDebounce, useMandatoryImpersonation } from "../../../../util/hooks";
import { AuthContext } from "../../../../contexts/auth";
import DayPickerInput from "react-day-picker/DayPickerInput";
import TextField from "../../../FormGroups/Input";
import { classNames, frontEndSearch } from "../../../../util/generic";
import { APP_TITLE } from "../../../../util/constants";

const Assignment = () => {
    const [showModal, setShowModal] = useState(false);
    const [active, setActive] = useState([]);
    const [activeId, setActiveId] = useState();
    const [searchString, setSearchString] = useState("");
    const programObserver = useRef();
    const first = 20;
    const searchedBundles = true;
    const [enabled, setEnabled] = useState("bundles");
    const [accordianData, setAccordianData] = useState([]);
    const [assign, setAssign] = useState("allAddress");
    const [productPerBundle, setProductsPerBundle] = useState([]);
    const [accordianDataClickData, setAccordianDataClickData] = useState([]);
    const [activeProducts, setActiveProducts] = useState([]);
    const [animate, setAnimate] = useState(false);
    const [activeAddresses, setActiveAddresses] = useState([]);
    const [effectActiveProducts, setEffectActiveProducts] = useState([]);
    const [showSearch, setShowSearch] = useState(true);
    const [fields, setFields] = useState();
    const [edit, setEdit] = useState(false);
    const [closeAccordian, setCloseAccordian] = useState(true);
    const [productSearchString, setProductSearchString] = useState("");
    const [productSearch, setProductSearch] = useState();
    const [error, setError] = useState();
    const [productNode, setProductNode] = useState();
    const [refusedChanges, setRefusedChanges] = useState();
    const [showRefusedModal, setShowRefusedModal] = useState();
    const [doINeedToAddAddress, setDoINeedToAddAddress] = useState();
    const [showAddressRequirementModal, setShowAddressRequirementModal] = useState();
    const [tableAddresses, setTableAddresses] = useState();
    const [propertyWithoutAddress, setPropertyWithoutAddress] = useState();
    const [manualCODate, setManualCODate] = useState(new Date());
    const [addressErrors, setAddressErrors] = useState();
    const [modalConfirmation, setModalConfirmation] = useState();
    const [refetchSubdivisions, setRefetchSubdivisions] = useState([]);
    const [refetchHouses, setRefetchHouses] = useState([]);
    const [refetchProductIds, setRefetchProductIds] = useState([]);
    const [doINeedToHaveDiffSubdivision, setDoINeedToHaveDiffSubdivision] = useState();
    const [showSubdivisionRequirementModal, setShowSubdivisionRequirementModal] = useState();
    const [subdivisionName, setSubdivisionName] = useState();
    const [reportManipulatedObject, setReportManipulatedObject] = useState();
    const [productSearchBoolean, setProductSearchBoolean] = useState(false);
    const [searchJSONResults, setSearchJSONResults] = useState();
    const [key, setKey] = useState(-1);
    const [rebateReportData, setRebateReportData] = useState();

    const handleBoolChange = (e, type) => {
        if (type === "select") {
            setEnabled(e.target.id);
        } else if (type === "assign") {
            setAssign(e.target.id);
        }
    };

    const { impersonator } = useMandatoryImpersonation({
        allowedUserTypes: ["BUILDERS"],
    });

    const { organizationId, organizationNode } = useContext(AuthContext);

    const SwitchButton = ({ option1, option2, type, label1, label2, wFull }) => {
        return (
            <div className={wFull ? "w-full" : ""}>
                <div
                    className="flex flex-row w-full bg-gray-50 rounded-md hover:bg-gray-100"
                    style={{ maxHeight: "59px" }}
                >
                    <button
                        type="button"
                        onClick={(e) => handleBoolChange(e, type)}
                        id={option1}
                        className={`inline-flex ${
                            wFull
                                ? "w-full text-lg py-4  rounded-lg rounded-r-none rounded-b-none"
                                : "px-4 py-2 m-1 rounded-md rounded-r-none"
                        } justify-center items-center text-center  mr-0  border border-r-0 border-gray-500   shadow-sm text-sm font-title font-medium text-white ${
                            type === "select"
                                ? enabled === option1
                                    ? "bg-secondary border-secondary"
                                    : "text-secondary bg-white hover:bg-gray-50"
                                : assign === option1
                                ? "bg-secondary border-secondary"
                                : "text-secondary bg-white hover:bg-gray-50"
                        }  focus:outline-none `}
                    >
                        {label1}
                    </button>
                    <button
                        type="button"
                        onClick={(e) => handleBoolChange(e, type)}
                        id={option2}
                        className={`inline-flex items-center ${
                            wFull
                                ? "w-full py-4 text-lg rounded-lg rounded-l-none rounded-b-none"
                                : "py-2 m-1  px-4 ml-0 rounded-md"
                        } justify-center   border border-gray-500 text-center border-l-0  rounded-l-none shadow-sm font-title text-sm font-medium text-white ${
                            type === "select"
                                ? enabled === option2
                                    ? "bg-secondary border-secondary"
                                    : "text-secondary bg-white hover:bg-gray-50"
                                : assign === option2
                                ? "bg-secondary border-secondary"
                                : "text-secondary bg-white hover:bg-gray-50"
                        }  focus:outline-none  `}
                    >
                        {label2}
                    </button>
                </div>
            </div>
        );
    };

    const AccordianComponent = () => {
        return (
            <div className="w-full max-h-partial xl:max-h-smallMin sm:max-h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                <ul className=" flex-0 w-full  overflow-auto border-l  border-r border-white ">
                    {accordianDataClickData.map((eachData) => {
                        return (
                            <li
                                className={` pl-5 py-2 transition-all border-t border-l-4 bg-gray-100 hover:border-l-6 ${
                                    activeProducts.includes(parseInt(eachData.node.id))
                                        ? "border-l-gold  border-l-6"
                                        : "border-l-primary"
                                }`}
                                onClick={() => {
                                    addProducts(eachData);
                                    setProductNode(eachData);
                                }}
                            >
                                <div className="flex flex-col text-xs text-gray-500 italic">
                                    {eachData.node.category && eachData.node.category.name}
                                </div>
                                <div className="group relative   flex justify-between items-center">
                                    <p className="text-sm font-semibold text-gray-500">
                                        <Link to="#" className="  focus:outline-none">
                                            <span className="absolute inset-0" aria-hidden="true"></span>
                                            {eachData?.node?.bbg_product_code
                                                ? eachData?.node?.bbg_product_code + " - "
                                                : ""}
                                            {eachData.node.name}
                                        </Link>
                                    </p>
                                    {activeProducts.includes(parseInt(eachData.node.id)) ? (
                                        <CheckCircleIcon className="w-5 opacity-0 transition-all h-5 mr-5 text-brickGreen  group-hover:opacity-100" />
                                    ) : (
                                        <ArrowCircleRightIcon className="w-5 opacity-0 transition-all h-5 mr-5 text-secondary  group-hover:opacity-100" />
                                    )}
                                </div>
                                <div className="flex flex-col text-xs text-gray-500">
                                    {eachData.node &&
                                        eachData.node.programs &&
                                        eachData.node.programs.edges.length > 0 &&
                                        eachData.node.programs.edges.map((item) => {
                                            return (
                                                <div className="flex flex-col">
                                                    <span className="">{item?.node?.name}</span>
                                                </div>
                                            );
                                        })}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

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

    const refetch = (subdivisionId, houseId, productId) => {
        setRefetchSubdivisions([...refetchSubdivisions, subdivisionId]);
        setRefetchProductIds([...refetchProductIds, productId?.[0]]);
        setRefetchHouses([...refetchHouses, houseId]);
        setKey(key + 1);
    };

    const debouncedValue = useDebounce(searchString, 160);

    useEffect(() => {
        rebateReportDataManipulation();
        // eslint-disable-next-line
    }, [rebateReportData, debouncedValue, productSearchBoolean]);

    useEffect(() => {
        let data;
        if (refetchSubdivisions?.[key] && refetchHouses?.[key] && refetchProductIds?.[key] && key > -1) {
            data = rebateReportData?.ProductsFromOrganization?.filter(
                (item) =>
                    !(
                        parseInt(refetchSubdivisions?.[key]) === parseInt(item?.house_subdivision_id) &&
                        parseInt(refetchHouses?.[key]) === parseInt(item?.house_id) &&
                        parseInt(refetchProductIds?.[key]) === parseInt(item?.product_id)
                    )
            );
            setRebateReportData({ ...rebateReportData, ProductsFromOrganization: data });
        }
        // eslint-disable-next-line
    }, [key, refetchSubdivisions, refetchProductIds, refetchHouses]);

    const rebateReportDataManipulation = () => {
        let filteredDataWithHouseId;
        filteredDataWithHouseId =
            searchString?.length > 0
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
        getBundles();
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

    const accordianDataClick = (data) => {
        setAccordianDataClickData(data.products.edges);
        setEdit(false);
    };

    const addProducts = (eachData) => {
        if (!activeProducts.includes(parseInt(eachData.node.id))) {
            setProductsPerBundle((productPerBundle) => [...productPerBundle, eachData]);
            setActiveProducts((activeProducts) => [...activeProducts, parseInt(eachData.node.id)]);
        }
    };

    useEffect(() => {
        let propertyWithoutAddress = false;
        let propertyBelongToSingleBuild = false;
        for (var i = 0; i < activeAddresses?.length; i++) {
            if (!activeAddresses[i]?.address) {
                propertyWithoutAddress = true;
                break;
            }
        }

        for (let i = 0; i < activeAddresses?.length; i++) {
            if (activeAddresses[i]?.subdivisionName === "Single Build" && !activeAddresses[i]?.address) {
                propertyBelongToSingleBuild = true;
                break;
            }
        }

        let actualAddresses = activeAddresses
            // eslint-disable-next-line
            ?.map((item) => {
                if (!item?.address) {
                    return item;
                }
            })
            ?.filter((item) => item !== undefined);

        setPropertyWithoutAddress(actualAddresses);
        if (actualAddresses?.length > 0) {
            let object = {};
            let errors = {};

            actualAddresses?.forEach((item) => {
                object[item?.id] = item;
                let insideObject = {};
                if (!item?.address) {
                    insideObject.address = true;
                }
                if (!item?.city) {
                    insideObject.city = true;
                }
                if (!item?.zip_postal) {
                    insideObject.zip_postal = true;
                }
                errors[item?.id] = insideObject;
            });
            setAddressErrors(errors);
            setTableAddresses(object);
        }
        productPerBundle?.forEach((item) => {
            if (
                item?.node?.programs?.edges?.[0]?.node?.lot_and_address_requirement === "ADDRESS_ONLY" &&
                propertyWithoutAddress
            ) {
                setDoINeedToAddAddress(true);
            } else {
                setDoINeedToAddAddress(false);
            }

            if (
                item?.node?.programs?.edges?.[0]?.node?.lot_and_address_requirement ===
                    "ADDRESS_OR_LOT_WITH_SUBDIVISION" &&
                propertyBelongToSingleBuild
            ) {
                setDoINeedToHaveDiffSubdivision(true);
            } else {
                setDoINeedToHaveDiffSubdivision(false);
            }
        });
    }, [productPerBundle, activeAddresses]);

    const addressRequirementContent = () => {
        return (
            <div>
                <p className="text-secondary  px-4 mb-3">
                    {" "}
                    <span className="text-brickRed">* </span>This program requires an address, city and zip/postal code.
                </p>
                {tableData()}
            </div>
        );
    };

    useEffect(() => {
        if (doINeedToAddAddress) {
            setShowAddressRequirementModal(true);
        } else {
            setShowAddressRequirementModal(false);
        }
    }, [doINeedToAddAddress]);

    useEffect(() => {
        if (doINeedToHaveDiffSubdivision) {
            setShowSubdivisionRequirementModal(true);
        } else {
            setShowSubdivisionRequirementModal(false);
        }
    }, [doINeedToHaveDiffSubdivision]);

    const handleModalClose = () => {
        setShowAddressRequirementModal(false);
        setModalConfirmation(false);
        discardAction();
    };

    const getPropetyWithoutAddressMutationObject = (items) => {
        let array = [];
        items?.forEach((item) => {
            let object = {};
            let { id, state, name, subdivisionId, subdivisionName, __typename, ...spread } = item;
            object.id = item?.id;
            object.input = spread;
            array.push(object);
        });
        return array;
    };

    const [updateHouses] = useMutation(UPDATE_HOUSES, {
        variables: {
            houses: getPropetyWithoutAddressMutationObject(tableAddresses && Object.values(tableAddresses)),
        },
        update(cache, result) {
            setShowAddressRequirementModal(false);
            setModalConfirmation(false);
            getReport();
            let array = [...(tableAddresses && Object?.values(tableAddresses)), ...activeAddresses];
            let items = [];

            var d = array
                ?.map((item) => {
                    if (!items?.includes(item?.id)) {
                        items?.push(item?.id);
                        return item;
                    } else {
                        // eslint-disable-next-line
                        return;
                    }
                })
                ?.filter((element) => element !== undefined);
            setActiveAddresses(d);
        },
    });

    const discardAction = () => {
        let newArray = activeAddresses.filter((el) => !propertyWithoutAddress.find((rm) => rm.id === el.id));
        setActiveAddresses(newArray);
        setModalConfirmation(false);
        setShowSubdivisionRequirementModal(false);
        setShowAddressRequirementModal(false);
    };

    const addressRequireModal = () => {
        return (
            <>
                <Modal
                    title={`Assign Products`}
                    Content={modalConfirmation ? confirmModalContent() : addressRequirementContent()}
                    submitLabel="Remove"
                    onSubmit={() => (modalConfirmation ? discardAction() : updateHouses())}
                    onClose={() => (modalConfirmation ? handleModalClose() : setModalConfirmation(true))}
                    extraLabelColor="brickRed"
                    extraLabel="Back"
                    extraActionButton={modalConfirmation}
                    extraAction={() => setModalConfirmation(false)}
                    show={showAddressRequirementModal}
                    width={modalConfirmation ? "2xl" : "7xl"}
                    disabled={isThereAnyAddressError() && !modalConfirmation}
                />
            </>
        );
    };

    const handleSubdivisionRequirementMutation = () => {
        disconnectHouses();
    };

    const [disconnectHouses] = useMutation(DISCONNECT_HOUSES, {
        variables: {
            id: propertyWithoutAddress?.[0]?.subdivisionId,
            houses: propertyWithoutAddress?.map((item) => item?.id),
        },
        update(cache, result) {
            createSubdivisionAndConnectHouses();
        },
    });

    const [createSubdivisionAndConnectHouses] = useMutation(CREATE_SUBDIVISION_AND_CONNECT_HOUSES, {
        variables: {
            name: subdivisionName,
            organization_id: organizationId,
            houses: propertyWithoutAddress?.map((item) => item?.id),
        },
        update(cache, result) {
            getReport();
            setShowSubdivisionRequirementModal(false);
            setModalConfirmation(false);

            let arrayFromResult = [];
            result?.data?.createSubdivision?.houses?.edges?.forEach((item) => {
                let object = {};
                object = { ...item?.node };
                object.subdivisionName = item?.node?.subdivisionName
                    ? item?.node?.subdivisionName
                    : item?.node?.subdivision?.name;
                object.subdivisionId = item?.node?.subdivisionId
                    ? item?.node?.subdivisionId
                    : item?.node?.subdivision?.id;
                arrayFromResult.push(object);
            });

            let array = [...arrayFromResult, ...activeAddresses];
            let items = [];

            var d = array
                ?.map((item) => {
                    if (!items?.includes(item?.id)) {
                        items?.push(item?.id);
                        return item;
                    } else {
                        // eslint-disable-next-line
                        return;
                    }
                })
                ?.filter((element) => element !== undefined);
            setActiveAddresses(d);
        },
    });

    const subdivisionRequirementContent = () => {
        return (
            <div className="px-4">
                <p className="text-secondary  px-4 mb-3">
                    {" "}
                    This program requires an address if it is part of Single Build. Either create a new subdivision to
                    move {propertyWithoutAddress?.length > 1 ? "these addresses" : "this address"} or Go to{" "}
                    <Link className="text-secondary font-medium" to="/reporting/addresses">
                        Addresses
                    </Link>{" "}
                    to complete the address requirements.
                </p>
                <div className="flex flex-row justify-between w-full">
                    <div className=" flex flex-col px-4 pb-5 sm:col-span-2 w-full">
                        <TextField
                            autoFocus={true}
                            labelClass
                            parentClass="flex items-center space-x-10"
                            id="name"
                            label="Name Your Subdivision"
                            name="name"
                            value={subdivisionName}
                            onChange={(e) => setSubdivisionName(e.target.value)}
                            placeholder="Subdivision Name"
                            type="text"
                        />
                    </div>
                </div>
            </div>
        );
    };

    const findUniqueProductCount = (products) => {
        let productCodes = [];
        products?.forEach((item) => {
            if (!productCodes?.includes(item?.node?.bbg_product_code)) {
                productCodes?.push(item?.node?.bbg_product_code);
            }
        });
        let count = productCodes?.length;
        if (count > 0) {
            return count;
        }
        return 0;
    };

    const subdivisionModal = () => {
        return (
            <>
                <Modal
                    title={`Assign Products`}
                    Content={modalConfirmation ? confirmModalContent() : subdivisionRequirementContent()}
                    submitLabel={modalConfirmation ? "Remove" : "Confirm"}
                    onSubmit={() => (modalConfirmation ? discardAction() : handleSubdivisionRequirementMutation())}
                    onClose={() => (modalConfirmation ? handleModalClose() : setModalConfirmation(true))}
                    extraLabelColor="brickRed"
                    extraLabel="Back"
                    extraActionButton={modalConfirmation}
                    extraAction={() => setModalConfirmation(false)}
                    show={showSubdivisionRequirementModal}
                    width={modalConfirmation ? "2xl" : "7xl"}
                    disabled={!subdivisionName && !modalConfirmation}
                />
            </>
        );
    };

    const handleRowChange = (id, e) => {
        const { name, value } = e.target;
        if (tableAddresses) {
            setTableAddresses({
                ...tableAddresses,
                [id]: {
                    ...tableAddresses[id],
                    [name]: value,
                },
            });
        } else {
            setTableAddresses({
                ...tableAddresses,
                [id]: {
                    [name]: value,
                },
            });
        }

        if ((name === "address" || name === "city" || name === "zip_postal") && value?.length === 0) {
            if (addressErrors) {
                setAddressErrors({
                    ...addressErrors,
                    [id]: {
                        ...addressErrors[id],
                        [name]: true,
                    },
                });
            } else {
                setAddressErrors({
                    ...addressErrors,
                    [id]: {
                        [name]: true,
                    },
                });
            }
        } else {
            if (addressErrors) {
                setAddressErrors({
                    ...addressErrors,
                    [id]: {
                        ...addressErrors[id],
                        [name]: false,
                    },
                });
            } else {
                setAddressErrors({
                    ...addressErrors,
                    [id]: {
                        [name]: false,
                    },
                });
            }
        }
    };

    const modifiers = {
        selected: manualCODate[0],
    };

    const modifiersStyles = {
        selected: {
            color: "white",
            backgroundColor: "#003166",
        },
        selectedclockStart: {
            color: "white",
            backgroundColor: "#003166",
        },
    };

    const CustomOverlay = ({ classNames, selectedDay, children, ...props }) => {
        return (
            <div className={classNames.overlayWrapper} {...props}>
                <div className={classNames.overlay + "relative"}>{children}</div>
            </div>
        );
    };

    const manualTableData = () => {
        return propertyWithoutAddress?.map((item) => {
            return (
                <tr className="">
                    <td className="pl-4 py-4 whitespace-nowrap text-sm text-gray-500 w-16 align-top">
                        <input
                            style={{ maxWidth: "5rem" }}
                            type="text"
                            name="lot_number"
                            id="lot_number"
                            value={tableAddresses?.[item?.id]?.lot_number}
                            onChange={(e) => handleRowChange(item?.id, e)}
                            className="focus:outline-none input-no-error sm:text-sm  rounded-md"
                            placeholder="Lot #"
                        />
                    </td>
                    <td className="pl-4 py-4 whitespace-nowrap text-sm text-gray-500 flex flex-col relative">
                        <input
                            type="text"
                            name="address"
                            id="address"
                            value={tableAddresses?.[item?.id]?.address}
                            onChange={(e) => handleRowChange(item?.id, e)}
                            className={`focus:outline-none  ${
                                addressErrors?.[item?.id]?.address ? "input-error" : "input-no-error"
                            }   sm:text-sm  rounded-md`}
                            placeholder="123 Fake Street"
                        />
                        {addressErrors?.[item?.id]?.address ? (
                            <span className="text-brickRed text-xs absolute bottom-0">Address is required</span>
                        ) : null}
                    </td>
                    <td className="pl-4 py-4 whitespace-nowrap text-sm text-gray-500  align-top">
                        <input
                            style={{ maxWidth: "6rem" }}
                            type="text"
                            name="address2"
                            id="address2"
                            value={tableAddresses?.[item?.id]?.address2}
                            onChange={(e) => handleRowChange(item?.id, e)}
                            className="focus:outline-none input-no-error w-20   sm:text-sm  rounded-md"
                            placeholder="Unit 123"
                        />
                    </td>
                    <td className="pl-4 py-4 whitespace-nowrap text-sm text-gray-500 flex flex-col relative">
                        <input
                            style={{ maxWidth: "11rem" }}
                            type="text"
                            name="city"
                            id="city"
                            value={tableAddresses?.[item?.id]?.city}
                            onChange={(e) => handleRowChange(item?.id, e)}
                            className={`focus:outline-none ${
                                addressErrors?.[item?.id]?.city ? "input-error" : "input-no-error"
                            } w-full sm:text-sm  rounded-md`}
                            placeholder="Windsor"
                        />
                        {addressErrors?.[item?.id]?.city ? (
                            <span className="text-brickRed text-xs absolute bottom-0">City is required</span>
                        ) : null}
                    </td>
                    <td className="pl-4 py-4 whitespace-nowrap text-sm text-gray-500  align-top">
                        <div className="flex">
                            <div className="w-32 mt-3">{tableAddresses?.[item?.id]?.state?.name}</div>
                        </div>
                    </td>

                    <td className="pl-4 py-4 whitespace-nowrap text-sm text-gray-500 flex flex-col relative">
                        <input
                            type="text"
                            name="zip_postal"
                            id="zip_postal"
                            value={tableAddresses?.[item?.id]?.zip_postal}
                            onChange={(e) => handleRowChange(item?.id, e)}
                            className={`focus:outline-none ${
                                addressErrors?.[item?.id]?.zip_postal ? "input-error" : "input-no-error"
                            } w-20 sm:text-sm  rounded-md `}
                            placeholder="90210"
                        />
                        {addressErrors?.[item?.id]?.zip_postal ? (
                            <span className="text-brickRed text-xs absolute bottom-0">Zip/Postal is required</span>
                        ) : null}
                    </td>
                    <td className="pl-4 py-4 whitespace-nowrap text-sm text-gray-500  align-top">
                        <DayPickerInput
                            value={manualCODate[item?.id] ? manualCODate[item?.id] : new Date()}
                            inputProps={{
                                style: {
                                    border: "1px solid rgba(212, 212, 216,1)",
                                    borderRadius: "0.375rem",
                                    padding: "0.5rem 0.75rem",
                                    width: "130px",
                                    fontSize: ".875rem",
                                    cursor: "pointer",
                                },
                            }}
                            overlayComponent={CustomOverlay}
                            dayPickerProps={{
                                modifiers: modifiers,
                                modifiersStyles: modifiersStyles,
                            }}
                            onDayChange={(date) => {
                                setManualCODate({ [item?.id]: date });
                                if (tableAddresses) {
                                    setTableAddresses({
                                        ...tableAddresses,
                                        [item?.id]: {
                                            ...tableAddresses[item?.id],
                                            confirmed_occupancy: date.toISOString().substr(0, 10),
                                        },
                                    });
                                } else {
                                    setTableAddresses({
                                        ...tableAddresses,
                                        [item?.id]: {
                                            confirmed_occupancy: date.toISOString().substr(0, 10),
                                        },
                                    });
                                }
                            }}
                        />
                    </td>
                    <td className="pl-4 py-4 whitespace-nowrap text-sm text-gray-500  align-top">
                        <input
                            type="text"
                            name="model"
                            id="model"
                            value={tableAddresses?.[item?.id]?.model}
                            onChange={(e) => handleRowChange(item?.id, e)}
                            className="focus:outline-none input-no-error w-20  sm:text-sm  rounded-md"
                            placeholder="Modern"
                        />
                    </td>
                    <td className="pl-4 pr-4 py-4 whitespace-nowrap text-sm text-gray-500  align-top">
                        <input
                            type="text"
                            name="project_number"
                            id="project_number"
                            value={tableAddresses?.[item?.id]?.project_number}
                            onChange={(e) => handleRowChange(item?.id, e)}
                            className="focus:outline-none input-no-error w-24  sm:text-sm  rounded-md"
                            placeholder={APP_TITLE + "-123"}
                        />
                    </td>
                </tr>
            );
        });
    };

    const tableData = () => {
        return (
            <div className="flex flex-col">
                <div className="">
                    <div className="align-middle inline-block min-w-full">
                        <div className="shadow h-full border-gray-200 ">
                            <table className="min-w-full h-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr className="">
                                        <th
                                            scope="col"
                                            className={`${
                                                true === "csvFile" ? "pl-6" : "pl-5"
                                            } py-3 w-1/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                        >
                                            Lot #
                                        </th>
                                        <th
                                            scope="col"
                                            className={` ${
                                                true === "csvFile" ? "pl-6" : "pl-4"
                                            } py-3 w-2/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                        >
                                            Address <span className="text-brickRed">*</span>
                                        </th>
                                        <th
                                            scope="col"
                                            className={` ${
                                                true === "csvFile" ? "pl-6" : "pl-4"
                                            } py-3 w-1/12 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider`}
                                        >
                                            Unit
                                        </th>
                                        <th
                                            scope="col"
                                            className={`${
                                                true === "csvFile" ? "pl-6" : "pl-4"
                                            } py-3 w-2/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                        >
                                            City <span className="text-brickRed">*</span>
                                        </th>
                                        <th
                                            scope="col"
                                            className={`${
                                                true === "csvFile" ? "pl-6" : "pl-4"
                                            } py-3 w-1/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                        >
                                            State/Province
                                        </th>
                                        <th
                                            scope="col"
                                            className={`${
                                                true === "csvFile" ? "pl-6" : "pl-4"
                                            } py-3 w-1/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                        >
                                            Zip/Postal <span className="text-brickRed">*</span>
                                        </th>
                                        <th
                                            scope="col"
                                            className={`${
                                                true === "csvFile" ? "pl-6" : "pl-4"
                                            } py-3 w-2/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                        >
                                            Confirm Occupancy
                                        </th>
                                        <th
                                            scope="col"
                                            className={`${
                                                true === "csvFile" ? "pl-6" : "pl-4"
                                            } py-3 w-1/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                        >
                                            Build Model
                                        </th>
                                        <th
                                            scope="col"
                                            className={`${
                                                true === "csvFile" ? "pl-6" : "pl-4"
                                            } py-3 w-1/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                        >
                                            Project #
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>{manualTableData()}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        setAccordianData(organizationNode?.organizations?.edges?.[0]?.node?.programs?.edges);
    }, [organizationNode]);

    const refusedContent = () => {
        return (
            <div className="flex flex-col flex-1 overflow-auto w-full">
                <p className="px-6 text-gray-500">The following items are already claimed.</p>
                <ul className="flex-0 w-full max-h-smallMin scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400  overflow-auto px-6 mt-2">
                    <div className="border rounded-lg border-t-none border-b-none">
                        {refusedChanges?.map((eachData) => {
                            return (
                                <div className="flex rounded-lg rounded-b-none py-1 items-center">
                                    <div className="flex  text-sm px-2 space-x-1">
                                        {eachData?.house?.lot_number ? (
                                            <p className=" text-gray-500">{eachData?.house?.lot_number}</p>
                                        ) : null}

                                        <p className=" text-gray-500">{eachData?.house?.address}</p>
                                    </div>
                                    {" - "}
                                    <div className="flex  text-sm px-2 space-x-1">
                                        {eachData?.product?.node?.bbg_product_code ? (
                                            <p className=" text-gray-500">
                                                {eachData?.product?.node?.bbg_product_code}
                                            </p>
                                        ) : null}
                                        <p className=" text-gray-500">{eachData?.product?.node?.name}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ul>
            </div>
        );
    };

    const addSubdivisionContent = () => {
        return (
            <div className="flex flex-col flex-1 overflow-auto w-full">
                <p className="px-6 text-gray-500">
                    You are about to assign{" "}
                    {dataFormat(productPerBundle)?.length > 1
                        ? dataFormat(productPerBundle)?.length + " products"
                        : dataFormat(productPerBundle)?.length + " product"}{" "}
                    to{" "}
                    {activeAddresses?.length > 1
                        ? activeAddresses?.length + " properties"
                        : activeAddresses?.length + " property"}{" "}
                    in{" "}
                    {formatModalAddresses()?.length > 1
                        ? formatModalAddresses()?.length + " subdivisions"
                        : formatModalAddresses()?.length + " subdivision"}
                    .
                </p>
                <ul className="flex-0 w-full max-h-smallMin scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400  overflow-auto px-6 mt-2">
                    <div className="border rounded-lg border-t-none border-b-none">
                        {formatModalAddresses()?.map((eachData) => {
                            return (
                                <div className="flex flex-col rounded-lg rounded-b-none border-b ">
                                    <p className="text-gray-500 font-semibold px-4 py-1">
                                        {" "}
                                        {eachData?.subdivisionName}{" "}
                                    </p>
                                    <ul className="">
                                        {eachData?.houses?.map((item) => {
                                            return (
                                                <li className={` transition-all px-4  border-b py-1`}>
                                                    <div className="flex flex-col items-start text-sm px-2 w-full">
                                                        {item.lot_number ? (
                                                            <p className=" text-gray-500">Lot: {item.lot_number}</p>
                                                        ) : null}

                                                        {item?.address2 !== null && item?.address2?.trim() !== "" ? (
                                                            <div className="flex  justify-between w-full">
                                                                <p className=" text-gray-500">
                                                                    {item.address2} - {item.address}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <p className=" text-gray-500">{item.address}</p>
                                                        )}
                                                        {item.project_number ? (
                                                            <p className="text-gray-500 text-xs">
                                                                Project: {item.project_number}
                                                            </p>
                                                        ) : null}
                                                        {item.model ? (
                                                            <p className="text-gray-500 capitalize text-xs">
                                                                Build Model: {item.model}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </ul>
            </div>
        );
    };

    const formatModalAddresses = () => {
        let added = [];
        let formattedActiveAddresses = [];
        // eslint-disable-next-line
        activeAddresses?.map((item) => {
            if (!added.includes(item?.subdivisionId)) {
                let object = {};
                added.push(item?.subdivisionId);
                object.subdivisionName = item?.subdivisionName;
                object.subdivisionId = item?.subdivisionId;
                object.houses = [
                    {
                        address: item?.address,
                        lot_number: item?.lot_number,
                        address2: item?.address2,
                        model: item?.model,
                    },
                ];
                formattedActiveAddresses.push(object);
            } else {
                let index = formattedActiveAddresses.findIndex(
                    (element) => element.subdivisionId === item?.subdivisionId
                );
                if (index > -1) {
                    formattedActiveAddresses[index] = {
                        ...formattedActiveAddresses[index],
                        houses: [
                            ...formattedActiveAddresses[index]?.houses,
                            {
                                address: item?.address,
                                lot_number: item?.lot_number,
                                address2: item?.address2,
                                model: item?.model,
                            },
                        ],
                    };
                }
            }
        });
        return formattedActiveAddresses;
    };

    const modal = () => {
        return (
            <>
                <Modal
                    title={`Assign Products`}
                    Content={addSubdivisionContent()}
                    submitLabel="Confirm"
                    onSubmit={() => {
                        reportManipulatedObject?.id ? updateReport() : createReport();
                    }}
                    onClose={() => setShowModal(false)}
                    show={showModal}
                    width={"2xl"}
                />
            </>
        );
    };

    const isThereAnyAddressError = () => {
        let errors = addressErrors && Object?.values(addressErrors);
        let error = false;
        errors?.forEach((item) => {
            if (item?.address || item?.city || item?.zip_postal) {
                error = true;
            }
        });

        return error;
    };

    const confirmModalContent = () => {
        return (
            <div className="flex flex-col px-6">
                <p className="text-xl font-body text-darkGray">
                    As your Program requires a complete Address, please confirm you would like to remove{" "}
                    {propertyWithoutAddress?.length > 1 ? "these addresses" : "this address"} from your selection, or
                    click Back to continue editing.
                </p>
            </div>
        );
    };

    const refusedModal = () => {
        return (
            <>
                <Modal
                    title={`House-Products already claimed`}
                    Content={refusedContent()}
                    submitLabel="Confirm"
                    onSubmit={() => {
                        setShowRefusedModal(false);
                        setActiveAddresses([]);
                    }}
                    onClose={() => setShowRefusedModal(false)}
                    show={showRefusedModal}
                    width={"2xl"}
                />
            </>
        );
    };

    const handleBundle = (node) => {
        setActiveId(node.id);
        setActive((active) => [...active, parseInt(node.id)]);
        setEdit(false);
        setFields({});
        getProducts();
    };

    // eslint-disable-next-line
    const lastProgramElement = useCallback((node) => {
        if (programObserver.current) programObserver.current.disconnect();
        programObserver.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && bundles.bundles.pageInfo.hasNextPage) {
                fetchMoreBundles({
                    variables: {
                        first,
                        after: bundles.bundles.pageInfo.endCursor,
                    },
                });
            }
        });
        if (node) programObserver.current.observe(node);
    });

    const [getBundles, { data: bundles, fetchMore: fetchMoreBundles, loading: bundlesLoading }] = useLazyQuery(
        FETCH_BUNDLES_QUERY,
        {
            notifyOnNetworkStatusChange: false,
            fetchPolicy: "cache-and-network",
        }
    );

    const [getProducts, { data: products }] = useLazyQuery(FETCH_PRODUCTS_PER_BUNDLE, {
        variables: {
            id: parseInt(activeId),
            first: 200000,
        },
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange: false,
        onCompleted: () => {
            setProductsPerBundle([...productPerBundle, ...products.bundle.products.edges]);

            let array2 = products.bundle.products.edges.map((item) => parseInt(item.node.id));
            setActiveProducts(() => products.bundle.products.edges.map((item) => parseInt(item.node.id)));
            var result = activeProducts.filter(function (n) {
                return array2.indexOf(n) > -1;
            });
            setEffectActiveProducts(result);
            handleFields(products?.bundle?.products?.edges);
            setAnimate(true);
        },
    });

    const handleFields = (array) => {
        let object = {};
        array?.forEach((item) => {
            object[item?.node?.id] = item?.node?.bundlePivot?.product_quantity;
        });

        setFields(object);
    };

    const findRefusedChangesModel = (items) => {
        let array = [];
        items?.forEach((item) => {
            let object = {};
            let product = productPerBundle?.find((product) => product?.node?.id === item?.product);
            let house = activeAddresses?.find((address) => address.id === item.house);
            object.product = product;
            object.house = house;
            array.push(object);
        });
        return array;
    };

    useEffect(() => {
        if (animate === true) {
            setTimeout(function () {
                setAnimate(false);
            }, 2000);
        }
    }, [effectActiveProducts, animate]);

    const handleQuantityChange = (eachPackage, e) => {
        setEdit(true);
        setFields({
            ...fields,
            [parseInt(eachPackage.node.id)]: e.target.value,
        });
        setProductNode(eachPackage);
    };

    useEffect(() => {
        if (
            fields?.[parseInt(productNode?.node?.id)] < productNode?.node?.minimum_unit &&
            productNode?.node?.minimum_unit !== null &&
            productNode?.node?.require_quantity_reporting
        ) {
            setError({ ...error, [parseInt(productNode?.node?.id)]: true });
        } else if (
            !fields?.[parseInt(productNode?.node?.id)] &&
            productNode?.node?.minimum_unit !== null &&
            productNode?.node?.require_quantity_reporting
        ) {
            setError({ ...error, [parseInt(productNode?.node?.id)]: true });
        } else if (productNode?.node?.require_quantity_reporting && !fields?.[parseInt(productNode?.node?.id)]) {
            setError({ ...error, [parseInt(productNode?.node?.id)]: true });
        } else {
            setError({ ...error, [parseInt(productNode?.node?.id)]: false });
        }
        // eslint-disable-next-line
    }, [fields, productPerBundle, productNode]);

    const removeFromBundle = async (id) => {
        setProductsPerBundle((productPerBundle) => productPerBundle.filter((item) => item.node.id !== id));
        setActiveProducts((activeProducts) => activeProducts.filter((item) => item !== parseInt(id)));
    };

    const getUniqueProducts = () => {
        const Ids = productPerBundle.map((item) => item.node.id);
        const filtered = productPerBundle.filter((item, index) => !Ids.includes(item.node.id, index + 1));

        return filtered;
    };

    const dataFormat = () => {
        let array = [];
        let productIds = [];

        productPerBundle &&
            productPerBundle.length > 0 &&
            // eslint-disable-next-line
            productPerBundle.map((item) => {
                if (!productIds?.includes(item?.node?.id)) {
                    let object = {};
                    object.id = parseInt(item.node.id);
                    object.quantity =
                        fields && fields[item.node.id]
                            ? parseInt(fields[item.node.id])
                            : item.node.bundlePivot && item.node.bundlePivot.product_quantity;
                    array.push(object);
                    productIds.push(item?.node?.id);
                }
            });
        return array;
    };

    const revealSearch = (type) => {
        if (type === true) {
            setShowSearch(true);
        } else {
            //setShowSearch(false);
        }
    };

    const [createReport, { loading: createReportLoading }] = useMutation(CREATE_REBATE_REPORT, {
        variables: {
            houses: activeAddresses?.map((item) => parseInt(item.id)),
            products: dataFormat(),
            organization: organizationId,
        },
        update(cache, result) {
            setActiveAddresses([]);
            getReport();
            window.location.reload(false);
            setShowModal(false);
            setCloseAccordian(false);
        },
    });

    const [updateReport, { loading: updateReportLoading }] = useMutation(UPDATE_REBATE_REPORT, {
        variables: {
            id: parseInt(reportManipulatedObject?.id),
            houses: activeAddresses?.map((item) => parseInt(item.id)),
            products: dataFormat(),
        },
        update(cache, result) {
            //setCloseAccordian(false);
            let addressLength = activeAddresses.length;
            let productLength = productPerBundle.length;
            if (result?.data?.updateRebateReportAndMassAssign?.refusedChanges?.length > 0) {
                setRefusedChanges(
                    findRefusedChangesModel(result?.data?.updateRebateReportAndMassAssign?.refusedChanges)
                );
                setShowRefusedModal(true);
            } else {
                toast.success(
                    `Assigned ${productLength > 1 ? productLength + " Products" : productLength + " Product"} to  ${
                        addressLength > 1 ? addressLength + " Addresses" : addressLength + " Address"
                    } `
                );
                setActiveAddresses([]);
            }

            setShowModal(false);
            setRefetchProductIds([]);
            setRefetchSubdivisions([]);
            setRefetchHouses([]);
            setKey(-1);
            getReport();
        },
    });

    let uniqueArrayLength = [...new Set(activeAddresses)];

    const cleanUpAction = () => {
        setActiveAddresses([]);
        setProductsPerBundle([]);
        setActiveProducts([]);
        getReport();
    };

    const debouncedValue1 = useDebounce(productSearchString, 160);

    useEffect(() => {
        if (productSearchString.trim().length > 1 && productSearch === true) {
            searchProducts({
                variables: {
                    search: debouncedValue1,
                },
            });
        }
        // eslint-disable-next-line
    }, [debouncedValue1]);

    const [searchProducts, { data: searchedProducts, loading: searchedLoading }] = useLazyQuery(SEARCH_PRODUCTS, {
        notifyOnNetworkStatusChange: false,
        onCompleted: () => {},
    });

    const isError = () => {
        let finalError = false;
        // eslint-disable-next-line
        productPerBundle?.map((item) => {
            if (error?.[item?.node?.id]) {
                finalError = true;
            }
        });
        return finalError;
    };

    return (
        <div className="min-h-smallMin  max-w-8xl flex flex-col h-full gap-5 w-8xl mx-auto px-4 sm:px-6 lg:px-32">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Assign Products</title>
            </Helmet>

            <div className=" bg-white rounded-lg py-4 px-4 h1 flex">
                <p>Assign Products </p>

                <HelperModal type={"assignment"} title="Product Assignment Information" />
            </div>
            <div className="flex flex-row space-x-5  overflow-auto" style={{ minHeight: "79vh", maxHeight: "79vh" }}>
                <div className=" w-full max-w-sm">
                    <div className="inset-0 bg-white  rounded-lg h-full flex flex-col">
                        <div className="flex justify-between w-full   items-center">
                            <SwitchButton
                                wFull
                                type="select"
                                option1="bundles"
                                option2="products"
                                label1="Bundles"
                                label2="Products"
                            />
                        </div>

                        <div className="flex  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 w-full h-full">
                            <div className="w-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                {enabled === "products" ? (
                                    <Transition
                                        show={showSearch}
                                        enter="transition ease-out duration-1000"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <div className="py-3 flex rounded-md border-b">
                                            <div className="relative flex flex-col justify-between items-center w-full px-4 focus-within:z-10">
                                                <input
                                                    onChange={(e) => {
                                                        setProductSearchString(e.target.value);
                                                        if (productSearchString.trim().length > 1) {
                                                            setProductSearch(true);
                                                        }
                                                    }}
                                                    type="text"
                                                    name="productSearchString"
                                                    id="productSearchString"
                                                    className="focus:ring-secondary focus:border-secondary block rounded-lg w-full sm:text-sm "
                                                    placeholder="Fast Add"
                                                    value={productSearchString}
                                                />
                                                {productSearch && productSearchString?.trim().length > 0 ? (
                                                    <div className="  m-5 mt-3 w-full max-h-96  mb-1  bg-white overflow-auto  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                                                        {searchedLoading ? (
                                                            <div className="border rounded-lg">
                                                                <Loader />
                                                            </div>
                                                        ) : searchedProducts?.searchProducts?.edges?.length === 0 ? (
                                                            <div className="border rounded-lg py-2 px-2 text-secondary font-title font-semibold flex items-center justify-between">
                                                                <p> No Results Found </p>
                                                                <span
                                                                    className="underline cursor-pointer text-brickRed"
                                                                    onClick={() => {
                                                                        setProductSearchString("");
                                                                        setProductSearch(false);
                                                                    }}
                                                                >
                                                                    {" "}
                                                                    Reset{" "}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className={`${
                                                                    searchedProducts?.searchProducts?.edges?.length > 0
                                                                        ? "border rounded-lg "
                                                                        : ""
                                                                }`}
                                                            >
                                                                {searchedProducts?.searchProducts?.edges?.length > 0 &&
                                                                    searchedProducts?.searchProducts?.edges.map(
                                                                        (item) => {
                                                                            if (item?.node?.deleted_at) return null;
                                                                            let allProgramsAreArchived = false;
                                                                            let programsCount = 0;
                                                                            item?.node?.programs?.edges?.forEach(
                                                                                (program) => {
                                                                                    if (program?.node?.deleted_at) {
                                                                                        programsCount =
                                                                                            programsCount + 1;
                                                                                    }
                                                                                    if (
                                                                                        programsCount ===
                                                                                        item?.node?.programs?.edges
                                                                                            ?.lenght
                                                                                    ) {
                                                                                        allProgramsAreArchived = true;
                                                                                    }
                                                                                }
                                                                            );
                                                                            if (allProgramsAreArchived) return null;
                                                                            return (
                                                                                <div
                                                                                    className="flex items-center w-full py-4 border-b cursor-pointer"
                                                                                    onClick={() => {
                                                                                        setProductNode(item);
                                                                                        addProducts(item);
                                                                                        setProductSearchString("");
                                                                                        setProductSearch(false);
                                                                                    }}
                                                                                >
                                                                                    <div className="min-w-0 flex-1 flex">
                                                                                        <div className=" flex-1 px-2 flex justify-between md:gap-4 items-center">
                                                                                            <div className="flex flex-col items-start">
                                                                                                <div className="flex flex-col text-xs text-gray-500 italic">
                                                                                                    {item.node
                                                                                                        .category &&
                                                                                                        item.node
                                                                                                            .category
                                                                                                            .name}
                                                                                                </div>
                                                                                                <div className="group relative   flex justify-between items-center">
                                                                                                    <p className="text-sm font-semibold text-gray-500">
                                                                                                        <Link
                                                                                                            to="#"
                                                                                                            className="  focus:outline-none"
                                                                                                        >
                                                                                                            <span
                                                                                                                className="absolute inset-0"
                                                                                                                aria-hidden="true"
                                                                                                            ></span>
                                                                                                            {item.node
                                                                                                                .bbg_product_code
                                                                                                                ? item
                                                                                                                      .node
                                                                                                                      .bbg_product_code +
                                                                                                                  " - "
                                                                                                                : ""}
                                                                                                            {
                                                                                                                item
                                                                                                                    .node
                                                                                                                    .name
                                                                                                            }
                                                                                                        </Link>
                                                                                                    </p>
                                                                                                </div>
                                                                                                <div className=" flex flex-col text-xs text-gray-500">
                                                                                                    {item.node &&
                                                                                                        item.node
                                                                                                            .programs &&
                                                                                                        item.node
                                                                                                            .programs
                                                                                                            .edges
                                                                                                            .length >
                                                                                                            0 &&
                                                                                                        item.node.programs.edges.map(
                                                                                                            (
                                                                                                                program
                                                                                                            ) => {
                                                                                                                return (
                                                                                                                    <div className="flex flex-col">
                                                                                                                        <span className="">
                                                                                                                            {
                                                                                                                                program
                                                                                                                                    .node
                                                                                                                                    .name
                                                                                                                            }
                                                                                                                        </span>
                                                                                                                        <span className="text-brickRed">
                                                                                                                            {program
                                                                                                                                ?.node
                                                                                                                                ?.deleted_at &&
                                                                                                                                " Archived"}
                                                                                                                        </span>
                                                                                                                    </div>
                                                                                                                );
                                                                                                            }
                                                                                                        )}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="text-secondary">
                                                                                                {productPerBundle?.findIndex(
                                                                                                    (element) =>
                                                                                                        parseInt(
                                                                                                            element
                                                                                                                ?.node
                                                                                                                ?.id
                                                                                                        ) ===
                                                                                                        parseInt(
                                                                                                            item?.node
                                                                                                                ?.id
                                                                                                        )
                                                                                                ) === -1 ? (
                                                                                                    <PlusCircleIcon className="w-8 h-8 text-brickGreen cursor-pointer mr-2" />
                                                                                                ) : (
                                                                                                    "Added"
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </Transition>
                                ) : null}
                                {ProductAssignlist.length === 0 ? (
                                    <div className="flex flex-col items-center">
                                        <p className="text-secondary font-md  mt-10 font-semibold">
                                            Reporting is fast and easy using bundles
                                        </p>
                                        <Button color="primary" title="Create Bundles" />
                                    </div>
                                ) : enabled === "bundles" ? (
                                    <ul className=" flex-0 w-full h-full overflow-auto">
                                        {searchedBundles !== true ? null : bundlesLoading ? (
                                            <Loader />
                                        ) : (
                                            bundles &&
                                            bundles.bundles &&
                                            bundles.bundles.edges.length !== 0 &&
                                            bundles.bundles.edges.map((eachData, index) => {
                                                if (index === bundles.bundles.edges.length - 1) {
                                                    return (
                                                        <li
                                                            className={`  border-b transition-all  border-l-4    hover:border-l-6   ${
                                                                active.includes(parseInt(eachData.node.id)) ||
                                                                eachData?.node?.products?.edges
                                                                    .map((item) => parseInt(item.node.id))
                                                                    .some((val) =>
                                                                        productPerBundle
                                                                            ?.map((item) => parseInt(item?.node?.id))
                                                                            .includes(val)
                                                                    )
                                                                    ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                    : "text-darkgray75 border-l-primary"
                                                            }`}
                                                            onClick={() => handleBundle(eachData.node)}
                                                            ref={lastProgramElement}
                                                        >
                                                            <div className="relative flex flex-col py-2">
                                                                <div className="text-sm px-4 font-semibold ">
                                                                    <div className="focus:outline-none cursor-pointer">
                                                                        <span
                                                                            className="absolute inset-0"
                                                                            aria-hidden="true"
                                                                        ></span>
                                                                        {eachData.node.name}
                                                                    </div>
                                                                </div>
                                                                <div className=" flex flex-col text-xs px-4 text-secondary">
                                                                    (
                                                                    {findUniqueProductCount(
                                                                        eachData?.node?.products?.edges
                                                                    ) > 1
                                                                        ? findUniqueProductCount(
                                                                              eachData?.node?.products?.edges
                                                                          ) + " Product Codes"
                                                                        : findUniqueProductCount(
                                                                              eachData?.node?.products?.edges
                                                                          ) + " Product Code"}
                                                                    )
                                                                </div>
                                                            </div>
                                                        </li>
                                                    );
                                                }
                                                return (
                                                    <li
                                                        onClick={() => handleBundle(eachData.node)}
                                                        className={`  border-b transition-all  border-l-4    hover:border-l-6  ${
                                                            active.includes(parseInt(eachData.node.id)) ||
                                                            eachData?.node?.products?.edges
                                                                .map((item) => parseInt(item.node.id))
                                                                .some((val) =>
                                                                    productPerBundle
                                                                        ?.map((item) => parseInt(item?.node?.id))
                                                                        .includes(val)
                                                                )
                                                                ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                : "text-darkgray75 border-l-primary"
                                                        }`}
                                                    >
                                                        <div className="relative flex flex-col py-2">
                                                            <div className="text-sm px-4 font-semibold ">
                                                                <div className="focus:outline-none cursor-pointer">
                                                                    <span
                                                                        className="absolute inset-0"
                                                                        aria-hidden="true"
                                                                    ></span>
                                                                    {eachData.node.name}
                                                                </div>
                                                            </div>
                                                            <div className=" flex flex-col text-xs px-4 text-secondary">
                                                                (
                                                                {findUniqueProductCount(
                                                                    eachData?.node?.products?.edges
                                                                ) > 1
                                                                    ? findUniqueProductCount(
                                                                          eachData?.node?.products?.edges
                                                                      ) + " Product Codes"
                                                                    : findUniqueProductCount(
                                                                          eachData?.node?.products?.edges
                                                                      ) + " Product Code"}
                                                                )
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })
                                        )}
                                    </ul>
                                ) : (
                                    <div className="flex flex-col flex-1 overflow-auto w-full">
                                        <div className="flex flex-col h-full overflow-auto w-full">
                                            <div className="w-full    scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                <div className="grid grid-cols-1 gap-6 border-t border-b">
                                                    {active ? (
                                                        <BundleAccordion
                                                            revealSearch={revealSearch}
                                                            onClick={(data) => {
                                                                accordianDataClick(data.node);
                                                                setCloseAccordian(true);
                                                            }}
                                                            component={<AccordianComponent />}
                                                            selectedProducts={productPerBundle}
                                                            Data={
                                                                accordianData && accordianData.length > 0
                                                                    ? accordianData
                                                                    : null
                                                            }
                                                            closeAccordian={closeAccordian}
                                                        />
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white w-full max-w-md rounded-lg ">
                    <div className="h-full relative   lg:pr-0 xl:pr-3 2xl:pr-0">
                        <div className="inset-0    h-full flex flex-col">
                            <div className="flex px-4 flex-col md:flex-row justify-between items-center">
                                <p className="font-title  py-4 text-center h2">Products to Report</p>
                                {productPerBundle.length > 0 ? (
                                    <span
                                        className="mr-3 cursor-pointer text-brickRed font-bold font-title"
                                        onClick={() => {
                                            setProductsPerBundle([]);
                                            setActiveProducts([]);
                                            setEffectActiveProducts([]);
                                            setActive([]);
                                        }}
                                    >
                                        Clear
                                    </span>
                                ) : null}
                            </div>

                            <div className="flex flex-col flex-1 overflow-auto w-full">
                                <div className="flex flex-col h-full overflow-auto w-full">
                                    <div className="w-full border-t  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                        <ul className="flex-0 w-full  overflow-auto">
                                            {productPerBundle?.length > 0 ? (
                                                productPerBundle &&
                                                productPerBundle.length > 0 &&
                                                getUniqueProducts().map((eachPackage) => {
                                                    return (
                                                        <li
                                                            className={`border-b border-l-6 border-l-gold ${
                                                                effectActiveProducts.includes(
                                                                    parseInt(eachPackage.node.id)
                                                                ) && animate
                                                                    ? "animate-pulse"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <Link to="#" className="block hover:bg-gray-50">
                                                                <div className="flex items-center py-4 px-2">
                                                                    <div className="min-w-0 flex-1 flex">
                                                                        <div className="min-w-0 flex-1 px-2 md:grid md:grid-cols-2 md:gap-4 items-center">
                                                                            <div className="flex flex-col items-start">
                                                                                <div className="flex flex-col text-xs text-gray-500 italic">
                                                                                    {eachPackage.node.category &&
                                                                                        eachPackage.node.category.name}
                                                                                </div>
                                                                                <div className="group relative   flex justify-between items-center">
                                                                                    <p className="text-sm font-semibold text-gray-500">
                                                                                        <Link
                                                                                            to="#"
                                                                                            className="  focus:outline-none"
                                                                                        >
                                                                                            <span
                                                                                                className="absolute inset-0"
                                                                                                aria-hidden="true"
                                                                                            ></span>
                                                                                            {
                                                                                                eachPackage.node
                                                                                                    .bbg_product_code
                                                                                            }{" "}
                                                                                            {" - "}{" "}
                                                                                            {eachPackage.node.name}
                                                                                        </Link>
                                                                                    </p>
                                                                                </div>
                                                                                <div className=" flex flex-col text-xs text-gray-500">
                                                                                    {eachPackage.node &&
                                                                                        eachPackage.node.programs &&
                                                                                        eachPackage.node.programs.edges
                                                                                            .length > 0 &&
                                                                                        eachPackage.node.programs.edges.map(
                                                                                            (item) => {
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
                                                                            {eachPackage.node
                                                                                .require_quantity_reporting ? (
                                                                                <div>
                                                                                    <input
                                                                                        value={
                                                                                            fields &&
                                                                                            fields[eachPackage.node.id]
                                                                                                ? fields[
                                                                                                      eachPackage.node
                                                                                                          .id
                                                                                                  ]
                                                                                                : edit
                                                                                                ? fields[
                                                                                                      eachPackage.node
                                                                                                          .id
                                                                                                  ]
                                                                                                : eachPackage.node
                                                                                                      .bundlePivot &&
                                                                                                  eachPackage.node
                                                                                                      .bundlePivot
                                                                                                      .product_quantity
                                                                                        }
                                                                                        type="number"
                                                                                        onChange={(e) => {
                                                                                            handleQuantityChange(
                                                                                                eachPackage,
                                                                                                e
                                                                                            );
                                                                                        }}
                                                                                        name="productQuantity"
                                                                                        id="productQuantity"
                                                                                        autoComplete="productQuantity"
                                                                                        placeholder="Qty"
                                                                                        className={` ${
                                                                                            error?.[
                                                                                                eachPackage?.node?.id
                                                                                            ]
                                                                                                ? "input-error focus:border-brickRed border-brickRed"
                                                                                                : "focus:border-secondary border-secondary"
                                                                                        } w-12 my-2 rounded-lg rounded-b-none min-w-0 sm:text-sm border-0 border-b-2 border-gray-400  outline-none focus:outline-none focus:ring-0`}
                                                                                    />
                                                                                    {error?.[eachPackage?.node?.id] ? (
                                                                                        <p className=" self-end  mb-1 text-sm text-brickRed font-medium">
                                                                                            {eachPackage?.node
                                                                                                ?.minimum_unit === 1
                                                                                                ? "Quantity can not be empty"
                                                                                                : eachPackage?.node
                                                                                                      ?.require_quantity_reporting &&
                                                                                                  eachPackage?.node
                                                                                                      ?.minimum_unit < 1
                                                                                                ? "Quantity can not be empty "
                                                                                                : "Quantity can not be less than " +
                                                                                                  eachPackage?.node
                                                                                                      ?.minimum_unit}
                                                                                        </p>
                                                                                    ) : null}
                                                                                </div>
                                                                            ) : eachPackage?.node?.minimum_unit ? (
                                                                                <p className="text-sm text-secondary">
                                                                                    Qty:{" "}
                                                                                    {eachPackage?.node?.minimum_unit?.toLocaleString()}
                                                                                </p>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        onClick={async () => {
                                                                            await removeFromBundle(eachPackage.node.id);
                                                                        }}
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            class="h-8 w-8 text-brickRed"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                        >
                                                                            <path
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round"
                                                                                stroke-width="2"
                                                                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                    );
                                                })
                                            ) : (
                                                <div className="font-title text-gray-500 mt-4 text-start px-4 h2">
                                                    <p>No Products Selected.</p>
                                                    <br />
                                                    <p>
                                                        Please select 1 or more products from the Bundle or Product list
                                                        to assign.
                                                    </p>
                                                </div>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border w-full  rounded-lg  ">
                    <div className="h-full relative ">
                        {modal()}
                        {refusedModal()}
                        {addressRequireModal()}
                        {subdivisionModal()}
                        <div className="inset-0    h-full flex flex-col">
                            <div className="flex px-4 flex-col md:flex-row justify-between items-center">
                                <div className="font-title  py-4 text-center h2">Report to Addresses</div>
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
                                                                productSearchBoolean
                                                                    ? "translate-x-5"
                                                                    : "translate-x-0",
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
                                                                productSearchBoolean
                                                                    ? "Find Product(s)"
                                                                    : "Find Address(es)"
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
                                                <div className="w-full   h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                    <div className="grid h-full grid-cols-1 gap-6 border-t border-b">
                                                        {reportDataLoading ? (
                                                            <Loader />
                                                        ) : (
                                                            <MultiAccordian
                                                                cleanUpAction={cleanUpAction}
                                                                handleAccordianSubdivisionAddresses={(node, checked) =>
                                                                    handleAccordianSubdivisionAddresses(node, checked)
                                                                }
                                                                handleAccordianEachAddress={(node) =>
                                                                    handleAccordianEachAddress(node)
                                                                }
                                                                activeAddresses={activeAddresses}
                                                                Data={
                                                                    reportManipulatedObject?.id
                                                                        ? reportManipulatedObject
                                                                        : null
                                                                }
                                                                search={searchString?.length > 0}
                                                                productSearch={
                                                                    searchString?.length > 0 && productSearchBoolean
                                                                }
                                                                uniqueHouses={
                                                                    searchString?.length > 0 &&
                                                                    searchJSONResults?.uniqueHouses
                                                                }
                                                                subdivisions={
                                                                    searchString?.length > 0
                                                                        ? {
                                                                              activeSubdivisions: {
                                                                                  edges:
                                                                                      searchJSONResults?.subdivisions,
                                                                              },
                                                                          }
                                                                        : rebateReportData
                                                                }
                                                                refetch={(subdivisionId, houseId, productId) =>
                                                                    refetch(subdivisionId, houseId, productId)
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {activeAddresses.length > 0 && productPerBundle.length > 0 ? (
                                <div className="p-4 flex flex-col border-t">
                                    <div className="flex">
                                        <p className="text-xl font-title text-secondary font-semibold">
                                            {" "}
                                            Selected Addresses : {uniqueArrayLength.length}{" "}
                                        </p>
                                    </div>
                                    <div className="w-full flex justify-end items-center">
                                        <Button
                                            color="primary"
                                            disabled={isError()}
                                            title={
                                                reportManipulatedObject?.id
                                                    ? updateReportLoading
                                                        ? "Updating Report"
                                                        : "Update Report"
                                                    : createReportLoading
                                                    ? "Reporting"
                                                    : "Report"
                                            }
                                            onClick={() => {
                                                setShowModal(true);
                                            }}
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

export default Assignment;
