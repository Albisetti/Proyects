import { useMutation, useLazyQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { DELETE_PRODUCT_ADDRESS, GET_INDIVIDUAL_REBATE } from "../../lib/addresses";
import Button from "../Buttons";

const RebateReportingAccordian = ({
    Data,
    onClick,
    fromAddress,
    closeAccordian = true,
    revealSearch,
    products,
    rebateReport,
    activeAddresses,
    DataArray,
    handleAccordianEachAddress,
    subdivisionId,
    subdivisionName,
    reportId,
    cleanUpAction,
    refetchProp,
    selectableProducts,
    productsToAdd,
    setProductsToAdd,
    allHousesAndProducts,
    hideClaimed,
}) => {
    const [clicked, setClicked] = useState([]);
    const [houseId, setHouseId] = useState();
    const [productIds, setProductIds] = useState();
    const [refreshedRebates, setRefreshedRebates] = useState({});
    const [mutation, setMutation] = useState(false);

    const requiredProofPoints = [
        { name: "require_brand", label: "Brand", productKey: "product_brand" },
        { name: "require_serial_number", label: "Serial Number", productKey: "product_serial_number" },
        { name: "require_model_number", label: "Model Number", productKey: "product_model_number" },
        {
            name: "require_date_of_installation",
            label: "Date of Installation",
            productKey: "product_date_of_installation",
        },
        { name: "require_date_of_purchase", label: "Date of Purchase", productKey: "product_date_of_purchase" },
        { name: "require_distributor", label: "Subcontractor/Distributor/Provider", productKey: "subcontractor_id" },
    ];

    const toggle = (index) => {
        if (clicked.includes(index)) {
            //if clicked question is already active, then close it
            setClicked(clicked.filter((item) => item !== index));
        } else {
            setClicked([...clicked, index]);
        }
    };

    useEffect(() => {
        if (revealSearch) {
            const updateScroll = function (e) {
                if (e.deltaY < 0) {
                    revealSearch();
                }
            };
            window.addEventListener("wheel", updateScroll);
            return function () {
                window.removeEventListener("wheel", updateScroll);
            };
        }
        // eslint-disable-next-line
    }, []);

    const houseCount = (index) => {
        let houseArray = DataArray?.houses?.edges?.filter((item) => item?.node?.model?.id === index);
        let productCode = [];
        houseArray?.[0]?.node?.pivots?.forEach((item) => {
            if (!productCode?.includes(item?.bbg_product_code)) {
                productCode.push(item?.bbg_product_code);
            }
        });

        let count = productCode?.length;
        if (count > 0) {
            return count;
        }
        return 0;
    };

    const removeProduct = (productId, houseId) => {
        setProductIds([productId]);
        setHouseId(houseId);
        setMutation(true);
    };

    const handleChangeProductCheckbox = (key, value) => {
        setProductsToAdd({ ...productsToAdd, [key]: value });
    };

    const handleAccordianEachAddressProofPoints = (houseId, checked) => {
        let objectProductsToAdd;
        allHousesAndProducts?.[houseId]?.forEach((eachData) => {
            objectProductsToAdd = { ...objectProductsToAdd, [eachData?.id]: checked };
        });
        setProductsToAdd({ ...productsToAdd, ...objectProductsToAdd });
    };

    const proofPointCheckboxChecked = (id) => {
        if (productsToAdd[id] === true) {
            return true;
        } else {
            return false;
        }
    };

    const proofPointHouseCheckboxChecked = (id) => {
        if (!Array.isArray(products?.[id])) return null;
        let checked = false;
        products?.[id]?.forEach((eachData) => {
            if (productsToAdd[eachData?.id] === true) {
                checked = true;
            } else {
                checked = false;
            }
        });

        return checked;
    };

    useEffect(() => {
        if (mutation === true) {
            unassignProduct({
                variables: {
                    report_id: reportId,
                    house_id: houseId,
                    product_ids: productIds,
                },
            });
        }
        // eslint-disable-next-line
    }, [mutation]);

    const [unassignProduct] = useMutation(DELETE_PRODUCT_ADDRESS, {
        update(cache, result) {
            setMutation(false);
            setClicked([]);
            toast.success("Product removed successfully.");
            setHouseId("");
            setProductIds([]);
            refetchProp(subdivisionId, houseId, productIds);
        },
    });

    const [getRebateData] = useLazyQuery(GET_INDIVIDUAL_REBATE, {
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange: false,
        onCompleted: (result) => {
            let newObj = {};
            newObj[result?.IndividualRebate?.id] = { ...result?.IndividualRebate };
            setRefreshedRebates({ ...refreshedRebates, ...newObj });
        },
    });

    const productsComponent = (id) => {
        return (
            <div className="w-full max-h-partial xl:max-h-smallMin sm:max-h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                <ul className=" flex-0 w-full  overflow-auto border-l  border-r border-white ">
                    {products &&
                        products?.[id] &&
                        products?.[id]?.map((eachData) => {
                            if (
                                (eachData.rebate_status === "COMPLETED" || eachData.rebate_status === "REJECTED") &&
                                hideClaimed
                            )
                                return null;
                            return (
                                <li
                                    className={`bg-gray-50 pl-1 px-4 py-2 transition-all border-t  hover:border-l-6 border-l-gold border-l-6`}
                                >
                                    <div className=" px-6 flex text-xs text-gray-500 italic">
                                        {eachData?.product_categories_name}
                                    </div>
                                    <div className="group relative flex items-center">
                                        <div className="flex items-center h-5">
                                            {selectableProducts && (
                                                <input
                                                    id={`${eachData?.product_name}`}
                                                    name={`${eachData?.product_name}`}
                                                    type="checkbox"
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(event) =>
                                                        handleChangeProductCheckbox(
                                                            eachData?.id,
                                                            event?.target?.checked
                                                        )
                                                    }
                                                    checked={proofPointCheckboxChecked(eachData?.id)}
                                                    className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                                                />
                                            )}
                                        </div>
                                        <div className="text-sm flex-1 ml-2 font-semibold text-gray-500">
                                            <Link to="#" className="  focus:outline-none">
                                                <span className="" aria-hidden="true"></span>
                                                {eachData?.bbg_product_code
                                                    ? eachData?.bbg_product_code + " - "
                                                    : ""}{" "}
                                                {eachData?.product_name}{" "}
                                                {eachData?.product_quantity && eachData?.require_quantity_reporting ? (
                                                    <p className="text-sm font-medium  text-secondary">
                                                        {" "}
                                                        Qty: {eachData?.product_quantity}{" "}
                                                    </p>
                                                ) : null}
                                            </Link>
                                        </div>
                                        {selectableProducts ? (
                                            <div className="text-xs flex-1 ml-2 font-light text-gray-500 mr-1">
                                                <p className="text-md font-medium nobr">
                                                    <span className="text-green-500">Required </span>&
                                                    <span className="text-brickRed"> Missing </span>
                                                    proof points:
                                                </p>
                                                <p>
                                                    {requiredProofPoints.map((proofPoint, index) => {
                                                        let element;
                                                        eachData.programs.some((program) => {
                                                            if (program[proofPoint.name]) {
                                                                if (
                                                                    eachData[proofPoint.productKey] ||
                                                                    (refreshedRebates[eachData?.id] &&
                                                                        refreshedRebates[eachData?.id][
                                                                            proofPoint.productKey
                                                                        ])
                                                                ) {
                                                                    element = (
                                                                        <span className="text-green-500">
                                                                            {" "}
                                                                            {index !== 0 ? " - " : null}
                                                                            {proofPoint.label}
                                                                        </span>
                                                                    );
                                                                    return true;
                                                                } else {
                                                                    element = (
                                                                        <span className="text-brickRed">
                                                                            {index !== 0 ? " - " : null}
                                                                            {proofPoint.label}
                                                                        </span>
                                                                    );
                                                                    return true;
                                                                }
                                                            }
                                                            return false;
                                                        });
                                                        return element;
                                                    })}
                                                </p>
                                                <p className="text-md font-medium nobr mt-2">Current Proof Points:</p>
                                                <p>
                                                    {requiredProofPoints.map((proofPoint, index) => {
                                                        if (
                                                            !eachData[proofPoint.productKey] &&
                                                            !refreshedRebates[eachData?.id]
                                                        )
                                                            return null;
                                                        if (
                                                            refreshedRebates[eachData?.id] &&
                                                            !refreshedRebates[eachData?.id][proofPoint.productKey]
                                                        )
                                                            return null;
                                                        if (proofPoint.productKey === "subcontractor_id")
                                                            return (
                                                                <p>
                                                                    {" "}
                                                                    {proofPoint.label}:{" "}
                                                                    {refreshedRebates[eachData?.id]
                                                                        ? refreshedRebates[eachData?.id][
                                                                              proofPoint.productKey
                                                                          ] !== null
                                                                            ? "Subcontractor Assigned"
                                                                            : null
                                                                        : eachData[proofPoint.productKey] !== null
                                                                        ? "Subcontractor Assigned"
                                                                        : null}
                                                                </p>
                                                            );
                                                        return (
                                                            <p>
                                                                {" "}
                                                                {proofPoint.label}:{" "}
                                                                {refreshedRebates[eachData?.id]
                                                                    ? refreshedRebates[eachData?.id][
                                                                          proofPoint.productKey
                                                                      ]
                                                                    : eachData[proofPoint.productKey]}
                                                            </p>
                                                        );
                                                    })}
                                                </p>
                                                <Button
                                                    parentClass={"ml-2 md:ml-0"}
                                                    title={"Refresh"}
                                                    color={"primary"}
                                                    onClick={() => {
                                                        getRebateData({ variables: { rebate_id: eachData?.id } });
                                                    }}
                                                />
                                            </div>
                                        ) : null}

                                        {!eachData?.claimed ? (
                                            eachData?.isModifiable ? (
                                                <div
                                                    className="mr-3 cursor-pointer"
                                                    onClick={() => {
                                                        if (eachData?.isModifiable) {
                                                            removeProduct(eachData?.product_id, id);
                                                        } else {
                                                            toast.warning("You can't delete this product currently");
                                                        }
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
                                            ) : (
                                                <p className="text-sm font-medium  text-secondary">Claimed</p>
                                            )
                                        ) : (
                                            <p className="text-sm font-medium  text-secondary">Claimed</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        {eachData?.programs?.length > 0 &&
                                            eachData?.programs?.map((item) => {
                                                return (
                                                    <p className="px-6 flex text-xs text-gray-500">
                                                        {item?.program_name}
                                                    </p>
                                                );
                                            })}
                                    </div>
                                </li>
                            );
                        })}
                </ul>
            </div>
        );
    };

    return (
        <div className="flex flex-col w-full items-start justify-start bg-white">
            <div
                className={`overflow-auto w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 `}
            >
                {Data &&
                    Data.length !== 0 &&
                    Data.map((item, index) => {
                        return (
                            <div className={` ${rebateReport ? "border-l border-b border-l-white" : "border-b"}`}>
                                <div
                                    className={`flex group py-1 justify-between items-center w-full text-center cursor-pointer transition-all  border-l-4 hover:border-l-6  ${
                                        clicked.includes(index) && closeAccordian
                                            ? "bg-gray-100 border-l-6 border-gold"
                                            : "bg-white border-primary"
                                    } `}
                                    onClick={() => {
                                        onClick(item.node.id, item);
                                        toggle(index);
                                    }}
                                    key={index}
                                >
                                    <div className="flex w-full items-center pl-4">
                                        <div className="flex items-center h-5">
                                            {selectableProducts ? (
                                                <input
                                                    id={`checkHouse-${item?.node?.id}`}
                                                    name={`checkHouse-${item?.node?.id}`}
                                                    type="checkbox"
                                                    checked={proofPointHouseCheckboxChecked(item.node.id)}
                                                    onClick={(event) => {
                                                        handleAccordianEachAddressProofPoints(
                                                            item?.node?.id,
                                                            event?.target?.checked
                                                        );
                                                    }}
                                                    className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                                                />
                                            ) : (
                                                <input
                                                    id="checkSubdivision"
                                                    name="checkSubdivision"
                                                    type="checkbox"
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(event) => {
                                                        if (selectableProducts) {
                                                            handleAccordianEachAddressProofPoints(
                                                                item?.node?.id,
                                                                event?.target?.checked
                                                            );
                                                        } else {
                                                            handleAccordianEachAddress({
                                                                ...item.node,
                                                                subdivisionName: subdivisionName,
                                                                subdivisionId: subdivisionId,
                                                            });
                                                        }
                                                    }}
                                                    checked={
                                                        activeAddresses?.findIndex(
                                                            (element) => element?.id === item?.node?.id
                                                        ) > -1
                                                    }
                                                    className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-1 w-full">
                                            <div
                                                className={`py-2 px-2 text-sm flex w-full ${
                                                    fromAddress && rebateReport ? "px-2" : "px-2"
                                                }`}
                                            >
                                                {fromAddress ? (
                                                    <div className="flex flex-col items-start w-full">
                                                        {item?.node?.lot_number ? (
                                                            <p className="font-semibold text-gray-500">
                                                                Lot: {item?.node?.lot_number}
                                                            </p>
                                                        ) : null}

                                                        {item?.node?.address2 !== null &&
                                                        item?.node?.address2?.trim() !== "" ? (
                                                            <div className="flex justify-between w-full">
                                                                <p className="font-semibold text-gray-500">
                                                                    {item?.node?.address2}{" "}
                                                                    {item?.node?.address
                                                                        ? " - " + item?.node?.address
                                                                        : ""}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="flex justify-between w-full">
                                                                <p className="font-semibold text-gray-500">
                                                                    {item?.node?.address} ({houseCount(item.node.id)}){" "}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {item?.node?.project_number ? (
                                                            <p className="text-gray-500 text-xs">
                                                                Project: {item?.node?.project_number}
                                                            </p>
                                                        ) : null}
                                                        {item?.node?.model ? (
                                                            <p className="text-gray-500 capitalize text-xs">
                                                                Build Model: {item?.node?.model}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                ) : (
                                                    <p> {item?.node?.name} </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center w-full justify-end ">
                                        <p className=" text-secondary text-sm ">
                                            {houseCount(item.node.id) > 1
                                                ? `(${houseCount(item.node.id)} Product Codes)`
                                                : `(${houseCount(item.node.id)} Product Code)`}
                                        </p>
                                        <span className="mr-5 ml-3">
                                            {clicked.includes(index) && closeAccordian ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6 text-secondary"
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
                                            ) : null}
                                            {!clicked.includes(index) ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="opacity-0 transition-opacity duration-150 h-6 w-6 group-hover:opacity-100 text-secondary"
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
                                            ) : null}
                                        </span>
                                    </div>
                                </div>
                                {clicked.includes(index) && closeAccordian ? productsComponent(item.node.id) : null}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default RebateReportingAccordian;
