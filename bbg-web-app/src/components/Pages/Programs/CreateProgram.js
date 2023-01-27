import React, { useState, useEffect, useContext } from "react";
import TextField from "../../FormGroups/Input";
import { useMutation, useLazyQuery } from "@apollo/client";
import { Disclosure, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import {
    CREATE_PROGRAM,
    FETCH_PROGRAMS_QUERY,
    UPDATE_PROGRAM,
    CREATE_PRODUCT,
    UPDATE_PRODUCT,
    FETCH_PRODUCTS_PER_PROGRAM,
    FETCH_CATEGORIES_QUERY,
    DELETE_PROGRAM,
    GET_PROGRAM_PRICING_HISTORY,
    GET_PRODUCT_PRICING_HISTORY,
} from "../../../lib/programs";
import { FETCH_ORGANIZATIONS_QUERY } from "../../../lib/organization";
import Button from "../../Buttons";
import CommonSelect from "../../Select";
import { FETCH_STATES_QUERY } from "../../../lib/common";
import { ChevronDownIcon, ChevronUpIcon, PlusCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import RichText from "../../RichTextEditor";
import Modal from "../../Modal";
import Conversions from "./Conversions/Conversions";
import ClaimsTemplate from "./ClaimsTemplate/ClaimsTemplate";
import { Link } from "react-router-dom";
import Loader from "../../Loader/Loader";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { SEARCH_PRODUCTS } from "../../../lib/search";
import { useDebounce } from "../../../util/hooks";
import { AuthContext } from "../../../contexts/auth";
import { formatterForCurrency } from "../../../util/generic";
import { APP_TITLE } from "../../../util/constants";

const CreateProgram = ({
    archieved,
    edit,
    user,
    fillColumns,
    callBack,
    createNew,
    openAbout,
    openConversion,
    searchString,
    resetState,
    refetch,
    loading,
    afterDelete,
}) => {
    /* React State Starts */
    const [fields, setFields] = useState(user);
    const [assignBuilders, setAssignBuilders] = useState();
    const [active, setActive] = useState("about");
    const [show, setShow] = useState(false);
    const [customizable, setCustomizable] = useState("");
    const [participate, setParticipate] = useState("");
    const [customizableState, setCustomizableState] = useState("");
    const [reportQuantity, setReportQuantity] = useState();
    const [rebateType, setRebateType] = useState("");
    const [flatRebate, setFlatRebate] = useState(false);
    const [rebateUnit, setRebateUnit] = useState("");
    const [proofPoints, setProofPoints] = useState(["require_certificate_occupancy"]);
    const [minQuantity, setMinQuantity] = useState("");
    // const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [nullReactSelect, setNullReactSelect] = useState(false);
    const [programParticipants, setProgramParticipants] = useState([]);
    const [state, setState] = useState([]);
    const [category, setCategory] = useState();
    const [addressType, setAddressType] = useState("");
    const [internalDescription, setInternalDescription] = useState();
    const [builderShortDescription, setBuilderShortDescription] = useState();
    const [builderFullDescription, setBuilderFullDescription] = useState();
    const [modalFields, setModalFields] = useState();
    const [requireQuantityReporting, setRequireQuantityReporting] = useState(false);
    const [productEdit, setProductEdit] = useState(false);
    const [programId, setProgramId] = useState();
    const [showModal, setShowModal] = useState(false);
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [modalContent, setModalContent] = useState(false);
    const [productSearch, setProductSearch] = useState(false);
    const [productSearchString, setProductSearchString] = useState("");
    const [addOrRemoveProductId, setAddOrRemoveProductId] = useState("");
    const [productIdForHistoryQuery, setProductIdForHistoryQuery] = useState(null);
    const [programActionType, setProgramActionType] = useState("");
    const [errors, setErrors] = useState({
        name: false,
        startDate: false,
        endDate: false,
    });
    const [modalFieldsError, setModalFieldsError] = useState({
        product_name: false,
    });

    const [finalError, setFinalError] = useState({
        about: false,
        description: false,
    });
    const [descriptionErrors, setDescriptionErrors] = useState({});
    const { impersonator } = useContext(AuthContext);

    /* React State Ends */

    const { organizationId } = useContext(AuthContext);

    /* Radio Options Starts */
    const programValidityOptions = [
        { name: "US", label: "All US States" },
        { name: "US_AND_CA", label: "All US States & CAN Provinces" },
        { name: "CA", label: "All CAN Province (Only)" },
        { name: "CUSTOM", label: "Choose" },
    ];

    const requiredProofPoints = [
        { name: "require_distributor", label: "Subcontractor/Distributor/Provider" },
        {
            name: "require_certificate_occupancy",
            label: "Confirmation of CO (via date in Action Required - no document upload)",
        },
        { name: "require_brand", label: "Brand" },
        { name: "require_serial_number", label: "Serial Number" },
        { name: "require_model_number", label: "Model Number" },
        { name: "require_date_of_installation", label: "Date of Installation" },
        { name: "require_date_of_purchase", label: "Date of Purchase" },
    ];

    const minimumUnits = [
        { name: "NO", label: "No" },
        { name: "SAME_FOR_ALL", label: "Yes - Same for All" },
        { name: "CUSTOM", label: "Yes - Set at Product Level" },
    ];

    const rebateUnitOptions = [
        { name: "PER_INSTALL_UNIT", label: "Per Property" },
        { name: "PER_UNIT", label: "Per Installed Unit" },
    ];

    const rebateTypeOptions = [
        { name: "SAME", label: "Same amount for all products" },
        { name: "DIFFERENT", label: "Amount By Product" },
    ];

    const addressRequirements = [
        {
            name: "ADDRESS_ONLY",
            label: "Program accepts physical address only (not Lot#)",
        },
        {
            name: "ADDRESS_OR_LOT",
            label: "Program accepts physical address AND/OR Lot#",
        },
        {
            name: "ADDRESS_OR_LOT_WITH_SUBDIVISION",
            label: "Program accepts physical address OR Lot# ONLY if Lot# is accompanied by subdivision",
        },
    ];

    useEffect(() => {
        if (rebateUnit === "PER_UNIT") {
            setReportQuantity(true);
        }
    }, [rebateUnit]);

    /* Radio Options Ends */
    useEffect(() => {
        if (internalDescription?.length < 10) {
            setDescriptionErrors({
                ...descriptionErrors,
                internalDescription: true,
            });
        }
        // eslint-disable-next-line
    }, [internalDescription]);

    useEffect(() => {
        if (builderShortDescription?.length < 10) {
            setDescriptionErrors({
                ...descriptionErrors,
                builderShortDescription: true,
            });
        }
        // eslint-disable-next-line
    }, [builderShortDescription]);

    useEffect(() => {
        if (builderFullDescription?.length < 10) {
            setDescriptionErrors({
                ...descriptionErrors,
                builderFullDescription: true,
            });
        }
        // eslint-disable-next-line
    }, [builderFullDescription]);

    useEffect(
        () => {
            let finalDescriptionError =
                descriptionErrors?.internalDescription ||
                descriptionErrors?.builderShortDescription ||
                descriptionErrors?.builderFullDescription;

            setFinalError({
                ...finalError,
                description: finalDescriptionError,
            });
        },
        // eslint-disable-next-line
        [descriptionErrors, internalDescription, builderShortDescription, builderFullDescription]
    );

    /* Handle Changes Starts */
    const handleEditorChange = (content, editor) => {
        setInternalDescription(content);
        // if (content?.length >= 10) {
        //     setDescriptionErrors({
        //         ...descriptionErrors,
        //         internalDescription: false,
        //     });
        // }
    };

    const handleBuilderShortChange = (content, editor) => {
        setBuilderShortDescription(content);
        // if (content?.length >= 10) {
        //     setDescriptionErrors({
        //         ...descriptionErrors,
        //         builderShortDescription: false,
        //     });
        // }
    };

    const handleBuilderFullChange = (content, editor) => {
        setBuilderFullDescription(content);
        // if (content?.length >= 10) {
        //     setDescriptionErrors({
        //         ...descriptionErrors,
        //         builderFullDescription: false,
        //     });
        // }
    };

    const handleFlatRebateChange = (event) => {
        if (event) setFlatRebate(!flatRebate);
    };

    const rebateUnitBoolChange = (event) => {
        setRebateUnit(event.target.value);
    };

    const proofPointChange = (event) => {
        let newArray = [...proofPoints, event.target.value];
        if (proofPoints.includes(event.target.value)) {
            newArray = newArray.filter((value) => value !== event.target.value);
        }
        setProofPoints(newArray);
    };

    const rebateTypeBoolChange = (event) => {
        setRebateType(event.target.value);
    };

    const addressTypeBoolChange = (event) => {
        setAddressType(event.target.value);
    };

    const handleMinimumQuantityChange = (event) => {
        setMinQuantity(event.target.value);
    };

    const handleReportQuantityBoolChange = (event) => {
        setReportQuantity(event.target.value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields({
            ...fields,
            [name]: value,
        });
        if (fields?.[name]?.length > 0) {
            setErrors({
                ...errors,
                [name]: false,
            });
        }
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

    const handleMenuBoolChange = (event) => {
        setCustomizable(event.target.value);
    };

    const handleStateBoolChange = (event) => {
        setCustomizableState(event.target.value);
    };

    const handleParticipateBoolChange = (event) => {
        setParticipate(event.target.value === true || event.target.value === "true" ? true : false);
    };

    const builderAssignment = (e) => {
        setAssignBuilders({
            value: e.value,
            label: e.label,
        });
    };

    const participants = (e) => {
        const values = e.map((item) => {
            let object = {};
            object.value = item.value;
            object.label = item.label;
            return object;
        });
        setProgramParticipants(values);
    };

    const stateshandler = (e) => {
        const values = e.map((item) => {
            let object = {};
            object.value = item?.value;
            object.label = item?.label;

            return object;
        });
        setState(values);
    };

    const categoriesHandler = (e) => {
        const value = e && e.value;
        setCategory(value);
    };

    const activeHandler = (item) => {
        if (item !== active) {
            setActive(item);
            setShow(true);
        } else {
            resetState();
            setShow(!show);
        }
    };

    /* Handle Changes Ends */

    useEffect(() => {
        //This Use-Effect fills the Data
        if (edit === true) {
            let points = [];
            setFields(user);
            setCustomizable(user?.type);
            setParticipate(user?.available_specific_member_only);
            setCustomizableState(user && user?.valid_region_type);
            setReportQuantity(user && user?.all_builder_report_quantity);
            setMinQuantity(user && user?.product_minimum_unit_requirement);
            setRebateUnit(user && user?.bbg_rebate_unit);
            setRebateType(user && user?.global_bbg_rebate_type);
            setAddressType(user && user?.lot_and_address_requirement);
            setProgramId(user && user?.id);
            setRequireQuantityReporting(user && user?.all_builder_report_quantity);
            setModalFields({
                multi_unit_rebate_amount: (user && user?.global_product_multi_unit_rebate_amount) || 0,
                commercial_rebate_amount: (user && user?.global_product_commercial_rebate_amount) || 0,
                residential_rebate_amount: (user && user?.global_product_residential_rebate_amount) || 0,
                minimum_unit: user && user?.global_product_minimum_unit,
            });
            setFlatRebate(user?.is_flat_rebate);
            setFields((previousFields) => ({
                ...previousFields,
                flat_builder_rebate: user?.flat_builder_rebate,
                flat_bbg_rebate: user?.flat_bbg_rebate,
            }));
            if (user) {
                if (user?.require_brand) {
                    points.push("require_brand");
                }
                if (user?.require_certificate_occupancy) {
                    points.push("require_certificate_occupancy");
                }
                if (user?.require_serial_number) {
                    points.push("require_serial_number");
                }
                if (user?.require_model_number) {
                    points.push("require_model_number");
                }
                if (user?.require_date_of_installation) {
                    points.push("require_date_of_installation");
                }
                if (user?.require_date_of_purchase) {
                    points.push("require_date_of_purchase");
                }
                if (user?.require_distributor) {
                    points.push("require_distributor");
                }
            }
            setProofPoints(() => points);
        }
        //eslint-disable-next-line
    }, [user, edit]);

    useEffect(() => {
        //Gets the Products associated with the Program
        if (programId) {
            getProducts({
                variables: {
                    programId: parseInt(programId),
                },
            });
        }
        //eslint-disable-next-line
    }, [programId]);

    useEffect(() => {
        if (edit === false) {
            setFields({
                ...fields,
                name: searchString === "" ? "" : searchString,
            });
        }
        // eslint-disable-next-line
    }, [searchString]);

    useEffect(() => {
        //Cleans up the fields and state on new program click
        if (edit === false && createNew === true) {
            setFields({
                ...fields,
                name: searchString === "" ? "" : searchString,
                id: "",
                global_product_commercial_rebate_amount: "",
                global_product_minimum_unit: "",
                global_product_multi_unit_rebate_amount: "",
                global_product_rebate_amount_type: "",
                global_product_residential_rebate_amount: "",
                organizations: {
                    edges: [],
                },
            });
            setReportQuantity(true);
            setCustomizable("FACTORY");
            setMinQuantity("NO");
            setCustomizableState();
            setRebateUnit("PER_INSTALL_UNIT");
            setRebateType();
            setParticipate(false);
            setProgramParticipants(() => []);
            setAssignBuilders({
                value: "",
                label: "",
            });
            setProofPoints(() => ["require_certificate_occupancy"]);
            setAddressType("ADDRESS_OR_LOT");
            setState(() => []);
        }
        //eslint-disable-next-line
    }, [edit, createNew]);

    useEffect(() => {
        if (fields?.name?.length < 2) {
            setErrors({
                ...errors,
                name: true,
            });
        }
        // eslint-disable-next-line
    }, [fields]);

    useEffect(() => {
        if (endDate?.getTime() < startDate?.getTime()) {
            setErrors({
                ...errors,
                startDate: true,
                endDate: true,
            });
        }
        if (endDate?.getTime() > startDate?.getTime()) {
            setErrors({
                ...errors,
                startDate: false,
                endDate: false,
            });
        }
        // eslint-disable-next-line
    }, [startDate, endDate]);

    useEffect(() => {
        //fills the data inside the column
        if (openAbout === true && show === false) {
            setActive("about");
            setShow(true);
        }

        // eslint-disable-next-line
    }, [fillColumns, openAbout]);

    useEffect(() => {
        if (openConversion === true) {
            setActive("conversions");
            setShow(true);
        }
    }, [openConversion]);

    useEffect(() => {
        if (searchString?.length > 0 && edit === false) {
            setActive("about");
            setShow(true);
        }
        // eslint-disable-next-line
    }, [searchString, edit]);

    useEffect(() => {
        //setting up the company or members - can change over time
        if (edit === true) {
            setAssignBuilders({
                value: fields?.company?.id,
                label: fields?.company?.name,
            });

            let states = fields?.regions?.edges?.map((item) => {
                let object = {};
                object.value = item?.node?.id;
                object.label = item?.node?.name;

                return object;
            });
            setState(states);

            let programParticipants = fields?.participants?.edges?.map((item) => {
                let object = {};
                object.value = item?.node?.id;
                object.label = item?.node?.name;

                return object;
            });

            setProgramParticipants(programParticipants);
        }
    }, [edit, fields]);

    useEffect(() => {
        // sets the start data and end date fields
        if (edit === true && fields && fields?.start_date) {
            setStartDate(toDateAdd(fields && fields.start_date));
        }
        if (edit === true && fields && fields?.end_date) {
            setEndDate(toDateAdd(fields && fields?.end_date));
        } else if (edit === false) {
            setStartDate(new Date());
            setEndDate(new Date());
        }
        //eslint-disable-next-line
    }, [fields?.start_date, fields?.end_date, fields?.id, edit]);

    //Queries and Mutations starts

    const [createProduct] = useMutation(CREATE_PRODUCT, {
        variables: {
            bbg_product_code: modalFields?.bbg_product_code,
            name: modalFields?.product_name,
            description: modalFields?.description,
            product_line: modalFields?.product_line,
            programID: fields?.id,
            category: isNaN(category) ? { name: category } : { id: category },
            minimum_unit: parseInt(modalFields?.minimum_unit),
            require_quantity_reporting: requireQuantityReporting,
            residential_rebate_amount:
                rebateType === "SAME"
                    ? parseFloat(fields?.global_product_residential_rebate_amount)
                    : parseFloat(modalFields?.residential_rebate_amount),
            multi_unit_rebate_amount:
                rebateType === "SAME"
                    ? parseFloat(fields?.global_product_multi_unit_rebate_amount)
                    : parseFloat(modalFields?.multi_unit_rebate_amount),
            commercial_rebate_amount:
                rebateType === "SAME"
                    ? parseFloat(fields?.global_product_commercial_rebate_amount)
                    : parseFloat(modalFields?.commercial_rebate_amount),
            flat_bbg_rebate: modalFields?.flat_bbg_rebate ? parseFloat(modalFields?.flat_bbg_rebate) : null,
            flat_builder_rebate: modalFields?.flat_builder_rebate ? parseFloat(modalFields?.flat_builder_rebate) : null,
            create_pricing_array: [
                {
                    residential_rebate_amount:
                        rebateType === "SAME"
                            ? parseFloat(fields?.global_product_residential_rebate_amount)
                            : parseFloat(modalFields?.residential_rebate_amount),
                    multi_unit_rebate_amount:
                        rebateType === "SAME"
                            ? parseFloat(fields?.global_product_multi_unit_rebate_amount)
                            : parseFloat(modalFields?.multi_unit_rebate_amount),
                    commercial_rebate_amount:
                        rebateType === "SAME"
                            ? parseFloat(fields?.global_product_commercial_rebate_amount)
                            : parseFloat(modalFields?.commercial_rebate_amount),
                    flat_builder_rebate: modalFields?.flat_builder_rebate
                        ? parseFloat(modalFields?.flat_builder_rebate)
                        : null,
                    flat_bbg_rebate: modalFields?.flat_bbg_rebate ? parseFloat(modalFields?.flat_bbg_rebate) : null,
                },
            ],
        },
        update(cache, result) {
            getCategories();
            setProductSearch(false);
            setProductSearchString("");
            getProducts({
                variables: {
                    programId: parseInt(programId),
                },
            });
            toast.success("Product saved!");
            refetch(programId);
        },
    });

    useEffect(() => {
        if (user?.id) {
            getOrganizations();
            getOrganizationsBuilders();
        }
        getStates();
        // eslint-disable-next-line
    }, [user]);

    useEffect(() => {
        if (fillColumns) {
            getCategories();
        }
        // eslint-disable-next-line
    }, [fillColumns]);

    useEffect(() => {
        if (user?.id) {
            getOrganizations();
            getOrganizationsBuilders();
        }
        // eslint-disable-next-line
    }, [impersonator, user]);

    useEffect(() => {
        if (edit === false) {
            getOrganizations();
            getOrganizationsBuilders();
        }
        // eslint-disable-next-line
    }, [edit]);

    useEffect(() => {
        if (fields?.id) {
            getProgramPricingHistory();
        }
        // eslint-disable-next-line
    }, [fields]);

    useEffect(() => {
        if (productIdForHistoryQuery && productIdForHistoryQuery !== null) {
            getProductPricingHistory();
        }
        // eslint-disable-next-line
    }, [productIdForHistoryQuery]);

    const [getStates, { data: states }] = useLazyQuery(FETCH_STATES_QUERY);
    const [getCategories, { data: categories }] = useLazyQuery(FETCH_CATEGORIES_QUERY, {
        fetchPolicy: "no-cache",
    });
    const [getOrganizations, { data: organizations, loading: organizationsLoading }] = useLazyQuery(
        FETCH_ORGANIZATIONS_QUERY,
        {
            variables: {
                organization_type: ["MANUFACTURERS", "SUPPLIERS"],
                first: 200000,
            },
            fetchPolicy: "no-cache",
        }
    );

    const [
        getOrganizationsBuilders,
        { data: organizationsBuilders, loading: organizationsBuilderLoading },
    ] = useLazyQuery(FETCH_ORGANIZATIONS_QUERY, {
        variables: {
            organization_type: ["BUILDERS"],
            first: 200000,
        },
        fetchPolicy: "no-cache",
    });

    const [
        getProgramPricingHistory,
        { data: programPricingHistory, loading: programPricingHistoryLoading },
    ] = useLazyQuery(GET_PROGRAM_PRICING_HISTORY, {
        variables: {
            id: fields?.id,
        },
        fetchPolicy: "no-cache",
    });

    const [
        getProductPricingHistory,
        { data: productPricingHistory, loading: productPricingHistoryLoading },
    ] = useLazyQuery(GET_PRODUCT_PRICING_HISTORY, {
        variables: {
            id: productIdForHistoryQuery,
        },
        onCompleted() {
            setShowPricingModal(true);
        },
        fetchPolicy: "no-cache",
    });

    const [getProducts, { data: products, loading: productsLoading }] = useLazyQuery(FETCH_PRODUCTS_PER_PROGRAM, {
        fetchPolicy: "no-cache",
        notifyOnNetworkStatusChange: false,
    });

    const [updateProduct] = useMutation(UPDATE_PRODUCT, {
        variables: {
            id: modalFields?.id,
            bbg_product_code: modalFields?.bbg_product_code,
            name: modalFields?.product_name,
            //category: ProductCategoryBelongsTo!
            description: modalFields?.description,
            product_line: modalFields?.product_line,
            programID: fields?.id,
            organization_id: organizationId,
            category: isNaN(category) ? { name: category } : { id: category },
            minimum_unit: parseInt(modalFields?.minimum_unit),
            require_quantity_reporting: requireQuantityReporting,
            residential_rebate_amount:
                rebateType === "SAME"
                    ? parseFloat(fields?.global_product_residential_rebate_amount)
                    : parseFloat(modalFields?.residential_rebate_amount),
            multi_unit_rebate_amount:
                rebateType === "SAME"
                    ? parseFloat(fields?.global_product_multi_unit_rebate_amount)
                    : parseFloat(modalFields?.multi_unit_rebate_amount),
            commercial_rebate_amount:
                rebateType === "SAME"
                    ? parseFloat(fields?.global_product_commercial_rebate_amount)
                    : parseFloat(modalFields?.commercial_rebate_amount),
            flat_bbg_rebate: modalFields?.flat_bbg_rebate ? parseFloat(modalFields?.flat_bbg_rebate) : null,
            flat_builder_rebate: modalFields?.flat_builder_rebate ? parseFloat(modalFields?.flat_builder_rebate) : null,
            create_pricing_array: [
                {
                    residential_rebate_amount:
                        rebateType === "SAME"
                            ? parseFloat(fields?.global_product_residential_rebate_amount)
                            : parseFloat(modalFields?.residential_rebate_amount),
                    multi_unit_rebate_amount:
                        rebateType === "SAME"
                            ? parseFloat(fields?.global_product_multi_unit_rebate_amount)
                            : parseFloat(modalFields?.multi_unit_rebate_amount),
                    commercial_rebate_amount:
                        rebateType === "SAME"
                            ? parseFloat(fields?.global_product_commercial_rebate_amount)
                            : parseFloat(modalFields?.commercial_rebate_amount),
                    flat_builder_rebate: modalFields?.flat_builder_rebate
                        ? parseFloat(modalFields?.flat_builder_rebate)
                        : null,
                    flat_bbg_rebate: modalFields?.flat_bbg_rebate ? parseFloat(modalFields?.flat_bbg_rebate) : null,
                },
            ],
        },

        update(cache, result) {
            toast.success("Product saved!");
            getCategories();
            getProducts({
                variables: {
                    programId: parseInt(programId),
                },
            });
            refetch(programId);
        },
    });

    const [createProgram, { loading: createProgramLoading }] = useMutation(CREATE_PROGRAM, {
        variables: {
            name: fields?.name, //program name
            start_date: startDate?.toISOString().substr(0, 10), //start date
            end_date: endDate?.toISOString().substr(0, 10), //end date
            company: parseInt(assignBuilders?.value), // Manufactures/suppliers
            type: customizable, // program type
            participants: programParticipants?.map((item) => {
                let object = {};
                object.id = item?.value;
                return object;
            }), // Participants
            valid_region_type: customizableState, //where is this program valid
            state: state?.map((item) => item?.value), //state/province
            all_builder_report_quantity:
                (reportQuantity === "true" || reportQuantity === true) && customizable === "FACTORY" ? true : false, // All Builders to Report Quantity
            product_minimum_unit_requirement: customizable === "FACTORY" ? minQuantity : "NO", // minimum unit
            available_specific_member_only: participate, //Who can participate
            global_product_minimum_unit: parseInt(
                // if yes-same for all in Minimum units
                fields?.global_product_minimum_unit
            ),
            bbg_rebate_unit: rebateUnit, //bbg rebate unit
            global_bbg_rebate_type: rebateType, // BBG rebate type
            global_product_residential_rebate_amount: parseInt(
                //if type same amount for all
                fields?.global_product_residential_rebate_amount
            ),
            global_product_multi_unit_rebate_amount: parseInt(
                //if type same amount for all
                fields?.global_product_multi_unit_rebate_amount
            ),
            global_product_commercial_rebate_amount: parseInt(
                //if type same amount for all
                fields?.global_product_commercial_rebate_amount
            ),
            lot_and_address_requirement: addressType, //lot and address requirements
            require_distributor: proofPoints.includes("require_distributor"),
            require_certificate_occupancy: proofPoints.includes("require_certificate_occupancy"), //proof points
            require_brand: proofPoints.includes("require_brand"), //proof points
            require_serial_number: proofPoints.includes("require_serial_number"), //proof points
            require_model_number: proofPoints.includes("require_model_number"), //proof points
            require_date_of_installation: proofPoints.includes("require_date_of_installation"), //proof points
            require_date_of_purchase: proofPoints.includes("require_date_of_purchase"), //proof points

            // internal_description: "",
            // builder_description: "",
            // builder_description_short: "",
            // learn_more_url: "",

            global_product_rebate_amount_type: "AMOUNT", //no idea what is this

            is_flat_rebate: flatRebate,
            flat_builder_rebate: fields?.flat_builder_rebate,
            flat_bbg_rebate: fields?.flat_bbg_rebate,
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: FETCH_PROGRAMS_QUERY,
            });

            delete Object.assign(result.data, {
                node: result.data["createProgram"],
            })["createProgram"];

            cache.writeQuery({
                query: FETCH_PROGRAMS_QUERY,
                data: {
                    programs: {
                        edges: [result.data, ...data.programs.edges],
                    },
                },
            });
            callBack(result?.data?.node);
            setActive("description");
            toast.success(fields?.name + " saved!");
        },
    });

    const modifiers = {
        selected: startDate,
    };
    const modifiersStyles = {
        selected: {
            color: "white",
            backgroundColor: "#003166",
        },
    };

    const [deleteProgram, { loading: deleteProgramLoading }] = useMutation(DELETE_PROGRAM, {
        variables: {
            id: fields?.id,
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: FETCH_PROGRAMS_QUERY,
            });

            delete Object.assign(result.data, {
                node: result.data["deleteProgram"],
            })["deleteProgram"];

            cache.writeQuery({
                query: FETCH_PROGRAMS_QUERY,
                data: {
                    programs: {
                        edges: [...data.programs.edges.filter((u) => u.node.id !== result.data.node.id)],
                    },
                },
            });
            afterDelete();
        },
    });

    const [updateProgram, { loading: updateProgramLoading }] = useMutation(UPDATE_PROGRAM, {
        variables: {
            id: fields?.id,
            name: fields?.name, //program name
            start_date: startDate?.toISOString().substr(0, 10), //start date
            end_date: endDate?.toISOString().substr(0, 10), //end date
            company: parseInt(assignBuilders?.value), // ManuFactures/Suppliers
            type: customizable, // program type

            participants: programParticipants?.map((item) => {
                let object = {};
                object.id = item?.value;
                return object;
            }), // Participants
            available_specific_member_only: participate, //Who can participate

            valid_region_type: customizableState, //where is this program valid
            state: state?.map((item) => item?.value), //state
            all_builder_report_quantity:
                (reportQuantity === "true" || reportQuantity === true) && customizable === "FACTORY" ? true : false, // All Builders to Report Quantity
            product_minimum_unit_requirement: customizable === "FACTORY" ? minQuantity : "NO", // minimum unit

            global_product_minimum_unit: parseInt(
                // if yes-same for all in Minimum units
                fields?.global_product_minimum_unit
            ),
            bbg_rebate_unit: rebateUnit, //bbg rebate unit
            global_bbg_rebate_type: rebateType, // BBG rebate type
            global_product_residential_rebate_amount: parseInt(
                //if type same amount for all
                fields?.global_product_residential_rebate_amount
            ),
            global_product_multi_unit_rebate_amount: parseInt(
                //if type same amount for all
                fields?.global_product_multi_unit_rebate_amount
            ),
            global_product_commercial_rebate_amount: parseInt(
                //if type same amount for all
                fields?.global_product_commercial_rebate_amount
            ),
            lot_and_address_requirement: addressType, //lot and address requirements
            require_distributor: proofPoints.includes("require_distributor"),
            require_certificate_occupancy: proofPoints.includes("require_certificate_occupancy"), //proof points
            require_brand: proofPoints.includes("require_brand"), //proof points
            require_serial_number: proofPoints.includes("require_serial_number"), //proof points
            require_model_number: proofPoints.includes("require_model_number"), //proof points
            require_date_of_installation: proofPoints.includes("require_date_of_installation"), //proof points
            require_date_of_purchase: proofPoints.includes("require_date_of_purchase"), //proof points
            internal_description: internalDescription,
            builder_description: builderFullDescription,
            builder_description_short: builderShortDescription,
            learn_more_url: fields?.learn_more_url,

            global_product_rebate_amount_type: "AMOUNT", //no idea what is this

            is_flat_rebate: flatRebate,
            flat_builder_rebate: parseFloat(fields?.flat_builder_rebate),
            flat_bbg_rebate: parseFloat(fields?.flat_bbg_rebate),
            create_pricing_array: [
                {
                    residential_rebate_amount: parseInt(fields?.global_product_residential_rebate_amount),
                    multi_unit_rebate_amount: parseInt(fields?.global_product_multi_unit_rebate_amount),
                    commercial_rebate_amount: parseInt(fields?.global_product_commercial_rebate_amount),
                    flat_builder_rebate: parseFloat(fields?.flat_builder_rebate),
                    flat_bbg_rebate: parseFloat(fields?.flat_bbg_rebate),
                },
            ],
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: FETCH_PROGRAMS_QUERY,
            });

            delete Object.assign(result.data, {
                node: result.data["updateProgram"],
            })["updateProgram"];

            cache.writeQuery({
                query: FETCH_PROGRAMS_QUERY,

                data: {
                    programs: {
                        edges: [result.data, ...data.programs.edges.filter((u) => u.node.id !== result.data.node.id)],
                    },
                },
            });
            callBack(result?.data?.node);
            getProducts({
                variables: {
                    programId: parseInt(programId),
                },
            });
            toast.success(fields?.name + " saved!");
        },
    });

    //Queries and Mutations Ends

    /* Modal Relation Functions Starts */

    const IconJSX = () => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-brickGreen"
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
                    {productIdForHistoryQuery
                        ? productPricingHistory?.product?.pricings?.edges?.map((pricing) => {
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
                                        {pricing?.node?.flat_bbg_rebate || pricing?.node?.flat_bbg_rebate === 0 ? (
                                            pricing?.node?.flat_bbg_rebate
                                        ) : (
                                            <p className="text-left text-placeHolder">Not set</p>
                                        )}
                                    </td>
                                    <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                        {pricing?.node?.flat_builder_rebate ||
                                            pricing?.node?.flat_builder_rebate === 0 ? (
                                            pricing?.node?.flat_builder_rebate
                                        ) : (
                                            <p className="text-left text-placeHolder">Not set</p>
                                        )}
                                    </td>
                                    <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                        {pricing?.node?.volume_bbg_rebate ||
                                            pricing?.node?.volume_bbg_rebate === 0 ? (
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
                        })
                        : programPricingHistory?.program?.pricings?.edges?.map((pricing) => {
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
                                        {pricing?.node?.flat_bbg_rebate || pricing?.node?.flat_bbg_rebate === 0 ? (
                                            pricing?.node?.flat_bbg_rebate
                                        ) : (
                                            <p className="text-left text-placeHolder">Not set</p>
                                        )}
                                    </td>
                                    <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                        {pricing?.node?.flat_builder_rebate ||
                                            pricing?.node?.flat_builder_rebate === 0 ? (
                                            pricing?.node?.flat_builder_rebate
                                        ) : (
                                            <p className="text-left text-placeHolder">Not set</p>
                                        )}
                                    </td>
                                    <td class="border-t text-left text-secondary border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                        {pricing?.node?.volume_bbg_rebate ||
                                            pricing?.node?.volume_bbg_rebate === 0 ? (
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

    const newProductContent = () => {
        const sortCategories = (categories) => {
            let sorted = categories?.edges?.sort((a, b) => a.node.name.localeCompare(b.node.name));
            return sorted;
        };

        return (
            <div className="grid grid-cols-1 w-full space-y-5">
                <TextField
                    parentClass="justify-items-start col-span-2 grid grid-cols-2 md:grid-cols-3 items-center px-4  "
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
                            edit={edit}
                            creatable
                            options={{
                                edges: sortCategories(categories?.productCategories),
                            }}
                            className=" w-full"
                            placeHolder="Category"
                            menuPlacement={"auto"}
                            onChange={(e) => {
                                categoriesHandler(e);
                                setModalFields({
                                    ...modalFields,
                                    category: {
                                        id: e && e.value,
                                        name: e && e.label,
                                    },
                                });
                                setNullReactSelect(false);
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
                    modal
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
                {user?.type === "FACTORY" && user?.product_minimum_unit_requirement !== "NO" ? (
                    <TextField
                        parentClass="justify-items-start col-span-2 grid grid-cols-2 md:grid-cols-3 items-center px-4 "
                        id="minimum_unit"
                        label="Product Minimum"
                        name="minimum_unit"
                        errorBelow
                        disabled={user?.product_minimum_unit_requirement === "SAME_FOR_ALL"}
                        value={modalFields?.minimum_unit}
                        placeholder="Minimum Unit"
                        type="number"
                        onChange={handleModalChange}
                        required={user?.product_minimum_unit_requirement === "CUSTOM"}
                        error={modalFieldsError?.minimum_unit}
                        errorMessage={"Minimum units are required"}
                    />
                ) : null}
                {user?.type === "FACTORY" ? (
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
                {user?.type === "FACTORY" && !user?.is_flat_rebate ? (
                    <div className="grid grid-cols-3 col-span-2  items-start ">
                        <div className="block text-secondary font-sm font-medium pl-4 ">
                            {APP_TITLE} Rebate Amount by Property Type:
                        </div>
                        <div className="col-span-2 flex px-4  gap-2 md:gap-3">
                            <TextField
                                parentClass=""
                                id="residential_rebate_amount"
                                label="Residential"
                                errorBelow
                                disabled={user?.global_bbg_rebate_type === "SAME"}
                                onChange={handleModalChange}
                                value={modalFields?.residential_rebate_amount}
                                name="residential_rebate_amount"
                                placeholder="10"
                                isDollar
                                type="text"
                                error={modalFieldsError?.residential_rebate_amount}
                                errorMessage={"Enter valid Amount"}
                            />
                            <TextField
                                parentClass=""
                                id="multi_unit_rebate_amount"
                                label="Multi-Unit"
                                isDollar
                                errorBelow
                                disabled={user?.global_bbg_rebate_type === "SAME"}
                                onChange={handleModalChange}
                                value={modalFields?.multi_unit_rebate_amount}
                                name="multi_unit_rebate_amount"
                                placeholder="25"
                                type="text"
                                error={modalFieldsError?.multi_unit_rebate_amount}
                                errorMessage={"Enter valid Amount"}
                            />
                            <TextField
                                parentClass=""
                                id="commercial_rebate_amount"
                                label="Commercial"
                                errorBelow
                                disabled={user?.global_bbg_rebate_type === "SAME"}
                                onChange={handleModalChange}
                                value={modalFields?.commercial_rebate_amount}
                                name="commercial_rebate_amount"
                                placeholder="50"
                                isDollar
                                type="text"
                                error={modalFieldsError?.commercial_rebate_amount}
                                errorMessage={"Enter valid Amount"}
                            />
                        </div>
                    </div>
                ) : null}
                {user?.type === "FACTORY" && user?.is_flat_rebate && user?.global_bbg_rebate_type !== "SAME" ? (
                    <div className="grid grid-cols-3 col-span-2  items-start">
                        <div className="block text-secondary font-sm font-medium pl-4 ">Flat Rebate</div>
                        <div className="col-span-2 flex px-4  gap-2 md:gap-3 ">
                            <TextField
                                parentClass=""
                                id="flat_builder_rebate"
                                label="Builder"
                                onChange={handleModalChange}
                                width="w-24"
                                value={modalFields?.flat_builder_rebate}
                                isDollar
                                name="flat_builder_rebate"
                                placeholder="10"
                                type="text"
                                error={modalFieldsError?.flat_builder_rebate}
                                errorMessage={"Enter valid Amount"}
                            />
                            <TextField
                                width="w-24"
                                id="flat_bbg_rebate"
                                label={APP_TITLE}
                                onChange={handleModalChange}
                                value={modalFields?.flat_bbg_rebate}
                                isDollar
                                name="flat_bbg_rebate"
                                placeholder="25"
                                type="text"
                                error={modalFieldsError?.flat_bbg_rebate}
                                errorMessage={"Enter valid Amount"}
                            />
                        </div>
                    </div>
                ) : null}

                {user?.type === "FACTORY" && user?.is_flat_rebate && user?.global_bbg_rebate_type === "SAME" ? (
                    <div className="grid grid-cols-3 col-span-2  items-start">
                        <div className="block text-secondary font-sm font-medium pl-4 ">Flat Rebate</div>
                        <div className="col-span-2 flex px-4  gap-2 md:gap-3 ">
                            <TextField
                                parentClass=""
                                id="flat_builder_rebate"
                                label="Builder"
                                onChange={handleModalChange}
                                width="w-24"
                                value={fields?.flat_builder_rebate}
                                isDollar
                                name="flat_builder_rebate"
                                placeholder="10"
                                type="text"
                                disabled={true}
                            />
                            <TextField
                                width="w-24"
                                id="flat_bbg_rebate"
                                label={APP_TITLE}
                                onChange={handleModalChange}
                                value={fields?.flat_bbg_rebate}
                                isDollar
                                name="flat_bbg_rebate"
                                placeholder="25"
                                type="text"
                                disabled={true}
                            />
                        </div>
                    </div>
                ) : null}
            </div>
        );
    };

    const addProductToProgram = (id, type) => {
        setAddOrRemoveProductId(id);
        setProgramActionType(type);
        setProductSearch(false);
    };

    useEffect(() => {
        if (addOrRemoveProductId !== "" && programActionType === "add") {
            updateAddProductProgram();
        } else if (addOrRemoveProductId !== "" && programActionType === "remove") {
            updateRemoveProductProgram();
        }
        // eslint-disable-next-line
    }, [addOrRemoveProductId, programActionType]);

    const [updateAddProductProgram] = useMutation(UPDATE_PROGRAM, {
        variables: {
            id: fields?.id,
            productsRebate: [
                {
                    id: addOrRemoveProductId,
                },
            ],
        },
        update(cache, result) {
            setProgramId(result?.data?.updateProgram?.id);
            getProducts({
                variables: {
                    programId: parseInt(programId),
                },
            });
            setAddOrRemoveProductId("");
            setProductSearchString("");
            setProductSearch(false);
            setProgramActionType("");
            refetch(result?.data?.updateProgram?.id);
            toast.success("Product saved!");
        },
    });

    const [updateRemoveProductProgram] = useMutation(UPDATE_PROGRAM, {
        variables: {
            id: fields?.id,
            removeProduct: [addOrRemoveProductId],
        },
        update(cache, result) {
            setProgramId(result?.data?.updateProgram?.id);
            getProducts({
                variables: {
                    programId: parseInt(programId),
                },
            });
            setProductSearchString("");
            setAddOrRemoveProductId("");
            setProductSearch(false);
            refetch(result?.data?.updateProgram?.id);
            setProgramActionType("");
            toast.success("Product removed!");
        },
    });

    const handleExtraAction = () => {
        if (productEdit === true) {
            updateProduct();
            cleanAfterHittingCreate();
            setProductEdit(false);
        } else {
            createProduct();
            cleanAfterHittingCreate();
            setProductEdit(false);
        }
    };
    const handleModalSubmit = () => {
        if (productEdit) {
            updateProduct();
            setShowModal(false);
        } else {
            createProduct();
            setShowModal(false);
        }
    };

    const modal = () => {
        return (
            <>
                <Modal
                    width={"2xl"}
                    title={`Add a Product: ${fields?.name}`}
                    Content={modalContent ? newProductContent() : newProductContent()}
                    disabled={finalError?.product}
                    submitLabel="Save"
                    onClose={() => {
                        setShowModal(false);
                        setModalContent(false);
                        setProductSearchString("");
                    }}
                    extraLabel={"Save & Add"}
                    extraActionButton
                    extraAction={handleExtraAction}
                    extraLabelColor={"primary"}
                    IconJSX={<IconJSX />}
                    show={showModal}
                    onSubmit={handleModalSubmit}
                />
            </>
        );
    };

    const pricingModal = () => {
        return (
            <>
                <Modal
                    width={"full"}
                    title={`Pricing History`}
                    Content={pricingContent()}
                    submitLabel="Close"
                    onSubmit={() => {
                        setShowPricingModal(false);
                        setProductIdForHistoryQuery(null);
                    }}
                    onClose={() => {
                        setShowPricingModal(false);
                        setProductIdForHistoryQuery(null);
                    }}
                    show={showPricingModal}
                />
            </>
        );
    };
    /* Modal Relation Functions Ends */
    /* Product Table Data Starts */

    const debouncedValue = useDebounce(productSearchString, 160);

    useEffect(() => {
        if (productSearchString.trim().length > 1 && productSearch === true) {
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
        onCompleted: () => { },
    });

    useEffect(() => {
        let error = errors?.name || errors?.startDate || errors?.endDate;
        let participantsError = participate === "custom" && programParticipants?.length === 0;
        let manufacturerError =
            assignBuilders === undefined || assignBuilders?.value === undefined || assignBuilders?.value === "";
        let programValidityError = customizableState === undefined;
        let programStateValidityError = customizableState === "CUSTOM" && state?.length <= 0;

        let finalAboutError =
            error || participantsError || manufacturerError || programValidityError || programStateValidityError;
        setFinalError({
            ...finalError,
            about: finalAboutError,
        });
        // eslint-disable-next-line
    }, [errors, participate, programParticipants, assignBuilders, customizableState, state]);

    useEffect(() => {
        let errors = {};
        if (modalFields?.product_name?.length < 2) {
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
            customizable === "FACTORY"
        ) {
            errors.residential_rebate_amount = true;
        }
        if (
            (modalFields?.commercial_rebate_amount?.length < 1 ||
                modalFields?.commercial_rebate_amount === undefined ||
                modalFields?.commercial_rebate_amount === null) &&
            customizable === "FACTORY"
        ) {
            errors.commercial_rebate_amount = true;
        }
        if (
            (modalFields?.multi_unit_rebate_amount?.length < 1 ||
                modalFields?.multi_unit_rebate_amount === undefined ||
                modalFields?.multi_unit_rebate_amount === null) &&
            customizable === "FACTORY"
        ) {
            errors.multi_unit_rebate_amount = true;
        }
        if (
            (modalFields?.flat_builder_rebate?.length < 1 ||
                modalFields?.flat_builder_rebate === undefined ||
                modalFields?.flat_builder_rebate === null) &&
            customizable === "FACTORY"
        ) {
            errors.flat_builder_rebate = true;
        }
        if (
            (modalFields?.flat_bbg_rebate?.length < 1 ||
                modalFields?.flat_bbg_rebate === undefined ||
                modalFields?.flat_bbg_rebate === null) &&
            customizable === "FACTORY"
        ) {
            errors.flat_bbg_rebate = true;
        }
        if (modalFields?.minimum_unit <= 0 && minQuantity === "CUSTOM") {
            errors.minimum_unit = true;
        }
        if (modalFields?.minimum_unit <= 0 && minQuantity === "CUSTOM") {
            errors.minimum_unit = true;
        }
        if (modalFields?.category?.id === undefined || modalFields?.category?.id === null) {
            errors.category = true;
        }
        setModalFieldsError(errors);
        // eslint-disable-next-line
    }, [modalFields]);

    useEffect(() => {
        let finalError =
            modalFieldsError?.product_name ||
            modalFieldsError?.bbg_product_code ||
            modalFieldsError?.description ||
            modalFieldsError?.residential_rebate_amount ||
            modalFieldsError?.commercial_rebate_amount ||
            modalFieldsError?.multi_unit_rebate_amount ||
            modalFieldsError?.minimum_unit ||
            modalFieldsError?.category;

        setFinalError({
            ...finalError,
            product: finalError,
        });
    }, [modalFieldsError]);

    const handleAboutError = () => {
        if (!finalError?.about) {
            if (edit === true) {
                updateProgram();
            } else {
                createProgram();
            }
        }
    };

    const cleanAfterHittingCreate = () => {
        setRequireQuantityReporting(fields?.all_builder_report_quantity);
        setCategory();
        setModalFields({
            product_name: "",
            minimum_unit: fields?.global_product_minimum_unit,
            residential_rebate_amount: fields?.global_product_residential_rebate_amount || 0,
            multi_unit_rebate_amount: fields?.global_product_multi_unit_rebate_amount || 0,
            commercial_rebate_amount: fields?.global_product_commercial_rebate_amount || 0,
        });
    };

    const tableData = (title) => {
        return (
            <div className="flex  flex-col  scrollbar-track-gray-400 mt-5 border rounded-lg overflow-hidden">
                <div className="flex flex-col">
                    <div className=" overflow-x-auto">
                        <div className="align-middle inline-block min-w-full 2xl:max-h-96 overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                            <div className="shadow  border-b border-gray-200 sm:rounded-lg grid grid-cols-3">
                                <div className="flex flex-col w-full  py-3 relative px-2">
                                    <div className="flex items-center">
                                        <div className=" px-3 -mt-1">
                                            <TextField
                                                placeholder="Find or Add"
                                                type="text"
                                                width="w-full"
                                                value={productSearchString}
                                                name={"productSearch"}
                                                onChange={(e) => {
                                                    setProductSearchString(e.target.value);
                                                    if (productSearchString.trim().length > 1) {
                                                        setProductSearch(true);
                                                    }
                                                }}
                                            />
                                        </div>
                                        {productSearch ? (
                                            <button
                                                type="button"
                                                className="text-lg py-3 mr-3 border-transparent   font-medium rounded-md text-secondary focus:outline-none"
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setProductEdit(false);
                                                    cleanAfterHittingCreate();
                                                }}
                                            >
                                                <svg
                                                    className="w-8 h-8"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </button>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="px-2 w-full py-3 text-left text-xs font-medium text-secondary self-center">
                                    Minimum
                                </div>
                                <div className="px-2 w-full py-3 text-left text-xs font-medium text-secondary  self-center">
                                    {APP_TITLE} Rebate
                                </div>

                                {productSearch && productSearchString?.trim().length > 0 ? (
                                    <div className=" col-span-1 ml-2 max-h-44 px-3 mb-3 overflow-auto  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400  bg-white">
                                        {searchedLoading ? (
                                            <div className="border rounded-lg">
                                                <Loader />
                                            </div>
                                        ) : (
                                            <div
                                                className={`${searchedProducts?.searchProducts?.edges?.length > 0
                                                    ? "border rounded-lg"
                                                    : ""
                                                    }`}
                                            >
                                                {searchedProducts?.searchProducts?.edges?.length > 0 ? (
                                                    searchedProducts?.searchProducts?.edges.map((item) => {
                                                        return (
                                                            <div
                                                                className="flex items-center w-full py-4 border-b cursor-pointer"
                                                                onClick={() =>
                                                                    addProductToProgram(item?.node?.id, "add")
                                                                }
                                                            >
                                                                <div className="min-w-0 flex-1 flex">
                                                                    <div className=" flex-1 px-2 flex justify-between md:gap-4 items-center">
                                                                        <div className="flex flex-col items-start">
                                                                            <div className="flex flex-col text-xs text-gray-500 italic">
                                                                                {item.node.category &&
                                                                                    item.node.category.name}
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
                                                                                        {item.node.bbg_product_code
                                                                                            ? item.node
                                                                                                .bbg_product_code +
                                                                                            " - "
                                                                                            : ""}
                                                                                        {item.node.name}
                                                                                    </Link>
                                                                                </p>
                                                                            </div>
                                                                            <div className=" flex flex-col text-xs text-gray-500">
                                                                                {item.node &&
                                                                                    item.node.programs &&
                                                                                    item.node.programs.edges.length >
                                                                                    0 &&
                                                                                    item.node.programs.edges.map(
                                                                                        (program) => {
                                                                                            return (
                                                                                                <div className="flex flex-col">
                                                                                                    <span className="">
                                                                                                        {
                                                                                                            program.node
                                                                                                                .name
                                                                                                        }
                                                                                                    </span>
                                                                                                </div>
                                                                                            );
                                                                                        }
                                                                                    )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-secondary">
                                                                            {products?.productsPerProgram?.edges?.findIndex(
                                                                                (element) =>
                                                                                    element?.node?.id === item?.node?.id
                                                                            ) === -1 ? (
                                                                                <PlusCircleIcon className="w-8 h-8 text-brickGreen cursor-pointer" />
                                                                            ) : (
                                                                                "Added"
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="border rounded-lg py-2 px-2 text-secondary font-title font-semibold flex items-center justify-between">
                                                        <p> No Results Found </p>
                                                        <span
                                                            className="underline cursor-pointer text-brickRed"
                                                            onClick={() => setProductSearchString("")}
                                                        >
                                                            {" "}
                                                            Reset{" "}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : null}

                                {products &&
                                    products?.productsPerProgram &&
                                    products?.productsPerProgram?.edges &&
                                    products?.productsPerProgram?.edges?.length > 0 &&
                                    products?.productsPerProgram?.edges?.map((item, key) => (
                                        <div
                                            key={item.node.id}
                                            className={
                                                "bg-white hover:bg-gray-100 col-span-3 grid grid-cols-3 relative items-center border-t"
                                            }
                                            onClick={() => {
                                                setModalFields({
                                                    ...item.node,
                                                    product_name: item?.node?.name,
                                                    residential_rebate_amount: item?.node?.residential_rebate_amount
                                                        ? item?.node?.residential_rebate_amount
                                                        : fields?.global_product_residential_rebate_amount || 0,
                                                    multi_unit_rebate_amount: item?.node?.multi_unit_rebate_amount
                                                        ? item?.node?.multi_unit_rebate_amount
                                                        : fields?.global_product_multi_unit_rebate_amount || 0,
                                                    commercial_rebate_amount: item?.node?.commercial_rebate_amount
                                                        ? item?.node?.commercial_rebate_amount
                                                        : fields?.global_product_commercial_rebate_amount || 0,
                                                    minimum_unit: item?.node?.minimum_unit,
                                                    flat_builder_rebate: item?.node?.flat_builder_rebate,
                                                    flat_bbg_rebate: item?.node?.flat_bbg_rebate,
                                                });
                                                setProductEdit(true);
                                                setCategory(item?.node?.category?.id);
                                                setRequireQuantityReporting(item?.node?.require_quantity_reporting);
                                                setModalContent(true);
                                                setShowModal(true);
                                            }}
                                        >
                                            <div className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <div className="flex items-center ">
                                                    <div className="min-w-0 flex-1 flex">
                                                        <div className="min-w-0 flex-1 px-2 md:grid md:grid-cols-2 md:gap-4 items-center">
                                                            <div className="flex flex-col items-start">
                                                                <div className="flex flex-col text-xs text-gray-500 italic">
                                                                    {item.node.category && item.node.category.name}
                                                                </div>
                                                                <div className="group relative   flex justify-between items-center">
                                                                    <p className="text-sm font-semibold text-gray-500">
                                                                        <Link to="#" className="  focus:outline-none">
                                                                            <span
                                                                                className="absolute inset-0"
                                                                                aria-hidden="true"
                                                                            ></span>
                                                                            {item?.node?.bbg_product_code
                                                                                ? item?.node?.bbg_product_code + " - "
                                                                                : ""}
                                                                            {item.node.name}
                                                                        </Link>
                                                                    </p>
                                                                </div>
                                                                <div className=" flex flex-col text-xs text-gray-500">
                                                                    {item.node &&
                                                                        item.node.programs &&
                                                                        item.node.programs.edges.length > 0 &&
                                                                        item.node.programs.edges.map((program) => {
                                                                            return (
                                                                                <div className="flex flex-col">
                                                                                    <span className="">
                                                                                        {program.node.name}
                                                                                    </span>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item?.node?.minimum_unit > 0
                                                    ? item?.node?.minimum_unit?.toLocaleString()
                                                    : "-"}
                                            </div>
                                            {user?.is_flat_rebate && user?.global_bbg_rebate_type !== "SAME" ? (
                                                <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item?.node?.flat_bbg_rebate > 0 ? (
                                                        <p>{`Flat ${APP_TITLE} Rebate: $${item?.node?.flat_bbg_rebate?.toLocaleString()}`}</p>
                                                    ) : fields?.global_product_multi_unit_rebate_amount ? (
                                                        <p>{`Flat ${APP_TITLE} Rebate: $${fields?.flat_bbg_rebate?.toLocaleString()}`}</p>
                                                    ) : null}

                                                    {item?.node?.flat_builder_rebate > 0 ? (
                                                        <p>{`Flat Builder Rebate: $${item?.node?.flat_builder_rebate?.toLocaleString()}`}</p>
                                                    ) : fields?.global_product_multi_unit_rebate_amount ? (
                                                        <p>{`Flat Builder Rebate: $${fields?.flat_builder_rebate?.toLocaleString()}`}</p>
                                                    ) : null}
                                                </div>
                                            ) : !user?.is_flat_rebate && user?.global_bbg_rebate_type !== "SAME" ? (
                                                <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item?.node?.residential_rebate_amount > 0 ? (
                                                        <p>{`Residential: ${formatterForCurrency.format(
                                                            item?.node?.residential_rebate_amount
                                                        )}`}</p>
                                                    ) : fields?.global_product_multi_unit_rebate_amount ? (
                                                        <p>{`Residential: ${formatterForCurrency.format(
                                                            fields?.global_product_residential_rebate_amount
                                                        )}`}</p>
                                                    ) : null}

                                                    {item?.node?.commercial_rebate_amount > 0 ? (
                                                        <p>{`Commercial: ${formatterForCurrency.format(
                                                            item?.node?.commercial_rebate_amount
                                                        )}`}</p>
                                                    ) : fields?.global_product_multi_unit_rebate_amount ? (
                                                        <p>{`Commercial: ${formatterForCurrency.format(
                                                            fields?.global_product_commercial_rebate_amount
                                                        )}`}</p>
                                                    ) : null}
                                                    {item?.node?.multi_unit_rebate_amount > 0 ? (
                                                        <p>{`Multi-Unit: ${formatterForCurrency.format(
                                                            item?.node?.multi_unit_rebate_amount
                                                        )}`}</p>
                                                    ) : fields?.global_product_multi_unit_rebate_amount ? (
                                                        <p>{`Multi-Unit: ${formatterForCurrency.format(
                                                            fields?.global_product_multi_unit_rebate_amount
                                                        )}`}</p>
                                                    ) : null}
                                                </div>
                                            ) : null}
                                            <div className="flex flex-row items-center absolute right-2">
                                                <Button
                                                    color="secondary"
                                                    title={
                                                        productPricingHistoryLoading
                                                            ? "Loading History"
                                                            : "Pricing History"
                                                    }
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setProductIdForHistoryQuery(item.node.id);
                                                    }}
                                                />
                                                <XCircleIcon
                                                    className="w-8 h-8 text-brickRed cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addProductToProgram(item?.node?.id, "remove");
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /* Product Table Data Ends */

    /* React Date Starts */

    const toDateAdd = (date) => {
        const date1 = new Date(date);
        let a = date1.getTimezoneOffset() * 60000;
        let b = new Date(date1.getTime() + a);
        return b;
    };

    /* React Date Ends */

    /* 4 Accordian Steps Starts */
    const accordians = () => {
        return fillColumns ? (
            <div className="flex flex-col">
                {programPricingHistory ? pricingModal() : null}

                <Disclosure as="div">
                    <Disclosure.Button
                        className={`bg-white w-full  focus:outline-none ${active === "about" && show ? "rounded-lg rounded-b-none" : "rounded-lg"
                            }`}
                    >
                        <div
                            style={{ maxHeight: "68px" }}
                            className={`flex flex-col md:flex-row py-4 px-4 justify-between items-center ${active === "about" && show ? "border-b-2 border-gray-400" : ""
                                }`}
                            onClick={() => activeHandler("about")}
                        >
                            <div className=" font-title  text-center h2">
                                {fields && fields.name ? "About: " + fields.name : "About"}
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
                            <div className="grid bg-white  rounded-lg rounded-t-none grid-cols-6 overflow-hidden">
                                {loading ? (
                                    <div className="col-span-6 flex items-center justify-center">
                                        <Loader />
                                    </div>
                                ) : (
                                    <div className="col-span-6 inset-0 flex flex-col">
                                        <div className="flex  w-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                                            <div className="w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                <div className="grid grid-cols-6 col-span-6 2xl:col-span-4">
                                                    <TextField
                                                        required
                                                        parentClass="col-span-6 sm:col-span-6 grid grid-cols-4 px-4 items-center border-b py-3"
                                                        id="name"
                                                        label="Program Name"
                                                        onChange={handleChange}
                                                        value={fields?.name}
                                                        name="name"
                                                        placeholder="Program Name"
                                                        type="text"
                                                        disabled={archieved}
                                                        error={errors?.name}
                                                        errorMessage={"Valid Program name is required"}
                                                    />
                                                    <div className="border-b col-span-6 px-4   sm:grid sm:grid-cols-4 items-start justify-between py-3 sm:items-center w-full">
                                                        <div className="sm:grid sm:grid-cols-2 col-span-2 items-center">
                                                            <label className="block text-md font-medium text-secondary">
                                                                Manufacturers / Suppliers
                                                                <span className="text-brickRed">*</span>
                                                            </label>
                                                            <CommonSelect
                                                                error={
                                                                    assignBuilders?.value === undefined ||
                                                                    assignBuilders?.value === ""
                                                                }
                                                                value={
                                                                    assignBuilders?.value
                                                                        ? {
                                                                            label: assignBuilders?.label,
                                                                            value: assignBuilders?.value,
                                                                        }
                                                                        : null
                                                                }
                                                                options={organizations?.organizations?.edges
                                                                    ?.map(
                                                                        (
                                                                            item
                                                                            // eslint-disable-next-line
                                                                        ) => {
                                                                            if (
                                                                                item.node.organization_type ===
                                                                                "MANUFACTURERS" ||
                                                                                item.node.organization_type ===
                                                                                "SUPPLIERS"
                                                                            ) {
                                                                                return item;
                                                                            }
                                                                        }
                                                                    )
                                                                    .filter((element) => element !== undefined)}
                                                                optionsToRemove={assignBuilders}
                                                                from="createProgram"
                                                                className="col-span-1 lg:w-full"
                                                                clean={nullReactSelect}
                                                                placeHolder="Manufacturers / Suppliers"
                                                                menuPlacement={"bottom"}
                                                                noOptionsMessage={
                                                                    organizationsLoading
                                                                        ? "Loading..."
                                                                        : "No Manufacturers/Suppliers found"
                                                                }
                                                                onChange={(e) => {
                                                                    builderAssignment(e);
                                                                    setNullReactSelect(false);
                                                                }}
                                                            />
                                                        </div>
                                                        {assignBuilders?.value ? null : (
                                                            <p className="self-end pl-2 text-sm text-brickRed font-medium">
                                                                {" "}
                                                                Select a Manufacturer/Supplier{" "}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="border-b col-span-6 px-4   sm:grid sm:grid-cols-4 items-start justify-between py-3 sm:items-center w-full">
                                                        <div className="sm:grid sm:grid-cols-4 col-span-4 items-center">
                                                            <label className="block text-md font-medium text-secondary self-start mt-2">
                                                                Start Date - End Date
                                                                <span className="text-brickRed">*</span>
                                                            </label>
                                                            <div className="flex space-x-2 items-center">
                                                                <div className="flex flex-col">
                                                                    <DayPickerInput
                                                                        value={startDate}
                                                                        inputProps={{
                                                                            style: {
                                                                                border: errors?.startDate
                                                                                    ? "1px solid #b13626"
                                                                                    : "1px solid rgba(212, 212, 216,1)",
                                                                                borderRadius: "0.375rem",
                                                                                padding: "0.5rem 0.75rem",
                                                                                width: "130px",
                                                                                fontSize: ".875rem",
                                                                                cursor: "pointer",
                                                                            },
                                                                        }}
                                                                        dayPickerProps={{
                                                                            modifiers: modifiers,
                                                                            modifiersStyles: modifiersStyles,
                                                                        }}
                                                                        onDayChange={(date) => {
                                                                            setStartDate(date);
                                                                            setErrors({
                                                                                ...errors,
                                                                                endDate: false,
                                                                                startDate: false,
                                                                            });
                                                                        }}
                                                                    />
                                                                    {errors?.startDate ? (
                                                                        <p className="self-end pl-2 text-sm text-brickRed font-medium">
                                                                            Start Date can not be after End Date
                                                                        </p>
                                                                    ) : null}
                                                                </div>
                                                                <p>-</p>
                                                                <div className="flex flex-col">
                                                                    <DayPickerInput
                                                                        value={endDate}
                                                                        inputProps={{
                                                                            style: {
                                                                                border: errors?.endDate
                                                                                    ? "1px solid #b13626"
                                                                                    : "1px solid rgba(212, 212, 216,1)",
                                                                                borderRadius: "0.375rem",
                                                                                padding: "0.5rem 0.75rem",
                                                                                width: "130px",
                                                                                fontSize: ".875rem",
                                                                                cursor: "pointer",
                                                                            },
                                                                        }}
                                                                        dayPickerProps={{
                                                                            modifiers: modifiers,
                                                                            modifiersStyles: modifiersStyles,
                                                                        }}
                                                                        onDayChange={(date) => {
                                                                            setEndDate(date);
                                                                            setErrors({
                                                                                ...errors,
                                                                                startDate: false,
                                                                                endDate: false,
                                                                            });
                                                                        }}
                                                                    />
                                                                    {errors?.endDate ? (
                                                                        <p className="self-end pl-2 text-sm text-brickRed font-medium">
                                                                            End Date can not be before Start Date
                                                                        </p>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="border-b col-span-6 px-4   sm:grid sm:grid-cols-4 items-start justify-between py-3  w-full">
                                                        <div className="sm:grid sm:grid-cols-3 col-span-3 items-start">
                                                            <div className="block text-secondary font-sm font-medium self-start mt-1">
                                                                Program Type
                                                                <span className="text-brickRed">*</span>
                                                            </div>
                                                            <div className="mr-5 flex space-x-5 col-span-2">
                                                                <label className="inline-flex items-center md:mt-2">
                                                                    <input
                                                                        type="radio"
                                                                        name="FACTORY"
                                                                        value="FACTORY"
                                                                        className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                                        checked={customizable === "FACTORY"}
                                                                        onChange={handleMenuBoolChange}
                                                                    ></input>
                                                                    <span className="ml-2 text-sm  text-secondary">
                                                                        Factory Rebate
                                                                    </span>
                                                                </label>
                                                                <label className="inline-flex items-center md:mt-2">
                                                                    <input
                                                                        type="radio"
                                                                        name="VOLUME"
                                                                        value="VOLUME"
                                                                        className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                                        checked={customizable === "VOLUME"}
                                                                        onChange={handleMenuBoolChange}
                                                                    ></input>
                                                                    <span className="ml-2 text-sm  text-secondary">
                                                                        Volume Rebate
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="border-b col-span-6 px-4   sm:grid sm:grid-cols-4 items-start justify-between py-3  w-full">
                                                        <div className="sm:grid sm:grid-cols-3 col-span-3 items-start">
                                                            <div className="block text-secondary font-sm font-medium self-start mt-1">
                                                                Who can participate?
                                                                <span className="text-brickRed">*</span>
                                                            </div>
                                                            <div className="mr-5 col-span-2 space-x-5 flex">
                                                                <label className="inline-flex  md:mt-2">
                                                                    <input
                                                                        type="radio"
                                                                        name="all"
                                                                        value={false}
                                                                        className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                                        checked={participate === false}
                                                                        onChange={handleParticipateBoolChange}
                                                                    ></input>
                                                                    <span className="ml-2 text-sm  text-secondary">
                                                                        All Members (where region is applicable)
                                                                    </span>
                                                                </label>
                                                                <div className="flex flex-col">
                                                                    <label className="inline-flex  md:mt-2">
                                                                        <input
                                                                            type="radio"
                                                                            name="custom"
                                                                            value={true}
                                                                            className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                                            checked={participate === true}
                                                                            onChange={handleParticipateBoolChange}
                                                                        ></input>
                                                                        <span className="ml-2 text-sm  text-secondary">
                                                                            Choose Builders (Custom Program)
                                                                        </span>
                                                                    </label>
                                                                    {participate === true ? (
                                                                        <div className="mt-2 flex flex-col items-center space-x-5">
                                                                            <CommonSelect
                                                                                // eslint-disable-next-line
                                                                                value={programParticipants}
                                                                                error={programParticipants?.length <= 0}
                                                                                options={organizationsBuilders?.organizations?.edges
                                                                                    ?.map(
                                                                                        (
                                                                                            item
                                                                                            // eslint-disable-next-line
                                                                                        ) => {
                                                                                            if (
                                                                                                item.node
                                                                                                    .organization_type ===
                                                                                                "BUILDERS"
                                                                                            ) {
                                                                                                return item;
                                                                                            }
                                                                                        }
                                                                                    )
                                                                                    .filter(
                                                                                        (element) =>
                                                                                            element !== undefined
                                                                                    )}
                                                                                optionsToRemove={programParticipants}
                                                                                className="col-span-1 lg:w-full"
                                                                                clean={nullReactSelect}
                                                                                noOptionsMessage={
                                                                                    organizationsBuilderLoading
                                                                                        ? "Loading..."
                                                                                        : "No Builders Found"
                                                                                }
                                                                                from="createProgram"
                                                                                placeHolder="
                                                                        Builders"
                                                                                isMulti
                                                                                menuPlacement={"bottom"}
                                                                                onChange={(e) => {
                                                                                    participants(e);
                                                                                    setNullReactSelect(false);
                                                                                }}
                                                                            />
                                                                            {programParticipants?.length <= 0 ? (
                                                                                <p className="self-end pl-2 mt-1 text-sm text-brickRed">
                                                                                    {" "}
                                                                                    Select a Builder
                                                                                </p>
                                                                            ) : null}
                                                                        </div>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="border-b col-span-6 px-4   sm:grid sm:grid-cols-4 items-start justify-between py-3 w-full">
                                                        <div className="sm:grid sm:grid-cols-4 col-span-4 items-start">
                                                            <div className="block text-secondary font-sm font-medium self-start mt-2">
                                                                Where is this Program valid?
                                                                <span className="text-brickRed">*</span>
                                                            </div>

                                                            <div className="mr-5 col-span-2 grid grid-cols-2">
                                                                <div className="col-span-2 grid grid-cols-2">
                                                                    {programValidityOptions.map((item, index) => {
                                                                        return (
                                                                            <div
                                                                                className="mt-2 col-span-1"
                                                                                key={index}
                                                                            >
                                                                                <label className="inline-flex items-center ">
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={item.name}
                                                                                        value={item.name}
                                                                                        className={`form-radio h-5 w-5 text-secondary focus:ring-secondary ${customizableState ===
                                                                                            undefined
                                                                                            ? "input-error"
                                                                                            : ""
                                                                                            } `}
                                                                                        checked={
                                                                                            customizableState ===
                                                                                            item.name
                                                                                        }
                                                                                        onChange={handleStateBoolChange}
                                                                                    ></input>
                                                                                    <span
                                                                                        className={`ml-2 text-sm   ${customizableState ===
                                                                                            undefined
                                                                                            ? "text-brickRed"
                                                                                            : "text-secondary"
                                                                                            }`}
                                                                                    >
                                                                                        {item.label}
                                                                                    </span>
                                                                                </label>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                    {customizableState === "CUSTOM" ? (
                                                                        <div className="mt-2 flex items-start space-x-5">
                                                                            <label className="block text-md font-medium text-secondary mt-2">
                                                                                State/Province
                                                                            </label>
                                                                            <div className="flex flex-col">
                                                                                <CommonSelect
                                                                                    error={state?.length <= 0}
                                                                                    async
                                                                                    value={state}
                                                                                    edit={edit}
                                                                                    isMulti
                                                                                    options={states && states.states}
                                                                                    optionsToRemove={state?.map(
                                                                                        (item) => parseInt(item?.value)
                                                                                    )}
                                                                                    className="w-96"
                                                                                    placeHolder="State"
                                                                                    menuPlacement={"top"}
                                                                                    noOptionsMessage={"No states found"}
                                                                                    onChange={(e) => {
                                                                                        stateshandler(e);
                                                                                        setNullReactSelect(false);
                                                                                    }}
                                                                                />
                                                                                {state?.length <= 0 ? (
                                                                                    <p className="self-end pl-2 text-sm text-brickRed font-medium">
                                                                                        {" "}
                                                                                        Select a state{" "}
                                                                                    </p>
                                                                                ) : null}
                                                                            </div>
                                                                        </div>
                                                                    ) : null}
                                                                </div>
                                                                {customizableState !== undefined ? null : (
                                                                    <p className="self-end pl-2 text-sm text-brickRed font-medium">
                                                                        {" "}
                                                                        Select valid options{" "}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {customizable === "FACTORY" ? (
                                            <div className=" grid grid-cols-3 border-b-2 border-gray-400">
                                                <div className="flex flex-col col-span-2 border-r">
                                                    <p className="font-title py-2 px-4  text-secondary font-bold text-md ">
                                                        Rebate Details
                                                    </p>
                                                    <div className="border-b px-4 col-span-6   sm:grid sm:grid-cols-2 items-start justify-between py-3 sm:items-center w-full">
                                                        <div className="sm:grid sm:grid-cols-6 col-span-2 items-start ">
                                                            <div className="block text-secondary col-span-2 font-sm font-medium mt-2">
                                                                Flat Rebate?
                                                            </div>
                                                            <div className=" flex space-x-5 col-span-4 px-10">
                                                                <div className="mt-2">
                                                                    <label className="inline-flex items-center ">
                                                                        <input
                                                                            type="radio"
                                                                            checked={!flatRebate}
                                                                            onChange={(event) =>
                                                                                handleFlatRebateChange(event)
                                                                            }
                                                                            className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                                        ></input>
                                                                        <span className="ml-2 text-sm  text-secondary">
                                                                            Non Flat
                                                                        </span>
                                                                    </label>
                                                                </div>
                                                                <div className="mt-2 ml-5">
                                                                    <label className="inline-flex items-center ">
                                                                        <input
                                                                            type="radio"
                                                                            checked={flatRebate}
                                                                            onChange={(event) =>
                                                                                handleFlatRebateChange(event)
                                                                            }
                                                                            className="form-radio ml-5 h-5 w-5 text-secondary focus:ring-secondary"
                                                                        ></input>
                                                                        <span className="ml-2 text-sm  text-secondary">
                                                                            Flat
                                                                        </span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="border-b px-4 col-span-6   sm:grid sm:grid-cols-2 items-start justify-between py-3 sm:items-center w-full">
                                                        <div className="sm:grid sm:grid-cols-6 col-span-2 items-start ">
                                                            <div className="block text-secondary col-span-2 font-sm font-medium mt-2">
                                                                {APP_TITLE} Rebate Unit?
                                                            </div>
                                                            <div className=" flex space-x-5 col-span-4 px-10">
                                                                {rebateUnitOptions.map((item, index) => {
                                                                    return (
                                                                        <div className="mt-2" key={index}>
                                                                            <label className="inline-flex items-center ">
                                                                                <input
                                                                                    type="radio"
                                                                                    name={item.name}
                                                                                    value={item.name}
                                                                                    className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                                                    checked={rebateUnit === item.name}
                                                                                    onChange={rebateUnitBoolChange}
                                                                                ></input>
                                                                                <span className="ml-2 text-sm  text-secondary">
                                                                                    {item.label}
                                                                                </span>
                                                                            </label>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="border-b px-4 col-span-6   sm:grid sm:grid-cols-2 items-start justify-between py-3 sm:items-center w-full">
                                                        <div className="sm:grid sm:grid-cols-6 col-span-2 items-start ">
                                                            <div className="block text-secondary col-span-2 font-sm font-medium mt-2">
                                                                {APP_TITLE} Rebate Type?
                                                            </div>
                                                            <div className=" flex space-x-5 col-span-4 px-10">
                                                                {rebateTypeOptions.map((item, index) => {
                                                                    return (
                                                                        <div className="mt-2" key={index}>
                                                                            <label className="inline-flex items-center ">
                                                                                <input
                                                                                    type="radio"
                                                                                    name={item.name}
                                                                                    value={item.name}
                                                                                    className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                                                    checked={rebateType === item.name}
                                                                                    onChange={rebateTypeBoolChange}
                                                                                ></input>
                                                                                <span className="ml-2 text-sm  text-secondary">
                                                                                    {item.label}
                                                                                </span>
                                                                            </label>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {rebateType === "SAME" && flatRebate ? (
                                                        <div className="border-b px-4 col-span-6   sm:grid sm:grid-cols-2 items-start justify-between py-3 sm:items-center w-full">
                                                            <div className="sm:grid sm:grid-cols-6 col-span-2 items-start ">
                                                                <div className="block text-secondary col-span-2 font-sm font-medium mt-2">
                                                                    Flat Rebate Amounts
                                                                </div>
                                                                <div className="flex col-span-3 md:items-start gap-2 md:gap-3 ml-9 ">
                                                                    <TextField
                                                                        parentClass=""
                                                                        id="flat_builder_rebate"
                                                                        label="Builder"
                                                                        onChange={handleChange}
                                                                        width="w-24"
                                                                        value={fields?.flat_builder_rebate}
                                                                        isDollar
                                                                        name="flat_builder_rebate"
                                                                        placeholder="10"
                                                                        type="text"
                                                                    />
                                                                    <TextField
                                                                        width="w-24"
                                                                        id="flat_bbg_rebate"
                                                                        label={APP_TITLE}
                                                                        onChange={handleChange}
                                                                        value={fields?.flat_bbg_rebate}
                                                                        isDollar
                                                                        name="flat_bbg_rebate"
                                                                        placeholder="25"
                                                                        type="text"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                    {rebateType === "SAME" && !flatRebate ? (
                                                        <div className="flex flex-col  md:grid md:grid-cols-5 py-5 items-start border-b ">
                                                            <div className="block text-secondary font-sm font-medium px-4  col-span-2">
                                                                {APP_TITLE} Rebate Amount by Property Type
                                                            </div>
                                                            <div className="flex col-span-3 md:items-start gap-2 md:gap-3 -ml-2 ">
                                                                <TextField
                                                                    parentClass=""
                                                                    id="global_product_residential_rebate_amount"
                                                                    label="Residential"
                                                                    onChange={handleChange}
                                                                    width="w-24"
                                                                    value={
                                                                        fields?.global_product_residential_rebate_amount
                                                                    }
                                                                    isDollar
                                                                    name="global_product_residential_rebate_amount"
                                                                    placeholder="10"
                                                                    type="text"
                                                                />
                                                                <TextField
                                                                    width="w-24"
                                                                    id="global_product_multi_unit_rebate_amount"
                                                                    label="Multi-Unit"
                                                                    onChange={handleChange}
                                                                    value={
                                                                        fields?.global_product_multi_unit_rebate_amount
                                                                    }
                                                                    isDollar
                                                                    name="global_product_multi_unit_rebate_amount"
                                                                    placeholder="25"
                                                                    type="text"
                                                                />
                                                                <TextField
                                                                    width="w-24"
                                                                    id="global_product_commercial_rebate_amount"
                                                                    label="Commercial"
                                                                    onChange={handleChange}
                                                                    value={
                                                                        fields?.global_product_commercial_rebate_amount
                                                                    }
                                                                    isDollar
                                                                    name="global_product_commercial_rebate_amount"
                                                                    placeholder="50"
                                                                    type="text"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : null}

                                                    <div className="border-b px-4 col-span-6   sm:grid sm:grid-cols-2 items-start justify-between py-3 sm:items-center w-full">
                                                        <div className="sm:grid sm:grid-cols-6 col-span-2 items-start">
                                                            <div className="block text-secondary col-span-2 font-sm font-medium mt-2">
                                                                Minimum Units?
                                                            </div>
                                                            <div className=" flex space-x-5 col-span-4 items-start pl-10">
                                                                {minimumUnits.map((item, index) => {
                                                                    return (
                                                                        <div className="mt-2" key={index}>
                                                                            <label className="inline-flex items-center ">
                                                                                <input
                                                                                    type="radio"
                                                                                    name={item.name + "units"}
                                                                                    value={item.name}
                                                                                    className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                                                    checked={minQuantity === item.name}
                                                                                    onChange={
                                                                                        handleMinimumQuantityChange
                                                                                    }
                                                                                ></input>
                                                                                <span className="ml-2 text-sm  text-secondary">
                                                                                    {item.label}
                                                                                </span>
                                                                            </label>
                                                                            {minQuantity === "SAME_FOR_ALL" &&
                                                                                item.name === "SAME_FOR_ALL" ? (
                                                                                <TextField
                                                                                    value={
                                                                                        fields?.global_product_minimum_unit
                                                                                    }
                                                                                    onChange={handleChange}
                                                                                    parentClass="col-span-6 sm:col-span-6 flex flex-col sm:grid sm:grid-cols-2  items-start justify-between  sm:items-center w-full"
                                                                                    id="global_product_minimum_unit"
                                                                                    label="Minimum"
                                                                                    width="w-24"
                                                                                    name="global_product_minimum_unit"
                                                                                    placeholder="10"
                                                                                    type="text"
                                                                                />
                                                                            ) : null}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="border-b px-4 col-span-6   sm:grid sm:grid-cols-2 items-start justify-between py-3 sm:items-center w-full">
                                                        <div className="sm:grid sm:grid-cols-6 col-span-2 items-start">
                                                            <div className="block text-secondary col-span-2 font-sm font-medium mt-2">
                                                                All Builders to report quantity?
                                                            </div>
                                                            <div className=" flex  col-span-4 px-10 space-x-5">
                                                                <label className="inline-flex items-center md:mt-2">
                                                                    <input
                                                                        type="radio"
                                                                        name="false"
                                                                        value={false}
                                                                        className={`form-radio h-5 w-5 text-secondary focus:ring-secondary ${rebateUnit === "PER_UNIT"
                                                                            ? "cursor-not-allowed opacity-25"
                                                                            : ""
                                                                            }`}
                                                                        checked={
                                                                            reportQuantity === false ||
                                                                            reportQuantity === "false"
                                                                        }
                                                                        disabled={rebateUnit === "PER_UNIT"}
                                                                        onChange={handleReportQuantityBoolChange}
                                                                    ></input>
                                                                    <span className="ml-2 text-sm  text-secondary">
                                                                        No
                                                                    </span>
                                                                </label>
                                                                <label className="inline-flex items-center md:mt-2">
                                                                    <input
                                                                        type="radio"
                                                                        name="true"
                                                                        value={true}
                                                                        className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                                        checked={
                                                                            reportQuantity === true ||
                                                                            reportQuantity === "true"
                                                                        }
                                                                        onChange={handleReportQuantityBoolChange}
                                                                    ></input>
                                                                    <span className="ml-2 text-sm  text-secondary">
                                                                        Yes
                                                                    </span>
                                                                </label>
                                                            </div>
                                                            <p className="block text-gray-400 font-sm col-span-6 mt-2">
                                                                Note: If select builders must report quantity for
                                                                special deals, add that at the custom variant or custom
                                                                product level.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="border-b px-4 col-span-6   sm:grid sm:grid-cols-2 items-start justify-between py-3 sm:items-center w-full">
                                                        <div className="sm:grid sm:grid-cols-6 col-span-2 items-start">
                                                            <div className="block text-secondary col-span-2 font-sm mt-1 font-medium">
                                                                Lot Numbers & Address Requirements?
                                                            </div>
                                                            <div className=" flex flex-col col-span-4 px-10">
                                                                {addressRequirements.map((item, index) => {
                                                                    return (
                                                                        <div className="mt-2" key={index}>
                                                                            <label className="inline-flex items-center ">
                                                                                <input
                                                                                    type="radio"
                                                                                    name={item.name}
                                                                                    value={item.name}
                                                                                    className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                                                    checked={addressType === item.name}
                                                                                    onChange={addressTypeBoolChange}
                                                                                ></input>
                                                                                <span className="ml-2 text-sm  text-secondary">
                                                                                    {item.label}
                                                                                </span>
                                                                            </label>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="font-title px-4 py-2   text-secondary font-bold text-md">
                                                        Required Rebate Proof Points
                                                    </p>
                                                    <div className="px-4">
                                                        <fieldset className="flex flex-col">
                                                            {requiredProofPoints.map((item, index) => {
                                                                return (
                                                                    <div className="mt-2 space-y-2 cursor-pointer">
                                                                        <div className="relative flex items-start">
                                                                            <div className="flex items-center h-5 ">
                                                                                <input
                                                                                    onChange={proofPointChange}
                                                                                    checked={proofPoints.includes(
                                                                                        item.name
                                                                                    )}
                                                                                    value={item.name}
                                                                                    id={item.name}
                                                                                    name={item.name}
                                                                                    type="checkbox"
                                                                                    className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                                                                                />
                                                                            </div>
                                                                            <div className="ml-3 text-sm">
                                                                                <label
                                                                                    htmlFor={item.name}
                                                                                    className="text-md text-secondary  cursor-pointer"
                                                                                >
                                                                                    {item.label}
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </fieldset>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}
                                        {fillColumns ? (
                                            <div className="py-2 pr-5 flex items-end justify-end  border-gray-400">
                                                {edit && (
                                                    <Button
                                                        disabled={deleteProgramLoading}
                                                        color="brickRed"
                                                        title={"Archive Program"}
                                                        onClick={() => deleteProgram()}
                                                    />
                                                )}
                                                <Button
                                                    color="secondary"
                                                    title={"Pricing History"}
                                                    disabled={programPricingHistoryLoading ? true : false}
                                                    onClick={() => setShowPricingModal(true)}
                                                //onClick={() => showPricingModal()}
                                                />
                                                <Button
                                                    disabled={finalError?.about}
                                                    color="primary"
                                                    title={
                                                        edit
                                                            ? updateProgramLoading
                                                                ? "Saving Updates"
                                                                : "Save Updates"
                                                            : createProgramLoading
                                                                ? "Saving"
                                                                : "Save"
                                                    }
                                                    onClick={() => handleAboutError()}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        </Disclosure.Panel>
                    </Transition>
                </Disclosure>
                {edit === true ? (
                    <Disclosure as="div" className="mt-5">
                        <Disclosure.Button
                            className={`bg-white w-full  focus:outline-none ${active === "description" && show ? "rounded-lg rounded-b-none" : "rounded-lg"
                                }`}
                        >
                            <div
                                style={{ maxHeight: "68px" }}
                                className={`flex flex-col md:flex-row py-4 px-4 justify-between items-center ${active === "description" && show ? "border-b-2 border-gray-400" : ""
                                    }`}
                                onClick={() => activeHandler("description")}
                            >
                                <div className=" font-title  text-center h2">
                                    {active === "description" && show ? "Notes: " + fields?.name : "Notes"}
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
                                        <div className="col-span-6 inset-0 h-full flex flex-col">
                                            <div className="flex  w-full h-full border-b  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                                                <div className="w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                    <div className="">
                                                        <div className="flex flex-col mt-4">
                                                            <div className="flex flex-col justify-start mb:px-3 pb-2 w-full ">
                                                                <div className=" flex flex-col xl:flex-row gap-5 overflow-hidden">
                                                                    <div className="flex flex-col mb-2 xl:ml-2 w-full xl:px-3">
                                                                        <div className="block text-secondary font-sm font-medium mb-1">
                                                                            Admin Notes
                                                                        </div>
                                                                        <RichText
                                                                            initialContent={
                                                                                fields?.internal_description
                                                                            }
                                                                            handleEditorChange={handleEditorChange}
                                                                            error={
                                                                                descriptionErrors?.internalDescription
                                                                            }
                                                                            height="200"
                                                                        />
                                                                    </div>
                                                                    <div className="flex flex-col mb-2 xl:mr-2 w-full xl:px-3">
                                                                        <div className="block text-secondary font-sm font-medium mb-1">
                                                                            Sales Notes
                                                                        </div>
                                                                        <RichText
                                                                            initialContent={
                                                                                fields?.builder_description_short
                                                                            }
                                                                            handleEditorChange={
                                                                                handleBuilderShortChange
                                                                            }
                                                                            height="200"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col mt-2">
                                                            <div className="flex flex-col justify-start  pb-2 w-full">
                                                                <div className=" flex xl:flex-row gap-5 overflow-hidden">
                                                                    <div className="flex flex-col mb-2 w-full xl:px-5">
                                                                        <div className="block text-secondary font-sm font-medium mb-1">
                                                                            TM Notes
                                                                        </div>
                                                                        <RichText
                                                                            initialContent={fields?.builder_description}
                                                                            handleEditorChange={handleBuilderFullChange}
                                                                            height="200"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {fillColumns ? (
                                                <div className="py-2 pr-5 flex flex-col items-end justify-end border-t">
                                                    <Button
                                                        color="primary"
                                                        title={edit ? "Save Updates" : "Save"}
                                                        onClick={
                                                            edit
                                                                ? () => {
                                                                    updateProgram();
                                                                    setActive("products");
                                                                }
                                                                : createProgram
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
                ) : null}
                {edit === true ? (
                    <Disclosure as="div" className="mt-5">
                        <Disclosure.Button
                            className={`bg-white w-full  focus:outline-none ${active === "products" && show ? "rounded-lg rounded-b-none" : "rounded-lg"
                                }`}
                        >
                            <div
                                style={{ maxHeight: "68px" }}
                                className={`flex flex-col px-4 md:flex-row justify-between items-center ${active === "products" && show ? "border-b-2 border-gray-400" : ""
                                    }`}
                                onClick={() => activeHandler("products")}
                            >
                                <div className=" font-title py-4  text-center h2">
                                    {active === "products" && show ? "Products: " + fields?.name : "Products"}
                                </div>
                                {active === "products" && show ? (
                                    <ChevronUpIcon className="h-10 w-10 text-secondary" />
                                ) : (
                                    <ChevronDownIcon className="h-10 w-10 text-secondary" />
                                )}
                            </div>
                        </Disclosure.Button>
                        <Transition
                            show={active === "products" && show}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-150 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Disclosure.Panel static>
                                <div className="grid bg-white  rounded-lg rounded-t-none grid-cols-6 overflow-hidden ">
                                    {productsLoading ? (
                                        <div className="col-span-6 flex items-center justify-center">
                                            <Loader />
                                        </div>
                                    ) : (
                                        <div className="col-span-6 inset-0 flex flex-col">
                                            <div className="flex  w-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                                                <div className="w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                    <div className="">
                                                        <div className="overflow-hidden">
                                                            <div className="flex flex-col   overflow-hidden rounded-lg px-4 pb-4">
                                                                {modal()}
                                                                {tableData(fields?.name + " Products")}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </Disclosure>
                ) : null}
                {edit === true && user?.type === "VOLUME" ? (
                    <Disclosure as="div" className="mt-5">
                        <Disclosure.Button
                            className={`bg-white w-full  focus:outline-none ${active === "claimsTemplate" && show ? "rounded-lg rounded-b-none" : "rounded-lg"
                                }`}
                        >
                            <div
                                style={{ maxHeight: "68px" }}
                                className={`flex flex-col px-4 md:flex-row justify-between items-center ${active === "claimsTemplate" && show ? "border-b-2 border-gray-400" : ""
                                    }`}
                                onClick={() => activeHandler("claimsTemplate")}
                            >
                                <div className=" font-title py-4 text-center h2">
                                    {active === "claimsTemplate" && show
                                        ? "Volume Claims Templates: " + fields?.name
                                        : "Volume Claims Templates"}
                                </div>
                                {active === "claimsTemplate" && show ? (
                                    <ChevronUpIcon className="h-10 w-10 text-secondary" />
                                ) : (
                                    <ChevronDownIcon className="h-10 w-10 text-secondary" />
                                )}
                            </div>
                        </Disclosure.Button>
                        <Transition
                            show={active === "claimsTemplate" && show}
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
                                            <ClaimsTemplate
                                                refetch={(id) => refetch(id)}
                                                program={user}
                                                callBack={(result) => callBack(result)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </Disclosure>
                ) : null}
                {edit === true ? (
                    <Disclosure as="div" className="mt-5">
                        <Disclosure.Button
                            className={`bg-white w-full  focus:outline-none ${active === "conversions" && show ? "rounded-lg rounded-b-none" : "rounded-lg"
                                }`}
                        >
                            <div
                                style={{ maxHeight: "68px" }}
                                className={`flex flex-col px-4 md:flex-row justify-between items-center ${active === "conversions" && show ? "border-b-2 border-gray-400" : ""
                                    }`}
                                onClick={() => activeHandler("conversions")}
                            >
                                <div className="flex items-center gap-2">
                                    <div className=" font-title py-4 text-center h2">
                                        {active === "conversions" && show
                                            ? "Conversions: " + fields?.name
                                            : "Conversions"}
                                    </div>
                                </div>

                                {active === "conversions" && show ? (
                                    <ChevronUpIcon className="h-10 w-10 text-secondary" />
                                ) : (
                                    <ChevronDownIcon className="h-10 w-10 text-secondary" />
                                )}
                            </div>
                        </Disclosure.Button>
                        <Transition
                            show={active === "conversions" && show}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-150 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Disclosure.Panel static>
                                <div className="grid bg-white  rounded-lg rounded-t-none grid-cols-6 overflow-hidden">
                                    {loading ? (
                                        <div className="col-span-6 flex items-center justify-center">
                                            <Loader />
                                        </div>
                                    ) : (
                                        <div className="col-span-6 inset-0 flex flex-col">
                                            <Conversions
                                                showOptions={true}
                                                refetch={(id) => refetch(id)}
                                                program={user}
                                                callBack={(result) => callBack(result)}
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

export default CreateProgram;
