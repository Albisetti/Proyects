import React, { FC } from "react";
import CoveredMembers from "../../components/CoveredMembers";
import Agent from "../../models/Agent";
import Dependent from "../../models/Dependent";
import Member from "../../models/Member";
import Plan from "../../models/Plan";

type DependentInformationProps = {
  member: Member;
  agent: Agent;
  setAmountOfDependents: React.Dispatch<React.SetStateAction<number>>;
  amountOfDependents: number;
  amountOfDependentsType: string;
  setDependents: React.Dispatch<React.SetStateAction<Dependent[]>>;
  dependents: Dependent[];
  validVisionInState: boolean;
  setSelectedPlanVision: React.Dispatch<React.SetStateAction<Plan>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const DependentInformation: FC<DependentInformationProps> = ({
  member,
  agent,
  setAmountOfDependents,
  amountOfDependents,
  amountOfDependentsType,
  setDependents,
  dependents,
  validVisionInState,
  setSelectedPlanVision,
  setStep,
}: DependentInformationProps) => {
  return (
    <div className="xl:pt-17 flex min-h-[70vh] w-full flex-col px-2 py-2">
      <div className="mb-4 flex w-full items-center justify-center self-start rounded-[32px] border-4 border-celadonBlue bg-backgroundSolidGrey p-4 text-center">
        <h1 className="flex flex-row items-center justify-center gap-4 text-[32px] font-bold text-navyBlue">
          Dependent Information
        </h1>
      </div>
      <CoveredMembers
        member={member}
        agent={agent}
        setAmountOfDependents={setAmountOfDependents}
        amountOfDependents={amountOfDependents}
        amountOfDependentsType={amountOfDependentsType}
        setDependents={setDependents}
        dependents={dependents}
        setSelectedPlanVision={setSelectedPlanVision}
        validVisionInState={validVisionInState}
        setStep={setStep}
      />
    </div>
  );
};

export default DependentInformation;
