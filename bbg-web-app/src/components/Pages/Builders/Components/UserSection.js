import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import CreateAdmin from "./CreateBuilder";
import { FETCH_USERS_QUERY } from "../../../../lib/admin";
import { SearchIcon } from "@heroicons/react/solid";
import { Helmet } from "react-helmet";
import {APP_TITLE} from "../../../../util/constants";

const Administrators = ({ archieved, history }) => {
  const [secondColumn, setSecondColumn] = useState(false);
  const [edit, setEdit] = useState(false);

  const { data } = useQuery(FETCH_USERS_QUERY);
  const [userData, setUserData] = useState();

  useEffect(() => {
    // if(!data.users) {
    //   history.push('/login');
    // }
  }, [data]);

  const setData = (eachUser) => {
    setSecondColumn(true);
    setEdit(true);
    setUserData(eachUser);
  };

  const createNew = () => {
    setSecondColumn(true);
    setUserData({});
    setEdit(false);
  };

  return (
    <div className="   flex flex-col lg:flex-row  py-5">
      <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Builders - Users</title>
            </Helmet>
      <div className="w-full">
        <div className="grid grid-cols-6 gap-5">
          <div className="border-b rounded-lg  col-span-6 mt-5 xl:mt-0 flex-1 xl:col-span-2 w-full md:border-b-0 xl:flex-shrink-0   xl:border-gray-200 bg-white" style={{minHeight:"79vh" ,maxHeight:"79vh"}}>
            <div className="h-full ">
              <div className="h-full relative">
                <div className=" inset-0    border-gray-200  rounded-lg h-full flex flex-col">
                  <div className="flex  border-b items-center justify-between space-x-5">
                    <div className="min-w-0 flex-1 px-4 py-3 max-w-full">
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <div className="relative flex items-stretch flex-grow focus-within:z-10">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                          <input
                            type="text"
                            name="searchAdmin"
                            id="searchAdmin"
                            className="focus:ring-primary focus:border-primary block w-full rounded-none rounded-l-md  sm:text-sm border-gray-300"
                            placeholder="Search Admin"
                          />
                        </div>
                        <button className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                          <SearchIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          {/* <span>Sort</span> */}
                        </button>
                      </div>
                    </div>
                    <div className="">
                      <button
                        type="button"
                        className="text-lg py-3 mr-3 border-transparent   font-medium rounded-md text-secondary focus:outline-none"
                        onClick={() => createNew()}
                      >
                        <svg
                          className="w-8 h-8"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
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

                  <div className="flex  w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                    <div className="w-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                      <ul className=" flex-0 w-full  overflow-auto">
                        {data &&
                          data.users &&
                          data.users.edges.length !== 0 &&
                          data.users.edges.map((eachData) => {
                            return (
                              <li
                                className="py-3 pl-3 border-b border-l-4 border-l-red-500 hover:bg-gray-100"
                                onClick={() => setData(eachData.node)}
                              >
                                <div className="relative  ">
                                  <p className="text-sm font-semibold text-darkgray75">
                                    <Link
                                      to="#"
                                      className="  focus:outline-none"
                                    >
                                      <span
                                        className="absolute inset-0"
                                        aria-hidden="true"
                                      ></span>
                                      {eachData.node.first_name}{" "}
                                      {eachData.node.last_name}
                                    </Link>
                                  </p>
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-col w-full py-2 border-t justify-end items-center">
                    <div className="  text-secondary font-bold">
                      Total: {data && data.users && data.users.edges.length}{" "}
                      Users
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col col-span-6 xl:col-span-4  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 " style={{minHeight:"79vh" ,maxHeight:"79vh"}}>
            {secondColumn ? (
              <>
                <p className="py-5 px-4 bg-white rounded-t-lg font-bold text-xl font-title text-secondary85">
                  New User
                </p>
                <CreateAdmin
                  archieved={archieved}
                  edit={edit}
                  user={edit === true ? userData : {}}
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Administrators;
