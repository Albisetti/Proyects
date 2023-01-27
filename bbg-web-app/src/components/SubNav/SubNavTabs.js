import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ClaimHistory from "../Pages/Claims/Components/ClaimHistory/ClaimHistory";
import CreateClaim from "../Pages/Claims/Components/CreateClaim/CreateClaim";
import FactoryWorkflow from "../Pages/Claims/Components/FactoryWorkflow/FactoryWorkflow";
import VolumeTemplate from "../Pages/Claims/Components/VolumeTemplate";
const SubNavTabs = ({ history, type, location }) => {

  const [index, setIndex] = useState(5);
  const [edit, setEdit] = useState(false);



  return (
    <div className="h-full flex-1">
      <div className="flex flex-col h-full">

        <main className=" flex-1">
          <div className="max-w-8xl flex flex-col h-full w-8xl ">
            <div className="bg-white flex flex-col h-full gap-5 xl:flex-row rounded-lg shadow p-5 sm:px-6">
              <Tabs
                selectedIndex={index}
                className="text-lightPrimary  w-full flex flex-col h-full"
                selectedTabClassName="border-primary text-primary group inline-flex justify-start  py-2 px-1 text-center border-b-2 font-medium text-sm"
              >
                <TabList className="flex flex-col items-center sm:flex-row justify-start  mb-2" >
                  <Tab onClick={() => setIndex(0)} className="border-transparent group cursor-pointer flex md:inline-flex justify-center hover:text-primary hover:border-primary  py-4 px-4 text-center border-b-2 font-medium text-sm">
                    <svg
                      className="group-hover:text-primary -ml-0.5 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                    <span className="">Volume Templates</span>
                    <span className="bg-gray-100 text-primary hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block">52</span>
                  </Tab>
                  <Tab onClick={() => setIndex(1)} className="border-transparent group cursor-pointer  flex md:inline-flex justify-center hover:text-primary hover:border-primary  py-4 px-4 text-center border-b-2 font-medium text-sm">
                    <svg
                      className="group-hover:text-primary -ml-0.5 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                    <span className="">Create Claim</span>
                    <span className="bg-gray-100 text-primary hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block">52</span>
                  </Tab>
                  <Tab onClick={() => setIndex(2)} className="border-transparent group  cursor-pointer flex md:inline-flex justify-center hover:text-primary hover:border-primary  py-4 px-4 text-center border-b-2 font-medium text-sm">
                    <svg
                      className="group-hover:text-primary -ml-0.5 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                    <span className="">Claim Workflow</span>
                    <span className="bg-gray-100 text-primary hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block">52</span>
                  </Tab>
                  <Tab onClick={() => setIndex(3)} className="border-transparent group cursor-pointer flex md:inline-flex justify-center hover:text-primary hover:border-primary  py-4 px-4 text-center border-b-2 font-medium text-sm">
                    <svg
                      className="group-hover:text-primary -ml-0.5 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                    <span className="">Claims History</span>
                    <span className="bg-gray-100 text-primary hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block">52</span>
                  </Tab>
                </TabList>
                <TabPanel className="flex-1">
                  <VolumeTemplate />
                </TabPanel>
                <TabPanel>
                  <CreateClaim type={"volume"} edit={edit} />
                </TabPanel>
                <TabPanel>
                  <FactoryWorkflow history={history} />
                </TabPanel>
                <TabPanel>
                  <ClaimHistory history={history} />
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubNavTabs;
