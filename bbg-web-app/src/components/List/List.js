import React from "react";
import { Link } from 'react-router-dom';
import { PackageData} from "../../data/mockData"

const List = ({ compWrapper, listWrapper, subCompWrapper, topTitle, bottomButton }) => {
  return (
    <div className={compWrapper}>
        <div className={subCompWrapper}>
          {topTitle ? (
            <div className="flex flex-0 px-4 border-b justify-between items-center">
              <div className=" text-center text-primary font-bold text-xs sm:text-sm md:text-xl">Bundle: Premier Fixtures Package</div>
              <div>
                <button type="button" className=" text-lg py-3  border-transparent  font-medium rounded-md text-primary  ">
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
          ) : null}
          <div className="flex flex-1 overflow-auto w-full">
            <div className={`w-full max-h-96 scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400`}>
              <ul className="flex-0 w-full overflow-auto">
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
                                  className="w-24 my-2 focus:ring-primary focus:border-primary min-w-0  rounded-md sm:text-sm border-gray-300"
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
          {bottomButton ? (
            <div className="py-2 flex w-full border-t justify-around items-center">
              <button className="h-10 px-5 py-1 text-red-800 transition-colors duration-150 border border-red-800 rounded-lg focus:shadow-outline hover:bg-red-800 hover:text-white">
                Cancel
              </button>
              <button className="h-10 px-5 py-1 text-primary transition-colors duration-150 border border-primary rounded-lg focus:shadow-outline hover:bg-primary hover:text-white">
                Save
              </button>
            </div>
          ) : null}
        </div>
    </div>
  );
};

export default List;
