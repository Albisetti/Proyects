import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_CONVERSION_PAYMENT } from "../../../../../lib/programs";
import Button from "../../../../Buttons";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { formatterForCurrency, getFormattedDate } from "../../../../../util/generic";
import TextField from "../../../../FormGroups/Input/TextField";
import Loader from "../../../../Loader/Loader";

const RevenueSection = ({ program, refetch, loading }) => {
    const toDate = (date) => {
        const date1 = new Date(date);
        let a = date1.getTimezoneOffset() * 60000;
        let b = new Date(date1.getTime() + a);
        return b;
    };

    const [conversionRevenueclicked, setConversionRevenueClicked] = useState(
        false
    );
    const [flatSpendBonusClicked, setFlatSpendBonusClicked] = useState(false);
    const [conversionId, setConversionId] = useState();
    const [annualConversionId, setAnnualConversionId] = useState();
    const [mutationConversionType, setMutationConversionType] = useState();
    const [
        annualMutationConversionType,
        setAnnualMutationConversionType,
    ] = useState();
    const [conversionPaymentFields, setConversionPaymentFields] = useState();
    const [
        conversionAnnualPaymentFields,
        setConversionAnnualPaymentFields,
    ] = useState();
    const [conversionPaymentDate, setConversionPaymentDate] = useState(
        new Date()
    );
    const [
        conversionAnnualPaymentDate,
        setConversionAnnualPaymentDate,
    ] = useState(new Date());
    const [
        callConversionPaymentMutation,
        setCallConversionPaymentMutation,
    ] = useState(false);
    const [
        callAnnualConversionPaymentMutation,
        setCallAnnualConversionPaymentMutation,
    ] = useState(false);

    useEffect(() => {
        if (callConversionPaymentMutation === true) {
            createConversionPayment();
        }
        // eslint-disable-next-line
    }, [callConversionPaymentMutation]);

    useEffect(() => {
        if (callAnnualConversionPaymentMutation === true) {
            createAnnualConversionPayment();
        }
        // eslint-disable-next-line
    }, [callAnnualConversionPaymentMutation]);

    const handleConversionChange = (e) => {
        const { name, value } = e.target;
        setConversionPaymentFields({
            ...conversionPaymentFields,
            [name]: value,
        });
    };

    const handleAnnualConversionChange = (e) => {
        const { name, value } = e.target;
        setConversionAnnualPaymentFields({
            ...conversionAnnualPaymentFields,
            [name]: value,
        });
    };

    const toggleConversionRevenue = (index) => {
        if (conversionRevenueclicked === index) {
            return setConversionRevenueClicked(false);
        }
        setConversionRevenueClicked(index);
    };

    const toggleFlatSpendBonus = (index) => {
        if (flatSpendBonusClicked === index) {
            return setFlatSpendBonusClicked(false);
        }
        setFlatSpendBonusClicked(index);
    };

    const [createConversionPayment] = useMutation(CREATE_CONVERSION_PAYMENT, {
        variables: {
            conversion_type: mutationConversionType,
            conversion_id: conversionId,
            amount: parseFloat(conversionPaymentFields?.amount),
            payment_date: conversionPaymentDate.toISOString().substr(0, 10),
            note: conversionPaymentFields?.note,
        },
        update(cache, result) {
            setConversionPaymentFields({});
            refetch(program?.id);
        },
    });

    const [createAnnualConversionPayment] = useMutation(
        CREATE_CONVERSION_PAYMENT,
        {
            variables: {
                conversion_type: annualMutationConversionType,
                conversion_id: annualConversionId,
                amount: parseFloat(conversionAnnualPaymentFields?.amount),
                payment_date: conversionAnnualPaymentDate
                    .toISOString()
                    .substr(0, 10),
                note: conversionAnnualPaymentFields?.note,
            },
            update(cache, result) {
                setConversionPaymentFields({});
                refetch(program?.id);
            },
        }
    );

    const submitConversionPayment = (id, type) => {
        setConversionId(id);
        setMutationConversionType(type);
        setCallConversionPaymentMutation(true);
    };

    const submitAnnualConversionPayment = (id, type) => {
        setAnnualConversionId(id);
        setAnnualMutationConversionType(type);
        setCallAnnualConversionPaymentMutation(true);
    };

    function CustomOverlay({ classNames, selectedDay, children, ...props }) {
        return (
            <div
                className={classNames.overlayWrapper}
                style={{ marginBottom: 150,width:"100%" }}
                {...props}
            >
                <div className={classNames.overlay}>{children}</div>
            </div>
        );
    }

    const modifiers = {
        selected: conversionPaymentDate,
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

    return (
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
            {loading ? (
                <Loader />
            ) : (
                <>
                    {program?.conversionFlatPayment?.edges?.length > 0 ? (
                        <div className="px-4 py-1 ">
                            <span className=" font-title text-md text-secondary text-md font-semibold">
                                Flat Payments
                            </span>
                            <div className="flex flex-col ">
                                {program?.conversionFlatPayment?.edges?.map(
                                    (item, index) => {
                                        return (
                                            <div
                                                className={` ${
                                                    conversionRevenueclicked ===
                                                    index
                                                        ? "border rounded-lg "
                                                        : ""
                                                }`}
                                            >
                                                <div
                                                    className={`flex flex-col items-start space-x-5 px-2 text-md hover:text-gray-500 cursor-pointer w-full ${
                                                        conversionRevenueclicked ===
                                                        index
                                                            ? "border-b "
                                                            : ""
                                                    }`}
                                                    onClick={() => {
                                                        toggleConversionRevenue(
                                                            index
                                                        );
                                                        setConversionPaymentDate(
                                                            toDate(
                                                                item?.node?.anticipated_payment_date.substr(
                                                                    0,
                                                                    10
                                                                )
                                                            )
                                                        );
                                                        setConversionPaymentFields(
                                                            {
                                                                ...conversionPaymentFields,
                                                                amount:
                                                                    item?.node
                                                                        ?.amount,
                                                            }
                                                        );
                                                    }}
                                                >
                                                    <div className=" max-w-4xl flex flex-col w-full  relative py-1">
                                                        <p className="w-full text-darkgray75 font-semibold ">
                                                            {item?.node?.name}
                                                        </p>
                                                        <div className="flex items-center text-darkgray75  justify-between">
                                                        <p className="text-left flex-1">
                                                            {formatterForCurrency.format(item?.node?.amount)}
                                                        </p>
                                                        <p className=" text-center text-darkgray75   justify-self-center flex-1">
                                                            {getFormattedDate(
                                                                new Date(
                                                                    item?.node?.anticipated_payment_date
                                                                )
                                                            )}
                                                        </p>
                                                        <p className="flex-1"></p>
                                                        </div>
                                                       
                                                       
                                                        {conversionRevenueclicked ===
                                                        index ? (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-6 w-6 text-secondary absolute right-0 mt-3"
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
                                                                className="h-6 w-6 text-secondary absolute right-0 mt-3"
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
                                                    </div>
                                                </div>

                                                {conversionRevenueclicked ===
                                                index ? (
                                                    <div className="px-2">
                                                        <div className="">
                                                            {item?.node?.payment?.edges?.map(
                                                                (payment) => {
                                                                    return (
                                                                        <div className=" max-w-4xl grid grid-cols-3 text-darkgray75 items-start w-full space-x-5 relative">
                                                                            <p className="w-full">
                                                                                Paid
                                                                            </p>
                                                                            <p className="w-full">
                                                                                {formatterForCurrency.format(payment?.node?.amount)}
                                                                            </p>
                                                                            <p className="w-full">
                                                                                {getFormattedDate(
                                                                                    new Date(
                                                                                        payment?.node?.payment_date
                                                                                    )
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-2 px-2 py-3 items-center ">
                                                            <label
                                                                className="text-md   font-medium text-secondary"
                                                                htmlFor="amount"
                                                            >
                                                                Amount
                                                            </label>
                                                            <div className="relative">
                                                                <input
                                                                    id="amount"
                                                                    className={`pl-4 ml-2 block input-no-error w-full  focus:outline-none shadow-sm sm:text-sm rounded-md`}
                                                                    onChange={
                                                                        handleConversionChange
                                                                    }
                                                                    value={
                                                                        conversionPaymentFields?.amount
                                                                    }
                                                                    name="amount"
                                                                    placeholder="2000"
                                                                    type="number"
                                                                />
                                                                <span
                                                                    className="absolute inset-y-0 left-0 bottom-1 pl-3 flex items-center text-sm text-secondary pointer-events-none"
                                                                    style={{
                                                                        paddingTop:
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    $
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2  items-center  w-full">
                                                            <label className=" text-md font-medium text-secondary pl-2">
                                                                Payment Date
                                                            </label>
                                                            <div className="pl-2">
                                                                <DayPickerInput
                                                                    value={
                                                                        conversionPaymentDate
                                                                    }
                                                                    inputProps={{
                                                                        style: {
                                                                            border:
                                                                                "1px solid rgba(212, 212, 216,1)",
                                                                            borderRadius:
                                                                                "0.375rem",
                                                                            padding:
                                                                                "0.5rem 0.75rem 0.5rem",
                                                                            width:
                                                                                "100%",
                                                                            fontSize:
                                                                                ".875rem",
                                                                            cursor:
                                                                                "pointer",
                                                                        },
                                                                    }}
                                                                    overlayComponent={
                                                                        CustomOverlay
                                                                    }
                                                                    dayPickerProps={{
                                                                        modifiers: modifiers,
                                                                        modifiersStyles: modifiersStyles,
                                                                    }}
                                                                    onDayChange={(
                                                                        date
                                                                    ) => {
                                                                        setConversionPaymentDate(
                                                                            date
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 px-2 py-3 items-center">
                                                            <label
                                                                className="text-md   font-medium text-secondary"
                                                                htmlFor="amount"
                                                            >
                                                                Notes
                                                            </label>
                                                            <TextField
                                                                id="note"
                                                                value={
                                                                    conversionPaymentFields?.note
                                                                }
                                                                onChange={
                                                                    handleConversionChange
                                                                }
                                                                parentClass={
                                                                    "ml-2"
                                                                }
                                                                className={`pl-2 ml-2 block input-no-error  focus:outline-none shadow-sm sm:text-sm rounded-md`}
                                                                name="note"
                                                                placeholder="Some Notes"
                                                                textarea={true}
                                                            />
                                                        </div>
                                                        <div className="pb-2 flex flex-col items-end px-2 max-w-sm">
                                                            <Button
                                                                color="primary"
                                                                title={
                                                                    "Confirm"
                                                                }
                                                                onClick={() =>
                                                                    submitConversionPayment(
                                                                        item
                                                                            ?.node
                                                                            ?.id,
                                                                        "FLAT"
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    ) : null}
                    {program?.conversionFlatPercent?.edges?.length > 0 ? (
                        <div className=" pb-1 ">
                            <span className="px-4 font-title text-md text-secondary text-md font-semibold">
                                Annual Flat Spend Bonus
                            </span>
                            <div className="flex flex-col px-4">
                                {program?.conversionFlatPercent?.edges?.map(
                                    (item, index) => {
                                        return (
                                            <div
                                                className={` ${
                                                    flatSpendBonusClicked ===
                                                    index
                                                        ? "border rounded-lg "
                                                        : ""
                                                }`}
                                            >
                                                <div
                                                    className={`flex flex-col items-start space-x-5  text-md text-darkgray75 font-semibold hover:text-gray-500 cursor-pointer px-4 w-full ${
                                                        flatSpendBonusClicked ===
                                                        index
                                                            ? "border-b "
                                                            : ""
                                                    }`}
                                                    onClick={() => {
                                                        toggleFlatSpendBonus(
                                                            index
                                                        );
                                                        setConversionPaymentDate(
                                                            toDate(
                                                                item?.node?.anticipated_payment_date.substr(
                                                                    0,
                                                                    10
                                                                )
                                                            )
                                                        );
                                                        setConversionPaymentFields(
                                                            {
                                                                ...conversionPaymentFields,
                                                                amount:
                                                                    item?.node
                                                                        ?.amount,
                                                            }
                                                        );
                                                    }}
                                                >
                                                    <div className=" max-w-4xl grid grid-cols-3 items-start w-full space-x-4 relative py-1">
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
                                                            {getFormattedDate(
                                                                new Date(
                                                                    item?.node?.anticipated_payment_date
                                                                )
                                                            )}
                                                        </p>
                                                        {flatSpendBonusClicked ===
                                                        index ? (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-6 w-6 text-secondary absolute right-0 mt-1"
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
                                                                className="h-6 w-6 text-secondary absolute right-0 mt-1"
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
                                                    </div>
                                                </div>

                                                {flatSpendBonusClicked ===
                                                index ? (
                                                    <div className="px-2">
                                                        <div className="px-2">
                                                            {item?.node?.payment?.edges?.map(
                                                                (payment) => {
                                                                    return (
                                                                        <div className=" max-w-4xl flex items-center w-full space-x-5">
                                                                            <p className="w-full">
                                                                                Paid
                                                                            </p>
                                                                            <p className="w-full">
                                                                                {formatterForCurrency.format(payment?.node?.amount)}
                                                                            </p>
                                                                            <p className="w-full">
                                                                                {getFormattedDate(
                                                                                    new Date(
                                                                                        payment?.node?.payment_date
                                                                                    )
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-2 px-4 py-3 items-center">
                                                            <label
                                                                className="text-md   font-medium text-secondary"
                                                                htmlFor="amount"
                                                            >
                                                                Amount
                                                            </label>
                                                            <div className="relative">
                                                                <input
                                                                    id="amount"
                                                                    className={`ml-2 block input-no-error w-20 pl-4 focus:outline-none shadow-sm sm:text-sm rounded-md`}
                                                                    onChange={
                                                                        handleAnnualConversionChange
                                                                    }
                                                                    value={
                                                                        conversionAnnualPaymentFields?.amount
                                                                    }
                                                                    name="amount"
                                                                    placeholder="2000"
                                                                    type="number"
                                                                />
                                                                <span
                                                                    className="absolute inset-y-0 left-0 bottom-1 pl-3 flex items-center text-sm text-secondary pointer-events-none"
                                                                    style={{
                                                                        paddingTop:
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    $
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2  items-center px-4 w-full">
                                                            <label className=" text-md font-medium text-secondary">
                                                                Payment Date
                                                            </label>
                                                            <div className="pl-2">
                                                                <DayPickerInput
                                                                    value={
                                                                        conversionAnnualPaymentDate
                                                                    }
                                                                    inputProps={{
                                                                        style: {
                                                                            border:
                                                                                "1px solid rgba(212, 212, 216,1)",
                                                                            borderRadius:
                                                                                "0.375rem",
                                                                            padding:
                                                                                "0.5rem 0.75rem",
                                                                            width:
                                                                                "130px",
                                                                            fontSize:
                                                                                ".875rem",
                                                                            cursor:
                                                                                "pointer",
                                                                        },
                                                                    }}
                                                                    overlayComponent={
                                                                        CustomOverlay
                                                                    }
                                                                    dayPickerProps={{
                                                                        modifiers: modifiers,
                                                                        modifiersStyles: modifiersStyles,
                                                                    }}
                                                                    onDayChange={(
                                                                        date
                                                                    ) => {
                                                                        setConversionAnnualPaymentDate(
                                                                            date
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 px-4 py-3 items-center">
                                                            <label
                                                                className="text-md   font-medium text-secondary"
                                                                htmlFor="amount"
                                                            >
                                                                Notes
                                                            </label>
                                                            <TextField
                                                                id="note"
                                                                value={
                                                                    conversionAnnualPaymentFields?.note
                                                                }
                                                                onChange={
                                                                    handleAnnualConversionChange
                                                                }
                                                                parentClass={
                                                                    "ml-2"
                                                                }
                                                                className={`pl-2 ml-2 block input-no-error  focus:outline-none shadow-sm sm:text-sm rounded-md`}
                                                                name="note"
                                                                placeholder="Some Notes"
                                                                textarea={true}
                                                            />
                                                        </div>
                                                        <div className="py-2 flex flex-col items-start px-2 max-w-sm">
                                                            <Button
                                                                color="primary"
                                                                title={
                                                                    "Confirm"
                                                                }
                                                                onClick={() =>
                                                                    submitAnnualConversionPayment(
                                                                        item
                                                                            ?.node
                                                                            ?.id,
                                                                        "PERCENT"
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    ) : null}
                    {program?.conversionTieredPercent?.edges?.length > 0 ? (
                        <div className="  ">
                            <span className=" font-title px-4  text-md text-secondary text-md font-semibold">
                                Tiered Bonus
                            </span>
                            <div className="flex flex-col px-4">
                                {program?.conversionTieredPercent?.edges?.map(
                                    (item, index) => {
                                        return (
                                            <div>
                                                <div
                                                    className={`flex flex-col items-start px-4  py-1  text-md text-darkgray75 font-semibold hover:text-gray-500 cursor-pointer w-full`}
                                                >
                                                    <div className="  grid grid-cols-3 items-start w-full space-x-4 relative">
                                                        <p className="w-full">
                                                            {item?.node?.name}
                                                        </p>
                                                        <p className="w-full">
                                                            {Math.min(
                                                                ...item?.node?.tiers?.edges?.map(
                                                                    (item) =>
                                                                        item
                                                                            ?.node
                                                                            ?.bonus_amount
                                                                )
                                                            )}
                                                            % -{" "}
                                                            {Math.max(
                                                                ...item?.node?.tiers?.edges?.map(
                                                                    (item) =>
                                                                        item
                                                                            ?.node
                                                                            ?.bonus_amount
                                                                )
                                                            )}
                                                            %
                                                        </p>
                                                        <p className="w-full">
                                                            {getFormattedDate(
                                                                new Date(
                                                                    item?.node?.updated_at
                                                                )
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    ) : null}
                </>
            )}
        </div>
    );
};

export default RevenueSection;
