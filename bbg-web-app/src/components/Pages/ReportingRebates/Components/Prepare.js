import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { AuthContext } from "../../../../contexts/auth";
import HelperModal from "../../../Modal/HelperModal";
import BatchCorrection from "../BatchCorrection";
import ActionRequired from "./PrepareRebates/ActionRequired";
import RebateRejected from "./RebateRejected";

const Prepare = () => {
    const [index, setIndex] = useState(0);

    const { type } = useContext(AuthContext);

    const location = useLocation();

    useEffect(() => {
        if (location?.active) {
            setIndex(parseInt(location?.active));
        }
        // eslint-disable-next-line
    }, [location]);

    return (
        <div className="h-full flex-1 ">
            <div className="flex flex-col h-full">
                <main className=" flex-1">
                    <div className="max-w-8xl flex flex-col h-full w-8xl mx-auto px-4 sm:px-6 lg:px-32">
                        <div className=" flex flex-col h-full gap-5 xl:flex-row rounded-lg">
                            <Tabs
                                selectedIndex={index}
                                className="text-secondary   w-full flex flex-col h-full"
                                selectedTabClassName=" text-secondary group inline-flex justify-start text-center  font-medium text-sm"
                            >
                                <TabList
                                    className="flex font-title bg-white rounded-lg px-4 flex-col  sm:flex-row space-x-10"
                                    style={{ maxHeight: "66px" }}
                                >
                                    <div className="text-secondary font-bold text-xl py-4  font-title mr-5 flex">
                                        <p> Prepare Rebates </p>

                                        <HelperModal type={"preparerebates"} title="Prepare Rebates Information" />
                                    </div>
                                    <Tab
                                        onClick={() => setIndex(0)}
                                        className="relative border-transparent group cursor-pointer flex py-4 justify-start hover:text-secondary text-center  font-medium text-sm"
                                    >
                                        <span className={` text-xl`}>Action Required</span>
                                        <span
                                            className={`absolute border-b-2 transition-all border-darkGray w-0 group-hover:w-full bottom-3 ${
                                                index === 0 ? "w-full border-b-2" : ""
                                            }`}
                                        ></span>
                                    </Tab>
                                    <Tab
                                        onClick={() => setIndex(1)}
                                        className="relative border-transparent group cursor-pointer py-4  flex md:inline-flex justify-start hover:text-secondary text-center  font-medium text-sm"
                                    >
                                        <span className={` text-xl`}>Ready for Claim</span>
                                        <span
                                            className={`absolute border-b-2 transition-all border-darkGray w-0 group-hover:w-full bottom-3 ${
                                                index === 1 ? "w-full border-b-2" : ""
                                            }`}
                                        ></span>
                                    </Tab>
                                    {type === "ADMIN" ? (
                                        <Tab
                                            onClick={() => setIndex(3)}
                                            className="relative border-transparent group cursor-pointer py-4  flex md:inline-flex justify-start hover:text-secondary text-center  font-medium text-sm"
                                        >
                                            <span className={` text-xl `}>Batch Corrections</span>
                                            <span
                                                className={`absolute border-b-2 transition-all border-darkGray w-0 group-hover:w-full bottom-3 ${
                                                    index === 3 ? "w-full border-b-2" : ""
                                                }`}
                                            ></span>
                                        </Tab>
                                    ) : null}
                                    <Tab
                                        onClick={() => setIndex(2)}
                                        className="relative border-transparent group cursor-pointer py-4  flex md:inline-flex justify-start hover:text-secondary text-center  font-medium text-sm"
                                    >
                                        <span className={` text-xl `}>Completed</span>
                                        <span
                                            className={`absolute border-b-2 transition-all border-darkGray w-0 group-hover:w-full bottom-3 ${
                                                index === 2 ? "w-full border-b-2" : ""
                                            }`}
                                        ></span>
                                    </Tab>
                                    <Tab
                                        onClick={() => setIndex(4)}
                                        className="relative border-transparent group cursor-pointer py-4  flex md:inline-flex justify-start hover:text-secondary text-center  font-medium text-sm"
                                    >
                                        <span className={`text-xl`}>Rejected</span>
                                        <span
                                            className={`absolute border-b-2 transition-all border-darkGray w-0 group-hover:w-full bottom-3 ${
                                                index === 4 ? "w-full border-b-2" : ""
                                            }`}
                                        ></span>
                                    </Tab>
                                </TabList>
                                <TabPanel className="flex-1">
                                    <ActionRequired type="action" />
                                </TabPanel>
                                <TabPanel>
                                    <ActionRequired type="ready" />
                                </TabPanel>
                                <TabPanel>
                                    <ActionRequired type="completed" />
                                </TabPanel>
                                <TabPanel>
                                    <BatchCorrection />
                                </TabPanel>
                                <TabPanel>
                                    <RebateRejected />
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Prepare;
