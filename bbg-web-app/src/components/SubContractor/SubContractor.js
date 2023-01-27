import React from "react";
import Button from "../Buttons";
import SimpleList from "../SimpleList/SimpleList";
import TextField from "../FormGroups/Input";
import CommonSelect from "../Select";

const SubContractor = (props) => {
  const optionsBuilders = [
    { value: "Acme Co. Builders", label: "Acme Co. Builders" },
    { value: "Bob Builders", label: "Bob Builders" },
    { value: "Splice Master Builders", label: "Splice Master Builders" },
  ];
  const list = ["ACME Co. Builder", "Bob's Building", "SpliceDigital"];
  return (
    <div className=" bg-gray-100">
      <div className="bg-primary pb-32">
        <header className="py-4">
          <div className="max-w-8xl flex justify-between items-baseline mx-auto px-4 sm:px-6 lg:px-32">
            <p className="text-xl md:text-4xl font-bold text-white">Manage Subcontractors/Distributors/Providers</p>
            <p className="hidden sm:block text-white text-sm"> Auto-save 1 minute ago </p>
          </div>
        </header>
      </div>

      <main className="-mt-32">
        <div className="max-w-8xl   w-8xl mx-auto pb-12 px-4 sm:px-6 lg:px-32">
          <div className="bg-white   flex flex-col md:flex-row rounded-lg shadow px-5 py-6 sm:px-6">
            <div className="bg-white flex flex-col">
              <p className="text-3xl font-bold text-primary">Tommy's Drywall Company</p>
              <p className="text-xl mt-5 font-bold text-primary">Assign Subcontractor to Builder(s)</p>
              <div className="flex flex-col mt-4 md:flex-row md:mt-0 justify-start items-baseline">
                <CommonSelect className="w-full md:flex-1" width={"200"} options={optionsBuilders} isMulti placeHolder="Select Builders" />
                <Button color="primary" title="Assign" />
              </div>
              <p className="text-xl mt-5 font-bold text-primary">Current Builder Assignments</p>
              <SimpleList withButton list={list} />
            </div>

            <div className="mt-10 md:pl-5 flex-1 sm:mt-0">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="mt-5 md:mt-0 md:col-span-3">
                  <div className=" overflow-hidden sm:rounded-md">
                    <div className="py-4 bg-white lg:px-2 lg:py-0">
                      <div className="grid grid-cols-6 gap-6">
                        <TextField
                          parentClass="col-span-6 sm:col-span-3"
                          id="company"
                          label="Company"



                          name="company"
                          placeholder="Company Name"
                          type="text"
                        />
                        <TextField
                          parentClass="col-span-6 sm:col-span-3"
                          id="contact"
                          label="Contact Name"



                          name="contact"
                          placeholder="contact Name"
                          type="text"
                        />
                        <TextField
                          parentClass="col-span-6 sm:col-span-4"
                          id="email"
                          label="Email"



                          name="email"
                          placeholder="Email"
                          type="email"
                        />
                        <TextField
                          parentClass="col-span-6 sm:col-span-3 lg:col-span-2"
                          id="office"
                          label="Office"



                          name="office"
                          placeholder="Office"
                          type="text"
                        />
                        <TextField
                          parentClass="col-span-6 sm:col-span-3 lg:col-span-3"
                          id="phone"
                          label="Cell"



                          name="phone"
                          placeholder="Phone Number"
                          type="tel"
                        />
                        <TextField
                          parentClass="col-span-6 sm:col-span-4"
                          id="address"
                          label="Address"
                          name="address"
                          placeholder="Address Line 1"
                          type="text"
                        />
                        <TextField
                          parentClass="col-span-6 sm:col-span-4"
                          id="address2"



                          name="address2"
                          placeholder="Unit 123"
                          type="text"
                        />

                        <TextField
                          label="State/Province"
                          parentClass="col-span-6 sm:col-span-3"
                          id="state"



                          name="state"
                          placeholder="State"
                          type="text"
                        />
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
                    <div className="pt-4 flex flex-col gap-5 ml-2 sm:flex-row w-full items-center">
                      <Button color="secondary" title="Save" />
                      <Button color="primary" title="Save & Create New" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubContractor;
