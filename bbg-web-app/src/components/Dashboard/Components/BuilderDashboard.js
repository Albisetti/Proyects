import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/auth";
import { FETCH_ALERTS } from "../../../lib/dashboard";
import Loader from "../../Loader/Loader";
import Testimonial from "../../Carousal/Testimonial";
import { FETCH_BUILDER_AD_POST, FETCH_DEADLINE } from "../../../lib/wordpress";
import { wordPressClient } from "../../../util/wordpress";
import { FULL_WHO_AM_I } from "../../../lib/auth";
import Alert from "../../Alert/Alert";

const BuilderDashboard = ({ type }) => {
    const first = 20;
    
    const { organizationNode, impersonator, setOrganizationNode, setUserData, userData } = useContext(AuthContext);

    useEffect(() => {
        whoAmI();
        getAdPosts();
        getDeadline();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        getAlerts();
        // eslint-disable-next-line
    }, [impersonator]);

    const [whoAmI, { data: user,loading:whoAmIloading }] = useLazyQuery(FULL_WHO_AM_I, {
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

    const [getAlerts, { data: alerts, loading: alertLoading }] = useLazyQuery(FETCH_ALERTS, {
        variables: {
            first: first,
        },
        fetchPolicy: "network-only",
        onCompleted: (result) => {},
    });

    const [getAdPosts, { data: adData, loading: adLoading }] = useLazyQuery(FETCH_BUILDER_AD_POST, {
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

    let TM = organizationNode?.organizations?.edges?.[0]?.node?.territoryManagers?.edges?.[0]?.node;

    return (
        <>
            {displayDeadline(deadline?.acfOptions?.deadlineAlert?.date) ? (
                <p className="py-3 font-title text-brickRed px-4 font-semibold border-b  text-lg bg-white rounded-lg">
                    {deadline?.acfOptions?.deadlineAlert?.message} - {deadline?.acfOptions?.deadlineAlert?.date}
                </p>
            ) : null}
            <div className="grid grid-cols-3 w-full gap-5">
                <div className="h-full w-full bg-white border rounded-lg col-span-1">
                    <p className="py-3 font-title text-secondary px-4 font-semibold border-b  text-lg ">
                        Alert & Notifications
                    </p>
                    <ul
                        className={`flex-0 w-full h-full  overflow-auto border-l  border-white scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ${
                            displayDeadline(deadline?.acfOptions?.deadlineAlert?.date) ? "" : "max-h-60"
                        } `}
                        style={{ maxHeight: "76vh", minHeight: "76vh" }}
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
                       
                        <div className="w-full border bg-white rounded-lg">
                            <p className="py-3 font-title text-secondary px-4 font-semibold border-b  text-lg">
                                Rebate Reporting
                            </p>
                            { whoAmIloading?
                            <div>
                        <Loader />
                        </div>
                        :
                            <ul className="flex flex-col px-4 py-2">
                                <li className="my-2 flex  rounded-md border">
                                    <div
                                        className={`flex-shrink-0 flex items-center justify-center w-16 text-brickRed text-xl font-medium rounded-l-md`}
                                    >
                                        {organizationNode?.organizations?.edges?.[0]?.node?.ActionRequiredRebatesCount?.rebateCount?.toLocaleString()}
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
                                        {organizationNode?.organizations?.edges?.[0]?.node?.ReadiedRebatesCount?.rebateCount?.toLocaleString()}
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
}
                        </div>

                        <div className=" bg-white border rounded-lg w-full ">
                            <p className="py-3 font-title text-secondary px-4 font-semibold border-b  text-lg ">
                                Have Questions? Need Help?
                            </p>
                            <p className="font-title text-secondary text-lg px-4 mt-1">
                                {" "}
                                We're here to make your membership value grow.
                            </p>

                            <div className="flex space-x-5 px-4 py-1">
                                <div
                                    className="block bg-center bg-cover"
                                    style={{
                                        backgroundImage: `url(${TM?.userImage})`,
                                        width: "130px",
                                        height: "150px",
                                    }}
                                ></div>
                                <div className="mt-2 font-medium">
                                    <p className="font-title text-secondary text-lg">
                                        {TM?.first_name} {TM?.last_name}
                                    </p>
                                    <a className="font-title text-secondary text-lg" href={`mailto:${TM?.email}`}>
                                        {TM?.email}{" "}
                                    </a>
                                    <div>
                                        <a
                                            className="font-title text-secondary text-lg"
                                            href={`tel:${TM?.mobile_phone}`}
                                        >
                                            {TM?.mobile_phone}{" "}
                                        </a>
                                    </div>
                                </div>
                            </div>
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

export default BuilderDashboard;
