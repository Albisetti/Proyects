import React from "react";
import { Link } from 'react-router-dom';
import { APP_LOGO } from "../../util/constants";

const Header = () => {
  return (
    <div className="h-16">
      <nav className="bg-primary border-b border-white border-opacity-25 lg:border-none">
        <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-32">
          <div className="relative h-16 flex items-center justify-between lg:border-b lg:border-primary  lg:border-opacity-25">
            <div className="px-2 flex items-center lg:px-0">
              <div className="flex-shrink-0">
                <Link to="/">
                <img className="block h-14 w-14" src={APP_LOGO} alt="Workflow"/>
                </Link>
              </div>
              <div className="hidden lg:block lg:ml-10">
                <div className="flex space-x-4">
                  <Link to="/claims" className="text-white hover:bg-primary hover:bg-opacity-75 rounded-md py-2 px-3 text-md font-medium">
                    Claims
                  </Link>

                  <Link to="/rebates" className="bg-primary text-white rounded-md py-2 px-3 text-md font-medium">
                  Rebates
                  </Link>

                  <Link to="/programs" className="text-white  hover:bg-primary hover:bg-opacity-75 rounded-md py-2 px-3 text-md font-medium">
                    Programs             
                    </Link>

                  <Link to="layouts.html" className="text-white hover:bg-primary hover:bg-opacity-75 rounded-md py-2 px-3 text-md font-medium">
                    Layouts
                  </Link>

                  <Link to="#" className="text-white hover:bg-primary hover:bg-opacity-75 rounded-md py-2 px-3 text-md font-medium">
                    Reports
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex lg:hidden">
              <button
                type="button"
                id="mobile-menu-button"
                className="bg-primary p-2 rounded-md inline-flex items-center justify-center text-white hover:text-white hover:bg-primary hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>

                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>

                <svg
                  className="hidden h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="hidden lg:block lg:ml-4">
              <div className="flex items-center">
                <div className="ml-3 relative flex-shrink-0">
                  <div>
                    <button
                      type="button"
                      className="bg-primary rounded-full flex text-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white"
                      id="user-menu"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="rounded-full h-8 w-8"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixqx=sAelekiAdR&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      ></img>
                    </button>
                  </div>

                  <div
                    className="origin-top-right hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    id="userMenu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <Link to="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Your Profile
                    </Link>

                    <Link to="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Settings
                    </Link>

                    <Link to="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Sign out
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/claims" className="bg-primary text-white block rounded-md py-2 px-3 text-base font-medium">
              Claims
            </Link>

            <Link to="/rebates" className="text-white hover:bg-primary hover:bg-opacity-75 block rounded-md py-2 px-3 text-base font-medium">
              Rebates
            </Link>

            <Link to="/programs" className="text-white hover:bg-primary hover:bg-opacity-75 block rounded-md py-2 px-3 text-base font-medium">
              programs        
              </Link>

            <Link to="layouts.html" className="text-white hover:bg-primary hover:bg-opacity-75 block rounded-md py-2 px-3 text-base font-medium">
              Layouts
            </Link>

            <Link to="#" className="text-white hover:bg-primary hover:bg-opacity-75 block rounded-md py-2 px-3 text-base font-medium">
              Reports
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-secondary">
            <div className="px-5 flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="rounded-full h-10 w-10"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixqx=sAelekiAdR&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                ></img>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">Tom Cook</div>
                <div className="text-sm font-medium text-white text-opacity-75">tom@example.com</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link to="#" className="block rounded-md py-2 px-3 text-base font-medium text-white hover:bg-primary hover:bg-opacity-75">
                Your Profile
              </Link>

              <Link to="#" className="block rounded-md py-2 px-3 text-base font-medium text-white hover:bg-primary hover:bg-opacity-75">
                Settings
              </Link>

              <Link to="#" className="block rounded-md py-2 px-3 text-base font-medium text-white hover:bg-primary hover:bg-opacity-75">
                Sign out
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
