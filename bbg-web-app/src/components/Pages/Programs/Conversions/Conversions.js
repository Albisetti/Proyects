import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import {
    CREATE_ACTIVITY_PAYMENT,
    CREATE_FLAT_CONVERSION,
    CREATE_FLAT_PERCENT,
    CREATE_SPECIFIC_ACTIVITY_PAYMENT,
    CREATE_TIRERED_CONVERSION,
    DELETE_ACITIVTY_CONVERSION,
    DELETE_FLAT_PAYMENT_CONVERSION,
    DELETE_FLAT_PERCENT_CONVERSION,
    DELETE_TIERED_CONVERSION,
    UPDATE_ACTIVITY_PAYMENT,
    UPDATE_FLAT_CONVERSION,
    UPDATE_FLAT_PERCENT,
    UPDATE_SPECIFIC_ACTIVITY_PAYMENT,
    UPDATE_TIRERED_CONVERSION,
} from "../../../../lib/programs";
import Button from "../../../Buttons";
import { Link } from "react-router-dom";
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import { toast } from "react-toastify";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { getFormattedDate, formatterForCurrency } from "../../../../util/generic";
import { InputDecimal } from "../../../InputDecimal/InputDecimal";


const Conversions = ({ program, callBack }) => {

    const toDateAdd = (date) => {
        const date1 = new Date(date);
        let a = date1.getTimezoneOffset() * 60000;
        let b = new Date(date1.getTime() + a);
        return b;
    };

    const defaultState = {
        id: "",
        conversionName: "",
        conversionAmount: "",
        trigger_amount: "",
        bonus_amount: "",
        bonus_name: "",
        residential_bonus_amount: "",
        commercial_bonus_amount: "",
        multi_unit_bonus_amount: "",
        max_amount: "",
        bonus_percent: "",
    };

    const [fields, setFields] = useState(defaultState);
    const [conversionType, setConversionType] = useState("FLAT");
    const [measureUnit, setMeasureUnit] = useState("MONEY");
    const [whatHappens, setWhatHappens] = useState("");
    const [productsIncluded, setProductsIncluded] = useState("ALL");
    const [anticipatedPaymentDate, setAnticipatedPaymentDate] = useState(
        new Date()
    );
    const [clockStartDate, setClockStartDate] = useState(new Date());
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [tableAddresses, setTableAddresses] = useState();
    const [numberOfTiers, setNumberOfTiers] = useState(0);
    const [timeRange, setTimeRange] = useState("YEAR");
    const [showSelection, setShowSelection] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    const [conversionDeleteType, setConversionDeleteType] = useState("");
    const [edit, setEdit] = useState(false);
    const [conversionErrors, setConversionErrors] = useState({});
    const [conversionTypeError, setConversionTypeError] = useState(false);
    const [finalError, setFinalError] = useState(false);

    const conversionTypeOptions = [
        { name: "FLAT", label: "Flat Payment" },
        { name: "PERCENT", label: "Flat % on Date(s)" },
        { name: "TIERED", label: "Tiered % on Date(s) " },
        { name: "BY_ACTIVITY", label: "By Spend, Activity or Threshold" },
    ];

    const productIncludedTypeOptions = [
        { name: "ALL", label: "All Program Products" },
        { name: "SPECIFICS", label: "Select From Program Products" },
    ];

    const whatHappensOptions = [
        { name: "FLAT_AMOUNT", label: "Flat Payment" },
        { name: "REBATE_PERCENT_INCREASE", label: "Rebate % Increases" },
        {
            name: "REBATE_AMOUNT_INCREASE_PER_UNIT",
            label: "Increased Rebate Amount per Unit",
        },
        { name: "FLAT_AMOUNT", label: "One-Time Bonus" },
    ];

    const conversionTimeRanges = [
        { name: "YEAR", label: "in Year" },
        { name: "QUARTER", label: "in Quarter" },
        { name: "MONTH", label: "in Month" },
        { name: "ALL", label: "All Time" },
    ];

    const conversionMeasureUnit = [
        { name: "MONEY", label: "Money Spent" },
        { name: "PRODUCT", label: "Product(s) Qty" },
        { name: "PROPERTY", label: "Property Qty" },
    ];

    const handleConversionTypeChange = (event) => {
        setConversionType(event.target.value);
    };

    const handleMeasureUnit = (event) => {
        setMeasureUnit(event.target.value);
        setWhatHappens("");
    };

    const handleWhatHappens = (event) => {
        setWhatHappens(event.target.value);
    };

    const handleProductsIncluded = (event) => {
        setProductsIncluded(event.target.value);
    };

    const handleTimeRangeChanges = (event) => {
        setTimeRange(event.target.value);
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === "number") {
            setFields({
                ...fields,
                [name]: Number(value?.replace(/\D/g, '')),
            });
        } else {
            setFields({
                ...fields,
                [name]: value,
            });
        }


        if (fields?.[name]?.length > 0) {
            setConversionErrors({
                ...conversionErrors,
                [name]: false,
            });
        }
    };

    useEffect(() => {
        let insideErrors = {};
        if (
            fields?.conversionName?.length < 2 ||
            fields?.conversionName === undefined
        ) {
            insideErrors.conversionName = true;
        }
        if (
            parseFloat(fields?.conversionAmount) < 0 ||
            fields?.conversionAmount === undefined ||
            fields?.conversionAmount === ""
        ) {
            insideErrors.conversionAmount = true;
        }
        if (
            parseFloat(fields?.bonus_percent) < 0 ||
            fields?.bonus_percent === undefined ||
            fields?.bonus_percent === ""
        ) {
            insideErrors.bonus_percent = true;
        }
        if (
            parseFloat(fields?.trigger_amount) < 0 ||
            fields?.trigger_amount === undefined ||
            fields?.trigger_amount === ""
        ) {
            insideErrors.trigger_amount = true;
        }
        if (
            parseFloat(fields?.bonus_amount) < 0 ||
            fields?.bonus_amount === undefined ||
            fields?.bonus_amount === ""
        ) {
            insideErrors.bonus_amount = true;
        }
        if (
            parseFloat(fields?.residential_bonus_amount) < 0 ||
            fields?.residential_bonus_amount === undefined ||
            fields?.residential_bonus_amount === ""
        ) {
            insideErrors.residential_bonus_amount = true;
        }
        if (
            parseFloat(fields?.commercial_bonus_amount) < 0 ||
            fields?.commercial_bonus_amount === undefined ||
            fields?.commercial_bonus_amount === ""
        ) {
            insideErrors.commercial_bonus_amount = true;
        }
        if (
            parseFloat(fields?.multi_unit_bonus_amount) < 0 ||
            fields?.multi_unit_bonus_amount === undefined ||
            fields?.multi_unit_bonus_amount === ""
        ) {
            insideErrors.multi_unit_bonus_amount = true;
        }
        let finalError;
        if (conversionType === "FLAT") {
            finalError =
                insideErrors?.conversionName || insideErrors?.conversionAmount;
        } else if (conversionType === "PERCENT") {
            finalError =
                insideErrors?.conversionName || insideErrors?.bonus_percent;
        } else if (conversionType === "TIERED") {
            finalError =
                insideErrors?.conversionName || seeTableAddressesError();
        } else if (
            conversionType === "BY_ACTIVITY" &&
            measureUnit === "MONEY"
        ) {
            if (whatHappens === "" || whatHappens === undefined) {
                finalError = true;
            } else if (
                whatHappens === "FLAT_AMOUNT" ||
                whatHappens === "REBATE_PERCENT_INCREASE"
            ) {
                finalError =
                    insideErrors?.conversionName ||
                    insideErrors?.trigger_amount ||
                    insideErrors?.bonus_amount;
            }
        } else if (
            conversionType === "BY_ACTIVITY" &&
            measureUnit === "PRODUCT"
        ) {
            if (whatHappens === "" || whatHappens === undefined) {
                finalError = true;
            } else if (whatHappens === "FLAT_AMOUNT") {
                finalError =
                    insideErrors?.conversionName ||
                    insideErrors?.trigger_amount ||
                    insideErrors?.bonus_amount;
            } else if (whatHappens === "REBATE_AMOUNT_INCREASE_PER_UNIT") {
                finalError =
                    insideErrors?.conversionName ||
                    insideErrors?.trigger_amount ||
                    insideErrors?.residential_bonus_amount ||
                    insideErrors?.commercial_bonus_amount ||
                    insideErrors?.multi_unit_bonus_amount;
            }
        } else if (
            conversionType === "BY_ACTIVITY" &&
            measureUnit === "PROPERTY"
        ) {
            if (whatHappens === "" || whatHappens === undefined) {
                finalError = true;
            } else if (whatHappens === "FLAT_AMOUNT") {
                finalError =
                    insideErrors?.conversionName ||
                    insideErrors?.trigger_amount ||
                    insideErrors?.bonus_amount;
            } else if (whatHappens === "REBATE_AMOUNT_INCREASE_PER_UNIT") {
                finalError =
                    insideErrors?.conversionName ||
                    insideErrors?.trigger_amount ||
                    insideErrors?.residential_bonus_amount ||
                    insideErrors?.commercial_bonus_amount ||
                    insideErrors?.multi_unit_bonus_amount;
            }
        }

        setFinalError(finalError);
        setConversionErrors(insideErrors);
        // eslint-disable-next-line
    }, [fields, conversionType, tableAddresses]);

    const seeTableAddressesError = () => {
        let array = tableAddresses && Object.values(tableAddresses);
        let error;
        if (!array) {
            return true;
        }
        array?.forEach((item) => {
            if (
                item?.bonus_amount < 0 ||
                item?.spend_exceed < 0 ||
                isNaN(item?.bonus_amount) ||
                isNaN(item?.spend_exceed)
            ) {
                error = true;
            } else {
                error = false;
            }
        });
        return error;
    };

    useEffect(() => {
        if (conversionType === undefined || conversionType === "") {
            setConversionTypeError(true);
        }
    }, [conversionType]);

    const [createFlatConversion] = useMutation(CREATE_FLAT_CONVERSION, {
        variables: {
            name: fields?.conversionName,
            id: program?.id,
            amount: parseFloat(fields?.conversionAmount),
            anticipated_payment_date: anticipatedPaymentDate
                ?.toISOString()
                ?.substr(0, 10),
        },
        update(cache, result) {
            delete Object.assign(result.data, {
                node: result.data["createConversionFlatPayment"],
            })["createConversionFlatPayment"];
            callBack(result?.data?.node?.program);
            setFields({
                ...fields,
                conversionName: "",
                conversionAmount: "",
            });
            toast.success("Conversion saved!");
            setShowSelection(false);
        },
    });

    const [updateFlatConversion] = useMutation(UPDATE_FLAT_CONVERSION, {
        variables: {
            conversionId: fields?.id,
            name: fields?.conversionName,
            id: program?.id,
            amount: parseFloat(fields?.conversionAmount),
            anticipated_payment_date: anticipatedPaymentDate
                ?.toISOString()
                ?.substr(0, 10),
        },
        update(cache, result) {
            delete Object.assign(result.data, {
                node: result.data["updateConversionFlatPayment"],
            })["updateConversionFlatPayment"];
            callBack(result?.data?.node?.program);
            setFields(defaultState);
            toast.success("Conversion saved!");
            setShowSelection(false);
        },
    });

    const cleanState = () => {
        setFields(defaultState);
        setAnticipatedPaymentDate(new Date());
        setClockStartDate(new Date());
    };

    const createConversion = () => {
        switch (conversionType) {
            case "FLAT":
                createFlatConversion();
                cleanState();
                break;
            case "PERCENT":
                createFlatPercentConversion();
                cleanState();
                break;
            case "TIERED":
                createTieredConversion();
                cleanState();
                break;
            case "BY_ACTIVITY":
                if (productsIncluded === "SPECIFICS") {
                    conversionBySpecificActivity();
                    cleanState();
                } else if (productsIncluded === "ALL") {
                    conversionByActivity();
                    cleanState();
                }
                break;
            default:
                break;
        }
    };

    const updateConversion = () => {
        switch (conversionType) {
            case "FLAT":
                updateFlatConversion();
                cleanState();
                break;
            case "PERCENT":
                updateFlatPercentConversion();
                cleanState();
                break;
            case "TIERED":
                updateTieredConversion();
                cleanState();
                break;
            case "BY_ACTIVITY":
                if (productsIncluded === "SPECIFICS") {
                    updateConversionBySpecificActivity();
                    cleanState();
                } else if (productsIncluded === "ALL") {
                    updateConversionByActivity();
                    cleanState();
                }
                break;
            default:
                break;
        }
    };

    const [conversionByActivity] = useMutation(CREATE_ACTIVITY_PAYMENT, {
        variables: {
            name: fields?.conversionName,
            id: program?.id,
            product_included: productsIncluded,
            measure_unit: measureUnit,
            trigger_amount: parseFloat(fields?.trigger_amount),
            bonus_name: fields?.bonus_name,
            bonus_type: whatHappens,
            bonus_amount: parseFloat(fields?.bonus_amount),
            residential_bonus_amount: parseFloat(
                fields?.residential_bonus_amount
            ),
            multi_unit_bonus_amount: parseFloat(
                fields?.multi_unit_bonus_amount
            ),
            commercial_bonus_amount: parseFloat(
                fields?.commercial_bonus_amount
            ),
        },
        update(cache, result) {
            delete Object.assign(result.data, {
                node: result.data["createConversionByActivity"],
            })["createConversionByActivity"];
            callBack(result?.data?.node?.program);
            setFields({
                ...fields,
                conversionName: "",
                trigger_amount: "",
                bonus_name: "",
                multi_unit_bonus_amount: "",
                commercial_bonus_amount: "",
                residential_bonus_amount: "",
            });
            toast.success("Conversion saved!");
            setShowSelection(false);
            setSelectedProducts([]);
        },
    });

    const [updateConversionByActivity] = useMutation(UPDATE_ACTIVITY_PAYMENT, {
        variables: {
            conversionId: fields?.id,
            name: fields?.conversionName,
            id: program?.id,
            product_included: productsIncluded,
            measure_unit: measureUnit,
            trigger_amount: parseFloat(fields?.trigger_amount),
            bonus_name: fields?.bonus_name,
            bonus_type: whatHappens,
            bonus_amount: parseFloat(fields?.bonus_amount),
            residential_bonus_amount: parseFloat(
                fields?.residential_bonus_amount
            ),
            multi_unit_bonus_amount: parseFloat(
                fields?.multi_unit_bonus_amount
            ),
            commercial_bonus_amount: parseFloat(
                fields?.commercial_bonus_amount
            ),
        },
        update(cache, result) {
            delete Object.assign(result.data, {
                node: result.data["updateConversionByActivity"],
            })["updateConversionByActivity"];
            callBack(result?.data?.node?.program);
            setFields(defaultState);
            toast.success("Conversion saved!");
            setShowSelection(false);
            setSelectedProducts([]);
        },
    });

    const [conversionBySpecificActivity] = useMutation(
        CREATE_SPECIFIC_ACTIVITY_PAYMENT,
        {
            variables: {
                name: fields?.conversionName,
                id: program?.id,
                product_included: productsIncluded,
                products: selectedProducts,
                measure_unit: measureUnit,
                trigger_amount: parseFloat(fields?.trigger_amount),
                bonus_name: fields?.bonus_name,
                bonus_type: whatHappens,
                multi_unit_bonus_amount: parseFloat(
                    fields?.multi_unit_bonus_amount
                ),
                commercial_bonus_amount: parseFloat(
                    fields?.commercial_bonus_amount
                ),
                residential_bonus_amount: parseFloat(
                    fields?.residential_bonus_amount
                ),
                bonus_amount: parseFloat(fields?.bonus_amount),
            },
            update(cache, result) {
                delete Object.assign(result.data, {
                    node: result.data["createConversionByActivity"],
                })["createConversionByActivity"];
                callBack(result?.data?.node?.program);
                setFields({
                    ...fields,
                    conversionName: "",
                    trigger_amount: "",
                    bonus_name: "",
                    multi_unit_bonus_amount: "",
                    commercial_bonus_amount: "",
                    residential_bonus_amount: "",
                });
                toast.success("Conversion saved!");
                setShowSelection(false);
                setSelectedProducts([]);
            },
        }
    );

    const [updateConversionBySpecificActivity] = useMutation(
        UPDATE_SPECIFIC_ACTIVITY_PAYMENT,
        {
            variables: {
                conversionId: fields?.id,
                name: fields?.conversionName,
                id: program?.id,
                product_included: productsIncluded,
                products: selectedProducts,
                measure_unit: measureUnit,
                trigger_amount: parseFloat(fields?.trigger_amount),
                bonus_name: fields?.bonus_name,
                bonus_type: whatHappens,
                multi_unit_bonus_amount: parseFloat(
                    fields?.multi_unit_bonus_amount
                ),
                commercial_bonus_amount: parseFloat(
                    fields?.commercial_bonus_amount
                ),
                residential_bonus_amount: parseFloat(
                    fields?.residential_bonus_amount
                ),
                bonus_amount: parseFloat(fields?.bonus_amount),
            },
            update(cache, result) {
                delete Object.assign(result.data, {
                    node: result.data["updateConversionByActivity"],
                })["updateConversionByActivity"];
                callBack(result?.data?.node?.program);
                setFields(defaultState);
                toast.success("Conversion saved!");
                setShowSelection(false);
                setSelectedProducts([]);
            },
        }
    );

    const [createTieredConversion] = useMutation(CREATE_TIRERED_CONVERSION, {
        variables: {
            name: fields?.conversionName,
            id: program?.id,
            max_amount: parseFloat(fields?.max_amount),
            conversions: tableAddresses && Object.values(tableAddresses),
            valid_period: timeRange,
            clock_start: clockStartDate?.toISOString()?.substr(0, 10),
            anticipated_payment_date: anticipatedPaymentDate
                ?.toISOString()
                ?.substr(0, 10),
        },
        update(cache, result) {
            delete Object.assign(result.data, {
                node: result.data["createConversionTieredPercent"],
            })["createConversionTieredPercent"];
            callBack(result?.data?.node?.program);
            setFields({
                ...fields,
                conversionName: "",
                max_amount: "",
            });
            toast.success("Conversion saved!");
            setShowSelection(false);
            setTableAddresses();
            setNumberOfTiers(0);
        },
    });

    const [updateTieredConversion] = useMutation(UPDATE_TIRERED_CONVERSION, {
        variables: {
            conversionId: fields?.id,
            name: fields?.conversionName,
            id: program?.id,
            max_amount: parseFloat(fields?.max_amount),
            conversions: tableAddresses && Object.values(tableAddresses),
            valid_period: timeRange,
            clock_start: clockStartDate?.toISOString()?.substr(0, 10),
            anticipated_payment_date: anticipatedPaymentDate
                ?.toISOString()
                ?.substr(0, 10),
        },
        update(cache, result) {
            delete Object.assign(result.data, {
                node: result.data["updateConversionTieredPercent"],
            })["updateConversionTieredPercent"];
            callBack(result?.data?.node?.program);
            setFields({
                ...fields,
                conversionName: "",
                max_amount: "",
            });
            toast.success("Conversion saved!");
            setShowSelection(false);
            setTableAddresses();
            setNumberOfTiers(0);
        },
    });

    const [createFlatPercentConversion] = useMutation(CREATE_FLAT_PERCENT, {
        variables: {
            name: fields?.conversionName,
            id: program?.id,
            max_amount: parseFloat(fields?.max_amount),
            bonus_percent: parseFloat(fields?.bonus_percent),
            spend_time_range: timeRange,
            clock_start: clockStartDate?.toISOString()?.substr(0, 10),
            anticipated_payment_date: anticipatedPaymentDate
                ?.toISOString()
                ?.substr(0, 10),
        },
        update(cache, result) {
            delete Object.assign(result.data, {
                node: result.data["createConversionFlatPercent"],
            })["createConversionFlatPercent"];
            callBack(result?.data?.node?.program);
            setShowSelection(false);
            toast.success("Conversion saved!");
            setFields({
                ...fields,
                conversionName: "",
                max_amount: "",
                bonus_percent: "",
            });
        },
    });

    const [updateFlatPercentConversion] = useMutation(UPDATE_FLAT_PERCENT, {
        variables: {
            conversionId: fields?.id,
            name: fields?.conversionName,
            id: program?.id,
            max_amount: parseFloat(fields?.max_amount),
            bonus_percent: parseFloat(fields?.bonus_percent),
            spend_time_range: timeRange,
            clock_start: clockStartDate?.toISOString()?.substr(0, 10),
            anticipated_payment_date: anticipatedPaymentDate
                ?.toISOString()
                ?.substr(0, 10),
        },
        update(cache, result) {
            delete Object.assign(result.data, {
                node: result.data["updateConversionFlatPercent"],
            })["updateConversionFlatPercent"];
            callBack(result?.data?.node?.program);
            setShowSelection(false);
            toast.success("Conversion saved!");
            setFields(defaultState);
        },
    });

    useEffect(() => {
        if (deleteId !== "" && conversionDeleteType === "ACTIVITY") {
            deleteActivityConversion();
            setDeleteId("");
            setConversionDeleteType("");
        } else if (deleteId !== "" && conversionDeleteType === "TIERED") {
            deleteTieredConversion();
            setDeleteId("");
            setConversionDeleteType("");
        } else if (deleteId !== "" && conversionDeleteType === "PERCENT") {
            deletePercentConversion();
            setDeleteId("");
            setConversionDeleteType("");
        } else if (deleteId !== "" && conversionDeleteType === "FLAT") {
            deleteFlatConversion();
            setDeleteId("");
            setConversionDeleteType("");
        }
        // eslint-disable-next-line
    }, [deleteId, conversionDeleteType]);

    const [deleteActivityConversion] = useMutation(DELETE_ACITIVTY_CONVERSION, {
        variables: {
            id: deleteId,
        },
        update(cache, result) {
            delete Object.assign(result.data, {
                node: result.data["deleteConversionByActivity"],
            })["deleteConversionByActivity"];
            callBack(result?.data?.node?.program);
            toast.success("Conversion removed.");
        },
    });

    const [deleteTieredConversion] = useMutation(DELETE_TIERED_CONVERSION, {
        variables: {
            id: deleteId,
        },
        update(cache, result) {
            delete Object.assign(result.data, {
                node: result.data["deleteConversionTieredPercent"],
            })["deleteConversionTieredPercent"];
            callBack(result?.data?.node?.program);
            toast.success("Conversion removed.");
        },
    });

    const [deletePercentConversion] = useMutation(
        DELETE_FLAT_PERCENT_CONVERSION,
        {
            variables: {
                id: deleteId,
            },
            update(cache, result) {
                delete Object.assign(result.data, {
                    node: result.data["deleteConversionFlatPercent"],
                })["deleteConversionFlatPercent"];
                callBack(result?.data?.node?.program);
                toast.success("Conversion removed.");
            },
        }
    );

    const [deleteFlatConversion] = useMutation(DELETE_FLAT_PAYMENT_CONVERSION, {
        variables: {
            id: deleteId,
        },
        update(cache, result) {
            delete Object.assign(result.data, {
                node: result.data["deleteConversionFlatPayment"],
            })["deleteConversionFlatPayment"];
            callBack(result?.data?.node?.program);
            toast.success("Conversion removed.");
        },
    });

    const handleRowChange = (id, e) => {
        const { name, value } = e.target;
        if (tableAddresses) {
            setTableAddresses({
                ...tableAddresses,
                [id]: {
                    ...tableAddresses[id],
                    [name]: parseFloat(value),
                },
            });
        } else {
            setTableAddresses({
                ...tableAddresses,
                [id]: {
                    [name]: parseFloat(value),
                },
            });
        }
    };

    const addProduct = (id) => {
        if (
            !(selectedProducts?.findIndex((element) => element?.id === id) >= 0)
        ) {
            setSelectedProducts([...selectedProducts, { id: id }]);
        }
    };

    const removeFromSelected = (id) => {
        setSelectedProducts(selectedProducts.filter((item) => item?.id !== id));
    };

    const renderTieredComponent = () => {
        let items = [];
        for (let i = 0; i < numberOfTiers; i++) {
            items.push(
                <div className=" flex space-x-5 items-start  px-4 py-1 pb-4">
                    <label
                        className="block text-md font-medium mt-2 text-secondary"
                        htmlFor="bonus_amount"
                    >
                        Bonus is{" "}
                    </label>
                    <div className="relative">
                        <input
                            style={{ maxWidth: "5rem" }}
                            type="number"
                            name="bonus_amount"
                            value={
                                tableAddresses &&
                                tableAddresses[i] &&
                                tableAddresses?.[i]?.bonus_amount
                            }
                            id="bonus_amount"
                            onChange={(e) => handleRowChange(i, e)}
                            className="focus:outline-none input-no-error w-16 pl-5 sm:text-sm  rounded-md"
                            placeholder="1"
                        />
                        <span className={`absolute inset-y-0 left-0   pl-2 flex items-center text-sm text-secondary pointer-events-none" style={{paddingBottom:"1px",}}`}>
                            %
                        </span>
                        {parseFloat(tableAddresses?.[i]?.bonus_amount) < 0 ||
                            tableAddresses === undefined ||
                            tableAddresses[i] === undefined ||
                            isNaN(tableAddresses?.[i]?.bonus_amount) ? (
                            <p className="self-start absolute w-36 text-xs text-brickRed font-medium">
                                Enter a valid amount
                            </p>
                        ) : null}
                    </div>
                    <label
                        className="block text-md mt-2 font-medium text-secondary"
                        htmlFor="spend_exceed"
                    >
                        If spend exceeds
                    </label>
                    <div className="relative">
                        <InputDecimal
                            name="spend_exceed"
                            id="spend_exceed"
                            value={
                                typeof tableAddresses?.[i]?.spend_exceed === "number" ? tableAddresses?.[i]?.spend_exceed?.toFixed(2) : tableAddresses?.[i]?.spend_exceed
                            }
                            onChangeFunction={(e) => handleRowChange(i, e)}
                            className="focus:outline-none input-no-error w-24 pl-5 sm:text-sm  rounded-md"
                            placeholder="500.00"
                        />
                        <span className={`absolute inset-y-0 left-0 pl-2 flex items-center text-sm text-secondary pointer-events-none" style={{paddingBottom:"1px",}}`}>
                            $
                        </span>
                        {parseFloat(tableAddresses?.[i]?.spend_exceed) < 0 ||
                            tableAddresses === undefined ||
                            tableAddresses[i] === undefined ||
                            isNaN(tableAddresses?.[i]?.spend_exceed) ? (
                            <p className="self-start absolute w-36  text-xs text-brickRed font-medium">
                                Enter a valid amount
                            </p>
                        ) : null}
                    </div>
                </div>
            );
        }
        return items;
    };

    const modifiers = {
        selected: anticipatedPaymentDate,
    };

    const clockStartModifiers = {
        selectedclockStart: clockStartDate,
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
            <div
                className={classNames.overlayWrapper}
                style={{ marginBottom: 150 }}
                {...props}
            >
                <div className={classNames.overlay}>{children}</div>
            </div>
        );
    }

    const handleEditFlatPayment = (node) => {
        setEdit(true);
        setShowSelection(true);
        setConversionType("FLAT");
        setFields({
            ...fields,
            id: node?.id,
            conversionName: node?.name,
            conversionAmount: node?.amount,
        });
        setAnticipatedPaymentDate(toDateAdd(node?.anticipated_payment_date));
    };

    const handleEditFlatPercentPayment = (node) => {
        setEdit(true);
        setShowSelection(true);
        setAnticipatedPaymentDate(toDateAdd(node?.anticipated_payment_date));
        setClockStartDate(toDateAdd(node?.clock_start));
        setConversionType("PERCENT");
        setTimeRange(node?.spend_time_range);
        setFields({
            ...fields,
            id: node?.id,
            conversionName: node?.name,
            bonus_percent: node?.bonus_percent,
            max_amount: node?.max_amount,
            conversionAmount: node?.amount,
        });
    };

    const handleEditTieredPayment = (node) => {
        setEdit(true);
        setShowSelection(true);
        setAnticipatedPaymentDate(toDateAdd(node?.anticipated_payment_date));
        setClockStartDate(toDateAdd(node?.clock_start));
        setConversionType("TIERED");
        setTimeRange(node?.spend_time_range);
        setNumberOfTiers(node?.tiers?.edges?.length);
        prepopulateTiers(node?.tiers?.edges);
        setTimeRange(node?.valid_period);
        setFields({
            ...fields,
            id: node?.id,
            conversionName: node?.name,
            bonus_percent: node?.bonus_percent,
            max_amount: node?.max_amount,
            conversionAmount: node?.amount,
        });
    };

    const handleEditActivityPayment = (node) => {
        setEdit(true);
        setShowSelection(true);
        setConversionType("BY_ACTIVITY");
        setMeasureUnit(node?.measure_unit);
        setFields({
            ...fields,
            id: node?.id,
            conversionName: node?.name,
            bonus_percent: node?.bonus_percent,
            max_amount: node?.max_amount,
            conversionAmount: node?.amount,
            trigger_amount: node?.trigger_amount,
            bonus_name: node?.bonus_name,
            bonus_amount: node?.bonus_amount,
            residential_bonus_amount: node?.residential_bonus_amount,
            commercial_bonus_amount: node?.commercial_bonus_amount,
            multi_unit_bonus_amount: node?.multi_unit_bonus_amount,
        });
        setWhatHappens(node?.bonus_type);
        prepopulateSelectedProducts(node?.products?.edges);
        setProductsIncluded(node?.product_included);
    };

    const prepopulateTiers = (items) => {
        let object = {};
        // eslint-disable-next-line
        items?.map((item, index) => {
            object[index] = {
                id: item?.node?.id,
                note: item?.node?.note,
                bonus_amount: item?.node?.bonus_amount,
                spend_exceed: item?.node?.spend_exceed,
            };
        });
        setTableAddresses(object);
    };


    const prepopulateSelectedProducts = (items) => {
        let values = items?.map((item) => {
            let object = {};
            object.id = item?.node?.id;
            return object;
        });
        setSelectedProducts(values);
    };

    const handleCreate = () => {
        setFields(defaultState);
        setAnticipatedPaymentDate(new Date());
        setClockStartDate(new Date());
        setNumberOfTiers(0);
        setShowSelection(true);
        setSelectedProducts([]);
        setConversionType("FLAT");
        setMeasureUnit("MONEY");
        setProductsIncluded("ALL");
        setEdit(false);
    };

    const conversionListComponents = () => {
        return (
            <div className=" border-gray-300 pt-1">
                {program?.conversionFlatPayment?.edges?.length > 0 ? (
                    <div className="px-6 border-t-gray-500 border-b">
                        <span className=" font-title text-md text-secondary text-md font-semibold">
                            Flat Payments
                        </span>
                        <div className="flex flex-col px-4">
                            {program?.conversionFlatPayment?.edges?.map(
                                (item, index) => {
                                    return (
                                        <div
                                            className=""
                                            onClick={() =>
                                                handleEditFlatPayment(
                                                    item?.node
                                                )
                                            }
                                        >
                                            <div
                                                className={`flex flex-col items-start py-1  text-md text-darkgray75 font-semibold hover:text-gray-500 cursor-pointer w-full `}
                                            >
                                                <div className="  flex items-center w-full relative space-x-4">
                                                    <p className="w-full">
                                                        {item?.node?.name}
                                                    </p>
                                                    <p className="w-full">
                                                        {formatterForCurrency.format(item?.node?.amount)}
                                                    </p>
                                                    <p className="w-full">
                                                        {getFormattedDate(new Date(item?.node?.updated_at))}
                                                    </p>
                                                    <div
                                                        className="absolute right-0 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteId(
                                                                item?.node?.id
                                                            );
                                                            setConversionDeleteType(
                                                                "FLAT"
                                                            );
                                                        }}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            class="w-6 text-brickRed"
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
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                ) : null}
                {program?.conversionFlatPercent?.edges?.length > 0 ? (
                    <div className="px-6  pt-3 border-b">
                        <span className=" font-title text-md text-secondary text-md font-semibold">
                            Annual Flat Spend Bonus
                        </span>
                        <div className="flex flex-col px-4">
                            {program?.conversionFlatPercent?.edges?.map(
                                (item, index) => {
                                    return (
                                        <div
                                            onClick={() =>
                                                handleEditFlatPercentPayment(
                                                    item?.node
                                                )
                                            }
                                        >
                                            <div
                                                className={`flex flex-col items-start  py-1 text-md text-darkgray75 font-semibold hover:text-gray-500 cursor-pointer  w-full`}
                                            >
                                                <div className="flex items-center w-full space-x-4 relative">
                                                    <p className="w-full">
                                                        {item?.node?.name}
                                                    </p>
                                                    <p className="w-full">
                                                        {
                                                            item?.node
                                                                ?.bonus_percent
                                                        }
                                                        %
                                                    </p>
                                                    <p className="w-full">
                                                        {getFormattedDate(new Date(item?.node?.updated_at))}
                                                    </p>
                                                    <div
                                                        className="absolute right-0 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteId(
                                                                item?.node?.id
                                                            );
                                                            setConversionDeleteType(
                                                                "PERCENT"
                                                            );
                                                        }}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            class="w-6 text-brickRed"
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
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                ) : null}
                {program?.conversionTieredPercent?.edges?.length > 0 ? (
                    <div className="px-6 pt-3 border-b ">
                        <span className=" font-title  text-md text-secondary text-md font-semibold">
                            Tiered Bonus
                        </span>
                        <div className="flex flex-col px-4">
                            {program?.conversionTieredPercent?.edges?.map(
                                (item, index) => {
                                    return (
                                        <div
                                            onClick={() =>
                                                handleEditTieredPayment(
                                                    item?.node
                                                )
                                            }
                                        >
                                            <div
                                                className={`flex flex-col items-start  py-1  text-md text-darkgray75 font-semibold hover:text-gray-500 cursor-pointer w-full`}
                                            >
                                                <div className="  flex items-center space-x-4 w-full relative">
                                                    <p className="w-full">
                                                        {item?.node?.name}
                                                    </p>
                                                    <p className="w-full">
                                                        {Math.min(
                                                            ...item?.node?.tiers?.edges?.map(
                                                                (item) =>
                                                                    item?.node
                                                                        ?.bonus_amount
                                                            )
                                                        )}
                                                        % -{" "}
                                                        {Math.max(
                                                            ...item?.node?.tiers?.edges?.map(
                                                                (item) =>
                                                                    item?.node
                                                                        ?.bonus_amount
                                                            )
                                                        )}
                                                        %
                                                    </p>
                                                    <p className="w-full">
                                                        {getFormattedDate(new Date(item?.node?.updated_at))}
                                                    </p>
                                                    <div
                                                        className="absolute right-0 cursor-pointer"
                                                        onClick={() => {
                                                            setDeleteId(
                                                                item?.node?.id
                                                            );
                                                            setConversionDeleteType(
                                                                "TIERED"
                                                            );
                                                        }}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            class="w-6 text-brickRed"
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
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                ) : null}
                {program?.conversionByActivity?.edges?.length > 0 ? (
                    <div className="px-6 pt-3">
                        <span className=" font-title text-md text-secondary text-md font-semibold">
                            Activity Spend Bonus
                        </span>
                        <div className="flex flex-col px-4">
                            {program?.conversionByActivity?.edges?.map(
                                (item, index) => {
                                    return (
                                        <div
                                            onClick={() =>
                                                handleEditActivityPayment(
                                                    item?.node
                                                )
                                            }
                                        >
                                            <div
                                                className={`flex flex-col items-start  py-1 text-md text-darkgray75 font-semibold hover:text-gray-500 cursor-pointer  w-full`}
                                            >
                                                <div className="  flex items-center w-full space-x-4 relative">
                                                    <p className="w-full">
                                                        {item?.node?.name}
                                                    </p>
                                                    <p className="w-full">
                                                        {item?.node
                                                            ?.bonus_type ===
                                                            "REBATE_PERCENT_INCREASE" &&
                                                            item?.node
                                                                ?.measure_unit ===
                                                            "MONEY"
                                                            ? item?.node
                                                                ?.bonus_amount +
                                                            "%"
                                                            : null}
                                                        {item?.node
                                                            ?.bonus_type ===
                                                            "FLAT_AMOUNT" &&
                                                            item?.node
                                                                ?.measure_unit ===
                                                            "MONEY"
                                                            ?
                                                            formatterForCurrency.format(item?.node
                                                                ?.bonus_amount)
                                                            : null}
                                                        {item?.node
                                                            ?.bonus_type ===
                                                            "REBATE_AMOUNT_INCREASE_PER_UNIT" &&
                                                            item?.node
                                                                ?.measure_unit ===
                                                            "PRODUCT"
                                                            ?
                                                            formatterForCurrency.format(item?.node
                                                                ?.residential_bonus_amount) +
                                                            ", " +
                                                            formatterForCurrency.format(item?.node
                                                                ?.commercial_bonus_amount) +
                                                            ", " +
                                                            formatterForCurrency.format(item?.node
                                                                ?.multi_unit_bonus_amount)
                                                            : null}
                                                        {item?.node
                                                            ?.product_included ===
                                                            "SPECIFICS" &&
                                                            item?.node
                                                                ?.bonus_type ===
                                                            "FLAT_AMOUNT" &&
                                                            item?.node
                                                                ?.measure_unit ===
                                                            "PRODUCT"
                                                            ?
                                                            formatterForCurrency.format(item?.node
                                                                ?.bonus_amount) +
                                                            " (Product)"
                                                            : null}
                                                        {item?.node
                                                            ?.product_included ===
                                                            "ALL" &&
                                                            item?.node
                                                                ?.bonus_type ===
                                                            "FLAT_AMOUNT" &&
                                                            item?.node
                                                                ?.measure_unit ===
                                                            "PRODUCT"
                                                            ?
                                                            formatterForCurrency.format(item?.node
                                                                ?.bonus_amount)
                                                            : null}

                                                        {item?.node
                                                            ?.measure_unit ===
                                                            "PROPERTY" &&
                                                            item?.node
                                                                ?.bonus_type ===
                                                            "REBATE_AMOUNT_INCREASE_PER_UNIT"
                                                            ?
                                                            formatterForCurrency.format(item?.node
                                                                ?.residential_bonus_amount) +
                                                            ", " +
                                                            formatterForCurrency.format(item?.node
                                                                ?.commercial_bonus_amount) +
                                                            ", " +
                                                            formatterForCurrency.format(item?.node
                                                                ?.multi_unit_bonus_amount)
                                                            : null}
                                                        {item?.node
                                                            ?.measure_unit ===
                                                            "PROPERTY" &&
                                                            item?.node
                                                                ?.bonus_type ===
                                                            "FLAT_AMOUNT"
                                                            ?
                                                            formatterForCurrency.format(item?.node
                                                                ?.bonus_amount)
                                                            : null}
                                                    </p>

                                                    <p className="w-full">
                                                        {getFormattedDate(new Date(item?.node?.updated_at))}
                                                    </p>
                                                    <div
                                                        className="absolute right-0 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteId(
                                                                item?.node?.id
                                                            );
                                                            setConversionDeleteType(
                                                                "ACTIVITY"
                                                            );
                                                        }}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            class="w-6 text-brickRed"
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
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                ) : null}
                {program?.conversionFlatPayment?.edges?.length === 0 &&
                    program?.conversionFlatPercent?.edges?.length === 0 &&
                    program?.conversionTieredPercent?.edges?.length === 0 &&
                    program?.conversionByActivity?.edges?.length === 0 ? (
                    <div className="font-title text-gray-500 py-1 text-start px-4 h2">
                        <p>No conversions found.</p>
                    </div>
                ) : null}
            </div>
        );
    };

    const renderAmountError = (type) => {
        if (conversionErrors?.bonus_percent && type === "amount") {
            return (
                <p className="self-start  text-xs text-brickRed font-medium">
                    Enter a valid amount
                </p>
            );
        }
        if (conversionErrors?.trigger_amount && type === "triggerAmount") {
            return (
                <p className="self-start  text-xs text-brickRed font-medium">
                    Enter a valid amount
                </p>
            );
        }
        if (conversionErrors?.bonus_amount && type === "bonus_amount") {
            return (
                <p className="self-start  text-xs text-brickRed font-medium">
                    Enter a valid amount
                </p>
            );
        }
        if (
            (whatHappens === "" || whatHappens === undefined) &&
            type === "bonusType"
        ) {
            return (
                <p className="self-start mt-3 text-xs text-brickRed font-medium">
                    Select Bonus Type
                </p>
            );
        }
        if (
            (whatHappens === "" || whatHappens === undefined) &&
            type === "bonusType"
        ) {
            return (
                <p className="self-start mt-3 text-xs text-brickRed font-medium">
                    Select Bonus Type
                </p>
            );
        }
        if (
            (whatHappens === "" || whatHappens === undefined) &&
            type === "bonusType"
        ) {
            return (
                <p className="self-start mt-3  text-xs text-brickRed font-medium">
                    Select Bonus Type
                </p>
            );
        }
        if (
            conversionErrors?.residential_bonus_amount &&
            type === "residential_bonus_amount"
        ) {
            return (
                <p className="self-start  text-xs text-brickRed font-medium -mb-4">
                    Enter a valid amount
                </p>
            );
        }
        if (
            conversionErrors?.commercial_bonus_amount &&
            type === "commercial_bonus_amount"
        ) {
            return (
                <p className="self-start  text-xs text-brickRed font-medium -mb-4">
                    Enter a valid amount
                </p>
            );
        }
        if (
            conversionErrors?.multi_unit_bonus_amount &&
            type === "multi_unit_bonus_amount"
        ) {
            return (
                <p className="self-start  text-xs text-brickRed font-medium -mb-4">
                    Enter a valid amount
                </p>
            );
        }
    };

    const measureUnitMoneyRender = () => {
        return (
            <div className="flex space-x-5 items-start px-4 py-3 border-b">
                <div className="block text-secondary mt-2 font-sm font-medium">
                    What Happens?
                </div>
                <div className="flex items-center">
                    <div className="mr-5 flex space-x-5 items-start mt-2">
                        {whatHappensOptions.slice(0, 2).map((item, index) => {
                            return (
                                <div className=" flex flex-col" key={index}>
                                    <label className="flex items-center ">
                                        <input
                                            type="radio"
                                            name={item.name}
                                            value={item.name}
                                            className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                            checked={whatHappens === item.name}
                                            onChange={handleWhatHappens}
                                        ></input>
                                        <span className="ml-2 text-sm  text-secondary">
                                            {item.label}
                                        </span>
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                    {renderAmountError("bonusType")}
                </div>
                <div className="flex space-x-5">
                    {whatHappens === "FLAT_AMOUNT" &&
                        measureUnit === "MONEY" ? (
                        <>
                            <div className="flex items-start space-x-5">
                                <label
                                    className="text-md  mt-2 font-medium text-secondary"
                                    htmlFor="bonus_name"
                                >
                                    Payment Amount
                                </label>
                                <div className="flex flex-col relative">
                                    <InputDecimal
                                        id="bonus_amount"
                                        onChangeFunction={handleChange}
                                        value={typeof fields?.bonus_amount === "number" ? fields?.bonus_amount?.toFixed(2) : fields?.bonus_amount}
                                        name="bonus_amount"
                                        placeholder="500.00"
                                        className={` block input-no-error w-20 focus:outline-none pl-5 shadow-sm sm:text-sm rounded-md`}
                                    />
                                    <span className={`absolute inset-y-0 left-0 bottom-0 pl-2 ${conversionErrors?.bonus_amount ? "pb-5" : ""} flex items-center text-sm text-secondary pointer-events-none" style={{paddingBottom:"1px",}}`}>
                                        $
                                    </span>
                                    {renderAmountError("bonus_amount")}
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
                {whatHappens === "REBATE_PERCENT_INCREASE" &&
                    measureUnit === "MONEY" ? (
                    <>
                        <div className="flex items-center space-x-5">
                            <div className="flex flex-col">
                                <label
                                    className="text-md   font-medium text-secondary"
                                    htmlFor="bonus_amount"
                                >
                                    New Rebate
                                </label>
                                <span className="text-sm font-body text-darkgray75">
                                    Current Rebate :{" "}
                                    %{program.volume_bbg_rebate}
                                </span>
                            </div>
                            <div className="flex flex-col relative">
                                <input
                                    id="bonus_amount"
                                    onChange={handleChange}
                                    value={fields?.bonus_amount}
                                    name="bonus_amount"
                                    placeholder="5"
                                    type="number"
                                    className={` block input-no-error w-20 focus:outline-none pl-5 shadow-sm sm:text-sm rounded-md`}
                                />
                                <span className={`absolute inset-y-0 left-0 bottom-0 pl-2 ${conversionErrors?.bonus_amount ? "pb-5" : ""} flex items-center text-sm text-secondary pointer-events-none" style={{paddingBottom:"1px",}}`}>
                                    %
                                </span>
                                {renderAmountError("bonus_amount")}
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        );
    };

    const measureUnitProductRender = () => {
        return (
            <>
                <div className="flex space-x-5 items-start py-3 px-4 border-b">
                    <div className=" flex space-x-5 mt-2 items-start">
                        <div className="block text-secondary font-sm font-medium ">
                            Products Included
                        </div>
                        <div className="mr-5 flex space-x-5 items-start">
                            {productIncludedTypeOptions
                                .slice(0, 2)
                                .map((item, index) => {
                                    return (
                                        <div className="" key={index}>
                                            <label className="flex items-center ">
                                                <input
                                                    type="radio"
                                                    name={item.name}
                                                    value={item.name}
                                                    className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                    checked={
                                                        productsIncluded ===
                                                        item.name
                                                    }
                                                    onChange={
                                                        handleProductsIncluded
                                                    }
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
                    {productsIncluded !== "SPECIFICS" ? (
                        <div className="flex space-x-5">
                            {measureUnit === "PRODUCT" ? (
                                <div className="flex items-start space-x-5">
                                    <label
                                        className="text-md mt-2  font-medium text-secondary"
                                        htmlFor="trigger_amount"
                                    >
                                        Trigger Number/Qty
                                    </label>
                                    <div className="flex flex-col">
                                        <input
                                            id="trigger_amount"
                                            onChange={handleChange}
                                            value={fields?.trigger_amount}
                                            name="trigger_amount"
                                            placeholder="5"
                                            type="number"
                                            className={` block input-no-error w-20 focus:outline-none shadow-sm sm:text-sm rounded-md`}
                                        />

                                        {renderAmountError("triggerAmount")}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                    {productsIncluded === "SPECIFICS" ? (
                        <div className=" border rounded-lg flex flex-col flex-1 max-h-72 overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                            {program?.products?.edges?.map((item) => {
                                return (
                                    <div
                                        className={`flex px-4 items-center cursor-pointer py-2 border-b w-full ${selectedProducts?.findIndex(
                                            (element) =>
                                                element?.id ===
                                                item?.node?.id
                                        ) >= 0
                                            ? "border-l-gold border-l-6 "
                                            : "border-l-primary border-l-4"
                                            } `}
                                        onClick={() =>
                                            addProduct(item?.node?.id)
                                        }
                                    >
                                        <div className=" flex-1 flex">
                                            <div className=" w-full px-2 md:grid md:grid-cols-2  items-center">
                                                <div className="flex flex-col items-start">
                                                    <div className="flex flex-col text-xs text-gray-500 italic">
                                                        {item.node.category &&
                                                            item.node.category
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
                                                                {
                                                                    item?.node
                                                                        ?.bbg_product_code ?
                                                                        item?.node?.bbg_product_code + " - " : ""
                                                                }
                                                                {item?.node?.name}
                                                            </Link>
                                                        </p>
                                                    </div>
                                                    <div className=" flex flex-col text-xs text-gray-500">
                                                        {item.node &&
                                                            item.node
                                                                .programs &&
                                                            item.node.programs
                                                                .edges.length >
                                                            0 &&
                                                            item.node.programs.edges.map(
                                                                (program) => {
                                                                    return (
                                                                        <div className="flex flex-col">
                                                                            <span className="">
                                                                                {
                                                                                    program
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
                                                <div className="flex flex-col">
                                                    <p className="text-xs text-gray-500">{`Residential: ${formatterForCurrency.format(program?.global_product_residential_rebate_amount)}`}</p>
                                                    <p className="text-xs text-gray-500">{`Commercial: ${formatterForCurrency.format(program?.global_product_commercial_rebate_amount)}`}</p>
                                                    <p className="text-xs text-gray-500">{`Multi-Unit: ${formatterForCurrency.format(program?.global_product_multi_unit_rebate_amount)}`}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedProducts?.findIndex(
                                            (element) =>
                                                element?.id === item?.node?.id
                                        ) >= 0 ? (
                                            <div
                                                className="px-2"
                                                onClick={async () => {
                                                    await removeFromSelected(
                                                        item.node.id
                                                    );
                                                }}
                                            >
                                                <XCircleIcon className="w-8 h-8 text-brickRed" />
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}
                </div>

                <div className="flex items-start space-x-5 px-4 py-3 border-b">
                    {productsIncluded === "SPECIFICS" ? (
                        <>
                            <div className="flex items-start space-x-5">
                                <label
                                    className="text-md mt-2   font-medium text-secondary"
                                    htmlFor="trigger_amount"
                                >
                                    Trigger Number/Qty
                                </label>
                                <div>
                                    <input
                                        id="trigger_amount"
                                        onChange={handleChange}
                                        value={fields?.trigger_amount}
                                        name="trigger_amount"
                                        placeholder="5"
                                        type="number"
                                        className={` block input-no-error w-20 focus:outline-none shadow-sm sm:text-sm rounded-md`}
                                    />
                                    {renderAmountError("triggerAmount")}
                                </div>
                            </div>
                        </>
                    ) : null}
                    <div className="flex space-x-5 items-start">
                        <div className="block text-secondary mt-2 font-sm font-medium ">
                            Bonus Type
                        </div>
                        <div className="flex items-center">
                            <div className="mr-5 flex space-x-5">
                                {whatHappensOptions
                                    .slice(2, 4)
                                    .map((item, index) => {
                                        return (
                                            <div
                                                className="mt-2 flex flex-col "
                                                key={index}
                                            >
                                                <label className="inline-flex items-center ">
                                                    <input
                                                        type="radio"
                                                        name={item.name}
                                                        value={item.name}
                                                        className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                        checked={
                                                            whatHappens ===
                                                            item.name
                                                        }
                                                        onChange={
                                                            handleWhatHappens
                                                        }
                                                    />
                                                    <span className="ml-2 text-sm  text-secondary">
                                                        {item.label}
                                                    </span>
                                                </label>
                                            </div>
                                        );
                                    })}
                            </div>
                            {renderAmountError("bonusType")}
                        </div>
                    </div>
                    {whatHappens === "FLAT_AMOUNT" ? (
                        <div className="flex items-start px-4 space-x-5 ">
                            <label
                                className="text-md mt-2  font-medium text-secondary"
                                htmlFor="bonus_amount"
                            >
                                Bonus Amount
                            </label>
                            <div className="flex flex-col relative">
                                <InputDecimal
                                    id="bonus_amount"
                                    onChangeFunction={handleChange}
                                    value={typeof fields?.bonus_amount ? fields?.bonus_amount?.toFixed(2) : fields?.bonus_amount}
                                    name="bonus_amount"
                                    placeholder="500.00"
                                    className={` block input-no-error w-20 focus:outline-none pl-5 shadow-sm sm:text-sm rounded-md`}
                                />
                                <span className={`absolute inset-y-0 left-0 pb-5   pl-2 flex items-center text-sm text-secondary pointer-events-none" `}>
                                    $
                                </span>
                                {renderAmountError("bonus_amount")}
                            </div>
                        </div>
                    ) : null}
                </div>

                {whatHappens === "REBATE_AMOUNT_INCREASE_PER_UNIT" ? (
                    <div className="flex items-center space-x-5 px-4 py-3">
                        <div className="flex items-start space-x-5 ">
                            <div className="flex flex-col">
                                <label
                                    className="text-md   font-medium text-secondary"
                                    htmlFor="residential_bonus_amount"
                                >
                                    New Total Residential Unit Rebate
                                </label>
                                <span className="text-sm font-body text-darkgray75">
                                    Current Total Residential Property Rebate:
                                    {
                                        formatterForCurrency.format(program?.global_product_residential_rebate_amount)
                                    }
                                </span>
                            </div>
                            <div className="flex flex-col pb-5 relative">
                                <InputDecimal
                                    id="residential_bonus_amount"
                                    onChangeFunction={handleChange}
                                    value={typeof fields?.residential_bonus_amount ? fields?.residential_bonus_amount?.toFixed(2) : fields?.residential_bonus_amount}
                                    name="residential_bonus_amount"
                                    placeholder="500.00"
                                    className={` block input-no-error w-20 focus:outline-none pl-5 shadow-sm sm:text-sm rounded-md`}
                                />
                                <span className={`absolute inset-y-0 left-0 pb-5   pl-2 flex items-center text-sm text-secondary pointer-events-none" style={{paddingBottom:"1px",}}`}>
                                    $
                                </span>
                                {renderAmountError("residential_bonus_amount")}
                            </div>
                        </div>

                        <div className="flex items-start   space-x-5">
                            <div className="flex flex-col">
                                <label
                                    className="text-md   font-medium text-secondary"
                                    htmlFor="commercial_bonus_amount"
                                >
                                    New Total Commercial Unit Rebate
                                </label>
                                <span className="text-sm font-body text-darkgray75">
                                    Current Total Commercial Property Rebate:
                                    {
                                        formatterForCurrency.format(program?.global_product_commercial_rebate_amount)
                                    }
                                </span>
                            </div>
                            <div className="flex flex-col pb-5 relative ">
                                <InputDecimal
                                    id="commercial_bonus_amount"
                                    onChangeFunction={handleChange}
                                    value={typeof fields?.commercial_bonus_amount === "number" ? fields?.commercial_bonus_amount?.toFixed(2) : fields?.commercial_bonus_amount}
                                    name="commercial_bonus_amount"
                                    placeholder="500.00"
                                    className={` block input-no-error w-20 focus:outline-none pl-5 shadow-sm sm:text-sm rounded-md`}
                                />
                                <span className={`absolute inset-y-0 left-0 pb-5   pl-2 flex items-center text-sm text-secondary pointer-events-none" `}>
                                    $
                                </span>
                                {renderAmountError("commercial_bonus_amount")}
                            </div>
                        </div>
                        <div className="flex items-start  space-x-5">
                            <div className="flex flex-col">
                                <label
                                    className="text-md   font-medium text-secondary"
                                    htmlFor="multi_unit_bonus_amount"
                                >
                                    New Total Multi-Unit Unit Rebate
                                </label>
                                <span className="text-sm font-body text-darkgray75">
                                    Current Total Multi-Unit Property Rebate:
                                    {
                                        formatterForCurrency.format(program?.global_product_multi_unit_rebate_amount)
                                    }
                                </span>
                            </div>
                            <div className="flex flex-col pb-5 relative">
                                <InputDecimal
                                    id="multi_unit_bonus_amount"
                                    onChangeFunction={handleChange}
                                    value={typeof fields?.multi_unit_bonus_amount ? fields?.multi_unit_bonus_amount?.toFixed(2) : fields?.multi_unit_bonus_amount}
                                    name="multi_unit_bonus_amount"
                                    placeholder="500.00"
                                    className={`block input-no-error w-20 focus:outline-none pl-5 shadow-sm sm:text-sm rounded-md`}
                                />
                                <span className={`absolute inset-y-0 left-0 pb-5   pl-2 flex items-center text-sm text-secondary pointer-events-none" `}>
                                    $
                                </span>
                                {renderAmountError("multi_unit_bonus_amount")}
                            </div>
                        </div>
                    </div>
                ) : null}
            </>
        );
    };

    const measureUnitPropertyRender = () => {
        return (
            <>
                <div className="flex items-start px-4 py-3 border-b space-x-5">
                    <div className="flex items-start  space-x-5">
                        <label
                            className="text-md mt-2   font-medium text-secondary"
                            htmlFor="trigger_amount"
                        >
                            Trigger Property Count
                        </label>
                        <div className="flex flex-col">
                            <input
                                id="trigger_amount"
                                onChange={handleChange}
                                value={fields?.trigger_amount}
                                name="trigger_amount"
                                placeholder="5"
                                type="number"
                                className={` block input-no-error w-20 focus:outline-none shadow-sm sm:text-sm rounded-md`}
                            />
                            {renderAmountError("triggerAmount")}
                        </div>
                    </div>
                    <div className="flex space-x-5 items-start">
                        <div className="block text-secondary mt-2  font-sm font-medium ">
                            Bonus Type
                        </div>
                        <div className="flex items-center">
                            <div className="mr-5 flex space-x-5 mt-2">
                                {whatHappensOptions
                                    .slice(2, 4)
                                    .map((item, index) => {
                                        return (
                                            <div
                                                className=" flex flex-col"
                                                key={index}
                                            >
                                                <label className="flex items-center ">
                                                    <input
                                                        type="radio"
                                                        name={item.name}
                                                        value={item.name}
                                                        className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                        checked={
                                                            whatHappens ===
                                                            item.name
                                                        }
                                                        onChange={
                                                            handleWhatHappens
                                                        }
                                                    ></input>
                                                    <span className="ml-2 text-sm  text-secondary">
                                                        {item.label}
                                                    </span>
                                                </label>
                                            </div>
                                        );
                                    })}
                            </div>
                            {renderAmountError("bonusType")}
                        </div>
                    </div>
                    {whatHappens === "FLAT_AMOUNT" &&
                        measureUnit === "PROPERTY" ? (
                        <>
                            <div className="flex items-start  space-x-5">
                                <label
                                    className="text-md  mt-2 font-medium text-secondary"
                                    htmlFor="bonus_amount"
                                >
                                    Bonus Amount
                                </label>
                                <div className="relative">
                                    <InputDecimal
                                        id="bonus_amount"
                                        onChangeFunction={handleChange}
                                        value={typeof fields?.bonus_amount ? fields?.bonus_amount?.toFixed(2) : fields?.bonus_amount}
                                        name="bonus_amount"
                                        placeholder="5.00"
                                        className={` block input-no-error w-20 focus:outline-none pl-5 shadow-sm sm:text-sm rounded-md`}
                                    />
                                    <span className={`absolute inset-y-0 left-0 pb-5   pl-2 flex items-center text-sm text-secondary pointer-events-none" `}>
                                        $
                                    </span>
                                    {renderAmountError("bonus_amount")}
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>

                {whatHappens === "REBATE_AMOUNT_INCREASE_PER_UNIT" &&
                    measureUnit === "PROPERTY" ? (
                    <div className="flex items-center space-x-5 px-4 py-3">
                        <div className="flex items-start space-x-5 ">
                            <div className="flex flex-col">
                                <label
                                    className="text-md   font-medium text-secondary"
                                    htmlFor="residential_bonus_amount"
                                >
                                    New Total Residential Unit Rebate
                                </label>
                                <span className="text-sm font-body text-darkgray75">
                                    Current Total Residential Property Rebate:
                                    {
                                        program?.global_product_residential_rebate_amount
                                    }
                                </span>
                            </div>
                            <div className="flex flex-col pb-5 relative">
                                <InputDecimal
                                    id="residential_bonus_amount"
                                    onChangeFunction={handleChange}
                                    value={typeof fields?.residential_bonus_amount ? fields?.residential_bonus_amount?.toFixed(2) : fields?.residential_bonus_amount}
                                    name="residential_bonus_amount"
                                    placeholder="500.00"
                                    className={` block input-no-error w-20 focus:outline-none pl-5 shadow-sm sm:text-sm rounded-md`}
                                />
                                <span className={`absolute inset-y-0 left-0 pb-5   pl-2 flex items-center text-sm text-secondary pointer-events-none" `}>
                                    $
                                </span>
                                {renderAmountError("residential_bonus_amount")}
                            </div>
                        </div>

                        <div className="flex items-start   space-x-5">
                            <div className="flex flex-col">
                                <label
                                    className="text-md   font-medium text-secondary"
                                    htmlFor="commercial_bonus_amount"
                                >
                                    New Total Commercial Unit Rebate
                                </label>
                                <span className="text-sm font-body text-darkgray75">
                                    Current Total Commercial Property Rebate:
                                    {
                                        program?.global_product_commercial_rebate_amount
                                    }
                                </span>
                            </div>
                            <div className="flex flex-col pb-5 relative">
                                <InputDecimal
                                    id="commercial_bonus_amount"
                                    onChangeFunction={handleChange}
                                    value={typeof fields?.commercial_bonus_amount === "number" ? fields?.commercial_bonus_amount?.toFixed(2) : fields?.commercial_bonus_amount}
                                    name="commercial_bonus_amount"
                                    placeholder="500.00"
                                    className={` block input-no-error w-20 focus:outline-none pl-5 shadow-sm sm:text-sm rounded-md`}
                                />
                                <span className={`absolute inset-y-0 left-0 pb-5   pl-2 flex items-center text-sm text-secondary pointer-events-none" `}>
                                    $
                                </span>
                                {renderAmountError("commercial_bonus_amount")}
                            </div>
                        </div>
                        <div className="flex items-start  space-x-5">
                            <div className="flex flex-col">
                                <label
                                    className="text-md   font-medium text-secondary"
                                    htmlFor="multi_unit_bonus_amount"
                                >
                                    New Total Multi-Unit Unit Rebate
                                </label>
                                <span className="text-sm font-body text-darkgray75">
                                    Current Total Multi-Unit Property Rebate:
                                    {
                                        program?.global_product_multi_unit_rebate_amount
                                    }
                                </span>
                            </div>
                            <div className="flex flex-col pb-5 relative">
                                <InputDecimal
                                    id="multi_unit_bonus_amount"
                                    onChangeFunction={handleChange}
                                    value={typeof fields?.multi_unit_bonus_amount ? fields?.multi_unit_bonus_amount?.toFixed(2) : fields?.multi_unit_bonus_amount}
                                    name="multi_unit_bonus_amount"
                                    placeholder="500.00"
                                    className={`block input-no-error w-20 focus:outline-none pl-5 shadow-sm sm:text-sm rounded-md`}
                                />
                                <span className={`absolute inset-y-0 left-0 pb-5   pl-2 flex items-center text-sm text-secondary pointer-events-none" `}>
                                    $
                                </span>
                                {renderAmountError("multi_unit_bonus_amount")}
                            </div>
                        </div>
                    </div>
                ) : null}
            </>
        );
    };

    return (
        <div className="grid grid-cols-1 ">
            <div className="flex items-center w-full">
                <div className="w-full flex items-center border-b ">
                    <div className="w-full flex items-center">
                        <p className="px-4 text-md  font-title text-secondary font-bold py-3">
                            {showSelection
                                ? edit
                                    ? "Edit Conversion"
                                    : "New Conversion"
                                : "Existing Conversions"}
                        </p>
                        {showSelection === false || edit ? (
                            <PlusCircleIcon
                                className="text-brickGreen w-8 h-8 cursor-pointer"
                                onClick={() => handleCreate()}
                            />
                        ) : null}
                    </div>
                    {!showSelection ? (
                        <>
                            <p className=" text-md w-full  font-title text-secondary font-bold py-3">
                                Payment Amount
                            </p>
                            <p className=" text-md w-full font-title text-secondary font-bold py-3">
                                Last Edited
                            </p>
                        </>
                    ) : null}
                </div>
            </div>

            {!showSelection ? conversionListComponents() : null}

            {showSelection ? (
                <div className="flex flex-col">
                    <div className="flex px-4 space-x-10 py-3 border-t border-b">
                        <div className="flex items-start space-x-5">
                            <label
                                className="text-md font-medium text-secondary mt-2"
                                htmlFor="conversionName"
                            >
                                Name
                            </label>
                            <div className="flex flex-col">
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    name="conversionName"
                                    value={fields?.conversionName}
                                    placeholder="Conversion Name"
                                    id="conversionName"
                                    className={`${conversionErrors?.conversionName
                                        ? "input-error"
                                        : "input-no-error"
                                        } block w-96 focus:outline-none shadow-sm sm:text-sm rounded-md`}
                                />
                                {conversionErrors?.conversionName ? (
                                    <p className="self-start  text-xs text-brickRed font-medium">
                                        Enter a valid conversion name
                                    </p>
                                ) : null}
                            </div>
                        </div>


                    </div>
                    <div className="flex px-4 space-x-10 py-3 border-t border-b">
                        <div className="flex  items-start space-x-5">
                            <div className="block text-secondary col-span-1  font-sm font-medium mt-2">
                                Type
                            </div>
                            <div className="flex flex-col">
                                <div className="mr-5 flex space-x-5">
                                    {conversionTypeOptions.map(
                                        (item, index) => {
                                            return (
                                                <div
                                                    className="mt-2"
                                                    key={index}
                                                >
                                                    <label className="inline-flex items-center ">
                                                        <input
                                                            type="radio"
                                                            name={item.name}
                                                            value={item.name}
                                                            className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                            checked={
                                                                conversionType ===
                                                                item.name
                                                            }
                                                            onChange={
                                                                handleConversionTypeChange
                                                            }
                                                        />
                                                        <span className="ml-2 text-sm  text-secondary">
                                                            {item.label}
                                                        </span>
                                                    </label>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                                {conversionTypeError ? (
                                    <p className="self-start  text-xs text-brickRed font-medium">
                                        Select Valid Type
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    {conversionType === "FLAT" ? (
                        <div className="flex px-4 space-x-10 py-3 items-start ">
                            <div className="flex items-start space-x-5">
                                <label
                                    className="text-md mt-2   font-medium text-secondary"
                                    htmlFor="conversionAmount"
                                >
                                    Amount
                                </label>
                                <div className="relative">
                                    <InputDecimal
                                        onChangeFunction={handleChange}
                                        name="conversionAmount"
                                        value={typeof fields?.conversionAmount === "number" ? fields?.conversionAmount?.toFixed(2) : fields?.conversionAmount}
                                        placeholder="5000.00"
                                        id="conversionAmount"
                                        className={`${conversionErrors?.conversionAmount
                                            ? "input-error"
                                            : "input-no-error"
                                            } block w-28 focus:outline-none shadow-sm pl-4 sm:text-sm rounded-md`}
                                    />
                                    <span className="absolute inset-y-0 left-0 bottom-0 pl-2 flex items-center text-sm text-secondary pointer-events-none" style={{ paddingBottom: "1px", }}>
                                        $
                                    </span>
                                    {conversionErrors?.conversionAmount ? (
                                        <p className="self-start absolute  text-xs text-brickRed font-medium">
                                            Enter a valid amount
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex items-start space-x-5">
                                <label className="block text-md font-medium text-secondary mt-2">
                                    Anticipated Payment Date
                                </label>
                                <DayPickerInput
                                    value={anticipatedPaymentDate}
                                    inputProps={{
                                        style: {
                                            border:
                                                "1px solid rgba(212, 212, 216,1)",
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
                                        setAnticipatedPaymentDate(date);
                                    }}
                                />
                            </div>
                        </div>
                    ) : null}
                    {conversionType === "PERCENT" ? (
                        <div className="flex flex-col ">
                            <div className="flex items-start space-x-5 border-b px-4  py-3">
                                <div className="flex items-start space-x-5">
                                    <label
                                        className="text-md   font-medium text-secondary mt-2"
                                        htmlFor="bonus_percent"
                                    >
                                        Amount
                                    </label>
                                    <div className="flex flex-col relative">
                                        <input
                                            id="bonus_percent"
                                            onChange={handleChange}
                                            value={fields?.bonus_percent}
                                            name="bonus_percent"
                                            placeholder="2"
                                            type="number"
                                            className={` block input-no-error w-20 pl-5 focus:outline-none shadow-sm sm:text-sm rounded-md`}
                                        />
                                        <span className={`absolute inset-y-0 left-0 ${conversionErrors?.bonus_percent ? "pb-5" : "pb-0"}  pl-2 flex items-center text-sm text-secondary pointer-events-none" style={{paddingBottom:"1px",}}`}>
                                            %
                                        </span>
                                        {renderAmountError("amount")}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-5">
                                    <label
                                        className="text-md   font-medium text-secondary"
                                        htmlFor="max_amount"
                                    >
                                        Max Bonus
                                    </label>
                                    <div className="relative">
                                        <InputDecimal
                                            id="max_amount"
                                            onChangeFunction={handleChange}
                                            value={typeof fields?.max_amount === "number" ? fields?.max_amount?.toFixed(2) : fields?.max_amount}
                                            name="max_amount"
                                            placeholder="2.00"
                                            className={` block input-no-error w-20 pl-5 focus:outline-none shadow-sm sm:text-sm rounded-md`}
                                        />
                                        <span className={`absolute inset-y-0 left-0 pl-2 flex items-center text-sm text-secondary pointer-events-none" style={{paddingBottom:"1px",}}`}>
                                            $
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-5">
                                    <label className="block text-md font-medium text-secondary mt-2">
                                        Anticipated Payment Date
                                    </label>
                                    <div className="flex flex-col">
                                        <DayPickerInput
                                            value={anticipatedPaymentDate}
                                            inputProps={{
                                                style: {
                                                    border:
                                                        "1px solid rgba(212, 212, 216,1)",
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
                                                setAnticipatedPaymentDate(date);
                                            }}
                                        />
                                        {/* {conversionErrors?.anticipatedPaymentDate ? (
                                        <p className="self-start  text-xs text-brickRed font-medium">
                                            Enter a valid amount
                                        </p>
                                    ) : null} */}
                                    </div>
                                </div>
                            </div>

                            <div className="flex   items-start space-x-5 px-4  py-3">
                                <div className="flex items-start space-x-5">
                                    <div className="block text-secondary font-sm font-medium mt-2">
                                        Valid for Spend Period
                                    </div>

                                    <div className="mr-5 flex space-x-5 flex-row">
                                        {conversionTimeRanges.map(
                                            (item, index) => {
                                                return (
                                                    <div
                                                        className="mt-2"
                                                        key={index}
                                                    >
                                                        <label className="inline-flex items-center ">
                                                            <input
                                                                type="radio"
                                                                name={item.name}
                                                                value={
                                                                    item.name
                                                                }
                                                                className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                                checked={
                                                                    timeRange ===
                                                                    item.name
                                                                }
                                                                onChange={
                                                                    handleTimeRangeChanges
                                                                }
                                                            ></input>
                                                            <span className="ml-2 text-sm  text-secondary">
                                                                {item.label}
                                                            </span>
                                                        </label>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>

                                <div className="flex  items-start space-x-5">
                                    <label className="block text-md font-medium text-secondary mt-2">
                                        Clock Start{" "}
                                    </label>
                                    <DayPickerInput
                                        value={clockStartDate}
                                        inputProps={{
                                            style: {
                                                border:
                                                    "1px solid rgba(212, 212, 216,1)",
                                                borderRadius: "0.375rem",
                                                padding: "0.5rem 0.75rem",
                                                width: "130px",
                                                fontSize: ".875rem",
                                                cursor: "pointer",
                                            },
                                        }}
                                        overlayComponent={CustomOverlay}
                                        dayPickerProps={{
                                            modifiers: clockStartModifiers,
                                            modifiersStyles: modifiersStyles,
                                        }}
                                        onDayChange={(date) => {
                                            setClockStartDate(date);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}
                    {conversionType === "TIERED" ? (
                        <div className="">
                            <div className=" flex items-start px-4 space-x-5 py-3 border-b">
                                <div className="items-start flex space-x-5">
                                    <label className="block text-md font-medium text-secondary mt-2">
                                        Anticipated Payment Date
                                    </label>
                                    <div className="flex items-center col-span-2 space-x-5">
                                        <DayPickerInput
                                            value={anticipatedPaymentDate}
                                            inputProps={{
                                                style: {
                                                    border:
                                                        "1px solid rgba(212, 212, 216,1)",
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
                                                setAnticipatedPaymentDate(date);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-5">
                                    <label
                                        className="text-md   font-medium text-secondary"
                                        htmlFor="max_amount"
                                    >
                                        Max Bonus
                                    </label>
                                    <div className="relative">
                                        <InputDecimal
                                            id="max_amount"
                                            onChangeFunction={handleChange}
                                            value={typeof fields?.max_amount === "number" ? fields?.max_amount?.toFixed(2) : fields?.max_amount}
                                            name="max_amount"
                                            placeholder="500.00"
                                            className={` block input-no-error pl-5 w-20 focus:outline-none shadow-sm sm:text-sm rounded-md`}
                                        />
                                        <span className={`absolute inset-y-0 left-0   pl-2 flex items-center text-sm text-secondary pointer-events-none" style={{paddingBottom:"1px",}}`}>
                                            $
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start space-x-5 py-3 border-b">
                                <span
                                    className="text-secondary font-semibold font-title px-4 underline cursor-pointer "
                                    onClick={() =>
                                        setNumberOfTiers(numberOfTiers + 1)
                                    }
                                >
                                    Add a Tier
                                </span>
                                <div className="flex flex-col">
                                    {renderTieredComponent()}
                                </div>
                            </div>

                            <div className="flex items-start space-x-5 px-4 py-3 border-b">
                                <div className=" flex space-x-5 items-start">
                                    <div className="block text-secondary font-sm font-medium mt-2">
                                        Valid for Spend Period
                                    </div>
                                    <div className="mr-5 flex space-x-5">
                                        {conversionTimeRanges.map(
                                            (item, index) => {
                                                return (
                                                    <div
                                                        className="mt-2"
                                                        key={index}
                                                    >
                                                        <label className="inline-flex items-center ">
                                                            <input
                                                                type="radio"
                                                                name={item.name}
                                                                value={
                                                                    item.name
                                                                }
                                                                className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                                checked={
                                                                    timeRange ===
                                                                    item.name
                                                                }
                                                                onChange={
                                                                    handleTimeRangeChanges
                                                                }
                                                            ></input>
                                                            <span className="ml-2 text-sm  text-secondary">
                                                                {item.label}
                                                            </span>
                                                        </label>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                                <div className="flex space-x-5 items-start">
                                    <label className="block text-md font-medium text-secondary mt-2">
                                        Clock Start{" "}
                                    </label>
                                    <DayPickerInput
                                        value={clockStartDate}
                                        inputProps={{
                                            style: {
                                                border:
                                                    "1px solid rgba(212, 212, 216,1)",
                                                borderRadius: "0.375rem",
                                                padding: "0.5rem 0.75rem",
                                                width: "130px",
                                                fontSize: ".875rem",
                                                cursor: "pointer",
                                            },
                                        }}
                                        overlayComponent={CustomOverlay}
                                        dayPickerProps={{
                                            modifiers: clockStartModifiers,
                                            modifiersStyles: modifiersStyles,
                                        }}
                                        onDayChange={(date) => {
                                            setClockStartDate(date);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}
                    {conversionType === "BY_ACTIVITY" ? (
                        <div className="">
                            <div className="flex items-start space-x-5 px-4 py-3 border-b">
                                <div className=" flex space-x-5 items-start">
                                    <div className="block text-secondary mt-2 font-sm font-medium">
                                        What is the Unit of Measure?
                                    </div>
                                    <div className="mr-5 flex space-x-5">
                                        {conversionMeasureUnit.map(
                                            (item, index) => {
                                                return (
                                                    <div
                                                        className="mt-2"
                                                        key={index}
                                                    >
                                                        <label className="inline-flex items-center ">
                                                            <input
                                                                type="radio"
                                                                name={item.name}
                                                                value={
                                                                    item.name
                                                                }
                                                                className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                                checked={
                                                                    measureUnit ===
                                                                    item.name
                                                                }
                                                                onChange={
                                                                    handleMeasureUnit
                                                                }
                                                            />
                                                            <span className="ml-2 text-sm  text-secondary">
                                                                {item.label}
                                                            </span>
                                                        </label>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                                {measureUnit === "MONEY" ? (
                                    <div className="flex items-start space-x-5">
                                        <label
                                            className="text-md  mt-2 font-medium text-secondary"
                                            htmlFor="trigger_amount"
                                        >
                                            Trigger Amount
                                        </label>
                                        <div className="flex flex-col relative">
                                            <InputDecimal
                                                id="trigger_amount"
                                                onChangeFunction={handleChange}
                                                value={typeof fields?.trigger_amount === "number" ? fields?.trigger_amount?.toFixed(2) : fields?.trigger_amount}
                                                name="trigger_amount"
                                                placeholder="500.00"
                                                className={` block input-no-error w-20 focus:outline-none pl-5 shadow-sm sm:text-sm rounded-md`}
                                            />
                                            <span className={`absolute inset-y-0 left-0 ${conversionErrors?.trigger_amount ? "pb-5" : ""}   pl-2 flex items-center text-sm text-secondary pointer-events-none" style={{paddingBottom:"1px",}}`}>
                                                $
                                            </span>
                                            {renderAmountError("triggerAmount")}
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            {measureUnit === "MONEY"
                                ? measureUnitMoneyRender()
                                : null}

                            {measureUnit === "PRODUCT"
                                ? measureUnitProductRender()
                                : null}
                            {measureUnit === "PROPERTY"
                                ? measureUnitPropertyRender()
                                : null}
                        </div>
                    ) : null}
                    <div className="py-2 pr-5 flex  items-end justify-end">
                        <Button
                            color="primary"
                            title={"Cancel"}
                            onClick={() => setShowSelection(false)}
                        />
                        <Button
                            disabled={finalError}
                            color="primary"
                            title={edit ? "Save Updates" : "Save"}
                            onClick={() =>
                                edit ? updateConversion() : createConversion()
                            }
                        />
                    </div>
                    <div className="flex items-center w-full">
                        <div className="w-full flex items-center border-b border-t px-4">
                            <p className=" text-md w-full font-title text-secondary font-bold py-3">
                                Existing Conversions
                            </p>
                            <p className=" text-md w-full  font-title text-secondary font-bold py-3">
                                Payment Amount
                            </p>
                            <p className=" text-md w-full font-title text-secondary font-bold py-3">
                                Last Edited
                            </p>
                        </div>
                    </div>
                    {showSelection ? conversionListComponents() : null}
                </div>
            ) : null}
        </div>
    );
};

export default Conversions;
