import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import { Link } from "react-router-dom";

const SubNav = ({ history }) => {
  const [active, setActive] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [hoverActive, setHoverActive] = useState("");
  const [subsActive, setSubsActive] = useState("");

  const activeHandler = (tab) => {
    setHoverActive(tab);
  };

  const changeActive = (tab) => {
    setActive(true);
    setActiveTab(tab);
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const claimsTabs = [
    {
      name: "Volume Templates",
      href: "/claims/volumetemplates",
      current: "volumetemplate",
    },
    {
      name: "Create Claim",
      href: "/claims/createclaim",
      current: "createclaim",
    },
    {
      name: "Claim Workflow",
      href: "/claims/factoryworkflow",
      current: "factoryworkflow",
    },
    {
      name: "Claim History",
      href: "/claims/claimhistory",
      current: "claimhistory",
    },
  ];

  const reportingTabs = [
    { name: "Addresses", href: "/reporting/addresses", current: "addresses" },
    { name: "Bundles", href: "/reporting/bundles", current: "bundles" },
    {
      name: "Product Assignment",
      href: "/reporting/assignment",
      current: "assignment",
    },
    { name: "Prepare Rebates", href: "/reporting/prepare", current: "prepare" },
  ];

  const profileTabs = [
    { name: "Builders", href: "/profiles/builders", current: "builders" },
    {
      name: "Subcontractor/Distributor/Provider",
      href: "/profiles/subcontractors",
      current: "subcontractors",
    },
    { name: "Admins & Executives", href: "/profiles/admin", current: "admin" },
  ];

  const programsTabs = [
    { name: "All Programs", href: "/programs", current: "programs" },
    { name: "New Program", href: "/programs/create", current: "newprograms" },
  ];

  const rendersubTabs = (tab) => {
    switch (tab) {
      case "claims":
        return (
          <div className="px-6">
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>
              <select
                id="tabs"
                name="tabs"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                defaultValue={claimsTabs.find((tab) => tab.current).name}
              >
                {claimsTabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="">
                <nav className="-mb-px flex">
                  {claimsTabs.map((tab) => (
                    <Link
                      key={tab.name}
                      onClick={() => setSubsActive(tab.current)}
                      to={tab.href}
                      className={classNames(
                        tab.current === subsActive
                          ? "text-secondary border-b-2 border-secondary"
                          : " text-gray-500 hover:text-gray-700 ",
                        "whitespace-nowrap flex py-2 px-8  font-medium text-md"
                      )}
                    >
                      {tab.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        );
      case "programs":
        return (
          <div className="px-6">
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>
              <select
                id="tabs"
                name="tabs"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                defaultValue={programsTabs.find((tab) => tab.current).name}
              >
                {programsTabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  {programsTabs.map((tab) => (
                    <Link
                      key={tab.name}
                      onClick={() => setSubsActive(tab.current)}
                      to={tab.href}
                      className={classNames(
                        tab.current === subsActive
                          ? "text-secondary border-secondary"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200",
                        "whitespace-nowrap flex py-2 px-5 border-b-2 font-medium text-md"
                      )}
                    >
                      {tab.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="px-6">
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>
              <select
                id="tabs"
                name="tabs"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                defaultValue={profileTabs.find((tab) => tab.current).name}
              >
                {profileTabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-gray-200">
                <nav className="-mb-px flex">
                  {profileTabs.map((tab) => (
                    <Link
                      key={tab.name}
                      onClick={() => setSubsActive(tab.current)}
                      to={tab.href}
                      className={classNames(
                        tab.current === subsActive
                          ? "text-secondary border-b-2 px-10 border-secondary"
                          : " text-gray-500 hover:text-gray-700 ",
                        "whitespace-nowrap flex py-2 px-10  font-medium text-md"
                      )}
                    >
                      {tab.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        );
      case "reporting":
        return (
          <div className="px-6">
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>
              <select
                id="tabs"
                name="tabs"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                defaultValue={reportingTabs.find((tab) => tab.current).name}
              >
                {reportingTabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  {reportingTabs.map((tab) => (
                    <Link
                      key={tab.name}
                      onClick={() => setSubsActive(tab.current)}
                      to={tab.href}
                      className={classNames(
                        tab.current === subsActive
                          ? "text-secondary border-secondary"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200",
                        "whitespace-nowrap flex py-2 px-5 border-b-2 font-medium text-md"
                      )}
                    >
                      {tab.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        );

      default:
        break;
    }
  };

  return (
    <div className="">
      <nav className=" h-full border-opacity-25">
        <div className="max-w-8xl h-full mx-auto px-4 sm:px-6 lg:px-32">
          <div className="relative h-full flex flex-col items-start justify-center ">
            <div className="flex items-center justify-start ">
              <div className="hidden lg:block ">
                <div className="flex  cursor-pointer">
                  <a
                    onClick={() => activeHandler("profile")}
                    onMouseEnter={() => changeActive("profile")}
                    onMouseLeave={() => changeActive(hoverActive)}
                    className={`text-white flex flex-1 px-16 py-1 justify-center items-end text-xl transition-all relative ${activeTab === "profile"
                      ? " text-darkGray bg-white subnav-active-button"
                      : "text-xl bg-darkGray subnav-button"
                      }`}
                  >
                    <p className={`mt-1 py-3  relative z-10`}>Profile</p>
                    {/* <span className={`${
                      activeTab === "profile"
                        ? "subnav-span"
                        : ""
                    }`}></span> */}
                  </a>

                  <a
                    onClick={() => activeHandler("programs")}
                    onMouseEnter={() => changeActive("programs")}
                    onMouseLeave={() => changeActive(hoverActive)}
                    className={`text-white flex flex-1 items-center px-16 py-1 text-xl transition-all relative ${activeTab === "programs"
                      ? " text-primary bg-white  subnav-active-button"
                      : "text-xl bg-darkGray subnav-button"
                      }`}
                  >
                    <p className={`mt-1 py-3  relative z-10`}>Programs</p>
                  </a>

                  <a
                    onClick={() => activeHandler("claims")}
                    onMouseEnter={() => changeActive("claims")}
                    onMouseLeave={() => changeActive(hoverActive)}
                    className={`text-white text-xl flex-1 px-16 py-1  transition-all relative ${activeTab === "claims"
                      ? " text-darkGray bg-white   subnav-active-button"
                      : "text-xl bg-darkGray subnav-button"
                      }`}
                  >
                    <p className={`mt-1 py-3  relative z-10`}>Claims</p>
                  </a>

                  <a
                    onClick={() => activeHandler("reporting")}
                    onMouseEnter={() => changeActive("reporting")}
                    onMouseLeave={() => changeActive(hoverActive)}
                    className={`text-white text-xl flex-1 px-16 py-1 transition-all relative ${activeTab === "reporting"
                      ? " text-primary bg-white  subnav-active-button"
                      : "text-xl bg-darkGray subnav-button"
                      }`}
                  >
                    <p className={`mt-1 py-3  relative z-10`}>Reporting</p>
                  </a>

                  <a
                    onClick={() => activeHandler("analytics")}
                    onMouseEnter={() => changeActive("analytics")}
                    onMouseLeave={() => changeActive(hoverActive)}
                    className={`text-white text-xl flex-1 px-16 py-1 transition-all relative ${activeTab === "analytics"
                      ? " text-primary bg-white  subnav-active-button"
                      : "text-xl bg-darkGray subnav-button"
                      }`}
                  >
                    <p className={`mt-1 py-3  relative z-10`}>Analytics</p>
                  </a>
                </div>
              </div>
            </div>
            <Transition
              show={active}
              className="w-full"
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 -translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-1"
            >
              <div className="w-full">
                <div className="max-w-8xl flex flex-col h-full w-8xl ">
                  <div className="bg-white flex flex-col w-full  lg:items-center xl:flex-row rounded-lg rounded-b-none rounded-l-none  shadow py-3 h-16">
                    {rendersubTabs(activeTab)}
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default SubNav;
