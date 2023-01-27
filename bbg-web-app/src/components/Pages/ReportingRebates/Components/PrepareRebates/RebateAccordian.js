import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import Modal from "../../../../Modal";
import { PlusCircleIcon } from "@heroicons/react/solid";
import Button from "../../../../Buttons";
import { Link } from "react-router-dom";
import {
    ACTION_REQUIRED_MUTATION,
    CHANGE_REPORT_STATUS,
    DELETE_PRODUCT_ADDRESS,
    UPDATE_REBATE_REPORT,
} from "../../../../../lib/addresses";
import { SEARCH_PRODUCTS } from "../../../../../lib/search";
import { toast } from "react-toastify";
import Loader from "../../../../Loader/Loader";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { useDebounce } from "../../../../../util/hooks";
import { toDateAdd } from "../../../../../util/generic";
import { APP_TITLE } from "../../../../../util/constants";

const RebateAccordian = ({
    Data,
    fromAddress,
    closeAccordian = true,
    productProofPoints,
    rebateReport,
    houseProofPoints,
    reportId,
    type,
    allProductsData,
    readyProductsData,
    actionHouses,
    refetch,
    isModifiable,
    disputes,
}) => {
    const [clicked, setClicked] = useState([]);
    const [tableAddresses, setTableAddresses] = useState();
    const [coDate, setCoDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [addressProofPoints, setAddressProofPoints] = useState();
    const [displayProductProofPoints] = useState();
    const [mutationObject, setMutationObject] = useState();
    const [modalTitle, setModalTitle] = useState({
        id: "",
        name: "",
    });
    const [modalProducts, setModalProducts] = useState();
    const [modalSearch, setModalSearch] = useState(false);
    const [productPerBundle, setProductsPerBundle] = useState([]);
    const [activeProducts, setActiveProducts] = useState([]);
    const [productIds, setProductIds] = useState();
    const [mutation, setMutation] = useState(false);
    const [searchProductString, setSearchProductString] = useState("");
    const [shouldChangeStatus, setShouldChangeStatus] = useState(false);
    const [nonActionableProducts, setNonActionableProducts] = useState();

    const [error, setError] = useState();
    const [edit, setEdit] = useState([]);
    const [searchEdit, setSearchEdit] = useState([]);
    const [searchError, setSearchError] = useState();
    const [productNode, setProductNode] = useState();
    const [searchFields, setSearchFields] = useState();
    const [fields, setFields] = useState();
    const [currentActiveParent, setCurrentActiveParent] = useState("");

    const debouncedValue1 = useDebounce(searchProductString, 160);

    useEffect(() => {
        if (searchProductString && searchProductString.length > 1) {
            searchProducts({
                variables: {
                    search: debouncedValue1,
                },
            });
        }
        // eslint-disable-next-line
    }, [debouncedValue1]);

    const toggle = (index) => {
        if (clicked.includes(index)) {
            //if clicked question is already active, then close it
            setClicked(clicked.filter((item) => item !== index));
        } else {
            setClicked([...clicked, index]);
        }
    };

    const [searchProducts, { data: searchedProducts, loading: searchedLoading }] = useLazyQuery(SEARCH_PRODUCTS, {
        notifyOnNetworkStatusChange: false,
        fetchPolicy: "network-only",
        onError(error) {
            if (error?.graphQLErrors[0]?.debugMessage.includes("Duplicate entry")) {
                toast.error("This product is already added");
            }
            if (
                error?.graphQLErrors[0]?.debugMessage.includes(
                    "Update Refused: Tried modifying a claim which is submitted"
                )
            ) {
                toast.error("The claim this product and house combination belongs to is submitted");
            }
            if (
                error?.graphQLErrors[0]?.debugMessage.includes(
                    "Update Refused: Tried modifying a claim which is processing"
                )
            ) {
                toast.warning(
                    "The claim this product and house combination belongs to is currently processing, please wait and try again"
                );
            }
        },
    });

    const fieldHelperFunction = (type) => {
        switch (type) {
            case "require_brand":
                return "text";
            case "require_distributor":
                return "selectDistributor";
            case "require_date_of_purchase":
                return "productPurchaseDate";
            case "require_date_of_installation":
                return "productInstallDate";
            case "require_model_number":
                return "text";
            case "require_serial_number":
                return "text";
            case "require_installer_pointer":
                return "selectInstallerPointer";
            case "require_installer_company":
                return "selectInstallerCompany";
            case "require_subcontractor_provider":
                return "selectSubcontractor";
            case "require_certificate_occupancy":
                return "CODate";
            default:
                return "type";
        }
    };

    const requiredProofPoints = [
        { name: "require_brand", label: "Brand", productKey: "product_brand" },
        { name: "require_serial_number", label: "Serial Number", productKey: "product_serial_number" },
        { name: "require_model_number", label: "Model Number", productKey: "product_model_number" },
        {
            name: "require_date_of_installation",
            label: "Date of Installation",
            productKey: "product_date_of_installation",
        },
        { name: "require_date_of_purchase", label: "Date of Purchase", productKey: "product_date_of_purchase" },
        {
            name: "require_distributor",
            label: "Subcontractor/Distributor/Provider",
            productKey: "subcontractorProvider",
        },
    ];

    const populateProofPoints = (value) => {
        let filter = productProofPoints.filter((item) => item.houseId === value?.node?.model?.id);

        let object = {};
        filter?.[0]?.productProofPoints?.forEach((item) => {
            object[item?.houseId] = {
                ...object[item?.houseId],
                [item?.productId]: {
                    id: item?.productId,
                    product_brand: item?.rebateReportPivot?.product_brand,
                    product_serial_number: item?.rebateReportPivot?.product_serial_number,
                    product_model_number: item?.rebateReportPivot?.product_model_number,
                    subcontractor_provider_id: {
                        label: item?.rebateReportPivot?.subcontractorProvider?.company_name,
                        value: item?.rebateReportPivot?.subcontractorProvider?.id,
                    },
                    product_date_of_installation: item?.rebateReportPivot?.product_date_of_installation,
                    product_date_of_purchase: item?.rebateReportPivot?.product_date_of_purchase,
                },
            };
        });
        setTableAddresses(object);
    };

    const modifiers = {
        selected: coDate,
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

    function CustomOverlay({ classNames, selectedDay, children, ...props }) {
        return (
            <div className={classNames.overlayWrapper} style={{ position: "absolute" }} {...props}>
                <div className={classNames.overlay}>{children}</div>
            </div>
        );
    }

    // const toDateAdd = (date) => {
    //   const date1 = new Date(date);
    //   let a = date1.getTimezoneOffset() * 60000;
    //   let b = new Date(date1.getTime() + a);
    //   return b;
    // };

    const CODisplayFunction = (value, item, date, idForUpdate = 0, index) => {
        let dateToDisplay = date !== null ? toDateAdd(date) : toDateAdd(new Date().toISOString().substr(0, 10));

        switch (value) {
            case "CODate":
                return (
                    <div
                        onClick={() => setCurrentActiveParent(index)}
                        className="grid grid-cols-2 w-full z-10
             items-center space-x-5   text-gray-500"
                    >
                        <DayPickerInput
                            value={idForUpdate in coDate ? coDate[idForUpdate] : dateToDisplay}
                            inputProps={{
                                style: {
                                    border: "1px solid rgba(212, 212, 216,1)",
                                    borderRadius: "0.375rem",
                                    padding: "0.5rem 0.75rem",
                                    width: "130px",
                                    fontSize: ".875rem",
                                    cursor: "pointer",
                                    color: "#003166",
                                },
                            }}
                            overlayComponent={CustomOverlay}
                            dayPickerProps={{
                                modifiers: modifiers,
                                modifiersStyles: modifiersStyles,
                            }}
                            onDayChange={(date) => {
                                setCoDate({
                                    ...coDate,
                                    [idForUpdate]: date,
                                });
                                if (addressProofPoints) {
                                    setAddressProofPoints({
                                        ...addressProofPoints,
                                        [idForUpdate]: {
                                            id: idForUpdate,
                                            ...addressProofPoints[idForUpdate],
                                            [item.type]: date?.toISOString().substr(0, 10),
                                        },
                                    });
                                } else {
                                    setAddressProofPoints({
                                        ...addressProofPoints,
                                        [idForUpdate]: {
                                            id: idForUpdate,
                                            [item.type]: date?.toISOString().substr(0, 10),
                                        },
                                    });
                                }
                            }}
                        />
                    </div>
                );

            default:
        }
    };

    const mutationObjectCreation = (node, id, type, statusChanged) => {
        let requestObject = {};
        requestObject.id = reportId;
        let values = tableAddresses && tableAddresses[id] && Object.values(tableAddresses[id]);
        let newValues = values?.map((item) => {
            let object = {};
            object.id = id; //house id
            object.product_id = parseInt(item?.id);
            object.status = type;

            return object;
        });
        let classNameProofPoint = "proofPoint-" + id;
        let proofPointsCompleted = document.getElementsByClassName(classNameProofPoint);
        let newType;
        if (statusChanged) newType = "REBATE_READY";
        else newType = type;
        let nonModifiableRecords = node?.node?.pivots
            ?.filter((item) => !item.isModifiable && item.status === newType)
            ?.map((item) => item?.products?.id);
        requestObject.ActionRequiredObject = newValues;
        let allProofPointsAreCompleted = true;
        for (let item of proofPointsCompleted) {
            if (item.tagName === "DIV" && displayProductProofPoints?.length > 0) {
                allProofPointsAreCompleted = false;
                type = "ACTION_REQUIRED";
            }
            if (!item.value && item.tagName !== "DIV") {
                allProofPointsAreCompleted = false;
                type = "ACTION_REQUIRED";
            }
        }
        if (type === "REBATE_READY") {
            // requestObject.id = ; //TODO: Some time is empty?
            let newValues = node?.node?.pivots
                ?.filter((item) => item.isModifiable && item.status === "ACTION_REQUIRED")
                ?.map((item) => {
                    let object = {};
                    object.id = id;
                    object.status = type;
                    object.product_id = parseInt(item?.products?.id);
                    return object;
                });
            if (nonModifiableRecords.length > 0) {
                toast.warning(`${nonModifiableRecords.length} couldn't be modified`);
            }
            requestObject.ActionRequiredObject = newValues;
        } else {
            if (nonModifiableRecords.length >= 1) {
                let count = 0;
                let correctValues = [];
                newValues?.forEach((newValue) => {
                    if (nonModifiableRecords.includes(newValue?.product_id)) {
                        count += 1;
                    } else {
                        correctValues.push(newValue);
                    }
                });
                newValues = correctValues;
                requestObject.ActionRequiredObject = newValues;
                if (count > 0) {
                    toast.warning(`${count} couldn't be modified`);
                }
            }
        }

        if (addressProofPoints && addressProofPoints[id] && addressProofPoints[id]?.require_certificate_occupancy) {
            requestObject.houseObject = [
                {
                    id: id,
                    input: {
                        confirmed_occupancy:
                            addressProofPoints &&
                            addressProofPoints[id] &&
                            addressProofPoints[id]?.require_certificate_occupancy,
                    },
                },
            ];
        }

        if (!allProofPointsAreCompleted) {
            requestObject.ActionRequiredObject[0].status = "ACTION_REQUIRED";
        }
        setMutationObject(requestObject);
    };

    useEffect(() => {
        if (mutationObject && mutationObject.id) {
            actionRequiredMutation();
        }
        // eslint-disable-next-line
    }, [mutationObject && mutationObject.id]);

    const handleQuantityChange = (eachPackage, e, type) => {
        setEdit([...edit, eachPackage?.id]);
        setFields({
            ...fields,
            [parseInt(eachPackage?.id)]: e.target.value,
        });
        setProductNode(eachPackage);
    };

    const handleSearchQuantityChange = (eachPackage, e, type) => {
        setSearchEdit([...searchEdit, eachPackage?.id]);
        setSearchFields({
            ...searchFields,
            [parseInt(eachPackage?.id)]: e.target.value,
        });

        setProductNode(eachPackage);
    };

    const isError = () => {
        let finalError = false;
        // eslint-disable-next-line
        modalProducts?.map((item) => {
            if (error?.[item?.id]) {
                finalError = true;
            }
        });
        return finalError;
    };

    useEffect(() => {
        let object = {};
        searchedProducts?.searchProducts?.edges?.forEach((item) => {
            if (
                searchFields?.[parseInt(item?.node?.id)] < item?.node?.minimum_unit &&
                item?.node?.minimum_unit !== null &&
                item?.node?.require_quantity_reporting
            ) {
                object[item?.node?.id] = true;
            } else if (
                !searchFields?.[parseInt(item?.node?.id)] &&
                item?.node?.minimum_unit !== null &&
                item?.node?.require_quantity_reporting
            ) {
                object[item?.node?.id] = true;
            } else if (item?.node?.require_quantity_reporting && !searchFields?.[parseInt(item?.node?.id)]) {
                object[item?.node?.id] = true;
            } else {
                object[item?.node?.id] = false;
            }
        });
        setSearchError(object);
        // eslint-disable-next-line
    }, [searchedProducts, activeProducts]);

    //Code to Auto-Expand Starts Here

    useEffect(() => {
        let items = Data?.map((item, index) => index);
        if (items) {
            setClicked([...clicked, ...items]);
            autoExpandPopulation();
        }
        // eslint-disable-next-line
    }, [Data]);

    const autoExpandPopulation = () => {
        var autoExpandObject = {};
        // eslint-disable-next-line
        Data?.map((value) => {
            let filter = productProofPoints.filter((item) => item.houseId === value?.node?.model?.id);
            filter?.[0]?.productProofPoints?.forEach((item) => {
                autoExpandObject[item?.houseId] = {
                    ...autoExpandObject[item?.houseId],
                    [item?.productId]: {
                        id: item?.productId,
                        product_brand: item?.rebateReportPivot?.product_brand,
                        product_serial_number: item?.rebateReportPivot?.product_serial_number,
                        product_model_number: item?.rebateReportPivot?.product_model_number,
                        subcontractor_provider_id: {
                            label: item?.rebateReportPivot?.subcontractorProvider?.company_name,
                            value: item?.rebateReportPivot?.subcontractorProvider?.id,
                        },
                        product_date_of_installation: item?.rebateReportPivot?.product_date_of_installation,
                        product_date_of_purchase: item?.rebateReportPivot?.product_date_of_purchase,
                    },
                };
            });
        });
        setTableAddresses(autoExpandObject);
    };

    //Code to Auto-Expand Ends Here

    const isSearchError = () => {
        let finalError = false;
        activeProducts?.forEach((item) => {
            if (searchError[item]) {
                finalError = true;
            }
        });
        return finalError;
    };

    useEffect(() => {
        if (
            fields?.[parseInt(productNode?.id)] < productNode?.minimum_unit &&
            productNode?.minimum_unit !== null &&
            productNode?.require_quantity_reporting
        ) {
            setError({ ...error, [parseInt(productNode?.id)]: true });
        } else if (
            !fields?.[parseInt(productNode?.id)] &&
            productNode &&
            productNode?.minimum_unit !== null &&
            productNode?.require_quantity_reporting
        ) {
            setError({ ...error, [parseInt(productNode?.id)]: true });
        } else if (productNode?.require_quantity_reporting && !fields?.[parseInt(productNode?.id)]) {
            setError({ ...error, [parseInt(productNode?.id)]: true });
        } else {
            setError({ ...error, [parseInt(productNode?.id)]: false });
        }

        // eslint-disable-next-line
    }, [fields, productPerBundle, productNode]);

    useEffect(() => {
        if (
            searchFields?.[parseInt(productNode?.id)] < productNode?.minimum_unit &&
            productNode?.minimum_unit !== null &&
            productNode?.require_quantity_reporting
        ) {
            setSearchError({
                ...searchError,
                [parseInt(productNode?.id)]: true,
            });
        } else if (
            !searchFields?.[parseInt(productNode?.id)] &&
            productNode?.minimum_unit !== null &&
            productNode?.require_quantity_reporting
        ) {
            setSearchError({
                ...searchError,
                [parseInt(productNode?.id)]: true,
            });
        } else if (productNode?.require_quantity_reporting && !searchFields?.[parseInt(productNode?.id)]) {
            setSearchError({
                ...searchError,
                [parseInt(productNode?.id)]: true,
            });
        } else {
            setSearchError({
                ...searchError,
                [parseInt(productNode?.id)]: false,
            });
        }
        // eslint-disable-next-line
    }, [searchFields, productPerBundle, productNode]);

    const [actionRequiredMutation] = useMutation(ACTION_REQUIRED_MUTATION, {
        variables: mutationObject,
        update(cache, result) {
            if (result?.data?.prepareRebate?.refusedChanges.length > 0) {
                result?.data?.prepareRebate?.refusedChanges.forEach((error) => {
                    toast.error(error?.reason);
                });
            } else {
                toast.success("House and Product Proof Points updated.");
            }
            setMutationObject({});
            refetch();
        },
    });

    const calculateProofPointsField = (value) => {
        let filter = productProofPoints.filter((item) => item.houseId === value?.node?.model?.id);

        // eslint-disable-next-line
        let products = filter[0]?.productProofPoints.map((item) => {
            let object = {};
            object.id = item.productId;
            object.category = item?.category;
            object.bbg_product_code = item.bbg_product_code;
            object.programs = item.programs;
            object.name = item.name;
            return object;
        });
        let array = [];
        let uniqueProducts = [...new Set(products)];
        // eslint-disable-next-line
        uniqueProducts.map((product) => {
            if (!array.includes(product.id)) {
                array.push(product.id);
            }
        });

        let values = array.filter((element) => element !== undefined);
        return values;
    };

    const proofPointsFields = (value) => {
        let filter = productProofPoints.filter((item) => item.houseId === value?.node?.model?.id);
        filter = filter[0]?.productProofPoints.filter(
            (value, index, array) => array.findIndex((value2) => value2.productId === value.productId) === index
        );

        // eslint-disable-next-line
        return filter?.map((eachData) => {
            let count = 0;
            return (
                <div className="flex flex-col text-brickRed">
                    {requiredProofPoints?.map((proofPoint) => {
                        let element;
                        eachData.programs.some((program) => {
                            if (program[proofPoint.name]) {
                                if (!eachData?.rebateReportPivot[proofPoint.productKey]) {
                                    element = (
                                        <>
                                            {count === 0 ? (
                                                <>
                                                    <p className="text-sm font-semibold text-gray-500 text-left">
                                                        {eachData?.bbg_product_code
                                                            ? eachData?.bbg_product_code + " - "
                                                            : ""}
                                                        {eachData.name} - Requires The Following Proof Points:
                                                    </p>
                                                    <>{proofPoint.label}</>
                                                </>
                                            ) : (
                                                <> - {proofPoint.label}</>
                                            )}
                                        </>
                                    );
                                    count = 1;
                                    return true;
                                }
                            }
                            return false;
                        });
                        return element;
                    })}
                </div>
            );
        });
    };

    const checkIfMissingProofPoints = (value) => {
        let filter = productProofPoints.filter((item) => item.houseId === value?.node?.model?.id);
        // eslint-disable-next-line
        filter = filter[0]?.productProofPoints?.filter(
            (value, index, array) => array.findIndex((value2) => value2.productId === value.productId) === index
        );
        let missingProofPoints = false;
        filter?.forEach((eachData) => {
            requiredProofPoints.forEach((proofPoint) => {
                return eachData.programs.forEach((program) => {
                    if (program[proofPoint.name]) {
                        if (!eachData?.rebateReportPivot[proofPoint.productKey]) {
                            missingProofPoints = true;
                        }
                    }
                });
            });
        });
        return missingProofPoints;
    };

    const houseCOField = (value, index) => {
        let filter = houseProofPoints.filter(
            (item) =>
                parseInt(item.houseId) === parseInt(value?.node?.model?.id) ||
                parseInt(item.houseId) !== parseInt(value?.node?.model?.id)
        );
        let types = [];
        return filter && filter[0] ? (
            <div className="flex w-full space-x-10">
                {filter &&
                    filter[0] &&
                    // eslint-disable-next-line
                    filter[0].houseProofPoints.map((item) => {
                        if (!types.includes(item.type) && item.type === "require_certificate_occupancy") {
                            types.push(item.type);
                            let label = fieldHelperFunction(item.type);
                            return (
                                <div className="mt-1">
                                    {CODisplayFunction(
                                        label,
                                        item,
                                        value?.node?.model?.confirmed_occupancy,
                                        value?.node?.model?.id,
                                        index
                                    )}
                                </div>
                            );
                        }
                    })}
            </div>
        ) : null;
    };

    const findCount = (id) => {
        let filter = productProofPoints.filter((item) => item.houseId === id);
        let filterHouse = houseProofPoints.filter((item) => item.houseId === id);
        let UniqueHouseCount = 0;
        let UniqueHouseType = [];
        let minusHouseCount = 0;
        filterHouse &&
            filterHouse[0] &&
            filterHouse[0].houseProofPoints &&
            filterHouse[0].houseProofPoints.forEach((item) => {
                if (!UniqueHouseType.includes(item.houseId)) {
                    UniqueHouseCount = UniqueHouseCount + 1;
                    if (item?.confirmed_occupancy !== null && !UniqueHouseType.includes(item.houseId)) {
                        minusHouseCount++;
                        UniqueHouseType.push(item.houseId);
                    }
                }
            });

        let products =
            filter &&
            filter[0] &&
            filter[0].productProofPoints.map((item) => {
                let object = {};
                object.name = item.name;
                object.id = item.productId;
                return object;
            });
        let uniqueProducts = [...new Set(products?.map((o) => JSON.stringify(o)))].map((s) => JSON.parse(s));
        let count = 0;
        let verified = 0;
        let alreadyIncludedIds = [];
        uniqueProducts.forEach((product) => {
            filter &&
                filter[0] &&
                // eslint-disable-next-line
                filter[0].productProofPoints.map((item) => {
                    if (item.productId === product.id) {
                        if (!alreadyIncludedIds.includes(item.productId)) {
                            if (item?.rebateReportPivot?.product_brand !== null) {
                                alreadyIncludedIds.push(item.productId);
                                verified++;
                            }
                            if (item?.rebateReportPivot?.product_serial_number !== null) {
                                alreadyIncludedIds.push(item.productId);
                                verified++;
                            }
                            if (item?.rebateReportPivot?.product_model_number !== null) {
                                alreadyIncludedIds.push(item.productId);
                                verified++;
                            }
                            if (item?.rebateReportPivot?.product_date_of_installation !== null) {
                                alreadyIncludedIds.push(item.productId);
                                verified++;
                            }
                            if (item?.rebateReportPivot?.subcontractorProvider.id !== null) {
                                alreadyIncludedIds.push(item.productId);
                                verified++;
                            }
                            if (item?.rebateReportPivot?.product_date_of_purchase !== null) {
                                alreadyIncludedIds.push(item.productId);
                                verified++;
                            }

                            alreadyIncludedIds.push(item.productId);
                        }
                        count = count + 1;
                    }
                });
        });
        return count + UniqueHouseCount - verified - minusHouseCount;
    };

    const dataFormat = () => {
        let array = [];

        productPerBundle &&
            productPerBundle.length > 0 &&
            // eslint-disable-next-line
            productPerBundle.map((item) => {
                let object = {};
                object.id = parseInt(item?.id);
                object.quantity =
                    searchFields && searchFields[item?.id] ? parseInt(searchFields[item?.id]) : item?.product_quantity;
                array.push(object);
            });

        return array;
    };

    const dataFormatConfirm = () => {
        let array = [];

        modalProducts &&
            modalProducts.length > 0 &&
            // eslint-disable-next-line
            modalProducts.map((item) => {
                let object = {};
                object.id = parseInt(item?.id);
                object.quantity = fields && fields[item?.id] ? parseInt(fields[item?.id]) : item?.product_quantity;
                array.push(object);
            });

        return array;
    };

    const [updateReport] = useMutation(UPDATE_REBATE_REPORT, {
        variables: {
            id: parseInt(reportId),
            houses: [parseInt(modalTitle.id)],
            products: dataFormat(),
        },
        update(cache, result) {
            setShowModal(false);
            setModalSearch(false);
            setProductsPerBundle([]);
            setActiveProducts([]);
            refetch();
            if (shouldChangeStatus === true) {
                changeStatus();
            }
        },
    });

    const [updateReportConfirm] = useMutation(UPDATE_REBATE_REPORT, {
        variables: {
            id: parseInt(reportId),
            houses: [parseInt(modalTitle.id)],
            products: dataFormatConfirm(),
        },
        update(cache, result) {
            setShowModal(false);
            setModalSearch(false);
            setProductsPerBundle([]);
            setActiveProducts([]);
            if (shouldChangeStatus === true) {
                changeStatus();
            } else {
                refetch();
            }
        },
    });

    let productProofPointsArray = [
        "require_brand",
        "require_serial_number",
        "require_model_number",
        "require_date_of_installation",
        "require_date_of_purchase",
        "require_distributor",
    ];

    const addProductToAddress = (eachData, id, action) => {
        let productProofPoints = [];
        let productProofPointsId = [];
        if (action === "action") {
            eachData?.programs?.edges?.forEach((eachProgram) => {
                productProofPointsArray?.forEach((array) => {
                    if (
                        eachProgram?.node?.[array] &&
                        productProofPoints.findIndex(
                            (element) =>
                                element.productId === eachData?.id && element.houseId === id && element.type === array
                        ) < 0
                    ) {
                        let object = {};
                        object.productId = eachData?.id;
                        object.name = eachData?.name;
                        object.category = eachData?.category;
                        object.programs = eachData?.programs;
                        object.bbg_product_code = eachData?.bbg_product_code;
                        object.type = array;
                        object.houseId = id;
                        productProofPoints.push(object);
                        productProofPointsId.push(eachData?.id);
                    }
                });
            });
        }

        if (!activeProducts.includes(parseInt(eachData?.id))) {
            setProductsPerBundle((productPerBundle) => [...productPerBundle, eachData]);
            setActiveProducts((activeProducts) => [...activeProducts, parseInt(eachData?.id)]);
        }

        if (productProofPointsId?.length > 0) {
            setShouldChangeStatus(true);
        }
    };

    const [changeStatus] = useMutation(CHANGE_REPORT_STATUS, {
        variables: {
            rebateReport_id: reportId,
            house_id: modalTitle?.id,
            status: "ACTION_REQUIRED",
        },
        update(cache, result) {
            setShouldChangeStatus(false);
            refetch();
        },
    });

    const removeProduct = (productId) => {
        setProductIds([productId]);
        setMutation(true);
    };

    useEffect(() => {
        if (mutation === true) {
            unassignProduct();
        }
        // eslint-disable-next-line
    }, [mutation]);

    const [unassignProduct] = useMutation(DELETE_PRODUCT_ADDRESS, {
        variables: {
            report_id: reportId,
            house_id: parseInt(modalTitle?.id),
            product_ids: productIds,
        },
        update(cache, result) {
            setMutation(false);
            setActiveProducts([]);
            setProductsPerBundle([]);
            setShowModal(false);
            setModalProducts(modalProducts.filter((item) => !productIds.includes(item?.node?.id)));
            refetch();
        },
        onError(error) {
            setMutation(false);
            if (error?.graphQLErrors[0]?.debugMessage?.includes("Cannot modify product")) {
                toast.warning("This product can't be modified currently");
            }
        },
    });

    const findUniqueProductCount = (pivots) => {
        let productCodes = [];
        pivots?.forEach((item) => {
            if (!productCodes?.includes(item?.products?.bbg_product_code)) {
                productCodes?.push(item?.products?.bbg_product_code);
            }
        });
        let count = productCodes?.length;
        if (count > 0) {
            return count;
        }
        return 0;
    };

    const confirmModalContent = () => {
        return (
            <div className="flex flex-col px-6">
                <div className="flex w-full justify-end">
                    {type !== "completed" ? (
                        <Button
                            title="Add Product"
                            color="primary"
                            onClick={() => {
                                setModalSearch(true);
                                setSearchProductString("");
                            }}
                        />
                    ) : null}
                </div>
                <div className=" border rounded-lg     scrollbar-thumb-lightPrimary scrollbar-track-gray-400 max-h-smallMin">
                    <ul className={`flex-0 w-full ${type === "completed" ? "opacity-25 pointer-events-none" : ""}`}>
                        {modalProducts &&
                            modalProducts.length > 0 &&
                            modalProducts.map((eachPackage) => {
                                if (!eachPackage) return null;
                                return (
                                    <li className={`border-b border-l-6 border-l-gold`}>
                                        <Link to="#" className="block hover:bg-gray-50">
                                            <div className="flex items-center px-4 py-4 sm:px-6">
                                                <div className="min-w-0 flex-1 flex">
                                                    <div className="min-w-0 flex-1 px-2 md:grid md:grid-cols-2 items-center">
                                                        <div className="flex flex-col">
                                                            <div className="flex flex-col text-xs text-gray-500 italic text-left">
                                                                {eachPackage?.category && eachPackage?.category?.name}
                                                            </div>
                                                            <div className="group relative   flex justify-between items-center">
                                                                <p className="text-sm font-semibold text-gray-500 text-left">
                                                                    {eachPackage?.bbg_product_code
                                                                        ? eachPackage?.bbg_product_code + " - "
                                                                        : ""}
                                                                    {eachPackage?.name}
                                                                </p>
                                                            </div>
                                                            <div className=" flex flex-col text-xs text-gray-500">
                                                                {eachPackage &&
                                                                    eachPackage.programs &&
                                                                    eachPackage.programs.length > 0 &&
                                                                    eachPackage.programs.map((item) => {
                                                                        return (
                                                                            <div className="flex flex-col">
                                                                                <span className="">
                                                                                    {item.program_name}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                            </div>
                                                        </div>
                                                        {eachPackage?.require_quantity_reporting ? (
                                                            <div>
                                                                <input
                                                                    type="number"
                                                                    name="productQuantityConfirm"
                                                                    id="productQuantityConfirm"
                                                                    value={
                                                                        edit?.includes(eachPackage?.id)
                                                                            ? fields?.[eachPackage.id]
                                                                                ? fields?.[eachPackage.id]
                                                                                : ""
                                                                            : eachPackage?.product_quantity
                                                                    }
                                                                    disabled={type === "completed"}
                                                                    onChange={(e) => {
                                                                        handleQuantityChange(eachPackage, e, "confirm");
                                                                    }}
                                                                    placeholder="Qty"
                                                                    className={` ${
                                                                        error?.[eachPackage?.id]
                                                                            ? "input-error focus:border-brickRed border-brickRed"
                                                                            : "focus:border-secondary border-secondary"
                                                                    } w-12 my-2 rounded-lg rounded-b-none min-w-0 sm:text-sm border-0 border-b-2 border-gray-400  outline-none focus:outline-none focus:ring-0`}
                                                                />
                                                                {error?.[eachPackage?.id] ? (
                                                                    <p className=" self-end  mb-1 text-sm text-brickRed font-medium">
                                                                        {eachPackage?.minimum_unit === 1
                                                                            ? "Quantity can not be empty"
                                                                            : eachPackage?.require_quantity_reporting &&
                                                                              eachPackage?.minimum_unit < 1
                                                                            ? "Quantity can not be empty "
                                                                            : "Quantity can not be less than " +
                                                                              eachPackage?.minimum_unit}
                                                                    </p>
                                                                ) : null}
                                                            </div>
                                                        ) : eachPackage?.minimum_unit ? (
                                                            <p className="text-sm text-secondary">
                                                                Qty: {eachPackage?.minimum_unit?.toLocaleString()}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                {type !== "completed" ? (
                                                    <div
                                                        onClick={() => {
                                                            removeProduct(eachPackage.id);
                                                        }}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            class="h-8 w-16 text-brickRed"
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
                                                ) : (
                                                    <p>Claimed</p>
                                                )}
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                    </ul>
                    <ul className="flex-0 w-full ">
                        {nonActionableProducts &&
                            nonActionableProducts.length > 0 &&
                            // eslint-disable-next-line
                            nonActionableProducts?.map((eachPackage) => {
                                if (eachPackage !== undefined)
                                    return (
                                        <li className={`border-b border-l-6 border-l-gold`}>
                                            <Link to="#" className="block hover:bg-gray-50">
                                                <div className="flex items-center px-4 py-4 sm:px-6">
                                                    <div className="min-w-0 flex-1 flex justify-between">
                                                        <div className="min-w-0 flex-1 px-2 md:grid md:grid-cols-2 items-center">
                                                            <div className="flex flex-col">
                                                                <div className="flex flex-col text-xs text-gray-500 italic text-left">
                                                                    {eachPackage?.products?.category &&
                                                                        eachPackage?.products?.category?.name}
                                                                </div>
                                                                <div className="group relative   flex justify-between items-center">
                                                                    <p className="text-sm font-semibold text-gray-500 text-left">
                                                                        {eachPackage?.products?.bbg_product_code
                                                                            ? eachPackage?.products?.bbg_product_code +
                                                                              " - "
                                                                            : ""}
                                                                        {eachPackage?.products?.name}
                                                                    </p>
                                                                </div>
                                                                <div className=" flex flex-col text-xs text-gray-500">
                                                                    {eachPackage?.products &&
                                                                        eachPackage?.products?.programs &&
                                                                        eachPackage?.products?.programs.length > 0 &&
                                                                        eachPackage?.products?.programs.map((item) => {
                                                                            return (
                                                                                <div className="flex flex-col">
                                                                                    <span className="">
                                                                                        {item.program_name}
                                                                                    </span>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                </div>
                                                            </div>
                                                            {eachPackage?.products?.require_quantity_reporting ? (
                                                                <div className="ml-3">
                                                                    {eachPackage?.product_quantity}
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    <div className="w-16 text-right">
                                                        {eachPackage?.claimed ? "Claimed" : "Ready"}
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    );
                            })}
                    </ul>
                </div>
            </div>
        );
    };

    const searchModalContent = () => {
        return (
            <div className="flex flex-col px-6">
                <div
                    className="flex
           items-center space-x-5   text-gray-500"
                >
                    <label className="text-md mb-1  font-medium text-secondary" htmlFor="productSearch">
                        Fast Add
                    </label>
                    <input
                        type="text"
                        name="productSearch"
                        id="productSearch"
                        value={searchProductString}
                        onChange={(e) => setSearchProductString(e.target.value)}
                        className="focus:outline-none  input-no-error   sm:text-sm  rounded-md"
                        placeholder={APP_TITLE + " Code or Product Name"}
                    />
                </div>
                <div className="   max-h-smallMin   scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                    <ul className="flex-0 w-full overflow-hidden rounded-lg mt-2">
                        {searchedLoading ? (
                            <Loader />
                        ) : (
                            searchProductString?.length > 0 &&
                            searchedProducts?.searchProducts?.edges.map((eachPackage) => {
                                return (
                                    <li
                                        className={`border-b border-l-4  ${
                                            activeProducts.includes(parseInt(eachPackage.node.id))
                                                ? "border-l-gold border-l-6"
                                                : "border-l-primary"
                                        } `}
                                    >
                                        <Link to="#" className="block hover:bg-gray-50">
                                            <div className="flex items-center px-4 py-4 sm:px-6">
                                                <div className="min-w-0 flex-1 flex">
                                                    <div className="min-w-0 flex-1 px-2 md:grid md:grid-cols-2 items-center">
                                                        <div className="flex flex-col">
                                                            <div className="flex flex-col text-xs text-gray-500 italic text-left">
                                                                {eachPackage?.node?.category &&
                                                                    eachPackage?.node?.category?.name}
                                                            </div>
                                                            <div className="group relative   flex justify-between items-center">
                                                                <p className="text-sm font-semibold text-gray-500 text-left">
                                                                    {eachPackage?.node?.bbg_product_code
                                                                        ? eachPackage?.node?.bbg_product_code + " - "
                                                                        : ""}
                                                                    {eachPackage.node.name}
                                                                </p>
                                                            </div>
                                                            <div className=" flex flex-col text-xs text-gray-500">
                                                                {eachPackage &&
                                                                    eachPackage.node.programs &&
                                                                    eachPackage.node.programs.edges.length > 0 &&
                                                                    eachPackage.node.programs.edges.map((item) => {
                                                                        return (
                                                                            <div className="flex flex-col">
                                                                                <span className="">
                                                                                    {item.node.name}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                            </div>
                                                        </div>

                                                        {!modalProducts
                                                            ?.map((item) => parseInt(item?.id))
                                                            ?.includes(parseInt(eachPackage.node.id)) ? (
                                                            eachPackage?.node?.require_quantity_reporting &&
                                                            !nonActionableProducts
                                                                ?.map((item) => item?.products?.id)
                                                                ?.includes(eachPackage?.node?.id) ? (
                                                                <div>
                                                                    <input
                                                                        type="number"
                                                                        name="productQuantity"
                                                                        id="productQuantity"
                                                                        value={
                                                                            searchEdit?.includes(eachPackage?.node?.id)
                                                                                ? searchFields?.[
                                                                                      parseInt(eachPackage?.node?.id)
                                                                                  ]
                                                                                    ? searchFields?.[
                                                                                          parseInt(
                                                                                              eachPackage?.node?.id
                                                                                          )
                                                                                      ]
                                                                                    : ""
                                                                                : eachPackage?.node?.product_quantity
                                                                        }
                                                                        disabled={type === "completed"}
                                                                        onChange={(e) => {
                                                                            handleSearchQuantityChange(
                                                                                eachPackage?.node,
                                                                                e,
                                                                                "search"
                                                                            );
                                                                        }}
                                                                        placeholder="Qty"
                                                                        className={` ${
                                                                            searchError?.[eachPackage?.node?.id]
                                                                                ? "input-error focus:border-brickRed border-brickRed"
                                                                                : "focus:border-secondary border-secondary mb-8"
                                                                        } w-12 my-2 rounded-lg rounded-b-none min-w-0 sm:text-sm border-0 border-b-2 border-gray-400  outline-none focus:outline-none focus:ring-0`}
                                                                    />
                                                                    {searchError?.[eachPackage?.node?.id] ? (
                                                                        <p className=" self-end  mb-1 text-sm text-brickRed font-medium">
                                                                            {eachPackage?.node?.minimum_unit === 1
                                                                                ? "Quantity can not be empty"
                                                                                : eachPackage?.node
                                                                                      ?.require_quantity_reporting &&
                                                                                  eachPackage?.node?.minimum_unit < 1
                                                                                ? "Quantity can not be empty "
                                                                                : "Quantity can not be less than " +
                                                                                  eachPackage?.node?.minimum_unit}
                                                                        </p>
                                                                    ) : null}
                                                                </div>
                                                            ) : eachPackage?.node?.minimum_unit &&
                                                              !nonActionableProducts
                                                                  ?.map((item) => item?.products?.id)
                                                                  ?.includes(eachPackage?.node?.id) ? (
                                                                <p className="text-sm text-secondary">
                                                                    Qty:{" "}
                                                                    {eachPackage?.node?.minimum_unit?.toLocaleString()}
                                                                </p>
                                                            ) : null
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div
                                                    className="text-secondary"
                                                    onClick={() => {
                                                        if (
                                                            !(
                                                                modalProducts
                                                                    ?.map((item) => parseInt(item?.id))
                                                                    ?.includes(parseInt(eachPackage.node.id)) ||
                                                                activeProducts?.includes(
                                                                    parseInt(eachPackage?.node?.id)
                                                                )
                                                            )
                                                        ) {
                                                            addProductToAddress(
                                                                eachPackage?.node,
                                                                modalTitle?.id,
                                                                "action"
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {modalProducts
                                                        ?.map((item) => parseInt(item?.id))
                                                        ?.includes(parseInt(eachPackage.node.id)) ||
                                                    activeProducts?.includes(parseInt(eachPackage?.node?.id)) ? (
                                                        "Added"
                                                    ) : !nonActionableProducts
                                                          ?.map((item) => item?.products?.id)
                                                          ?.includes(eachPackage?.node?.id) ? (
                                                        <PlusCircleIcon className="w-8 h-8 text-brickGreen" />
                                                    ) : (
                                                        "Claimed"
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            </div>
        );
    };

    const modalSearchOffClose = () => {
        setModalSearch(false);
        setProductsPerBundle([]);
        setActiveProducts([]);
        setProductNode({});
        setShowModal(false);
        setError({});
        setSearchError({});
        setSearchFields({});
    };

    const handleClose = () => {
        setModalSearch(false);
        setError({});
        setProductNode({});
        setSearchError({});
        setSearchFields({});
        setActiveProducts([]);
    };

    const modal = () => {
        return (
            <>
                <Modal
                    Cancel={modalSearch}
                    onSubmit={modalSearch ? updateReport : updateReportConfirm}
                    title={modalSearch ? `Add Products to ${modalTitle.name}` : `Editing ${modalTitle.name}`}
                    width={modalSearch ? "2xl" : "2xl"}
                    minHeight={modalSearch ? "" : "min-h-smallMin"}
                    Content={modalSearch ? searchModalContent() : confirmModalContent()}
                    disabled={modalSearch ? activeProducts?.length === 0 || isSearchError() : isError()}
                    submitLabelColor={modalSearch ? "primary" : "primary"}
                    submitLabel={modalSearch ? "Confirm" : "Confirm"}
                    onClose={() => (modalSearch ? handleClose() : modalSearchOffClose())}
                    IconJSX={modalSearch ? null : <PlusCircleIcon className="w-10 h-10 text-brickGreen" />}
                    show={showModal}
                />
            </>
        );
    };

    const handleModal = (node, allProducts, readyProducts) => {
        setEdit([]);
        setSearchEdit([]);
        setFields({});
        setError({});
        setSearchError({});
        setModalTitle({ id: node?.model?.id, name: node?.model?.address });
        setProductNode({});
        let remainingProducts = allProducts?.pivots
            ?.filter((item) => node?.pivots?.findIndex((element) => element?.id === item?.id))
            .filter((element) => element?.claimed === true);
        let remainingReadyProducts = readyProducts?.pivots?.filter((item) =>
            node?.pivots?.findIndex((element) => element?.id === item?.id)
        );
        let array = remainingProducts?.concat(remainingReadyProducts);

        if (type === "action") {
            setNonActionableProducts(array);
        } else if (type === "ready") {
            setNonActionableProducts(remainingReadyProducts);
        }

        setModalProducts(
            // eslint-disable-next-line
            node?.pivots
                ?.map((item) => {
                    if (item.status === "ACTION_REQUIRED" || item.status === "COMPLETED") {
                        let object = {};
                        object = { ...item?.products };
                        object.product_quantity = item?.product_quantity;
                        return object;
                    } else {
                        return null;
                    }
                })
                .filter((item) => item !== undefined)
        );
        setShowModal(true);
    };

    return (
        <div className="flex flex-col w-full items-start justify-start bg-white ">
            {modal()}
            <div className={`  w-full   scrollbar-thumb-lightPrimary scrollbar-track-gray-400 `}>
                {Data &&
                    Data.length !== 0 &&
                    Data.map((item, index) => {
                        let actionList = actionHouses?.map((item) => item?.node?.model?.id);
                        let some = allProductsData?.find(
                            (element) => element?.node?.model?.id === item?.node?.model?.id
                        );
                        let ready = readyProductsData?.find(
                            (element) => element?.node?.model?.id === item?.node?.model?.id
                        );
                        return (
                            <div className={` ${rebateReport ? "border-l border-b border-l-white" : "border-b"}`}>
                                <div
                                    className={`flex group py-1 justify-between items-center w-full text-center cursor-pointer transition-all  border-l-4 hover:border-l-6  ${
                                        clicked.includes(index) &&
                                        closeAccordian &&
                                        calculateProofPointsField(item)?.length > 0
                                            ? "bg-gray-100 border-l-6 border-gold"
                                            : "bg-white border-primary"
                                    } ${currentActiveParent === index ? "relative z-10" : ""} `}
                                    onClick={() => {
                                        if (calculateProofPointsField(item)?.length > 0) {
                                            toggle(index);
                                        }

                                        populateProofPoints(item);
                                    }}
                                    key={index}
                                >
                                    <div className="flex w-full items-center pl-4">
                                        <div className="flex w-full">
                                            <div className="flex w-full  flex-1 items-start">
                                                <div
                                                    className={` w-full  px-2 text-sm py-2   ${
                                                        fromAddress && rebateReport ? "px-2" : "px-2"
                                                    }`}
                                                >
                                                    {fromAddress ? (
                                                        <div className="flex flex-col items-start justify-start">
                                                            {item?.node?.model?.lot_number ? (
                                                                <p className="font-semibold text-gray-500">
                                                                    Lot: {item?.node?.model?.lot_number}
                                                                </p>
                                                            ) : null}

                                                            {item?.node.model?.address2?.trim() !== "" &&
                                                            item?.node?.model?.address2 !== null ? (
                                                                <p className="font-semibold text-gray-500 whitespace-nowrap">
                                                                    {item?.node?.model?.address2} -{" "}
                                                                    {item?.node?.model?.address}
                                                                </p>
                                                            ) : (
                                                                <p className="font-semibold text-gray-500 whitespace-nowrap">
                                                                    {item?.node?.model?.address}
                                                                </p>
                                                            )}
                                                            {item?.node?.model?.project_number ? (
                                                                <p className="text-gray-500">
                                                                    Project: {item?.node?.model?.project_number}
                                                                </p>
                                                            ) : null}
                                                            {item?.node?.model?.model ? (
                                                                <p className="text-gray-500 capitalize">
                                                                    Build Model: {item?.node?.model?.model}
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                    ) : (
                                                        <p> {item?.node?.name} </p>
                                                    )}
                                                </div>
                                                <div
                                                    className=" w-full px-2 flex justify-start py-2  text-lg font-title font-semibold text-darkgray75 hover:text-secondary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleModal(item.node, some?.node, ready?.node);
                                                    }}
                                                >
                                                    <div className="" style={{ textDecoration: "underline" }}>
                                                        {" "}
                                                        {findUniqueProductCount(item?.node?.pivots) > 1
                                                            ? findUniqueProductCount(item?.node?.pivots) +
                                                              " Product Codes"
                                                            : findUniqueProductCount(item?.node?.pivots) +
                                                              " Product Code"}{" "}
                                                    </div>
                                                </div>
                                                <div className=" w-full px-2 flex justify-start py-2  text-lg font-title font-semibold text-darkgray75">
                                                    <div>
                                                        <div>
                                                            <p>{disputes ? disputes?.length : 0} Disputed Rebates</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {type === "ready" ? (
                                                    <div className=" w-full  px-2 flex justify-start py-2  text-lg font-title font-semibold text-darkgray75">
                                                        <p
                                                            className={`${
                                                                actionList?.includes(item?.node?.model?.id)
                                                                    ? "text-brickRed"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {actionList?.includes(item?.node?.model?.id)
                                                                ? findCount(item?.node?.model?.id) > 0
                                                                    ? findCount(item?.node?.model?.id) +
                                                                      " Actions Required"
                                                                    : " Action Required"
                                                                : "Ready for Claim"}
                                                        </p>
                                                    </div>
                                                ) : null}
                                                <div
                                                    className=" w-full  px-2 py-2 flex justify-start "
                                                    onClick={(e) =>
                                                        clicked.includes(index) ? e.stopPropagation() : null
                                                    }
                                                >
                                                    {type === "action" ? (
                                                        <div className="flex flex-col items-start">
                                                            <p className="text-gray-500 text-sm mt-1 font-title font-semibold">
                                                                Confirmed Occupancy{" "}
                                                            </p>
                                                            {houseCOField(item, index)}
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-start">
                                                            {houseCOField(item, index)}
                                                        </div>
                                                    )}
                                                </div>
                                                {type === "action" ? (
                                                    <div className="w-full flex justify-start ">
                                                        <Button
                                                            title={
                                                                findCount(item?.node?.model?.id) === 0
                                                                    ? "Ready for Claim"
                                                                    : "Update"
                                                            }
                                                            color={
                                                                findCount(item?.node?.model?.id) === 0
                                                                    ? "gold"
                                                                    : `primary`
                                                            }
                                                            disabled={checkIfMissingProofPoints(item)}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                let modifiableAddress = item?.node?.pivots.filter(
                                                                    (item) =>
                                                                        item.isModifiable && item.status !== "COMPLETED"
                                                                );
                                                                if (modifiableAddress.length >= 1) {
                                                                    findCount(item?.node?.model?.id) === 0 // check for any proof point missing
                                                                        ? item?.node?.pivots?.filter(
                                                                              (item) =>
                                                                                  item.isModifiable === false &&
                                                                                  item.status === "ACTION_REQUIRED"
                                                                          ) >= 1
                                                                            ? toast.warning(
                                                                                  "This can't be modified currently"
                                                                              )
                                                                            : //Do we maybe want to list the products for that address that are not modifiable
                                                                              mutationObjectCreation(
                                                                                  item,
                                                                                  item?.node?.model?.id,
                                                                                  "REBATE_READY",
                                                                                  true
                                                                              )
                                                                        : item?.node?.pivots?.filter(
                                                                              (item) =>
                                                                                  item.isModifiable === false &&
                                                                                  item.status === "ACTION_REQUIRED"
                                                                          ) >= 1
                                                                        ? toast.warning(
                                                                              "before This can't be modified currently"
                                                                          )
                                                                        : //Do we maybe want to list the products for that address that are not modifiable
                                                                          mutationObjectCreation(
                                                                              item,
                                                                              item?.node?.model?.id,
                                                                              "REBATE_READY",
                                                                              true
                                                                          );
                                                                } else {
                                                                    toast.warning("This can't be modified currently");
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-full flex justify-start ">
                                                        <Button
                                                            disabled={checkIfMissingProofPoints(item)}
                                                            title={"Update"}
                                                            color={`primary`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                let modifiableAddress = item?.node?.pivots.filter(
                                                                    (item) =>
                                                                        item.isModifiable && item.status !== "COMPLETED"
                                                                );
                                                                if (modifiableAddress.length >= 1) {
                                                                    findCount(item?.node?.model?.id) === 0 // check for any proof point missing
                                                                        ? item?.node?.pivots?.filter(
                                                                              (item) =>
                                                                                  item.isModifiable === false &&
                                                                                  (item.status === "REBATE_READY" ||
                                                                                      item.status === "COMPLETED")
                                                                          ) >= 1
                                                                            ? toast.warning(
                                                                                  "This can't be modified currently"
                                                                              )
                                                                            : //Do we maybe want to list the products for that address that are not modifiable
                                                                            item.status === "REBATE_READY"
                                                                            ? mutationObjectCreation(
                                                                                  item,
                                                                                  item?.node?.model?.id,
                                                                                  "REBATE_READY",
                                                                                  false
                                                                              )
                                                                            : mutationObjectCreation(
                                                                                  item,
                                                                                  item?.node?.model?.id,
                                                                                  "COMPLETED",
                                                                                  false
                                                                              )
                                                                        : item?.node?.pivots?.filter(
                                                                              (item) =>
                                                                                  item.isModifiable === false &&
                                                                                  (item.status === "REBATE_READY" ||
                                                                                      item.status === "COMPLETED")
                                                                          ) >= 1
                                                                        ? toast.warning(
                                                                              "before This can't be modified currently"
                                                                          )
                                                                        : //Do we maybe want to list the products for that address that are not modifiable
                                                                        item.status === "REBATE_READY"
                                                                        ? mutationObjectCreation(
                                                                              item,
                                                                              item?.node?.model?.id,
                                                                              "REBATE_READY"
                                                                          )
                                                                        : mutationObjectCreation(
                                                                              item,
                                                                              item?.node?.model?.id,
                                                                              "COMPLETED"
                                                                          );
                                                                } else {
                                                                    toast.warning("This can't be modified currently");
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {calculateProofPointsField(item)?.length > 0 ? (
                                        <span className="mr-5">
                                            {clicked.includes(index) && closeAccordian && type === "action" ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6 text-secondary"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M5 15l7-7 7 7"
                                                    />
                                                </svg>
                                            ) : null}
                                            {!clicked.includes(index) && type === "action" ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="opacity-0 transition-opacity duration-150 h-6 w-6 group-hover:opacity-100 text-secondary"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            ) : null}
                                        </span>
                                    ) : null}
                                </div>
                                {clicked.includes(index) && closeAccordian && type === "action" ? (
                                    <div className="">
                                        {/* <div className="grid grid-cols-1 gap-10 px-10 border-l-6 border-gold py-2 bg-gray-100">
                      {houseProofPointFields(item)}
                    </div> */}
                                        <div className="grid grid-cols-2  gap-10 px-10  border-l-6 border-gold  bg-gray-100">
                                            {proofPointsFields(item)}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default RebateAccordian;
