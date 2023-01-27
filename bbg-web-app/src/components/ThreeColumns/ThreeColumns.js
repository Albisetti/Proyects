import React from "react";
import { Link } from 'react-router-dom';
import { PackageData, ProgramData} from "../../data/mockData"

const Data = ["Bundle Name", "Bundle Name", "Bundle Name", "Bundle Name", "Bundle Name", "Bundle Name", "Bundle Name"];


const ThreeColumn = ({ firstColumnTitle, secondColumnTitle, thirdColumnTitle }) => {
  return (
    <div className="mt-8">
      <div className="max-w-8xl  w-8xl mx-auto pb-12">
        <div className="bg-white 2xl:max-h-partial flex flex-col rounded-lg shadow px-5 py-6 sm:px-6">
          <div className="flex-1 flex-col  flex items-stretch sm:flex-row  overflow-hidden">
            <div className="flex-grow w-full max-w-8xl mx-auto 2xl:flex">
              <div className="flex-1 min-w-0  bg-white md:flex">
                <div className="border-b border-gray-200 md:w-4/12 md:border-b-0 xl:flex-shrink-0   xl:border-gray-200 bg-white">
                  <div className="h-full pt-6">
                    <div className="h-full relative">
                      <div className=" inset-0  border  border-gray-200  rounded-lg h-full flex flex-col">
                        <div className="flex flex-0 px-4 border-b justify-between items-center">
                          <div className=" py-2 text-center text-primary font-bold text-xl">{firstColumnTitle}</div>
                          <div>
                            <button type="button" className=" text-lg py-3  border-transparent  text-base font-medium rounded-md text-primary  ">
                              <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-1 overflow-auto w-full">
                          <div className="w-full max-h-96 sm:max-h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                            <ul className=" flex-0 w-full  overflow-auto">
                              {Data.map((eachData) => {
                                return (
                                  <li className="py-3 pl-3 border-b border-l-4 border-l-red-500">
                                    <div className="relative  ">
                                      <p className="text-sm font-semibold text-gray-800">
                                        <Link to="#" className="  focus:outline-none">
                                          <span className="absolute inset-0" aria-hidden="true"></span>
                                          {eachData}
                                        </Link>
                                      </p>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                        <div className=" flex  w-full py-4 border-t justify-center">
                          <div>
                            <svg
                              className="h-6 w-6 text-primary "
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white sm:flex-1 flex-wrap xl:w-96">
                  <div className="h-full pt-6 md:mx-5 lg:mr-0 xl:mr-5">
                    <div className="h-full  relative">
                      <div className="flex h-full inset-0 border border-gray-200  rounded-lg flex-col overflow-auto">
                        <div className="flex flex-col md:flex-row border-b justify-between items-center">
                          <div className="hidden md:inline-block py-2 px-4 text-center text-primary font-bold text-xl">{secondColumnTitle}</div>
                          <div className="flex w-full px-4 justify-between items-center md:justify-end ">
                            <div className="mt-0 sm:mt-2 md:mt-0 sm:border-gray-200  ">
                              <div className="py-1 sm:mt-0 sm:col-span-2">
                                <div className="max-w-lg flex rounded-md shadow-sm">
                                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-white text-primary sm:text-xs">
                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                      />
                                    </svg>
                                  </span>
                                  <input
                                    type="text"
                                    name="username"
                                    placeholder={APP_TITLE + " Number"}
                                    id="username"
                                    autoComplete="username"
                                    className="flex-1 placeholder-lightPrimary block w-24 sm:w-24 xl:w-28 focus:ring-primary focus:border-primary min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                  ></input>
                                </div>
                              </div>
                            </div>
                            <div className="ml-3">
                              <button type="button" className=" text-lg py-3  border-transparent  text-base font-medium rounded-md text-primary  ">
                                <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-1 overflow-auto w-full">
                          <div className="w-full max-h-96 sm:max-h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                            <ul className="flex-0    lg:w-50 overflow-auto">
                              {ProgramData.map((eachProgram) => {
                                return (
                                  <li className={`py-3 pl-4 border-l-4 border-l-${eachProgram.code}-500  border-b`}>
                                    <div className="relative  ">
                                      <p className="text-sm font-semibold text-gray-800">
                                        <Link to="#" className="  focus:outline-none">
                                          <span className="absolute inset-0" aria-hidden="true"></span>
                                          {eachProgram.name} ( {eachProgram.type} )
                                        </Link>
                                      </p>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                        <div className="flex  w-full py-4 border-t justify-center">
                          <div>
                            <svg
                              className="h-6 w-6 text-primary "
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white lg:min-w-0 lg:flex-1">
                <div className="h-full  pt-6 md:pr-3 lg:pr-0 xl:pr-3 2xl:pr-0">
                  <div className="h-full relative">
                    <div className="inset-0  border  border-gray-200  rounded-lg h-full flex flex-col">
                      <div className="flex flex-0 px-4 border-b justify-between items-center">
                        <div className=" text-center text-primary font-bold text-xl">{thirdColumnTitle}</div>
                        <div>
                          <button type="button" className=" text-lg py-3  border-transparent  text-base font-medium rounded-md text-primary">
                            <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-1 overflow-auto w-full">
                        <div className="w-full max-h-96 2xl:max-h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                          <ul className="flex-0 w-full  overflow-auto">
                            {PackageData.map((eachPackage) => {
                              return (
                                <li className={`border-b border-l-4 border-l-${eachPackage.code}-500`}>
                                  <Link to="#" className="block hover:bg-gray-50">
                                    <div className="flex items-center px-4 py-4 sm:px-6">
                                      <div className="min-w-0 flex-1 flex">
                                        <div className="min-w-0 flex-1 px-2 md:grid md:grid-cols-3 md:gap-4 items-center">
                                          <div>
                                            <p className="text-sm font-medium text-primary ">{eachPackage.name}</p>
                                            <p className="mt-0 sm:mt-2 flex text-sm text-gray-500">
                                              <span className="">{eachPackage.subName}</span>
                                            </p>
                                          </div>
                                          <div className="hidden md:block">
                                            <div>
                                              <p className="text-sm font-medium text-primary">Product Information</p>
                                              <p className="mt-2 flex text-sm text-gray-500">
                                                <svg
                                                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-primary"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                  />
                                                </svg>
                                                Information
                                              </p>
                                            </div>
                                          </div>

                                          <div>
                                            <input
                                              type="text"
                                              name="username"
                                              id="username"
                                              autoComplete="username"
                                              placeholder="Quantity"
                                              className="w-24 my-2 focus:ring-primary focus:border-primary min-w-0 rounded-none rounded-md sm:text-sm border-gray-300"
                                            ></input>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <svg
                                          className="h-8 w-8 text-red-400"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                      <div className="py-2 flex w-full border-t justify-around items-center">
                        <button className="h-10 px-5 py-1 text-red-800 transition-colors duration-150 border border-red-800 rounded-lg focus:shadow-outline hover:bg-red-800 hover:text-white">
                          Cancel
                        </button>
                        <button className="h-10 px-5 py-1 text-primary transition-colors duration-150 border border-primary rounded-lg focus:shadow-outline hover:bg-primary hover:text-white">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeColumn;
