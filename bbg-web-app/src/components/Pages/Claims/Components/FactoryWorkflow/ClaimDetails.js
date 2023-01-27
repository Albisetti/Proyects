import { DownloadVolumeClaimCSV } from "./DownloadVolumeClaimCSV";
import React, { useState } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { ClaimsTab } from "./ClaimsTab";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import Loader from "../../../../Loader/Loader";
import DisputeDetails from "./DisputeDetails";
import RejectionManagmentAccordion from "./RejectionManagmentAccordion";

export const ClaimDetails = () => {
    const [active, setActive] = useState("");
    const [show, setShow] = useState(true);
    const [claimId, setClaimId] = useState();
    const [disputeClaimName, setDisputeClaimName] = useState("");

    const activeHandler = (item) => {
        if (item !== active) {
            setActive(item);
            setShow(true);
        } else {
            setShow(!show);
        }
    };

    const openDisputeTab = (id, name, disputes) => {
        setClaimId(id);
        setActive(disputes);
        setDisputeClaimName(name);
    };

    const openRejectedRebatesTab = (id, name, rejected) => {
        setClaimId(id);
        setActive(rejected);
        setDisputeClaimName(name);
    };

    return (
        <>
            <div>
                <Disclosure as="div" className="">
                    <Disclosure.Button
                        className={`bg-white w-full  focus:outline-none ${
                            active === "claimFactoryDetails" && show ? "rounded-lg rounded-b-none" : "rounded-lg"
                        }`}
                    >
                        <div
                            style={{ maxHeight: "68px" }}
                            className={`flex flex-col md:flex-row py-4 px-4 justify-between items-center ${
                                active === "claimFactoryDetails" && show ? "border-b-2 border-gray-400" : ""
                            }`}
                            onClick={() => activeHandler("claimFactoryDetails")}
                        >
                            <div className=" font-title  text-center h2">
                                Factory Details
                                {disputeClaimName && active === "disputesFactory" ? ": " + disputeClaimName : ""}
                            </div>
                            {active === "claimFactoryDetails" && show ? (
                                <ChevronUpIcon className="h-10 w-10 text-secondary" />
                            ) : (
                                <ChevronDownIcon className="h-10 w-10 text-secondary" />
                            )}
                        </div>
                    </Disclosure.Button>
                    <Transition
                        show={active === "claimFactoryDetails" && show}
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-150 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Disclosure.Panel static>
                            <div className="grid bg-white  rounded-lg rounded-t-none grid-cols-6 overflow-hidden min-h-smallMin">
                                {false ? (
                                    <div className="col-span-6 flex items-center justify-center">
                                        <Loader />
                                    </div>
                                ) : (
                                    <div className="col-span-6 inset-0 flex flex-col">
                                        <ClaimsTab
                                            openDisputeTab={(id, name) => openDisputeTab(id, name, "disputesFactory")}
                                            openRejectedRebatesTab={(id, name) =>
                                                openRejectedRebatesTab(id, name, "rejectionManagmentFactory")
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        </Disclosure.Panel>
                    </Transition>
                </Disclosure>
                {claimId && active === "disputesFactory" && (
                    <Disclosure as="div" className="mt-5">
                        <Disclosure.Button
                            className={`bg-white w-full  focus:outline-none ${
                                active === "disputesFactory" && show ? "rounded-lg rounded-b-none" : "rounded-lg"
                            }`}
                        >
                            <div
                                style={{ maxHeight: "68px" }}
                                className={`flex flex-col md:flex-row py-4 px-4 justify-between items-center ${
                                    active === "disputesFactory" && show ? "border-b-2 border-gray-400" : ""
                                }`}
                                onClick={() => activeHandler("disputesFactory")}
                            >
                                <div className=" font-title  text-center h2">Dispute Management</div>
                                {active === "disputesFactory" && show ? (
                                    <ChevronUpIcon className="h-10 w-10 text-secondary" />
                                ) : (
                                    <ChevronDownIcon className="h-10 w-10 text-secondary" />
                                )}
                            </div>
                        </Disclosure.Button>
                        <Transition
                            show={active === "disputesFactory" && show}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-150 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Disclosure.Panel static>
                                <div className="grid bg-white  rounded-lg rounded-t-none grid-cols-6 overflow-hidden min-h-smallMin">
                                    {false ? (
                                        <div className="col-span-6 flex items-center justify-center">
                                            <Loader />
                                        </div>
                                    ) : (
                                        <div className="col-span-6 inset-0 flex flex-col">
                                            <DisputeDetails
                                                claimType="FACTORY"
                                                claimId={claimId}
                                                confirmAction={() => setActive("claimFactoryDetails")}
                                            />
                                        </div>
                                    )}
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </Disclosure>
                )}
                {claimId && active === "rejectionManagmentFactory" && (
                    <Disclosure as="div" className="mt-5">
                        <Disclosure.Button
                            className={`bg-white w-full  focus:outline-none ${
                                active === "rejectionManagmentFactory" && show
                                    ? "rounded-lg rounded-b-none"
                                    : "rounded-lg"
                            }`}
                        >
                            <div
                                style={{ maxHeight: "68px" }}
                                className={`flex flex-col md:flex-row py-4 px-4 justify-between items-center ${
                                    active === "rejectionManagmentFactory" && show ? "border-b-2 border-gray-400" : ""
                                }`}
                                onClick={() => activeHandler("rejectionManagmentFactory")}
                            >
                                <div className=" font-title  text-center h2">Rejection Management</div>
                                {active === "rejectionManagmentFactory" && show ? (
                                    <ChevronUpIcon className="h-10 w-10 text-secondary" />
                                ) : (
                                    <ChevronDownIcon className="h-10 w-10 text-secondary" />
                                )}
                            </div>
                        </Disclosure.Button>
                        <Transition
                            show={active === "rejectionManagmentFactory" && show}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-150 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Disclosure.Panel static>
                                <div className="grid bg-white  rounded-lg rounded-t-none grid-cols-6 overflow-hidden min-h-smallMin">
                                    {false ? (
                                        <div className="col-span-6 flex items-center justify-center">
                                            <Loader />
                                        </div>
                                    ) : (
                                        <div className="col-span-6 inset-0 flex flex-col">
                                            <RejectionManagmentAccordion
                                                claimType="FACTORY"
                                                claimId={claimId}
                                                confirmAction={() => setActive("claimFactoryDetails")}
                                            />
                                        </div>
                                    )}
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </Disclosure>
                )}
            </div>
            <div>
                <Disclosure as="div" className="">
                    <Disclosure.Button
                        className={`bg-white w-full  focus:outline-none ${
                            active === "claimVolumeDetails" && show ? "rounded-lg rounded-b-none" : "rounded-lg"
                        }`}
                    >
                        <div
                            style={{ maxHeight: "68px" }}
                            className={`flex flex-col md:flex-row py-4 px-4 justify-between items-center ${
                                active === "claimVolumeDetails" && show ? "border-b-2 border-gray-400" : ""
                            }`}
                            onClick={() => activeHandler("claimVolumeDetails")}
                        >
                            <div className=" font-title  text-center h2">
                                Volume Details
                                {disputeClaimName && active === "disputesVolume" ? ": " + disputeClaimName : ""}
                            </div>
                            {active === "claimVolumeDetails" && show ? (
                                <ChevronUpIcon className="h-10 w-10 text-secondary" />
                            ) : (
                                <ChevronDownIcon className="h-10 w-10 text-secondary" />
                            )}
                        </div>
                    </Disclosure.Button>
                    <Transition
                        show={active === "claimVolumeDetails" && show}
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-150 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Disclosure.Panel static>
                            <div className="bg-white rounded-lg rounded-t-none overflow-hidden min-h-smallMin">
                                {false ? (
                                    <div className="col-span-6 flex items-center justify-center">
                                        <Loader />
                                    </div>
                                ) : (
                                    <DownloadVolumeClaimCSV />
                                )}
                            </div>
                        </Disclosure.Panel>
                    </Transition>
                </Disclosure>
                {claimId && active === "disputesVolume" ? (
                    <Disclosure as="div" className="mt-5">
                        <Disclosure.Button
                            className={`bg-white w-full  focus:outline-none ${
                                active === "disputesVolume" && show ? "rounded-lg rounded-b-none" : "rounded-lg"
                            }`}
                        >
                            <div
                                style={{ maxHeight: "68px" }}
                                className={`flex flex-col md:flex-row py-4 px-4 justify-between items-center ${
                                    active === "disputesVolume" && show ? "border-b-2 border-gray-400" : ""
                                }`}
                                onClick={() => activeHandler("disputesVolume")}
                            >
                                <div className=" font-title  text-center h2">Dispute Management</div>
                                {active === "disputesVolume" && show ? (
                                    <ChevronUpIcon className="h-10 w-10 text-secondary" />
                                ) : (
                                    <ChevronDownIcon className="h-10 w-10 text-secondary" />
                                )}
                            </div>
                        </Disclosure.Button>
                        <Transition
                            show={active === "disputesVolume" && show}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-150 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Disclosure.Panel static>
                                <div className="grid bg-white  rounded-lg rounded-t-none grid-cols-6 overflow-hidden min-h-smallMin">
                                    {false ? (
                                        <div className="col-span-6 flex items-center justify-center">
                                            <Loader />
                                        </div>
                                    ) : (
                                        <div className="col-span-6 inset-0 flex flex-col">
                                            <DisputeDetails
                                                claimId={claimId}
                                                confirmAction={() => setActive("claimVolumeDetails")}
                                            />
                                        </div>
                                    )}
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </Disclosure>
                ) : null}
            </div>
        </>
    );
};

export default ClaimDetails;
