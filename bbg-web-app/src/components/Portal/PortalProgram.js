import React, { useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { AuthContext } from "../../contexts/auth";
import { renderGutenbergBlocks } from "../../util/blocks";
import { useLazyQuery, useMutation } from "@apollo/client";
import Button from "../Buttons";
import { UPDATE_BUILDER_ADD_PROGRAM } from "../../lib/builders";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { toast } from "react-toastify";
import { FETCH_PORTAL_ADS, FETCH_PORTAL_ADS_SQUARE } from "../../lib/wordpress";
import { wordPressClient } from "../../util/wordpress";
import { Link } from "react-router-dom";
import {APP_TITLE} from "../../util/constants";

const PortalProgram = (props) => {
    const [programs, setProgams] = useState([]);
    const [adsData, setAdsData] = useState();
    const [squareAdData, setSquareAdData] = useState();
    let item = props?.location?.state?.item;

    const {
        organizationNode,
        type,
        organizationId,
        setPrograms: methodSetPrograms,
    } = useContext(AuthContext);

    const [addProgram] = useMutation(UPDATE_BUILDER_ADD_PROGRAM, {
        update(cache, result) {
            toast.success("Program added successfully!");
            setProgams(
                result?.data?.updateOrganization?.programs?.edges?.map(
                    (element) => element?.node?.id
                )
            );
        },
    });

    useEffect(() => {
        if (programs) {
            methodSetPrograms(programs);
        }
        // eslint-disable-next-line
    }, [programs]);

    const [getAds, { data: adData }] = useLazyQuery(FETCH_PORTAL_ADS, {
        notifyOnNetworkStatusChange: false,
        client: wordPressClient,
    });

    const [getSquareAds, { data: squareAdsData }] = useLazyQuery(
        FETCH_PORTAL_ADS_SQUARE,
        {
            notifyOnNetworkStatusChange: false,
            client: wordPressClient,
        }
    );

    useEffect(() => {
        getAds();
        getSquareAds();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        findElementToDisplay();
        // eslint-disable-next-line
    }, [adData]);

    useEffect(() => {
        findSquareElementToDisplay();
        // eslint-disable-next-line
    }, [squareAdsData]);

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

    const findSquareElementToDisplay = () => {
        // eslint-disable-next-line
        let values = squareAdsData?.posts?.edges?.map((item) => {
            if (
                item?.node?.tags?.edges?.find(
                    (element) => element?.node?.name === "featured"
                )
            ) {
                return item;
            }
        });
        setSquareAdData(values);
    };

    useEffect(() => {
        setProgams(
            organizationNode?.organizations?.edges?.[0]?.node?.programs?.edges?.map(
                (element) => element?.node?.id
            )
        );
        methodSetPrograms(
            organizationNode?.organizations?.edges?.[0]?.node?.programs?.edges?.map(
                (element) => element?.node?.id
            )
        );
        // eslint-disable-next-line
    }, [organizationNode]);

    let TM = organizationNode?.organizations?.edges?.[0]?.node?.territoryManagers?.edges?.[0]?.node;

    let finalOrganizationNode = type === "TERRITORY_MANAGER" ? organizationNode : TM;

    let shouldDisplayButton = (id) => {
        if (programs?.includes(id)) {
            return false;
        } else {
            return true;
        }
    };

    function getRandomArbitrary(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    let random = getRandomArbitrary(0, adsData?.length - 1);
    let randomSquare = getRandomArbitrary(0, squareAdData?.length - 1);

    const findCategories = (item) => {
        let categories = [];
        let categoriesCount = [];

        item?.products?.edges
        // eslint-disable-next-line
            ?.map((insideItem) => {
                if(!categories?.includes(insideItem?.node?.category?.id)) {
                
                categories.push(insideItem?.node?.category?.id);
                let object = {};
                let product = {};
                object.id = insideItem?.node?.category?.id;
                object.name = insideItem?.node?.category?.name;
               
                product.code = insideItem?.node?.bbg_product_code;
                product.name = insideItem?.node?.name
                object.products = [product]
            
                
                object.count = 1;
                categoriesCount.push(object)
                }
                else if(categories?.includes(insideItem?.node?.category?.id)) {
                     let index = categoriesCount?.findIndex((element) => element?.id === insideItem?.node?.category?.id );
                     let product = {};
                     product.code = insideItem?.node?.bbg_product_code;
                     product.name = insideItem?.node?.name
                     categoriesCount[index] = {...categoriesCount[index],count:categoriesCount[index]?.count+1, products: [...categoriesCount[index]?.products,product]}   
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
                <title>{APP_TITLE} - Portal Programs - {item?.name}</title>
            </Helmet>
            <div
                className="flex flex-col h-full relative"
                style={{ zIndex: 2 }}
            >
                <main className="flex-1">
                    <div className="max-w-8xl flex flex-col h-full w-8xl mx-auto px-4 sm:px-6 lg:px-32">
                        <div
                            className="h1 font-title py-2 lg:py-4 text-white rounded-lg mt-2 filter drop-shadow-xl text-4xl flex gap-2"
                            style={{ textShadow: "-2px 2px 9px black" }}
                        >
                            {" "}
                            <Link to="/portal/programs">All Programs -</Link>
                            <p>{item?.title}</p>
                        </div>
                        <div className="flex xl:flex-row flex-col  rounded-lg py-2 xl:py-5   gap-x-6">
                            <div className="w-full flex flex-col ">
                                <div
                                    className=" col-span-2  p-4 bg-white rounded-lg  flex flex-col justify-start"
                                    style={{ height: "fit-content" }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <p className="h1">
                                                {" "}
                                                {item?.title}{" "}
                                            </p>
                                            <div className="flex flex-col lg:flex-row lg:items-center mb-2">
                                                
                                                <p className="text-sm text-gray-500 capitalize lg:hidden">
                                                    {item?.company?.name
                                                        ? item?.company?.name
                                                        : ""}
                                                </p>

                                                <p className="text-sm text-gray-500 capitalize ml-1 hidden lg:block">
                                                    {item?.company?.name
                                                        ? 
                                                          item?.company?.name
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
                                                    item?.featuredImage?.node
                                                        ?.altText
                                                }
                                            ></div>
                                        ) : null}
                                        {type === "BUILDERS" &&
                                        shouldDisplayButton(item?.id) ? (
                                            <div className=" hidden md:block  bg-white  mb-4 rounded-lg xl:px-4">
                                                <Button
                                                    title="Add to my Programs for Rebate Reporting"
                                                    color="secondary w-full text-center justify-center hover:bg-secondary85"
                                                    onClick={() =>
                                                        addProgram({
                                                            variables: {
                                                                id: organizationId,
                                                                programOverwrites: [
                                                                    {
                                                                        id:
                                                                            item?.id,
                                                                    },
                                                                ],
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                        ) : type !== "ADMIN" &&
                                          type !== "TERRITORY_MANAGER" ? (
                                            <CheckCircleIcon className="w-8 h-8 text-brickGreen" />
                                        ) : null}
                                    </div>

                                    {type === "BUILDERS" &&
                                    shouldDisplayButton(item?.id) ? (
                                        <div className="block md:hidden xl:hidden bg-white  mb-4 rounded-lg -mx-4 ">
                                            <Button
                                                title="Add to my Programs for Rebate Reporting"
                                                color="secondary w-full text-center justify-center hover:bg-secondary85"
                                            />
                                        </div>
                                    ) : null}

                                    {renderGutenbergBlocks(item?.blocks)}
                                </div>
                                <div
                                    id={adsData?.[random]?.node?.title}
                                    className="lg:block hidden advertisements-view bg-cover bg-center rounded-lg mt-4"
                                >
                                    <div
                                        className="w-full bg-cover bg-center  advertisements-click relative  rounded-lg"
                                        id={adsData?.[random]?.node?.title}
                                        style={{
                                            backgroundImage: `url(${adsData?.[random]?.node?.featuredImage?.node?.sourceUrl})`,
                                            height: "242px",
                                        }}
                                    >
                                        <p
                                            className="text-white font-title font-bold absolute left-4 xl:left-8 top-1/2 transform -translate-y-1/2 text-xl sm:text-2xl md:text-3xl lg:text-4xl  xl:text-5xl"
                                            style={{
                                                textShadow:
                                                    "-2px 2px 9px black",
                                                maxWidth: "50%",
                                            }}
                                        >
                                            {" "}
                                            {
                                                adsData?.[random]?.node?.title
                                            }{" "}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white flex flex-col p-4 rounded-lg mt-4">
                                    <p className="font-title h1 text-secondary pb-2">
                                        Products: {item?.title}{" "}
                                    </p>
                                    <div
                                        className="  "
                                        style={{ height: "fit-content" }}
                                    >
                                        {findCategories(item)?.map((item,index) => {
                                            return (
                                                <div className="w-full flex">
                                                    {index === findCategories(item)?.length -1? <div className="text-gray-500 font-semibold text-sm whitespace-nowrap pr-1 "> {item?.name} ({item?.count}) - </div> : <div className="text-gray-500 font-semibold text-sm block whitespace-nowrap pr-1"> {item?.name} ({item?.count}) - </div> }
                                                    <div className=" w-full">
                                                    {
                                                    item?.products?.map((insideItem,index) => {
                                                        return(
                                                        <div className="text-gray-500 w-full  text-sm">{insideItem?.code} {insideItem?.name}</div>
                                                        )
                                                    })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex  xl:flex-col xl:max-w-md w-full  rounded-lg pb-4">
                                <div className="flex flex-col sm:flex-row  xl:flex-col  w-full ">
                                    {type === "TERRITORY_MANAGER" ||
                                    type === "BUILDERS" ? (
                                        <div className="bg-white rounded-lg lg:max-w-lg py-4  w-full sm:mr-5 xl:mr-0 mt-4 xl:mt-0">
                                            <p className="h1 text-secondary font-title px-4 ">
                                                {" "}
                                                Have Questions?{" "}
                                            </p>
                                            <div className="flex flex-row sm:flex-col md:flex-row lg:flex-col xl:flex-row  space-x-5 items-start justify-between px-4 py-1">
                                                <div className="font-medium flex flex-col justify-start items-start self-start">
                                                    <p className="font-title text-darkgray75 text-sm 4xl:text-lg">
                                                        {
                                                            finalOrganizationNode?.first_name
                                                        }{" "}
                                                        {
                                                            finalOrganizationNode?.last_name
                                                        }
                                                    </p>
                                                    <a
                                                        className="font-title text-darkgray75 text-sm 4xl:text-lg underline"
                                                        href={`mailto:${finalOrganizationNode?.email}`}
                                                    >
                                                        {
                                                            finalOrganizationNode?.email
                                                        }{" "}
                                                    </a>
                                                    <div>
                                                        <a
                                                            className="font-title text-darkgray75 text-sm 4xl:text-lg underline"
                                                            href={`tel:${finalOrganizationNode?.mobile_phone}`}
                                                        >
                                                            {
                                                                finalOrganizationNode?.mobile_phone
                                                            }{" "}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className=" w-full">
                                                    <img
                                                        src={
                                                            finalOrganizationNode?.userImage
                                                        }
                                                        width="119px"
                                                        alt="Profile"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                    {item?.programsDownloads?.file ? (
                                        <div
                                            className={` bg-white rounded-lg  mt-4 sm:mt-4 xl:mt-0 flex flex-col pb-4 w-full lg:max-w-md ${
                                                type !== "ADMIN"
                                                    ? "xl:mt-4"
                                                    : ""
                                            }`}
                                        >
                                            <p className="font-title h1 text-secondary px-4 pt-4">
                                                Downloads
                                            </p>
                                            <div className="flex flex-col px-4">
                                                <a
                                                    className="text-secondary hover:text-secondary85 underline"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    href={`${item?.programsDownloads?.file?.mediaItemUrl}`}
                                                >
                                                    {
                                                        item?.programsDownloads
                                                            ?.downloadName
                                                    }
                                                </a>
                                            </div>
                                            {item?.programsDownloads?.addMore?.map(
                                                (item) => {
                                                    return (
                                                        <div className="flex flex-col px-4">
                                                            <a
                                                                className="text-secondary hover:text-secondary85 underline"
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                href={`${item?.file?.mediaItemUrl}`}
                                                            >
                                                                {
                                                                    item?.downloadName
                                                                }
                                                            </a>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    ) : null}
                                    <div
                                        id={
                                            squareAdData?.[randomSquare]?.node
                                                ?.title
                                        }
                                        className={`advertisements-view bg-cover bg-center rounded-lg  ${item?.programsDownloads?.file? "mt-4" : ""} flex-col pb-4 w-full h-64 sm:h-full lg:h-full xl:h-64 lg:pl-4 xl:pl-0  sm:pl-4 lg:max-w-md`}
                                    >
                                        <div
                                            className="w-full bg-cover bg-center advertisements-click relative  rounded-lg h-full"
                                            id={
                                                squareAdData?.[randomSquare]
                                                    ?.node?.title
                                            }
                                            style={{
                                                backgroundImage: `url(${squareAdData?.[randomSquare]?.node?.featuredImage?.node?.sourceUrl})`,
                                            }}
                                        >
                                            <p
                                                className="text-white font-title font-bold absolute left-4 xl:left-8 top-1/2 transform -translate-y-1/2 text-4xl sm:text-xl md:text-2xl lg:text-3xl  xl:text-4xl"
                                                style={{
                                                    textShadow:
                                                        "-2px 2px 9px black",
                                                    maxWidth: "50%",
                                                }}
                                            >
                                                {" "}
                                                {
                                                    squareAdData?.[randomSquare]
                                                        ?.node?.title
                                                }{" "}
                                            </p>
                                        </div>
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

export default PortalProgram;
