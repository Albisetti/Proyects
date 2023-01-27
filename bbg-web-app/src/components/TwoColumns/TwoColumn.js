import React from "react";
import { Link } from 'react-router-dom';
import {  ProgramData} from "../../data/mockData"


const TwoColumn = ({ secondColumnTitle }) => {
  return (
    <div className="mt-8">
      <div className="max-w-8xl w-8xl mx-auto pb-12">
        <div className="bg-white lg:max-h-partial rounded-lg flex flex-col shadow px-5 py-6 sm:px-6">
          <div className="flex-col mt-6 h-auto  flex items-stretch lg:flex-row  overflow-hidden">
            <aside className="w-full border border-gray-200  rounded-lg sm:w-full lg:w-2/6 xl:w-3/12 sm:block">
              <div className="h-full">
                <div className="h-full relative">
                  <div className="inset-0 w-full   h-full flex flex-col">
                    <div className="flex  border-b items-center">
                      <div className="flex w-full px-4 justify-between items-center md:justify-between ">
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
                                placeholder="Claim Number"
                                id="username"
                                autoComplete="username"
                                className="flex-1 placeholder-lightPrimary block w-36 sm:w-24 xl:w-32 focus:ring-primary focus:border-primary min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                              ></input>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button type="button" className=" text-lg py-3 mr-3 border-transparent   font-medium rounded-md text-primary  ">
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
                      <div className="w-full max-h-partial 2xl:max-h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                        <ul className=" flex-0 w-full  overflow-auto">
                          {ProgramData.map((eachProgram) => {
                            return (
                              <li className={`py-3 pl-3 border-b border-l-4 border-l-${eachProgram.code}-500`}>
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
                    <div className=" flex w-full py-4  border-t justify-center">
                      <div className="  text-primary font-bold">Total: {ProgramData.length} Programs</div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
            <div className="flex-1">
              <div
                aria-labelledby="primary-heading"
                className="min-w-0  flex-1 border border-gray-200  rounded-lg mt-5 lg:mt-0 lg:ml-5   h-full flex flex-col  overflow-x-hidden lg:order-last"
              >
                <div className=" overflow-x-hidden scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                  <p className="text-xl pt-4 pb-3 pl-4 border-b text-primary font-bold">{secondColumnTitle}</p>
                  <div className="flex flex-col border-b pl-4 ">
                    <p className="text-md py-2 sm:py-2 font-bold text-primary">Most Recent Claim</p>
                    <div className="py-2 overflow-x-auto scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 sm:-mx-6 lg:-mx-8">
                      <div className="align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="py-2 sm:py-0 sm:rounded-lg">
                          <table className="min-w-full mb-2 ">
                            <thead className="">
                              <tr>
                                <th scope="col" className="px-3  text-left   text-lightPrimary">
                                  Status
                                </th>
                                <th scope="col" className="px-3  text-left   text-lightPrimary ">
                                  Reporting Period
                                </th>
                                <th scope="col" className="px-3  text-left   text-lightPrimary  ">
                                  Claim Period
                                </th>
                                <th scope="col" className="px-3  text-left   text-lightPrimary  ">
                                  Last Modified
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bg-white">
                                <td className="px-3 py-1 whitespace-nowrap text-sm font-medium text-gray-500">Complete</td>
                                <td className="px-3 py-1 whitespace-nowrap text-sm text-gray-500">Q2 - 2021</td>
                                <td className="px-3 py-1 whitespace-nowrap text-sm text-gray-500">April, 21 - June, 21</td>
                                <td className="px-3 py-1 whitespace-nowrap text-sm text-gray-500">June 17, 2021</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <form className="space-y-8 divide-y divide-gray-200">
                      <div className="space-y-8 divide-y divide-gray-200  sm:space-y-5">
                        <div>
                          <div>
                            <p className="text-md font-bold text-primary pl-4 mt-2 sm:mt-2">Start New Claim</p>
                          </div>

                          <div className="mt-3  space-y-6 sm:space-y-5 ">
                            <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start  sm:border-gray-200 sm:pt-2">
                              <label htmlFor="username" className="block text-sm font-medium text-lightPrimary sm:mt-px sm:pt-2">
                                Reporting Period
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <div>
                                  <select
                                    id="location"
                                    name="location"
                                    className="mt-1 block text-lightPrimary w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm rounded-md"
                                  >
                                    <option>Q1 2021</option>
                                    <option selected>Q2 2021</option>
                                    <option>Q3 2021</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                              <label htmlFor="about" className="block text-sm font-medium text-lightPrimary sm:mt-px sm:pt-2">
                                Claim Period
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <div>
                                  <div className="mt-1">
                                    <input
                                      type="text"
                                      className="shadow-sm placeholder-lightPrimary focus:ring-secondary focus:border-secondary block w-48 sm:text-sm border-gray-300 rounded-md"
                                      placeholder="Date Picker"
                                      aria-describedby="email-description"
                                    ></input>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                              <label htmlFor="about" className="block text-sm font-medium text-lightPrimary sm:mt-px sm:pt-2">
                                Total Rebate
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <div>
                                  <div className="mt-1">
                                    <input
                                      type="text"
                                      className="shadow-sm placeholder-lightPrimary focus:ring-secondary focus:border-secondary block w-48 sm:text-sm border-gray-300 rounded-md"
                                      placeholder="$13,425"
                                      aria-describedby="email-description"
                                    ></input>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className=" px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                              <label htmlFor="about" className="block text-sm font-medium text-lightPrimary sm:mt-px sm:pt-2">
                                Supplier Report
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <div>
                                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                      <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                      >
                                        <path
                                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                      <div className="flex text-sm text-gray-600">
                                        <label
                                          htmlFor="file-upload"
                                          className="relative cursor-pointer bg-white rounded-md font-medium text-secondary hover:text-opacity-90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-secondary"
                                        >
                                          <span>Upload a file</span>
                                          <input id="file-upload" name="file-upload" type="file" className="sr-only"></input>
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                      </div>
                                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className=" bottom-0 py-2">
                          <div className="flex justify-center">
                            <button
                              type="button"
                              className="inline-flex items-center p-3 border border-transparent rounded-lg shadow-sm text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                            >
                              <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <p className="px-3">Start Claim</p>
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
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

export default TwoColumn;
