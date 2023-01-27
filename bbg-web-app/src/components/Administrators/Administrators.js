import React, { useState, useRef, useCallback,useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { FETCH_USERS_QUERY, SEARCH_ADMINS } from "../../lib/admin";
import CreateAdmin from "./CreateAdmin";
import { Helmet } from "react-helmet";
import Loader from "../Loader/Loader";
import HelperModal from "../Modal/HelperModal";
import { useDebounce } from "../../util/hooks";
import { APP_TITLE } from "../../util/constants";


const Administrators = ({ archieved }) => {
    const [secondColumn, setSecondColumn] = useState(false);
    const [edit, setEdit] = useState(false);
    const [searchString, setSearchString] = useState("");
    const [searched, setSearched] = useState();
    const [actualSearchString, setActualSearchString] = useState("");
    const [userData, setUserData] = useState();
    const [active, setActive] = useState();
    const first = 20;
    const adminObserver = useRef();

    // eslint-disable-next-line
    const lastAdminElement = useCallback((node) => {
        if (adminObserver.current) adminObserver.current.disconnect();
        adminObserver.current = new IntersectionObserver((entries) => {
            if (
                entries[0].isIntersecting &&
                data?.users?.pageInfo.hasNextPage
            ) {
                fetchMore({
                    variables: {
                        first,
                        after: data?.users?.pageInfo.endCursor,
                    },
                });
            }
        });
        if (node) adminObserver.current.observe(node);
    });

    const { data, fetchMore, loading: adminLoading } = useQuery(
        FETCH_USERS_QUERY,
        {
            notifyOnNetworkStatusChange: false,
            fetchPolicy: "cache-and-network",
        }
    );

    const debouncedValue =  useDebounce(searchString,160);

    useEffect(() => {
        if (searchString?.length > 2) {
            setSearched(true);
            serchAdmins();
        }
       // eslint-disable-next-line
    }, [debouncedValue])


    const [
        serchAdmins,
        { data: searchedAdmins, loading: searchedAdminLoading },
    ] = useLazyQuery(SEARCH_ADMINS, {
        variables: {
            search: debouncedValue,
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
    };

    const createNew = () => {
        setActive("");
        setSecondColumn(true);
        setUserData({});
        setEdit(false);
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
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Admin</title>
            </Helmet>

            <main>
                <div className="max-w-8xl w-8xl mx-auto px-4 sm:px-6 lg:px-32">
                    <div className="flex flex-col lg:flex-row rounded-lg rounded-t-none">
                        <div className="w-full">
                            <div className="grid grid-cols-7">
                                <div className="col-span-9 bg-white rounded-lg py-4 px-4 h1 flex xl:mb-5">
                                    <p> Admin </p>

                                    <HelperModal
                                        type={"admin"}
                                        title="Admin Information"
                                    />
                                </div>
                                <div
                                    className="border-b border-gray-200 rounded-lg col-span-9  xl:mt-0 flex-1 xl:col-span-2 w-full md:border-b-0 xl:flex-shrink-0    xl:border-gray-200 bg-white"
                                    style={{
                                        minHeight: "79vh",
                                        maxHeight: "79vh",
                                    }}
                                >
                                    <div className="h-full ">
                                        <div className="h-full relative">
                                            <div className=" inset-0  border  border-gray-200  rounded-lg h-full flex flex-col">
                                                <div className="flex px-4 border-b-2 border-gray-400  items-center justify-between space-x-5">
                                                    <div className="min-w-0 flex-1  py-3 max-w-full">
                                                        <div className=" flex rounded-md shadow-sm">
                                                            <div className="relative flex items-stretch flex-grow ">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                                                                <input
                                                                    type="text"
                                                                    name="searchTerritoryManager"
                                                                    id="searchTerritoryManager"
                                                                    className="focus:ring-secondary focus:border-secondary block w-full rounded-md  sm:text-sm border-gray-300"
                                                                    placeholder="Find or Add"
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    value={
                                                                        searchString
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {searched === true ? (
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
                                                    <div className="w-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                        <ul className=" flex-0 w-full  overflow-auto">
                                                            {searched &&
                                                            searchString?.length >
                                                                0 ? (
                                                                searchedAdminLoading ? (
                                                                    <Loader />
                                                                ) : searchedAdmins
                                                                      ?.searchAdministrators
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
                                                                    searchedAdmins &&
                                                                    searchedAdmins.searchAdministrators &&
                                                                    searchedAdmins
                                                                        .searchAdministrators
                                                                        .edges
                                                                        .length !==
                                                                        0 &&
                                                                    searchedAdmins.searchAdministrators.edges.map(
                                                                        (
                                                                            eachData,
                                                                            index
                                                                        ) => {
                                                                            if (
                                                                                index ===
                                                                                searchedAdmins
                                                                                    .searchAdministrators
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
                                                                                            lastAdminElement
                                                                                        }
                                                                                    >
                                                                                        <div className="relative  ">
                                                                                            <div className="text-sm py-3 px-2 font-semibold  ">
                                                                                                <div className="  focus:outline-none">
                                                                                                    <span
                                                                                                        className="absolute inset-0"
                                                                                                        aria-hidden="true"
                                                                                                    ></span>
                                                                                                    {
                                                                                                        eachData
                                                                                                            .node
                                                                                                            .first_name
                                                                                                    }{" "}
                                                                                                    {
                                                                                                        eachData
                                                                                                            .node
                                                                                                            .last_name
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
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
                                                                                        <div className="text-sm py-3 px-2 font-semibold  ">
                                                                                            <div className="  focus:outline-none">
                                                                                                <span
                                                                                                    className="absolute inset-0"
                                                                                                    aria-hidden="true"
                                                                                                ></span>
                                                                                                {
                                                                                                    eachData
                                                                                                        .node
                                                                                                        .first_name
                                                                                                }{" "}
                                                                                                {
                                                                                                    eachData
                                                                                                        .node
                                                                                                        .last_name
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </li>
                                                                            );
                                                                        }
                                                                    )
                                                                )
                                                            ) : adminLoading ? (
                                                                <Loader />
                                                            ) : adminLoading ? (
                                                                <Loader />
                                                            ) : (
                                                                data?.users
                                                                    ?.edges
                                                                    ?.length !==
                                                                    0 &&
                                                                data?.users?.edges?.map(
                                                                    (
                                                                        eachData,
                                                                        index
                                                                    ) => {
                                                                        if (
                                                                            index ===
                                                                            data
                                                                                .users
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
                                                                                        lastAdminElement
                                                                                    }
                                                                                >
                                                                                    <div className="relative  ">
                                                                                        <div className="text-sm py-3 px-2 font-semibold ">
                                                                                            <div className="  focus:outline-none">
                                                                                                <span
                                                                                                    className="absolute inset-0"
                                                                                                    aria-hidden="true"
                                                                                                ></span>
                                                                                                {
                                                                                                    eachData
                                                                                                        .node
                                                                                                        .first_name
                                                                                                }{" "}
                                                                                                {
                                                                                                    eachData
                                                                                                        .node
                                                                                                        .last_name
                                                                                                }
                                                                                            </div>
                                                                                        </div>
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
                                                                                    <div className="text-sm py-3 px-2 font-semibold  ">
                                                                                        <div className="  focus:outline-none">
                                                                                            <span
                                                                                                className="absolute inset-0"
                                                                                                aria-hidden="true"
                                                                                            ></span>
                                                                                            {
                                                                                                eachData
                                                                                                    .node
                                                                                                    .first_name
                                                                                            }{" "}
                                                                                            {
                                                                                                eachData
                                                                                                    .node
                                                                                                    .last_name
                                                                                            }
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
                                                <div className="flex flex-col w-full py-2 border-t justify-end items-center">
                                                    <div className="  text-secondary font-bold">
                                                        Total:{" "}
                                                        {searched &&
                                                        searchString?.length > 0
                                                            ? searchedAdmins &&
                                                              searchedAdmins.searchAdministrators &&
                                                              searchedAdmins
                                                                  .searchAdministrators
                                                                  .pageInfo
                                                                  .total
                                                            : data &&
                                                              data.users &&
                                                              data.users
                                                                  .pageInfo
                                                                  .total}{" "}
                                                        Admins
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col col-span-9 xl:col-span-5  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 xl:ml-5  ">
                                    <div className="flex flex-col h-full">
                                        <p
                                            style={{ maxHeight: "68px" }}
                                            className="border bg-white rounded-b-none  font-title rounded-lg py-5 px-4 h2"
                                        >
                                            {edit
                                                ? `${userData?.first_name} ${userData?.last_name}`
                                                : "New Administrator"}
                                        </p>
                                        <CreateAdmin
                                            archieved={archieved}
                                            edit={edit}
                                            user={edit === true ? userData : {}}
                                            searchString={actualSearchString}
                                            fillColumn={secondColumn}
                                            cleanUp={() => setActualSearchString("")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Administrators;
