import React from "react";
import { Link } from "react-router-dom";
import {APP_TITLE} from "../../../util/constants";


const SecondColumn = ({type}) => {

  

    const statusData = [
        {
            value: "9",
            label: "Action Required",
            color: "brickRed",
            data: "Insights",
        },
        {
            value: "411",
            label: "Ready For Rebate",
            data: "Insights",
            color: "secondary",
        },
        
    ];


    return (
        <div className="flex w-full space-x-5">
            { type !== "BUILDERS"?
            <div className="w-full border bg-white rounded-lg">
                <p className="py-3 font-title text-secondary px-4 font-semibold border-b text-lg">
                    Go To
                </p>
                <div className="flex  overflow-hidden  flex-col px-4 mt-2">
                    Could Be Jump Links
                </div>
            </div> : null
}
            <div className="bg-white border rounded-lg w-full">
                <p className="py-3 font-title text-secondary px-4 font-semibold border-b text-lg">
                    Earn More with {APP_TITLE}
                </p>
                <ul className="flex flex-col px-4 py-2">
                    {statusData.map((item) => {
                        return (
                            <li className="my-2 flex  rounded-md border">
                                <div
                                    className={`flex-shrink-0 flex items-center justify-center w-16 text-${item.color} text-xl font-medium rounded-l-md`}
                                >
                                    {item.value}
                                </div>
                                <div className="flex-1 flex items-center justify-between bg-white border-l rounded-r-md truncate">
                                    <div className="flex-1 px-4 py-2 text-sm">
                                        <Link
                                            to="#"
                                            className="text-gray-900 font-medium hover:text-gray-600"
                                        >
                                            {item.label}
                                        </Link>
                                        <p className="text-gray-500">
                                            {item.data}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className=" bg-white border rounded-lg w-full max-w-sm">
                <p className="py-3 font-title text-secondary px-4 font-semibold border-b text-lg ">
                    Need Help?
                </p>
                <div className="flex  overflow-hidden  flex-col px-4 mt-2">
                    TM Contact Info
                </div>
            </div>
        </div>
    );
};

export default SecondColumn;
