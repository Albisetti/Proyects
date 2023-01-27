import { useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../../../contexts/auth";
import { CLAIMS_PER_STATUS, FETCH_ALERTS } from "../../../lib/dashboard";
import { FETCH_BUILDER_AD_POST, FETCH_DEADLINE } from "../../../lib/wordpress";
import { wordPressClient } from "../../../util/wordpress";
import Testimonial from "../../Carousal/Testimonial";
import Loader from "../../Loader/Loader";
import { FULL_WHO_AM_I } from "../../../lib/auth";
import { FETCH_ORGANIZATION_WITH_REBATE_COUNT } from "../../../lib/addresses";
import Alert from "../../Alert/Alert";

const AdminDashboard = ({ type }) => {
    const first = 20;
    const history = useHistory();

    const { userData, impersonator, setUserData, organizationNode, setOrganizationNode } = useContext(AuthContext);

    const [
        buildersQueryAction,
        { data:builderCountAction,loading:actionBuilderLoading },
    ] = useLazyQuery(FETCH_ORGANIZATION_WITH_REBATE_COUNT, {
        notifyOnNetworkStatusChange: false,
        fetchPolicy: "no-cache",
    });

    const [
        buildersQueryReady,
        { data:builderCountReady,loading:readyBuilderLoading },
    ] = useLazyQuery(FETCH_ORGANIZATION_WITH_REBATE_COUNT, {
        notifyOnNetworkStatusChange: false,
        fetchPolicy: "no-cache",
    });

    useEffect(() => {
        whoAmI();
        getAdPosts();
        getClaimStatus();
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

    const [whoAmI, { data: user }] = useLazyQuery(FULL_WHO_AM_I, {
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

    const [getAlerts, { data: alerts, loading: alertLoading }] = useLazyQuery(FETCH_ALERTS, {
        variables: {
            first: first,
        },
        fetchPolicy: "network-only",
    });

    const [getAdPosts, { data: adData, loading: adLoading }] = useLazyQuery(FETCH_BUILDER_AD_POST, {
        notifyOnNetworkStatusChange: false,
        client: wordPressClient,
    });

    const [getDeadline, { data: deadline }] = useLazyQuery(FETCH_DEADLINE, {
        notifyOnNetworkStatusChange: false,
        client: wordPressClient,
    });

    const [getClaimStatus, { data: claimData }] = useLazyQuery(CLAIMS_PER_STATUS, {
        notifyOnNetworkStatusChange: false,
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

    const alertHandler = (type, entity) => {
        if (type === "Programs" && entity?.id) {
            history.push({
                pathname: "/programs",
                state: { id: entity?.id, from: "notification" },
            });
        } else if (type === "Organizations" && entity?.id) {
            history.push({
                pathname: "/profiles/builders",
                state: { id: entity?.id, from: "notification" },
            });
        }

        // else if  (type === "Bundles" && entity?.id) {
        //     history.push({
        //         pathname: "/reporting/bundles",
        //         state: { id: entity?.id,org_id:entity?.organization?.id, from: "notification" },
        //     });
        // } else if  (type === "SubDivision" && entity?.id) {
        //     history.push({
        //         pathname: "/reporting/addresses",
        //         state: { id: entity?.id, org_id:entity?.organization?.id, from: "notification" },
        //     });
        // } else if  (type === "Disputes" && entity?.id) {
        //     history.push({
        //         pathname: "/claims/createclaim",
        //         state: { id: entity?.id, org_id:entity?.claim?.id, from: "notification" },
        //     });
        // }
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
                        className={`flex-0 w-full h-full  overflow-auto border-l  border-white scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 `}
                    >
                        {alertLoading ? (
                            <Loader />
                        ) : (
                         <Alert alerts={alerts}  alertHandler={alertHandler}/>  
                        )}
                    </ul>
                </div>
                <div className="col-span-2 flex flex-col">
                    <div className="flex  justify-between space-x-5">
                        <div className="w-full border bg-white rounded-lg">
                            <p className="py-3 font-title text-secondary px-4 font-semibold border-b text-lg">Claims</p>
                            <ul className="flex flex-wrap px-4 py-2 gap-x-5">
                                <li className="my-2 flex  rounded-md border">
                                    <div
                                        className={`flex-shrink-0 flex items-center justify-center w-16 text-brickRed text-xl font-medium rounded-l-md`}
                                    >
                                        {claimData?.totalInProgressClaims?.pageInfo?.total?.toLocaleString()}
                                    </div>
                                    <div className="flex-1 flex items-center justify-between bg-white border-l rounded-r-md truncate">
                                        <div className="flex-1 px-4 py-2 text-lg">
                                            <Link
                                                to={{ pathname: "/claims/createclaim" }}
                                                className="text-gray-900 font-title  hover:text-gray-600"
                                            >
                                                In Progress
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                                <li className="my-2 flex  rounded-md border ">
                                    <div
                                        className={`flex-shrink-0 flex items-center justify-center w-16 text-secondary text-xl font-medium rounded-l-md`}
                                    >
                                        {claimData?.readyForSubmittalClaims?.pageInfo?.total?.toLocaleString()}
                                    </div>
                                    <div className="flex-1 flex items-center justify-between bg-white border-l rounded-r-md truncate">
                                        <div className="flex-1 px-4 py-2 text-lg">
                                            <Link
                                                to={{ pathname: "/claims/factoryworkflow" }}
                                                className="text-gray-900 font-title  hover:text-gray-600"
                                            >
                                                Ready for Submittal
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                                <li className="my-2 flex  rounded-md border">
                                    <div
                                        className={`flex-shrink-0 flex items-center justify-center w-16 text-secondary text-xl font-medium rounded-l-md`}
                                    >
                                        {claimData?.totalSubmittedClaims?.pageInfo?.total?.toLocaleString()}
                                    </div>
                                    <div className="flex-1 flex items-center justify-between bg-white border-l rounded-r-md truncate">
                                        <div className="flex-1 px-4 py-2 text-lg">
                                            <Link
                                                to={{ pathname: "/claims/factoryworkflow" }}
                                                className="text-gray-900 font-title  hover:text-gray-600"
                                            >
                                                Submitted
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
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
                    </div>
                    <div className="w-full col-span-2 border bg-white rounded-lg mt-5 ">
                        <Testimonial slides={adData} loading={adLoading} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
