import React, { FC } from "react";
import Button from "../../components/Button";
import Plan from "../../models/Plan";

type CoverageProps = {
  type?: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setStepsNames: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedPlan: React.Dispatch<React.SetStateAction<Plan>>;
  setWants: React.Dispatch<React.SetStateAction<boolean>>;
};

const Coverage: FC<CoverageProps> = ({
  type,
  setStep,
  setStepsNames,
  setSelectedPlan,
  setWants,
}: CoverageProps) => {
  return (
    <div className="flex h-[70vh] w-full flex-row items-center lg:container">
      <div className="row-span-1 flex flex-col items-center justify-center rounded-[32px] border-4 border-celadonBlue bg-white px-11 py-8">
        <h1 className="text-[20px] font-medium text-navyBlue">
          I am looking for {type?.toLowerCase()} coverage.
        </h1>
        <div className="mt-2 flex flex-col gap-8 md:flex-row">
          <div className="h-[39px] w-[118px] text-2xl font-normal">
            <Button
              text="Yes"
              action={() => {
                setWants(true);
                setStep((current) => current + 1);
              }}
              mainPath
            />
          </div>
          <div className="h-[39px] w-[118px] text-2xl font-normal">
            <Button
              text="No"
              action={() => {
                if (type === "Dental") {
                  setStepsNames((current) =>
                    current.filter(
                      (value) =>
                        value !== "Amount Dental" &&
                        value !== "Dental" &&
                        value !== "Dependents Dental"
                    )
                  );
                } else if (type === "Vision") {
                  setStepsNames((current) =>
                    current.filter(
                      (value) =>
                        value !== "Amount Vision" &&
                        value !== "Vision" &&
                        value !== "Dependents Vision"
                    )
                  );
                }
                setSelectedPlan(new Plan());
                setWants(false);
                setStep((current) => current + 1);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coverage;
