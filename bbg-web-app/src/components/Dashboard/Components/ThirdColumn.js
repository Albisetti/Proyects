import React from "react";
import { Link } from "react-router-dom";
import Bar from "./Charts/Bar";
import Pie from "./Charts/Pie";
import { PackageData } from "../../../data/mockData";

const ThirdColumn = ({type}) => {
    const data = [
        {
            department: "F",
            blocked: 65,
            blockedColor: "hsl(229, 70%, 50%)",
            inProgress: 92,
            inProgressColor: "hsl(274, 70%, 50%)",
            processed: 199,
            processedColor: "hsl(141, 70%, 50%)",
            submitted: 53,
            submittedColor: "hsl(323, 70%, 50%)",
        },
        {
            department: "E",
            blocked: 173,
            blockedColor: "hsl(353, 70%, 50%)",
            inProgress: 23,
            inProgressColor: "hsl(259, 70%, 50%)",
            processed: 186,
            processedColor: "hsl(51, 70%, 50%)",
            submitted: 196,
            submittedColor: "hsl(124, 70%, 50%)",
        },
        {
            department: "D",
            blocked: 80,
            blockedColor: "hsl(88, 70%, 50%)",
            inProgress: 89,
            inProgressColor: "hsl(110, 70%, 50%)",
            processed: 50,
            processedColor: "hsl(108, 70%, 50%)",
            submitted: 177,
            submittedColor: "hsl(272, 70%, 50%)",
        },
        {
            department: "A",
            blocked: 133,
            blockedColor: "hsl(272, 70%, 50%)",
            inProgress: 100,
            inProgressColor: "hsl(94, 70%, 50%)",
            processed: 119,
            processedColor: "hsl(88, 70%, 50%)",
            submitted: 56,
            submittedColor: "hsl(315, 70%, 50%)",
        },
        {
            department: "B",
            blocked: 164,
            blockedColor: "hsl(167, 70%, 50%)",
            inProgress: 104,
            inProgressColor: "hsl(156, 70%, 50%)",
            processed: 17,
            processedColor: "hsl(300, 70%, 50%)",
            submitted: 173,
            submittedColor: "hsl(126, 70%, 50%)",
        },
        {
            department: "C",
            blocked: 124,
            blockedColor: "hsl(260, 70%, 50%)",
            inProgress: 16,
            inProgressColor: "hsl(127, 70%, 50%)",
            processed: 73,
            processedColor: "hsl(167, 70%, 50%)",
            submitted: 99,
            submittedColor: "hsl(217, 70%, 50%)",
        },
    ];

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
            color: "brickGreen",
        },
        {
            value: "5",
            label: "Completed",
            data: "Insights",
            color: "secondary",
        },
    ];

    const pieData = [
        {
            id: "completed",
            label: "completed",
            value: 495,
            color: "hsl(358, 70%, 50%)",
        },
        {
            id: "active",
            label: "active",
            value: 138,
            color: "hsl(29, 70%, 50%)",
        },
    ];

    return (
        <div className="   flex  w-full space-x-5">
            <div className="w-full">
                <p className="py-3 font-title text-secondary px-4 font-semibold border-b text-lg  border bg-white rounded-lg rounded-b-none">
                    Key Performance Metrics
                </p>
                <div className="flex  overflow-hidden  border bg-white rounded-lg rounded-t-none">
                    <div className="border-r h-full pt-2 px-2">
                        <ul className="flex flex-col px-4 py-1">
                            {statusData.map((item) => {
                                return (
                                    <li className="my-2 flex border  rounded-md">
                                        <div
                                            className={`flex-shrink-0 flex items-center justify-center w-16 text-${item.color}  text-white text-xl font-medium rounded-l-md`}
                                        >
                                            {item.value}
                                        </div>
                                        <div className="flex-1 flex items-center justify-between border-l border-gray-200 bg-white rounded-r-md truncate">
                                            <div className="flex-1 px-4 py-2 text-sm ">
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
                    <div className="flex-1 bg-white flex  w-full">
                        <div className="h-full w-full ">
                            <div className="w-full h-full flex   py-4 px-4">
                                <div className="w-full">
                                    <p className="text-secondary text-xs font-medium uppercase tracking-wide">
                                        Progress
                                    </p>
                                    <div className="h-44 w-full">
                                        <Bar data={data} />
                                    </div>
                                </div>
                                <div className=" w-full">
                                    <p className="text-secondary text-xs font-medium uppercase tracking-wide">
                                        Disputes
                                    </p>
                                    <div className="h-44 w-full">
                                        <Pie data={pieData} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            { type === "BUILDERS"?
            <div className=" w-full bg-white border rounded-lg max-w-sm">
                <p className="py-3 font-title text-secondary px-4 font-semibold border-b text-lg ">
                    Add New Programs
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
            </div> : null }
            <div className=" w-full bg-white border rounded-lg ">
                <p className="py-3 font-title text-secondary px-4 font-semibold border-b text-lg ">
                    Add New Programs
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

export default ThirdColumn;
