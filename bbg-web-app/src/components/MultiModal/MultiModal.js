import React, { useState, useEffect } from "react";
import Button from "../Buttons";

const MultiModal = ({ show, onSubmit, step1Content, step2Content, title, IconJSX, onClose, submitLabel }) => {
  
  const [showModal, setShowModal] = useState(show);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (show) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [show]);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const content = () => {
    switch (step) {
      case 1:
        return step1Content;

      case 2:
        return step2Content;
      
      default:
        return <p>you need to pass in the Steps</p>
    }
  };

  return (
    <>
      {showModal ? (
        <div className="fixed z-20 inset-0 w-full overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom  bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={onClose}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="sm:flex sm:items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  {IconJSX ? IconJSX : null}
                </div>
                <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <p className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {title} {`Step: ${step}`}
                  </p>
                </div>
              </div>
              <div className="px-4 sm:p-0 w-full">{content()}</div>
              <div className="mt-5 flex gap-5 flex-row-reverse">
                <Button
                  parentClass={"ml-5 md:ml-0"}
                  onClick={step === 2 ? onSubmit : nextStep}
                  title={step === 2 ? submitLabel : "Next"}
                  color={step === 2 ? "green-600" : "yellow-600"}
                />
                <Button
                  parentClass={"ml-5 md:ml-0"}
                  onClick={step === 2 ? prevStep : onClose}
                  title={step === 2 ? "Back" : "Cancel"}
                  color={"red-600"}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default MultiModal;
