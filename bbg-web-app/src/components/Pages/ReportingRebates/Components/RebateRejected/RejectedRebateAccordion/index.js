import React, { useState } from "react";
import Modal from "../../../../../Modal";
import RejectedModalContent from "../RejectedProductsModalContent";

const RejectedRebateAccordion = ({ houses }) => {
    const [modalProducts, setModalProducts] = useState();
    const [showModal, setShowModal] = useState(false);

    const findUniqueProductCount = (pivots) => {
        let productCodes = [];
        pivots?.forEach((item) => {
            if (!productCodes?.includes(item?.products?.bbg_product_code)) {
                productCodes?.push(item?.products?.bbg_product_code);
            }
        });
        let count = productCodes?.length;
        if (count > 0) {
            return count;
        }
        return 0;
    };

    const modal = () => {
        return (
            <>
                <Modal
                    title={"Products"}
                    width={"2xl"}
                    minHeight={"min-h-smallMin"}
                    Content={rejectedModalContent()}
                    submitLabelColor={"primary"}
                    submitLabel={"Close"}
                    onSubmit={() => setShowModal(false)}
                    onClose={() => setShowModal(false)}
                    IconJSX={null}
                    show={showModal}
                />
            </>
        );
    };

    const rejectedModalContent = () => {
        return <RejectedModalContent products={modalProducts} />;
    };

    const handleModal = (houses) => {
        setModalProducts(
            // eslint-disable-next-line
            houses?.pivots
                ?.map((item) => {
                    if (item.status === "REJECTED") {
                        let object = {};
                        object = { ...item?.products };
                        object.product_quantity = item?.product_quantity;
                        return object;
                    } else {
                        return null;
                    }
                })
                .filter((item) => item !== undefined)
        );
        setShowModal(true);
    };

    return (
        <div className="flex flex-col w-full items-start justify-start bg-white ">
            {modal()}
            <div className={`w-full scrollbar-thumb-lightPrimary scrollbar-track-gray-400 `}>
                <div className={"border-l border-b border-l-white"}>
                    {houses?.map((item, index) => {
                        return (
                            <div
                                className={`flex group py-1 justify-between items-center w-full text-center transition-all  border-l-4 hover:border-l-6bg-white border-primary`}
                                key={index}
                            >
                                <div className="flex w-full items-center pl-4">
                                    <div className="flex w-full">
                                        <div className="flex w-full  flex-1 items-start">
                                            <div className={` w-full text-sm py-2 px-2`}>
                                                <div className="flex flex-col items-start justify-start">
                                                    {item?.node?.model?.lot_number && (
                                                        <p className="font-semibold text-gray-500">
                                                            Lot: {item?.node?.model?.lot_number}
                                                        </p>
                                                    )}
                                                    {item?.node?.model?.address2 ? (
                                                        <p className="font-semibold text-gray-500 whitespace-nowrap">
                                                            {item?.node?.model?.address2} - {item?.node?.model?.address}
                                                        </p>
                                                    ) : (
                                                        <p className="font-semibold text-gray-500 whitespace-nowrap">
                                                            {item?.node?.model?.address}
                                                        </p>
                                                    )}
                                                    {item?.node?.model?.project_number && (
                                                        <p className="text-gray-500">
                                                            Project: {item?.node?.model?.project_number}
                                                        </p>
                                                    )}
                                                    {item?.node?.model?.model && (
                                                        <p className="text-gray-500 capitalize">
                                                            Build Model: {item?.node?.model?.model}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div
                                                className="w-full cursor-pointer px-2 flex justify-start py-2 text-lg font-title font-semibold text-darkgray75 hover:text-secondary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleModal(item.node);
                                                }}
                                            >
                                                <div className="underline">
                                                    {" "}
                                                    {findUniqueProductCount(item?.node?.pivots) > 1
                                                        ? findUniqueProductCount(item?.node?.pivots) + " Product Codes"
                                                        : findUniqueProductCount(item?.node?.pivots) +
                                                          " Product Code"}{" "}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RejectedRebateAccordion;
