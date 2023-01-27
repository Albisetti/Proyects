import React from "react";
import { Link } from 'react-router-dom';

const ProcessFlow = ({ completed, current, future, count, labels }) => {
  return (
    <div className="mt-5">
      <div className="">
        <nav aria-label="Progress">
          <ol className="border border-gray-200 rounded-md divide-y divide-gray-300 md:flex md:divide-y-0">
            <li className="relative md:flex-1 md:flex">
              <Link to="#" className="group flex items-center w-full">
                <span className="px-6 py-4 flex items-center text-sm font-medium">
                  <span
                    className={`flex-shrink-0 w-10 h-10 flex items-center justify-center ${
                      completed ? "bg-primary" : current ? " border-2 border-secondary" : " border-2 border-gray-300"
                    } rounded-full group-hover:bg-${future ? "border-gray-400" : "primary"}`}
                  >
                    {" "}
                    {completed ? "" : "01"}
                    {completed ? (
                      <svg
                        className="w-6 h-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    ) : null}
                  </span>
                  <span className="ml-4 text-sm font-medium text-primary">Addresses</span>
                </span>
              </Link>

              <div className="hidden md:block absolute top-0 right-0 h-full w-5" aria-hidden="true">
                <svg className="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                  <path d="M0 -2L20 40L0 82" vector-effect="non-scaling-stroke" stroke="currentcolor" strokeLinejoin="round" />
                </svg>
              </div>
            </li>

            <li className="relative md:flex-1 md:flex">
              <Link to="#" className="group flex items-center">
                <span className="px-6 py-4 flex items-center text-sm font-medium">
                  <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-secondary rounded-full group-hover:border-primary">
                    <span className="text-secondary group-hover:text-primary">02</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-secondary group-hover:text-primary">Bundles</span>
                </span>
              </Link>

              <div className="hidden md:block absolute top-0 right-0 h-full w-5" aria-hidden="true">
                <svg className="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                  <path d="M0 -2L20 40L0 82" vector-effect="non-scaling-stroke" stroke="currentcolor" strokeLinejoin="round" />
                </svg>
              </div>
            </li>

            <li className="relative md:flex-1 md:flex">
              <Link to="#" className="group flex items-center">
                <span className="px-6 py-4 flex items-center text-sm font-medium">
                  <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                    <span className="text-gray-500 group-hover:text-gray-900">03</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">Product Assignments</span>
                </span>
              </Link>
              <div className="hidden md:block absolute top-0 right-0 h-full w-5" aria-hidden="true">
                <svg className="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                  <path d="M0 -2L20 40L0 82" vector-effect="non-scaling-stroke" stroke="currentcolor" strokeLinejoin="round" />
                </svg>
              </div>
            </li>
            <li className="relative md:flex-1 md:flex">
              <Link to="#" className="group flex items-center">
                <span className="px-6 py-4 flex items-center text-sm font-medium">
                  <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                    <span className="text-gray-500 group-hover:text-gray-900">03</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">Prepare Rebates</span>
                </span>
              </Link>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default ProcessFlow;
