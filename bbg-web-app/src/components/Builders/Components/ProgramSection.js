import React from "react";
import SimpleList from "../../SimpleList";
import TextField from "../../FormGroups/Input";
import Accordian from "../../Accordian";
import RadioGroup from '../../RadioButtonGroup'
import { APP_TITLE } from "../../../util/constants";

const ProgramSection = () => {
  const list = [
    {
      id: "1",
      title: "5297 Trex",
      color: "red",
    },
    {
      id: "2",
      title: "5297 Trex",
      color: "yellow",
    },
    {
      id: "3",
      title: "5297 Trex",
      color: "blue",
    },
    {
      id: "1",
      title: "5297 Trex",
      color: "red",
    },
    {
      id: "2",
      title: "5297 Trex",
      color: "yellow",
    },
    {
      id: "3",
      title: "5297 Trex",
      color: "blue",
    },
   
   
  ];

  const Data = [
    {
      title: "Program Name (Volume)",
      color: "red",
    },
    {
      title: "Program Name",
      color: "blue",
    },
    {
      title: "Program Name",
      color: "yellow",
    },
    {
      title: "Program Name (Volume)",
      color: "red",
    },
   
  ];

  const JSX = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-primary hover:text-lightPrimary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <div className="min-h-smallMin">
      <div className="grid gap-4 lg:grid-cols-9">
        <div className="bg-white border rounded-lg min-h-smallMin lg:col-span-3" >
          <div className="flex flex-col md:flex-row px-4 py-2 border-b justify-between items-center">
            <p className=" w-full py-2 text-start text-primary font-bold text-md">{APP_TITLE} Programs</p>
            <div className="flex w-full justify-between items-center md:justify-end ">
              <div className="mt-0 sm:mt-2 md:mt-0 sm:border-gray-200  ">
                <div className="py-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg flex rounded-md shadow-sm">
                    <TextField
                      parentClass="col-span-6 sm:col-span-2"
                      id="bbgCode"
                        
                       
                        
                      name="bbgCode"
                      placeholder={APP_TITLE+" Code"}
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SimpleList list={list} withButton maxHeight="75vh" iconJSX={<JSX />} />
        </div>
        <div className="bg-white border min-h-smallMin rounded-lg lg:col-span-3">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className=" py-5 px-4 text-center text-primary font-bold text-md">Builder's Programs</div>
          </div>
          <Accordian maxHeight="75vh" component={<RadioGroup/>} Data={Data} />
        </div>
        <div className="bg-white min-h-smallMin border rounded-lg lg:col-span-3" >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="py-5 px-4 text-center text-primary font-bold text-md">Product & Custom Rebates</div>
          </div>
          <Accordian maxHeight="75vh" component={<RadioGroup/>}  Data={Data} />
          
        </div>
      </div>
    </div>
  );
};

export default ProgramSection;
