/* eslint-disable indent */
import React, { FC } from "react";
import Agent from "../../models/Agent";
import Button from "../Button";

type WizardProgressBarProps = {
  step: number;
  agent?: Agent;
  // stepsWithDescription: string[];
  setStep?: React.Dispatch<React.SetStateAction<number>>;
};

const ProgressBar: FC<WizardProgressBarProps> = ({
  step,
  agent,
  // stepsWithDescription,
  setStep,
}: WizardProgressBarProps) => {
  // const [percentage, setPercentage] = useState(0);

  // useEffect(() => {
  //   const value = Math.round((step * 100) / stepsWithDescription.length);
  //   setPercentage(value);
  // }, [step, stepsWithDescription]);
  return (
    <div className="flex h-[84px] flex-col items-center justify-between bg-white py-2 sm:flex-row lg:px-52">
      <div
        className={`h-[30px] min-h-[30px] w-[100px] min-w-[100px] pl-2 font-bold lg:h-[40px] lg:w-[150px] ${
          step === 1 && "invisible"
        }`}
      >
        <Button
          text="BACK"
          action={() => {
            if (!setStep) return;
            setStep((current) => {
              if (current === 1) return current;
              else return current - 1;
            });
          }}
        />
      </div>
      {agent?.id !== 660555 && (
        <div className="justify-center pr-2 text-end text-black">
          Agent Support | AppTechSupport@NCD.com
        </div>
      )}
      {/* <div className="font-montserrat text-navyBlue font-bold text-lg lg:text-3xl text-center">
        {stepsWithDescription[step - 1]}
      </div>
      <div className="flex flex-row">
        <div className="pr-2 font-montserrat text-navyBlue font-bold lg:text-3xl text-center pl-3 self-center justify-self-center mt-5">
          {percentage}%
        </div>
        <div className="pr-6">
          <div className="font-montserrat font-bold text-lightBlue">
            PROGRESS
          </div>
          <div className="ml-1 flex flex-start items-center relative md:w-[300px] lg:w-[400px] outline outline-4 outline-lightBlue">
            <div
              style={{ width: percentage + "%" }}
              className={cx(
                `h-[20px] lg:h-[40px] bg-orange transition-all duration-300`
              )}
            />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ProgressBar;
