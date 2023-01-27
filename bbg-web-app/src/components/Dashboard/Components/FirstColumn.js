import React from "react";
import { Link } from "react-router-dom";
import { PackageData } from "../../../data/mockData";
import {APP_TITLE} from "../../../util/constants";

const FirstColumn = () => {
    return (
        <div className="   flex  w-full space-x-5">
            <div className="w-full border bg-white rounded-lg">
                <p className="py-3 font-title text-secondary px-4 font-semibold border-b text-lg">
                    Earn More with {APP_TITLE}
                </p>
                <div className="flex  overflow-hidden  flex-col px-4 mt-2">
                    Earn More with {APP_TITLE}
                </div>
            </div>
            <div className="h-full w-full bg-white border rounded-lg max-w-sm">
                <p className="py-3 font-title text-secondary px-4 font-semibold border-b text-lg ">
                    Alert & Notifications
                </p>
                <ul className=" flex-0 w-full h-full  overflow-auto border-l  border-white scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 max-h-60">
                    {PackageData.slice(0, 10).map((eachPackage) => {
                        return (
                            <li
                                className={`  border-b transition-all  border-l-4  hover:border-l-6  text-darkgray75 border-l-primary`}
                            >
                                <div className="relative  ">
                                    <div className="text-sm py-2 px-2 font-semibold  ">
                                        <Link
                                            to="#"
                                            className="  focus:outline-none"
                                        >
                                            <span
                                                className="absolute inset-0"
                                                aria-hidden="true"
                                            ></span>
                                            {eachPackage?.name}
                                        </Link>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default FirstColumn;
