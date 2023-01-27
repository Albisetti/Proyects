import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import {
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@heroicons/react/solid";
import CommonSelect from "../Select";
import Button from "../Buttons";
import { useLazyQuery } from "@apollo/client";
import { FETCH_ALL_PROGRAMS, FETCH_PORTAL_PROGRAMS } from "../../lib/programs";
import { wordPressClient } from "../../util/wordpress";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import { FETCH_PORTAL_ADS } from "../../lib/wordpress";
import { AuthContext } from "../../contexts/auth";
import {APP_TITLE} from "../../util/constants";

const Programs = () => {
    const [defaultFilters, setDefaultFilters] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [typeSelection, setTypeSelection] = useState([]);
    const [tags, setTags] = useState({});
    const [tagSelection, setTagSelection] = useState([]);
    const [programList, setProgramsList] = useState();
    const [foundTags, setFoundTags] = useState(false);
    const [adsData, setAdsData] = useState();
    const [random,setRandom] = useState()

    const {programs:builderPrograms, setPrograms,organizationNode} = useContext(AuthContext)

    useEffect(() => {
        getPrograms({
            variables: {
                first: 20000,
                programtype: typeSelection?.map((item) => item?.value),
            },
        });
        fetchPortalPrograms({
            variables: {
                tags: tagSelection?.map((item) => item?.value),
            },
        });
        // eslint-disable-next-line
    }, []);

    const [
        fetchPortalPrograms,
        { data: programs, loading: programLoading },
    ] = useLazyQuery(FETCH_PORTAL_PROGRAMS, {
        client: wordPressClient,
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only",
        onCompleted: () => {
            if (!foundTags) {
                let array = [];
                let TagIDs = [];
                programs?.programs?.edges?.forEach((item) => {
                    item?.node?.tags?.edges?.forEach((insideItem) => {
                        if (TagIDs?.includes(insideItem?.node?.databaseId)) {
                            return;
                        } else {
                            let object = {};
                            object.id = insideItem?.node?.databaseId;
                            object.name = insideItem?.node?.name;
                            TagIDs.push(insideItem?.node?.databaseId);
                            array.push({ node: object });
                        }
                    });
                });
                setTags(array);
                setFoundTags(true);
            }
            actualProgramListToDisplay();
        },
    });

    const programTypes = {
        edges: [
            {
                node: {
                    id: "FACTORY",
                    name: "Factory",
                },
            },
            {
                node: {
                    id: "VOLUME",
                    name: "Volume",
                },
            },
        ],
    };

    const [getPrograms, { data, loading }] = useLazyQuery(FETCH_ALL_PROGRAMS, {
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only",
        notifyOnNetworkStatusChange: false,
    });

    const actualProgramListToDisplay = () => {
        let all = programs?.programs?.edges?.filter((item) =>
            data?.programs?.edges
                ?.map((item) => item?.node?.id)
                ?.includes(item?.node?.slug)
        );

        let array = all?.map((item) => {
            let element = data?.programs?.edges?.find(
                (a) => a?.node?.id === item?.node?.slug
            );
            let object = { ...item?.node, ...element?.node };
            return object;
        });


        setProgramsList(array);
    };

    useEffect(() => {
        if (data?.programs && programs?.programs) {
            actualProgramListToDisplay();
        }
        // eslint-disable-next-line
    }, [data, programs]);

    const typeHandler = (e) => {
        let array = [];
        e?.forEach((item) => {
            let object = {};
            object.value = item.value;
            object.label = item.label;
            array.push(object);
        });
        setTypeSelection(array);
    };

    const tagHandler = (e) => {
        let array = [];
        e?.forEach((item) => {
            let object = {};
            object.value = item.value;
            object.label = item.label;
            array.push(object);
        });
        setTagSelection(array);
    };

    const handleApply = () => {
        getPrograms({
            variables: {
                first: 20000,
                programtype: typeSelection?.map((item) => item?.value),
            },
        });

        fetchPortalPrograms({
            variables: {
                tags: tagSelection?.map((item) => item?.value),
            },
        });

        setShowFilters(false);
    };

    useEffect(() => {
        if (typeSelection?.length === 0 && tagSelection?.length === 0) {
            setDefaultFilters(true);
        } else {
            setDefaultFilters(false);
        }
    }, [typeSelection, tagSelection]);

    const [getAds, { data: adData }] = useLazyQuery(FETCH_PORTAL_ADS, {
        notifyOnNetworkStatusChange: false,
        client: wordPressClient,
    });

    useEffect(() => {
        getAds();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        findElementToDisplay();
        // eslint-disable-next-line
    }, [adData]);

    const findElementToDisplay = () => {
        // eslint-disable-next-line
        let values = adData?.posts?.edges?.map((item) => {
            if (
                item?.node?.tags?.edges?.find(
                    (element) => element?.node?.name === "featured"
                )
            ) {
                return item;
            }
        });
        setAdsData(values);
    };

    function getRandomArbitrary(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    useEffect(() => {
        setRandom(getRandomArbitrary(0, adsData?.length - 1));
    }, [adsData])

    useEffect(() => {
        setPrograms(organizationNode?.organizations?.edges?.[0]?.node?.programs?.edges?.map(
            (element) => element?.node?.id
        ))
        // eslint-disable-next-line
    }, [organizationNode]);


    let shouldDisplayButton = (id) => {
        if (builderPrograms?.includes(id)) {
            return false;
        } else {
            return true;
        }
    };

    const findCategories = (item) => {
        let categories = [];
        let categoriesCount = [];

        item?.products?.edges
        // eslint-disable-next-line
            ?.map((insideItem) => {
                if(!categories?.includes(insideItem?.node?.category?.id)) {
                
                categories.push(insideItem?.node?.category?.id);
                let object = {};
                object.id = insideItem?.node?.category?.id;
                object.name = insideItem?.node?.category?.name;
                object.count = 1;
                categoriesCount.push(object)
                }
                else if(categories?.includes(insideItem?.node?.category?.id)) {
                     let index = categoriesCount?.findIndex((element) => element?.id === insideItem?.node?.category?.id );
                     categoriesCount[index] = {...categoriesCount[index],count:categoriesCount[index]?.count+1}
                        
                }
                
            })

        return categoriesCount

    }


    return (
        <div
            className="backgroundPage -mt-5 overflow-hidden pb-5"
            style={{ minHeight: "calc(100vh - 80px)" }}
        >
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Portal Programs</title>
            </Helmet>
            <div
                className="flex flex-col h-full relative"
                style={{ zIndex: 2 }}
            >
                <main className="flex-1">
                    <div className="max-w-8xl flex flex-col h-full w-8xl mx-auto px-4 sm:px-6 lg:px-32">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between lg:space-x-5 w-full">
                            <p className="h1 font-title py-2 lg:py-4 text-white rounded-lg mt-2 filter text-4xl" style={{textShadow: "-2px 2px 9px black"}}>
                                {" "}
                                All Programs
                            </p>
                            <div className="bg-white rounded-lg w-full font-title font-semibold col-span-10 mt-2 lg:mt-5 flex-1 lg:max-w-xl">
                                <div
                                    className="flex 6xl:gap-0 6xl:flex w-full space-x-5   6xl:justify-between py-2 px-4   cursor-pointer "
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <div className="flex  ">
                                        <div className="flex space-x-2 items-center pr-5">
                                            <span className=" text-sm  text-secondary ">
                                                Filters
                                            </span>
                                            <div
                                                className="border-r pr-5"
                                                style={{
                                                    maxHeight: "1.25rem",
                                                }}
                                            >
                                                {showFilters ? (
                                                    <ChevronUpIcon className="text-secondary w-5 h-5 " />
                                                ) : (
                                                    <ChevronDownIcon className="text-secondary w-5 h-5 " />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 w-full ">
                                        <div className=" col-span-2">
                                            {defaultFilters ? (
                                                <span className="lg:ml-2 text-sm  text-secondary">
                                                    Type:{" "}
                                                    <span className="text-gray-500">
                                                        {" "}
                                                        All{" "}
                                                    </span>
                                                </span>
                                            ) : (
                                                <div className="flex flex-col ">
                                                    <span className="lg:ml-2 text-sm  text-secondary">
                                                        Type:
                                                    </span>
                                                    {typeSelection?.length >
                                                    0 ? (
                                                        typeSelection?.map(
                                                            (item) => {
                                                                return (
                                                                    <span className="lg:ml-2 text-sm  text-gray-500">
                                                                        {
                                                                            item?.label
                                                                        }
                                                                    </span>
                                                                );
                                                            }
                                                        )
                                                    ) : (
                                                        <span className="lg:ml-2 text-sm  text-gray-500">
                                                            All
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className=" col-span-2">
                                            {defaultFilters ? (
                                                <span className="lg:ml-2 text-sm  text-secondary">
                                                    Tags:{" "}
                                                    <span className="text-gray-500">
                                                        {" "}
                                                        All{" "}
                                                    </span>
                                                </span>
                                            ) : (
                                                <div className="flex flex-col ">
                                                    <span className="lg:ml-2 text-sm  text-secondary">
                                                        Tags:
                                                    </span>
                                                    {tagSelection?.length >
                                                    0 ? (
                                                        tagSelection?.map(
                                                            (item) => {
                                                                return (
                                                                    <span className="lg:ml-2 text-sm  text-gray-500">
                                                                        {
                                                                            item?.label
                                                                        }
                                                                    </span>
                                                                );
                                                            }
                                                        )
                                                    ) : (
                                                        <span className="lg:ml-2 text-sm  text-gray-500">
                                                            All
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {showFilters ? (
                                    <div className="grid lg:grid-cols-3 gap-5 6xl:gap-0 pb-4 px-4">
                                        <div className="flex flex-col">
                                            <span className=" text-sm  text-secondary">
                                                Program Type
                                            </span>
                                            <CommonSelect
                                                // eslint-disable-next-line
                                                options={programTypes}
                                                className=" "
                                                value={typeSelection}
                                                from="createProgram"
                                                noOptionsMessage="No Programs Found"
                                                placeHolder="Program Type"
                                                isMulti
                                                menuPlacement={"bottom"}
                                                onChange={(e) => typeHandler(e)}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className=" text-sm  text-secondary">
                                                Program Tags
                                            </span>
                                            <CommonSelect
                                                // eslint-disable-next-line
                                                options={{ edges: tags }}
                                                className=" "
                                                value={tagSelection}
                                                from="createProgram"
                                                noOptionsMessage="No Tags Found"
                                                placeHolder="Tags"
                                                isMulti
                                                menuPlacement={"bottom"}
                                                onChange={(e) => tagHandler(e)}
                                            />
                                        </div>

                                        <div className="flex justify-end items-end ml-5 ">
                                            <Button
                                                title="Apply"
                                                color="secondary"
                                                buttonClass="px-2"
                                                onClick={() => handleApply()}
                                            />
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 mt-5  rounded-lg  gap-6">
                            {programList?.length > 0 ? (
                                <>
                                    {programList?.slice(0, 3)?.map((item) => {
                                        
                                        let values = findCategories(item);
                                        
                                        return (
                                            <Link
                                                className="border p-4 rounded-lg bg-white flex flex-col justify-start"
                                                to={{
                                                    pathname: `/portal/programs/${item?.slug}`,
                                                    state: { item },
                                                }}
                                            >
                                                <div className="flex justify-between items-start relative h-24">
                                                    <div className="flex flex-col">
                                                        <p className="h1">
                                                            {" "}
                                                            {item?.title}{" "}
                                                        </p>
                                                        <div className="flex flex-col 2xl:flex-row 2xl:items-center mb-2">
                                                           
                                                            <p className="text-sm text-gray-500 capitalize 2xl:hidden">
                                                                {item?.company
                                                                    ?.name
                                                                    ? item
                                                                          ?.company
                                                                          ?.name
                                                                    : ""}
                                                            </p>

                                                            <p className="text-sm text-gray-500 capitalize hidden 2xl:block">
                                                                {item?.company
                                                                    ?.name
                                                                    ? 
                                                                      item
                                                                          ?.company
                                                                          ?.name
                                                                    : ""}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {item?.featuredImage?.node
                                                        ?.sourceUrl ? (
                                                        <div
                                                            className="h-24 w-48 mb-2"
                                                            style={{
                                                                background: `url(${item?.featuredImage?.node?.sourceUrl}) center no-repeat`,
                                                            }}
                                                            alt={
                                                                item
                                                                    ?.featuredImage
                                                                    ?.node
                                                                    ?.altText
                                                            }
                                                        ></div>
                                                    ) : null}
                                                    {shouldDisplayButton(item?.id) ? null :
                                                    <CheckCircleIcon className="absolute right-0 w-8 h-8 text-brickGreen" />
                                    }
                                                </div>

                                                <p
                                                    className="mb-2 text-darkgray75 py-2"
                                                    dangerouslySetInnerHTML={{
                                                        __html: item?.excerpt,
                                                    }}
                                                />
                                                <p className="font-title text-secondary font-semibold text-xl">
                                                    Products
                                                </p>
                                                <div className="flex items-center space-x-1">
                                                    {
                                                        values?.map((item,index) => {
                                                            
                                                            if(index === values?.length - 1) {
                                                            return(
                                                                <p className="text-gray-500 text-sm" >
                                                                    {item?.name} ({item?.count})
                                                                </p>
                                                            )}
                                                            else {
                                                                return(
                                                                    <p className="text-gray-500 text-sm" >
                                                                        {item?.name} ({item?.count}),
                                                                    </p>
                                                                )
                                                            }
                                                        })
                                                    }
                                                    
                                                </div>
                                            </Link>
                                        );
                                    })}
                                    <div
                                        id={adsData?.[random]?.node?.title}
                                        className=" advertisements-view bg-cover bg-center rounded-lg  lg:col-span-2 "
                                        style={{  minHeight:'12rem'}}
                                    >
                                        <div
                                            className="w-full bg-cover bg-center  advertisements-click relative  rounded-lg h-48  lg:h-full"
                                            id={adsData?.[random]?.node?.title}

                                            style={{
                                                backgroundImage: `url(${adsData?.[random]?.node?.featuredImage?.node?.sourceUrl})`,
                                                minHeight:'12rem'
                                            }}
                                        >

                                            <p
                                                className="text-white font-title font-bold absolute left-4 xl:left-8 top-1/2 transform -translate-y-1/2 text-xl sm:text-2xl md:text-3xl lg:text-4xl  xl:text-5xl"
                                                style={{
                                                   textShadow: "-2px 2px 9px black",
                                                    maxWidth: "50%",
                                                  
                                                }}
                                            >
                                                {" "}
                                                {
                                                    adsData?.[random]?.node
                                                        ?.title
                                                }{" "}
                                            </p>
                                        </div>
                                    </div>
                                    {programList?.length > 3 &&
                                        programList
                                            ?.slice(3, programList?.length)
                                            ?.map((item) => {
                                                let values = findCategories(item);
                                                return (
                                                    <Link
                                                        className="border p-4 rounded-lg bg-white flex flex-col justify-start"
                                                        to={{
                                                            pathname: `/portal/programs/${item?.slug}`,
                                                            state: { item },
                                                        }}
                                                    >
                                                        <div className="flex justify-between items-start relative h-24">
                                                            <div className="flex flex-col">
                                                                <p className="h1">
                                                                    {" "}
                                                                    {
                                                                        item?.title
                                                                    }{" "}
                                                                </p>
                                                                <div className="flex flex-col lg:flex-row lg:items-center mb-2">
                                                                  
                                                                    <p className="text-sm text-gray-500 capitalize lg:hidden">
                                                                        {item
                                                                            ?.company
                                                                            ?.name
                                                                            ? item
                                                                                  ?.company
                                                                                  ?.name
                                                                            : ""}
                                                                    </p>

                                                                    <p className="text-sm text-gray-500 capitalize  hidden lg:block">
                                                                        {item
                                                                            ?.company
                                                                            ?.name
                                                                            ?
                                                                              item
                                                                                  ?.company
                                                                                  ?.name
                                                                            : ""}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {item?.featuredImage
                                                                ?.node
                                                                ?.sourceUrl ? (
                                                                <div
                                                                    className="h-24 w-48 mb-2"
                                                                    style={{
                                                                        background: `url(${item?.featuredImage?.node?.sourceUrl}) center no-repeat`,
                                                                    }}
                                                                    alt={
                                                                        item
                                                                            ?.featuredImage
                                                                            ?.node
                                                                            ?.altText
                                                                    }
                                                                ></div>
                                                            ) : null}
                                                            { shouldDisplayButton(item?.id) ? null :
                                                            <CheckCircleIcon className="absolute right-0 w-8 h-8 text-brickGreen" />
                                            }
                                                        </div>

                                                        <p
                                                            className="mb-2 text-darkgray75 py-2"
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    item?.excerpt,
                                                            }}
                                                        />
                                                        <p className="font-title text-secondary font-semibold text-xl">
                                                    Products
                                                </p>
                                                <div className="flex items-center space-x-1">
                                                    {
                                                        values?.map((item,index) => {
                                                            
                                                            if(index === values?.length - 1) {
                                                            return(
                                                                <p className="text-gray-500 text-sm" >
                                                                    {item?.name} ({item?.count})
                                                                </p>
                                                            )}
                                                            else {
                                                                return(
                                                                    <p className="text-gray-500 text-sm" >
                                                                        {item?.name} ({item?.count}),
                                                                    </p>
                                                                )
                                                            }
                                                        })
                                                    }
                                                    
                                                </div>
                                                    </Link>
                                                );
                                            })}
                                </>
                            ) : loading || programLoading ? (
                                <div className="flex w-full items-center justify-center col-span-3">
                                    <Loader />
                                </div>
                            ) : (
                                <div className="flex w-full items-center justify-center col-span-3">
                                    <p className="font-title text-4xl text-white font-bold">
                                        {" "}
                                        No Programs Found.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Programs;
