import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useRef, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/auth";
import { BUILDERS_WITHOUT_BUNDLES, FETCH_ALERTS } from "../../../lib/dashboard";
import { FETCH_DEADLINE, FETCH_TM_AD_POST } from "../../../lib/wordpress";
import { wordPressClient } from "../../../util/wordpress";
import Testimonial from "../../Carousal/Testimonial";
import Loader from "../../Loader/Loader";
import { FULL_WHO_AM_I } from "../../../lib/auth";
import { FETCH_ORGANIZATION_WITH_REBATE_COUNT } from "../../../lib/addresses";
import Alert from "../../Alert/Alert";

const TMDashboard = ({ type }) => {
    const first = 20;
    
    const bundlesObserver = useRef();
    const { organizationNode, impersonator, setUserData, setOrganizationNode, userData } = useContext(AuthContext);

    const [buildersQueryAction, { data: builderCountAction, loading: actionBuilderLoading }] = useLazyQuery(
        FETCH_ORGANIZATION_WITH_REBATE_COUNT,
        {
            notifyOnNetworkStatusChange: false,
            fetchPolicy: "no-cache",
        }
    );

    const [buildersQueryReady, { data: builderCountReady, loading: readyBuilderLoading }] = useLazyQuery(
        FETCH_ORGANIZATION_WITH_REBATE_COUNT,
        {
            notifyOnNetworkStatusChange: false,
            fetchPolicy: "no-cache",
        }
    );

    useEffect(() => {
        whoAmI();
        getAdPosts();
        getBuildersWithNoBundles();
        getDeadline();
        buildersQueryAction({
            variables: {
                status: "ACTION_REQUIRED",
            },
        });
        buildersQueryReady({
            variables: {
                status: "REBATE_READY",
            },
        });
        // eslint-disable-next-line
    }, []);

    const [whoAmI, { data: user}] = useLazyQuery(FULL_WHO_AM_I, {
        fetchPolicy: "no-cache",
        onCompleted: () => {
            if (!user?.whoAmI?.user) {
                setUserData(null);
            } else {
                let newNode = user?.whoAmI?.user;
                setOrganizationNode({ ...organizationNode, ...newNode });
                setUserData({ ...userData, ...newNode });
            }
        },
    });

    useEffect(() => {
        getAlerts();
        // eslint-disable-next-line
    }, [impersonator]);


    // eslint-disable-next-line
    const lastBundleElement = useCallback((node) => {
        if (bundlesObserver.current) bundlesObserver.current.disconnect();
        bundlesObserver.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && bundles.buildersWithoutBundles.pageInfo.hasNextPage) {
                fetchMoreBundles({
                    variables: {
                        first,
                        after: bundles.buildersWithoutBundles.pageInfo.endCursor,
                    },
                });
            }
        });
        if (node) bundlesObserver.current.observe(node);
    });

    const [getAlerts, { data: alerts, loading: alertLoading }] = useLazyQuery(FETCH_ALERTS, {
        variables: {
            first: first,
        },
        fetchPolicy: "network-only",
        onCompleted: (result) => {},
    });

    const [
        getBuildersWithNoBundles,
        { data: bundles, fetchMore: fetchMoreBundles, loading: bundlesLoading },
    ] = useLazyQuery(BUILDERS_WITHOUT_BUNDLES, {
        variables: {
            first: first,
        },
        onCompleted: (result) => {},
    });

    const [getAdPosts, { data: adData, loading: adLoading }] = useLazyQuery(FETCH_TM_AD_POST, {
        notifyOnNetworkStatusChange: false,
        client: wordPressClient,
    });

    const [getDeadline, { data: deadline }] = useLazyQuery(FETCH_DEADLINE, {
        notifyOnNetworkStatusChange: false,
        client: wordPressClient,
    });

    const displayDeadline = (d) => {
        var date = d?.split("/");
        var f = new Date(date?.[2], date?.[1] - 1, date?.[0]).getTime();

        let now = new Date().getTime();
        const compare = 1814400;

        if (f - compare > now) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <>
            {displayDeadline(deadline?.acfOptions?.deadlineAlert?.date) ? (
                <p className="py-3 font-title text-brickRed px-4 font-semibold border-b text-lg bg-white rounded-lg">
                    {deadline?.acfOptions?.deadlineAlert?.message} - {deadline?.acfOptions?.deadlineAlert?.date}
                </p>
            ) : null}

            <div className="grid grid-cols-3 w-full gap-5">
                <div className="h-full w-full bg-white border rounded-lg col-span-1">
                    <p className="py-3 font-title text-secondary px-4 font-semibold border-b text-lg ">
                        Alert & Notifications
                    </p>
                    <ul
                        style={{ maxHeight: "76vh", minHeight: "76vh" }}
                        className={`flex-0 w-full h-full  overflow-auto border-l  border-white scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400`}
                    >
                        {alertLoading ? (
                            <Loader />
                        ) : (
                            <Alert alerts={alerts} />
                        )}
                    </ul>
                </div>
                <div className="col-span-2 flex flex-col">
                    <div className="flex  justify-between space-x-5">
                        <div className="bg-white border rounded-lg w-full h-full">
                            <p className="py-3 font-title text-secondary px-4 font-semibold border-b text-lg">
                                Rebate Reporting
                            </p>
                            {actionBuilderLoading || readyBuilderLoading ? (
                                <div>
                                    <Loader />
                                </div>
                            ) : (
                                <ul className="flex flex-col h-full px-4 py-2">
                                    <li className="my-2 flex  rounded-md border">
                                        <div
                                            className={`flex-shrink-0 flex items-center justify-center w-16 text-brickRed text-xl font-medium rounded-l-md`}
                                        >
                                            {builderCountAction?.organizationsWithRebate?.pageInfo?.count?.toLocaleString()}
                                        </div>
                                        <div className="flex-1 flex items-center justify-between bg-white border-l rounded-r-md truncate">
                                            <div className="flex-1 px-4 py-2 text-lg">
                                                <Link
                                                    to={{ pathname: "/reporting/prepare" }}
                                                    className="text-gray-900 font-title  hover:text-gray-600"
                                                >
                                                    Actions Required
                                                </Link>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="my-2 flex  rounded-md border">
                                        <div
                                            className={`flex-shrink-0 flex items-center justify-center w-16 text-secondary text-xl font-medium rounded-l-md`}
                                        >
                                            {builderCountReady?.organizationsWithRebate?.pageInfo?.count?.toLocaleString()}
                                        </div>
                                        <div className="flex-1 flex items-center justify-between bg-white border-l rounded-r-md truncate">
                                            <div className="flex-1 px-4 py-2 text-lg">
                                                <Link
                                                    to={{ pathname: "/reporting/prepare", active: "1" }}
                                                    className="text-gray-900 font-title  hover:text-gray-600"
                                                >
                                                    Ready for Rebate
                                                </Link>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            )}
                        </div>
                        <div className=" bg-white border rounded-lg w-full ">
                            <p className="py-3 font-title text-secondary px-4 font-semibold border-b text-lg ">
                                "No Bundles" List
                            </p>
                            <ul
                                className={`flex-0 w-full   overflow-auto border-l max-h-60  border-white scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 `}
                            >
                                {bundlesLoading ? (
                                    <Loader />
                                ) : (
                                    bundles &&
                                    bundles.buildersWithoutBundles &&
                                    bundles.buildersWithoutBundles.edges.length !== 0 &&
                                    bundles.buildersWithoutBundles.edges.map((eachData, index) => {
                                        if (index === bundles.buildersWithoutBundles.edges.length - 1) {
                                            return (
                                                <li
                                                    className={`  border-b transition-all  border-l-4 border-l-primary   hover:border-l-6 `}
                                                    ref={lastBundleElement}
                                                >
                                                    <div className="relative  ">
                                                        <div className="text-sm py-3 px-2 font-semibold text-darkgray75">
                                                            <p className="  focus:outline-none">{eachData.node.name}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        }
                                        return (
                                            <li
                                                className={`  border-b transition-all  border-l-4 border-l-primary   hover:border-l-6  `}
                                            >
                                                <div className="relative  ">
                                                    <div className="text-sm py-3 px-2 font-semibold  text-darkgray75">
                                                        <p className="  focus:outline-none">{eachData.node.name}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="w-full border bg-white rounded-lg col-span-2 relative mt-5 ">
                        <Testimonial slides={adData} loading={adLoading} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default TMDashboard;
