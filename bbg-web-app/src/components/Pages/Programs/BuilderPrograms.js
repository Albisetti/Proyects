import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { ArrowCircleRightIcon } from "@heroicons/react/outline";
import React, { useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { AuthContext } from "../../../contexts/auth";
import {
    GET_BUILDERS,
    GET_BUILDER_PROGRAMS_MY_PROGRAMS_PAGE,
    SEARCH_BUILDERS,
    UPDATE_BUILDER_ADD_PROGRAM_MY_PROGRAMS_PAGE,
    UPDATE_BUILDER_REMOVE_PROGRAM,
} from "../../../lib/builders";
import { SEARCH_ORGANIZATION_AVAILABLE_PROGRAMS } from "../../../lib/programs";
import Loader from "../../Loader/Loader";
import HelperModal from "../../Modal/HelperModal";
import { APP_TITLE } from "../../../util/constants";

const BuilderProgram = () => {
    const [searchString, setSearchString] = useState("");
    const { organizationNode, type } = useContext(AuthContext);
    const [searchProgramString, setSearchProgramString] = useState();
    const [programSearched, setProgramSearched] = useState();
    const [searched, setSearched] = useState();
    const [active, setActive] = useState();
    const [programIdToAdd, setProgramIdToAdd] = useState();
    const [deleteId, setDeleteId] = useState();
    const [centerColumnNode, setCenterColumnNode] = useState();

    // eslint-disable-next-line

    const [searchBuilders, { data: searchOrganizations, loading: searchedLoading }] = useLazyQuery(SEARCH_BUILDERS, {
        variables: {
            search: searchString,
        },
        notifyOnNetworkStatusChange: false,
    });

    const { data: builderList, loading: builderListLoading } = useQuery(GET_BUILDERS, {
        notifyOnNetworkStatusChange: false,
        fetchPolicy: "cache-and-network",
    });

    const handleChange = (e) => {
        setSearchString(e.target.value);

        if (searchString?.length > 0) {
            setSearched(true);
            searchBuilders();
        }
    };

    const setData = (eachUser) => {
        setActive(eachUser.id);
        getEachBuilder();
    };

    useEffect(() => {
        if (type === "BUILDERS") {
            setActive(organizationNode?.organizations?.edges?.[0]?.node?.id);
            getEachBuilder();
        }
        // eslint-disable-next-line
    }, [organizationNode]);

    const [getEachBuilder, { loading: builderLoading }] = useLazyQuery(GET_BUILDER_PROGRAMS_MY_PROGRAMS_PAGE, {
        notifyOnNetworkStatusChange: false,
        variables: {
            id: active,
        },
        fetchPolicy: "no-cache",
        onError: (data) => {
            toast.error("Builder does not have approved state.");
        },
        onCompleted: (data) => {
            setCenterColumnNode(data);
            setSearched(false);
            setSearchString("");
        },
    });

    const handleProgramSearchChange = (e) => {
        setSearchProgramString(e.target.value);

        if (searchProgramString?.length > 0) {
            setProgramSearched(true);
            searchOrganizationAvailablePrograms();
        }
    };

    const [
        searchOrganizationAvailablePrograms,
        { data: searchedPrograms, loading: searchedProgramLoading },
    ] = useLazyQuery(SEARCH_ORGANIZATION_AVAILABLE_PROGRAMS, {
        variables: {
            search: searchProgramString,
            id: active,
            excludeUsedProgram: true,
        },
        notifyOnNetworkStatusChange: false,
    });

    useEffect(() => {
        if (deleteId) {
            deleteProgramFromBuilder();
        }
        // eslint-disable-next-line
    }, [deleteId]);

    const [deleteProgramFromBuilder] = useMutation(UPDATE_BUILDER_REMOVE_PROGRAM, {
        variables: {
            id: active,
            programId: [deleteId],
        },
        update(cache, result) {
            setDeleteId("");
            getEachBuilder();
            toast.success("Program removed!");
        },
    });

    useEffect(() => {
        if (programIdToAdd) {
            addCustomProgram();
        }
        // eslint-disable-next-line
    }, [programIdToAdd]);

    const [addCustomProgram] = useMutation(UPDATE_BUILDER_ADD_PROGRAM_MY_PROGRAMS_PAGE, {
        variables: {
            id: active,
            programOverwrites: [
                {
                    id: programIdToAdd,
                },
            ],
        },
        update(cache, result) {
            setProgramIdToAdd("");
            setCenterColumnNode({
                organization: { ...centerColumnNode?.organization, ...result?.data?.updateOrganization },
            });
            toast.success("Program added!");
        },
    });

    return (
        <div className="min-h-smallMin  max-w-8xl flex flex-col gap-5 h-full w-8xl mx-auto px-4 sm:px-6 lg:px-32">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Builder Programs</title>
            </Helmet>

            <div className=" bg-white rounded-lg py-4  px-4 h1 flex w-full justify-between items-center">
                <div className="flex items-center">
                    <div>Builder Programs</div>

                    <HelperModal type={"builderPrograms"} title="Builder Programs Information" />
                </div>
            </div>
            <div className="flex space-x-5   overflow-hidden" style={{ minHeight: "79vh", maxHeight: "79vh" }}>
                <div className="bg-white border w-full max-w-md rounded-lg  ">
                    <div className="inset-0    h-full flex ">
                        <div className="flex flex-col w-full h-full  border-b">
                            <div className="font-title py-2 border-b  px-4 text-start h2 flex items-center justify-between">
                                <div className="py-2"> Builders</div>
                                {type === "TERRITORY_MANAGER" ? (
                                    <div className=" flex rounded-md shadow-sm">
                                        <div className="relative flex items-stretch flex-grow focus-within:z-10">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                                            <input
                                                type="text"
                                                name="searchBuilders"
                                                value={searchString}
                                                id="searchBuilders"
                                                className="focus:ring-secondary focus:border-secondary block w-full rounded-md  sm:text-sm border-gray-300"
                                                placeholder="Find or Add"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <div className="bg-white rounded-lg   col-span-9 2xl:col-span-2 h-full">
                                <div className="h-full relative">
                                    <div className=" inset-0    border-gray-200  rounded-lg h-full flex flex-col">
                                        <div className="flex  w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                            <div className="w-full flex flex-col h-full border-r scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                <ul className=" flex-0 w-full h-full  overflow-auto border-l  border-white scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                    {type === "TERRITORY_MANAGER" ? (
                                                        searched && searchString?.length > 0 ? (
                                                            searchedLoading ? (
                                                                <Loader />
                                                            ) : searchOrganizations?.searchOrganizations?.edges
                                                                  ?.length === 0 ? (
                                                                <div className="border-b py-2 px-2 text-secondary font-title font-semibold flex items-center justify-between">
                                                                    <div> No Results Found </div>
                                                                    <span
                                                                        className="underline cursor-pointer text-brickRed"
                                                                        onClick={() => {
                                                                            setSearchString("");
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        Reset{" "}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                searchOrganizations &&
                                                                searchOrganizations.searchOrganizations &&
                                                                searchOrganizations.searchOrganizations.edges.length !==
                                                                    0 &&
                                                                searchOrganizations?.searchOrganizations?.edges?.map(
                                                                    (eachData, index) => {
                                                                        return (
                                                                            <li
                                                                                className={`  border-b transition-all  border-l-4  hover:border-l-6   ${
                                                                                    active === eachData.node.id
                                                                                        ? "bg-gray-100 border-l-gold border-l-6  text-darkgray75 "
                                                                                        : "text-darkgray75 border-l-primary"
                                                                                }`}
                                                                                onClick={() => setData(eachData.node)}
                                                                            >
                                                                                <div className="relative  ">
                                                                                    <div className="text-sm py-3 px-2 font-semibold  ">
                                                                                        <div className="  focus:outline-none">
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
                                                        ) : builderListLoading ? (
                                                            <Loader />
                                                        ) : (
                                                            builderList?.organizations?.edges.map((eachData, index) => {
                                                                return (
                                                                    <li
                                                                        className={`  border-b transition-all  border-l-4    hover:border-l-6   ${
                                                                            active === eachData.node.id
                                                                                ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                                : "text-darkgray75 border-l-primary"
                                                                        }`}
                                                                        onClick={() => setData(eachData.node)}
                                                                    >
                                                                        <div className="relative  ">
                                                                            <div className="text-sm py-3 px-2 font-semibold ">
                                                                                <div className="  focus:outline-none">
                                                                                    {eachData.node.name}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                );
                                                            })
                                                        )
                                                    ) : builderLoading ? (
                                                        <Loader />
                                                    ) : centerColumnNode?.name ? (
                                                        <li
                                                            className={`  border-b transition-all  border-l-4    hover:border-l-6   ${
                                                                active === centerColumnNode?.id
                                                                    ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                    : "text-darkgray75 border-l-primary"
                                                            }`}
                                                        >
                                                            <div className="relative  ">
                                                                <div className="text-sm py-3 px-2 font-semibold ">
                                                                    <div className="  focus:outline-none">
                                                                        {centerColumnNode?.name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ) : null}
                                                </ul>
                                            </div>
                                        </div>
                                        {type === "TERRITORY_MANAGER" ? (
                                            <div className="flex flex-col w-full py-2 border-t justify-end items-center">
                                                <div className="  text-secondary font-bold">
                                                    Total:{" "}
                                                    {searched && searchString?.length > 0
                                                        ? searchOrganizations &&
                                                          searchOrganizations.searchOrganizations &&
                                                          searchOrganizations.searchOrganizations.edges.length
                                                        : organizationNode &&
                                                          organizationNode.managedOrganizations &&
                                                          organizationNode.managedOrganizations.edges.length}{" "}
                                                    Builders
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border w-full  2xl:max-w-lg  rounded-lg  ">
                    <div className="h-full relative   lg:pr-0 xl:pr-3 2xl:pr-0">
                        <div className="    h-full flex flex-col">
                            <div className="flex px-4 flex-col md:flex-row justify-between items-center border-b">
                                <div className="font-title  py-4 text-center h2">Programs</div>
                                {active && centerColumnNode ? (
                                    <div className=" flex rounded-md shadow-sm">
                                        <div className="relative flex items-stretch flex-grow focus-within:z-10">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                                            <input
                                                type="text"
                                                name="searchOrganizationAvailablePrograms"
                                                value={searchProgramString}
                                                id="searchOrganizationAvailablePrograms"
                                                className="focus:ring-secondary focus:border-secondary block w-full rounded-md  sm:text-sm border-gray-300"
                                                placeholder="Find or Add"
                                                onChange={handleProgramSearchChange}
                                            />
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <div className="flex  w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                <div className="w-full min-h-smallMin border-r scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                    <ul className=" flex-0 w-full h-full  overflow-auto border-l  border-white scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                        {programSearched && searchProgramString?.length > 0 ? (
                                            searchedProgramLoading ? (
                                                <Loader />
                                            ) : searchedPrograms?.searchOrganizationAvailablePrograms?.edges?.length ===
                                              0 ? (
                                                <div className="border-b py-2 px-2 text-secondary font-title font-semibold flex items-center justify-between">
                                                    <div> No Results Found </div>
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
                                                searchedPrograms &&
                                                searchedPrograms.searchOrganizationAvailablePrograms &&
                                                searchedPrograms.searchOrganizationAvailablePrograms.edges.length !==
                                                    0 &&
                                                searchedPrograms?.searchOrganizationAvailablePrograms?.edges?.map(
                                                    (eachData, index) => {
                                                        if (
                                                            centerColumnNode?.organization?.programs?.edges?.findIndex(
                                                                (element) => element?.node?.id === eachData?.node?.id
                                                            ) === -1
                                                        ) {
                                                            return (
                                                                <li
                                                                    className={`  border-b transition-all  cursor-pointer border-l-4  hover:border-l-6   ${
                                                                        active === eachData.node.id
                                                                            ? "bg-gray-100 border-l-gold border-l-6  text-darkgray75 "
                                                                            : "text-darkgray75 border-l-primary"
                                                                    }`}
                                                                    onClick={() => {
                                                                        if (
                                                                            centerColumnNode?.organization?.programs?.edges?.findIndex(
                                                                                (element) =>
                                                                                    element?.node?.id ===
                                                                                    eachData?.node?.id
                                                                            ) > -1
                                                                        ) {
                                                                            return;
                                                                        } else {
                                                                            setProgramIdToAdd(eachData?.node?.id);
                                                                        }
                                                                    }}
                                                                >
                                                                    <div className="relative flex justify-between items-center group">
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
                                                                            <div className="flex items-center px-2">
                                                                                <p className="text-sm text-gray-500 capitalize ">
                                                                                    {eachData?.node?.company?.name
                                                                                        ? eachData?.node?.company?.name
                                                                                        : ""}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        {centerColumnNode?.organization?.programs?.edges?.findIndex(
                                                                            (element) =>
                                                                                element?.node?.id === eachData?.node?.id
                                                                        ) > -1 ? (
                                                                            <div className="text-secondary mr-5">
                                                                                {" "}
                                                                                assigned{" "}
                                                                            </div>
                                                                        ) : (
                                                                            <ArrowCircleRightIcon className="text-secondary cursor-pointer transition-all opacity-0 w-7 h-7 mr-4 group-hover:opacity-100" />
                                                                        )}
                                                                    </div>
                                                                </li>
                                                            );
                                                        } else {
                                                            return null;
                                                        }
                                                    }
                                                )
                                            )
                                        ) : builderLoading ? (
                                            <Loader />
                                        ) : (
                                            centerColumnNode?.organization?.availablePrograms.edges.map(
                                                (eachData, index) => {
                                                    if (
                                                        centerColumnNode?.organization?.programs?.edges?.findIndex(
                                                            (element) => element?.node?.id === eachData?.node?.id
                                                        ) === -1
                                                    ) {
                                                        return (
                                                            <li
                                                                className={`  border-b transition-all cursor-pointer  border-l-4    hover:border-l-6   ${
                                                                    active === eachData.node.id
                                                                        ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                                        : "text-darkgray75 border-l-primary"
                                                                }`}
                                                                onClick={() => {
                                                                    if (
                                                                        centerColumnNode?.organization?.programs?.edges?.findIndex(
                                                                            (element) =>
                                                                                element?.node?.id === eachData?.node?.id
                                                                        ) > -1
                                                                    ) {
                                                                        return;
                                                                    } else {
                                                                        setProgramIdToAdd(eachData?.node?.id);
                                                                    }
                                                                }}
                                                            >
                                                                <div className="relative flex justify-between items-center group">
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
                                                                        <div className="flex items-center px-2">
                                                                            <p className="text-sm text-gray-500 capitalize ">
                                                                                {eachData?.node?.company?.name
                                                                                    ? eachData?.node?.company?.name
                                                                                    : ""}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    {programIdToAdd === eachData?.node?.id ? (
                                                                        <Loader
                                                                            width={"40px"}
                                                                            height="40px"
                                                                            className="mr-2"
                                                                        />
                                                                    ) : centerColumnNode?.programs?.edges?.findIndex(
                                                                          (element) =>
                                                                              element?.node?.id === eachData?.node?.id
                                                                      ) > -1 ? (
                                                                        <div className="text-secondary mr-5">
                                                                            {" "}
                                                                            assigned{" "}
                                                                        </div>
                                                                    ) : (
                                                                        <ArrowCircleRightIcon className="text-secondary cursor-pointer transition-all opacity-0 w-7 h-7 mr-4 group-hover:opacity-100" />
                                                                    )}
                                                                </div>
                                                            </li>
                                                        );
                                                    } else {
                                                        return null;
                                                    }
                                                }
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>
                            {active && centerColumnNode ? (
                                <div className="flex flex-col w-full py-2 border-t justify-end items-center">
                                    <div className="  text-secondary font-bold">
                                        Total:{" "}
                                        {programSearched && searchProgramString?.length > 0
                                            ? searchedPrograms &&
                                              searchedPrograms.searchOrganizationAvailablePrograms &&
                                              searchedPrograms.searchOrganizationAvailablePrograms.edges.length
                                            : centerColumnNode &&
                                              centerColumnNode?.organization?.availablePrograms &&
                                              centerColumnNode?.organization?.availablePrograms.edges.length}{" "}
                                        Programs
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="bg-white border  w-full rounded-lg">
                    <div className="h-full relative   lg:pr-0 xl:pr-3 2xl:pr-0">
                        <div className="h-full flex flex-col">
                            <div className="flex px-4 flex-col md:flex-row justify-between items-center border-b">
                                <div className=" font-title  py-4 text-center h2 ">Current Programs</div>
                            </div>
                            <div className="flex  w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                <div className="w-full min-h-smallMin border-r scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                    <ul className=" flex-0 w-full h-full  overflow-auto border-l  border-white scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                        {centerColumnNode?.organization?.programs?.edges.map((eachData, index) => {
                                            return (
                                                <li
                                                    className={`  border-b transition-all cursor-pointer  border-l-4    hover:border-l-6   ${
                                                        active === eachData.node.id
                                                            ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                                            : "text-darkgray75 border-l-primary"
                                                    }`}
                                                    onClick={() => setDeleteId(eachData?.node?.id)}
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
                                                        <div className="flex items-center px-2">
                                                            <p className="text-sm text-gray-500 capitalize ">
                                                                {eachData?.node?.company?.name
                                                                    ? eachData?.node?.company?.name
                                                                    : ""}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuilderProgram;
