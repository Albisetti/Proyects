import React, { FC, useEffect, useState } from "react";
import PlanDetail from "../../components/PlanDetail";
import Plan from "../../models/Plan";

type SelectPlanProps = {
  plansProp?: Plan[];
  associationPlans?: Plan[];
  type?: string;
  getAvailablePlans?: () => Promise<void>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setSelectedPlan: React.Dispatch<React.SetStateAction<Plan>>;
  setSelectedPlanVision: React.Dispatch<React.SetStateAction<Plan>>;
  wantsVision: boolean;
  visionPlans?: Plan[];
};

const SelectPlan: FC<SelectPlanProps> = ({
  plansProp,
  associationPlans,
  getAvailablePlans,
  type,
  setStep,
  setSelectedPlan,
  setSelectedPlanVision,
  wantsVision,
  visionPlans,
}: SelectPlanProps) => {
  const [fullView, setFullView] = useState(false);
  const [plans, setPlans] = useState<Plan[] | undefined>(plansProp);

  useEffect(() => {
    if (getAvailablePlans) getAvailablePlans();
    setPlans(plansProp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plansProp]);

  return (
    <div className="xl:pt-17 flex min-h-[70vh] w-full flex-col px-2 py-2">
      <div className="mb-4 flex w-full items-center justify-center self-start rounded-[32px] border-4 border-celadonBlue bg-backgroundSolidGrey p-4 text-center">
        <h1 className="flex flex-row items-center justify-center gap-4 text-[32px] font-bold text-navyBlue">
          Please Select a {type} Plan
        </h1>
      </div>
      <div className="mt-[27px] flex flex-col items-center gap-[34px] self-center lg:flex-row">
        {plans?.map((plan) => {
          return (
            <PlanDetail
              key={plan.id}
              plan={plan}
              associationPlans={associationPlans}
              setSelectedPlan={setSelectedPlan}
              setStep={() => setStep((current) => current + 1)}
              selectable
              setFullView={setFullView}
              fullView={fullView}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SelectPlan;
