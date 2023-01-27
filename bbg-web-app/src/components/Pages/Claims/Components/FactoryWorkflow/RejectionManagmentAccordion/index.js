import React, { useState, useEffect } from "react";

import Button from "../../../../../Buttons";

import { FETCH_CLAIM, REJECT_REBATES } from "./RejectionManagmentAccordion.query";
import { FETCH_SMALL_CLAIM } from "../../../../../../lib/claims";
import RejectionModal from "./RejectionModal";
import Modal from "../../../../../Modal";

import Loader from "../../../../../Loader/Loader";
import { useLazyQuery, useMutation } from "@apollo/client";
import { toast } from "react-toastify";

const RejectionManagmentAccordion = ({ claimId }) => {
    const [claim, setClaim] = useState();
    const [activeBuilder, setActiveBuilder] = useState();
    const [rebatesList, setRebatesList] = useState();
    const [activeAddresses, setActiveAddresses] = useState([]);
    const [showModal, setShowModal] = useState();
    const [rebatesIds, setRebatesIds] = useState([]);
    const [rejectionNote, setRejectionNote] = useState();

    useEffect(() => {
        if (claimId) {
            getClaim();
        }
        // eslint-disable-next-line
    }, [claimId]);

    useEffect(() => {
        if (activeBuilder?.builder_id && claimId) {
            getClaimForBuilder();
        }
        // eslint-disable-next-line
    }, [activeBuilder, claimId]);

    const handleBuilderClick = (data) => {
        setActiveBuilder(data);
    };

    const [getClaim, { loading: claimLoading }] = useLazyQuery(FETCH_SMALL_CLAIM, {
        notifyOnNetworkStatusChange: false,
        variables: {
            id: claimId,
        },
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            if (data?.claim?.id) {
                setClaim(data?.claim);
            }
        },
    });

    const [rejectRebates] = useMutation(REJECT_REBATES, {
        variables: {
            rebates: rebatesIds,
        },
        onCompleted: (data) => {
            toast.info(data?.rejectRebates);
        },
        onError: (data) => {
            toast.error("Error while rejecting, try again.");
        },
    });

    const [getClaimForBuilder, { loading: builderClaimLoading }] = useLazyQuery(FETCH_CLAIM, {
        notifyOnNetworkStatusChange: false,
        variables: {
            id: claimId,
            orgId: activeBuilder?.builder_id,
        },
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            if (data?.claim?.id) {
                setClaim(data?.claim);
                normalizeTheList(data?.claim?.houseProductsForBuilder?.edges);
            }
        },
    });

    const normalizeTheList = (edges) => {
        let houseIds = [];
        let finalHouseProductArray = [];
        edges?.forEach((item) => {
            if (!houseIds.includes(item?.node?.houses?.id)) {
                let object = {};
                object.house = item?.node?.houses;
                object.products = [
                    {
                        ...item?.node?.products,
                        product_quantity: item?.node?.product_quantity,
                        dispute: item?.node?.dispute,
                        pivotId: item?.node?.id,
                    },
                ];
                object.dispute = item?.node?.dispute;
                object.disputed = item?.node?.disputed;
                houseIds.push(item?.node?.houses?.id);
                finalHouseProductArray.push(object);
            } else {
                let arrayIndex = finalHouseProductArray.findIndex(
                    (element) => element?.house?.id === item?.node?.houses?.id
                );
                finalHouseProductArray[arrayIndex].products = [
                    ...finalHouseProductArray[arrayIndex].products,
                    {
                        ...item?.node?.products,
                        product_quantity: item?.node?.product_quantity,
                        dispute: item?.node?.dispute,
                        pivotId: item?.node?.id,
                    },
                ];
            }
        });
        setRebatesList(finalHouseProductArray);
    };

    const handleAccordianEachAddress = (node) => {
        if (activeAddresses?.findIndex((element) => element?.id === node?.house?.id) > -1) {
            setActiveAddresses(activeAddresses.filter((item) => item.id !== node?.house.id));
        } else {
            setActiveAddresses(() => [
                ...activeAddresses,
                {
                    ...node?.house,
                    subdivisionName: node?.house?.subdivisionName,
                    subdivisionId: node?.house?.subdivisionId,
                    products: node?.products,
                },
            ]);
        }
    };

    const handleRejectRebates = () => {
        let rebatesToReject = [];
        rebatesIds.forEach((id) => {
            rebatesToReject.push({
                rebate_id: id,
                claim_id: claimId,
                organization_id: activeBuilder?.builder_id,
                rejected_note: rejectionNote,
            });
        });
        rejectRebates({
            variables: {
                rebates: rebatesToReject,
            },
        });
        setShowModal(false);
    };

    const rejectionModal = () => {
        return (
            <>
                <Modal
                    title={"Reject Rebates"}
                    Content={
                        <RejectionModal
                            housesWithItsProducts={activeAddresses}
                            rebatesIds={rebatesIds}
                            setRebatesIds={setRebatesIds}
                            setRejectionNote={setRejectionNote}
                        />
                    }
                    submitLabel={"Reject"}
                    onSubmit={() => handleRejectRebates()}
                    width={"w-52"}
                    onClose={() => setShowModal(false)}
                    show={showModal}
                />
            </>
        );
    };

    return (
        <div
            className="flex-1 flex-col  flex items-stretch sm:flex-row  overflow-hidden"
            style={{ minHeight: "60vh", maxHeight: "60vh" }}
        >
            {rejectionModal()}
            <div className="flex-grow w-full max-w-8xl mx-auto 2xl:flex">
                <div className="flex-1 min-w-0 md:flex">
                    <div className=" flex-1 2xl:max-w-xs 3xl:max-w-md xl:flex-shrink-0  ">
                        <div className="h-full">
                            <div className="h-full relative">
                                <div className=" inset-0  border bg-white border-gray-200 h-full flex flex-col">
                                    <div className="flex flex-0 px-4 py-4  border-b justify-between items-center">
                                        <div className="font-title text-center text-secondary font-bold text-lg">
                                            {"Builders Claiming"}
                                        </div>
                                    </div>

                                    <div className="flex overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 w-full h-full">
                                        <div className="w-full  border-l border-white border-r sm:max-h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                            <ul className=" flex-0 w-full  overflow-auto">
                                                {claimLoading ? (
                                                    <Loader />
                                                ) : (
                                                    claim?.calculateCurrentTotal?.builderTotals?.map(
                                                        (eachData, key) => {
                                                            return (
                                                                <li
                                                                    key={key}
                                                                    onClick={() => handleBuilderClick(eachData)}
                                                                    className={`py-3 pl-3 transition-all border-b border-l-4  hover:border-l-6 hover:bg-gray-100 cursor-pointer ${
                                                                        activeBuilder?.builder_id ===
                                                                        eachData?.builder_id
                                                                            ? "border-l-gold border-l-6"
                                                                            : eachData?.disputed
                                                                            ? "border-l-brickRed"
                                                                            : "border-l-primary"
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
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sm:flex-1 flex">
                        <div className=" flex-1 ">
                            <div className="h-full relative  md:pr-3 lg:pr-0 xl:pr-3 2xl:pr-0">
                                <div className="inset-0  border  bg-white  h-full flex flex-col">
                                    <div className="flex flex-0 px-4 border-b justify-between items-center">
                                        <div className="py-4 font-title text-center text-secondary font-bold text-lg">
                                            Rebate Report {activeBuilder?.name ? ": " + activeBuilder?.name : ""}
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-1 overflow-auto w-full">
                                        <div
                                            className={`flex flex-col  h-full w-full scrollbar-thin overflow-hidden scrollbar-thumb-lightPrimary scrollbar-track-gray-400`}
                                        >
                                            {/*modal()*/}
                                            {(!rebatesList && activeBuilder) || builderClaimLoading ? (
                                                <Loader />
                                            ) : (
                                                rebatesList?.map((eachData, key) => {
                                                    return (
                                                        <>
                                                            <div
                                                                key={key}
                                                                className={`flex px-2 group justify-between py-3 w-full transition-all cursor-pointer border-b hover:border-l-6 ${
                                                                    activeAddresses.findIndex(
                                                                        (element) => element.id === eachData.house.id
                                                                    ) > -1
                                                                        ? "border-l-6 border-l-gold"
                                                                        : eachData?.disputed
                                                                        ? "border-l-4 border-l-brickRed"
                                                                        : "border-l-4 border-l-primary"
                                                                }`}
                                                                onClick={() => handleAccordianEachAddress(eachData)}
                                                            >
                                                                <div className="flex items-center">
                                                                    <input
                                                                        id="checkSearchedAddress"
                                                                        name="checkSearchedAddress"
                                                                        type="checkbox"
                                                                        onChange={() =>
                                                                            handleAccordianEachAddress(eachData)
                                                                        }
                                                                        checked={
                                                                            activeAddresses?.findIndex(
                                                                                (element) =>
                                                                                    element?.id === eachData?.house?.id
                                                                            ) > -1
                                                                        }
                                                                        className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                                                                    />

                                                                    <p className="text-sm px-2  font-semibold text-darkgray75 ">
                                                                        {eachData?.house?.lot_number
                                                                            ? eachData?.house?.lot_number +
                                                                              " | " +
                                                                              eachData?.house?.address +
                                                                              " " +
                                                                              eachData?.house?.address2
                                                                            : eachData?.house?.address +
                                                                              " " +
                                                                              eachData?.house?.address2}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </>
                                                    );
                                                })
                                            )}
                                        </div>
                                        <Button
                                            title="Reject Selected Rebates"
                                            color="yellow-600"
                                            onClick={() => setShowModal(true)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RejectionManagmentAccordion;
