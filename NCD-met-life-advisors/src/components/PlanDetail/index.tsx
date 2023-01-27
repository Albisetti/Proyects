import React, { FC, useEffect, useState } from "react";
import Plan from "../../models/Plan";
import {
  NCDCompleteByMetLife,
  NCDCompleteByMetLifeNYCT,
  NCDEssentialsByMetLife,
  NCDEssentialsByMetLifeNYCT,
  NCDValueByMetLife,
  NCDValueByMetLifeNYCT,
  VSPextra,
  VSPPreferredByMetLife,
} from "../../utils";
import Button from "../Button";

type PlanDetailProps = {
  plan: Plan;
  associationPlans?: Plan[];
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setSelectedPlan?: React.Dispatch<React.SetStateAction<Plan>>;
  selectable: boolean;
  fullView?: boolean;
  setFullView?: React.Dispatch<React.SetStateAction<boolean>>;
  associatedPlan?: Plan;
  numberOfSelectedPlans?: number;
};

const PlanDetail: FC<PlanDetailProps> = ({
  plan,
  associationPlans,
  setStep,
  setSelectedPlan,
  selectable,
  fullView = false,
  setFullView,
  associatedPlan,
  numberOfSelectedPlans,
}: PlanDetailProps) => {
  const [associationFee, setAssociationFee] = useState<number | undefined>();

  function getAssociationFee() {
    associationPlans?.forEach((associationPlan) => {
      if (
        associationPlan.id === 38450 &&
        (plan.id === NCDEssentialsByMetLife ||
          plan.id === NCDCompleteByMetLife ||
          plan.id === NCDEssentialsByMetLifeNYCT ||
          plan.id === NCDCompleteByMetLifeNYCT)
      ) {
        setAssociationFee(associationPlan.rate);
      }
      if (
        associationPlan.id === 38941 &&
        (plan.id === NCDEssentialsByMetLife ||
          plan.id === VSPPreferredByMetLife ||
          plan.id === NCDCompleteByMetLife ||
          plan.id === NCDEssentialsByMetLifeNYCT ||
          NCDCompleteByMetLifeNYCT)
      ) {
        setAssociationFee(associationPlan.rate);
      }
      if (
        (plan.id === NCDValueByMetLife || plan.id === NCDValueByMetLifeNYCT) &&
        associationPlan.id === 38449
      ) {
        setAssociationFee(associationPlan.rate);
      }
      if (plan.id === VSPPreferredByMetLife && associationPlan.id === 38923) {
        setAssociationFee(associationPlan.rate);
      }
      if (
        (plan.id === VSPPreferredByMetLife ||
          plan.id === NCDValueByMetLife ||
          plan.id === NCDValueByMetLifeNYCT) &&
        associationPlan.id === 38928
      ) {
        setAssociationFee(associationPlan.rate);
      }
    });
  }

  useEffect(() => {
    getAssociationFee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

  return (
    <div
      className={`relative flex h-full min-h-[593px] w-[300px] flex-col  rounded-[32px] border-4 ${
        selectable && plan?.id === NCDCompleteByMetLife
          ? "border-orange"
          : "border-celadonBlue"
      } bg-backgroundSolidGrey px-6 py-4 md:w-[300px] lg:py-8 lg:px-6 xl:w-[350px] xl:px-12`}
    >
      {selectable && plan?.id === NCDCompleteByMetLife && (
        <div className="ribbon ribbon-top-left z-50">
          <span className="text">best value!</span>
        </div>
        // <div className="absolute top-5 -left-8 z-50 w-[130px] -rotate-45 bg-navyBlue text-center font-bold text-orange">
        //   Best Value
        // </div>
      )}
      <div
        className={`${
          selectable && "sticky"
        } top-[4.8rem] z-40 flex w-full flex-col items-center justify-center gap-7 bg-backgroundSolidGrey`}
      >
        <img
          src={
            plan.label !== "VSP Preferred Plan by NCD" &&
            plan.label !== "NCD - Vision FL & OR & NY"
              ? "/ncd-logo.png"
              : "/vsp.png"
          }
          className="mt-1 max-h-[54px] max-w-[107px]"
          alt="NCD Logo"
        />
        {selectable && (
          <div className="mb-1 h-[53px] w-[248px] text-[20px] font-bold">
            <Button
              text="Select"
              action={() => {
                if (setSelectedPlan) {
                  setSelectedPlan(plan);
                }
                setStep((current) => current);
              }}
              mainPath
            />
          </div>
        )}
      </div>
      {!fullView && (
        <div>
          <div className="text-md pt-8 text-2xl font-bold text-navyBlue">
            {plan.label}
          </div>
          <div className="pt-11 text-2xl">
            <div className="text-2xl">
              {plan.label === "NCD Value by MetLife" && (
                <>
                  <p className="font-normal">Calendar Year Maximum</p>
                  <p className="font-bold text-navyBlue">$750</p>
                </>
              )}
              {plan.label === "NCD Essentials by MetLife" && (
                <>
                  <p className="font-normal">Calendar Year Maximum</p>
                  <p className="font-bold text-navyBlue">$2,000</p>
                </>
              )}
              {plan.label === "NCD Complete by MetLife" && (
                <>
                  <p className="font-normal">Calendar Year Maximum</p>
                  <p className="font-bold text-navyBlue">$10,000</p>
                </>
              )}
              {(plan?.id === VSPPreferredByMetLife ||
                plan?.id === VSPextra) && (
                <>
                  <p className="invisible font-normal">Calendar Year Maximum</p>
                  <p className="invisible font-bold text-navyBlue">$10,000</p>
                </>
              )}
            </div>
            {plan?.id !== VSPPreferredByMetLife && plan?.id !== VSPextra ? (
              <>
                <div className="pt-4 font-normal text-black">Total </div>
                <div className="font-bold text-navyBlue">
                  $
                  {plan?.rate && associationFee
                    ? associationFee + plan?.rate
                    : null}
                  /mo
                </div>
              </>
            ) : (
              <>
                <div className="pt-4 font-normal text-black">Total </div>
                <div className="font-bold text-navyBlue">
                  $
                  {plan?.rate &&
                  associatedPlan?.rate &&
                  numberOfSelectedPlans === 1
                    ? plan?.rate + associatedPlan?.rate
                    : plan?.rate}
                  /mo
                </div>
              </>
            )}
          </div>

          <div className="pt-4 text-2xl font-bold text-navyBlue">
            {plan.label === "NCD Value by MetLife" && (
              <>
                <p className="invisible">No Waiting Period</p>
              </>
            )}
            {plan?.id !== VSPPreferredByMetLife && plan?.id !== VSPextra && (
              <>
                <p className="invisible">No Waiting Period</p>
              </>
            )}
            {(plan?.id === VSPPreferredByMetLife || plan?.id === VSPextra) && (
              <>
                <p className="invisible pt-7">No Waiting Period</p>
              </>
            )}
            {plan.label === "NCD Essentials by MetLife" && (
              <>
                <p>No Waiting Period</p>
              </>
            )}
            {plan.label === "NCD Complete by MetLife" && (
              <>
                <p>No Waiting Period</p>
              </>
            )}
          </div>
          <div
            className="cursor-pointer pt-[34px] text-center text-2xl font-bold text-celadonBlue hover:text-navyBlue"
            onClick={() => {
              setFullView && setFullView(!fullView);
            }}
          >
            View Details
          </div>
        </div>
      )}
      {fullView && (
        <div className="w-full">
          <div className="text-md pt-8 text-2xl font-bold text-navyBlue">
            {plan.label}
          </div>
          <div className="pt-11 text-2xl">
            {plan?.id !== VSPPreferredByMetLife && plan?.id !== VSPextra ? (
              <>
                <div className="font-normal text-black">Total </div>
                <div className="font-bold text-navyBlue">
                  $
                  {plan?.rate && associationFee
                    ? associationFee + plan?.rate
                    : null}
                  /mo
                </div>
              </>
            ) : (
              <>
                <div className="font-normal text-black">Total </div>
                <div className="font-bold text-navyBlue">
                  $
                  {plan?.rate &&
                  associatedPlan?.rate &&
                  numberOfSelectedPlans === 1
                    ? plan?.rate + associatedPlan?.rate
                    : plan?.rate}
                  /mo
                </div>
              </>
            )}
          </div>
          <div className="my-4 h-[2px] w-full bg-navyBlue" />
          <div>
            <div className="text-base">
              {plan.label === "NCD Value by MetLife" &&
                "Calendar Year Deductible"}
              {plan.label === "NCD Essentials by MetLife" &&
                "Calendar Year Deductible"}
              {plan.label === "NCD Complete by MetLife" &&
                "Lifetime Deductible"}
              {(plan.label === "VSP Preferred Plan by NCD" ||
                plan.label === "NCD - Vision FL & OR & NY") &&
                "Copay"}
            </div>
            <div className="text-base text-navyBlue">
              {plan.label === "NCD Value by MetLife" && (
                <>
                  <p className="font-medium">Basic & Major Coverage</p>
                  <p className="font-bold"> $50</p>
                  <p className="invisible font-bold">
                    After Year 1: Vanishing Deductible
                  </p>
                </>
              )}
              {plan.label === "NCD Essentials by MetLife" && (
                <>
                  <p className="font-medium">Basic & Major Coverage</p>
                  <p className="font-bold"> $50</p>
                  <p className="invisible font-bold">
                    After Year 1: Vanishing Deductible
                  </p>
                </>
              )}
              {plan.label === "NCD Complete by MetLife" && (
                <>
                  <p className="font-medium">Basic & Major Coverage</p>{" "}
                  <p className="font-bold">Year 1: $100 </p>
                  <p className="font-bold">
                    After Year 1: Vanishing Deductible
                  </p>
                </>
              )}
              {(plan.label === "VSP Preferred Plan by NCD" ||
                plan.label === "NCD - Vision FL & OR & NY") && (
                <>
                  <p className="font-medium">
                    Every 12 months for WellVision Exam
                  </p>
                  <p className="font-bold"> $20</p>
                  <p className="invisible font-bold">
                    After Year 1: Vanishing Deductible
                  </p>
                </>
              )}
            </div>
            <div className="pt-4 text-base">
              {plan.label === "NCD Value by MetLife" && (
                <>
                  <p>Calendar Year Maximum</p>
                  <p className="font-medium text-navyBlue">
                    Applies to Type A, B, and C Services
                  </p>
                </>
              )}
              {plan.label === "NCD Essentials by MetLife" && (
                <>
                  <p>Calendar Year Maximum</p>
                  <p className="font-medium text-navyBlue">
                    Applies to Type A, B, and C Services
                  </p>
                </>
              )}
              {plan.label === "NCD Complete by MetLife" && (
                <>
                  <p>Calendar Year Maximum</p>
                  <p className="font-medium text-navyBlue">
                    Applies to Type A, B, and C Services
                  </p>
                </>
              )}
              {(plan.label === "VSP Preferred Plan by NCD" ||
                plan.label === "NCD - Vision FL & OR & NY") && (
                <>
                  <p>Frame</p>
                  <p className="font-medium text-navyBlue">
                    Allowance for wide selection
                  </p>
                </>
              )}
            </div>
            <div className="font-bold text-navyBlue">
              {(plan.label === "VSP Preferred Plan by NCD" ||
                plan.label === "NCD - Vision FL & OR & NY") &&
                "$200"}
              {plan.label === "NCD Value by MetLife" && "$750"}
              {plan.label === "NCD Essentials by MetLife" && "$2,000"}
              {plan.label === "NCD Complete by MetLife" && "$10,000"}
            </div>
            <div className="mt-6 h-[2px] w-full bg-navyBlue" />
            <div className="my-4 gap-6">
              <div>
                {plan.label !== "VSP Preferred Plan by NCD" &&
                plan.label !== "NCD - Vision FL & OR & NY"
                  ? "Preventive (Type A)"
                  : "Lenses"}
              </div>
              <div className="font-bold text-navyBlue">
                {plan.label !== "VSP Preferred Plan by NCD" &&
                plan.label !== "NCD - Vision FL & OR & NY" ? (
                  "100%"
                ) : (
                  <>
                    <p>Single Vision</p> <p>Lined Bifocal</p>
                    <p>Lined Trifocal Lenses</p>
                  </>
                )}
              </div>
              <div className="mt-7">
                {plan.label !== "VSP Preferred Plan by NCD" &&
                plan.label !== "NCD - Vision FL & OR & NY"
                  ? "Basic (Type B)"
                  : "Contacts"}
              </div>
              <div>
                {plan.id === NCDValueByMetLife && (
                  <div className="font-bold text-navyBlue">
                    <p>Year 1: 50%</p>
                    <p>Year 2: 65%</p>
                    <p>Year 3: 80%</p>
                  </div>
                )}
                {plan.id === NCDValueByMetLifeNYCT && (
                  <div className="font-bold text-navyBlue">
                    <p>Year 1: 50%</p>
                    <p>Year 2: 75%</p>
                    <p>Year 3: 90%</p>
                  </div>
                )}
                {plan.id === NCDEssentialsByMetLife && (
                  <div className="font-bold text-navyBlue">
                    <p>Year 1: 50%</p>
                    <p>Year 2: 65%</p>
                    <p>Year 3: 80%</p>
                  </div>
                )}
                {plan.id === NCDCompleteByMetLife && (
                  <div className="font-bold text-navyBlue">
                    <p>Year 1: 50%</p>
                    <p>Year 2: 65%</p>
                    <p>Year 3: 80%</p>
                  </div>
                )}
                {(plan.id === NCDCompleteByMetLifeNYCT ||
                  plan.id === NCDEssentialsByMetLifeNYCT) && (
                  <div className="font-bold text-navyBlue">
                    <p>Year 1: 80%</p>
                    <p>Year 2: 80%</p>
                    <p>Year 3: 90%</p>
                  </div>
                )}
                {(plan.label === "VSP Preferred Plan by NCD" ||
                  plan.label === "NCD - Vision FL & OR & NY") && (
                  <>
                    <p className="font-medium text-navyBlue">
                      {" "}
                      Allowance for contacts
                    </p>
                    <p className="font-bold text-navyBlue">$150</p>
                  </>
                )}
              </div>
              <div className="mt-5">
                {plan.label !== "VSP Preferred Plan by NCD" &&
                plan.label !== "NCD - Vision FL & OR & NY"
                  ? "Major (Type C)"
                  : "Out of Network Providers"}
              </div>
              <div>
                {plan.id === NCDValueByMetLife && (
                  <div className="font-bold text-navyBlue">
                    <p>Year 1: 0%</p>
                    <p>Year 2: 10%</p>
                    <p>Year 3: 15%</p>
                  </div>
                )}
                {plan.id === NCDValueByMetLifeNYCT && (
                  <div className="font-bold text-navyBlue">
                    <p>Year 1: 0%</p>
                    <p>Year 2: 0%</p>
                    <p>Year 3: 0%</p>
                  </div>
                )}
                {plan.id === NCDEssentialsByMetLife && (
                  <div className="font-bold text-navyBlue">
                    <p>Year 1: 10%</p>
                    <p>Year 2: 50%</p>
                    <p>Year 3: 60%</p>
                  </div>
                )}
                {plan.id === NCDCompleteByMetLife && (
                  <div className="font-bold text-navyBlue">
                    <p>Year 1: 10%</p>
                    <p>Year 2: 50%</p>
                    <p>Year 3: 60%</p>
                  </div>
                )}
                {(plan.id === NCDCompleteByMetLifeNYCT ||
                  plan.id === NCDEssentialsByMetLifeNYCT) && (
                  <div className="font-bold text-navyBlue">
                    <p>Year 1: 0%</p>
                    <p>Year 2: 50%</p>
                    <p>Year 3: 60%</p>
                  </div>
                )}
                {(plan.label === "VSP Preferred Plan by NCD" ||
                  plan.label === "NCD - Vision FL & OR & NY") && (
                  <div className="font-bold text-navyBlue">
                    <div>Exam: $45</div>
                    <div>Frame: $70</div>
                    <div>Contacts: $105</div>
                  </div>
                )}
              </div>
              <div className="pt-4 font-bold text-navyBlue">
                {plan.label === "NCD Value by MetLife" && (
                  <>
                    <p className="invisible">No Waiting Period</p>
                  </>
                )}
                {plan.label === "NCD Essentials by MetLife" && (
                  <>
                    <p>No Waiting Period</p>
                  </>
                )}
                {plan.label === "NCD Complete by MetLife" && (
                  <>
                    <p>No Waiting Period</p>
                  </>
                )}
              </div>
              <div className="my-4 h-[2px] w-full bg-navyBlue" />
              <div className="mt-6 flex flex-col gap-10">
                <a
                  className="font-bold text-blue"
                  href={
                    plan.label !== "VSP Preferred Plan by NCD" &&
                    plan.label !== "NCD - Vision FL & OR & NY"
                      ? `https://providers.online.metlife.com/findDentist?searchType=findDentistRetail&planType=DPPO`
                      : `https://www.vsp.com/eye-doctor`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  View a List of Providers
                </a>
                {(plan.label === "NCD Value by MetLife" ||
                  plan.label === "NCD Essentials by MetLife" ||
                  plan.label === "NCD Complete by MetLife" ||
                  plan.label === "VSP Preferred Plan by NCD") && (
                  <a
                    className="font-bold text-blue"
                    href={
                      plan.label === "NCD Complete by MetLife"
                        ? `https://metlife-files.s3.us-west-2.amazonaws.com/NCD_CompletePlans_10_2022-Member.pdf?download=false`
                        : plan.label === "NCD Essentials by MetLife"
                        ? `https://metlife-files.s3.us-west-2.amazonaws.com/NCD_EssentialPlan_10_2022-Member.pdf?download=false`
                        : plan.label === "NCD Value by MetLife"
                        ? `https://metlife-files.s3.us-west-2.amazonaws.com/NCD_ValuePlan_10_2022-Member.pdf?download=false`
                        : `https://metlife-files.s3.us-west-2.amazonaws.com/NCD+Vision-General+Brochure-Final-Compressed.pdf?download=false`
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Benefit Summary
                  </a>
                )}
                {plan.label === "NCD Value by MetLife" ||
                plan.label === "NCD Essentials by MetLife" ||
                plan.label === "NCD Complete by MetLife" ? (
                  <a
                    className="font-bold text-blue"
                    href={
                      plan.label === "NCD Complete by MetLife"
                        ? `https://metlife-files.s3.us-west-2.amazonaws.com/NCD+Complete+by+MetLife+-+more+info.pdf?download=false`
                        : plan.label === "NCD Essentials by MetLife"
                        ? `https://metlife-files.s3.us-west-2.amazonaws.com/NCD+Essentials+by+MetLife+-+more+info.pdf?download=false`
                        : `https://metlife-files.s3.us-west-2.amazonaws.com/NCD+Value+by+MetLife+-+more+info.pdf?download=false`
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Complete Plan Details
                  </a>
                ) : (
                  <div className="invisible font-bold text-blue">
                    View Complete Plan Details
                  </div>
                )}
                <div
                  className="cursor-pointer pt-[34px] text-center text-2xl font-bold text-celadonBlue hover:text-navyBlue"
                  onClick={() => {
                    setFullView && setFullView(!fullView);
                  }}
                >
                  Close Details
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanDetail;
