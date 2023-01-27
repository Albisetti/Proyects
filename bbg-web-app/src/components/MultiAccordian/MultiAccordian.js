import React, { useState, useEffect } from "react";
import { sortSubdivisionNames } from "../../util/sort";
import RebateReportingAccordian from "./RebateReportingAccordian";

const MultiAccordian = ({
    Data,
    fromAddress,
    closeAccordian = true,
    handleAccordianEachAddress,
    handleAccordianSubdivisionAddresses,
    activeAddresses,
    subdivisions,
    cleanUpAction,
    refetch,
    uniqueHouses,
    search,
    productSearch,
    selectableProducts,
    productsToAdd,
    setProductsToAdd,
    hideClaimed,
}) => {
    const [clicked, setClicked] = useState([]);
    const [accordianHouseClick, setAccordianHouseClick] = useState({});
    const [allHousesAndProducts, setAllHousesAndProducts] = useState({});

    const toggle = (index) => {
        if (clicked.includes(index)) {
            //if clicked question is already active, then close it
            setClicked(clicked.filter((item) => item !== index));
        } else {
            setClicked([...clicked, index]);
        }
    };

    useEffect(() => {
        if (!selectableProducts) return null;
        let housesAndProducts = {};
        Data?.houses?.edges?.forEach((house) => {
            housesAndProducts = {
                ...housesAndProducts,
                [house?.node?.model?.id]: house?.node?.pivots,
            };
        });
        setAllHousesAndProducts(housesAndProducts);
        // eslint-disable-next-line
    }, [Data]);

    const houseClick = (index, data) => {
        let houseId = data.node.id;
        let houseArray = Data?.houses?.edges.filter((item) => item?.node?.model?.id === houseId);
        setAccordianHouseClick({
            ...accordianHouseClick,
            [index]: houseArray && houseArray.length > 0 && houseArray[0]?.node?.pivots,
        });
    };

    const handleAccordianSubdivisionAddProofPoints = (node, checked) => {
        let objectProductsToAdd;
        node?.forEach((subdivisionHouse) => {
            Data?.houses?.edges?.forEach((house) => {
                if (house?.node?.model?.id === subdivisionHouse?.node?.id)
                    house?.node?.pivots?.forEach((pivot) => {
                        objectProductsToAdd = { ...objectProductsToAdd, [pivot?.id]: checked };
                    });
            });
        });
        setProductsToAdd({ ...productsToAdd, ...objectProductsToAdd });
    };

    const component = (node, subdivisionName, subdivisionId) => {
        return (
            <RebateReportingAccordian
                Data={node}
                fromAddress
                rebateReport
                onClick={(index, data) => {
                    houseClick(index, data);
                }}
                uniqueHouses={uniqueHouses}
                subdivisionName={subdivisionName}
                subdivisionId={subdivisionId}
                cleanUpAction={cleanUpAction}
                reportId={Data?.id}
                refetchProp={refetch}
                DataArray={Data}
                products={accordianHouseClick}
                handleAccordianEachAddress={handleAccordianEachAddress}
                activeAddresses={activeAddresses}
                selectableProducts={selectableProducts}
                productsToAdd={productsToAdd}
                setProductsToAdd={setProductsToAdd}
                allHousesAndProducts={allHousesAndProducts}
                hideClaimed={hideClaimed}
            />
        );
    };

    return (
        <div className="flex flex-col w-full items-start justify-start bg-white">
            <div
                style={{ marginBottom: "94px" }}
                className={`overflow-auto w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400`}
            >
                {sortSubdivisionNames(subdivisions?.activeSubdivisions?.edges)?.map((item, index) => {
                    let checked =
                        item.node.houses.edges.length > 0 &&
                        item.node.houses.edges
                            .map((item) => parseInt(item.node.id))
                            .every((val) => activeAddresses?.map((item) => parseInt(item.id)).includes(val));
                    let uniquePerHouse;
                    if (uniqueHouses?.length > 0) {
                        uniquePerHouse = item?.node?.houses?.edges
                            ?.map((house) => uniqueHouses?.includes(house.node.id))
                            ?.filter((item) => item === true);
                    }
                    if (hideClaimed && Data) {
                        let hideHouse = false;
                        item?.node?.houses?.edges?.forEach((house) => {
                            Data?.houses?.edges.forEach((houseData) => {
                                if (houseData?.node?.model?.id === house?.node?.id) {
                                    houseData?.node?.pivots?.forEach((rebate) => {
                                        if (
                                            rebate?.status === "COMPLETED" ||
                                            rebate?.status === "REJECTED" ||
                                            rebate.claimed
                                        ) {
                                            hideHouse = true;
                                        }
                                    });
                                }
                            });
                        });
                        if (hideHouse) return null;
                    }
                    return (
                        <div className={`border-b`}>
                            <div
                                className={`flex group py-1 justify-between items-center w-full text-center cursor-pointer transition-all  border-l-4 hover:border-l-6 ${
                                    clicked.includes(index) && closeAccordian
                                        ? "bg-gray-300 border-l-6 border-gold"
                                        : "bg-white border-primary"
                                }`}
                                onClick={() => {
                                    toggle(index);
                                }}
                                key={index}
                            >
                                <div className="flex w-full items-center px-2">
                                    <div className="flex items-center h-5">
                                        {selectableProducts === true ? (
                                            <input
                                                id="checkSubdivision"
                                                name="checkSubdivision"
                                                type="checkbox"
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(event) => {
                                                    if (selectableProducts) {
                                                        handleAccordianSubdivisionAddProofPoints(
                                                            item?.node?.houses?.edges,
                                                            event?.target?.checked
                                                        );
                                                    } else {
                                                        handleAccordianSubdivisionAddresses(item.node, checked);
                                                    }
                                                }}
                                                className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                                            />
                                        ) : (
                                            <input
                                                id="checkSubdivision"
                                                name="checkSubdivision"
                                                type="checkbox"
                                                checked={checked}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(event) => {
                                                    if (selectableProducts) {
                                                        handleAccordianSubdivisionAddProofPoints(
                                                            item?.node?.houses?.edges,
                                                            event?.target?.checked
                                                        );
                                                    } else {
                                                        handleAccordianSubdivisionAddresses(item.node, checked);
                                                    }
                                                }}
                                                className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                                            />
                                        )}
                                    </div>
                                    <div className="py-2 px-2 w-full flex justify-between text-sm text-darkgray75 font-semibold">
                                        <p className="">{item?.node?.name}</p>
                                        <div className={`grid grid-cols-2 `}>
                                            <span
                                                className={`place-self-start text-secondary font-normal ${
                                                    item?.node?.houses?.edges?.length < 2 ? "pr-3" : ""
                                                }`}
                                            >
                                                {" "}
                                                <p>
                                                    {" "}
                                                    {item?.node?.houses?.edges?.length > 1 || uniquePerHouse?.length > 1
                                                        ? `( ${
                                                              uniquePerHouse?.length && productSearch
                                                                  ? `Found in ${uniquePerHouse?.length} of`
                                                                  : ""
                                                          } ${item?.node?.houses?.edges?.length} Properties)`
                                                        : `( ${
                                                              uniquePerHouse?.length && productSearch
                                                                  ? `Found in ${uniqueHouses?.length} of`
                                                                  : ""
                                                          } ${item?.node?.houses?.edges?.length} Property)`}{" "}
                                                </p>
                                            </span>
                                            <span className=" place-self-end">
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
                                </div>
                            </div>
                            {clicked.includes(index) && closeAccordian ? (
                                <div className="bg-red w-full  flex flex-col justify-around items-center transition-all duration-1000 ">
                                    {component(
                                        search
                                            ? item?.node?.houses?.edges?.filter((house) =>
                                                  uniqueHouses?.includes(house.node.id)
                                              )
                                            : item?.node?.houses?.edges,
                                        item?.node?.name,
                                        item?.node?.id
                                    )}
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MultiAccordian;
