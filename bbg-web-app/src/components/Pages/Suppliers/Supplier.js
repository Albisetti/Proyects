import React, { useState, useRef, useCallback,useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useLazyQuery } from "@apollo/client";
import { Helmet } from "react-helmet";
import CreateSupplier from "./CreateSupplier";
import Loader from "../../Loader/Loader";
import {
    FETCH_ORGANIZATIONS_QUERY,
    SEARCH_ORGANIZATIONS_QUERY,
} from "../../../lib/organization";
import HelperModal from "../../Modal/HelperModal";
import { useDebounce } from "../../../util/hooks";
import {APP_TITLE} from "../../../util/constants";

const Supplier = () => {
    const [secondColumn, setSecondColumn] = useState(false);
    const [edit, setEdit] = useState();
    const [searchString, setSearchString] = useState("");
    const [userData, setUserData] = useState();
    const [searched, setSearched] = useState();
    const [active, setActive] = useState();
    const [actualSearchString, setActualSearchString] = useState("");
    const [clickedNew, setClickedNew] = useState(false);
    const first = 20;
    const supplierObserver = useRef();

    // eslint-disable-next-line
    const lastsupplierElement = useCallback((node) => {
        if (supplierObserver.current) supplierObserver.current.disconnect();
        supplierObserver.current = new IntersectionObserver((entries) => {
            if (
                entries[0].isIntersecting &&
                data.organizations.pageInfo.hasNextPage
            ) {
                fetchMore({
                    variables: {
                        first,
                        after: data.organizations.pageInfo.endCursor,
                    },
                });
            }
        });
        if (node) supplierObserver.current.observe(node);
    });

    const { data, fetchMore, loading: supplierLoading } = useQuery(
        FETCH_ORGANIZATIONS_QUERY,
        {
            variables: {
                organization_type: ["SUPPLIERS", "MANUFACTURERS"],
                first:20
            },
            fetchPolicy:"network-only",
            notifyOnNetworkStatusChange: false,
        }
    );

    const debouncedValue =  useDebounce(searchString,160);

    useEffect(() => {
        
        if (searchString?.length > 2) {
            setSearched(true);
            searchsuppliers();
        }
       // eslint-disable-next-line
    }, [debouncedValue])


    const [
        searchsuppliers,
        { data: searchedsuppliers, loading: searchedSubLoading },
    ] = useLazyQuery(SEARCH_ORGANIZATIONS_QUERY, {
        variables: {
            search: debouncedValue,
            organization_type: ["SUPPLIERS", "MANUFACTURERS"],
        },
        notifyOnNetworkStatusChange: false,
    });

    const handleChange = (e) => {
        setSearchString(e.target.value);
    };

    const setData = (eachUser) => {
        setActive(eachUser.id);
        setSecondColumn(true);
        setEdit(true);
        setUserData(eachUser);
        setSearchString("");
        setActualSearchString("");
    };

    const createNew = () => {
        setActive("");
        setSecondColumn(true);
        setUserData({});
        setEdit(false);
        setClickedNew(true);
        setSearched(false);

        if (
            secondColumn !== true ||
            edit ||
            actualSearchString !== searchString
        ) {
            setActualSearchString(searchString);
            setSearchString("");
        }
    };

    return (
        <div className="h-full flex-1 pb-5">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Manage Manufacturers & Suppliers</title>
            </Helmet>
            <div className="flex flex-col h-full">
                <main className="flex-1">
                    <div className="max-w-8xl flex flex-col h-full w-8xl mx-auto px-4 sm:px-6 lg:px-32">
                        <div className=" flex flex-col h-full gap-5 xl:flex-row rounded-lg">
                            <div className="w-full">
                                <div className="grid gap-5 grid-cols-9 min-h-layout  overflow-hidden">
                                    <div className="col-span-9 bg-white rounded-lg py-4 px-4 h1 flex">
                                        <p>
                                            {" "}
                                            Manage Manufacturers & Suppliers{" "}
                                        </p>

                                        <HelperModal
                                            type={"suppliers"}
                                            title="Manufacturers/Supplier Information"
                                        />
                                    </div>

                                    <div
                                        className="bg-white rounded-lg col-span-9 lg:col-span-2"
                                        style={{
                                            maxHeight: "79vh",
                                        }}
                                    >
                                        <div className="h-full relative">
                                            <div className=" inset-0    border-gray-200  rounded-lg h-full flex flex-col">
                                                <div className="flex px-4 border-b-2 border-gray-400  items-center justify-between space-x-5">
                                                    <div className="min-w-0 flex-1  py-3 max-w-full">
                                                        <div className=" flex rounded-md shadow-sm">
                                                            <div className="relative flex items-stretch flex-grow focus-within:z-10">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                                                                <input
                                                                    type="text"
                                                                    name="searchsupplier"
                                                                    value={
                                                                        searchString
                                                                    }
                                                                    id="searchsupplier"
                                                                    className="focus:ring-secondary focus:border-secondary block w-full rounded-md  sm:text-sm border-gray-300"
                                                                    placeholder="Find or Add"
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {searched === true &&  searchedsuppliers
                                                                  ?.searchOrganizations
                                                                  ?.pageInfo
                                                                  ?.total === 0 ? (
                                                        <div className="">
                                                            <button
                                                                type="button"
                                                                className="text-lg py-3 mr-3 border-transparent   font-medium rounded-md text-secondary focus:outline-none"
                                                                onClick={() =>
                                                                    createNew()
                                                                }
                                                            >
                                                                <svg
                                                                    className="w-8 h-8"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ) : null}
                                                </div>

                                                <div className="flex  w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                    <div className="w-full border-r scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                        <ul className=" flex-0 w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400  overflow-auto border-l  border-white">
                                                            {searched &&
                                                            searchString?.length >
                                                                0 ? (
                                                                searchedSubLoading ? (
                                                                    <Loader />
                                                                ) : searchedsuppliers
                                                                      ?.searchOrganizations
                                                                      ?.edges
                                                                      ?.length ===
                                                                  0 ? (
                                                                    <div className="border-b py-2 px-2 text-secondary font-title font-semibold flex items-center justify-between">
                                                                        <p>
                                                                            {" "}
                                                                            No
                                                                            Results
                                                                            Found{" "}
                                                                        </p>
                                                                        <span
                                                                            className="underline cursor-pointer text-brickRed"
                                                                            onClick={() => {
                                                                                setSearchString(
                                                                                    ""
                                                                                );
                                                                                setSearched(
                                                                                    false
                                                                                );
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            Reset{" "}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    searchedsuppliers &&
                                                                    searchedsuppliers.searchOrganizations &&
                                                                    searchedsuppliers
                                                                        .searchOrganizations
                                                                        .edges
                                                                        .length !==
                                                                        0 &&
                                                                    searchedsuppliers.searchOrganizations.edges.map(
                                                                        (
                                                                            eachData,
                                                                            index
                                                                        ) => {
                                                                            if (
                                                                                index ===
                                                                                searchedsuppliers
                                                                                    .searchOrganizations
                                                                                    .edges
                                                                                    .length -
                                                                                    1
                                                                            ) {
                                                                                return (
                                                                                    <li
                                                                                        className={`  border-b transition-all border-l-4  hover:border-l-6   ${
                                                                                            active ===
                                                                                            eachData
                                                                                                .node
                                                                                                .id
                                                                                                ? "bg-gray-100 border-l-gold border-l-6  text-darkgray75 "
                                                                                                : "text-darkgray75 border-l-primary"
                                                                                        }`}
                                                                                        onClick={() =>
                                                                                            setData(
                                                                                                eachData.node
                                                                                            )
                                                                                        }
                                                                                        ref={
                                                                                            lastsupplierElement
                                                                                        }
                                                                                    >
                                                                                        <div className="relative  ">
                                                                                            <p className="text-sm py-3 px-2 font-semibold  ">
                                                                                                <Link
                                                                                                    to="#"
                                                                                                    className="  focus:outline-none"
                                                                                                >
                                                                                                    <span
                                                                                                        className="absolute inset-0"
                                                                                                        aria-hidden="true"
                                                                                                    ></span>
                                                                                                    {
                                                                                                        eachData
                                                                                                            .node
                                                                                                            .name
                                                                                                    }
                                                                                                </Link>
                                                                                            </p>
                                                                                        </div>
                                                                                    </li>
                                                                                );
                                                                            }
                                                                            return (
                                                                                <li
                                                                                    className={`  border-b transition-all border-l-4   hover:border-l-6   ${
                                                                                        active ===
                                                                                        eachData
                                                                                            .node
                                                                                            .id
                                                                                            ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                                            : "text-darkgray75 border-l-primary"
                                                                                    }`}
                                                                                    onClick={() =>
                                                                                        setData(
                                                                                            eachData.node
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="relative  ">
                                                                                        <p className="text-sm py-3 px-2 font-semibold  ">
                                                                                            <Link
                                                                                                to="#"
                                                                                                className="  focus:outline-none"
                                                                                            >
                                                                                                <span
                                                                                                    className="absolute inset-0"
                                                                                                    aria-hidden="true"
                                                                                                ></span>
                                                                                                {
                                                                                                    eachData
                                                                                                        .node
                                                                                                        .name
                                                                                                }
                                                                                            </Link>
                                                                                        </p>
                                                                                    </div>
                                                                                </li>
                                                                            );
                                                                        }
                                                                    )
                                                                )
                                                            ) : supplierLoading ? (
                                                                <Loader />
                                                            ) : (
                                                                data &&
                                                                data.organizations &&
                                                                data
                                                                    .organizations
                                                                    .edges
                                                                    .length !==
                                                                    0 &&
                                                                data.organizations.edges.map(
                                                                    (
                                                                        eachData,
                                                                        index
                                                                    ) => {
                                                                        if (
                                                                            index ===
                                                                            data
                                                                                .organizations
                                                                                .edges
                                                                                .length -
                                                                                1
                                                                        ) {
                                                                            return (
                                                                                <li
                                                                                    className={`  border-b transition-all  border-l-4    hover:border-l-6   ${
                                                                                        active ===
                                                                                        eachData
                                                                                            .node
                                                                                            .id
                                                                                            ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                                            : "text-darkgray75 border-l-primary"
                                                                                    }`}
                                                                                    onClick={() =>
                                                                                        setData(
                                                                                            eachData.node
                                                                                        )
                                                                                    }
                                                                                    ref={
                                                                                        lastsupplierElement
                                                                                    }
                                                                                >
                                                                                    <div className="relative  ">
                                                                                        <p className="text-sm py-3 px-2 font-semibold ">
                                                                                            <Link
                                                                                                to="#"
                                                                                                className="  focus:outline-none"
                                                                                            >
                                                                                                <span
                                                                                                    className="absolute inset-0"
                                                                                                    aria-hidden="true"
                                                                                                ></span>
                                                                                                {
                                                                                                    eachData
                                                                                                        .node
                                                                                                        .name
                                                                                                }
                                                                                            </Link>
                                                                                        </p>
                                                                                    </div>
                                                                                </li>
                                                                            );
                                                                        }
                                                                        return (
                                                                            <li
                                                                                className={`  border-b transition-all  border-l-4    hover:border-l-6  ${
                                                                                    active ===
                                                                                    eachData
                                                                                        .node
                                                                                        .id
                                                                                        ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                                        : "text-darkgray75 border-l-primary"
                                                                                }`}
                                                                                onClick={() =>
                                                                                    setData(
                                                                                        eachData.node
                                                                                    )
                                                                                }
                                                                            >
                                                                                <div className="relative  ">
                                                                                    <p className="text-sm py-3 px-2 font-semibold  ">
                                                                                        <Link
                                                                                            to="#"
                                                                                            className="  focus:outline-none"
                                                                                        >
                                                                                            <span
                                                                                                className="absolute inset-0"
                                                                                                aria-hidden="true"
                                                                                            ></span>
                                                                                            {
                                                                                                eachData
                                                                                                    .node
                                                                                                    .name
                                                                                            }
                                                                                        </Link>
                                                                                    </p>
                                                                                </div>
                                                                            </li>
                                                                        );
                                                                    }
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col w-full py-2 border-t justify-end items-center">
                                                    <div className="  text-secondary font-bold">
                                                        Total:{" "}
                                                        {searched &&
                                                        searchString?.length > 0
                                                            ? searchedsuppliers &&
                                                              searchedsuppliers.searchOrganizations &&
                                                              searchedsuppliers
                                                                  .searchOrganizations
                                                                  .pageInfo
                                                                  .total
                                                            : data &&
                                                              data.organizations &&
                                                              data.organizations
                                                                  .pageInfo
                                                                  .total}{" "}
                                                        Suppliers
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="flex flex-col col-span-7 lg:col-span-7 h-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 "
                                        style={{
                                            minHeight: "79vh",
                                            maxHeight: "79vh",
                                        }}
                                    >
                                        <>
                                            <CreateSupplier
                                                createNew={clickedNew}
                                                searchString={
                                                    actualSearchString
                                                }
                                                edit={edit}
                                                user={
                                                    edit === true
                                                        ? userData
                                                        : {}
                                                }
                                                callBack={() => {
                                                    setActualSearchString("");
                                                    setSearchString("");
                                                }}
                                                fillColumns={secondColumn}
                                            />
                                        </>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Supplier;
