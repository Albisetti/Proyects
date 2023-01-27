import React, { useState, useRef, useCallback, useEffect, useContext } from "react";
import { useLazyQuery } from "@apollo/client";
import { FETCH_PROGRAM, FETCH_PROGRAMS_QUERY, FETCH_SEARCHED_PROGRAMS } from "../../../lib/programs";
import { AuthContext } from "../../../contexts/auth";
import CreateProgram from "./CreateProgram";
import { Helmet } from "react-helmet";
import Loader from "../../Loader/Loader";
import HelperModal from "../../Modal/HelperModal";
import { useLocation } from "react-router-dom";
import { useDebounce } from "../../../util/hooks";
import {APP_TITLE} from "../../../util/constants";

const Program = () => {
    const [secondColumn, setSecondColumn] = useState(false);
    const [edit, setEdit] = useState();
    const [userData, setUserData] = useState();
    const [searchString, setSearchString] = useState("");
    const [searched, setSearched] = useState();
    const [actualSearchString, setActualSearchString] = useState("");
    const [active, setActive] = useState();
    const [clickedNew, setClickedNew] = useState(false);
    const first = 100;
    const programObserver = useRef();
    const [openAbout, setOpenAbout] = useState(false);
    const [openConversion, setOpenConversion] = useState(false);
    const { impersonator, type } = useContext(AuthContext);

    const location = useLocation();

    useEffect(() => {
        if (location?.state?.id && location?.state?.from === "notification") {
            setActive(location?.state?.id);
            getEachProgram();
            if (location?.state?.open === "conversions") {
                setOpenConversion(true);
            } else {
                setOpenAbout(true);
            }
        }
        // eslint-disable-next-line
    }, [location?.state?.id]);

    // eslint-disable-next-line
    const lastProgramElement = useCallback((node) => {
        if (programObserver.current) programObserver.current.disconnect();
        programObserver.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && data?.programs?.pageInfo?.hasNextPage && searchString?.length === 0) {
                fetchMore({
                    variables: {
                        first,
                        after: data?.programs?.pageInfo?.endCursor,
                    },
                });
            }
        });
        if (node) programObserver.current.observe(node);
    });

    useEffect(() => {
        getPrograms();

        // eslint-disable-next-line
    }, [impersonator]);

    const [getPrograms, { data, loading: programLoading, fetchMore }] = useLazyQuery(FETCH_PROGRAMS_QUERY, {
        notifyOnNetworkStatusChange: false,
        fetchPolicy:"network-only"
    });

    const [getEachProgram, { loading: eachProgramLoading }] = useLazyQuery(FETCH_PROGRAM, {
        notifyOnNetworkStatusChange: false,
        variables: {
            id: active,
        },
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            if (data?.program?.id) {
                setEdit(true);
                setSecondColumn(true);
                setSearched(false);
                setUserData(data?.program);
                setSearchString("");
                setActualSearchString("");
            }
        },
    });

    const debouncedValue = useDebounce(searchString, 160);

    useEffect(() => {
        if (debouncedValue?.length > 1) {
            setOpenAbout(false);
            setSearched(true);
            setOpenConversion(false);
            searchPrograms({
                variables: {
                    search: searchString,
                },
            });
        }
        // eslint-disable-next-line
    }, [debouncedValue]);

    const [searchPrograms, { data: searchedPrograms, loading: searchedLoading }] = useLazyQuery(
        FETCH_SEARCHED_PROGRAMS,
        {
            notifyOnNetworkStatusChange: false,
            fetchPolicy:"no-cache"
        }
    );

    const handleChange = (e) => {
        setSearchString(e.target.value);

        if (searchString?.length > 0) {
            setOpenAbout(false);
            setOpenConversion(false);
            setSearched(true);
        }
    };

    const setData = (eachUser) => {
        setActive(eachUser.id);
        setOpenAbout(true);
        getEachProgram();
    };

    const createNew = () => {
        setActive("");
        setSecondColumn(true);
        setUserData({});
        setEdit(false);
        setClickedNew(true);
        setSearched(false);
        setOpenAbout(true);
        if (secondColumn !== true || edit || actualSearchString !== searchString) {
            setActualSearchString(searchString);
            setSearchString("");
        }
    };

    const callBack = (data) => {
        setSearched(false);
        setActive(data?.id);
        setUserData(data);
        setClickedNew(false);
        setEdit(true);
        setActualSearchString("");
        setSearchString("");
    };

    const afterDelete = () => {
        setSecondColumn(false)
        setSearched(false);
        setClickedNew(false);
        setEdit(true);
        setActualSearchString("");
        setSearchString("");
    }

    const refetch = (id) => {
        setActive(id);
        getEachProgram();
    };

    const sortPrograms = (items) => {
        let copyItems = items?.slice();
        let sortedArray = copyItems?.sort((a, b) => a?.node?.name?.localeCompare(b?.node?.name));
        return sortedArray;
    };

    return (
        <div className="h-full flex-1 pb-5">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Manage Programs</title>
            </Helmet>
            <div className="flex flex-col h-full">
                <main className="flex-1">
                    <div className="max-w-8xl flex flex-col h-full w-8xl mx-auto px-4 sm:px-6 lg:px-32">
                        <div className=" flex flex-col h-full gap-5 xl:flex-row rounded-lg">
                            <div className="w-full">
                                <div className="grid gap-5 grid-cols-9 min-h-smallMin  overflow-hidden">
                                    <div className="col-span-9 bg-white rounded-lg py-4 px-4 h1 flex">
                                        <p className="">Manage Programs </p>
                                        <HelperModal type={"programs"} title="Programs Information" />
                                    </div>
                                    <div className="bg-white rounded-lg 2xl:max-h-partial  col-span-9 2xl:col-span-2">
                                        <div className="h-full relative">
                                            <div className=" inset-0    border-gray-200  rounded-lg h-full flex flex-col">
                                                <div className="flex px-4 border-b-2 border-gray-400  items-center justify-between space-x-5">
                                                    <div className="min-w-0 flex-1  py-3 max-w-full">
                                                        <div className=" flex rounded-md shadow-sm">
                                                            <div className="relative flex items-stretch flex-grow focus-within:z-10">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                                                                <input
                                                                    type="text"
                                                                    name="searchPrograms"
                                                                    value={searchString}
                                                                    id="searchPrograms"
                                                                    className="focus:ring-secondary focus:border-secondary block w-full rounded-md  sm:text-sm border-gray-300"
                                                                    placeholder="Find or Add"
                                                                    onChange={handleChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {(searched === true || data?.programs?.edges?.length === 0) &&
                                                    type === "ADMIN" ? (
                                                        <div className="">
                                                            <button
                                                                type="button"
                                                                className="text-lg py-3 mr-3 border-transparent   font-medium rounded-md text-secondary focus:outline-none"
                                                                onClick={() => createNew()}
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
                                                    <div className="w-full min-h-smallMin border-r scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                        <ul className=" flex-0 w-full h-full  overflow-auto border-l  border-white scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                            {searched && searchString?.length > 0 ? (
                                                                searchedLoading ? (
                                                                    <Loader />
                                                                ) : searchedPrograms?.searchPrograms?.edges?.length ===
                                                                  0 ? (
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
                                                                    sortPrograms(
                                                                        searchedPrograms?.searchPrograms?.edges
                                                                    )?.map((eachData, index) => {
                                                                        if (
                                                                            index ===
                                                                            searchedPrograms?.searchPrograms?.edges
                                                                                ?.length -
                                                                                1
                                                                        ) {
                                                                            return (
                                                                                <li
                                                                                    className={`  border-b transition-all  border-l-4  hover:border-l-6   ${
                                                                                        active === eachData.node.id
                                                                                            ? "bg-gray-100 border-l-gold border-l-6  text-darkgray75 "
                                                                                            : "text-darkgray75 border-l-primary"
                                                                                    }`}
                                                                                    onClick={() =>
                                                                                        setData(eachData.node)
                                                                                    }
                                                                                    ref={lastProgramElement}
                                                                                >
                                                                                    <div className="relative flex flex-col py-3  ">
                                                                                        <div className="text-sm px-2 font-semibold  ">
                                                                                            <div className="  focus:outline-none">
                                                                                                <span
                                                                                                    className="absolute inset-0"
                                                                                                    aria-hidden="true"
                                                                                                ></span>
                                                                                                {eachData.node.name}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="flex items-start px-2">
                                                                                            <p className="text-sm text-gray-500 capitalize">
                                                                                                {eachData?.node?.company
                                                                                                    ?.name
                                                                                                    ? eachData?.node
                                                                                                          ?.company
                                                                                                          ?.name
                                                                                                    : ""}
                                                                                            </p>
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
                                                                                onClick={() => setData(eachData.node)}
                                                                            >
                                                                                <div className="relative flex flex-col py-3  ">
                                                                                    <div className="text-sm px-2 font-semibold  ">
                                                                                        <div className="  focus:outline-none">
                                                                                            <span
                                                                                                className="absolute inset-0"
                                                                                                aria-hidden="true"
                                                                                            ></span>
                                                                                            {eachData.node.name}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-start px-2">
                                                                                        <p className="text-sm text-gray-500 capitalize">
                                                                                            {eachData?.node?.company
                                                                                                ?.name
                                                                                                ? eachData?.node
                                                                                                      ?.company?.name
                                                                                                : ""}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        );
                                                                    })
                                                                )
                                                            ) : programLoading ? (
                                                                <Loader />
                                                            ) : (
                                                                sortPrograms(data?.programs?.edges)?.map(
                                                                    (eachData, index) => {
                                                                        if (index === data.programs.edges.length - 1) {
                                                                            return (
                                                                                <li
                                                                                    className={`  border-b transition-all  border-l-4    hover:border-l-6   ${
                                                                                        active === eachData.node.id
                                                                                            ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                                            : "text-darkgray75 border-l-primary"
                                                                                    }`}
                                                                                    onClick={() =>
                                                                                        setData(eachData.node)
                                                                                    }
                                                                                    ref={lastProgramElement}
                                                                                >
                                                                                    <div className="relative flex flex-col py-3  ">
                                                                                        <div className="text-sm px-2 font-semibold ">
                                                                                            <div className="  focus:outline-none">
                                                                                                <span
                                                                                                    className="absolute inset-0"
                                                                                                    aria-hidden="true"
                                                                                                ></span>
                                                                                                {eachData.node.name}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="flex items-start px-2 ">
                                                                                            <p className="text-sm text-gray-500 capitalize ">
                                                                                                {eachData?.node?.company
                                                                                                    ?.name
                                                                                                    ? eachData?.node
                                                                                                          ?.company
                                                                                                          ?.name
                                                                                                    : ""}
                                                                                            </p>
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
                                                                                onClick={() => setData(eachData.node)}
                                                                            >
                                                                                <div className="relative flex flex-col py-3">
                                                                                    <div className="text-sm px-2 font-semibold">
                                                                                        <div className="  focus:outline-none">
                                                                                            <span
                                                                                                className="absolute inset-0"
                                                                                                aria-hidden="true"
                                                                                            ></span>
                                                                                            {eachData.node.name}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-start px-2">
                                                                                        <p className="text-sm text-gray-500 capitalize ">
                                                                                            {eachData?.node?.company
                                                                                                ?.name
                                                                                                ? eachData?.node
                                                                                                      ?.company?.name
                                                                                                : ""}
                                                                                        </p>
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

                                                <div className="flex flex-col w-full py-2 border-t justify-end items-center">
                                                    <div className="text-secondary font-bold">
                                                        Total:{" "}
                                                        {searched && searchString?.length > 0
                                                            ? searchedPrograms &&
                                                              searchedPrograms.searchPrograms &&
                                                              searchedPrograms.searchPrograms.edges.length
                                                            : 
                                                              data?.programs?.pageInfo?.total}{" "}
                                                        Programs
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col col-span-9 2xl:col-span-7 h-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                                        <>
                                            <CreateProgram
                                                callBack={callBack}
                                                edit={edit}
                                                refetch={refetch}
                                                loading={eachProgramLoading}
                                                openAbout={openAbout}
                                                openConversion={openConversion}
                                                user={edit === true ? userData : {}}
                                                fillColumns={secondColumn}
                                                createNew={clickedNew}
                                                searchString={actualSearchString}
                                                resetState={() => setOpenAbout(false)}
                                                afterDelete={() => afterDelete()}
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

export default Program;
