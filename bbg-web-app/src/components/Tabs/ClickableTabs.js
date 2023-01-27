import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

const ClickableTabs = ({ tabs }) => {
  return (
    <div className="">
      <Tabs
        className="text-lightPrimary"
        selectedTabClassName="border-primary text-primary group inline-flex justify-start  py-2 px-1 text-center border-b-2 font-medium text-sm"
      >
        <TabList className="flex flex-col items-center sm:flex-row justify-start  mb-6 " defaultindex={1}>
          {tabs.map((tab, i) => (
            <Tab
              key={i}
              className="border-transparent group  flex md:inline-flex justify-center hover:text-primary hover:border-primary  py-4 px-4 text-center border-b-2 font-medium text-sm"
            >
              <svg
                className="group-hover:text-primary -ml-0.5 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              <span className="">{tab.name}</span>
              <span className="bg-gray-100 text-primary hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block">52</span>
            </Tab>
          ))}
        </TabList>
        {tabs.map((tab, i) => (
          <TabPanel key={i}>
            <div className="text-3xl text-primary">{tab.name}</div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export default ClickableTabs;
