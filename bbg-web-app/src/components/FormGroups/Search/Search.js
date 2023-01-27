import React from "react";

const Search = (props) => {
  return (
    <div>
      <label htmlFor="email" className="block text-sm text-primary font-semibold">
        Enter Name
      </label>
      <div className="mt-2 flex rounded-md shadow-sm">
        <div className="relative flex w-48 sm:w-100 focus-within:z-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          </div>
          <input
            type="text"
            name="email"
            id="email"
            className="focus:ring-primary focus:border-primary block rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300"
            placeholder="Dhruv Patel"
          ></input>
        </div>
        <button className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-primary bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
         
          <span>Search</span>
        </button>
      </div>
    </div>
  );
};

export default Search;
