import React, { FC } from "react";
import SelectAmountOfPeople from "../../components/SelectAmountOfPeople";

type HowManyPeopleProps = {
  type?: string;
  amountOfDependents: number;
  setAmountOfDependents: React.Dispatch<React.SetStateAction<number>>;
  setAmountOfDependentsType: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setStepsNames: React.Dispatch<React.SetStateAction<string[]>>;
};

const HowManyPeople: FC<HowManyPeopleProps> = ({
  type,
  amountOfDependents,
  setAmountOfDependents,
  setAmountOfDependentsType,
  setStep,
  setStepsNames,
}: HowManyPeopleProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-2 py-[33px]">
      <div className="w-full rounded-[32px] border-4 border-celadonBlue bg-backgroundSolidGrey px-[38px] pt-[45px] pb-[91px]">
        <h1 className="mb-4 w-full text-[24px] font-medium text-navyBlue">
          I am looking to cover
        </h1>
        <div>
          <SelectAmountOfPeople
            type={type}
            amountOfDependents={amountOfDependents}
            setAmountOfDependents={setAmountOfDependents}
            setAmountOfDependentsType={setAmountOfDependentsType}
            setStep={setStep}
            setStepsNames={setStepsNames}
          />
        </div>
      </div>
    </div>
  );
};

export default HowManyPeople;
