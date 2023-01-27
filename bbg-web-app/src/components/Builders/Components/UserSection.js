import React from "react";
import Button from "../../Buttons";
import CommonSelect from "../../Select";
import TextField from "../../FormGroups/Input";
import AccordianWithButton from "../../AccordianWithButton";

const AboutSection = () => {
  const optionsBuilders = [
    { value: "Acme Co. Builders", label: "Acme Co. Builders" },
    { value: "Bob Builders", label: "Bob Builders" },
    { value: "Splice Master Builders", label: "Splice Master Builders" },
  ];

  const Data = [
    {
      name: "Bill Smith",
      color: "red",
    },
    {
      name: "Nancy Allen",
      color: "blue",
    },
    {
      name: "Bob McGill",
      color: "yellow",
    },
    
   
  ];

  return (
    <div className="min-h-smallMin">
      <div className="max-w-8xl flex justify-between items-baseline mx-auto mb-5 ">
        <p className="text-xl    font-bold text-primary">ACME Co. Builder</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="mt-5 col-span-2 md:pl-5 flex-1 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:mt-0 md:col-span-3">
              <div className="sm:rounded-md">
                <p className="text-xl mb-3    font-bold text-primary">New Contact</p>
                <div className="py-0 bg-white lg:px-2 lg:py-0">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-2">
                      <label className="block text-md font-medium text-primary">Type</label>
                      <CommonSelect className="mt-1" width={""} options={optionsBuilders} isMulti placeHolder="Select Type" />
                    </div>
                    <TextField
                      parentClass="col-span-6 sm:col-span-2"
                      id="firstName"
                      label="First Name"
                        
                       
                        
                      name="firstName"
                      placeholder="First Name"
                      type="text"
                    />
                    <TextField
                      parentClass="col-span-6 sm:col-span-2"
                      id="lastName"
                      label="Last Name"
                        
                       
                        
                      name="lastName"
                      placeholder="Last Name"
                      type="text"
                    />

                    <TextField
                      parentClass="col-span-6 sm:col-span-2"
                      id="title"
                      label="Title"
                        
                       
                        
                      name="title"
                      placeholder="Title"
                      type="text"
                    />

                    <TextField
                      parentClass="col-span-6 sm:col-span-4"
                      id="email"
                      label="Email"
                        
                       
                        
                      name="email"
                      placeholder="Enter Email"
                      type="email"
                    />
                    <TextField
                      label="Office Phone"
                      parentClass="col-span-4 sm:col-span-2"
                      id="officePhone"
                        
                       
                        
                      name="officePhone"
                      placeholder="123-456-7890"
                      type="tel"
                    />
                    <TextField
                      label="Ext."
                      parentClass="col-span-2 sm:col-span-1"
                      id="officeExtension"
                        
                       
                        
                      name="officeExtension"
                      placeholder="112"
                      type="tel"
                    />
                    <TextField
                      label="Mobile Phone"
                      parentClass="col-span-4 sm:col-span-2"
                      id="mobilePhone"
                        
                       
                        
                      name="mobilePhone"
                      placeholder="123-456-7890"
                      type="tel"
                    />
                    <div className="col-span-6 sm:col-span-3">
                      <div className="flex items-start">
                        <div className="h-5 flex items-center">
                          <input
                            id="require"
                            name="require"
                            type="checkbox"
                            className="focus:ring-secondary h-4 w-4 text-primary border-gray-300 rounded"
                          ></input>
                        </div>
                        <div className="ml-3 mb-3 sm:mb-0 text-sm">
                          <label htmlFor="require" className="font-medium text-primary">
                            Require User Account
                          </label>
                        </div>
                      </div>
                      <div className="py-3 flex flex-col sm:flex-row w-full items-center">
                      <Button title="Create"  color="primary"/>
                      </div>
                    </div>
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 col-span-3 md:pl-5 flex-1 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="mt-5 md:mt-0 md:col-span-3">
              <div className=" sm:rounded-md">
                <p className="text-xl mb-3    font-bold text-primary">Contact & Users</p>
                <div className="py-4 bg-white lg:px-2 lg:py-0">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-6">
                      <AccordianWithButton Data={Data} /> 
                    </div>
                  </div>
                </div>
                <div className="py-3 flex flex-col sm:flex-row w-full items-center">
                  <Button color="primary" title="Save & Add Users" />
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
