import { Link } from "react-router-dom";
import Button from "../../../../Buttons";
import TextField from "../../../../FormGroups/Input";
import React, { useState, useEffect } from "react";
import Modal from "../../../../Modal";
import { CheckCircleIcon, ChevronDownIcon, ChevronUpIcon, PlusCircleIcon } from "@heroicons/react/solid";
import { CHANGE_REPORT_STATUS, DELETE_PRODUCT_ADDRESS, UPDATE_REBATE_REPORT } from "../../../../../lib/addresses";
import { SEARCH_PRODUCTS } from "../../../../../lib/search";
import { useLazyQuery, useMutation } from "@apollo/client";
import Loader from "../../../../Loader/Loader";
import {
    EDIT_BUILDER_UPDATE_CLAIM,
    READY_TO_SUBMITTED_CLAIM_UPDATE,
    SEARCH_ELIGIBLE_BUILDER,
    UPDATE_CLAIM_READY,
    UPDATE_VOLUME_CLAIM,
    CALCULATE_CLAIM_ALLOCATION,
    FETCH_VOLUME_CLAIM_TOTALS,
    ASSIGN_ALL_BUILDERS,
    UPDATE_CLAIM_TOTAL_MANUAL_OVERWRITE,
    UPDATE_CLAIM_TOTAL_MANUAL_BUILDER_OVERWRITE,
    REMOVE_CLAIM_TOTAL_MANUAL_BUILDER_OVERWRITE,
} from "../../../../../lib/claims";
import ClaimsAccordion from "./ClaimsAccordion";
import { useDebounce } from "../../../../../util/hooks";
import { toast } from "react-toastify";
import { formatterForCurrency } from "../../../../../util/generic";
import { InputDecimal } from "../../../../InputDecimal/InputDecimal";
import { APP_TITLE } from "../../../../../util/constants";

const StartClaim = ({
    type,
    edit,
    claimNode,
    refetch,
    setClaimTotal,
    claimTotal,
    setBuilderAccordionData,
    builderAccordionData,
    setBuilderExpandData,
    builderExpandData,
    setClaimResult,
    claimResult,
}) => {
    const [clicked, setClicked] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showAssignBuildersModal, setShowAssignBuildersModal] = useState(false);
    const [paymentReduced, setPaymentReduced] = useState(false);
    const [paymentReducedId, setPaymentReducedId] = useState(null);
    const [readyRebate, setReadyRebate] = useState(false);
    const [actionRebate, setActionRebate] = useState(false);
    const [claim, setClaim] = useState();
    const [centerColumnEdited, setCenterColumnEdited] = useState(false);
    const [totalPaymentRebate, setTotalPaymentRebate] = useState();
    const [searchProductString, setSearchProductString] = useState("");
    const [modalProducts, setModalProducts] = useState();
    const [activeProducts, setActiveProducts] = useState([]);
    const [shouldChangeStatus, setShouldChangeStatus] = useState(false);
    const [productPerBundle, setProductsPerBundle] = useState([]);
    const [mutation, setMutation] = useState(false);
    const [reportId, setReportId] = useState();
    const [productIds, setProductIds] = useState();
    const [rebateReports, setRebateReports] = useState();
    const [activeBuilder, setActiveBuilder] = useState();
    const [displayProofPoints, setDisplayProofPoints] = useState();
    const [centerColumnBuilderList, setCenterColumnBuilderList] = useState([]);
    const [volumeFields, setVolumeFields] = useState();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [fields, setFields] = useState();
    const [error, setError] = useState();
    const [confirmEdit, setConfirmEdit] = useState([]);
    const [searchEdit, setSearchEdit] = useState([]);
    const [searchError, setSearchError] = useState();
    const [productNode, setProductNode] = useState();
    const [searchFields, setSearchFields] = useState();
    const [refusedChanges, setRefusedChanges] = useState();
    const [showRefusedModal, setShowRefusedModal] = useState();
    const [searchVolumeBuilders, setSearchVolumeBuilders] = useState();
    const [rebatesIdsAssignAllBuilders, setRebatesIdsAssignAllBuilders] = useState();
    const [overwriteTotal, setOverwriteTotal] = useState();
    const [overwriteTotalValue, setOverwriteTotalValue] = useState();
    const [overwriteTotalNoteValue, setOverwriteTotalNoteValue] = useState();
    const [overwriteTotalBuilder, setOverwriteTotalBuilder] = useState();
    const [overwriteTotalBuilderFlat, setOverwriteTotalBuilderFlat] = useState();
    const [overwriteTotalBuilderValue, setOverwriteTotalBuilderValue] = useState();
    const [overwriteTotalBuilderValueFlat, setOverwriteTotalBuilderValueFlat] = useState();
    const [overwriteTotalBBGValueFlat, setOverwriteTotalBBGValueFlat] = useState();
    const [overwriteTotalBuilderNoteValue, setOverwriteTotalBuilderNoteValue] = useState();
    const [builderId, setBuilderId] = useState();
    const [readyHouses, setReadyHouses] = useState();
    const [needActionHouses, setNeedActionHouses] = useState();
    const [builderData, setBuilderData] = useState();
    const [modalSearch, setModalSearch] = useState(false);
    const [modalTitle, setModalTitle] = useState({
        id: "",
        name: "",
    });
    const [addressIsModifiable, setAddressIsModifiable] = useState();
    const [removeClaimManualBuilderOverwriteBoolean, setRemoveClaimManualBuilderOverwriteBoolean] = useState(false);

    const paymentReducedCheckBox = (id, value) => {
        setPaymentReducedId(id);
        if ((value || value === 0) && paymentReduced) {
            setPaymentReduced(false);
            setVolumeFields({
                ...volumeFields,
                [paymentReducedId]: {
                    ...volumeFields[paymentReducedId],
                    id: paymentReducedId,
                    rebate_adjusted: NaN,
                },
            });
        } else {
            setPaymentReduced(!paymentReduced);
        }
    };

    useEffect(() => {
        setClaim(claimNode);
        if (!claimTotal && claimTotal !== 0) {
            setClaimTotal(claimNode?.calculateCurrentTotal?.total);
        }
        // eslint-disable-next-line
    }, [claimNode]);

    useEffect(() => {
        if (builderExpandData?.factory_overwrite?.overwrite) {
            setOverwriteTotalBuilderValue(builderExpandData?.factory_overwrite?.overwrite);
        }
        if (builderExpandData?.factory_overwrite?.builder_allocation) {
            setOverwriteTotalBuilderValueFlat(builderExpandData?.factory_overwrite?.builder_allocation);
        }
        if (
            builderExpandData?.factory_overwrite?.total_allocation &&
            builderExpandData?.factory_overwrite?.builder_allocation
        ) {
            setOverwriteTotalBBGValueFlat(
                builderExpandData?.factory_overwrite?.total_allocation -
                    builderExpandData?.factory_overwrite?.builder_allocation
            );
        }
        // eslint-disable-next-line
    }, [builderExpandData]);

    const sortArray = (items) => {
        let copyItems = items?.slice();
        let sortedArray = copyItems?.sort((a, b) => a.name.localeCompare(b.name));
        return sortedArray;
    };

    useEffect(() => {
        setTotalPaymentRebate(claim?.total_payment_rebate || claimNode?.total_payment_rebate);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setTotalPaymentRebate(claim?.total_payment_rebate);
        // eslint-disable-next-line
    }, [claim]);

    useEffect(() => {
        setOverwriteTotalBuilderValue(null);
        // eslint-disable-next-line
    }, [builderExpandData]);

    const toggle = (index) => {
        if (clicked === index) {
            //if clicked question is already active, then close it
            return setClicked(null);
        }
        setCenterColumnEdited(false);
        setClicked(index);
    };

    const [changeStatus] = useMutation(CHANGE_REPORT_STATUS, {
        variables: {
            rebateReport_id: reportId,
            house_id: modalTitle?.id,
            status: "ACTION_REQUIRED",
        },
        update(cache, result) {
            setShouldChangeStatus(false);
        },
    });

    const debouncedValue = useDebounce(searchProductString, 160);

    useEffect(() => {
        if (searchProductString && searchProductString.length > 1) {
            searchProducts({
                variables: {
                    search: debouncedValue,
                },
            });
        }
        // eslint-disable-next-line
    }, [debouncedValue]);

    const [searchProducts, { data: searchedProducts, loading: searchedLoading }] = useLazyQuery(SEARCH_PRODUCTS, {
        notifyOnNetworkStatusChange: false,
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        if (mutation === true) {
            unassignProduct();
        }
        // eslint-disable-next-line
    }, [mutation]);

    useEffect(() => {
        if (overwriteTotal === true && overwriteTotalValue !== undefined) {
            updateClaimManualOverwrite();
        } else if (overwriteTotal === true && (overwriteTotalValue === undefined || isNaN(overwriteTotalValue))) {
            toast.warning("An overwrite value must be set");
            setOverwriteTotal(false);
        }
        // eslint-disable-next-line
    }, [overwriteTotal]);

    useEffect(() => {
        if (overwriteTotalBuilder === true && overwriteTotalBuilderValue !== undefined) {
            updateClaimManualBuilderOverwrite();
        } else if (
            overwriteTotalBuilder === true &&
            (overwriteTotalBuilderValue === undefined || isNaN(overwriteTotalBuilderValue))
        ) {
            toast.warning("An overwrite value must be set");
            setOverwriteTotalBuilder(false);
        }
        // eslint-disable-next-line
    }, [overwriteTotalBuilder]);

    useEffect(() => {
        if (
            overwriteTotalBuilderFlat === true &&
            overwriteTotalBuilderValueFlat !== undefined &&
            overwriteTotalBBGValueFlat !== undefined
        ) {
            updateClaimManualBuilderOverwrite();
        } else if (
            overwriteTotalBuilderFlat === true &&
            (overwriteTotalBuilderValueFlat === undefined || isNaN(overwriteTotalBuilderValueFlat))
        ) {
            toast.warning("A builder overwrite value must be set");
            setOverwriteTotalBuilderFlat(false);
        } else if (
            overwriteTotalBuilderFlat === true &&
            (overwriteTotalBBGValueFlat === undefined || isNaN(overwriteTotalBBGValueFlat))
        ) {
            toast.warning("A BBG overwrite value must be set");
            setOverwriteTotalBuilderFlat(false);
        }
        // eslint-disable-next-line
    }, [overwriteTotalBuilderFlat]);

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
            setModalProducts(modalProducts.filter((item) => !productIds.includes(item?.id)));
            refetch(claim?.id, claim?.program?.type);
        },
    });

    const [updateClaimManualOverwrite] = useMutation(UPDATE_CLAIM_TOTAL_MANUAL_OVERWRITE, {
        variables: {
            id: claim?.id,
            total_manual_set: overwriteTotal,
            report_total: overwriteTotalValue,
            overwrite_note: overwriteTotalNoteValue,
        },
        update(cache, result) {
            setOverwriteTotal(false);
            setShowConfirmModal(false);
            setClaimTotal(result?.data?.updateClaim?.report_total);
            setClaim({ ...claim, ...result?.data?.updateClaim });
            setClaimResult({ ...claim, ...result?.data?.updateClaim });
            toast.success(`Claim manual overwrite set to: ${formatterForCurrency.format(overwriteTotalValue)}`);
        },
        onError(error) {
            console.error(error);
            toast.error("Error setting manual overwrite");
        },
    });

    const [removeClaimManualOverwrite] = useMutation(UPDATE_CLAIM_TOTAL_MANUAL_OVERWRITE, {
        variables: {
            id: claim?.id,
            total_manual_set: false,
            report_total: claim?.calculateCurrentTotal?.total,
            overwrite_note: null,
        },
        update(cache, result) {
            setOverwriteTotal(false);
            setShowConfirmModal(false);
            setClaimTotal(result?.data?.updateClaim?.report_total);
            setClaim({ ...claim, ...result?.data?.updateClaim });
            setClaimResult({ ...claim, ...result?.data?.updateClaim });
            toast.success(`Reset overwrite to: ${formatterForCurrency.format(claim?.calculateCurrentTotal?.total)}`);
        },
        onError(error) {
            console.error(error);
            toast.error("Error removing manual overwrite");
        },
    });

    const [updateClaimManualBuilderOverwrite] = useMutation(UPDATE_CLAIM_TOTAL_MANUAL_BUILDER_OVERWRITE, {
        variables: {
            id: claim?.id,
            builderId: builderId,
            builderOverwrite: overwriteTotalBuilderValue,
            builderOverwriteFlat: overwriteTotalBuilderValueFlat,
            bbgOverwrite: overwriteTotalBBGValueFlat,
            note: overwriteTotalBuilderNoteValue,
        },
        update(cache, result) {
            setBuilderId(null);
            setOverwriteTotalBuilder(false);
            setOverwriteTotalBuilderFlat(false);
            setBuilderExpandData({
                ...builderExpandData,
                ...result?.data?.updateClaim?.calculateCurrentTotal?.builderTotals?.find(
                    (item) => parseInt(item?.builder_id) === builderId
                ),
            });
            setClaimTotal(result?.data?.updateClaim?.report_total);
            setClaim({ ...claim, ...result?.data?.updateClaim });
            setClaimResult({ ...claim, ...result?.data?.updateClaim });
            setBuilderAccordionData(result?.data?.updateClaim?.calculateCurrentTotal?.builderTotals);
            if (!claimNode?.program?.is_flat_rebate) {
                toast.success(
                    `Builder manual overwrite set to: ${formatterForCurrency.format(overwriteTotalBuilderValue)}`
                );
            } else {
                toast.success(
                    `Builder manual overwrite set to: ${formatterForCurrency.format(overwriteTotalBuilderValueFlat)}`
                );
                toast.success(
                    `BBG manual overwrite set to: ${formatterForCurrency.format(overwriteTotalBBGValueFlat)}`
                );
            }
        },
        onError(error) {
            console.error(error);
            setOverwriteTotalBuilder(false);
            setOverwriteTotalBuilderFlat(false);
            toast.error("Error setting manual overwrite");
        },
    });

    const [removeClaimManualBuilderOverwrite] = useMutation(REMOVE_CLAIM_TOTAL_MANUAL_BUILDER_OVERWRITE, {
        update(cache, result) {
            setBuilderId(null);
            setOverwriteTotalBuilder(false);
            setOverwriteTotalBuilderFlat(false);
            setBuilderExpandData({
                ...builderExpandData,
                ...result?.data?.updateClaim?.calculateCurrentTotal?.builderTotals?.find(
                    (item) => parseInt(item?.builder_id) === builderId
                ),
            });
            setClaimTotal(result?.data?.updateClaim?.report_total);
            setClaim({ ...claim, ...result?.data?.updateClaim });
            setClaimResult({ ...claim, ...result?.data?.updateClaim });
            setRemoveClaimManualBuilderOverwriteBoolean(false);
            setBuilderAccordionData(result?.data?.updateClaim?.calculateCurrentTotal?.builderTotals);
            toast.success(`Builder overwrite has been successfully removed`);
        },
        onError(error) {
            console.error(error);
            setOverwriteTotalBuilder(false);
            setOverwriteTotalBuilderFlat(false);
            setRemoveClaimManualBuilderOverwriteBoolean(false);
            toast.error("Error setting manual overwrite");
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
                productProofPointsArray.forEach((array) => {
                    if (
                        eachProgram.node[array] &&
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
                        object.rebateReportPivot = eachData?.rebateReportPivot;
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

    const removeProduct = (productId) => {
        setProductIds([productId]);
        setMutation(true);
    };

    const handleQuantityChange = (eachPackage, e, type) => {
        setConfirmEdit([...confirmEdit, eachPackage?.id]);
        setFields({
            ...fields,
            [parseInt(eachPackage?.id)]: e.target.value,
        });
        setProductNode(eachPackage);
    };

    const handleTotalOverwriteChange = (e) => {
        setOverwriteTotalValue(parseFloat(e.target.value));
    };

    const handleTotalOverwriteBuilderChange = (e) => {
        if (!isNaN(parseFloat(e.target.value))) {
            setOverwriteTotalBuilderValue(parseFloat(e.target.value));
        } else {
            setOverwriteTotalBuilderValue(null);
        }
    };

    const handleTotalOverwriteBuilderChangeFlat = (e) => {
        if (!isNaN(parseFloat(e.target.value))) {
            setOverwriteTotalBuilderValueFlat(parseFloat(e.target.value));
        } else {
            setOverwriteTotalBuilderValueFlat(null);
        }
    };

    const handleTotalOverwriteBBGChangeFlat = (e) => {
        if (!isNaN(parseFloat(e.target.value))) {
            setOverwriteTotalBBGValueFlat(parseFloat(e.target.value));
        } else {
            setOverwriteTotalBBGValueFlat(null);
        }
    };

    const handleTotalOverwriteNoteChange = (e) => {
        setOverwriteTotalNoteValue(e.target.value);
    };

    const handleTotalOverwriteBuilderNoteChange = (e) => {
        setOverwriteTotalBuilderNoteValue(e.target.value);
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
        } else {
            setSearchError({
                ...searchError,
                [parseInt(productNode?.id)]: false,
            });
        }
        // eslint-disable-next-line
    }, [searchFields, productPerBundle, productNode]);

    const dataFormat = () => {
        let array = [];

        productPerBundle &&
            productPerBundle.length > 0 &&
            // eslint-disable-next-line
            productPerBundle.map((item) => {
                let object = {};
                object.id = parseInt(item?.id);
                object.quantity = fields && fields[item?.id] ? parseInt(fields[item?.id]) : item?.product_quantity;
                array.push(object);
            });
        return array;
    };

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
                                        {eachData?.product?.bbg_product_code ? (
                                            <p className=" text-gray-500">{eachData?.product?.bbg_product_code}</p>
                                        ) : null}
                                        <p className=" text-gray-500">{eachData?.product?.name}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ul>
            </div>
        );
    };

    const confirmModalContent = () => {
        return (
            <div className="flex flex-col px-6">
                <div className="flex w-full justify-end">
                    <Button
                        title="Add Product"
                        color="primary"
                        disabled={claim?.status === "PROCESSING" ? !(claim?.status === "PROCESSING") : false}
                        onClick={() => {
                            setModalSearch(true);
                            setSearchProductString("");
                        }}
                    />
                </div>
                <div className=" border rounded-lg overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 max-h-smallMin">
                    <ul className={`flex-0 w-full ${type === "completed" ? "opacity-25 pointer-events-none" : ""}`}>
                        {modalProducts &&
                            modalProducts.length > 0 &&
                            modalProducts.map((eachPackage) => {
                                return (
                                    <li className={`border-b border-l-6 border-l-gold`}>
                                        <Link to="#" className="block hover:bg-gray-50">
                                            <div className="flex items-center px-4 py-4 sm:px-6">
                                                <div className="min-w-0 flex-1 flex">
                                                    <div className="min-w-0 flex-1 px-2 md:grid md:grid-cols-2 items-center">
                                                        <div className="flex flex-col">
                                                            <div className="flex flex-col text-xs text-gray-500 italic">
                                                                {eachPackage.category && eachPackage.category.name}
                                                            </div>
                                                            <div className="group relative   flex justify-between items-center">
                                                                <p className="text-sm font-semibold text-gray-500">
                                                                    <Link to="#" className="  focus:outline-none">
                                                                        <span
                                                                            className="absolute inset-0"
                                                                            aria-hidden="true"
                                                                        ></span>
                                                                        {eachPackage?.bbg_product_code
                                                                            ? eachPackage?.bbg_product_code + " - "
                                                                            : ""}
                                                                        {eachPackage.name}
                                                                    </Link>
                                                                </p>
                                                            </div>
                                                            <div className=" flex flex-col text-xs text-gray-500">
                                                                {eachPackage?.programs?.length > 0 &&
                                                                    eachPackage?.programs?.map((item) => {
                                                                        return (
                                                                            <div className="flex flex-col">
                                                                                <span className="">{item.name}</span>
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
                                                                        confirmEdit?.includes(eachPackage?.id)
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
                                                <div
                                                    onClick={() => {
                                                        if (addressIsModifiable) {
                                                            removeProduct(eachPackage.id);
                                                        } else {
                                                            toast.warning("This can't be modified currently");
                                                        }
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

    const assignBuildersModalContent = () => {
        return (
            <div className="flex flex-col px-6">
                <p className="text-brickRed font-semibold">Assigning all builders might take a while. </p>
                <p className="text-brickRed font-semibold">
                    Changes that modify the claim will be prohibited while this action is taking place.
                </p>
                <p className="text-brickRed font-semibold">Are you sure you want to do this? </p>
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
                <div className=" overflow-auto max-h-smallMin scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
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
                                                            <div className="flex flex-col text-xs text-gray-500 italic">
                                                                {eachPackage.node.category &&
                                                                    eachPackage.node.category.name}
                                                            </div>
                                                            <div className="group relative   flex justify-between items-center">
                                                                <p className="text-sm font-semibold text-gray-500">
                                                                    <Link to="#" className="  focus:outline-none">
                                                                        <span className="" aria-hidden="true"></span>
                                                                        {eachPackage?.node?.bbg_product_code
                                                                            ? eachPackage?.node?.bbg_product_code +
                                                                              " - "
                                                                            : ""}
                                                                        {eachPackage.node.name}
                                                                    </Link>
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
                                                            eachPackage?.node?.require_quantity_reporting ? (
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
                                                            ) : eachPackage?.node?.minimum_unit ? (
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
                                                        if (claim?.status !== "PROCESSING") {
                                                            addProductToAddress(
                                                                eachPackage?.node,
                                                                modalTitle?.id,
                                                                "action"
                                                            );
                                                        } else {
                                                            toast.warning("The claim is processing, try again later");
                                                        }
                                                    }}
                                                >
                                                    {modalProducts
                                                        ?.map((item) => parseInt(item?.id))
                                                        ?.includes(parseInt(eachPackage.node.id)) ||
                                                    activeProducts?.includes(parseInt(eachPackage?.node?.id)) ? (
                                                        "Added"
                                                    ) : (
                                                        <PlusCircleIcon className="w-8 h-8 text-brickGreen" />
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
        setSearchError({});
        setProductNode({});
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
                    submitLabel={modalSearch ? "confirm" : "Confirm"}
                    onClose={() => (modalSearch ? handleClose() : modalSearchOffClose())}
                    IconJSX={modalSearch ? null : <PlusCircleIcon className="w-10 h-10 text-brickGreen" />}
                    show={showModal}
                />
            </>
        );
    };

    const assignAllBuildersModal = () => {
        return (
            <>
                <Modal
                    onSubmit={() => {
                        let rebatesIds = [];

                        //TODO: when "rebateReports" will be phased out in the BE we will be able to phase out of the following loops
                        claim?.buildersWithOpenRebateBeforeEndDate?.forEach((builder) => {
                            builder?.rebateReports?.forEach((rebateReport) => {
                                rebateReport?.ReadiedHouses?.forEach((readiedHouse) => {
                                    readiedHouse?.pivots?.forEach((rebate) => {
                                        rebatesIds.push(rebate?.id);
                                    });
                                });
                            });
                        });

                        let uniqueArray = [...new Set(rebatesIds)];
                        setRebatesIdsAssignAllBuilders(uniqueArray);
                    }}
                    title={"Assign All Builders To This Claim"}
                    width={"2xl"}
                    Content={assignBuildersModalContent()}
                    submitLabelColor={"primary"}
                    submitLabel={"Confirm"}
                    onClose={() => setShowAssignBuildersModal(false)}
                    show={showAssignBuildersModal}
                />
            </>
        );
    };

    const approveClaimContent = () => {
        return (
            <div className="flex flex-col flex-1 overflow-auto w-full">
                <p className="px-6 text-gray-500   font-medium text-lg">
                    Please click Approve Claim to move this claim to{" "}
                    {claim?.program?.type === "VOLUME" ? "Closed" : "Ready For Submittal"} , or go back and select a
                    builder to continue making updates.
                </p>
                <div className="grid grid-cols-2">
                    <div className="grid grid-cols-1">
                        <p className="px-6 text-gray-700 font-medium text-lg mt-5">Current total:</p>
                        <p className="px-6 text-secondary font-medium text-lg">
                            {formatterForCurrency.format(claimTotal)}
                        </p>
                    </div>
                    <div className="grid grid-cols-1">
                        <label htmlFor="claimTotalOverwrite" className=" text-gray-700 font-medium text-lg mt-5">
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
                            <InputDecimal
                                name="claimTotalOverwrite"
                                id="claimTotalOverwrite"
                                placeholder="Overwrite total value"
                                defaultValue={typeof claimTotal === "number" ? claimTotal.toFixed(2) : null}
                                className={`w-10/12 mb-1 pt-0.5 pb-0 pl-0.5 rounded-lg rounded-b-none min-w-0 border-0 border-b-2 border-gray-400 text-secondary font-medium text-lg outline-none focus:outline-none focus:ring-0`}
                                onChangeFunction={(e) => {
                                    handleTotalOverwriteChange(e);
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2">
                    <label htmlFor="claimTotalOverwriteNote" className=" px-6 text-gray-700 font-medium text-lg mt-5">
                        Overwrite Note:
                    </label>
                    <textarea
                        type="text"
                        name="claimTotalOverwriteNote"
                        id="claimTotalOverwriteNote"
                        placeholder="Overwrite Note"
                        defaultValue={claim?.overwrite_note ? claim?.overwrite_note : null}
                        className={`w-10/12 mb-1 ml-2 pt-0.5 pb-0 pl-0.5 rounded-lg rounded-b-none min-w-0 border-0 border-b-2 border-gray-400 text-darkGray75 font-body text-md outline-none focus:outline-none focus:ring-0`}
                        onChange={(e) => {
                            handleTotalOverwriteNoteChange(e);
                        }}
                    />
                </div>
            </div>
        );
    };

    const confirmModal = () => {
        return (
            <>
                <Modal
                    onSubmit={() => submitClaim()}
                    title={"Are you sure?"}
                    width={"lg"}
                    Content={approveClaimContent()}
                    submitLabelColor={"primary"}
                    submitLabel={"Approve Claim"}
                    onClose={() => setShowConfirmModal(false)}
                    show={showConfirmModal}
                    extraLabelColor={"primary"}
                    extraActionButton
                    extraLabel={"Overwrite Total"}
                    extraAction={() => setOverwriteTotal(true)}
                />
            </>
        );
    };

    const [submitClaim] = useMutation(UPDATE_CLAIM_READY, {
        variables: {
            status: claim?.program?.type === "VOLUME" ? "READYTOCLOSE" : "READY",
            id: claim?.id,
        },
        update(cache, result) {
            setShowConfirmModal(false);
            setClaim(result?.data?.updateClaim);
            setClaimResult(result?.data?.updateClaim);
            toast.success(claim?.program?.type === "VOLUME" ? "Claim Approved" : "Claim Submitted");
        },
    });

    const [assignAllBuildersMutation] = useMutation(ASSIGN_ALL_BUILDERS, {
        variables: {
            id: claim?.id,
            rebatesIds: rebatesIdsAssignAllBuilders,
        },
        update() {
            setShowAssignBuildersModal(false);
            setRebatesIdsAssignAllBuilders(null);
            toast.success("The claim is now being processed and it might take some time to finish.");
            refetch(claim?.id, claim?.program?.type);
        },
    });

    useEffect(() => {
        if (rebatesIdsAssignAllBuilders?.length > 0 && claim?.status !== "PROCESSING") {
            assignAllBuildersMutation();
        } else if (rebatesIdsAssignAllBuilders?.length === 0 && claim?.status !== "PROCESSING") {
            toast.warning("This claim doesn't have any builders assigned.");
        } else if (claim?.status === "PROCESSING") {
            toast.warning("This claim is being processed currently, please wait.");
        }
    }, [rebatesIdsAssignAllBuilders, assignAllBuildersMutation, claim?.status]);

    const [updateReport] = useMutation(UPDATE_REBATE_REPORT, {
        variables: {
            id: parseInt(reportId),
            houses: [parseInt(modalTitle.id)],
            products: dataFormat(),
        },
        update(cache, result) {
            setShowModal(false);
            setModalSearch(false);
            let productLength = productPerBundle.length;
            setProductsPerBundle([]);
            setActiveProducts([]);

            if (result?.data?.updateRebateReportAndMassAssign?.refusedChanges?.length > 0) {
                setRefusedChanges(result?.data?.updateRebateReportAndMassAssign?.refusedChanges);
                setShowRefusedModal(true);
            } else {
                toast.success(
                    `Assigned ${productLength > 1 ? productLength + " Products" : productLength + " Product"} to  ${
                        modalTitle?.name
                    } `
                );
                if (shouldChangeStatus === true) {
                    changeStatus();
                }
            }
            refetch(claim?.id, claim?.program?.type);
        },
    });

    const handleAllocationUpdate = () => {
        updateClaims();
    };

    const [updateClaims, { loading: updateClaimsLoading }] = useMutation(READY_TO_SUBMITTED_CLAIM_UPDATE, {
        variables: {
            rebateReports: rebateReports,
            id: claim?.id,
        },
        update(cache, result) {
            setClaim({ ...claim, ...result?.data?.updateClaim });
            setClaimResult({ ...claim, ...result?.data?.updateClaim });
            setClaimTotal(result?.data?.updateClaim?.calculateCurrentTotal?.total);
            setBuilderAccordionData(result?.data?.updateClaim?.calculateCurrentTotal?.builderTotals);
            setActiveBuilder("");
            toast.success("Factory Allocation Complete");
        },
    });

    const [getTotalVolumeValues, { loading: getTotalVolumeValuesLoading }] = useLazyQuery(FETCH_VOLUME_CLAIM_TOTALS, {
        variables: {
            id: claim?.id,
        },
        notifyOnNetworkStatusChange: false,
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            setTotalPaymentRebate(data?.claim?.calculateCurrentTotal?.total);
            setBuilderAccordionData(data?.claim?.calculateCurrentTotal?.builderTotals);
        },
        onError: (error) => {
            console.error(error);
            toast.warning("error");
        },
    });

    const [calculateClaimAllocationBuilderOverwrite, { loading: calculateClaimAllocationLoading }] = useMutation(
        CALCULATE_CLAIM_ALLOCATION,
        {
            update(cache, result) {
                setClaimTotal(result?.data?.calculateIndividualBuilderClaimAllocation?.calculateCurrentTotal?.total);
            },
        }
    );

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
            }
        },
    });

    const handleModal = (node) => {
        setConfirmEdit([]);
        setSearchEdit([]);
        setFields({});
        setError({});
        setSearchError({});
        setProductNode({});
        if (node?.pivots?.filter((item) => !item.isModifiable).length) {
            setAddressIsModifiable(false);
        } else {
            setAddressIsModifiable(true);
        }
        setModalTitle({
            id: node?.model?.id,
            name: node?.model?.address,
        });
        setModalProducts(
            node?.pivots?.map((item) => {
                let object = {};
                object = { ...item?.products?.[0] };
                object.product_quantity = item?.product_quantity;
                object.minimum_unit = item?.products?.minimum_unit;
                return object;
            })
        );

        setShowModal(true);
    };

    const refusedModal = () => {
        return (
            <>
                <Modal
                    title={`House-Products already claimed`}
                    Content={refusedContent()}
                    submitLabel="Confirm"
                    onSubmit={() => setShowRefusedModal(false)}
                    onClose={() => setShowRefusedModal(false)}
                    show={showRefusedModal}
                    width={"2xl"}
                />
            </>
        );
    };

    const toggleProofPoints = (i) => {
        if (displayProofPoints === i) {
            setDisplayProofPoints("");
        } else {
            setDisplayProofPoints(i);
        }
    };

    const extractProofPoints = (items) => {
        let proofPoints = items?.[0]?.requireFieldStatusPerHouse;
        return (
            <div className="flex flex-col">
                {proofPoints?.model_number_correct ? null : (
                    <div className="text-secondary font-body text-md underline">Model Number missing!</div>
                )}
                {proofPoints?.serial_number_correct ? null : (
                    <div className="text-secondary font-body text-md underline">Serial Number missing!</div>
                )}
                {proofPoints?.distributor_correct ? null : (
                    <div className="text-secondary font-body text-md underline">Distributor missing!</div>
                )}
                {proofPoints?.date_of_purchase_correct ? null : (
                    <div className="text-secondary font-body text-md underline">Date of Purchase missing!</div>
                )}
                {proofPoints?.date_of_installation_correct ? null : (
                    <div className="text-secondary font-body text-md underline">Date of Installation missing!</div>
                )}
                {proofPoints?.certificate_occupancy_correct ? null : (
                    <div className="text-secondary font-body text-md underline">Certificate of Occupancy missing!</div>
                )}
                {proofPoints?.brand_correct ? null : (
                    <div className="text-secondary font-body text-md underline">Brand missing!</div>
                )}
            </div>
        );
    };

    const actionHousesAccordianComponent = () => {
        let count = 0;
        readyHouses?.forEach((item) => {
            item?.node?.forEach((element) => {
                count++;
            });
        });

        return (
            <ul
                style={{ marginBottom: count > 9 ? "135px" : "112px" }}
                className="flex-0 w-full  overflow-auto border-l  border-r border-white scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400"
            >
                {needActionHouses?.map((item, index) => {
                    return (
                        <li
                            className={` transition-all border-t border-b cursor-pointer border-l-4 hover:bg-gray-100 ${
                                displayProofPoints === index ? "border-l-4 border-l-gold" : "border-l-primary"
                            } `}
                            onClick={() => toggleProofPoints(index)}
                        >
                            <div className={`py-2 px-4 text-sm text-darkgray75`}>
                                <div className="flex flex-col items-start justify-start">
                                    {item?.model?.lot_number ? (
                                        <p className="text-gray-500 font-semibold">Lot: {item?.model?.lot_number}</p>
                                    ) : null}
                                    {item?.model?.address2 !== null && item?.model?.address2?.trim() !== "" ? (
                                        <p className="text-gray-500 font-semibold">
                                            {item?.model?.address2} - {item?.model?.address}
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 font-semibold">{item?.model?.address}</p>
                                    )}
                                    {item?.model?.project_number ? (
                                        <p className="text-gray-500">Project: {item?.model?.project_number}</p>
                                    ) : null}
                                    {item?.model?.model ? (
                                        <p className="text-gray-500 capitalize">Build Model: {item?.model?.model}</p>
                                    ) : null}
                                </div>
                            </div>
                            {displayProofPoints === index ? (
                                <div className="px-4">{extractProofPoints(item?.pivots)}</div>
                            ) : null}
                        </li>
                    );
                })}
            </ul>
        );
    };

    const readyHousesAccordianComponent = () => {
        return (
            <ul className=" flex-0 w-full  overflow-auto border-l max-h-48  border-r border-white scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                {readyHouses?.map((insideItem) => {
                    return insideItem?.node?.map((item) => {
                        return (
                            <li
                                className={` transition-all border-t border-b hover:bg-gray-100 `}
                                onClick={() => {
                                    handleModal(item);
                                    setReportId(insideItem?.reportId);
                                }}
                            >
                                <div className={`py-2 px-4 text-sm text-darkgray75 flex justify-between items-center`}>
                                    <div className="flex flex-col items-start justify-start">
                                        {item?.model?.lot_number ? (
                                            <p className="text-gray-500 font-semibold">
                                                Lot: {item?.model?.lot_number}
                                            </p>
                                        ) : null}
                                        {item?.model?.address2 !== null && item?.model?.address2?.trim() !== "" ? (
                                            <p className="text-gray-500 font-semibold">
                                                {item?.model?.address2} - {item?.model?.address}
                                            </p>
                                        ) : (
                                            <p>{item?.model?.address}</p>
                                        )}
                                        {item?.model?.project_number?.trim() ? (
                                            <p className="text-gray-500">Project: {item?.model?.project_number}</p>
                                        ) : null}
                                        {item?.model?.model ? (
                                            <p className="text-gray-500 capitalize">
                                                Build Model: {item?.model?.model}
                                            </p>
                                        ) : null}
                                    </div>
                                    <p className="text-gray-500 font-semibold pr-4">{item?.pivots?.length}</p>
                                </div>
                            </li>
                        );
                    });
                })}
            </ul>
        );
    };

    const handleBuilderClick = (data) => {
        if (claim?.claim_type === "FACTORY" || claim?.program?.type === "FACTORY") {
            setBuilderData(data);
            setActiveBuilder(data?.id);
            getReadyHouses(data);
            getActionRequiredHouses(data);
        } else if (claim?.claim_type === "VOLUME" || claim?.program?.type === "VOLUME") {
            let object = {};
            object.rebate_earned = "";
            object.rebate_adjusted = "";
            object.note = "";
            object.builder_allocation = "";
            object.total_allocation = "";
            object.name = data?.name;
            object.id = data?.id;

            let alreadyThere = centerColumnBuilderList?.findIndex((element) => element?.id === data?.id) > -1;
            if (!alreadyThere) {
                setCenterColumnBuilderList([...centerColumnBuilderList, object]);
            }
        }
    };

    useEffect(() => {
        let array = [];
        let volumeFields = {};
        claim?.volumeClaimsBuilderRebates?.edges?.forEach((item) => {
            let object = {};
            object.id = item?.node?.volumeClaimsBuilderRebatesPivot?.builder_id;
            object.name = item?.node?.name;
            object.rebate_earned = parseFloat(item?.node?.volumeClaimsBuilderRebatesPivot?.rebate_earned);
            object.rebate_adjusted = parseFloat(item?.node?.volumeClaimsBuilderRebatesPivot?.rebate_adjusted);
            object.note = item?.node?.volumeClaimsBuilderRebatesPivot?.note;
            array.push(object);

            volumeFields[item?.node?.volumeClaimsBuilderRebatesPivot?.builder_id] = object;
        });

        setCenterColumnBuilderList(array);
        setVolumeFields(volumeFields);
        if (claim?.program?.type === "VOLUME") {
            getTotalVolumeValues();
        }
    }, [claim?.volumeClaimsBuilderRebates, claim?.program?.type, getTotalVolumeValues]);

    const handleCenterColumnChange = (e, item) => {
        const { name, value } = e.target;
        setCenterColumnEdited(true);
        if (value || value === 0) {
            setPaymentReduced(true);
        }
        if (volumeFields) {
            setVolumeFields({
                ...volumeFields,
                [item.id]: {
                    ...volumeFields[item?.id],
                    id: item?.id,
                    [name]: value,
                },
            });
        } else {
            setVolumeFields({
                ...volumeFields,
                [item.id]: {
                    id: item?.id,
                    [name]: value,
                },
            });
        }
    };

    const getReadyHouses = (data) => {
        let array = [];
        let rebateReportArray = [];
        data?.rebateReports?.forEach((item) => {
            let object = {};
            let reportObject = {};
            let houseArray = [];
            object.reportId = item?.id;
            reportObject.id = item?.id;
            item?.ReadiedHouses?.forEach((insideItem) => houseArray.push(insideItem));
            object.node = houseArray;
            rebateReportArray.push(reportObject);
            array.push(object);
        });
        setRebateReports(rebateReportArray);
        extractThePivotIds(array);
        setReadyHouses(array);
    };

    const extractThePivotIds = (array) => {
        let ids = [];
        array[0]?.node?.forEach((item) => {
            item?.pivots?.forEach((insideItem) => {
                ids.push({ id: insideItem?.id });
            });
        });
        setRebateReports(ids);
    };

    const getActionRequiredHouses = (data) => {
        let array = [];
        let object = {};
        let propertyWithoutCoCount = 0;
        let propertyWithoutAddressCount = 0;
        data?.rebateReports?.forEach((item) => {
            propertyWithoutAddressCount = propertyWithoutAddressCount + item?.NeedActionHousesMissingAddressCount;
            propertyWithoutCoCount = propertyWithoutCoCount + item?.NeedActionHousesMissingCoCount;
            item?.NeedActionHousesWithCoAndAddress?.forEach((insideItem) => array.push(insideItem));
        });

        object.NeedActionHousesMissingCoCount = propertyWithoutCoCount;
        object.NeedActionHousesMissingAddressCount = propertyWithoutAddressCount;
        setNeedActionHouses(array);
    };

    useEffect(() => {
        if (builderId && removeClaimManualBuilderOverwriteBoolean) {
            removeClaimManualBuilderOverwrite({
                variables: {
                    id: claim?.id,
                    builderId: [builderId],
                },
            });
        }
        // eslint-disable-next-line
    }, [builderId, removeClaimManualBuilderOverwriteBoolean]);

    const accordianComponent = () => {
        return (
            <div className="flex flex-col py-1">
                <div className="flex px-4">
                    <p className="flex-1 text-darkGray75 font-body text-md ">
                        Builder Allocation{" "}
                        {builderExpandData?.builder_tier && !claimNode?.program?.is_flat_rebate
                            ? "- " + builderExpandData?.builder_tier.replace("_", " ")
                            : ""}
                    </p>
                    <p className=" text-darkGray75 font-body text-md ">
                        {!isNaN(builderExpandData?.factory_overwrite?.overwrite)
                            ? formatterForCurrency.format(builderExpandData?.factory_overwrite?.builder_allocation)
                            : formatterForCurrency.format(builderExpandData?.builder_allocation)}
                    </p>
                </div>
                <div className="flex px-4">
                    <p className="flex-1 text-darkGray75 font-body text-md ">{APP_TITLE} Revenue</p>
                    <p className=" text-darkGray75 font-body text-md ">
                        {!isNaN(builderExpandData?.factory_overwrite?.overwrite) && !claim?.program?.is_flat_rebate
                            ? formatterForCurrency.format(
                                  builderExpandData?.factory_overwrite?.overwrite -
                                      builderExpandData?.factory_overwrite?.builder_allocation
                              )
                            : claim?.program?.is_flat_rebate &&
                              !isNaN(builderExpandData?.factory_overwrite?.total_allocation) &&
                              !isNaN(builderExpandData?.factory_overwrite?.builder_allocation)
                            ? formatterForCurrency.format(
                                  builderExpandData?.factory_overwrite?.total_allocation -
                                      builderExpandData?.factory_overwrite?.builder_allocation
                              )
                            : formatterForCurrency.format(
                                  builderExpandData?.total - builderExpandData?.builder_allocation
                              )}
                    </p>
                </div>
                <div className="flex px-4">
                    <p className="flex-1 text-darkGray75 font-body text-md ">Total to claim</p>
                    <p className=" text-darkGray75 font-body text-md ">
                        {!isNaN(builderExpandData?.factory_overwrite?.overwrite) && !claim?.program?.is_flat_rebate
                            ? formatterForCurrency.format(builderExpandData?.factory_overwrite?.overwrite)
                            : claim?.program?.is_flat_rebate &&
                              !isNaN(builderExpandData?.factory_overwrite?.total_allocation)
                            ? formatterForCurrency.format(builderExpandData?.factory_overwrite?.total_allocation)
                            : formatterForCurrency.format(builderExpandData?.total)}
                    </p>
                </div>
                {claim?.claim_type === "FACTORY" && !claim?.program?.is_flat_rebate && (
                    <div className="flex px-4">
                        <p className="flex-1 text-secondary font-semibold text-md ">Overwrite Total</p>
                        <div className="flex flex-row ">
                            <p
                                className="text-secondary font-medium text-lg"
                                style={{
                                    paddingTop: "1px",
                                }}
                            >
                                $
                            </p>
                            <InputDecimal
                                name="claimTotalOverwrite"
                                id="claimTotalOverwrite"
                                placeholder="Overwrite"
                                defaultValue={
                                    typeof builderExpandData?.factory_overwrite?.overwrite === "number"
                                        ? builderExpandData?.factory_overwrite?.overwrite?.toFixed(2)
                                        : null
                                }
                                className={`w-28 mb-1 pt-0.5 pb-0 pl-0.5 rounded-lg rounded-b-none min-w-0 border-0 border-b-2 border-gray-400 text-secondary font-medium text-lg outline-none focus:outline-none focus:ring-0`}
                                onChangeFunction={(e) => {
                                    handleTotalOverwriteBuilderChange(e);
                                }}
                            />
                        </div>
                    </div>
                )}
                {claim?.claim_type === "FACTORY" && claim?.program?.is_flat_rebate && (
                    <div className="flex flex-col px-4">
                        <p className="flex-1 text-secondary font-semibold text-md ">Builder Overwrite</p>
                        <div className="flex flex-row">
                            <p
                                className="text-secondary font-medium text-lg"
                                style={{
                                    paddingTop: "1px",
                                }}
                            >
                                $
                            </p>
                            <InputDecimal
                                name="claimTotalBuilderOverwrite"
                                id="claimTotalBuilderOverwrite"
                                placeholder="Builder Overwrite"
                                defaultValue={
                                    typeof builderExpandData?.factory_overwrite?.builder_allocation === "number"
                                        ? builderExpandData?.factory_overwrite?.builder_allocation?.toFixed(2)
                                        : null
                                }
                                className={`w-64 mb-1 pt-0.5 pb-0 pl-0.5 rounded-lg rounded-b-none min-w-0 border-0 border-b-2 border-gray-400 text-secondary font-medium text-lg outline-none focus:outline-none focus:ring-0`}
                                onChangeFunction={(e) => {
                                    handleTotalOverwriteBuilderChangeFlat(e);
                                }}
                            />
                        </div>
                        <p className="flex-1 text-secondary font-semibold text-md ">BBG Overwrite</p>
                        <div className="flex flex-row ">
                            <p
                                className="text-secondary font-medium text-lg"
                                style={{
                                    paddingTop: "1px",
                                }}
                            >
                                $
                            </p>
                            <InputDecimal
                                name="claimTotalBBGOverwrite"
                                id="claimTotalBBGOverwrite"
                                placeholder="BBG Overwrite"
                                defaultValue={
                                    typeof builderExpandData?.factory_overwrite?.total_allocation === "number" &&
                                    typeof builderExpandData?.factory_overwrite?.builder_allocation === "number"
                                        ? (
                                              builderExpandData?.factory_overwrite?.total_allocation -
                                              builderExpandData?.factory_overwrite?.builder_allocation
                                          ).toFixed(2)
                                        : null
                                }
                                className={`w-64 mb-1 pt-0.5 pb-0 pl-0.5 rounded-lg rounded-b-none min-w-0 border-0 border-b-2 border-gray-400 text-secondary font-medium text-lg outline-none focus:outline-none focus:ring-0`}
                                onChangeFunction={(e) => {
                                    handleTotalOverwriteBBGChangeFlat(e);
                                }}
                            />
                        </div>
                    </div>
                )}
                {claim?.claim_type === "FACTORY" && (
                    <div className="flex flex-col px-4">
                        <p className="flex-1 text-secondary font-semibold text-md ">Overwrite Note</p>
                        <textarea
                            type="text"
                            name="claimTotalOverwriteNote"
                            id="claimTotalOverwriteNote"
                            placeholder="Overwrite Note"
                            defaultValue={
                                builderExpandData?.factory_overwrite?.note
                                    ? builderExpandData?.factory_overwrite?.note
                                    : null
                            }
                            className={`w-auto mb-1 pt-0.5 pb-0 pl-0.5 rounded-lg rounded-b-none min-w-0 border-0 border-b-2 border-gray-400 text-darkGray75 font-body text-md outline-none focus:outline-none focus:ring-0`}
                            onChange={(e) => {
                                handleTotalOverwriteBuilderNoteChange(e);
                            }}
                        />
                    </div>
                )}
                {claim?.claim_type === "FACTORY" && (
                    <div className="flex px-4">
                        <Button
                            color="primary"
                            disabled={claim?.status === "PROCESSING"}
                            onClick={() => {
                                setBuilderId(parseInt(builderExpandData?.builder_id));
                                if (!claim?.program?.is_flat_rebate) setOverwriteTotalBuilder(true);
                                else setOverwriteTotalBuilderFlat(true);
                                calculateClaimAllocationBuilderOverwrite({
                                    variables: {
                                        id: claim?.id,
                                        builderId: builderExpandData?.builder_id,
                                        closing: false,
                                    },
                                });
                            }}
                            title={"Overwrite Builder"}
                        />
                        <Button
                            color="primary"
                            disabled={
                                claim?.status === "PROCESSING" || isNaN(builderExpandData?.factory_overwrite?.overwrite)
                            }
                            onClick={() => {
                                setBuilderId(parseInt(builderExpandData?.builder_id));
                                setRemoveClaimManualBuilderOverwriteBoolean(true);
                                calculateClaimAllocationBuilderOverwrite({
                                    variables: {
                                        id: claim?.id,
                                        builderId: builderExpandData?.builder_id,
                                        closing: false,
                                    },
                                });
                            }}
                            title={"Remove Builder Overwrite"}
                        />
                    </div>
                )}
            </div>
        );
    };

    const [removeClaim, { loading }] = useMutation(EDIT_BUILDER_UPDATE_CLAIM, {
        variables: {
            rebateReports: builderExpandData?.rebatesId,
            id: claim?.id,
        },
        update(cache, result) {
            setClaim({ ...claim, ...result?.data?.updateClaim });
            setClaimResult({ ...claim, ...result?.data?.updateClaim });
            setClaimTotal(result?.data?.updateClaim?.calculateCurrentTotal?.total);
            setBuilderAccordionData(result?.data?.updateClaim?.calculateCurrentTotal?.builderTotals);
            setActiveBuilder("");
        },
    });

    const editAction = () => {
        removeClaim();
    };

    const getVolumeCenterColumnObject = () => {
        let valueFields = volumeFields && Object.values(volumeFields);

        let finalValueFields = valueFields?.map((item) => {
            let object = {};
            object.id = item?.id;
            object.rebate_earned = parseFloat(item?.rebate_earned);
            object.rebate_adjusted = parseFloat(item?.rebate_adjusted);
            object.note = item?.note;
            return object;
        });

        return finalValueFields;
    };

    const [updateVolumeClaim, { loading: updateVolumeClaimLoading }] = useMutation(UPDATE_VOLUME_CLAIM, {
        variables: {
            volumeBuilders: getVolumeCenterColumnObject(),
            id: claim?.id,
        },
        update(cache, result) {
            toast.success("Rebate Amount Added");
        },
    });

    const handleVolumeClaimUpdate = () => {
        setCenterColumnEdited(false);
        updateVolumeClaim().then(() => {
            getTotalVolumeValues();
        });
    };

    const [searchBuilders, { data: searchedBuilders, loading: searchVolumeBuildersLoading }] = useLazyQuery(
        SEARCH_ELIGIBLE_BUILDER,
        {
            notifyOnNetworkStatusChange: false,
            fetchPolicy: "network-only",
        }
    );

    useEffect(() => {
        if (searchVolumeBuilders?.length > 0) {
            searchBuilders({
                variables: {
                    id: claim?.program?.id,
                    search: searchVolumeBuilders,
                },
            });
        }
        // eslint-disable-next-line
    }, [searchVolumeBuilders]);

    const displayLoader = () => {
        if (claim?.program?.type === "VOLUME") {
            if (getTotalVolumeValuesLoading) {
                return <Loader width={"25px"} height={"25px"} />;
            } else {
                if (claimResult) {
                    if (claimResult?.total_manual_set || claimResult?.total_manual_set === 0) {
                        return (
                            <span>
                                {formatterForCurrency.format(claimTotal)}{" "}
                                <span className="text-brickGreen"> (Overwritten)</span>
                            </span>
                        );
                    } else {
                        return formatterForCurrency.format(claimTotal);
                    }
                } else {
                    if (claim?.total_manual_set || claim?.total_manual_set === 0) {
                        return (
                            <span>
                                {formatterForCurrency.format(claimTotal)}{" "}
                                <span className="text-brickGreen"> (Overwritten)</span>
                            </span>
                        );
                    } else {
                        return formatterForCurrency.format(claimTotal);
                    }
                }
            }
        } else {
            if (updateClaimsLoading || loading || calculateClaimAllocationLoading) {
                return <Loader width={"25px"} height={"25px"} />;
            } else {
                if (claimResult) {
                    if (claimResult?.total_manual_set || claimResult?.total_manual_set === 0) {
                        return (
                            <span>
                                {formatterForCurrency.format(claimTotal)}{" "}
                                <span className="text-brickGreen"> (Overwritten)</span>
                            </span>
                        );
                    } else {
                        return formatterForCurrency.format(claimTotal);
                    }
                } else {
                    if (claim?.total_manual_set || claim?.total_manual_set === 0) {
                        return (
                            <span>
                                {formatterForCurrency.format(claimTotal)}{" "}
                                <span className="text-brickGreen"> (Overwritten)</span>
                            </span>
                        );
                    } else {
                        return formatterForCurrency.format(claimTotal);
                    }
                }
            }
        }
    };

    const checkIfReadyExist = () => {
        let result = false;
        if (!result) {
            claim?.buildersWithOpenRebateBeforeEndDate?.forEach((eachData) => {
                eachData?.rebateReports?.forEach((item) => {
                    if (item?.ReadiedHouses?.length > 0) {
                        result = true;
                    }
                });
            });
        }
        return result;
    };

    function approveButtonCheck(claim) {
        return claim?.status === "PROCESSING"
            ? true
            : claim?.type === "VOLUME" || claim?.program?.type === "VOLUME"
            ? claim?.total_payment_rebate > totalPaymentRebate
            : false;
    }

    return (
        <div
            className="flex-1 flex-col  flex items-stretch sm:flex-row  overflow-hidden"
            style={{ minHeight: "60vh", maxHeight: "60vh" }}
        >
            <div className="flex-grow w-full max-w-8xl mx-auto flex">
                <div className="flex-1  md:flex">
                    <div className="h-full w-full">
                        <div className="h-full relative">
                            <div className=" inset-0  border bg-white border-gray-200 h-full flex flex-col">
                                <div className="flex flex-col px-4  border-b justify-center ">
                                    <div
                                        className=" text-center w-full py-4   flex items-center justify-between space-x-5"
                                        style={{ maxHeight: "59px" }}
                                    >
                                        <p className="font-title text-secondary font-bold text-lg">
                                            {claim?.program?.type === "VOLUME" ? "Builders Claiming" : "Builders"}
                                        </p>
                                        {claim?.program?.type === "FACTORY" && checkIfReadyExist() ? (
                                            <Button
                                                color="primary"
                                                onClick={() => setShowAssignBuildersModal(true)}
                                                title={"Assign All Builders"}
                                            />
                                        ) : null}

                                        {claim?.program?.type === "VOLUME" ? (
                                            <input
                                                type="text"
                                                onChange={(e) => setSearchVolumeBuilders(e.target.value)}
                                                name="searchVolumeBuilder"
                                                id="searchVolumeBuilder"
                                                className="focus:ring-secondary focus:border-secondary block rounded-md   sm:text-sm border-gray-300"
                                                placeholder="Find Builders"
                                                value={searchVolumeBuilders}
                                            ></input>
                                        ) : null}
                                    </div>
                                    {searchVolumeBuilders?.trim().length > 0 ? (
                                        <div className="  mt-3 w-full max-h-96  mb-2  bg-white overflow-auto  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                            {searchVolumeBuildersLoading ? (
                                                <div className="border rounded-lg">
                                                    <Loader />
                                                </div>
                                            ) : searchedBuilders?.searchEligibleBuilder?.edges?.length === 0 ? (
                                                <div className="border rounded-lg py-2 px-2 text-secondary font-title font-semibold flex items-center justify-between">
                                                    <p> No Results Found </p>
                                                    <span
                                                        className="underline cursor-pointer text-brickRed"
                                                        onClick={() => {
                                                            setSearchVolumeBuilders("");
                                                        }}
                                                    >
                                                        {" "}
                                                        Reset{" "}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div
                                                    className={`${
                                                        searchedBuilders?.searchEligibleBuilder?.edges?.length > 0
                                                            ? "border rounded-lg "
                                                            : ""
                                                    }`}
                                                >
                                                    {searchedBuilders?.searchEligibleBuilder?.edges?.length > 0 &&
                                                        searchedBuilders?.searchEligibleBuilder?.edges.map(
                                                            (eachData) => {
                                                                return (
                                                                    <div
                                                                        onClick={() => {
                                                                            handleBuilderClick(eachData?.node);
                                                                            setSearchVolumeBuilders("");
                                                                        }}
                                                                        className={`py-3 rounded-lg pl-3 transition-all border-b border-l-4  hover:border-l-6 hover:bg-gray-100 cursor-pointer ${
                                                                            activeBuilder === eachData?.node?.id
                                                                                ? "border-l-gold border-l-6"
                                                                                : claim?.program?.type === "FACTORY" ||
                                                                                  claim?.claim_type === "FACTORY"
                                                                                ? "border-l-primary"
                                                                                : ""
                                                                        } ${
                                                                            centerColumnBuilderList?.findIndex(
                                                                                (element) =>
                                                                                    element?.id === eachData?.node?.id
                                                                            ) > -1
                                                                                ? "border-l-gold border-l-6"
                                                                                : "border-l-primary"
                                                                        }`}
                                                                    >
                                                                        <div className="relative  ">
                                                                            <div className="text-sm font-semibold text-darkgray75">
                                                                                <div className="focus:outline-none">
                                                                                    {eachData?.node?.name}
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

                                <div className="flex overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 w-full h-full">
                                    <div className="w-full  border-l border-white border-r sm:max-h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                        <ul className=" flex-0 w-full  overflow-auto">
                                            {claim?.buildersWithOpenRebateBeforeEndDate
                                                ?.sort((a, b) => a.name.localeCompare(b.name))
                                                .map((eachData) => {
                                                    let result;

                                                    eachData?.rebateReports?.forEach((item) => {
                                                        if (item?.ReadiedHouses?.length > 0) {
                                                            result = (
                                                                <li
                                                                    onClick={() => handleBuilderClick(eachData)}
                                                                    className={`py-3 pl-3 transition-all border-b border-l-4  hover:border-l-6 hover:bg-gray-100 cursor-pointer ${
                                                                        parseInt(activeBuilder) ===
                                                                        parseInt(eachData?.id)
                                                                            ? "border-l-gold border-l-6"
                                                                            : claim?.program?.type === "FACTORY" ||
                                                                              claim?.claim_type === "FACTORY"
                                                                            ? "border-l-primary"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <div className="relative  ">
                                                                        <div className="text-sm font-semibold text-darkgray75">
                                                                            <div className="focus:outline-none">
                                                                                {eachData.name}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        }
                                                    });

                                                    return result;
                                                })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-full flex-1">
                    <div className="  h-full">
                        <div className="h-full relative  ">
                            <div className="inset-0  border  bg-white  h-full flex flex-col">
                                <div className="flex flex-0 px-4 border-b justify-between items-center">
                                    <div className="py-4 font-title text-center text-secondary font-bold text-lg">
                                        Rebate Report
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1 overflow-auto w-full">
                                    <div className={`flex  h-full overflow-hidden w-full `}>
                                        {modal()}
                                        {assignAllBuildersModal()}
                                        {refusedModal()}
                                        {claim?.claim_type === "VOLUME" || claim?.program?.type === "VOLUME" ? (
                                            <div className=" flex-0 w-full  overflow-auto h-full">
                                                {centerColumnBuilderList.map((item, index) => {
                                                    return (
                                                        <div className="border-b px-4 py-2 cursor-pointer">
                                                            <div
                                                                className="flex flex-row justify-between"
                                                                onClick={() => toggle(index)}
                                                                key={index}
                                                            >
                                                                <div className="text-sm font-semibold text-darkgray75">
                                                                    {item.name}
                                                                </div>
                                                                <span className="mr-5">
                                                                    {clicked === index ? (
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
                                                                    ) : (
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
                                                                                d="M19 9l-7 7-7-7"
                                                                            />
                                                                        </svg>
                                                                    )}
                                                                </span>
                                                            </div>
                                                            {clicked === index ? (
                                                                <>
                                                                    <div className="flex flex-col justify-between items-start">
                                                                        <div className="max-w-8xl grid grid-cols-3 justify-start items-baseline mb-1 py-3 4xl:gap-5">
                                                                            <label
                                                                                htmlFor="rebate_earned"
                                                                                className="w-full text-sm 4xl:text-md font-medium text-secondary"
                                                                            >
                                                                                Rebate Earned
                                                                            </label>
                                                                            <div className="mt-1 ml-5 flex rounded-md shadow-sm">
                                                                                <div className="relative flex w-48 sm:w-100 focus-within:z-10">
                                                                                    <TextField
                                                                                        type="number"
                                                                                        name="rebate_earned"
                                                                                        value={
                                                                                            volumeFields?.[item?.id]
                                                                                                ?.rebate_earned
                                                                                        }
                                                                                        id="rebate_earned"
                                                                                        isDollar
                                                                                        className="focus:ring-secondary focus:border-secondary block rounded-md w-full sm:text-sm border-gray-300"
                                                                                        placeholder="7000"
                                                                                        onChange={(e) =>
                                                                                            handleCenterColumnChange(
                                                                                                e,
                                                                                                item
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-start ml-3">
                                                                                <div className="h-5 flex items-center">
                                                                                    <input
                                                                                        checked={
                                                                                            (paymentReduced &&
                                                                                                paymentReducedId ===
                                                                                                    item?.id) ||
                                                                                            volumeFields?.[item?.id]
                                                                                                ?.rebate_adjusted ||
                                                                                            volumeFields?.[item?.id]
                                                                                                ?.rebate_adjusted === 0
                                                                                        }
                                                                                        id="paymentReduced"
                                                                                        name="paymentReduced"
                                                                                        onChange={() => {
                                                                                            paymentReducedCheckBox(
                                                                                                item?.id,
                                                                                                volumeFields?.[item?.id]
                                                                                                    ?.rebate_adjusted
                                                                                            );
                                                                                        }}
                                                                                        type="checkbox"
                                                                                        className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                                                                                    />
                                                                                </div>
                                                                                <div className="ml-3 sm:mb-0 text-sm">
                                                                                    <label
                                                                                        htmlFor="paymentReduced"
                                                                                        className="font-medium text-secondary"
                                                                                    >
                                                                                        Payment Reduced
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {(paymentReduced &&
                                                                            paymentReducedId === item?.id) ||
                                                                        volumeFields?.[item?.id]?.rebate_adjusted ||
                                                                        volumeFields?.[item?.id]?.rebate_adjusted ===
                                                                            0 ? (
                                                                            <div className="max-w-8xl grid justify-start grid-cols-3 items-baseline mb-1 4xl:gap-5">
                                                                                <label
                                                                                    htmlFor="rebate_adjusted"
                                                                                    className="  text-sm 4xl:text-md font-medium text-secondary"
                                                                                >
                                                                                    Rebate Paid
                                                                                </label>
                                                                                <div className="mt-1 ml-5 flex rounded-md shadow-sm">
                                                                                    <div className="relative flex w-48 sm:w-100 focus-within:z-10">
                                                                                        <TextField
                                                                                            type="number"
                                                                                            name="rebate_adjusted"
                                                                                            id="rebate_adjusted"
                                                                                            value={
                                                                                                volumeFields?.[item?.id]
                                                                                                    ?.rebate_adjusted
                                                                                            }
                                                                                            isDollar
                                                                                            className="focus:ring-primary focus:border-primary block rounded-md w-full sm:text-sm border-gray-300"
                                                                                            placeholder="5000"
                                                                                            onChange={(e) =>
                                                                                                handleCenterColumnChange(
                                                                                                    e,
                                                                                                    item
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ) : null}
                                                                        {(paymentReduced &&
                                                                            paymentReducedId === item?.id) ||
                                                                        volumeFields?.[item?.id]?.rebate_adjusted ||
                                                                        volumeFields?.[item?.id]?.rebate_adjusted ===
                                                                            0 ? (
                                                                            <div className="max-w-8xl w-full justify-start items-baseline mb-3 md:gap-5 mt-2">
                                                                                <TextField
                                                                                    textarea
                                                                                    parentClass="w-full"
                                                                                    label="Reason Note"
                                                                                    type="text"
                                                                                    name="note"
                                                                                    id="note"
                                                                                    labelClass="text-sm 4xl:text-md"
                                                                                    value={
                                                                                        volumeFields?.[item?.id]?.note
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        handleCenterColumnChange(
                                                                                            e,
                                                                                            item
                                                                                        )
                                                                                    }
                                                                                    className="focus:ring-primary focus:border-primary block rounded-md w-full sm:text-sm border-gray-300"
                                                                                    placeholder="Did not pay all their bills on time"
                                                                                />
                                                                            </div>
                                                                        ) : null}
                                                                    </div>
                                                                    <div>
                                                                        <Button
                                                                            onClick={() => {
                                                                                handleVolumeClaimUpdate();
                                                                            }}
                                                                            disabled={
                                                                                claim?.status === "PROCESSING"
                                                                                    ? !(claim?.status === "PROCESSING")
                                                                                    : !centerColumnEdited
                                                                            }
                                                                            title={
                                                                                updateVolumeClaimLoading
                                                                                    ? "Saving"
                                                                                    : "Save"
                                                                            }
                                                                            color="primary"
                                                                            buttonClass="pt-0"
                                                                        />
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : builderData && activeBuilder ? (
                                            <div className="flex flex-col flex-1 w-full h-full">
                                                <div className="flex flex-col ">
                                                    <div
                                                        className="font-title  text-secondary font-bold text-md px-4 py-2 border-b cursor-pointer flex items-center justify-between"
                                                        onClick={() => {
                                                            setReadyRebate(!readyRebate);
                                                        }}
                                                    >
                                                        <div className="py-2">
                                                            {" "}
                                                            {readyHouses?.[0]?.node?.length}{" "}
                                                            {readyHouses?.[0]?.node?.length > 1
                                                                ? "Properties"
                                                                : "Property"}{" "}
                                                            - Ready for Rebate
                                                        </div>
                                                        <div>
                                                            {readyHouses?.[0]?.node?.length > 0 ? (
                                                                readyRebate ? (
                                                                    <div className="flex">
                                                                        <ChevronUpIcon className="h-10 w-10 text-secondary" />
                                                                        {updateClaimsLoading ? (
                                                                            <Loader width={40} height={40} />
                                                                        ) : updateClaimsLoading ? (
                                                                            <Loader width={40} height={40} />
                                                                        ) : (
                                                                            <CheckCircleIcon
                                                                                className="h-10 w-10  text-brickGreen"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    if (
                                                                                        claim?.status !== "PROCESSING"
                                                                                    ) {
                                                                                        handleAllocationUpdate();
                                                                                    } else {
                                                                                        toast.warning(
                                                                                            "The Claim is processing, try again later"
                                                                                        );
                                                                                    }
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex">
                                                                        <ChevronDownIcon className="h-10 w-10 text-secondary" />
                                                                        {updateClaimsLoading ? (
                                                                            <Loader width={40} height={40} />
                                                                        ) : updateClaimsLoading ? (
                                                                            <Loader width={40} height={40} />
                                                                        ) : (
                                                                            <CheckCircleIcon
                                                                                className="h-10 w-10  text-brickGreen"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    if (
                                                                                        claim?.status !== "PROCESSING"
                                                                                    ) {
                                                                                        handleAllocationUpdate();
                                                                                    } else {
                                                                                        toast.warning(
                                                                                            "The Claim is processing, try again later"
                                                                                        );
                                                                                    }
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                )
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    {readyRebate ? readyHousesAccordianComponent() : null}
                                                </div>
                                                <div className="flex flex-col h-full">
                                                    <div
                                                        className="font-title  text-secondary font-bold text-md px-4 py-2 border-b cursor-pointer flex justify-between items-center"
                                                        onClick={() => {
                                                            setActionRebate(!actionRebate);
                                                            setDisplayProofPoints("");
                                                        }}
                                                    >
                                                        <div>
                                                            {" "}
                                                            {needActionHouses?.length}{" "}
                                                            {needActionHouses?.length > 1 ? "Properties" : "Property"} -
                                                            Action Required
                                                        </div>
                                                        <div>
                                                            {actionRebate ? (
                                                                <ChevronUpIcon className="h-10 w-10 text-secondary" />
                                                            ) : (
                                                                <ChevronDownIcon className="h-10 w-10 text-secondary" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    {actionRebate ? (
                                                        <div className=" inset-0    border-gray-200  rounded-lg h-full flex flex-col">
                                                            <div className="flex w-full h-full overflow-hidden">
                                                                {actionHousesAccordianComponent()}
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                    {edit ? (
                                        <div className="flex w-full py-1 border-t justify-center">
                                            <div>
                                                <Button
                                                    title="Create Dispute Report"
                                                    color="primary"
                                                    disabled={
                                                        claim?.status === "PROCESSING"
                                                            ? !(claim?.status === "PROCESSING")
                                                            : false
                                                    }
                                                    onClick={() => setShowModal(true)}
                                                />
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" flex-1">
                    <div className="h-full relative ">
                        <div className="inset-0  border  bg-white   h-full flex flex-col">
                            <div className="flex flex-col px-4 justify-center border-b py-5" style={{ height: "60px" }}>
                                <div className="flex  text-md  3xl:text-md justify-between flex-wrap  items-center">
                                    {claim?.type === "VOLUME" || claim?.program?.type === "VOLUME" ? (
                                        <div className="flex ">
                                            <p className="font-title  text-secondary font-bold ">Total Payment:</p>
                                            <p className="font-title  text-secondary font-bold ml-1  ">
                                                {formatterForCurrency.format(claim?.total_payment_rebate)}
                                            </p>
                                        </div>
                                    ) : null}

                                    <div
                                        className={`flex text-md  3xl:text-md ${
                                            claim?.type === "VOLUME" || claim?.program?.type === "VOLUME"
                                                ? ""
                                                : "col-span-2 col-start-3"
                                        } `}
                                    >
                                        <p className="font-title  text-secondary font-bold   ">Report total:</p>
                                        <div className="font-title  text-secondary font-bold ml-1">
                                            {displayLoader()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {updateClaimsLoading || loading ? (
                                <Loader />
                            ) : (
                                <ClaimsAccordion
                                    Data={sortArray(builderAccordionData)}
                                    onClick={(data) => {
                                        setBuilderExpandData(data);
                                    }}
                                    claimNode={claim}
                                    component={accordianComponent()}
                                    editClick={() => editAction()}
                                />
                            )}
                            <div className="flex w-full py-1 border-t justify-between">
                                {confirmModal()}
                                <div>
                                    <Button
                                        title={`${claim?.claim_type === "FACTORY" ? "Approve" : "Approve & Close"}`}
                                        disabled={approveButtonCheck(claim)}
                                        color="primary"
                                        onClick={() => {
                                            setOverwriteTotal(claim?.total_payment_rebate);
                                            setShowConfirmModal(true);
                                        }}
                                    />
                                </div>
                                {!isNaN(claim?.total_manual_set) ? (
                                    <div>
                                        <Button
                                            title={`Remove Claim Overwrite`}
                                            color="primary"
                                            onClick={() => {
                                                removeClaimManualOverwrite();
                                            }}
                                        />
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartClaim;
