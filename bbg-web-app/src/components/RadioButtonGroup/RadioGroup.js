import React, { useState } from "react";
import TextField from "../../components/FormGroups/Input";
import Button from "../../components/Buttons";

const RadioGroup = () => {
  const [customizable, setCustomizable] = useState("byTier");

  const handleMenuBoolChange = (event) => {
    setCustomizable(event.target.value);
  };

  return (
    <div className="w-full">
      <div className="grid w-full p-2 md:grid-cols-3 items-start justify-items-start">
        <div className="">
          <label className="inline-flex items-center mt-0">
            <input
              type="radio"
              name="byTier"
              value="byTier"
              className="form-radio h-5 w-5 text-primary focus:ring-secondary"
              checked={customizable === "byTier"}
              onChange={handleMenuBoolChange}
            ></input>
            <span className="ml-2 text-md font-bold text-primary">By Tier</span>
          </label>
        </div>
        <div className="">
          <label className="inline-flex items-center mt-0">
            <input
              type="radio"
              name="custom%"
              value="custom%"
              className="form-radio h-5 w-5 text-primary focus:ring-secondary"
              checked={customizable === "custom%"}
              onChange={handleMenuBoolChange}
            ></input>
            <span className="ml-2 text-md font-bold text-primary">Custom - %</span>
          </label>
        </div>
        <div className="">
          <label className="inline-flex items-center mt-0">
            <input
              type="radio"
              name="custom$"
              value="custom$"
              className="form-radio h-5 w-5 text-primary focus:ring-secondary"
              checked={customizable === "custom$"}
              onChange={handleMenuBoolChange}
            ></input>
            <span className=" ml-2 text-md font-bold text-primary">Custom - $</span>
          </label>
        </div>
      </div>
      <div className="">
        {customizable === "byTier" ? null : customizable === "custom%" ? (
          <div className="w-full">
            <div className="flex  justify-between items-center">
              <div className="text-primary text-md font-semibold p-2">Enter Custom % Rebate - All Products</div>
            </div>

            <div className="grid grid-cols-1 md:items-center p-2">
              <div className="grid grid-cols-4 justify-around  items-center">
                <p className="text-primary font-bold">Residential</p>
                <TextField
                  flex
                  parentClass="justify-items-start col-span-3 grid-cols-2"
                  id="residential"
                    
                   
                    
                  name="residential"
                  placeholder="%"
                  type="number"
                />
              </div>
              <div className="grid grid-cols-4 justify-around  items-center">
                <p className="text-primary font-bold">Multi-Unit</p>
                <TextField
                  flex
                  parentClass="justify-items-start col-span-3 grid-cols-2"
                  id="multiunit"
                    
                   
                    
                  name="multiunit"
                  placeholder="%"
                  type="number"
                />
              </div>
              <div className="grid grid-cols-4 justify-around  items-center">
                <p className="text-primary font-bold">Commercial</p>
                <TextField
                  flex
                  parentClass="justify-items-start col-span-3 grid-cols-2"
                  id="commercial"
                    
                   
                    
                  name="commercial"
                  placeholder="%"
                  type="number"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Button title="Save Special Deal" color="primary" />
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div className="flex  justify-between items-center">
              <div className="text-primary text-md font-semibold p-2">Enter Custom % Rebate - All Products</div>
            </div>

            <div className="grid grid-cols-1 md:items-center p-2">
              <div className="grid grid-cols-4 justify-around  items-center">
                <p className="text-primary font-bold">Residential</p>
                <TextField
                  flex
                  parentClass="justify-items-start col-span-3 grid-cols-2"
                  id="residential"
                    
                   
                    
                  name="residential"
                  placeholder="%"
                  type="number"
                />
              </div>
              <div className="grid grid-cols-4 justify-around  items-center">
                <p className="text-primary font-bold">Multi-Unit</p>
                <TextField
                  flex
                  parentClass="justify-items-start col-span-3 grid-cols-2"
                  id="multiunit"
                    
                   
                    
                  name="multiunit"
                  placeholder="%"
                  type="number"
                />
              </div>
              <div className="grid grid-cols-4 justify-around  items-center ">
                <p className="text-primary font-bold">Commercial</p>
                <TextField
                  flex
                  parentClass="justify-items-start col-span-3 grid-cols-2"
                  id="commercial"
                    
                   
                    
                  name="commercial"
                  placeholder="%"
                  type="number"
                />
              </div>
            </div>
            <div className="flex my-5 md:m-0 justify-center">
              <Button title="Save Special Deal" color="primary" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RadioGroup;
