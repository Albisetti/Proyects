import React, { FC } from "react";
import AmountOfPeopleCard from "./AmountOfPeopleCard";

type SelectAmountOfPeopleProps = {
  type?: string;
  amountOfDependents: number;
  setAmountOfDependents: React.Dispatch<React.SetStateAction<number>>;
  setAmountOfDependentsType: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setStepsNames: React.Dispatch<React.SetStateAction<string[]>>;
};

const SelectAmountOfPeople: FC<SelectAmountOfPeopleProps> = ({
  type,
  amountOfDependents,
  setAmountOfDependents,
  setAmountOfDependentsType,
  setStep,
  setStepsNames,
}: SelectAmountOfPeopleProps) => {
  return (
    <div className="items-start justify-center gap-2 lg:flex lg:flex-col">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:flex xl:flex-row">
        <AmountOfPeopleCard
          url="/member.png"
          amountOfDependents={amountOfDependents}
          setAmountOfDependents={setAmountOfDependents}
          setAmountOfDependentsType={setAmountOfDependentsType}
          setStep={setStep}
          text="Member"
          removeSteps={() => {
            setStepsNames((current) =>
              current.filter((value) => value !== "Dependents")
            );
          }}
        />
        <AmountOfPeopleCard
          url="/member_spouse.png"
          amountOfDependents={amountOfDependents}
          setAmountOfDependents={setAmountOfDependents}
          setAmountOfDependentsType={setAmountOfDependentsType}
          setStep={setStep}
          text="Member plus Spouse"
        />
        <AmountOfPeopleCard
          url="/member_children.png"
          amountOfDependents={amountOfDependents}
          setAmountOfDependents={setAmountOfDependents}
          setAmountOfDependentsType={setAmountOfDependentsType}
          setStep={setStep}
          text="Member plus Children"
        />
        {type === "vision" && (
          <AmountOfPeopleCard
            url="/member_spouse.png"
            amountOfDependents={amountOfDependents}
            setAmountOfDependents={setAmountOfDependents}
            setAmountOfDependentsType={setAmountOfDependentsType}
            setStep={setStep}
            text="Member + 1"
          />
        )}
        <AmountOfPeopleCard
          url="/member_family.png"
          amountOfDependents={amountOfDependents}
          setAmountOfDependents={setAmountOfDependents}
          setAmountOfDependentsType={setAmountOfDependentsType}
          setStep={setStep}
          text="Family"
        />
      </div>
    </div>
  );
};

export default SelectAmountOfPeople;
