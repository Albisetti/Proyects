import React from "react";

import Loader from "../../../../Loader/Loader";

const BuilderList = ({
    searchString,
    handleChange,
    searched,
    seaarchedBuilderLoading,
    searchedOrganizations,
    setSearchString,
    setSearched,
    active,
    lastsupplierElement,
    setActive,
    setActiveIsPeriodClosing,
    builderLoading,
    data,
}) => {
    return (
        <div
            className="bg-white rounded-lg col-span-9 lg:col-span-2"
            style={{
                maxHeight: "79vh",
            }}
        >
            <div className="h-full relative">
                <div className=" inset-0    border-gray-200 border rounded-r-none  rounded-lg h-full flex flex-col">
                    <div className="flex px-4 border-b-2  border-gray-400  items-center justify-between space-x-5">
                        <div className="min-w-0 flex-1   ppy-3 max-w-full">
                            <div className=" flex rounded-md shadow-sm">
                                <div className="relative flex items-stretch py-3 flex-grow focus-within:z-10">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                                    <input
                                        type="text"
                                        name="searchsupplier"
                                        value={searchString}
                                        id="searchsupplier"
                                        className="focus:ring-secondary focus:border-secondary block w-full rounded-md  sm:text-sm border-gray-300"
                                        placeholder="Find"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex  w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                        <div className="w-full border-r scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                            <ul className=" flex-0 w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400  overflow-auto border-l  border-white">
                                {searched && searchString?.length > 0 ? (
                                    seaarchedBuilderLoading ? (
                                        <Loader />
                                    ) : searchedOrganizations?.searchOrganizations?.edges?.length === 0 ? (
                                        <div className="border-b py-2 px-2 text-secondary font-title font-semibold flex items-center justify-between">
                                            <p> No Results Found </p>
                                            <span
                                                className="underline cursor-pointer text-brickRed"
                                                onClick={() => {
                                                    setSearchString("");
                                                    setSearched(false);
                                                }}
                                            >
                                                {" "}
                                                Reset{" "}
                                            </span>
                                        </div>
                                    ) : (
                                        searchedOrganizations &&
                                        searchedOrganizations.searchOrganizationsWithRebate &&
                                        searchedOrganizations.searchOrganizationsWithRebate.edges.length !== 0 &&
                                        searchedOrganizations.searchOrganizationsWithRebate.edges.map(
                                            (eachData, index) => {
                                                if (
                                                    index ===
                                                    searchedOrganizations.searchOrganizationsWithRebate.edges.length - 1
                                                ) {
                                                    return (
                                                        <li
                                                            className={`  border-b transition-all border-l-4  hover:border-l-6   ${
                                                                active === eachData.node.id
                                                                    ? "bg-gray-100 border-l-gold border-l-6  text-darkgray75 "
                                                                    : "text-darkgray75 border-l-primary"
                                                            }`}
                                                            ref={lastsupplierElement}
                                                            onClick={() => {
                                                                setActive(eachData?.node?.id);
                                                                setActiveIsPeriodClosing(
                                                                    eachData?.node?.isPeriodClosing
                                                                );
                                                            }}
                                                        >
                                                            <div className="relative  ">
                                                                <div className="text-sm py-3 px-2 font-semibold  ">
                                                                    <div to="#" className="  focus:outline-none">
                                                                        <span
                                                                            className="absolute inset-0"
                                                                            aria-hidden="true"
                                                                        ></span>
                                                                        {eachData.node.name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    );
                                                }

                                                return (
                                                    <li
                                                        className={`  border-b transition-all border-l-4   hover:border-l-6   ${
                                                            active === eachData.node.id
                                                                ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                : "text-darkgray75 border-l-primary"
                                                        }`}
                                                        onClick={() => {
                                                            setActive(eachData?.node?.id);
                                                            setActiveIsPeriodClosing(eachData?.node?.isPeriodClosing);
                                                        }}
                                                    >
                                                        <div className="relative  ">
                                                            <div className="text-sm py-3 px-2 font-semibold  ">
                                                                <div to="#" className="  focus:outline-none">
                                                                    <span
                                                                        className="absolute inset-0"
                                                                        aria-hidden="true"
                                                                    ></span>
                                                                    {eachData.node.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            }
                                        )
                                    )
                                ) : builderLoading ? (
                                    <Loader />
                                ) : (
                                    data &&
                                    data.organizationsWithRebate &&
                                    data.organizationsWithRebate.edges.length !== 0 &&
                                    data.organizationsWithRebate.edges.map((eachData, index) => {
                                        if (index === data.organizationsWithRebate.edges.length - 1) {
                                            return (
                                                <li
                                                    className={`  border-b transition-all  border-l-4    hover:border-l-6   ${
                                                        active === eachData.node.id
                                                            ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                            : "text-darkgray75 border-l-primary"
                                                    }`}
                                                    ref={lastsupplierElement}
                                                    onClick={() => {
                                                        setActive(eachData?.node?.id);
                                                        setActiveIsPeriodClosing(eachData?.node?.isPeriodClosing);
                                                    }}
                                                >
                                                    <div className="relative  ">
                                                        <div className="text-sm py-3 px-2 font-semibold ">
                                                            <div to="#" className="  focus:outline-none">
                                                                <span
                                                                    className="absolute inset-0"
                                                                    aria-hidden="true"
                                                                ></span>
                                                                {eachData.node.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        }

                                        return (
                                            <li
                                                className={`  border-b transition-all  border-l-4    hover:border-l-6  ${
                                                    active === eachData.node.id
                                                        ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                        : "text-darkgray75 border-l-primary"
                                                }`}
                                                onClick={() => {
                                                    setActive(eachData?.node?.id);
                                                    setActiveIsPeriodClosing(eachData?.node?.isPeriodClosing);
                                                }}
                                            >
                                                <div className="relative  ">
                                                    <div className="text-sm py-3 px-2 font-semibold  ">
                                                        <div to="#" className="  focus:outline-none">
                                                            <span
                                                                className="absolute inset-0"
                                                                aria-hidden="true"
                                                            ></span>
                                                            {eachData.node.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuilderList;
