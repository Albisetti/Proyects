import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { FETCH_SEARCHED_PROGRAMS_FOR_CLAIMS } from "../../../../../lib/programs";
import { Helmet } from "react-helmet";
import Loader from "../../../../Loader/Loader";
import CreateClaims from "./CreateClaims";
import { FETCH_CLAIMS, FETCH_CLAIM_BASIC } from "../../../../../lib/claims";
import HelperModal from "../../../../Modal/HelperModal";
import { useDebounce } from "../../../../../util/hooks";
import {APP_TITLE} from "../../../../../util/constants";

const Claims = ({ history }) => {
    const [secondColumn, setSecondColumn] = useState(false);
    const [edit, setEdit] = useState();
    const [userData, setUserData] = useState();
    const [searchString, setSearchString] = useState("");
    const [searched, setSearched] = useState();
    const [actualSearchString, setActualSearchString] = useState("");
    const [active, setActive] = useState();
    const [clickedNew, setClickedNew] = useState(false);
    const first = 40;
    const programObserver = useRef();
    const [openAbout, setOpenAbout] = useState(false);
    const [claimFound, setClaimFound] = useState(false);
    const [displayDropDown, setDisplayDropDown] = useState(false);
    const [noSearchVolumeClaims, setNoSearchVolumeClaims] = useState(false);

    // eslint-disable-next-line
    const lastProgramElement = useCallback((node) => {
        if (programObserver.current) programObserver.current.disconnect();
        programObserver.current = new IntersectionObserver((entries) => {
            if (
                entries[0].isIntersecting &&
                data?.recentClaimPerProgram?.pageInfo?.hasNextPage
            ) {
                fetchMore({
                    variables: {
                        first,
                        after: data?.recentClaimPerProgram?.pageInfo?.endCursor,
                    },
                });
            }
        });
        if (node) programObserver.current.observe(node);
    });

    useEffect(() => {
        getClaims();
        // eslint-disable-next-line
    }, []);

    const [
        getClaims,
        { data, loading: claimsLoading, fetchMore },
    ] = useLazyQuery(FETCH_CLAIMS, {
        notifyOnNetworkStatusChange: false,
    });

    const[getClaimBasicInfo,  { loading: getClaimBasicInfoLoading }] =
        useLazyQuery(
            FETCH_CLAIM_BASIC,
            {
                notifyOnNetworkStatusChange: false,
                variables: {
                    id: active,
                },
                fetchPolicy: "no-cache",
                onCompleted: (data) => {
                    if (data?.claim?.id) {
                        setOpenAbout(true);
                        if (data?.claim?.program?.type === "FACTORY") {
                            setEdit(true);
                        }
                        setSecondColumn(true);
                        setUserData(data?.claim);
                        setSearchString("");
                        setActualSearchString("");
                        setClaimFound(true);
                    }
                },
            }
        );


    const debouncedValue =  useDebounce(searchString,160);

    useEffect(() => {

        if (searchString?.length > 0) {
            setOpenAbout(false);
            setSearched(true);
            searchPrograms();
        }
       // eslint-disable-next-line
    }, [debouncedValue])

    const [
        searchPrograms,
        { data: searchedPrograms, loading: searchedLoading },
    ] = useLazyQuery(FETCH_SEARCHED_PROGRAMS_FOR_CLAIMS, {
        variables: {
            search: debouncedValue,
        },
        notifyOnNetworkStatusChange: false,
        fetchPolicy: "no-cache",
    });

    const handleChange = (e) => {
        setSearchString(e.target.value);

    };

    const setData = (eachUser) => {
        if (
            eachUser?.id &&
            !searched &&
            eachUser?.program?.type === "FACTORY"
        ) {
            setActive(eachUser.id);
            setDisplayDropDown(false);
            setSearched(false)
            getClaimBasicInfo();
        } else if (
            eachUser?.id &&
            !searched &&
            eachUser?.program?.type === "VOLUME"
        ) {
            setUserData(eachUser);
            setActive(eachUser.program.id);
            setDisplayDropDown(true);
            setSecondColumn(true);
            setOpenAbout(true);
            setSearched(false)
            setNoSearchVolumeClaims(true);
            setEdit(false);
        } else if (eachUser?.id && searched && eachUser?.type === "FACTORY") {
            setDisplayDropDown(false);
            checkIfTheClaimExists(eachUser);
            setSearched(false)
        } else if (eachUser?.id && searched && eachUser?.type === "VOLUME") {
            setUserData(eachUser);
            setActive("");
            setDisplayDropDown(true);
            setSecondColumn(true);
            setOpenAbout(true);
            setSearchString("");
            setNoSearchVolumeClaims(false);
            setSearched(false)
            setEdit(false);
        }
    };

    const checkIfTheClaimExists = (eachUser) => {
   
        if (eachUser?.claims?.edges?.length === 0) {
            setEdit(false);
            setSecondColumn(true);
            setClaimFound(false);
            setUserData(eachUser);
            setOpenAbout(true);
            setSearchString("");
            setActive("");
            setActualSearchString("");
        } else if (eachUser?.claims?.edges?.length === 1) {
            if (
                eachUser?.claims?.edges?.[0]?.node?.status === "CLOSE" ||
                eachUser?.claims?.edges?.[0]?.node?.status === "READYTOCLOSE"
            ) {
                setEdit(false);
                setSecondColumn(true);
                setClaimFound(false);
                setUserData(eachUser);
                setOpenAbout(true);
                setSearchString("");
                setActive("");
                setActualSearchString("");
            } else {
                setActive(eachUser?.claims?.edges?.[0]?.node?.id);
                getClaimBasicInfo();
            }
        } else if (eachUser?.claims?.edges?.length === 2) {
            if (
                (eachUser?.claims?.edges?.[0]?.node?.status === "CLOSE" ||
                    eachUser?.claims?.edges?.[0]?.node?.status ===
                    "READYTOCLOSE") &&
                (eachUser?.claims?.edges?.[1]?.node?.status === "CLOSE" ||
                    eachUser?.claims?.edges?.[1]?.node?.status ===
                    "READYTOCLOSE")
            ) {
                setEdit(false);
                setSecondColumn(true);
                setClaimFound(false);
                setUserData(eachUser);
                setOpenAbout(true);
                setSearchString("");
                setActive("");
                setActualSearchString("");
            } else if (
                eachUser?.claims?.edges?.[1]?.node?.status === "CLOSE" ||
                eachUser?.claims?.edges?.[1]?.node?.status === "READYTOCLOSE"
            ) {
                setActive(eachUser?.claims?.edges?.[0]?.node?.id);
                getClaimBasicInfo();
            }  else {
                setActive(eachUser?.claims?.edges?.[1]?.node?.id);
                getClaimBasicInfo();
            }
        }
    };

    const callBack = (data) => {
        setSearched(false);
        setActive(data?.id);
        setUserData(data);
        setClaimFound(true);
        setClickedNew(false);
        setEdit(true);
        setActualSearchString("");
        setSearchString("");
        setNoSearchVolumeClaims(true);
    };

    const refetch = (id,type) => {
      
        if(type === "FACTORY") {
            setActive(id);
            getClaimBasicInfo();
        }
        else {
            setSecondColumn(false)
        }
    };

    return (
        <div className="h-full flex-1 pb-5">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Manage Claims</title>
            </Helmet>
            <div className="flex flex-col h-full">
                <main className="flex-1">
                    <div className="max-w-8xl flex flex-col h-full w-8xl mx-auto px-4 sm:px-6 lg:px-32">
                        <div className=" flex flex-col h-full gap-5 lg:flex-row rounded-lg">
                            <div className="w-full">
                                <div className="grid gap-5 grid-cols-9 min-h-smallMin  overflow-hidden">
                                    <div className="col-span-9 bg-white rounded-lg py-4 px-4 h1 flex">
                                        <p>Create Claims</p>
                                        <HelperModal
                                            type="createclaim"
                                            title="Claim Helper Text"
                                        />
                                    </div>
                                    <div className="bg-white rounded-lg lg:max-h-partial  col-span-9 lg:col-span-2">
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
                                                                    value={
                                                                        searchString
                                                                    }
                                                                    id="searchPrograms"
                                                                    className="focus:ring-secondary focus:border-secondary block w-full rounded-md  sm:text-sm border-gray-300"
                                                                    placeholder="Find or Add"
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex  w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                    <div className="w-full min-h-smallMin border-r scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                        <ul className=" flex-0 w-full h-full overflow-auto border-l  border-white scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                            {searched &&
                                                                searchString?.length >
                                                                0 ? (
                                                                searchedLoading ? (
                                                                    <Loader />
                                                                ) : searchedPrograms
                                                                    ?.searchClaimablePrograms
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
                                                                    searchedPrograms &&
                                                                    searchedPrograms.searchClaimablePrograms &&
                                                                    searchedPrograms
                                                                        .searchClaimablePrograms
                                                                        .edges
                                                                        .length !==
                                                                    0 &&
                                                                    searchedPrograms?.searchClaimablePrograms?.edges?.map(
                                                                        (
                                                                            eachData,
                                                                            index
                                                                        ) =>  {
                                                                                return (
                                                                                    <li
                                                                                        className={`  border-b transition-all  border-l-4  hover:border-l-6   ${active ===
                                                                                                eachData
                                                                                                    .node
                                                                                                    .id
                                                                                                ? "bg-gray-100 border-l-gold border-l-6  text-darkgray75 "
                                                                                                : "text-darkgray75 border-l-primary"
                                                                                            }`}
                                                                                        onClick={() => {
                                                                                            setData(
                                                                                                eachData.node
                                                                                            );
                                                                                            setClickedNew(
                                                                                                true
                                                                                            );
                                                                                            setEdit(
                                                                                                false
                                                                                            );
                                                                                            setSecondColumn(
                                                                                                true
                                                                                            );
                                                                                        }}
                                                                                        ref={
                                                                                            lastProgramElement
                                                                                        }
                                                                                    >
                                                                                        <div className="relative  ">
                                                                                            <div className="text-sm py-3 px-2 font-semibold  ">
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
                                                                                                            ?.node
                                                                                                            ?.name
                                                                                                    }
                                                                                                </Link>
                                                                                            </div>
                                                                                        </div>
                                                                                    </li>
                                                                                );
                                                                            }
                                                                    )
                                                                )
                                                            ) : claimsLoading ? (
                                                                <Loader />
                                                            ) : (
                                                                data &&
                                                                data.recentClaimPerProgram &&
                                                                data
                                                                    .recentClaimPerProgram
                                                                    .edges
                                                                    .length !==
                                                                0 &&
                                                                data?.recentClaimPerProgram?.edges?.map(
                                                                    (
                                                                        eachData,
                                                                        index
                                                                    ) => {
                                                                        
                                                                        if (
                                                                            index ===
                                                                            data
                                                                                .recentClaimPerProgram
                                                                                .edges
                                                                                .length -
                                                                            1
                                                                        ) {
                                                                            return (
                                                                                <li
                                                                                    className={`  border-b transition-all  border-l-4    hover:border-l-6   ${parseInt(active) ===
                                                                                            parseInt(eachData
                                                                                                ?.node?.program
                                                                                                ?.id) || parseInt(active) === 
                                                                                                parseInt(eachData
                                                                                                    .node
                                                                                                    .id) 
                                                                                            ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                                            : "text-darkgray75 border-l-primary"
                                                                                        }`}
                                                                                    onClick={() => {
                                                                                        setData(
                                                                                            eachData.node
                                                                                        )
                                                                                        }
                                                                                    }
                                                                                    ref={
                                                                                        lastProgramElement
                                                                                    }
                                                                                >
                                                                                    <div className="relative  ">
                                                                                        <div className="text-sm py-3 px-2 font-semibold ">
                                                                                            <Link
                                                                                                
                                                                                                className="  focus:outline-none"
                                                                                            >
                                                                                                <span
                                                                                                    className="absolute inset-0"
                                                                                                    aria-hidden="true"
                                                                                                ></span>
                                                                                                {
                                                                                                    eachData
                                                                                                        ?.node
                                                                                                        ?.program
                                                                                                        ?.name
                                                                                                }
                                                                                            </Link>
                                                                                        </div>
                                                                                    </div>
                                                                                </li>
                                                                            );
                                                                        }
                                                                        return (
                                                                            <li
                                                                                className={`  border-b transition-all  border-l-4    hover:border-l-6  ${parseInt(active) === 
                                                                                        parseInt(eachData
                                                                                            .node.program
                                                                                            .id) || parseInt(active) === 
                                                                                            parseInt(eachData
                                                                                                .node
                                                                                                .id) 
                                                                                        ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                                        : "text-darkgray75 border-l-primary"
                                                                                    }`}
                                                                                onClick={() => {
                                                                                    setData(
                                                                                        eachData.node
                                                                                    )
                                                                                    }
                                                                                }
                                                                            >
                                                                                <div className="relative  ">
                                                                                    <div className="text-sm py-3 px-2 font-semibold  ">
                                                                                        <Link
                                                                                            className="  focus:outline-none"
                                                                                        >
                                                                                            <span
                                                                                                className="absolute inset-0"
                                                                                                aria-hidden="true"
                                                                                            ></span>
                                                                                            {
                                                                                                eachData
                                                                                                    ?.node
                                                                                                    ?.program
                                                                                                    ?.name
                                                                                            }
                                                                                        </Link>
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
                                                    <div className="  text-secondary font-bold">
                                                        Total:{" "}
                                                        {searched &&
                                                            searchString?.length > 0
                                                            ? searchedPrograms &&
                                                            searchedPrograms.searchClaimablePrograms &&
                                                            searchedPrograms
                                                                .searchClaimablePrograms
                                                                .edges.length
                                                            : data?.recentClaimPerProgram?.pageInfo?.total }{" "}
                                                        {searched &&
                                                            searchString?.length > 0
                                                            ? "Programs"
                                                            : "Claims"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {getClaimBasicInfoLoading ? 
                                        <div className="flex flex-col col-span-9 lg:col-span-7 h-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                                            <Loader /> 
                                        </div>
                                            :
                                    <div className="flex flex-col col-span-9 lg:col-span-7 h-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                                        <>
                                            <CreateClaims
                                                callBack={callBack}
                                                claimFound={claimFound}
                                                edit={edit}
                                                searched={searched}
                                                refetch={refetch}
                                                loading={getClaimBasicInfoLoading}
                                                openAbout={openAbout}
                                                user={userData}
                                                fillColumns={secondColumn}
                                                createNew={clickedNew}
                                                productsDropDown={
                                                    displayDropDown
                                                }
                                                searchString={
                                                    actualSearchString
                                                }
                                                noSearchVolumeClaims={
                                                    noSearchVolumeClaims
                                                }
                                                resetState={() =>
                                                    setOpenAbout(false)
                                                }
                                                history={history}
                                            />
                                        </>
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Claims;
