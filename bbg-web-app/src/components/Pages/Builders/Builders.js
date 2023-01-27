import React, {
	useContext,
	useState,
	useRef,
	useCallback,
	useEffect
} from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import CreateBuilder from "./CreateBuilder";
import { Helmet } from "react-helmet";
import Loader from "../../Loader/Loader";
import {
    GET_BUILDER,
    GET_BUILDERS,
    SEARCH_BUILDERS,
} from "../../../lib/builders";
import { AuthContext } from "../../../contexts/auth";
import HelperModal from "../../Modal/HelperModal";
import { useDebounce } from "../../../util/hooks";
import { APP_TITLE } from "../../../util/constants";


const Builders = (props) => {
    const [secondColumn, setSecondColumn] = useState(false);
    const [edit, setEdit] = useState();
    const [searchString, setSearchString] = useState("");
    const [userData, setUserData] = useState();
    const [searched, setSearched] = useState();
    const [active, setActive] = useState();
    const [clickedNew, setClickedNew] = useState(false);
    const first = 20;
    const programObserver = useRef();
    const [actualSearchString, setActualSearchString] = useState("");
    const [openAbout, setOpenAbout] = useState(false);
	const { impersonator } = useContext(AuthContext);
    const [openWhat,setOpenWhat] = useState("")

    // eslint-disable-next-line
    const lastProgramElement = useCallback((node) => {
        if (programObserver.current) programObserver.current.disconnect();
        programObserver.current = new IntersectionObserver((entries) => {
            if (
                entries[0].isIntersecting &&
                data?.organizations?.pageInfo?.hasNextPage
            ) {
                fetchMore({
                    variables: {
                        first,
                        after: data.organizations.pageInfo.endCursor,
                    },
                    fetchPolicy:"network-only"
                });
            }
        });
        if (node) programObserver.current.observe(node);
    });

    useEffect(() => {
        getBuilders({
            fetchPolicy:"cache-and-network",
            nextFetchPolicy:"cache-and-network"
        });
        // eslint-disable-next-line
    }, [impersonator]);

    const [
        getBuilders,
        { data, loading: builderLoading, fetchMore },
    ] = useLazyQuery(GET_BUILDERS, {
        notifyOnNetworkStatusChange: false,
    });

    const [getEachBuilder, { loading: eachBuilderLoading }] = useLazyQuery(
        GET_BUILDER,
        {
            notifyOnNetworkStatusChange: false,
            variables: {
                id: active,
            },
            fetchPolicy:"network-only",
            nextFetchPolicy:"network-only",
            onCompleted: (data) => {
                if (data?.organization?.id) {
                    setEdit(true);
                    setSecondColumn(true);
                    setSearched(false);
                    setUserData(data?.organization);
                    setSearchString("");
                    setActualSearchString("");
                }
            },
        }
    );

    
    const debouncedValue =  useDebounce(searchString,160);

    useEffect(() => {
      if (debouncedValue && debouncedValue?.length > 2 ) {
        setSearched(true);
        searchBuilders();
        setOpenAbout(false);
      }
       // eslint-disable-next-line
    }, [debouncedValue])

    const [
        searchBuilders,
        { data: searchOrganizations, loading: searchedLoading },
    ] = useLazyQuery(SEARCH_BUILDERS, {
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
        setOpenAbout(true);
        getEachBuilder();
    };

    const createNew = () => {
        setActive("");
        setSecondColumn(true);
        setUserData({});
        setEdit(false);
        setClickedNew(true);
        setSearched(false);
        setOpenAbout(true);
        if (
            secondColumn !== true ||
            edit ||
            actualSearchString !== searchString
        ) {
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

    const refetch = (id) => {
        setActive(id);
        getEachBuilder();
    };

    useEffect(() => {
        if(props?.location?.state?.open === "user" && data?.organizations) {
            setActive(data?.organizations?.edges?.[0]?.node?.id);
            getEachBuilder();
            setOpenWhat("user")
        }
        else if(props?.location?.state?.open === "about" && data?.organizations) {
            setActive(data?.organizations?.edges?.[0]?.node?.id);
            getEachBuilder();
            setOpenWhat("about")
        }
        else if(props?.location?.state?.id && props?.location?.state?.from === "notification") {
            setActive(props?.location?.state?.id);
            getEachBuilder();
            if(props?.location?.state?.open === "programs") {
                setOpenWhat("programs")
            }
            else {
                setOpenWhat("about")
            }

        }
        // eslint-disable-next-line
    }, [props?.location?.state,data])

    return (
        <div className="h-full flex-1 pb-5">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Manage Builders</title>
            </Helmet>
            <div className="flex flex-col h-full">
                <main className="flex-1">
                    <div className="max-w-8xl flex flex-col h-full w-8xl mx-auto px-4 sm:px-6 lg:px-32">
                        <div className=" flex flex-col h-full gap-5 lg:flex-row rounded-lg">
                            <div className="w-full">
                                <div className="grid gap-5 grid-cols-9 min-h-smallMin  overflow-hidden">
                                    <div className="col-span-9 bg-white rounded-lg py-4 px-4 h1 flex">
                                        <p>Manage Builders </p>

                                        <HelperModal
                                            type={"builders"}
                                            title="Builder Information"
                                        />
                                    </div>
                                    <div className="bg-white rounded-lg  max-h-partial  col-span-9 xl:col-span-2">
                                        <div className="h-full relative">
                                            <div className=" inset-0    border-gray-200  rounded-lg h-full flex flex-col">
                                                <div className="flex px-4 border-b-2 border-gray-400  items-center justify-between space-x-5">
                                                    <div className="min-w-0 flex-1  py-3 max-w-full">
                                                        <div className=" flex rounded-md shadow-sm">
                                                            <div className="relative flex items-stretch flex-grow focus-within:z-10">
                                                                <input
                                                                    type="text"
                                                                    name="searchBuilders"
                                                                    value={
                                                                        searchString
                                                                    }
                                                                    id="searchBuilders"
                                                                    className="focus:ring-secondary focus:border-secondary block w-full rounded-md sm:text-sm border-gray-300"
                                                                    placeholder="Find or Add"
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {searched === true ||
                                                    data?.organizations?.edges
                                                        ?.length === 0 ? (
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
                                                    <div className="w-full min-h-smallMin border-r scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                        <ul className=" flex-0 w-full h-full  overflow-auto border-l  border-white scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                            {searched && searchString?.length > 0 ? (
                                                                searchedLoading ? (
                                                                    <Loader />
                                                                ) : searchOrganizations
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
                                                                                setActualSearchString(
                                                                                    ""
                                                                                );
                                                                                setSearchString(
                                                                                    ""
                                                                                );
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            Reset{" "}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    searchOrganizations &&
                                                                    searchOrganizations.searchOrganizations &&
                                                                    searchOrganizations
                                                                        .searchOrganizations
                                                                        .edges
                                                                        .length !==
                                                                        0 &&
                                                                    searchOrganizations?.searchOrganizations?.edges?.map(
                                                                        (
                                                                            eachData,
                                                                            index
                                                                        ) => {
                                                                            if (
                                                                                index ===
                                                                                searchOrganizations
                                                                                    ?.searchOrganizations
                                                                                    ?.edges
                                                                                    ?.length -
                                                                                    1
                                                                            ) {
                                                                                return (
                                                                                    <li
                                                                                        className={`  border-b transition-all  border-l-4  hover:border-l-6   ${
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
                                                                                            lastProgramElement
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
                                                            ) : builderLoading ? (
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
                                                                                ?.organizations
                                                                                ?.edges
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
                                                                                        lastProgramElement
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
                                                      Total:
                                                      {searched && searchString?.length > 0
                                                          ? searchOrganizations &&
                                                            searchOrganizations.searchOrganizations &&
                                                            searchOrganizations
                                                                .searchOrganizations
                                                                .edges.length
                                                          : data &&
                                                            data.organizations &&
                                                            data?.organizations
                                                                ?.pageInfo
                                                                ?.total} {" "}
                                                      Builders
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>

                                  <div className="flex flex-col col-span-9 xl:col-span-7 h-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                                      <>
                                          <CreateBuilder
                                              callBack={callBack}
                                              edit={edit}
                                              refetch={refetch}
                                              loading={eachBuilderLoading}
                                              openAbout={openAbout}
                                              user={
                                                  edit === true ? userData : {}
                                              }
                                              openWhat={openWhat}
                                              fillColumns={secondColumn}
                                              createNew={clickedNew}
                                              searchString={actualSearchString}
                                              resetState={() =>
                                                  setOpenAbout(false)
                                              }
                                              setUser={(node) => setUserData(node)}
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

export default Builders;
