import React from 'react'
import { Helmet } from 'react-helmet';
import { renderGutenbergBlocks } from '../../../util/blocks';
import {APP_TITLE} from "../../../util/constants";

const SingleEvent = (props) => {


    let item = props?.location?.state?.item?.node;
    return (
        <div
        className="backgroundPage -mt-5 overflow-hidden pb-5"
        style={{ minHeight: "calc(100vh - 80px)" }}
    >
        <Helmet>
            <meta charSet="utf-8" />
            <title>{APP_TITLE} - Training & Events - {item?.title}</title>
        </Helmet>
        <div
            className="flex flex-col h-full relative"
            style={{ zIndex: 2 }}
        >
            <main className="flex-1">
                <div className="max-w-8xl flex flex-col h-full w-8xl mx-auto px-4 sm:px-6 lg:px-32">
                    <p className="h1 font-title py-2 lg:py-4 text-white rounded-lg mt-2 filter drop-shadow-xl text-4xl">
                        {" "}
                        {item?.title}
                    </p>
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
                                            <p className="text-sm text-gray-500 capitalize ">
                                                {item?.type?.toLowerCase()}
                                            </p>
                                            <p className="text-sm text-gray-500 capitalize lg:hidden">
                                                {item?.company?.name
                                                    ? item?.company?.name
                                                    : ""}
                                            </p>

                                            <p className="text-sm text-gray-500 capitalize ml-1 hidden lg:block">
                                                {item?.company?.name
                                                    ? "  - " +
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
                                  
                                </div>

                                {renderGutenbergBlocks(item?.blocks)}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
    )
}

export default SingleEvent
