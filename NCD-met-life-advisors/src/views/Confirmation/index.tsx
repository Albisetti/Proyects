import React, { FC, useEffect, useState } from "react";
import Button from "../../components/Button";
import Dependent from "../../models/Dependent";
import Member from "../../models/Member";
import Plan from "../../models/Plan";

type ConfirmationProps = {
  member: Member;
  selectedPlans: Plan[];
  associatedPlan: Plan;
  dependents: Dependent[];
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const Confirmation: FC<ConfirmationProps> = ({
  member,
  selectedPlans,
  associatedPlan,
  dependents,
  setStep,
}: ConfirmationProps) => {
  const [memberAccordionOpen, setMemberAccordionOpen] = useState<Boolean>();
  const [dependentsAccordionsOpen, setDependentsAccordionsOpen] = useState<
    Dependent[]
  >([]);
  const [dependentsArray, setDependentsArray] =
    useState<Dependent[]>(dependents);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    setDependentsArray(dependents);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setDependentsArray(dependents);
    let value = 0;
    [...selectedPlans, associatedPlan].forEach((plan) => {
      if (plan?.rate) {
        value = value + plan?.rate;
      }
    });
    setTotalValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlans]);
  return (
    <div className="xl:pt-17 flex min-h-[70vh] w-full flex-col px-2 py-2">
      <div className="mb-4 flex w-full items-center justify-center self-start rounded-[32px] border-4 border-celadonBlue bg-backgroundSolidGrey p-4 text-center">
        <h1 className="flex flex-row items-center justify-center gap-4 text-[32px] font-bold text-navyBlue">
          Overview
        </h1>
      </div>
      <div className="flex w-full flex-col rounded-[32px] border-4 border-celadonBlue bg-backgroundSolidGrey p-4 xl:px-16 xl:pt-12">
        <div className="grid grid-cols-1 gap-8 text-xl md:grid-cols-4 md:gap-y-4 md:gap-x-20">
          <div className="flex flex-col xl:max-w-[260px]">
            <div className="font-bold text-celadonBlue">Member</div>
            <div>{member.firstName}</div>
            <div> {member.lastName}</div>
          </div>
          <div className="flex flex-col xl:max-w-[260px]">
            <div className="font-bold text-celadonBlue">Date of Birth</div>
            <div>{member.dateOfBirth}</div>
          </div>
          <div className="flex flex-col xl:max-w-[260px]">
            <div className="font-bold text-celadonBlue">Gender</div>
            <div>{member.gender === "M" ? "Male" : "Female"}</div>
          </div>
          <div className="flex flex-col xl:max-w-[260px]">
            <div className="font-bold text-celadonBlue">Address</div>
            <div>
              {member.address1} {member.address2}
            </div>
          </div>
          {dependentsArray?.map((dependent) => {
            return (
              <>
                <div className="flex flex-col xl:max-w-[260px]">
                  <div className="font-bold text-celadonBlue">
                    {dependent.relationship}
                  </div>
                  <div>{dependent.firstName}</div>
                  <div> {dependent.lastName}</div>
                </div>
                <div className="flex flex-col xl:max-w-[260px]">
                  <div className="font-bold text-celadonBlue">
                    Date of Birth
                  </div>
                  <div>{dependent.dateOfBirth}</div>
                </div>
                <div className="flex flex-col xl:max-w-[260px]">
                  <div className="font-bold text-celadonBlue">Gender</div>
                  <div>{dependent.gender === "M" ? "Male" : "Female"}</div>
                </div>
                <div className="flex flex-col xl:max-w-[260px]">
                  <div className="hidden font-bold text-celadonBlue">
                    Address
                  </div>
                </div>
                <div className="my-4 block h-[2px] w-full bg-navyBlue md:hidden" />
              </>
            );
          })}
        </div>
        <div className="sticky bottom-[5.5rem] z-[50] flex w-full flex-col bg-backgroundSolidGrey pb-2">
          <div className="my-4 h-[2px] w-full bg-navyBlue" />

          <div className="flex flex-col items-center justify-center xl:flex-row xl:items-start xl:justify-start">
            <div className="flex items-center justify-center gap-4 md:flex-col md:items-start md:justify-start md:gap-0">
              <div className="flex flex-row sm:basis-1/2">
                <div className="text-2xl font-bold">Total Monthly Cost</div>
              </div>
              <div className="text-2xl font-bold text-navyBlue sm:mb-4 sm:basis-1/2">
                ${totalValue}/mo
              </div>
            </div>
            <div className="my-4 h-[52px] w-[176px] md:my-0 xl:ml-16">
              <Button
                text={"Confirm"}
                action={() => setStep((current) => current + 1)}
                mainPath
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 pt-4 md:flex-row md:items-start  md:justify-start">
          {[...selectedPlans, associatedPlan]?.map((plan, index) => {
            if (!plan?.id) return null;
            return (
              <div className="flex items-center justify-center lg:block">
                <div className="flex flex-row items-center gap-3 md:basis-1/2">
                  <img
                    className={`h-[45px] w-[90px] ${index === 2 && "hidden"}`}
                    src={index === 0 ? "/ncd-logo.png" : "/vsp.png"}
                    alt=""
                  />
                  {index === 2 && (
                    <div className="hidden h-[45px] w-[90px] lg:block xl:w-0"></div>
                  )}
                  <div>
                    <div className="text-base font-normal">{plan.label}</div>
                    <div className="text-base font-bold text-navyBlue">
                      ${plan.rate}/mo
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* <div className="grid w-full grid-cols-1 py-8 lg:grid-cols-2">
        <div className="grid grid-rows-1 border-4 border-lightBlue bg-white bg-opacity-80">
          <div className="row-span-1 flex w-full flex-col p-4 lg:p-8">
            <div className="flex flex-row gap-6 pt-4 text-navyBlue">
              {selectedPlans?.map((plan, index) => {
                if (!plan?.id) return null;
                return (
                  <>
                    <div>
                      <div className="flex flex-row">
                        <img
                          className="h-12 w-12"
                          src={index === 0 ? "/dental.png" : "/vision.png"}
                          alt=""
                        />
                        <div className="text-xl font-bold lg:text-3xl">
                          {plan.label}
                        </div>
                      </div>
                      <div className="my-4 text-2xl lg:text-4xl">
                        ${plan.rate}/mo
                      </div>
                    </div>
                    {index === 0 && (
                      <div className="h-44 w-px border-r border-orange" />
                    )}
                  </>
                );
              })}
            </div>
            <div className="max-h-[120px] overflow-y-auto lg:max-h-[300px]">
              <div className="mb-8 text-2xl font-semibold text-navyBlue lg:text-4xl">
                COVERING
              </div>
              <div>
                <div
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => {
                    setMemberAccordionOpen(!memberAccordionOpen);
                  }}
                >
                  {memberAccordionOpen ? "+ " : "- "}
                  <span className="text-lg text-lightBlue underline lg:text-2xl">
                    {member.firstName} {member.lastName}
                  </span>
                  <div
                    className={`mt-3 pl-3 text-base text-navyBlue lg:text-lg ${
                      memberAccordionOpen ? "hidden" : "block"
                    }`}
                  >
                    <div>{member.dateOfBirth}</div>
                    <div>{member.gender}</div>
                    <div>
                      {member.address1} {member.address2}
                    </div>
                  </div>
                </div>
              </div>
              {dependentsArray?.map((dependent) => {
                return (
                  <div>
                    <div
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => {
                        if (!dependentsAccordionsOpen.includes(dependent)) {
                          setDependentsAccordionsOpen((current) =>
                            current.concat([dependent])
                          );
                        } else {
                          setDependentsAccordionsOpen((current) =>
                            current.filter((element) => element !== dependent)
                          );
                        }
                      }}
                    >
                      {!dependentsAccordionsOpen.includes(dependent)
                        ? "+ "
                        : "- "}
                      <span className="text-lg text-lightBlue underline lg:text-2xl">
                        {dependent.firstName} {dependent.lastName}
                      </span>
                      <div
                        className={`mt-3 pl-3 text-base text-navyBlue lg:text-lg ${
                          !dependentsAccordionsOpen.includes(dependent)
                            ? "hidden"
                            : "block"
                        }`}
                      >
                        <div>{dependent.dateOfBirth}</div>
                        <div>{dependent.gender}</div>
                        <div>{dependent.relationship}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-row justify-between">
              <div className="h-[40px] w-[130px] text-lg font-bold">
                <Button
                  text="CONTINUE"
                  action={() => setStep((current) => current + 1)}
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Confirmation;
