import { useLazyQuery } from "@apollo/client";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import { FETCH_HELPER_DATA } from "../../lib/wordpress";
import { wordPressClient } from "../../util/wordpress";

const HelperModal = ({
type,
  title,
  IconJSX,
  minHeight,
}) => {
  const [showModal, setShowModal] = useState(false);

 

  const [getHelperData, { data:helperData}] = useLazyQuery(FETCH_HELPER_DATA, {
    notifyOnNetworkStatusChange: false,
    client:wordPressClient
  });

  useEffect(() => {
    getHelperData()
    // eslint-disable-next-line
  }, [type])

  

  const renderHelperContent = () => {
    let item = helperData?.posts?.nodes?.filter(item => item?.slug === type);
    return (
      <div className="px-6 text-secondary font-body font-normal" dangerouslySetInnerHTML={{__html:`${item && item[0] && item[0]?.content}`}}>
      </div>
    )
  }
 
  return (
    <>
    
      <QuestionMarkCircleIcon className="w-8 h-8 text-secondary ml-2 cursor-pointer" onClick={() => setShowModal(true)}/>
      {showModal ? (
        <div
          className="fixed z-20 inset-0 overflow-y-auto "
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block ">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle py-2 min-h-smallMin w-2/5
             `}
            >
              <div className="flex items-center px-4 pt-1 pb-4 ">
                <div className="hidden sm:block absolute top-0 right-0 pt-2 pr-2">
                  <button
                    onClick={() => setShowModal(false)}
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <span className="sr-only">Close</span>

                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex justify-start items-center">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center rounded-full sm:mx-0">
                    {IconJSX ? IconJSX : null}
                  </div>
                  <p className="bg-white rounded-lg pl-2 h1" id="modal-title">
                    {title}
                  </p>
                </div>
              </div>
              <div className="sm:flex sm:items-center flex-1">
                <div
                  className={`text-center  w-full ${
                    minHeight ? minHeight : ""
                  } sm:text-left`}
                >
                   {renderHelperContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default HelperModal;
