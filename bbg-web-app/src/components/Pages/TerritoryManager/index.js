import React, {
	useEffect,
	useState,
	useRef,
	useCallback,
	useContext
} from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import {
    FETCH_TERRITORY_MANAGERS_QUERY,
    FETCH_USER,
    SEARCH_TERRITORY_MANAGERS_QUERY,
} from "../../../lib/user";
import CreateTerritoryManager from "./CreateTerritoryManager";
import { Helmet } from "react-helmet";
import Loader from "../../Loader/Loader";
import HelperModal from "../../Modal/HelperModal";
import { AuthContext } from "../../../contexts/auth";
import { useDebounce } from "../../../util/hooks";
import {APP_TITLE} from "../../../util/constants";

const TerritoryManager = () => {


    const [secondColumn, setSecondColumn] = useState(false);
    const [edit, setEdit] = useState(false);
    const [searchString, setSearchString] = useState("");
    const [searched, setSearched] = useState();
    const [actualSearchString, setActualSearchString] = useState("");
    const [userData, setUserData] = useState();
    const [active, setActive] = useState();
    const first = 20;
    const [callQuery,setCallQuery] = useState();
    const TerritoryManagerObserver = useRef();

    const {impersonator,type} = useContext(AuthContext)

    // eslint-disable-next-line
    const lastTerritoryManagerElement = useCallback((node) => {
        if (TerritoryManagerObserver.current)
            TerritoryManagerObserver.current.disconnect();
        TerritoryManagerObserver.current = new IntersectionObserver(
            (entries) => {
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
            }
        );
        if (node) TerritoryManagerObserver.current.observe(node);
    });


    useEffect(() => {
        getTms();
        // eslint-disable-next-line
    }, [impersonator])

    const [getTms, { data, fetchMore, loading: TerritoryManagerLoading }] = useLazyQuery(
        FETCH_TERRITORY_MANAGERS_QUERY,
        {
            notifyOnNetworkStatusChange: false,
            fetchPolicy:'cache-and-network'
        }
    );

    useEffect(() => {

        if(type === "TERRITORY_MANAGER" && data) {
            setActive(data?.users?.edges?.[0]?.node?.id);
            setCallQuery(true)
            setEdit(true)
        }
        
    }, [type,data])

    
    const debouncedValue =  useDebounce(searchString,160);

    useEffect(() => {
        
        if (searchString?.length > 2) {
            setSearched(true);
            searchTerritoryManagers();
        }
       // eslint-disable-next-line
    }, [debouncedValue])

    const [
        searchTerritoryManagers,
        { data: searchedTerritoryManagers, loading: searchedSubLoading },
    ] = useLazyQuery(SEARCH_TERRITORY_MANAGERS_QUERY, {
        variables: {
            search: searchString,
        },
        notifyOnNetworkStatusChange: false,
    });

    useEffect(() => {
        if (active && callQuery) {
            getUser();
        }
        // eslint-disable-next-line
    }, [active,callQuery]);

    const [getUser, { data: user }] = useLazyQuery(FETCH_USER, {
        variables: {
            id: active,
        },
        fetchPolicy:"cache-and-network",
        onCompleted: () => {
            setSecondColumn(true);
            setUserData(user?.user);
            setCallQuery(false)
        },
    });

    const handleChange = (e) => {
        setSearchString(e.target.value);
    };

    const setData = (eachUser) => {
        setActive(eachUser.id);
        setCallQuery(true);
        setEdit(true)
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
        <div className="h-full flex-1 pb-5 3xl:pb-0">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Territory Managers</title>
            </Helmet>
            <div className="flex flex-col h-full">
                <main className="flex-1">
                    <div className="max-w-8xl flex flex-col h-full w-8xl mx-auto px-4 sm:px-6 lg:px-32">
                        <div className=" flex flex-col h-full gap-5 xl:flex-row rounded-lg">
                            <div className="w-full">
                                <div className="grid gap-5 grid-cols-10 min-h-layout  overflow-hidden">
                                    <div className="col-span-10 bg-white rounded-lg py-4 px-4 h1 flex">
                                        <p> Territory Managers </p>

                                        <HelperModal
                                            type={"territorymanagers"}
                                            title="Territory Managers Information"
                                        />
                                    </div>
                                    <div
                                        className="bg-white rounded-lg col-span-9 lg:col-span-3"
                                        style={{
                                            minHeight: "79vh",
                                            maxHeight: "79vh",
                                        }}
                                    >
                                        <div className="h-full relative">
                                            <div className=" inset-0    border-gray-200  rounded-lg h-full flex flex-col">
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
                                                    <div className="w-full border-r scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                        <ul className=" flex-0 w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400  overflow-auto border-l  border-white">
                                                            {searched &&
                                                            searchString?.length >
                                                                0 ? (
                                                                searchedSubLoading ? (
                                                                    <Loader />
                                                                ) : searchedTerritoryManagers
                                                                      ?.searchTerritoryManagers
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
                                                                    searchedTerritoryManagers &&
                                                                    searchedTerritoryManagers.searchTerritoryManagers &&
                                                                    searchedTerritoryManagers
                                                                        .searchTerritoryManagers
                                                                        .edges
                                                                        .length !==
                                                                        0 &&
                                                                    searchedTerritoryManagers.searchTerritoryManagers.edges.map(
                                                                        (
                                                                            eachData,
                                                                            index
                                                                        ) => {
                                                                            if (
                                                                                index ===
                                                                                searchedTerritoryManagers
                                                                                    .searchTerritoryManagers
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
                                                                                            lastTerritoryManagerElement
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
                                                                                                            .first_name
                                                                                                    }{" "}
                                                                                                    {
                                                                                                        eachData
                                                                                                            .node
                                                                                                            .last_name
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
                                                                                                        .first_name
                                                                                                }{" "}
                                                                                                {
                                                                                                    eachData
                                                                                                        .node
                                                                                                        .last_name
                                                                                                }
                                                                                            </Link>
                                                                                        </p>
                                                                                    </div>
                                                                                </li>
                                                                            );
                                                                        }
                                                                    )
                                                                )
                                                            ) : TerritoryManagerLoading ? (
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
                                                                                        lastTerritoryManagerElement
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
                                                                                                        .first_name
                                                                                                }{" "}
                                                                                                {
                                                                                                    eachData
                                                                                                        .node
                                                                                                        .last_name
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
                                                                                                    .first_name
                                                                                            }{" "}
                                                                                            {
                                                                                                eachData
                                                                                                    .node
                                                                                                    .last_name
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
                                                            ? searchedTerritoryManagers &&
                                                              searchedTerritoryManagers.searchTerritoryManagers &&
                                                              searchedTerritoryManagers
                                                                  .searchTerritoryManagers
                                                                  .pageInfo
                                                                  .total
                                                            : data &&
                                                              data.users &&
                                                              data.users
                                                                  .pageInfo
                                                                  .total}{" "}
                                                        territory managers
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="flex flex-col col-span-9 lg:col-span-7  h-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 "
                                        style={{
                                            minHeight: "79vh",
                                            maxHeight: "79vh",
                                        }}
                                    >
                                        <>
                                            <CreateTerritoryManager
                                                edit={edit}
                                                user={
                                                    edit === true
                                                        ? userData
                                                        : {}
                                                }
                                                afterArchive={() => {setEdit(false);setSecondColumn(false)}}
                                                searchString={
                                                    actualSearchString
                                                }
                                                SearchStringHandler={() => setActualSearchString("")}
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

export default TerritoryManager;
