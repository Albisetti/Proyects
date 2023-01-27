import React, { useState } from "react";
import Button from "../Buttons";
import TextField from "../../components/FormGroups/Input";
import CommonSelect from "../../components/Select";

const AccordianWithButton = ({ Data, maxHeight, component }) => {
  const [clicked, setClicked] = useState(false);
  const optionsBuilders = [
    { value: "Acme Co. Builders", label: "Acme Co. Builders" },
    { value: "Bob Builders", label: "Bob Builders" },
    { value: "Splice Master Builders", label: "Splice Master Builders" },
  ];

  const toggle = (index) => {
    if (clicked === index) {
      return setClicked(null);
    }
    setClicked(index);
  };
  return (
    <div className="flex flex-col w-full items-start justify-start bg-white">
      <div
        className={`border overflow-auto w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 `}
        style={{ maxHeight: maxHeight }}
      >
        {Data.map((item, index) => {
          return (
            <div className={`border border-l-4 border-l-${item.color}-500`}>
              <div className="grid gap-5 justify-between grid-cols-5 items-center w-full  cursor-pointer transition-all duration-1000">
                <div className="flex items-center col-span-2" onClick={() => toggle(index)} key={index}>
                  <p className="py-2 px-2  text-primary font-medium hover:text-lightPrimary">{item.name}</p>
                  <span className="mr-5 ">
                    {clicked === index ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary hover:text-lightPrimary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary hover:text-lightPrimary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </span>
                </div>
                <Button parentClass={"col-span-2 py-2"} title="Reset" color="red-800" />
                <span className="mr-5 col-start-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-500 hover:text-red-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </span>
              </div>
              {clicked === index ? (
                <div className="px-2 grid transition-transform duration-1000 gap-4 lg:grid-cols-2">
                  <div className="mt-5 px-5 md:px-5 flex-1 sm:mt-0">
                    <div className="md:grid md:grid-cols-3 md:gap-6">
                      <div className="md:mt-0 md:col-span-3">
                        <div className="sm:rounded-md">
                          <div className="py-0 bg-white lg:px-2 lg:py-0">
                            <div className="grid grid-cols-6 gap-6">
                              <div className="col-span-6 sm:col-span-4">
                                <label className="block text-md font-medium text-primary">Type</label>
                                <CommonSelect className="mt-1" width={""} options={optionsBuilders} isMulti placeHolder="Choose TM" />
                              </div>
                              <TextField
                                parentClass="col-span-6 sm:col-span-3"
                                id="firstName"
                                label="First Name"
                                name="firstName"
                                placeholder="First Name"
                                type="text"
                              />

                              <TextField
                                parentClass="col-span-6 sm:col-span-3"
                                id="lastName"
                                label="last Name"
                                  
                                 
                                  
                                name="lastName"
                                placeholder="last Name"
                                type="text"
                              />

                              <div className="col-span-6 sm:col-span-3">
                                <label className="block text-md font-medium text-primary">Title</label>
                                <CommonSelect className="mt-1" width={""} options={optionsBuilders} isMulti placeHolder="Accounting" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 md:px-5 flex-1 sm:mt-0">
                    <div className="md:grid md:grid-cols-3 md:gap-6">
                      <div className="mt-5 md:mt-0 md:col-span-3">
                        <div className=" sm:rounded-md">
                          <div className="py-4 bg-white lg:px-2 lg:py-0">
                            <div className="grid grid-cols-6 gap-6">
                              <TextField
                                parentClass="col-span-6 sm:col-span-6"
                                id="email"
                                label="Email"
                                  
                                 
                                  
                                name="email"
                                placeholder="Enter Email"
                                type="email"
                              />
                              <TextField
                                label="Office Phone"
                                parentClass="col-span-4 sm:col-span-4"
                                id="officePhone"
                                  
                                 
                                  
                                name="officePhone"
                                placeholder="123-456-7890"
                                type="tel"
                              />
                              <TextField
                                label="Ext."
                                parentClass="col-span-2 sm:col-span-2"
                                id="officeExtension"
                                  
                                 
                                  
                                name="officeExtension"
                                placeholder="112"
                                type="tel"
                              />
                              <TextField
                                label="Mobile Phone"
                                parentClass="col-span-4 sm:col-span-3"
                                id="mobilePhone"
                                  
                                 
                                  
                                name="mobilePhone"
                                placeholder="123-456-7890"
                                type="tel"
                              />
                              <div className="col-span-6 sm:col-span-4">
                                <div className="flex items-start">
                                  <div className="h-5 flex items-center">
                                    <input
                                      id="disable"
                                      name="disable"
                                      type="checkbox"
                                      className="focus:ring-secondary h-4 w-4 text-primary border-gray-300 rounded"
                                   />
                                  </div>
                                  <div className="ml-3 mb-3 sm:mb-0 text-sm">
                                    <label htmlFor="disable" className="font-medium text-primary">
                                      Disable User Account
                                  </label>
                                  </div>
                                </div>
                                <Button title="Update"  color="yellow-600" />
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccordianWithButton;
