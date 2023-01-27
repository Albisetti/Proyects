import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

import { DOWNLOAD_ADDRESS_CSV } from "../../../../../lib/claims";

import TextField from "../../../../FormGroups/Input/TextField";
import Button from "../../../../Buttons";

import * as CSV from "csv-string";
import { CSVLink } from "react-csv";

export const DownloadVolumeClaimCSV = () => {
    const [year, setYear] = useState();
    const [quarter, setQuarter] = useState();
    const [subdivisionName, setSubdivisionName] = useState();
    const [downloadClicked, setDownloadClicked] = useState();
    const [regularCSVData, setRegularCSVData] = useState("");
    const [customCSVData, setCustomCSVData] = useState("");
    const [csvInputsSetting, setCsvInputsSetting] = useState("quarterYear");

    const [downloadAddressCsv, { loading: csvDownloading }] = useLazyQuery(DOWNLOAD_ADDRESS_CSV, {
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only",
        onCompleted: (result) => {
            setDownloadClicked(false);

            const arrCustom =
                result?.addressesCSV && result?.addressesCSV?.custom && CSV.parse(result?.addressesCSV?.custom);
            const strCustom = arrCustom && CSV.stringify(arrCustom);

            const arrRegular =
                result?.addressesCSV && result?.addressesCSV?.regular && CSV.parse(result?.addressesCSV?.regular);
            const strRegular = arrRegular && CSV.stringify(arrRegular);

            setRegularCSVData(strRegular);
            setCustomCSVData(strCustom);
        },
        onError: () => {
            setDownloadClicked(false);
        },
    });

    function downloadVolumeCSVTrigger(CSVData, elementId) {
        if (CSVData) {
            let buttonCustom = document.getElementById(elementId);
            if (buttonCustom) {
                setTimeout(() => buttonCustom.click(), 100);
            }
        }
    }

    function handleChange(callback, event) {
        callback(event?.target?.value);
        setRegularCSVData("");
        setCustomCSVData("");
    }

    useEffect(() => {
        if (regularCSVData?.length > 0) downloadVolumeCSVTrigger(regularCSVData, "volumeAddressRegular");
    }, [regularCSVData]);

    useEffect(() => {
        if (customCSVData?.length > 0) downloadVolumeCSVTrigger(customCSVData, "volumeAddressCustom");
    }, [customCSVData]);

    useEffect(() => {
        if (downloadClicked && (!regularCSVData || !customCSVData)) {
            downloadAddressCsv({
                variables: {
                    programType: "VOLUME",
                    quarter: parseInt(quarter),
                    year: parseInt(year),
                    subdivisionName: subdivisionName,
                },
            });
        } else if (downloadClicked && (regularCSVData || customCSVData)) {
            downloadVolumeCSVTrigger(regularCSVData, "volumeAddressRegular");
            downloadVolumeCSVTrigger(customCSVData, "volumeAddressCustom");
            setDownloadClicked(false);
        }
        // eslint-disable-next-line
    }, [downloadClicked]);

    return (
        <div>
            <div className="h-full col-span-6">
                <div className=" inset-0  bg-white rounded-lg h-full flex flex-col">
                    <div className="flex flex-0 px-4 border-b justify-between items-center">
                        <div className=" py-5 text-center font-title h2">CSV Settings</div>
                        <div>
                            <label className="inline-flex mr-5 md:mt-2">
                                <input
                                    type="radio"
                                    name={"quarterYear"}
                                    value={"quarterYear"}
                                    className={`form-radio h-5 w-5 text-secondary focus:ring-secondary`}
                                    checked={csvInputsSetting === "quarterYear"}
                                    onChange={(event) => {
                                        setSubdivisionName(null);
                                        handleChange(setCsvInputsSetting, event);
                                    }}
                                />
                                <span className="ml-2 text-sm  text-secondary">By Quarter And Year</span>
                            </label>
                            <label className="inline-flex  md:mt-2">
                                <input
                                    type="radio"
                                    name={"subdivisionName"}
                                    value={"subdivisionName"}
                                    className={`form-radio h-5 w-5 text-secondary focus:ring-secondary`}
                                    checked={csvInputsSetting === "subdivisionName"}
                                    onChange={(event) => {
                                        setYear(null);
                                        setQuarter(null);
                                        handleChange(setCsvInputsSetting, event);
                                    }}
                                />
                                <span className="ml-2 text-sm  text-secondary">By Subdivision Name</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-full">
                {csvInputsSetting === "quarterYear" && (
                    <>
                        <TextField
                            disabled={subdivisionName ? true : false}
                            onChange={(event) => {
                                handleChange(setQuarter, event);
                            }}
                            flex
                            parentClass="col-span-6 sm:col-span-6 border-b py-3"
                            id="quarter"
                            label="Quarter"
                            name="quarter"
                            placeholder="1"
                            type="number"
                            min="1"
                            max="4"
                        />
                        <TextField
                            disabled={subdivisionName ? true : false}
                            onChange={(event) => {
                                handleChange(setYear, event);
                            }}
                            flex
                            parentClass="col-span-6 sm:col-span-6 border-b py-3"
                            id="year"
                            label="Year"
                            name="year"
                            placeholder="2022"
                            type="number"
                        />
                    </>
                )}
                {csvInputsSetting === "subdivisionName" && (
                    <TextField
                        disabled={year || quarter ? true : false}
                        onChange={(event) => {
                            handleChange(setSubdivisionName, event);
                        }}
                        flex
                        parentClass="col-span-6 sm:col-span-6 border-b py-3"
                        id="subdivision"
                        label="Subdivision Name"
                        name="subdivision"
                        placeholder="Subdivision Name"
                        type="text"
                    />
                )}
            </div>
            <div className="py-2 pr-5 flex flex-col border-gray-400">
                <Button
                    disabled={(!year || !quarter) && !subdivisionName ? true : false}
                    color="primary"
                    title={csvDownloading ? "Downloading CSV" : "Download CSV"}
                    parentClass={"self-end"}
                    onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        setDownloadClicked(true);
                    }}
                />

                <CSVLink
                    data={regularCSVData}
                    asyncOnClick={true}
                    className="hidden"
                    separator={","}
                    id={`volumeAddressRegular`}
                    filename={`Volume - Regular - Address - ${new Date()?.toISOString()?.substr(0, 10)}.csv`}
                    target="_blank"
                ></CSVLink>
                <CSVLink
                    data={customCSVData}
                    asyncOnClick={true}
                    className="hidden"
                    separator={","}
                    id={`volumeAddressCustom`}
                    filename={`Volume - Custom - Address - ${new Date()?.toISOString()?.substr(0, 10)}.csv`}
                    target="_blank"
                ></CSVLink>
            </div>
        </div>
    );
};
