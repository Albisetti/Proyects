import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useState, useEffect } from "react";
import {
    GET_BUILDERS,
    UPDATE_BUILDER_OVERRITES,
    UPDATE_BUILDER,
    UPDATE_BUILDER_ADD_PROGRAM,
    UPDATE_BUILDER_REMOVE_PROGRAM,
    UPDATE_BUILDER_CUSTOM_PRODUCT,
    UPDATE_BUILDER_PRODUCT,
    GET_PROGRAM_ORGANIZATION_PRICING_HISTORY,
    GET_PRODUCT_ORGANIZATION_PRICING_HISTORY,
} from "../../../lib/builders";
import Accordian from "../../Accordian";
import Button from "../../Buttons";
import { toast } from "react-toastify";
import {
    CREATE_PRODUCT,
    FETCH_CATEGORIES_QUERY,
    FETCH_PRODUCTS_PER_PROGRAM,
    SEARCH_ORGANIZATION_AVAILABLE_PROGRAMS,
} from "../../../lib/programs";
import Loader from "../../Loader/Loader";
import { PlusCircleIcon } from "@heroicons/react/solid";
import Modal from "../../Modal";
import TextField from "../../FormGroups/Input";
import CommonSelect from "../../Select";
import { InputDecimal } from "../../InputDecimal/InputDecimal"
import { useDebounce } from "../../../util/hooks";
import { APP_TITLE } from "../../../util/constants";

const ProgramBuilders = ({ user, callBack }) => {
    const [type, setType] = useState();
    const [fields, setFields] = useState({
        residential_rebate_overwrite: 0,
        multi_unit_rebate_overwrite: 0,
        commercial_rebate_overwrite: 0,
        is_flat_rebate: null,
        flat_builder_overwrite: null,
        flat_bbg_overwrite: null,
        global_bbg_rebate_type: null,
    });
    const [reset, setReset] = useState(false);
    const [typeProducts, setTypeProducts] = useState();
    const [edited, setEdited] = useState(false);
    const [valueToCompare, setValueToCompare] = useState();
    const [valueToCompareProducts, setValueToCompareProducts] = useState();
    const [programId, setProgramId] = useState();
    const [showModal, setShowModal] = useState(false);
    const [modalFields, setModalFields] = useState({
        residential_builder_rebate_amount: 0,
        residential_rebate_amount: 0,
        multi_builder_unit_rebate_amount: 0,
        multi_unit_rebate_amount: 0,
        commercial_rebate_amount: 0,
        commercial_builder_rebate_amount: 0,
    });
    const [category, setCategory] = useState();
    const [requireQuantityReporting, setRequireQuantityReporting] = useState();
    const [programType, setProgramType] = useState();
    const [programNode, setProgramNode] = useState();
    const [resetToDefault, setResetToDefault] = useState();
    const [productFields, setProductFields] = useState({
        residential_rebate_overwrite: 0,
        multi_unit_rebate_overwrite: 0,
        commercial_rebate_overwrite: 0,
        flat_builder_overwrite: null,
        flat_bbg_overwrite: null,
    });
    const [productEdited, setProductEdited] = useState();
    const [modalFieldsError, setModalFieldsError] = useState({
        product_name: false,
    });
    const [finalError, setFinalError] = useState({
        customProduct: false,
    });
    const [searchBuildersString, setSearchBuildersString] = useState();
    const [builderProgramSearch, setBuilderProgramSearch] = useState();
    const [programIdToAdd, setProgramIdToAdd] = useState();
    const [deleteId, setDeleteId] = useState();
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [showPricingProductOrganizationModal, setShowPricingProductOrganizationModal] = useState(false);
    const [programOrganizationIdForPricingHistoryQuery, setProgramOrganizationIdForPricingHistoryQuery] = useState();
    const [productOrganizationIdForPricingHistoryQuery, setProductOrganizationIdForPricingHistoryQuery] = useState();

    const initialValue = {};

    const overWriteTypes = [
        { name: "DEFAULT", label: "By Program" },
        { name: "AMOUNT", label: "Custom - $" },
        { name: "PERCENTAGE", label: "Custom - %" },
    ];

    const [getCategories, { data: categories }] = useLazyQuery(FETCH_CATEGORIES_QUERY, {
        fetchPolicy: "no-cache",
    });

    const handleTypeChange = (e) => {
        setType(e.target.value);
        setReset(false);
    };

    const handleModalChange = (e) => {
        const { name, value } = e.target;
        setModalFields({
            ...modalFields,
            [name]: value,
        });
        if (value?.length > 0) {
            setModalFieldsError({
                ...modalFieldsError,
                [name]: false,
            });
        }
        if (value.length < 1) {
            setModalFieldsError({
                ...modalFieldsError,
                [name]: true,
            });
        }
    };

    const handleTypeChangeProducts = (e) => {
        setTypeProducts(e.target.value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (value) {
            setFields({
                ...fields,
                [name]: parseFloat(value),
            });
        } else {
            setFields({
                ...fields,
                [name]: null,
            });
        }
        setReset(false);
    };

    const handleProductsChange = (e) => {
        const { name, value } = e.target;
        if (value) {
            setProductFields({
                ...productFields,
                [name]: parseFloat(value),
            });
        } else {
            setProductFields({
                ...productFields,
                [name]: null,
            });
        }
    };

    useEffect(() => {
        if (type !== valueToCompare?.type) {
            setEdited(true);
        } else if (
            fields?.residential_rebate_overwrite !== valueToCompare?.residential_rebate_overwrite &&
            valueToCompare?.residential_rebate_overwrite !== null &&
            valueToCompare?.type !== "DEFAULT" &&
            valueToCompare?.type === "AMOUNT"
        ) {
            setEdited(true);
        } else if (
            fields?.multi_unit_rebate_overwrite !== valueToCompare?.multi_unit_rebate_overwrite &&
            valueToCompare?.multi_unit_rebate_overwrite !== null &&
            valueToCompare?.type !== "DEFAULT" &&
            valueToCompare?.type === "AMOUNT"
        ) {
            setEdited(true);
        } else if (
            fields?.commercial_rebate_overwrite !== valueToCompare?.commercial_rebate_overwrite &&
            valueToCompare?.commercial_rebate_overwrite !== null &&
            valueToCompare?.type !== "DEFAULT" &&
            valueToCompare?.type === "AMOUNT"
        ) {
            setEdited(true);
        } else if (
            fields?.flat_bbg_overwrite !== valueToCompare?.flat_bbg_overwrite &&
            valueToCompare?.flat_bbg_overwrite !== null &&
            valueToCompare?.type !== "DEFAULT" &&
            valueToCompare?.type === "AMOUNT"
        ) {
            setEdited(true);
        } else if (
            fields?.flat_builder_overwrite !== valueToCompare?.flat_builder_overwrite &&
            valueToCompare?.flat_builder_overwrite !== null &&
            valueToCompare?.type !== "DEFAULT" &&
            valueToCompare?.type === "AMOUNT"
        ) {
            setEdited(true);
        } else if (
            fields?.volume_bbg_rebate !== valueToCompare?.volume_bbg_rebate &&
            valueToCompare?.volume_bbg_rebate !== null &&
            valueToCompare?.type !== "DEFAULT" &&
            valueToCompare?.type === "PERCENTAGE"
        ) {
            setEdited(true);
        } else {
            setEdited(false);
        }

        // eslint-disable-next-line
    }, [fields, type]);

    useEffect(() => {
        let errors = {};
        if (modalFields?.product_name?.length < 2 || modalFields?.product_name === undefined) {
            errors.product_name = true;
        }
        if (modalFields?.bbg_product_code?.length < 2 || modalFields?.bbg_product_code === undefined) {
            errors.bbg_product_code = true;
        }
        if (modalFields?.description?.length < 2 || modalFields?.description === undefined) {
            errors.description = true;
        }
        if (
            (modalFields?.residential_rebate_amount?.length < 1 ||
                modalFields?.residential_rebate_amount === undefined ||
                modalFields?.residential_rebate_amount === null) &&
            programNode?.type === "FACTORY" &&
            !programNode?.is_flat_rebate
        ) {
            errors.residential_rebate_amount = true;
        }
        if (
            (modalFields?.flat_bbg_rebate?.length < 1 ||
                modalFields?.flat_bbg_rebate === undefined ||
                modalFields?.flat_bbg_rebate === null) &&
            programNode?.type === "FACTORY" &&
            programNode?.global_bbg_rebate_type === "DIFFERENT" &&
            programNode?.is_flat_rebate
        ) {
            errors.flat_bbg_rebate = true;
        }
        if (
            (modalFields?.flat_builder_rebate?.length < 1 ||
                modalFields?.flat_builder_rebate === undefined ||
                modalFields?.flat_builder_rebate === null) &&
            programNode?.type === "FACTORY" &&
            programNode?.global_bbg_rebate_type === "DIFFERENT" &&
            programNode?.is_flat_rebate
        ) {
            errors.flat_builder_rebate = true;
        }
        if (
            (modalFields?.commercial_rebate_amount?.length < 1 ||
                modalFields?.commercial_rebate_amount === undefined ||
                modalFields?.commercial_rebate_amount === null) &&
            programNode?.type === "FACTORY" &&
            !programNode?.is_flat_rebate
        ) {
            errors.commercial_rebate_amount = true;
        }
        if (
            (modalFields?.multi_unit_rebate_amount?.length < 1 ||
                modalFields?.multi_unit_rebate_amount === undefined ||
                modalFields?.multi_unit_rebate_amount === null) &&
            programNode?.type === "FACTORY" &&
            !programNode?.is_flat_rebate
        ) {
            errors.multi_unit_rebate_amount = true;
        }
        if (
            (modalFields?.residential_builder_rebate_amount?.length < 1 ||
                modalFields?.residential_builder_rebate_amount === undefined ||
                modalFields?.residential_builder_rebate_amount === null) &&
            programNode?.type === "FACTORY" &&
            !programNode?.is_flat_rebate
        ) {
            errors.residential_builder_rebate_amount = true;
        }
        if (
            (modalFields?.commercial_builder_rebate_amount?.length < 1 ||
                modalFields?.commercial_builder_rebate_amount === undefined ||
                modalFields?.commercial_builder_rebate_amount === null) &&
            programNode?.type === "FACTORY" &&
            !programNode?.is_flat_rebate
        ) {
            errors.commercial_builder_rebate_amount = true;
        }
        if (
            (modalFields?.multi_builder_unit_rebate_amount?.length < 1 ||
                modalFields?.multi_builder_unit_rebate_amount === undefined ||
                modalFields?.multi_builder_unit_rebate_amount === null) &&
            programNode?.type === "FACTORY" &&
            !programNode?.is_flat_rebate
        ) {
            errors.multi_builder_unit_rebate_amount = true;
        }
        if (modalFields?.minimum_unit <= 0 && programNode?.product_minimum_unit_requirement === "CUSTOM") {
            errors.minimum_unit = true;
        }
        if (modalFields?.minimum_unit <= 0 && programNode?.product_minimum_unit_requirement === "CUSTOM") {
            errors.minimum_unit = true;
        }
        if (modalFields?.category?.id === undefined || modalFields?.category?.id === null) {
            errors.category = true;
        }
        setModalFieldsError(errors);
        // eslint-disable-next-line
    }, [modalFields, programId]);

    useEffect(() => {
        let finalError =
            modalFieldsError?.product_name ||
            modalFieldsError?.bbg_product_code ||
            modalFieldsError?.description ||
            modalFieldsError?.residential_rebate_amount ||
            modalFieldsError?.commercial_rebate_amount ||
            modalFieldsError?.multi_unit_rebate_amount ||
            modalFieldsError?.multi_builder_unit_rebate_amount ||
            modalFieldsError?.commercial_builder_rebate_amount ||
            modalFieldsError?.residential_builder_rebate_amount ||
            modalFieldsError?.flat_bbg_rebate ||
            modalFieldsError?.flat_builder_rebate ||
            modalFieldsError?.minimum_unit ||
            modalFieldsError?.category;
        setFinalError({
            customProduct: finalError,
        });
    }, [modalFieldsError]);

    useEffect(() => {
        if (typeProducts !== valueToCompareProducts?.type) {
            setProductEdited(true);
        } else if (
            productFields?.residential_rebate_overwrite !== valueToCompareProducts?.residential_rebate_overwrite &&
            valueToCompareProducts?.residential_rebate_overwrite !== null &&
            valueToCompareProducts?.type !== "DEFAULT" &&
            valueToCompareProducts?.type === "AMOUNT"
        ) {
            setProductEdited(true);
        } else if (
            productFields?.multi_unit_rebate_overwrite !== valueToCompareProducts?.multi_unit_rebate_overwrite &&
            valueToCompareProducts?.multi_unit_rebate_overwrite !== null &&
            valueToCompareProducts?.type !== "DEFAULT" &&
            valueToCompareProducts?.type === "AMOUNT"
        ) {
            setProductEdited(true);
        } else if (
            productFields?.flat_bbg_overwrite !== valueToCompareProducts?.flat_bbg_overwrite &&
            valueToCompareProducts?.flat_bbg_overwrite !== null &&
            valueToCompareProducts?.type !== "DEFAULT" &&
            valueToCompareProducts?.type === "AMOUNT"
        ) {
            setProductEdited(true);
        } else if (
            productFields?.flat_builder_overwrite !== valueToCompareProducts?.flat_builder_overwrite &&
            valueToCompareProducts?.flat_builder_overwrite !== null &&
            valueToCompareProducts?.type !== "DEFAULT" &&
            valueToCompareProducts?.type === "AMOUNT"
        ) {
            setProductEdited(true);
        } else if (
            productFields?.commercial_rebate_overwrite !== valueToCompareProducts?.commercial_rebate_overwrite &&
            valueToCompareProducts?.commercial_rebate_overwrite !== null &&
            valueToCompareProducts?.type !== "DEFAULT" &&
            valueToCompareProducts?.type === "AMOUNT"
        ) {
            setProductEdited(true);
        } else if (
            productFields?.volume_bbg_rebate !== valueToCompareProducts?.volume_bbg_rebate &&
            valueToCompareProducts?.volume_bbg_rebate !== null &&
            valueToCompareProducts?.type !== "DEFAULT" &&
            valueToCompareProducts?.type === "PERCENTAGE"
        ) {
            setProductEdited(true);
        } else {
            setProductEdited(false);
        }

        // eslint-disable-next-line
    }, [productFields, typeProducts]);

    useEffect(() => {
        getCategories();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (typeProducts === valueToCompareProducts?.type) {
            setProductFields({
                ...productFields,
                commercial_rebate_overwrite: valueToCompareProducts?.commercial_rebate_overwrite,
                multi_unit_rebate_overwrite: valueToCompareProducts?.multi_unit_rebate_overwrite,
                residential_rebate_overwrite: valueToCompareProducts?.residential_rebate_overwrite,
                flat_bbg_overwrite: valueToCompareProducts?.flat_bbg_overwrite,
                flat_builder_rebate: valueToCompareProducts?.flat_builder_rebate,
                volume_bbg_rebate: valueToCompareProducts?.volume_bbg_rebate,
            });
        } else if (type !== valueToCompareProducts?.type) {
            setProductFields({
                ...productFields,
                commercial_rebate_overwrite: 0,
                multi_unit_rebate_overwrite: 0,
                residential_rebate_overwrite: 0,
                volume_bbg_rebate: 0,
                flat_bbg_overwrite: 0,
                flat_builder_rebate: 0,
            });
        }
        // eslint-disable-next-line
    }, [typeProducts]);

    useEffect(() => {
        if (programOrganizationIdForPricingHistoryQuery && programOrganizationIdForPricingHistoryQuery !== null) {
            getProgramOrganizationPricingHistory();
        }
        // eslint-disable-next-line
    }, [programOrganizationIdForPricingHistoryQuery]);

    useEffect(() => {
        if (productOrganizationIdForPricingHistoryQuery && productOrganizationIdForPricingHistoryQuery !== null) {
            getProductOrganizationPricingHistory();
        }
        // eslint-disable-next-line
    }, [productOrganizationIdForPricingHistoryQuery]);

    const pricingProgramOrganizationModal = () => {
        return (
            <>
                <Modal
                    width={"full"}
                    title={`Pricing History`}
                    Content={pricingContent()}
                    submitLabel="Close"
                    onSubmit={() => {
                        setShowPricingModal(false);
                        setProgramOrganizationIdForPricingHistoryQuery(null);
                    }}
                    onClose={() => {
                        setShowPricingModal(false);
                        setProgramOrganizationIdForPricingHistoryQuery(null);
                    }}
                    show={showPricingModal}
                />
            </>
        );
    };

    const pricingContent = () => {
        return (
            <table class="border-collapse table-auto w-full text-sm">
                <thead>
                    <tr>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Residential Rebate Amount
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Multi Unit Rebate Amount
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Commercial Rebate Amount
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Custom Builder Residential Rebate Amount
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Custom Builder Multi Unit Rebate Amount
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Custom Builder Commercial Rebate Amount
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Custom BBG Residential Rebate Amount
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Custom BBG Multi Unit Rebate Amount
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Custom BBG Commercial Rebate Amount
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Flat BBG Rebate
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Flat Builder Rebate
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Volume BBG Rebate
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Updated At
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-slate-800">
                    {programOrganizationPricingHistory?.program?.specificPivotPricings?.edges?.map((pricing) => {
                        return (
                            <tr>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.residential_rebate_amount ||
                                        pricing?.node?.residential_rebate_amount === 0 ? (
                                        pricing?.node?.residential_rebate_amount
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.multi_unit_rebate_amount ||
                                        pricing?.node?.multi_unit_rebate_amount === 0 ? (
                                        <p>{pricing?.node?.multi_unit_rebate_amount}</p>
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.commercial_rebate_amount ||
                                        pricing?.node?.commercial_rebate_amount === 0 ? (
                                        pricing?.node?.commercial_rebate_amount
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.cust_builder_residential_amount ||
                                        pricing?.node?.cust_builder_residential_amount === 0 ? (
                                        pricing?.node?.cust_builder_residential_amount
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.cust_builder_multi_unit_amount ||
                                        pricing?.node?.cust_builder_multi_unit_amount === 0 ? (
                                        <p>{pricing?.node?.cust_builder_multi_unit_amount}</p>
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.cust_builder_commercial_amount ||
                                        pricing?.node?.cust_builder_commercial_amount === 0 ? (
                                        pricing?.node?.cust_builder_commercial_amount
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.cust_bbg_residential_amount ||
                                        pricing?.node?.cust_bbg_residential_amount === 0 ? (
                                        pricing?.node?.cust_bbg_residential_amount
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.cust_bbg_multi_unit_amount ||
                                        pricing?.node?.cust_bbg_multi_unit_amount === 0 ? (
                                        <p>{pricing?.node?.cust_bbg_multi_unit_amount}</p>
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.cust_bbg_commercial_amount ||
                                        pricing?.node?.cust_bbg_commercial_amount === 0 ? (
                                        pricing?.node?.cust_bbg_commercial_amount
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.flat_bbg_rebate || pricing?.node?.flat_bbg_rebate === 0 ? (
                                        pricing?.node?.flat_bbg_rebate
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.flat_builder_rebate || pricing?.node?.flat_builder_rebate === 0 ? (
                                        pricing?.node?.flat_builder_rebate
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.volume_bbg_rebate || pricing?.node?.volume_bbg_rebate === 0 ? (
                                        pricing?.node?.volume_bbg_rebate
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.created_at}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    const pricingProductOrganizationModal = () => {
        return (
            <>
                <Modal
                    width={"full"}
                    title={`Pricing History`}
                    Content={pricingProductOrganizationContent()}
                    submitLabel="Close"
                    onSubmit={() => {
                        setShowPricingProductOrganizationModal(false);
                        setProductOrganizationIdForPricingHistoryQuery(null);
                    }}
                    onClose={() => {
                        setShowPricingProductOrganizationModal(false);
                        setProductOrganizationIdForPricingHistoryQuery(null);
                    }}
                    show={showPricingProductOrganizationModal}
                />
            </>
        );
    };

    const pricingProductOrganizationContent = () => {
        return (
            <table class="border-collapse table-auto w-full text-sm">
                <thead>
                    <tr>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Residential Rebate Amount
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Multi Unit Rebate Amount
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Commercial Rebate Amount
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Custom Builder Residential Rebate Amount
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Custom Builder Multi Unit Rebate Amount
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Custom Builder Commercial Rebate Amount
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Custom BBG Residential Rebate Amount
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Custom BBG Multi Unit Rebate Amount
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Custom BBG Commercial Rebate Amount
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Flat BBG Rebate
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Flat Builder Rebate
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Volume BBG Rebate
                        </th>
                        <th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-secondary text-left">
                            Updated At
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-slate-800">
                    {productOrganizationPricingHistory?.product?.specificPivotPricings?.edges?.map((pricing) => {
                        return (
                            <tr>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.residential_rebate_amount ||
                                        pricing?.node?.residential_rebate_amount === 0 ? (
                                        pricing?.node?.residential_rebate_amount
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.multi_unit_rebate_amount ||
                                        pricing?.node?.multi_unit_rebate_amount === 0 ? (
                                        <p>{pricing?.node?.multi_unit_rebate_amount}</p>
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.commercial_rebate_amount ||
                                        pricing?.node?.commercial_rebate_amount === 0 ? (
                                        pricing?.node?.commercial_rebate_amount
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.cust_builder_residential_amount ||
                                        pricing?.node?.cust_builder_residential_amount === 0 ? (
                                        pricing?.node?.cust_builder_residential_amount
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.cust_builder_multi_unit_amount ||
                                        pricing?.node?.cust_builder_multi_unit_amount === 0 ? (
                                        <p>{pricing?.node?.cust_builder_multi_unit_amount}</p>
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.cust_builder_commercial_amount ||
                                        pricing?.node?.cust_builder_commercial_amount === 0 ? (
                                        pricing?.node?.cust_builder_commercial_amount
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.cust_bbg_residential_amount ||
                                        pricing?.node?.cust_bbg_residential_amount === 0 ? (
                                        pricing?.node?.cust_bbg_residential_amount
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.cust_bbg_multi_unit_amount ||
                                        pricing?.node?.cust_bbg_multi_unit_amount === 0 ? (
                                        <p>{pricing?.node?.cust_bbg_multi_unit_amount}</p>
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.cust_bbg_commercial_amount ||
                                        pricing?.node?.cust_bbg_commercial_amount === 0 ? (
                                        pricing?.node?.cust_bbg_commercial_amount
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.flat_bbg_rebate || pricing?.node?.flat_bbg_rebate === 0 ? (
                                        pricing?.node?.flat_bbg_rebate
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.flat_builder_rebate || pricing?.node?.flat_builder_rebate === 0 ? (
                                        pricing?.node?.flat_builder_rebate
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.volume_bbg_rebate || pricing?.node?.volume_bbg_rebate === 0 ? (
                                        pricing?.node?.volume_bbg_rebate
                                    ) : (
                                        <p className="text-left text-placeHolder">Not set</p>
                                    )}
                                </td>
                                <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {pricing?.node?.created_at}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    const accordianComponent = () => {
        return programType === "FACTORY" ? (
            <div className="grid grid-cols-2 ">
                <div className="sm:grid sm:grid-cols-5 col-span-2 items-center py-3 px-4 border-b">
                    <div className="block text-secondary font-sm font-medium col-span-2">Select Overwrite Type</div>
                    <div className="mr-5 flex gap-5 col-span-3">
                        {overWriteTypes.map((item, index) => {
                            if (programType === "VOLUME" && item.name === "AMOUNT") {
                                // eslint-disable-next-line
                                return;
                            }
                            if (programType === "FACTORY" && item.name === "PERCENTAGE") {
                                // eslint-disable-next-line
                                return;
                            }
                            return (
                                <div className="mt-2" key={index}>
                                    <label className="inline-flex items-center ">
                                        <input
                                            type="radio"
                                            name={item.name}
                                            value={item.name}
                                            className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                            checked={type === item.name}
                                            onChange={handleTypeChange}
                                        ></input>
                                        <span className="ml-2 text-sm  text-secondary">
                                            {item.label === "By Program" ? "By Tier" : item.label}
                                        </span>
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                    {type === "AMOUNT" || type === "PERCENTAGE" ? (
                        <span
                            className="mb-2 place-self-end text-sm font-title text-secondary underline cursor-pointer"
                            onClick={() => resetToDefaultMethod()}
                        >
                            Reset to default
                        </span>
                    ) : null}
                </div>
                {type === "AMOUNT" && programType === "FACTORY" && !fields?.is_flat_rebate ? (
                    <div className="grid grid-cols-6 col-span-2">
                        <div className="flex items-center col-span-3  space-x-5 3xl:col-span-2 px-4 py-3 border-b">
                            <label
                                className="text-md   font-medium text-secondary"
                                htmlFor="residential_rebate_overwrite"
                            >
                                Residential
                            </label>
                            <div className="relative">
                                <InputDecimal
                                    id="residential_rebate_overwrite"
                                    onChangeFunction={handleChange}
                                    value={
                                        fields?.residential_rebate_overwrite ||
                                            fields?.residential_rebate_overwrite === 0
                                            ? fields?.residential_rebate_overwrite?.toFixed(2)
                                            : fields?.global_product_residential_rebate_amount &&
                                                fields?.residential_rebate_overwrite !== null
                                                ? fields?.global_product_residential_rebate_amount?.toFixed(2)
                                                : fields?.residential_rebate_overwrite?.toFixed(2)
                                    }
                                    name="residential_rebate_overwrite"
                                    placeholder="500.00"
                                    className={` block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                />
                                <span
                                    className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                    style={{ paddingTop: "3px" }}
                                >
                                    $
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center col-span-3  space-x-5 3xl:col-span-2  py-3 border-b">
                            <label
                                className="text-md   font-medium text-secondary"
                                htmlFor="commercial_rebate_overwrite"
                            >
                                Commercial
                            </label>
                            <div className="relative">
                                <InputDecimal
                                    id="commercial_rebate_overwrite"
                                    onChangeFunction={handleChange}
                                    value={
                                        fields?.commercial_rebate_overwrite || fields?.commercial_rebate_overwrite === 0
                                            ? fields?.commercial_rebate_overwrite?.toFixed(2)
                                            : fields?.global_product_commercial_rebate_amount &&
                                                fields?.commercial_rebate_overwrite !== null
                                                ? fields?.global_product_commercial_rebate_amount?.toFixed(2)
                                                : fields?.commercial_rebate_overwrite?.toFixed(2)
                                    }
                                    name="commercial_rebate_overwrite"
                                    placeholder="500.00"
                                    className={` block input-no-error w-20 pl-4 focus:outline-none shadow-sm sm:text-sm rounded-md`}
                                />
                                <span
                                    className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                    style={{ paddingTop: "3px" }}
                                >
                                    $
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center col-span-6 px-4 3xl:px-0 space-x-5 3xl:col-span-2  py-3 border-b">
                            <label
                                className="text-md   font-medium text-secondary"
                                htmlFor="multi_unit_rebate_overwrite"
                            >
                                Multi-Unit
                            </label>
                            <div className="relative">
                                <InputDecimal
                                    id="multi_unit_rebate_overwrite"
                                    onChangeFunction={handleChange}
                                    value={
                                        fields?.multi_unit_rebate_overwrite || fields?.multi_unit_rebate_overwrite === 0
                                            ? fields?.multi_unit_rebate_overwrite?.toFixed(2)
                                            : fields?.global_product_multi_unit_rebate_amount &&
                                                fields?.multi_unit_rebate_overwrite !== null
                                                ? fields?.global_product_multi_unit_rebate_amount?.toFixed(2)
                                                : fields?.multi_unit_rebate_overwrite?.toFixed(2)
                                    }
                                    name="multi_unit_rebate_overwrite"
                                    placeholder="500.00"
                                    className={`  block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                />
                                <span
                                    className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                    style={{ paddingTop: "3px" }}
                                >
                                    $
                                </span>
                            </div>
                        </div>
                    </div>
                ) : null}
                {type === "AMOUNT" && programType === "FACTORY" && fields?.is_flat_rebate ? (
                    <div className="border-b px-4 col-span-6   sm:grid sm:grid-cols-2 items-start justify-between py-3 sm:items-center w-full">
                        <div className="sm:grid sm:grid-cols-6 col-span-2 items-start ">
                            <div className="block text-secondary col-span-2 font-sm font-medium mt-2">Flat Rebate</div>
                            <div className="flex col-span-3 md:items-start gap-2 md:gap-3 ml-9 ">
                                <div className="relative">
                                    <InputDecimal
                                        parentClass=""
                                        id="flat_builder_overwrite"
                                        label="Builder"
                                        onChangeFunction={handleChange}
                                        width="w-24"
                                        value={
                                            fields?.flat_builder_overwrite || fields?.flat_builder_overwrite === 0
                                                ? fields?.flat_builder_overwrite?.toFixed(2)
                                                : fields?.flat_builder_rebate && fields?.flat_builder_overwrite !== null
                                                    ? fields?.flat_builder_rebate?.toFixed(2)
                                                    : fields?.flat_builder_overwrite?.toFixed(2)
                                        }
                                        name="flat_builder_overwrite"
                                        placeholder="10.00"
                                        className={`  block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                    />
                                    <span
                                        className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                        style={{ paddingTop: "3px" }}
                                    >
                                        $
                                    </span>
                                </div>
                                <div className="relative">
                                    <InputDecimal
                                        width="w-24"
                                        id="flat_bbg_overwrite"
                                        label={APP_TITLE}
                                        onChangeFunction={handleChange}
                                        value={
                                            fields?.flat_bbg_overwrite || fields?.flat_bbg_overwrite === 0
                                                ? fields?.flat_bbg_overwrite?.toFixed(2)
                                                : fields?.flat_bbg_rebate && fields?.flat_bbg_overwrite !== null
                                                    ? fields?.flat_bbg_rebate?.toFixed(2)
                                                    : fields?.flat_bbg_overwrite?.toFixed(2)
                                        }
                                        name="flat_bbg_overwrite"
                                        placeholder="25.00"
                                        className={`  block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                    />
                                    <span
                                        className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                        style={{ paddingTop: "3px" }}
                                    >
                                        $
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}

                {type === "PERCENTAGE" && programType === "VOLUME" ? (
                    <div className="grid grid-cols-6 col-span-2">
                        <div className="flex items-center  space-x-5 col-span-6 px-4 py-3 border-b">
                            <label className="text-md   font-medium text-secondary" htmlFor="volume_bbg_rebate">
                                Custom Rebate
                            </label>
                            <div className="relative">
                                <input
                                    id="volume_bbg_rebate"
                                    onChange={handleChange}
                                    value={fields?.volume_bbg_rebate}
                                    name="volume_bbg_rebate"
                                    placeholder="5"
                                    type="number"
                                    className={` block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                />
                                <span
                                    className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                    style={{ paddingTop: "3px" }}
                                >
                                    %
                                </span>
                            </div>
                        </div>
                    </div>
                ) : null}
                {edited ? (
                    <div className="py-2 pr-5 flex flex-col items-end justify-end col-span-2">
                        <Button color="primary" title={"Save Special Deal"} onClick={() => updateOrganization()} />
                        <Button
                            color="secondary"
                            title={programOrganizationPricingHistoryLoading ? "Loading History" : "Pricing History"}
                            onClick={() => {
                                setProgramOrganizationIdForPricingHistoryQuery(fields?.id);
                            }}
                        //onClick={() => updateOrganizationCustomProductsWithNewFields()}
                        />
                    </div>
                ) : null}
            </div>
        ) : null;
    };

    const accordianComponent1 = () => {
        return programType === "FACTORY" ? (
            <div className="grid grid-cols-2 ">
                <div className="sm:grid sm:grid-cols-4 col-span-2 items-start py-3 px-4 border-b">
                    <div className="block text-secondary font-sm col-span-2 font-medium mt-2">
                        Select Overwrite Type
                    </div>
                    <div className="mr-5 flex gap-5 col-span-2">
                        {overWriteTypes.map((item, index) => {
                            if (programType === "VOLUME" && item.name === "AMOUNT") {
                                // eslint-disable-next-line
                                return;
                            }
                            if (programType === "FACTORY" && item.name === "PERCENTAGE") {
                                // eslint-disable-next-line
                                return;
                            }
                            return (
                                <div className="mt-2" key={index}>
                                    <label className="inline-flex items-center ">
                                        <input
                                            type="radio"
                                            name={item.name + "products"}
                                            value={item.name}
                                            className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                            checked={typeProducts === item.name}
                                            onChange={handleTypeChangeProducts}
                                        ></input>
                                        <span className="ml-2 text-sm  text-secondary">{item.label}</span>
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {typeProducts === "AMOUNT" &&
                    programType === "FACTORY" &&
                    !fields?.is_flat_rebate &&
                    !productFields?.customization_id ? (
                    <div className="grid grid-cols-6 col-span-2">
                        <div className="flex items-center col-span-3  space-x-5 3xl:col-span-2 px-4 py-3 border-b">
                            <label
                                className="text-md   font-medium text-secondary"
                                htmlFor="residential_rebate_overwrite"
                            >
                                Residential
                            </label>
                            <div className="relative">
                                <InputDecimal
                                    id="residential_rebate_overwrite"
                                    onChangeFunction={handleProductsChange}
                                    value={
                                        productFields?.residential_rebate_overwrite ||
                                            productFields?.residential_rebate_overwrite === 0
                                            ? productFields?.residential_rebate_overwrite?.toFixed(2)
                                            : productFields?.residential_rebate_amount &&
                                                productFields?.residential_rebate_overwrite !== null
                                                ? productFields?.residential_rebate_amount?.toFixed(2)
                                                : productFields?.multi_unit_rebate_overwrite?.toFixed(2)
                                    }
                                    name="residential_rebate_overwrite"
                                    placeholder="500.00"
                                    className={` block input-no-error w-20 pl-4 focus:outline-none shadow-sm sm:text-sm rounded-md`}
                                />
                                <span
                                    className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                    style={{ paddingTop: "3px" }}
                                >
                                    $
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center col-span-3  space-x-5 3xl:col-span-2  py-3 border-b">
                            <label
                                className="text-md   font-medium text-secondary"
                                htmlFor="commercial_rebate_overwrite"
                            >
                                Commercial
                            </label>
                            <div className="relative">
                                <InputDecimal
                                    id="commercial_rebate_overwrite"
                                    onChangeFunction={handleProductsChange}
                                    value={
                                        productFields?.commercial_rebate_overwrite ||
                                            productFields?.commercial_rebate_overwrite === 0
                                            ? productFields?.commercial_rebate_overwrite?.toFixed(2)
                                            : productFields?.commercial_rebate_amount &&
                                                productFields?.commercial_rebate_overwrite !== null
                                                ? productFields?.commercial_rebate_amount?.toFixed(2)
                                                : productFields?.multi_unit_rebate_overwrite?.toFixed(2)
                                    }
                                    name="commercial_rebate_overwrite"
                                    placeholder="500.00"
                                    className={` block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                />
                                <span
                                    className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                    style={{ paddingTop: "3px" }}
                                >
                                    $
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center col-span-3 px-4 3xl:px-0  space-x-5 3xl:col-span-2  py-3 border-b">
                            <label
                                className="text-md   font-medium text-secondary"
                                htmlFor="multi_unit_rebate_overwrite"
                            >
                                Multi-Unit
                            </label>
                            <div className="relative">
                                <InputDecimal
                                    id="multi_unit_rebate_overwrite"
                                    onChangeFunction={handleProductsChange}
                                    value={
                                        productFields?.multi_unit_rebate_overwrite ||
                                            productFields?.multi_unit_rebate_overwrite === 0
                                            ? productFields?.multi_unit_rebate_overwrite?.toFixed(2)
                                            : productFields?.multi_unit_rebate_amount &&
                                                productFields?.multi_unit_rebate_overwrite !== null
                                                ? productFields?.multi_unit_rebate_amount?.toFixed(2)
                                                : productFields?.multi_unit_rebate_overwrite?.toFixed(2)
                                    }
                                    name="multi_unit_rebate_overwrite"
                                    placeholder="500.00"
                                    className={` block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                />
                                <span
                                    className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                    style={{ paddingTop: "3px" }}
                                >
                                    $
                                </span>
                            </div>
                        </div>
                    </div>
                ) : null}
                {typeProducts === "AMOUNT" &&
                    programType === "FACTORY" &&
                    !fields?.is_flat_rebate &&
                    productFields?.customization_id ? (
                    <div className="grid grid-cols-6 col-span-2">
                        <div className="flex items-center col-span-3  space-x-5 3xl:col-span-2 px-4 py-3 border-b">
                            <div className="relative">
                                <p>{APP_TITLE}</p>
                            </div>
                            <label
                                className="text-md   font-medium text-secondary"
                                htmlFor="residential_rebate_overwrite"
                            >
                                Residential
                            </label>
                            <div className="relative">
                                <InputDecimal
                                    id="cust_bbg_residential_amount"
                                    onChangeFunction={handleProductsChange}
                                    value={typeof productFields?.cust_bbg_residential_amount === "number" ? productFields?.cust_bbg_residential_amount?.toFixed(2) : productFields?.cust_bbg_residential_amount}
                                    name="cust_bbg_residential_amount"
                                    placeholder="500.00"
                                    className={` block input-no-error w-20 pl-4 focus:outline-none shadow-sm sm:text-sm rounded-md`}
                                />
                                <span
                                    className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                    style={{ paddingTop: "3px" }}
                                >
                                    $
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center col-span-3  space-x-5 3xl:col-span-2  py-3 border-b">
                            <label
                                className="text-md   font-medium text-secondary"
                                htmlFor="commercial_rebate_overwrite"
                            >
                                Commercial
                            </label>
                            <div className="relative">
                                <InputDecimal
                                    id="cust_bbg_commercial_amount"
                                    onChangeFunction={handleProductsChange}
                                    defaultValue={typeof productFields?.cust_bbg_commercial_amount === "number" ? productFields?.cust_bbg_commercial_amount?.toFixed(2) : productFields?.cust_bbg_commercial_amount}
                                    name="cust_bbg_commercial_amount"
                                    placeholder="500.00"
                                    className={` block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                />
                                <span
                                    className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                    style={{ paddingTop: "3px" }}
                                >
                                    $
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center col-span-3 px-4 3xl:px-0  space-x-5 3xl:col-span-2  py-3 border-b">
                            <label
                                className="text-md   font-medium text-secondary"
                                htmlFor="multi_unit_rebate_overwrite"
                            >
                                Multi-Unit
                            </label>
                            <div className="relative">
                                <InputDecimal
                                    id="cust_bbg_multi_unit_amount"
                                    onChangeFunction={handleProductsChange}
                                    defaultValue={typeof productFields?.cust_bbg_multi_unit_amount ? productFields?.cust_bbg_multi_unit_amount?.toFixed(2) : productFields?.cust_bbg_multi_unit_amount}
                                    name="cust_bbg_multi_unit_amount"
                                    placeholder="500.00"
                                    className={` block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                />
                                <span
                                    className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                    style={{ paddingTop: "3px" }}
                                >
                                    $
                                </span>
                            </div>
                        </div>
                    </div>
                ) : null}
                {typeProducts === "AMOUNT" &&
                    programType === "FACTORY" &&
                    !fields?.is_flat_rebate &&
                    productFields?.customization_id ? (
                    <div className="grid grid-cols-6 col-span-2">
                        <div className="flex items-center col-span-4  space-x-5 3xl:col-span-2 px-4 py-3 border-b">
                            <div className="relative">
                                <p>{user?.name}</p>
                            </div>
                            <label
                                className="text-md   font-medium text-secondary"
                                htmlFor="residential_rebate_overwrite"
                            >
                                Residential
                            </label>
                            <div className="relative">
                                <InputDecimal
                                    id="cust_builder_residential_amount"
                                    onChangeFunction={handleProductsChange}
                                    defaultValue={typeof productFields?.cust_builder_residential_amount ? productFields?.cust_builder_residential_amount?.toFixed(2) : productFields?.cust_builder_residential_amount}
                                    name="cust_builder_residential_amount"
                                    placeholder="500.00"
                                    className={` block input-no-error w-20 pl-4 focus:outline-none shadow-sm sm:text-sm rounded-md`}
                                />
                                <span
                                    className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                    style={{ paddingTop: "3px" }}
                                >
                                    $
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center col-span-3  space-x-5 3xl:col-span-2  py-3 border-b">
                            <label
                                className="text-md   font-medium text-secondary"
                                htmlFor="commercial_rebate_overwrite"
                            >
                                Commercial
                            </label>
                            <div className="relative">
                                <InputDecimal
                                    id="cust_builder_commercial_amount"
                                    onChangeFunction={handleProductsChange}
                                    defaultValue={typeof productFields?.cust_builder_commercial_amount ? productFields?.cust_builder_commercial_amount?.toFixed(2) : productFields?.cust_builder_commercial_amount}
                                    name="cust_builder_commercial_amount"
                                    placeholder="500.00"
                                    className={` block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                />
                                <span
                                    className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                    style={{ paddingTop: "3px" }}
                                >
                                    $
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center col-span-3 px-4 3xl:px-0  space-x-5 3xl:col-span-2  py-3 border-b">
                            <label
                                className="text-md   font-medium text-secondary"
                                htmlFor="multi_unit_rebate_overwrite"
                            >
                                Multi-Unit
                            </label>
                            <div className="relative">
                                <InputDecimal
                                    id="cust_builder_multi_unit_amount"
                                    onChangeFunction={handleProductsChange}
                                    defaultValue={typeof productFields?.cust_builder_multi_unit_amount ? productFields?.cust_builder_multi_unit_amount?.toFixed(2) : productFields?.cust_builder_multi_unit_amount}
                                    name="cust_builder_multi_unit_amount"
                                    placeholder="500.00"
                                    className={` block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                />
                                <span
                                    className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                    style={{ paddingTop: "3px" }}
                                >
                                    $
                                </span>
                            </div>
                        </div>
                    </div>
                ) : null}
                {typeProducts === "AMOUNT" && programType === "FACTORY" && fields?.is_flat_rebate ? (
                    <div className="border-b px-4 col-span-6   sm:grid sm:grid-cols-2 items-start justify-between py-3 sm:items-center w-full">
                        <div className="sm:grid sm:grid-cols-6 col-span-2 items-start ">
                            <div className="block text-secondary col-span-2 font-sm font-medium mt-2">Flat Rebate</div>
                            <div className="flex col-span-3 md:items-start gap-2 md:gap-3 ml-9 ">
                                <div className="relative">

                                    <InputDecimal
                                        parentClass=""
                                        id="flat_builder_overwrite"
                                        label="Builder"
                                        onChange={handleProductsChange}
                                        width="w-24"
                                        value={
                                            productFields?.flat_builder_overwrite ||
                                                productFields?.flat_builder_overwrite === 0
                                                ? productFields?.flat_builder_overwrite?.toFixed(2)
                                                : productFields?.flat_builder_rebate &&
                                                    productFields?.flat_builder_overwrite !== null
                                                    ? productFields?.flat_builder_rebate?.toFixed(2)
                                                    : null
                                        }
                                        name="flat_builder_overwrite"
                                        placeholder="10.00"
                                        className={` block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                    />
                                    <span
                                        className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                        style={{ paddingTop: "3px" }}
                                    >
                                        $
                                    </span>
                                </div>
                                <div className="relative">
                                    <InputDecimal
                                        width="w-24"
                                        id="flat_bbg_overwrite"
                                        label={APP_TITLE}
                                        onChangeFunction={handleProductsChange}
                                        value={
                                            productFields?.flat_bbg_overwrite || productFields?.flat_bbg_overwrite === 0
                                                ? productFields?.flat_bbg_overwrite?.toFixed(2)
                                                : productFields?.flat_bbg_rebate &&
                                                    productFields?.flat_bbg_overwrite !== null
                                                    ? productFields?.flat_bbg_rebate?.toFixed(2)
                                                    : null
                                        }
                                        name="flat_bbg_overwrite"
                                        placeholder="25.00"
                                        className={` block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                    />
                                    <span
                                        className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                        style={{ paddingTop: "3px" }}
                                    >
                                        $
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}

                {productEdited && !productFields?.customization_id ? (
                    <div className="py-2 pr-5 flex flex-col items-end justify-end col-span-2">
                        <Button
                            color="primary"
                            title={"Save Special Deal"}
                            onClick={() => {
                                updateOrganizationCustomProducts();
                                updateOrganizationCustomProductsPricing();
                            }}
                        />
                        <Button
                            color="secondary"
                            title={productOrganizationPricingHistoryLoading ? "Loading History" : "Pricing History"}
                            onClick={() => {
                                setProductOrganizationIdForPricingHistoryQuery(productFields?.product_id);
                            }}
                        //onClick={() => updateOrganizationCustomProductsWithNewFields()}
                        />
                    </div>
                ) : productEdited && productFields?.customization_id ? (
                    <div className="py-2 pr-5 flex flex-col items-end justify-end col-span-2">
                        <Button
                            color="secondary"
                            title={"Save Special Deal"}
                            onClick={() => {
                                updateOrganizationCustomProductsWithNewFields();
                                updateOrganizationCustomProductsPricing();
                            }}
                        />
                        <Button
                            color="secondary"
                            title={productOrganizationPricingHistoryLoading ? "Loading History" : "Pricing History"}
                            onClick={() => {
                                setProductOrganizationIdForPricingHistoryQuery(productFields?.product_id);
                            }}
                        //onClick={() => updateOrganizationCustomProductsWithNewFields()}
                        />
                    </div>
                ) : null}
            </div>
        ) : null;
    };

    const accordianDataClick = (data) => {
        setModalFields({
            ...modalFields,
            minimum_unit: data?.global_product_minimum_unit,
        });
        let filteredData = data?.pivotPricings?.edges?.find(
            (pivotPricing) => pivotPricing?.node?.relation_id_2 === user?.id
        );
        setFields({
            ...fields,
            id: data?.id,
            volume_bbg_rebate: parseFloat(filteredData?.node?.volume_bbg_rebate),
            commercial_rebate_overwrite: filteredData?.node?.commercial_rebate_amount,
            multi_unit_rebate_overwrite: filteredData?.node?.multi_unit_rebate_amount,
            residential_rebate_overwrite: filteredData?.node?.residential_rebate_amount,
            global_product_commercial_rebate_amount: parseFloat(data?.global_product_commercial_rebate_amount),
            global_product_multi_unit_rebate_amount: parseFloat(data?.global_product_multi_unit_rebate_amount),
            global_product_residential_rebate_amount: parseFloat(data?.global_product_residential_rebate_amount),
            is_flat_rebate: data?.is_flat_rebate,
            flat_bbg_rebate: parseFloat(data?.flat_bbg_rebate),
            flat_builder_rebate: parseFloat(data?.flat_builder_rebate),
            flat_bbg_overwrite: parseFloat(filteredData?.node?.flat_bbg_rebate),
            flat_builder_overwrite: parseFloat(filteredData?.node?.flat_builder_rebate),
            global_bbg_rebate_type: data?.global_bbg_rebate_type,
        });
        setValueToCompare({
            commercial_rebate_overwrite: filteredData?.node?.commercial_rebate_amount,
            multi_unit_rebate_overwrite: filteredData?.node?.multi_unit_rebate_amount,
            residential_rebate_overwrite: filteredData?.node?.residential_rebate_amount,
            volume_bbg_rebate: parseFloat(filteredData?.node?.volume_bbg_rebate),
            flat_bbg_overwrite: parseFloat(data?.flat_bbg_overwrite),
            flat_builder_overwrite: parseFloat(data?.flat_builder_overwrite),
            type: filteredData?.node?.rebate_amount_type || "DEFAULT",
        });
        setType(filteredData?.node?.rebate_amount_type || "DEFAULT");
        setProgramType(data?.type);
        setProgramId(data?.id);
        setProgramNode(data);
    };

    const resetToDefaultMethod = () => {
        setFields({
            ...fields,
            commercial_rebate_overwrite: parseFloat(programNode?.global_product_commercial_rebate_amount),
            multi_unit_rebate_overwrite: parseFloat(programNode?.global_product_multi_unit_rebate_amount),
            residential_rebate_overwrite: parseFloat(programNode?.global_product_residential_rebate_amount),
        });
        setResetToDefault(true);
    };

    useEffect(() => {
        if (resetToDefault === true) {
            updateOrganization();
        }
        // eslint-disable-next-line
    }, [resetToDefault]);

    const accordianDataClick1 = (data) => {
        setProductFields({
            ...productFields,
            commercial_rebate_overwrite: parseFloat(data?.organizationOverwritesPivotById?.commercial_rebate_overwrite),
            multi_unit_rebate_overwrite: parseFloat(data?.organizationOverwritesPivotById?.multi_unit_rebate_overwrite),
            residential_rebate_overwrite: parseFloat(
                data?.organizationOverwritesPivotById?.residential_rebate_overwrite
            ),
            cust_bbg_residential_amount: parseFloat(data?.cust_bbg_residential_amount),
            cust_bbg_multi_unit_amount: parseFloat(data?.cust_bbg_multi_unit_amount),
            cust_bbg_commercial_amount: parseFloat(data?.cust_bbg_commercial_amount),
            cust_builder_residential_amount: parseFloat(data?.cust_builder_residential_amount),
            cust_builder_multi_unit_amount: parseFloat(data?.cust_builder_multi_unit_amount),
            cust_builder_commercial_amount: parseFloat(data?.cust_builder_commercial_amount),
            customization_id: data?.customization_id,
            product_id: data?.id,
            type: data?.organizationOverwritesPivotById?.overwrite_amount_type,
            flat_bbg_overwrite: parseFloat(data?.organizationOverwritesPivotById?.flat_bbg_overwrite),
            flat_builder_overwrite: parseFloat(data?.organizationOverwritesPivotById?.flat_builder_overwrite),
            flat_bbg_rebate: parseFloat(data?.flat_bbg_rebate),
            flat_builder_rebate: parseFloat(data?.flat_builder_rebate),
            commercial_rebate_amount: parseFloat(data?.commercial_rebate_amount),
            multi_unit_rebate_amount: parseFloat(data?.multi_unit_rebate_amount),
            residential_rebate_amount: parseFloat(data?.residential_rebate_amount),
        });
        setValueToCompareProducts({
            commercial_rebate_overwrite: parseFloat(data?.organizationOverwritesPivotById?.commercial_rebate_overwrite),
            multi_unit_rebate_overwrite: parseFloat(data?.organizationOverwritesPivotById?.multi_unit_rebate_overwrite),
            residential_rebate_overwrite: parseFloat(
                data?.organizationOverwritesPivotById?.residential_rebate_overwrite
            ),
            flat_bbg_overwrite: parseFloat(data?.organizationOverwritesPivotById?.flat_bbg_overwrite),
            flat_builder_overwrite: parseFloat(data?.organizationOverwritesPivotById?.flat_builder_overwrite),
            product_id: data?.id,
            type: data?.organizationOverwritesPivotById?.overwrite_amount_type || "DEFAULT",
        });
        setTypeProducts(data?.organizationOverwritesPivotById?.overwrite_amount_type || "DEFAULT");
    };

    const [updateOrganizationCustomProducts] = useMutation(UPDATE_BUILDER, {
        variables: {
            id: user?.id,
            programOverwrites: [],
            customProductsPivot: {
                id: productFields?.product_id,
                program_id: fields?.id,
                overwrite_amount_type: typeProducts,
                residential_rebate_overwrite: productFields?.residential_rebate_overwrite,
                multi_unit_rebate_overwrite: productFields?.multi_unit_rebate_overwrite,
                commercial_rebate_overwrite: productFields?.commercial_rebate_overwrite,
                flat_builder_overwrite: productFields?.flat_builder_overwrite,
                flat_bbg_overwrite: productFields?.flat_bbg_overwrite,
            },
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: GET_BUILDERS,
            });

            delete Object.assign(result.data, {
                node: result.data["updateOrganization"],
            })["updateOrganization"];

            cache.writeQuery({
                query: GET_BUILDERS,
                data: {
                    organizations: {
                        edges: [
                            result.data,
                            ...data.organizations.edges.filter((u) => u.node.id !== result?.data?.node?.id),
                        ],
                    },
                },
            });
            setReset(true);
            toast.success("Builder saved!");
            setResetToDefault(false);
            getProducts();
            callBack(result?.data?.node);
        },
    });

    const [updateOrganizationCustomProductsPricing] = useMutation(UPDATE_BUILDER_PRODUCT, {
        variables: {
            id: productFields?.product_id,
            organization_id: user?.id,
            rebate_amount_type: typeProducts,
            residential_rebate_amount: productFields?.residential_rebate_overwrite,
            commercial_rebate_amount: productFields?.commercial_rebate_overwrite,
            multi_unit_rebate_amount: productFields?.multi_unit_rebate_overwrite,
            flat_bbg_rebate: productFields?.flat_bbg_overwrite,
            flat_builder_rebate: productFields?.flat_builder_overwrite,
            cust_bbg_residential_amount: productFields?.cust_bbg_residential_amount,
            cust_bbg_commercial_amount: productFields?.cust_bbg_commercial_amount,
            cust_bbg_multi_unit_amount: productFields?.cust_bbg_multi_unit_amount,
            cust_builder_residential_amount: productFields?.cust_builder_residential_amount,
            cust_builder_commercial_amount: productFields?.cust_builder_commercial_amount,
            cust_builder_multi_unit_amount: productFields?.cust_builder_multi_unit_amount,
        },
    });

    const [updateOrganizationCustomProductsWithNewFields] = useMutation(UPDATE_BUILDER_CUSTOM_PRODUCT, {
        variables: {
            id: productFields?.product_id,
            cust_bbg_residential_amount: productFields?.cust_bbg_residential_amount,
            cust_bbg_commercial_amount: productFields?.cust_bbg_commercial_amount,
            cust_bbg_multi_unit_amount: productFields?.cust_bbg_multi_unit_amount,
            cust_builder_residential_amount: productFields?.cust_builder_residential_amount,
            cust_builder_commercial_amount: productFields?.cust_builder_commercial_amount,
            cust_builder_multi_unit_amount: productFields?.cust_builder_multi_unit_amount,
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: GET_BUILDERS,
            });

            delete Object.assign(result.data, {
                node: result.data["updateOrganization"],
            })["updateOrganization"];

            cache.writeQuery({
                query: GET_BUILDERS,
                data: {
                    organizations: {
                        edges: [
                            result.data,
                            ...data.organizations.edges.filter((u) => u.node.id !== result?.data?.node?.id),
                        ],
                    },
                },
            });
            setReset(true);
            toast.success("Builder saved!");
            setResetToDefault(false);
            getProducts();
        },
    });

    useEffect(() => {
        if (deleteId) {
            deleteProgramFromBuilder();
        }
        // eslint-disable-next-line
    }, [deleteId]);

    const [deleteProgramFromBuilder] = useMutation(UPDATE_BUILDER_REMOVE_PROGRAM, {
        variables: {
            id: user?.id,
            programId: [deleteId],
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: GET_BUILDERS,
            });

            delete Object.assign(result.data, {
                node: result.data["updateOrganization"],
            })["updateOrganization"];

            cache.writeQuery({
                query: GET_BUILDERS,
                data: {
                    organizations: {
                        edges: [
                            result.data,
                            ...data.organizations.edges.filter((u) => u.node.id !== result?.data?.node?.id),
                        ],
                    },
                },
            });
            setReset(true);
            setDeleteId("");
            toast.success("Builder saved!");
            setResetToDefault(false);
            callBack(result?.data?.node);
        },
    });

    useEffect(() => {
        if (programIdToAdd) {
            addCustomProgram();
        }
        // eslint-disable-next-line
    }, [programIdToAdd]);

    const [addCustomProgram] = useMutation(UPDATE_BUILDER_ADD_PROGRAM, {
        variables: {
            id: user?.id,
            programOverwrites: [
                {
                    id: programIdToAdd,
                },
            ],
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: GET_BUILDERS,
            });

            delete Object.assign(result.data, {
                node: result.data["updateOrganization"],
            })["updateOrganization"];

            cache.writeQuery({
                query: GET_BUILDERS,
                data: {
                    organizations: {
                        edges: [
                            result.data,
                            ...data.organizations.edges.filter((u) => u.node.id !== result?.data?.node?.id),
                        ],
                    },
                },
            });
            toast.success("Builder saved!");
            setResetToDefault(false);
            setProgramIdToAdd("");
            getProducts();
            callBack(result?.data?.node);
        },
    });

    const [updateOrganization] = useMutation(UPDATE_BUILDER_OVERRITES, {
        variables: {
            id: user?.id,
            overwrite_amount_type: type,
            program_id: fields?.id,
            volume_bbg_rebate: type === "DEFAULT" && type === "AMOUNT" ? null : parseFloat(fields?.volume_bbg_rebate),
            residential_rebate_overwrite: type === "DEFAULT" ? null : parseFloat(fields?.residential_rebate_overwrite),
            multi_unit_rebate_overwrite: type === "DEFAULT" ? null : parseFloat(fields?.multi_unit_rebate_overwrite),
            commercial_rebate_overwrite: type === "DEFAULT" ? null : parseFloat(fields?.commercial_rebate_overwrite),
            flat_builder_overwrite: type === "DEFAULT" ? null : parseFloat(fields?.flat_builder_overwrite),
            flat_bbg_overwrite: type === "DEFAULT" ? null : parseFloat(fields?.flat_bbg_overwrite),
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: GET_BUILDERS,
            });

            delete Object.assign(result.data, {
                node: result.data["updateOrganizationProgramOverwrites"],
            })["updateOrganizationProgramOverwrites"];
            cache.writeQuery({
                query: GET_BUILDERS,
                data: {
                    organizations: {
                        edges: [
                            result.data,
                            ...data.organizations.edges.filter((u) => u.node.id !== result?.data?.node?.id),
                        ],
                    },
                },
            });
            setReset(true);
            toast.success("Builder saved!");
            getProducts();
            setResetToDefault(false);
            callBack(user);
        },
    });

    useEffect(() => {
        if (programId !== null) {
            getProducts();
        }
        // eslint-disable-next-line
    }, [programId]);

    const [getProducts, { data: products, loading: productsLoading }] = useLazyQuery(FETCH_PRODUCTS_PER_PROGRAM, {
        variables: {
            programId: parseInt(programId),
            organization_id: user?.id,
        },
        fetchPolicy: "no-cache",
        notifyOnNetworkStatusChange: false,
    });

    const IconJSX = () => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-14 w-14 text-brickGreen"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                />
            </svg>
        );
    };

    const categoriesHandler = (e) => {
        const value = e && e.value;
        setCategory(value);
    };

    const handleBuildersChange = (e) => {
        setSearchBuildersString(e.target.value);
        if (e.target.value.length > 1) {
            setBuilderProgramSearch(true);
        }
    };

    const debouncedValue = useDebounce(searchBuildersString, 160);

    useEffect(() => {
        if (debouncedValue?.length > 2 && builderProgramSearch) {
            searchPrograms();
            setBuilderProgramSearch(false);
        }
        // eslint-disable-next-line
    }, [debouncedValue]);

    const [searchPrograms, { data: searchedPrograms, loading: searchedLoading }] = useLazyQuery(
        SEARCH_ORGANIZATION_AVAILABLE_PROGRAMS,
        {
            variables: {
                search: debouncedValue,
                id: user?.id,
            },
            fetchPolicy: "no-cache",
            notifyOnNetworkStatusChange: false,
        }
    );

    const [
        getProgramOrganizationPricingHistory,
        { data: programOrganizationPricingHistory, loading: programOrganizationPricingHistoryLoading },
    ] = useLazyQuery(GET_PROGRAM_ORGANIZATION_PRICING_HISTORY, {
        variables: {
            program_id: programOrganizationIdForPricingHistoryQuery,
            organization_id: user?.id,
        },
        onCompleted() {
            setShowPricingModal(true);
        },
        fetchPolicy: "no-cache",
    });

    const [
        getProductOrganizationPricingHistory,
        { data: productOrganizationPricingHistory, loading: productOrganizationPricingHistoryLoading },
    ] = useLazyQuery(GET_PRODUCT_ORGANIZATION_PRICING_HISTORY, {
        variables: {
            product_id: productOrganizationIdForPricingHistoryQuery,
            organization_id: user?.id,
        },
        onCompleted() {
            setShowPricingProductOrganizationModal(true);
        },
        fetchPolicy: "no-cache",
    });

    const [createProduct] = useMutation(CREATE_PRODUCT, {
        variables: {
            organization_id: user?.id,
            bbg_product_code: modalFields?.bbg_product_code,
            name: modalFields?.product_name,
            description: modalFields?.description,
            product_line: modalFields?.product_line,
            programID: fields?.id,
            category: isNaN(category) ? { name: category } : { id: category },
            minimum_unit: parseInt(modalFields?.minimum_unit),
            require_quantity_reporting: requireQuantityReporting,
            customization_id: user?.id,
            cust_bbg_residential_amount: parseFloat(modalFields?.residential_rebate_amount),
            cust_bbg_commercial_amount: parseFloat(modalFields?.multi_unit_rebate_amount),
            cust_bbg_multi_unit_amount: parseFloat(modalFields?.commercial_rebate_amount),
            cust_builder_residential_amount: parseFloat(modalFields?.residential_builder_rebate_amount),
            cust_builder_commercial_amount: parseFloat(modalFields?.multi_builder_unit_rebate_amount),
            cust_builder_multi_unit_amount: parseFloat(modalFields?.commercial_builder_rebate_amount),
            flat_builder_rebate: parseFloat(modalFields?.flat_builder_rebate),
            flat_bbg_rebate: parseFloat(modalFields?.flat_bbg_rebate),
            create_pricing_array: [
                {
                    relation_model_2: "ORGANIZATION",
                    relation_id_2: user?.id,
                    cust_bbg_residential_amount: parseFloat(modalFields?.residential_rebate_amount),
                    cust_bbg_commercial_amount: parseFloat(modalFields?.multi_unit_rebate_amount),
                    cust_bbg_multi_unit_amount: parseFloat(modalFields?.commercial_rebate_amount),
                    cust_builder_residential_amount: parseFloat(modalFields?.residential_builder_rebate_amount),
                    cust_builder_commercial_amount: parseFloat(modalFields?.multi_builder_unit_rebate_amount),
                    cust_builder_multi_unit_amount: parseFloat(modalFields?.commercial_builder_rebate_amount),
                    flat_builder_rebate: parseFloat(modalFields?.flat_builder_rebate),
                    flat_bbg_rebate: parseFloat(modalFields?.flat_bbg_rebate),
                },
            ],
        },
        update(cache, result) {
            getCategories();
            getProducts();
            toast.success("Product saved!");
            setModalFields(initialValue);
            setShowModal(false);
        },
    });

    const newProductContent = () => {
        return (
            <div className="grid grid-cols-1 w-full space-y-5 -my-4 max-h-smallMin overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                <TextField
                    parentClass="justify-items-start col-span-2 mt-4 grid grid-cols-2 md:grid-cols-3 items-center px-4  "
                    id="product_name"
                    label="Product Name"
                    name="product_name"
                    placeholder="Product Name"
                    type="text"
                    value={modalFields?.product_name}
                    required={true}
                    onChange={handleModalChange}
                    error={modalFieldsError?.product_name}
                    errorBelow
                    errorMessage={"Enter valid Product Name"}
                />
                <div className=" col-span-2 grid grid-cols-2 md:grid-cols-3 items-center px-4 pt-3">
                    <label className="block text-md font-medium text-secondary text-left">
                        Category
                        <span className="text-brickRed"> * </span>
                    </label>
                    <div className="flex flex-col">
                        <CommonSelect
                            error={modalFieldsError?.category}
                            value={{
                                label: modalFields?.category?.name,
                                value: modalFields?.category?.id,
                            }}
                            creatable
                            options={categories && categories.productCategories}
                            className="w-full"
                            placeHolder="Category"
                            menuPlacement={"bottom"}
                            onChange={(e) => {
                                categoriesHandler(e);
                                setModalFields({
                                    ...modalFields,
                                    category: {
                                        id: e && e.value,
                                        name: e && e.label,
                                    },
                                });
                            }}
                        />

                        {modalFieldsError?.category ? (
                            <p className="self-start  text-xs text-brickRed font-medium"> Select/Create a Category</p>
                        ) : null}
                    </div>
                </div>
                <TextField
                    parentClass="justify-items-start col-span-2 grid grid-cols-2 md:grid-cols-3 items-center  px-4 "
                    id="bbg_product_code"
                    label={APP_TITLE + " Code"}
                    name="bbg_product_code"
                    value={modalFields?.bbg_product_code}
                    placeholder={APP_TITLE + " Product Code"}
                    type="text"
                    errorBelow
                    required
                    onChange={handleModalChange}
                    error={modalFieldsError?.bbg_product_code}
                    errorMessage={"Enter valid " + APP_TITLE + " Code"}
                />
                <TextField
                    parentClass="justify-items-start col-span-2 grid grid-cols-2 md:grid-cols-3 items-center  px-4 pt-2"
                    textarea
                    required
                    id="description"
                    label={APP_TITLE + " Description"}
                    errorBelow
                    name="description"
                    placeholder="Brief Description"
                    value={modalFields?.description}
                    type="text"
                    error={modalFieldsError?.description}
                    errorMessage={"Enter valid Description"}
                    onChange={handleModalChange}
                />
                <TextField
                    parentClass="justify-items-start col-span-2 grid grid-cols-2 md:grid-cols-3 items-center px-4  "
                    id="product_line"
                    label="Product Line"
                    name="product_line"
                    placeholder="Product Line"
                    type="text"
                    value={modalFields?.product_line}
                    onChange={handleModalChange}
                />
                {programType === "FACTORY" ? (
                    <TextField
                        parentClass="justify-items-start col-span-2 grid grid-cols-2 md:grid-cols-3 items-center px-4 "
                        id="minimum_unit"
                        label="Product Minimum"
                        name="minimum_unit"
                        errorBelow
                        disabled={programNode?.product_minimum_unit_requirement === "SAME_FOR_ALL"}
                        value={modalFields?.minimum_unit}
                        placeholder="Minimum Unit"
                        type="number"
                        onChange={handleModalChange}
                        required={programNode?.product_minimum_unit_requirement === "CUSTOM"}
                        error={modalFieldsError?.minimum_unit}
                        errorMessage={"Minimum units are required"}
                    />
                ) : null}
                {programType === "FACTORY" ? (
                    <div className="col-span-2 grid grid-cols-3 px-4">
                        <div className=" ">
                            <label
                                htmlFor={"requireQuantityReporting"}
                                className="text-md text-secondary font-medium  cursor-pointer"
                            >
                                Require Quantity Reporting
                                <span className="text-brickRed">*</span>
                            </label>
                        </div>
                        <div className="flex items-center h-6 ">
                            <input
                                value={"requireQuantityReporting"}
                                id={"requireQuantityReporting"}
                                name={"requireQuantityReporting"}
                                type="checkbox"
                                checked={requireQuantityReporting}
                                onChange={() => setRequireQuantityReporting(!requireQuantityReporting)}
                                className="focus:ring-secondary h-6 w-6 text-secondary border-gray-300 rounded"
                            />
                        </div>
                    </div>
                ) : null}

                {programType === "FACTORY" && !fields?.is_flat_rebate ? (
                    <div className="grid grid-cols-3 col-span-3   py-3  items-start gap-5 px-4">
                        <div className="block text-secondary font-sm font-medium  py-3">{APP_TITLE} Keeps</div>
                        <div className="flex flex-col col-span-2 md:grid md:grid-cols-3 md:items-start gap-2 md:gap-3">
                            <div>
                                <label
                                    className="text-md   font-medium text-secondary"
                                    htmlFor="residential_rebate_amount"
                                >
                                    Residential
                                </label>
                                <div className="relative">
                                    <InputDecimal
                                        parentClass=""
                                        id="residential_rebate_amount"
                                        label="Residential"
                                        onChangeFunction={handleModalChange}
                                        value={typeof modalFields?.residential_rebate_amount === "number" ? modalFields?.residential_rebate_amount?.toFixed(2) : modalFields?.residential_rebate_amount}
                                        name="residential_rebate_amount"
                                        placeholder="0.00"
                                        className={` block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                    />
                                    <span
                                        className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                        style={{ paddingTop: "3px" }}
                                    >
                                        $
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label
                                    className="text-md   font-medium text-secondary"
                                    htmlFor="multi_unit_rebate_amount"
                                >
                                    Multi Unit
                                </label>
                                <div className="relative">
                                    <InputDecimal
                                        parentClass=""
                                        id="multi_unit_rebate_amount"
                                        label="Multi-Unit"
                                        onChangeFunction={handleModalChange}
                                        value={typeof modalFields?.multi_unit_rebate_amount === "number" ? modalFields?.multi_unit_rebate_amount?.toFixed(2) : modalFields?.multi_unit_rebate_amount}
                                        name="multi_unit_rebate_amount"
                                        placeholder="0.00"
                                        className={` block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                    />
                                    <span
                                        className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                        style={{ paddingTop: "3px" }}
                                    >
                                        $
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label
                                    className="text-md   font-medium text-secondary"
                                    htmlFor="commercial_rebate_amount"
                                >
                                    Commercial
                                </label>
                                <div className="relative">
                                    <InputDecimal
                                        id="commercial_rebate_amount"
                                        label="Commercial"
                                        onChangeFunction={handleModalChange}
                                        value={typeof modalFields?.commercial_rebate_amount === "number" ? modalFields?.commercial_rebate_amount?.toFixed(2) : modalFields?.commercial_rebate_amount}
                                        name="commercial_rebate_amount"
                                        placeholder="0.00"
                                        className={` block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                    />
                                    <span
                                        className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                        style={{ paddingTop: "3px" }}
                                    >
                                        $
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}

                {fields?.is_flat_rebate ? (
                    <div className="grid grid-cols-3 col-span-3   py-3  items-start gap-5 px-4">
                        <div className="block text-secondary font-sm font-medium  py-3">Flat Rebates</div>
                        <div className="flex flex-col col-span-2 md:grid md:grid-cols-3 md:items-start gap-2 md:gap-3">
                            <div>
                                <label
                                    className="text-md   font-medium text-secondary"
                                    htmlFor="commercial_rebate_amount"
                                >
                                    Flat Builder Rebate
                                </label>

                                <div className="relative">
                                    <InputDecimal
                                        id="flat_builder_rebate"
                                        label="Builder Amount"
                                        onChangeFunction={handleModalChange}
                                        width="w-24"
                                        value={typeof modalFields?.flat_builder_rebate === "number" ? modalFields?.flat_builder_rebate?.toFixed(2) : modalFields?.flat_builder_rebate}
                                        name="flat_builder_rebate"
                                        placeholder="10.00"
                                        className={` block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                    />
                                    <span
                                        className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                        style={{ paddingTop: "3px" }}
                                    >
                                        $
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label
                                    className="text-md   font-medium text-secondary"
                                    htmlFor="commercial_rebate_amount"
                                >
                                    Flat {APP_TITLE} Rebate
                                </label>
                                <div className="relative">
                                    <InputDecimal
                                        width="w-24"
                                        id="flat_bbg_rebate"
                                        label={APP_TITLE + " Amount"}
                                        onChangeFunction={handleModalChange}
                                        value={typeof modalFields?.flat_bbg_rebate === "number" ? modalFields?.flat_bbg_rebate?.toFixed(2) : modalFields?.flat_bbg_rebate}
                                        isDollar
                                        name="flat_bbg_rebate"
                                        placeholder="25.00"
                                        className={`block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                    />
                                    <span
                                        className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                        style={{ paddingTop: "3px" }}
                                    >
                                        $
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}

                {programType === "FACTORY" && !fields?.is_flat_rebate ? (
                    <div className="grid grid-cols-3 col-span-3   py-3  items-start gap-5 px-4">
                        <div className="block text-secondary font-sm font-medium  py-3">{user?.name} Keeps</div>
                        <div className="flex flex-col col-span-2 md:grid md:grid-cols-3 md:items-start gap-2 md:gap-3">
                            <div>
                                <label
                                    className="text-md   font-medium text-secondary"
                                    htmlFor="commercial_rebate_amount"
                                >
                                    Residential
                                </label>
                                <div className="relative">
                                    <InputDecimal
                                        id="residential_builder_rebate_amount"
                                        label="Residential"
                                        onChangeFunction={handleModalChange}
                                        value={typeof modalFields?.residential_builder_rebate_amount === "number" ? modalFields?.residential_builder_rebate_amount?.toFixed(2) : modalFields?.residential_builder_rebate_amount}
                                        name="residential_builder_rebate_amount"
                                        placeholder="0.00"
                                        className={`block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                    />
                                    <span
                                        className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                        style={{ paddingTop: "3px" }}
                                    >
                                        $
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label
                                    className="text-md   font-medium text-secondary"
                                    htmlFor="commercial_rebate_amount"
                                >
                                    Multi Unit
                                </label>
                                <div className="relative">
                                    <InputDecimal
                                        id="multi_builder_unit_rebate_amount"
                                        label="Multi-Unit"
                                        onChangeFunction={handleModalChange}
                                        value={typeof modalFields?.multi_builder_unit_rebate_amount === "number" ? modalFields?.multi_builder_unit_rebate_amount?.toFixed(2) : modalFields?.multi_builder_unit_rebate_amount}
                                        name="multi_builder_unit_rebate_amount"
                                        placeholder="0.00"
                                        className={`block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                    />
                                    <span
                                        className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                        style={{ paddingTop: "3px" }}
                                    >
                                        $
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label
                                    className="text-md   font-medium text-secondary"
                                    htmlFor="commercial_rebate_amount"
                                >
                                    Commercial
                                </label>
                                <div className="relative">
                                    <InputDecimal
                                        id="commercial_builder_rebate_amount"
                                        label="Commercial"
                                        onChangeFunction={handleModalChange}
                                        value={typeof modalFields?.commercial_builder_rebate_amount === "number" ? modalFields?.commercial_builder_rebate_amount?.toFixed(2) : modalFields?.commercial_builder_rebate_amount}
                                        name="commercial_builder_rebate_amount"
                                        placeholder="0"
                                        className={`block input-no-error w-20 focus:outline-none pl-4 shadow-sm sm:text-sm rounded-md`}
                                    />
                                    <span
                                        className="absolute inset-y-0 left-0 bottom-1 pl-2 flex items-center text-sm text-secondary pointer-events-none"
                                        style={{ paddingTop: "3px" }}
                                    >
                                        $
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    };

    const modal = () => {
        return (
            <>
                <Modal
                    width={"2xl"}
                    title={`Add a Custom Product: ${programNode?.name}`}
                    Content={newProductContent()}
                    submitLabel="Confirm"
                    disabled={finalError?.customProduct}
                    onClose={() => {
                        setShowModal(false);
                    }}
                    onSubmit={() => createProduct()}
                    IconJSX={<IconJSX />}
                    show={showModal}
                />
            </>
        );
    };

    const modalHandler = () => {
        setShowModal(true);
    };

    return (
        <div className="grid grid-cols-2 min-h-smallMin">
            {pricingProgramOrganizationModal()}
            {pricingProductOrganizationModal()}
            <div className="border-r">
                <div className="flex  border-b px-4 flex-col">
                    <div className="flex  items-center py-3" style={{ maxHeight: "64px" }}>
                        <p className="text-md  font-title text-secondary font-bold w-full">Builder Programs</p>
                        <input
                            type="text"
                            name="searchBuilders"
                            value={searchBuildersString}
                            id="searchBuilders"
                            className="focus:ring-secondary focus:border-secondary block w-full rounded-md sm:text-sm border-gray-300"
                            placeholder="Find or Add"
                            onChange={handleBuildersChange}
                        />
                    </div>

                    {searchBuildersString?.length > 0 ? (
                        <div className=" col-span-1 mt-3 max-h-48  mb-3  bg-white overflow-auto  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                            {searchedLoading ? (
                                <div className="border rounded-lg">
                                    <Loader />
                                </div>
                            ) : searchedPrograms?.searchOrganizationAvailablePrograms?.edges?.length === 0 ? (
                                <div className="border rounded-lg py-2 px-2 text-secondary font-title font-semibold flex items-center justify-between">
                                    <p> No Results Found </p>
                                    <span
                                        className="underline cursor-pointer text-brickRed"
                                        onClick={() => {
                                            setSearchBuildersString("");
                                        }}
                                    >
                                        {" "}
                                        Reset{" "}
                                    </span>
                                </div>
                            ) : (
                                <div
                                    className={`${searchedPrograms?.searchOrganizationAvailablePrograms?.edges?.length > 0
                                        ? "border rounded-lg "
                                        : ""
                                        }`}
                                >
                                    {searchedPrograms?.searchOrganizationAvailablePrograms?.edges?.length > 0 &&
                                        searchedPrograms?.searchOrganizationAvailablePrograms?.edges.map((item) => {
                                            return (
                                                <div className="flex items-center w-full py-4 border-b">
                                                    <div className="min-w-0 flex-1 flex">
                                                        <div className=" flex-1 px-2 flex justify-between md:gap-4 items-center">
                                                            <div className="flex flex-col items-start">
                                                                <div className="group relative   flex justify-between items-center">
                                                                    <p className="text-sm font-semibold text-gray-500">
                                                                        <div className="focus:outline-none">
                                                                            {item.node.name}
                                                                        </div>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="text-secondary">
                                                                {user?.programs?.edges?.findIndex(
                                                                    (element) =>
                                                                        parseInt(element?.node?.id) ===
                                                                        parseInt(item?.node?.id)
                                                                ) === -1 ? (
                                                                    <PlusCircleIcon
                                                                        className="w-8 h-8 text-brickGreen cursor-pointer"
                                                                        onClick={() => {
                                                                            setProgramIdToAdd(item?.node?.id);
                                                                            setSearchBuildersString("");
                                                                            setBuilderProgramSearch(false);
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    "Added"
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
                {user?.programs?.edges?.length === 0 ? (
                    user?.approved_states?.edges?.length === 0 ? (
                        <div className="rounded-lg py-2 px-4 text-secondary font-title font-semibold flex items-center justify-between">
                            <p>
                                {" "}
                                You must select at least 1 State or Province for Program Participation, in the
                                Membership Tab.{" "}
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-lg py-2 px-4 text-secondary font-title font-semibold flex items-center justify-between">
                            <p> 0 Programs Assigned! </p>
                        </div>
                    )
                ) : null}

                <Accordian
                    onClick={(data) => {
                        accordianDataClick(data?.node);
                    }}
                    reset={reset}
                    component={accordianComponent()}
                    deleteIcon
                    deleteAction={(id) => setDeleteId(id)}
                    Data={user?.programs?.edges}
                />
            </div>

            <div className="">
                <div className="flex justify-between items-center  border-b">
                    <p className="text-md px-4 font-title text-secondary font-bold py-5 pb-5">
                        Products & Custom Rebates
                    </p>
                    {programId ? (
                        <PlusCircleIcon
                            className="w-8 h-8 mr-4 text-brickGreen cursor-pointer"
                            onClick={() => {
                                modalHandler();
                            }}
                        />
                    ) : null}
                    {modal()}
                </div>
                {productsLoading ? (
                    <Loader />
                ) : (
                    <Accordian
                        onClick={(data) => {
                            accordianDataClick1(data?.node);
                        }}
                        reset={reset}
                        component={accordianComponent1()}
                        Data={products?.productsPerProgram?.edges}
                    />
                )}
            </div>
        </div>
    );
};

export default ProgramBuilders;
