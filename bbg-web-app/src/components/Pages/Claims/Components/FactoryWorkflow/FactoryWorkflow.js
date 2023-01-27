import React from "react";
import { Helmet } from "react-helmet";
import HelperModal from "../../../../Modal/HelperModal";
import ClaimDetails from "./ClaimDetails";
import { APP_TITLE } from "../../../../../util/constants";


const FactoryWorkflow = ({ history }) => {

  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{APP_TITLE} - Claim Workflow</title>
      </Helmet>

      <div className="max-w-8xl  h-full mx-auto px-2 sm:px-4 lg:px-32  w-8xl ">
        <div className=" flex flex-col pb-5 gap-5">
          <div className=" bg-white rounded-lg py-4 px-4 h1 flex">
            <p> Claim Workflow </p>

            <HelperModal type={"factoryworkflow"} title="Claim Workflow Information" />
          </div>
          <ClaimDetails />
        </div>
      </div>
    </div>
  );
};

export default FactoryWorkflow;
