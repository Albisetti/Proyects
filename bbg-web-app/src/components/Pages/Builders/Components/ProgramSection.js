import React,{useState} from "react";
import TextField from "../../../FormGroups/Input";
import Accordian from "../../../Accordian";
import RadioGroup from "../../../RadioButtonGroup";
import { Link } from "react-router-dom";
import Button from "../../../Buttons";
import CommonSelect from "../../../Select";
import Modal from "../../../Modal";
import { APP_TITLE } from "../../../util/constants";

const ProgramSection = () => {

  const [showModal, setShowModal] = useState(false);
  const optionsBuilders = [
    { value: "Acme Co. Builders", label: "Acme Co. Builders" },
    { value: "Bob Builders", label: "Bob Builders" },
    { value: "Splice Master Builders", label: "Splice Master Builders" },
  ];
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
    {
      title: "Program Name (Volume)",
      color: "red",
    },
    {
      title: "Program Name",
      color: "blue",
    },
    {
      question: "Program Name",
      color: "yellow",
    },
  ];



  const newProductContent = () => {
    return (
      <div className="grid grid-cols-1 w-full text-rose-200">
        <TextField
          parentClass="justify-items-start col-span-2 grid grid-cols-2   items-center "
          id="programName"
          label="Program Name"
            
           
            
          name="programName"
          placeholder="Program Name"
          type="text"
        />
        <div className="text-primary text-md mt-2 col-span-2 text-left"> Available to: All Builders</div>
        <div className=" col-span-2 grid grid-cols-2   items-center mt-3">
          <label className="block text-md font-medium text-primary text-left">
            Category
          </label>
          <CommonSelect
            className="mt-1 flex-1"
            width={""}
            options={optionsBuilders}
            isMulti
            placeHolder="Choose"
          />
        </div>
        <TextField
           parentClass="justify-items-start col-span-2 grid grid-cols-2   items-center mt-3"
          id="bbgCode"
          label={APP_TITLE+" Code"}
            
           
            
          name="bbgCode"
          placeholder={APP_TITLE+" Product Code"}
          type="text"
        />
        <TextField
          parentClass="justify-items-start col-span-2 grid grid-cols-2   items-center mt-3"
          textarea
          id="description"
          label={APP_TITLE+" Description"}
            
           
            
          name="description"
          placeholder="Brief Description"
          type="text"
        />
        <TextField
          parentClass="justify-items-start col-span-2 grid grid-cols-2   items-center mt-3"
          id="productLine"
          label="Product Line"
            
           
            
          name="productLine"
          placeholder="Product Line"
          type="text"
        />
        <TextField
          parentClass="justify-items-start col-span-2 grid grid-cols-2   items-center mt-3"
          id="productLine"
          label="Product Minimum"
          name="productLine"
          placeholder="Product Line"
          type="number"
        />
        <div className="col-span-2 flex items-start mt-3">
          <div className="flex items-center h-5 ">
            <input
              value={"requireQuantityReporting"}
              id={"requireQuantityReporting"}
              name={"requireQuantityReporting"}
              type="checkbox"
              className="focus:ring-secondary h-4 w-4 text-primary border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor={"requireQuantityReporting"}
              className="text-md text-primary font-semibold cursor-pointer"
            >
              Require Quantity Reporting
            </label>
          </div>
        </div>
        <div className="col-span-2 flex items-start mt-3">
        <RadioGroup />
        </div>
      </div>
    );
  };

  const IconJSX = () => {
    return (
      <svg
        className="h-6 w-6 text-red-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    );
  };

  const modal = () => {
    return (
      <>
        <Modal
          title="Add a Product: Display Program Name"
          Content={ newProductContent()}
          submitLabel="Confirm"
          onClose={() => setShowModal(false)}
          IconJSX={<IconJSX />}
          show={showModal}
        />
      </>
    );
  };

  return (
    <div className="py-5">
      {/* <div className="flex flex-row justify-start gap-5 my-3 mt-4 mx-2 w-full">
        <p className="text-primary font-bold   "> Manage Builders</p>
      </div> */}
      <div className="grid gap-4  lg:grid-cols-9  overflow-hidden">
        <div className="bg-white border rounded-lg min-h-smallMin lg:col-span-3">
          <div className="flex flex-col md:flex-row px-4 py-2 border-b justify-between items-center">
            <p className=" w-full py-2 text-start text-secondary font-bold text-xl">
              {APP_TITLE} Programs
            </p>
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
          <div className="flex  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 w-full h-full">
            <div className="w-full min-h-smallMin max-h-partial xl:max-h-smallMin sm:max-h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
              <ul className=" flex-0 w-full  overflow-auto">
                {list.map((eachData) => {
                  return (
                    <li
                      className={`py-3 pl-3 border-b border-l-4 border-l-${eachData.color}-500`}
                    >
                      <div className="relative  ">
                        <p className="text-sm font-semibold text-gray-800">
                          <Link to="#" className="  focus:outline-none">
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
        <div className="bg-white   rounded-lg lg:col-span-3">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className=" py-5 px-4 text-center text-secondary font-bold text-xl">
              Builder's Programs
            </div>
          </div>
          <Accordian maxHeight="57vh" component={<RadioGroup />} Data={Data} />
        </div>
        <div className="bg-white   rounded-lg lg:col-span-3 ">
          <div className="h-full relative  md:pr-3 lg:pr-0 xl:pr-3 2xl:pr-0">
          {modal()}
            <div className="inset-0    h-full flex flex-col">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className=" py-4 pt-6 px-4 text-center text-secondary font-bold text-xl">
                  Builder's Programs
                </div>
              </div>

              <div className="flex flex-col flex-1 overflow-auto w-full">
                <div className="flex flex-col h-full overflow-auto w-full">
                  <div className="w-full   xl:max-h-smallMin sm:max-h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                    <div className="grid grid-cols-1 gap-6">
                          <Accordian maxHeight="57vh" component={<RadioGroup />} Data={Data} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 flex flex-col items-end justify-end">
                <Button color="primary" title="Custom Product" onClick={() => setShowModal(true)}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramSection;
