import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Button from "../../../Buttons";
import TextField from "../../../FormGroups/Input";
import CommonSelect from "../../../Select";
import { APP_TITLE } from "../../../../util/constants";

const AboutSection = () => {
  const List = [
    {
      id: 1,
      title: "ACME Co. Builder Factory",
      color: "red",
      amount: "$2,425",
      properties: 131,
    },
    {
      id: 2,
      title: "Bob's Building Factory",
      color: "blue",
      amount: "$2,425",
      properties: 612,
    },
    {
      id: 3,
      title: "SpliceDigital Factory",
      color: "yellow",
      amount: "$2,425",
      unit: 131,
    },
    {
      id: 4,
      title: "ACME Co. Builder Factory",
      color: "red",
      amount: "$2,425",
      unit: 612,
    },
    {
      id: 5,
      title: "Bob's Building Factory",
      color: "blue",
      amount: "$2,425",
      unit: 555,
    },
    {
      id: 6,
      title: "ACME Co. Builder Factory",
      color: "red",
      amount: "$2,425",
      properties: 131,
    },
    {
      id: 7,
      title: "Bob's Building Factory",
      color: "blue",
      amount: "$2,425",
      properties: 131,
    },
  ];

  const optionsBuilders = [
    { value: "Acme Co. Builders", label: "Acme Co. Builders" },
    { value: "Bob Builders", label: "Bob Builders" },
    { value: "Splice Master Builders", label: "Splice Master Builders" },
  ];

  return (
    <div className="py-5">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Builders - About</title>
            </Helmet>
      <div className="max-w-8xl  w-8xl mx-auto ">
        <div className="2xl:max-h-partial flex flex-col ">
          {/* <div className="flex flex-row justify-start gap-5 my-3 mt-4 mx-2 w-full">
            <p className="text-primary font-bold   "> Manage Builders</p>
          </div> */}
          <div className="flex-1 flex-col   flex items-stretch sm:flex-row  overflow-hidden">
            <div className="flex-grow w-full max-w-8xl mx-auto xl:flex gap-5 ">
              <div className="min-w-0 md:flex w-full gap-5" style={{minHeight:"79vh" ,maxHeight:"79vh"}}>
                <div className="border-b border-gray-200 flex-1 max-w-xs md:border-b-0 xl:flex-shrink-0 rounded-lg   xl:border-gray-200 bg-white">
                  <div className="h-full ">
                    <div className="h-full relative">
                      <div className=" inset-0  border  border-gray-200  rounded-lg h-full flex flex-col">
                        <div className="flex flex-0 px-4 border-b justify-between items-center">
                          <div className="font-title py-4 text-center h2">
                            Builders
                          </div>
                        </div>

                        <div className="flex overflow-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 w-full h-full">
                          <div className="w-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                            <ul className=" flex-0 w-full  overflow-auto">
                              {List.map((eachData) => {
                                return (
                                  <li
                                    className={`group border-b hover:bg-gray-100`}
                                  >
                                    <div className="relative py-3  border-l-4 border-l-primary transition-all hover:border-l-6">
                                      <p className="text-sm font-semibold text-darkgray75">
                                        <Link
                                          to="#"
                                          className="px-2 focus:outline-none"
                                        >
                                          <span
                                            className="absolute inset-0"
                                            aria-hidden="true"
                                          ></span>
                                          {eachData.title}
                                        </Link>
                                      </p>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 md:mt-0 2xl:mt-0 sm:flex-1">
                  <div className="bg-white rounded-lg h-full">
                    <div className="h-full  relative">
                      <div
                        className={`flex h-full inset-0 border border-gray-200  rounded-lg flex-col overflow-auto`}
                      >
                        <div className="flex flex-col md:flex-row border-b justify-between items-start">
                          <div className="font-title  py-4 px-4 text-center h2">
                            New Builder
                          </div>
                        </div>

                        <div className="flex flex-col flex-1 overflow-auto w-full pb-5">
                          <div
                            className={`flex flex-col h-full overflow-auto w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400`}
                          >
                            <div className="w-full h-full ">
                              <div className="grid grid-cols-6 gap-6 h-full">
                                <TextField
                                  parentClass="col-span-6 sm:col-span-6 mt-5 grid grid-cols-2  px-4 items-center"
                                  id="companyName"
                                  label="Company Name"
                                  name="companyName"
                                  placeholder="Company Name"
                                  type="text"
                                />
                                <TextField
                                  parentClass="col-span-6 sm:col-span-6 grid grid-cols-2  px-4 items-center"
                                  id="abbreviatedCompanyName"
                                  label="Abbreviated Name"
                                  name="abbreviatedCompanyName"
                                  placeholder="Abbreviated Name"
                                  type="text"
                                />

                                <TextField
                                  parentClass="col-span-6 sm:col-span-6 grid grid-cols-2  px-4 items-center"
                                  id="bbgCode"
                                  label={APP_TITLE + " Code"}
                                  name="bbgCode"
                                  placeholder={APP_TITLE + " Code"}
                                  type="text"
                                />

                                <TextField
                                  parentClass="col-span-6 sm:col-span-6 grid grid-cols-2  px-4 items-center"
                                  id="address"
                                  label="Address"
                                  name="address"
                                  placeholder="Address Line 1"
                                  type="text"
                                />
                                <TextField
                                  parentClass="col-span-6 sm:col-span-6 grid grid-cols-2 px-4 items-center"
                                  id="address2"
                                  name="address2"
                                  placeholder="Unit 123"
                                  type="text"
                                />

                                <TextField
                                  label="City"
                                  parentClass="col-span-6 sm:col-span-6 grid grid-cols-2  px-4 items-center"
                                  id="city"

                                  name="city"
                                  placeholder="City"
                                  type="text"
                                />
                                <div className="col-span-6 sm:col-span-6 grid grid-cols-2  px-4 items-center">
                                  <label className="block text-md font-medium text-secondary">
                                    State/Prov
                                  </label>
                                  <CommonSelect
                                    className="mt-1"
                                    width={""}
                                    options={optionsBuilders}
                                    isMulti
                                    placeHolder="Select"
                                  />
                                </div>
                                <TextField
                                  parentClass="col-span-6 lg:col-span-6 grid grid-cols-2  px-4 items-center mb-5 xl:mb-0"
                                  id="zip"
                                  label="Zip/Postal Code"  
                                  name="zip"
                                  placeholder="1A1 A1A"
                                  type="text"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 xl:mt-0 " style={{minHeight:"79vh" ,maxHeight:"79vh"}}>
                <div className="h-full bg-white rounded-lg relative   md:pr-3 lg:pr-0">
                  <div className="inset-0  border  border-gray-200  rounded-lg h-full flex flex-col">
                    <div className="flex flex-0 px-4 border-b justify-between items-center">
                      <div className="font-title py-4 text-center h2">
                        {APP_TITLE} Assignments
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 overflow-auto w-full">
                      <div className="flex flex-col h-full overflow-auto w-full">
                        <div className="w-full   xl:max-h-smallMin sm:max-h-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                          <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-6 grid grid-cols-2 mt-4 px-4 items-center">
                              <label className="block text-md font-medium text-secondary">
                                Territory Manager
                              </label>
                              <CommonSelect
                                className="mt-1"
                                width={""}
                                options={optionsBuilders}
                                isMulti
                                placeHolder="Choose TM"
                              />
                            </div>
                            <div className="col-span-6 sm:col-span-6 grid grid-cols-2  px-4 items-center">
                              <label className="block text-md font-medium text-secondary">
                                States/Province Allowed For Program
                                Participation
                              </label>
                              <CommonSelect
                                className="mt-1"
                                width={""}
                                options={optionsBuilders}
                                isMulti
                                placeHolder="Choose TM"
                              />
                            </div>
                            <div className="col-span-6 sm:col-span-6 grid grid-cols-2 mb-4 px-4 items-center">
                              <label className="block text-md font-medium text-secondary">
                                Member Tier
                              </label>
                              <CommonSelect
                                className="mt-1"
                                width={""}
                                options={optionsBuilders}
                                isMulti
                                placeHolder="Choose TM"
                              />
                            </div>
                            <div className="col-span-6 sm:col-span-6  mb-4 px-4 items-center">
                              <div className="block text-md font-medium text-secondary">
                                Membership Dues
                              </div>
                              <div className="flex flex-col w-full">
                                <div className="flex items-center px-4 w-full">
                                  <div className="block flex-1 text-md font-medium text-secondary">
                                    Starts
                                  </div>
                                  <CommonSelect
                                    className="mt-1 flex-1"
                                    width={""}
                                    options={optionsBuilders}
                                    isMulti
                                    placeHolder="Choose Year"
                                  />
                                </div>
                                <div className="flex items-center px-4 w-full mt-5">
                                  <div className="block flex-1 text-md font-medium text-secondary">
                                    Amount
                                  </div>
                                  <div className="mt-1 flex-1">
                                    <input
                                      type="text"
                                      name="amount"
                                      id="amount"
                                      className="shadow-sm focus:ring-secondary focus:border-secondary block w-full sm:text-sm border-secondary rounded-md"
                                      placeholder="Amount"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col items-end justify-end">
                      <Button color="primary" title="Save & Add Users" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
