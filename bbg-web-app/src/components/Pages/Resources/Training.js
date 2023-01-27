import React, {   useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLazyQuery } from "@apollo/client";
import { wordPressClient } from "../../../util/wordpress";
import Loader from "../../Loader/Loader";
import { FETCH_TRAINING_DATA } from "../../../lib/wordpress";
import { Link } from "react-router-dom";
import {APP_TITLE} from "../../../util/constants";



const Training = () => {

    const [trainingPosts,{data:trainingData, loading:trainingLoading}] = useLazyQuery(FETCH_TRAINING_DATA,{
        client:wordPressClient,
        fetchPolicy:"network-only",
        nextFetchPolicy:"network-only"
    })

    useEffect(() => {
        trainingPosts();
         // eslint-disable-next-line
    }, [])


    return (
        <div
            className="backgroundPage -mt-5 overflow-hidden pb-5"
            style={{ minHeight: "calc(100vh - 80px)" }}
        >
            <Helmet>
                <meta charSet="utf-8"/>
                <title>{APP_TITLE} - Training & Events</title>
            </Helmet>
            <div
                className="flex flex-col h-full relative"
                style={{ zIndex: 2 }}
            >
                <main className="flex-1">
                    <div className="max-w-8xl flex flex-col h-full w-8xl mx-auto px-4 sm:px-6 lg:px-32">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between lg:space-x-5 w-full">
                            <p className="h1 font-title py-2 lg:py-4 text-white rounded-lg mt-2 filter drop-shadow-xl text-4xl">
                                {" "}
                                Training & Events
                            </p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 mt-5  rounded-lg min-h-300 gap-6">
                            {trainingData?.posts?.edges?.length > 0 ? (
                                <>
                                    {trainingData?.posts?.edges?.map((item) => {
                                        return (
                                            <Link
                                                className="border p-4 rounded-lg bg-white flex flex-col justify-start"
                                                to={{
                                                    pathname: `/resources/${item?.node?.slug}`,
                                                    state: { item },
                                                }}
                                            >
                                                <div className="flex justify-between items-start relative ">
                                                    <div className="flex flex-col">
                                                        <p className="h1">
                                                            {" "}
                                                            {item?.node?.title}{" "}
                                                        </p>
                                                      
                                                    </div>

                                                    {item?.node?.featuredImage?.node
                                                        ?.sourceUrl ? (
                                                        <div
                                                            className="h-24 w-48 mb-2"
                                                            style={{
                                                                background: `url(${item?.node?.featuredImage?.node?.sourceUrl}) center no-repeat`,
                                                            }}
                                                            alt={
                                                                item?.node
                                                                    ?.featuredImage
                                                                    ?.node
                                                                    ?.altText
                                                            }
                                                        ></div>
                                                    ) : null}
                                                
                                                </div>
                                                <p
                                                    className="mb-2 text-darkgray75 py-2"
                                                    dangerouslySetInnerHTML={{
                                                        __html: item?.node?.excerpt,
                                                    }}
                                                />
                                            </Link>
                                        );
                                    })}
                                </>
                            ) : trainingLoading ? (
                                <div className="flex w-full items-center justify-center col-span-3">
                                    <Loader />
                                </div>
                            ) : (
                                <div className="flex w-full items-center justify-center col-span-3">
                                    <p className="font-title text-4xl text-white font-bold">
                                        {" "}
                                        No Training & Education Post Found.
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

export default Training;
