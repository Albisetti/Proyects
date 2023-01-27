import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import AboutSection from "./Components/AboutSection";
import ProgramSection from "./Components/ProgramSection";
import UserSection from "./Components/UserSection";

const Builders = () => {
    return (
        <div className=" bg-gray-100">
            <div className="bg-primary pb-32">
                <header className="py-4">
                    <div className="max-w-8xl flex justify-between items-baseline mx-auto px-4 sm:px-6 lg:px-32">
                        <p className="text-xl md:text-4xl font-bold text-white">
                            Builders
                        </p>
                        <p className="hidden sm:block text-white text-sm">
                            {" "}
                            Some text{" "}
                        </p>
                    </div>
                </header>
            </div>

            <main className="-mt-32">
                <div className="max-w-8xl  w-8xl mx-auto pb-12 px-4 sm:px-6 lg:px-32">
                    <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
                        <Tabs
                            className="text-lightPrimary cursor-pointer"
                            selectedTabClassName="border-primary text-primary group inline-flex justify-start  py-2 px-1 text-center border-b-2 font-medium text-sm"
                        >
                            <TabList
                                className="flex flex-col items-center sm:flex-row justify-start  mb-6 "
                                defaultindex={1}
                            >
                                <Tab className="border-transparent group  flex md:inline-flex justify-center hover:text-primary hover:border-primary  py-4 px-4 text-center border-b-2 font-medium text-sm">
                                    <svg
                                        className="group-hover:text-primary -ml-0.5 mr-2 h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                    <span className="">About</span>
                                    <span className="bg-gray-100 text-primary hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block">
                                        52
                                    </span>
                                </Tab>
                                <Tab className="border-transparent group  flex md:inline-flex justify-center hover:text-primary hover:border-primary  py-4 px-4 text-center border-b-2 font-medium text-sm">
                                    <svg
                                        className="group-hover:text-primary -ml-0.5 mr-2 h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                    <span className="">Programs</span>
                                    <span className="bg-gray-100 text-primary hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block">
                                        52
                                    </span>
                                </Tab>
                                <Tab className="border-transparent group  flex md:inline-flex justify-center hover:text-primary hover:border-primary  py-4 px-4 text-center border-b-2 font-medium text-sm">
                                    <svg
                                        className="group-hover:text-primary -ml-0.5 mr-2 h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                    <span className="">Contact & Users</span>
                                    <span className="bg-gray-100 text-primary hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block">
                                        52
                                    </span>
                                </Tab>
                            </TabList>
                            <TabPanel>
                                <AboutSection />
                            </TabPanel>
                            <TabPanel>
                                <ProgramSection />
                            </TabPanel>
                            <TabPanel>
                                <UserSection />
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Builders;
