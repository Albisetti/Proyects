import React, { useState,useEffect } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import Loader from "../../../../Loader/Loader";
import ClaimPeriod from "./ClaimPeriod";
import ClaimHistoryDetails from "./ClaimHistoryDetails";
import { capitalize } from "../../../../../util/string";

const ClaimHistory = ({ history,location }) => {
    const [active, setActive] = useState("claimHistory");
    const [show, setShow] = useState(true);
    const [claimId,setClaimId] = useState();
    const [claim,setClaim] = useState()

    const activeHandler = (item) => {
        if (item !== active) {
            setActive(item);
            setShow(true);
        } else {
            setShow(!show);
        }
    };

    
    useEffect(() => {
        if(location?.state?.open === "claimHistory") {
           setActive("claimHistory");
            setShow(true)       
        }
        // eslint-disable-next-line
    }, [location?.state])

    const openClaim = (claim) => {
        setClaimId(claim?.id);
        setClaim(claim)
        setActive("claimDetails");
       
    }

    return (
        <div className="">
            <Disclosure as="div" className="">
                <Disclosure.Button
                    className={`bg-white w-full  focus:outline-none ${
                        active === "claimHistory" && show
                            ? "rounded-lg rounded-b-none"
                            : "rounded-lg"
                    }`}
                >
                    <div
                        style={{ maxHeight: "68px" }}
                        className={`flex flex-col md:flex-row py-4 px-4 justify-between items-center ${
                            active === "claimHistory" && show
                                ? "border-b-2 border-gray-400"
                                : ""
                        }`}
                        onClick={() => activeHandler("claimHistory")}
                    >
                        <div className=" font-title  text-center h2">
                            Claim History Details
                        </div>
                        {active === "claimHistory" && show ? (
                            <ChevronUpIcon className="h-10 w-10 text-secondary" />
                        ) : (
                            <ChevronDownIcon className="h-10 w-10 text-secondary" />
                        )}
                    </div>
                </Disclosure.Button>
                <Transition
                    show={active === "claimHistory" && show}
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
                                <div className="col-span-6 inset-0 flex flex-col h-full">
                                    <ClaimPeriod history={history} openClaim={(id) => openClaim(id)} />
                                </div>
                            )}
                        </div>
                    </Disclosure.Panel>
                </Transition>
            </Disclosure>
            {claimId ? (
                <Disclosure as="div" className="mt-5">
                    <Disclosure.Button
                        className={`bg-white w-full  focus:outline-none ${
                            active === "claimDetails" && show
                                ? "rounded-lg rounded-b-none"
                                : "rounded-lg"
                        }`}
                    >
                        <div
                            style={{ maxHeight: "68px" }}
                            className={`flex flex-col md:flex-row py-4 px-4 justify-between items-center ${
                                active === "claimDetails" && show
                                    ? "border-b-2 border-gray-400"
                                    : ""
                            }`}
                            onClick={() => activeHandler("claimDetails")}
                        >
                            <div className=" font-title  text-center h2">
                                {claim?.program?.name ? claim?.program?.name + " - " : ""}{" "}
                                {claim?.program?.type ? capitalize(claim?.program?.type) : ""}
                            </div>
                            {active === "claimDetails" && show ? (
                                <ChevronUpIcon className="h-10 w-10 text-secondary" />
                            ) : (
                                <ChevronDownIcon className="h-10 w-10 text-secondary" />
                            )}
                        </div>
                    </Disclosure.Button>
                    <Transition
                        show={active === "claimDetails" && show}
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
                                    <div className="col-span-6 inset-0 flex flex-col h-full">
                                        <ClaimHistoryDetails
                                            claimId={claimId}
                                            type={claim?.program?.type}
                                            claimData={claim}
                                        />
                                    </div>
                                )}
                            </div>
                        </Disclosure.Panel>
                    </Transition>
                </Disclosure>
            ) : null}
        </div>
    );
};

export default ClaimHistory;
