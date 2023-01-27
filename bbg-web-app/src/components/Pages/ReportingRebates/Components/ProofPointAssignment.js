import React, { useState } from "react";

import { Helmet } from "react-helmet";
import DayPickerInput from "react-day-picker/DayPickerInput";

import HelperModal from "../../../Modal/HelperModal";
import TextField from "../../../FormGroups/Input";
import CommonSelect from "../../../Select";

import SearchRebates from "../SearchRebates";

import { APP_TITLE } from "../../../../util/constants";

import { useQuery } from "@apollo/client";

import { FETCH_SUBCONTRACTOR_QUERY } from "../../../../lib/subcontractor";

const ProofPointAssignment = () => {
    const [proofPointsToAdd, setProofPointsToAdd] = useState({});
    const [proofPointsToAddValues, setProofPointsToAddValues] = useState({});

    const handleChangeCheckbox = (key, value) => setProofPointsToAdd({ ...proofPointsToAdd, [key]: value });

    const handleChangeTextInput = (key, value) =>
        setProofPointsToAddValues({ ...proofPointsToAddValues, [key]: value });

    const AddToRebates = (proofPointName) => {
        return (
            <div className="flex flex-row mt-5 mr-5 items-center justify-center py-4 text-center">
                <label
                    htmlFor={`${proofPointName}`}
                    className="text-md text-secondary font-medium justify-center items-center text-center"
                >
                    Add To Rebates
                </label>
                <input
                    id={`${proofPointName}`}
                    name={`${proofPointName}`}
                    className="focus:ring-secondary ml-2 h-4 w-4 text-primary border-gray-300 rounded"
                    type="checkbox"
                    onChange={(event) => handleChangeCheckbox(proofPointName, event?.target?.checked)}
                />
            </div>
        );
    };

    const { data: subcontractors } = useQuery(FETCH_SUBCONTRACTOR_QUERY, {
        notifyOnNetworkStatusChange: false,
    });

    return (
        <div className="min-h-smallMin max-w-8xl flex flex-col h-full gap-5 w-8xl mx-auto px-4 sm:px-6 lg:px-32">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Assign Proof Points</title>
            </Helmet>

            <div className=" bg-white rounded-lg py-4 px-4 h1 flex">
                <p>Assign Proof Points </p>

                <HelperModal type={"assignment"} title="Product Assignment Information" />
            </div>
            <div
                className="flex flex-row space-x-5 overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400"
                style={{ minHeight: "79vh", maxHeight: "79vh" }}
            >
                <div className="w-full">
                    <div className="inset-0 bg-white rounded-lg h-full">
                        <div className="flex justify-between w-full   items-center">
                            <div className={"w-full"}>
                                <div
                                    className="flex flex-row w-full bg-gray-50 rounded-md hover:bg-gray-100"
                                    style={{ maxHeight: "59px" }}
                                >
                                    <p className="w-full text-lg py-4 rounded-lg rounded-b-none justify-center items-center text-center mr-0 border border-gray-500 shadow-sm font-title font-medium text-white bg-secondary ">
                                        Proof Points
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="inset-0 flex flex-row items-center justify-center">
                            <div className={`w-full col-span-6 sm:col-span-6 mt-5 grid grid-cols-2 px-4 items-center`}>
                                <label
                                    className={`block w-full text-md font-medium text-secondary`}
                                    htmlFor="subcontratorDistributorProvider"
                                >
                                    Subcontractor/Distributor/Provider
                                </label>
                                <CommonSelect
                                    disabled={!proofPointsToAdd["subcontratorDistributorProvider"]}
                                    options={subcontractors && subcontractors.subcontractors}
                                    id={"subcontratorDistributorProvider"}
                                    name={"subcontratorDistributorProvider"}
                                    type="subcontractor"
                                    className={`w-full focus:outline-none shadow-sm sm:text-sm rounded-md`}
                                    placeHolder="Subcontractors"
                                    noOptionsMessage="No subcontractors/providers found"
                                    menuPlacement={"bottom"}
                                    onChange={(event) =>
                                        handleChangeTextInput("subcontratorDistributorProvider", event?.value)
                                    }
                                />
                            </div>
                            {AddToRebates("subcontratorDistributorProvider")}
                        </div>
                        <div className="inset-0 flex flex-row items-center justify-center">
                            <TextField
                                parentClass="col-span-6 sm:col-span-6 mt-5 grid grid-cols-2 px-4 items-center"
                                id="brand"
                                label="Brand"
                                name="brand"
                                placeholder="Brand"
                                type="text"
                                onChange={(event) => handleChangeTextInput("brand", event?.target?.value)}
                                disabled={!proofPointsToAdd["brand"]}
                            />
                            {AddToRebates("brand")}
                        </div>
                        <div className="inset-0 flex flex-row items-center justify-center">
                            <TextField
                                parentClass="col-span-6 sm:col-span-6 mt-5 grid grid-cols-2 px-4 items-center"
                                id="serialNumber"
                                label="Serial Number"
                                name="serialNumber"
                                placeholder="Serial Number"
                                type="text"
                                onChange={(event) => handleChangeTextInput("serialNumber", event?.target?.value)}
                                disabled={!proofPointsToAdd["serialNumber"]}
                            />
                            {AddToRebates("serialNumber")}
                        </div>
                        <div className="inset-0 flex flex-row items-center justify-center">
                            <TextField
                                parentClass="col-span-6 sm:col-span-6 mt-5 grid grid-cols-2 px-4 items-center"
                                id="modelNumber"
                                label="Model Number"
                                name="modelNumber"
                                placeholder="Model Number"
                                type="text"
                                onChange={(event) => handleChangeTextInput("modelNumber", event?.target?.value)}
                                disabled={!proofPointsToAdd["modelNumber"]}
                            />
                            {AddToRebates("modelNumber")}
                        </div>
                        <div className="inset-0 flex flex-row items-center justify-center">
                            <div
                                className={`w-full whitespace-nowrap h-auto col-span-6 sm:col-span-6 mt-5 grid grid-cols-2 px-4 items-center`}
                            >
                                <label
                                    className={`block w-full text-md font-medium text-secondary`}
                                    htmlFor="dateOfInstallation"
                                >
                                    Date Of Installation
                                </label>
                                <DayPickerInput
                                    id="dateOfInstallation"
                                    inputProps={{
                                        style: {
                                            display: "block",
                                            outline: "2px solid transparent",
                                            shadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                            boxShadow:
                                                "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)",
                                            border: "1px solid rgba(212, 212, 216,1)",
                                            borderRadius: "0.375rem",
                                            padding: "0.5rem 0.75rem",
                                            width: "100%",
                                            fontSize: ".875rem",
                                            cursor: "pointer",
                                        },
                                        disabled: !proofPointsToAdd["dateOfInstallation"],
                                    }}
                                    format="MM/dd/yyyy"
                                    onDayChange={(value) => handleChangeTextInput("dateOfInstallation", value)}
                                />
                            </div>
                            {AddToRebates("dateOfInstallation")}
                        </div>
                        <div className="inset-0 relative z-0 flex flex-row items-center justify-center">
                            <div className={`w-full col-span-6 sm:col-span-6 mt-5 grid grid-cols-2 px-4 items-center`}>
                                <label className={`block w-full text-md font-medium text-secondary`}>
                                    Date Of Purchase
                                </label>
                                <DayPickerInput
                                    inputProps={{
                                        style: {
                                            display: "block",
                                            outline: "2px solid transparent",
                                            shadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                            boxShadow:
                                                "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)",
                                            border: "1px solid rgba(212, 212, 216,1)",
                                            borderRadius: "0.375rem",
                                            padding: "0.5rem 0.75rem",
                                            width: "100%",
                                            fontSize: ".875rem",
                                            cursor: "pointer",
                                        },
                                        disabled: !proofPointsToAdd["dateOfPurchase"],
                                    }}
                                    format="MM/dd/yyyy"
                                    onDayChange={(value) => handleChangeTextInput("dateOfPurchase", value)}
                                />
                            </div>
                            {AddToRebates("dateOfPurchase")}
                        </div>
                    </div>
                </div>
                <SearchRebates
                    proofPointsObject={proofPointsToAdd}
                    proofPointsObjectValues={proofPointsToAddValues}
                    hideClaimed={true}
                />
            </div>
        </div>
    );
};

export default ProofPointAssignment;
