import React, { useState,useEffect } from "react";
import { ArrowCircleRightIcon } from "@heroicons/react/outline";
import AlertAccordian from "./AlertAccordian";

const Alert = ({ alerts, alertHandler }) => {
    const [activeAlerts, setActiveAlerts] = useState();
    const [activeAlertType, setActiveAlertType] = useState();

    useEffect(() => {
        setActiveAlerts(
            alerts?.userNotifications?.edges?.filter((alert) => alert?.node?.message_action === activeAlertType)
        );
        //eslint-disable-next-line
    }, [activeAlertType])

    if (!alerts) {
        return null;
    }

    let types = [];
    alerts?.userNotifications?.edges?.forEach((alert) => {
        if (!types?.includes(alert?.node?.message_action)) {
            types.push(alert?.node?.message_action);
        }
    });

    const AlertAccordionExpandComponent = () => {
        return (
            <ul>
                {activeAlerts?.map((eachData) => {
                    let verify =
                    eachData?.node?.related_entity?.id &&
                    eachData?.node?.related_entity?.__typename !== "Disputes" &&
                    eachData?.node?.related_entity?.__typename !== "Bundles" &&
                    eachData?.node?.related_entity?.__typename !== "SubDivision";
                    return (
                        <li className={`  border-b transition-all  border-l-4    hover:border-l-6  border-l-primary `}>
                            <div
                                className={`${verify ? "cursor-pointer" : ""}`}
                                onClick={() =>
                                    alertHandler(
                                        eachData?.node?.related_entity?.__typename,
                                        eachData?.node?.related_entity
                                    )
                                }
                            >
                                <div className="text-sm py-3 px-4  text-darkgray75 flex justify-between items-center">
                                    <div className="  focus:outline-none">
                                        {eachData.node.message}
                                        {eachData?.node?.related_entity?.name
                                            ? " - " + eachData?.node?.related_entity?.name
                                            : null}
                                    </div>
                                    {verify ? <ArrowCircleRightIcon className="h-5 w-5 text-secondary" /> : null}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <AlertAccordian
            onClick={(data) => {
                setActiveAlertType(data);
            }}
            component={AlertAccordionExpandComponent()}
            Data={types}
        />
    );
};

export default Alert;
