import React from "react";
import Button from "../../Buttons";
import CommonSelect from "../../Select";
import TextField from "../../FormGroups/Input";
import { APP_TITLE } from "../../../util/constants";

const AboutSection = () => {
  const optionsBuilders = [
    { value: "Acme Co. Builders", label: "Acme Co. Builders" },
    { value: "Bob Builders", label: "Bob Builders" },
    { value: "Splice Master Builders", label: "Splice Master Builders" },
  ];

  return (
    <div className="min-h-smallMin">
      <div className="max-w-8xl flex justify-between items-baseline mx-auto mb-5 ">
        <p className="text-xl    font-bold text-primary">Manage Builders</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="mt-5 md:pl-5 flex-1 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:mt-0 md:col-span-3">
              <div className="sm:rounded-md">
                <p className="text-xl mb-3    font-bold text-primary">New Builders</p>
                <div className="py-0 bg-white lg:px-2 lg:py-0">
                  <div className="grid grid-cols-6 gap-6">
                    <TextField
                      parentClass="col-span-6 sm:col-span-6"
                      id="companyName"
                      label="Company Name"
                        
                       
                        
                      name="companyName"
                      placeholder="Company Name"
                      type="text"
                    />
                    <TextField
                      parentClass="col-span-6 sm:col-span-3"
                      id="abbreviatedCompanyName"
                      label="Abbreviated Name"
                        
                       
                        
                      name="abbreviatedCompanyName"
                      placeholder="Abbreviated Name"
                      type="text"
                    />

                    <TextField
                      parentClass="col-span-6 sm:col-span-2"
                      id="bbgCode"
                      label={APP_TITLE + " Code"}
                        
                       
                        
                      name="bbgCode"
                      label={APP_TITLE + " Code"}
                      type="text"
                    />

                    <TextField
                      parentClass="col-span-6 sm:col-span-5"
                      id="address"
                      label="Address"
                        
                       
                        
                      name="address"
                      placeholder="Address Line 1"
                      type="text"
                    />
                    <TextField
                      parentClass="col-span-6 sm:col-span-5"
                      id="address2"
                        
                       
                        
                      name="address2"
                      placeholder="Unit 123"
                      type="text"
                    />

                    <TextField
                      label="City"
                      parentClass="col-span-6 sm:col-span-2"
                      id="city"
                        
                       
                        
                      name="city"
                      placeholder="City"
                      type="text"
                    />
                    <div className="col-span-6 sm:col-span-2">
                      <label className="block text-md font-medium text-primary">State/Prov</label>
                      <CommonSelect className="mt-1" width={""} options={optionsBuilders} isMulti placeHolder="Select Builders" />
                    </div>
                    <TextField
                      parentClass="col-span-6 lg:col-span-2"
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
        <div className="mt-10 md:pl-5 flex-1 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="mt-5 md:mt-0 md:col-span-3">
              <div className=" sm:rounded-md">
                <p className="text-xl mb-3    font-bold text-primary">{APP_TITLE} Assignments</p>
                <div className="py-4 bg-white lg:px-2 lg:py-0">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-6">
                      <label className="block text-md font-medium text-primary">Territory Manager</label>
                      <CommonSelect className="mt-1" width={""} options={optionsBuilders} isMulti placeHolder="Choose TM" />
                    </div>
                    <div className="col-span-6 sm:col-span-6">
                      <label className="block text-md font-medium text-primary">Builder Operating State(s)</label>
                      <CommonSelect className="mt-1" width={""} options={optionsBuilders} isMulti placeHolder="Choose TM" />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                      <label className="block text-md font-medium text-primary">Member Tier</label>
                      <CommonSelect className="mt-1" width={""} options={optionsBuilders} isMulti placeHolder="Choose TM" />
                    </div>
                  </div>
                </div>
                <div className="pt-4 ml-2 flex flex-col sm:flex-row w-full items-center">
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
