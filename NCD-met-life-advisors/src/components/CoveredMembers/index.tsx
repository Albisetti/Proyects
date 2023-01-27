import React, { FC, useEffect, useState } from "react";
import Agent from "../../models/Agent";
import Dependent from "../../models/Dependent";
import Member from "../../models/Member";
import Plan from "../../models/Plan";
import Button from "../Button";
import DependentList from "./DependentList";

type CoveredMembersProps = {
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

const CoveredMembers: FC<CoveredMembersProps> = ({
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
}: CoveredMembersProps) => {
  const [spouseSelected, setSpouseSelected] = useState<Boolean>(false);
  const [errorList, setErrorList] = useState<Boolean[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [missingFields, setMissingFields] = useState<{
    [id: string]: { [field: string]: boolean };
  }>({});

  const requiredFields = [
    "firstName",
    "lastName",
    "dateOfBirth",
    "gender",
    "relationship",
  ];

  useEffect(() => {
    dependents?.forEach((element) => {
      if (element?.relationship === "Spouse") setSpouseSelected(true);
    });
  }, [dependents]);

  useEffect(() => {
    if (dependents.length === amountOfDependents) return;
    let dependentsObject = [];
    for (let i = 1; i <= amountOfDependents; i++) {
      let currObject = new Dependent();
      dependentsObject.push(currObject);
    }
    setDependents(dependentsObject);
    let visionId = validVisionInState ? 38593 : 27722;
    if (
      amountOfDependents >= 2 &&
      amountOfDependentsType === "Member plus Children"
    ) {
      const plan = new Plan();
      plan
        .getPlanDetails(visionId, "Family", agent?.id, member?.zipCode)
        .then(() => {
          setSelectedPlanVision(plan);
        });
    } else if (
      amountOfDependents < 2 &&
      amountOfDependentsType === "Member plus Children"
    ) {
      const plan = new Plan();
      plan
        .getPlanDetails(
          visionId,
          amountOfDependentsType,
          agent?.id,
          member?.zipCode
        )
        .then(() => {
          setSelectedPlanVision(plan);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountOfDependents]);

  function validateFullPage() {
    let newMissingFields: { [id: string]: { [field: string]: boolean } } = {};
    let isEmpty = true;
    dependents.forEach((dependent, index) => {
      let dependentJson = JSON.parse(JSON.stringify(dependent));
      let dependentMissingField: { [field: string]: boolean } = {};
      requiredFields.forEach((field) => {
        if (!dependentJson[field]) {
          dependentMissingField[field] = true;
          isEmpty = false;
        }
      });
      newMissingFields[index] = dependentMissingField;
    });
    setMissingFields(newMissingFields);
    return isEmpty;
  }

  return (
    <div className="relative flex w-full flex-col rounded-[32px] border-4 border-celadonBlue bg-backgroundSolidGrey p-8">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
          if (validateFullPage()) setStep((current) => current + 1);
        }}
        noValidate
      >
        <div className="inherit bg-inherit">
          {dependents?.map((element, index) => {
            return (
              <>
                <DependentList
                  key={index}
                  index={index}
                  dependent={element}
                  dependents={dependents}
                  setSpouseSelected={setSpouseSelected}
                  spouseSelected={spouseSelected}
                  setDependents={setDependents}
                  setAmountOfDependents={setAmountOfDependents}
                  amountOfDependents={amountOfDependents}
                  amountOfDependentsType={amountOfDependentsType}
                  setErrorList={setErrorList}
                  errorList={errorList}
                  missingFields={missingFields[index]}
                  validateFullPage={validateFullPage}
                  submitted={submitted}
                />
              </>
            );
          })}
        </div>
        <div className="sticky bottom-[5rem] z-[50] w-full">
          <div className="my-8 h-[2px] w-full bg-navyBlue" />
          <div className="flex flex-row items-center justify-center gap-2 pb-5 xl:gap-6 ">
            <div className="h-[45px] w-[100px] xl:w-[241px]">
              {!(
                amountOfDependentsType === "Member" ||
                amountOfDependentsType === "Member plus Spouse"
              ) && (
                <Button
                  text="Add +"
                  action={() => {
                    setAmountOfDependents(amountOfDependents + 1);
                  }}
                />
              )}
            </div>
            <div className="h-[45px] w-[100px] xl:w-[241px]">
              <Button
                text="Submit"
                submit
                disabled={errorList.includes(true)}
                mainPath
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CoveredMembers;
