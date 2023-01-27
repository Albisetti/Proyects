import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import Button from "../Buttons";

const Modal = ({
    show,
    onSubmit,
    Content,
    title,
    IconJSX,
    onClose,
    submitLabel,
    width,
    minHeight,
    submitLabelColor,
    Cancel,
    showSubmit = true,
    disabled,
    extraAction,
    extraLabelColor,
    extraActionButton,
    extraLabel,
    overflowHidden,
    renderCSVLink = false,
    csvData = "",
    csvDataOverwrite = "",
    cleanUp,
    csvFileName,
    csvFileNameOverwrite,
    thirdActionButton = false,
    thirdLabel,
    thirdAction,
    fourthActionButton = false,
    fourthLabel,
    fourthAction,
}) => {
    const [showModal, setShowModal] = useState(show);
    useEffect(() => {
        if (show) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    }, [show]);

    return (
        <>
            {showModal ? (
                <div
                    className="fixed inset-0 mx-5 overflow-y-auto z-20"
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            aria-hidden="true"
                        ></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>

                        <div
                            className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-${
                                width ? width : "lg"
                            } sm:w-full`}
                        >
                            <div className="flex items-center px-4 pt-2 pb-2 ">
                                <div className="hidden sm:block absolute top-0 right-0 pt-2 pr-2">
                                    <button
                                        onClick={onClose}
                                        type="button"
                                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none "
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg
                                            className="h-6 w-6"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex justify-start items-center">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center rounded-full sm:mx-0">
                                        {IconJSX ? IconJSX : null}
                                    </div>
                                    <p className="bg-white rounded-lg pl-2 h1 " id="modal-title">
                                        {title}
                                    </p>
                                </div>
                            </div>
                            <hr />
                            <div
                                className={`sm:flex sm:items-center flex-1 ${
                                    overflowHidden ? "overflow-hidden" : "overflow-auto  max-h-partial"
                                } scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400`}
                            >
                                <div className={`my-4  w-full ${minHeight ? minHeight : ""}`}>
                                    {Content ? Content : null}
                                </div>
                            </div>
                            <hr />
                            <div className="mt-1 flex gap-5 flex-row-reverse justify-between px-4 pb-1 ">
                                {showSubmit ? (
                                    <Button
                                        disabled={disabled}
                                        parentClass={"ml-5 md:ml-0"}
                                        onClick={onSubmit}
                                        title={submitLabel}
                                        color={submitLabelColor ? submitLabelColor : "primary"}
                                    />
                                ) : null}
                                {extraActionButton && !renderCSVLink ? (
                                    <Button
                                        disabled={disabled}
                                        parentClass={"ml-5 md:ml-0"}
                                        onClick={extraAction}
                                        title={extraLabel}
                                        color={extraLabelColor ? extraLabelColor : "primary"}
                                    />
                                ) : renderCSVLink ? (
                                    <>
                                        <CSVLink
                                            data={csvData}
                                            asyncOnClick={true}
                                            className="text-white font-title bg-brickGreen self-center px-10 py-2 rounded-lg mr-2 ml-2 text-sm md:text-md"
                                            separator={","}
                                            onClick={() => cleanUp()}
                                            id="csvDownloadModal"
                                            filename={csvFileName}
                                            target="_blank"
                                        >
                                            Saving CSV
                                        </CSVLink>
                                        <CSVLink
                                            data={csvDataOverwrite}
                                            asyncOnClick={true}
                                            className="hidden"
                                            separator={","}
                                            onClick={() => cleanUp()}
                                            id="csvDownloadFactoryOverwrite"
                                            filename={csvFileNameOverwrite}
                                            target="_blank"
                                        ></CSVLink>
                                    </>
                                ) : null}
                                {fourthActionButton && (
                                    <Button
                                        disabled={disabled}
                                        parentClass={"ml-5 md:ml-0"}
                                        onClick={fourthAction}
                                        title={fourthLabel}
                                        color={"primary"}
                                    />
                                )}
                                {thirdActionButton && (
                                    <Button
                                        disabled={disabled}
                                        parentClass={"ml-5 md:ml-0"}
                                        onClick={thirdAction}
                                        title={thirdLabel}
                                        color={"primary"}
                                    />
                                )}

                                {Cancel ? <Button onClick={onClose} title="Back" color="primary" /> : null}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default Modal;
