import React, { FC, useEffect, useState } from "react";
import Button from "../../components/Button";
import PlanDetail from "../../components/PlanDetail";
import Plan from "../../models/Plan";
import { VSPextra, VSPPreferredByMetLife } from "../../utils";

type ConfirmCartProps = {
  selectedPlans: Plan[];
  associationPlans?: Plan[];
  associatedPlan?: Plan;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const ConfirmCart: FC<ConfirmCartProps> = ({
  selectedPlans,
  associatedPlan,
  setStep,
}: ConfirmCartProps) => {
  const [totalValue, setTotalValue] = useState(0);
  const [fullView, setFullView] = useState(false);

  useEffect(() => {
    let value = 0;
    selectedPlans.forEach((plan) => {
      if (plan?.rate) {
        value = value + plan?.rate;
      }
    });
    setTotalValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlans]);

  return (
    <div className="xl:pt-17 flex min-h-[70vh] w-full flex-col px-2 py-2">
      <div className="mb-4 flex w-full items-center justify-center self-start rounded-[32px] border-4 border-celadonBlue bg-backgroundSolidGrey py-4 text-center">
        <h1 className="flex flex-row items-center justify-center gap-4 text-[32px] font-bold text-navyBlue">
          Quote
        </h1>
      </div>
      <div className="sticky top-2 z-50 mb-4 flex w-[300px] flex-col items-center justify-between gap-5  self-start rounded-[32px] border-4 border-celadonBlue bg-backgroundSolidGrey py-[30px] px-[40px] text-center md:top-24  md:w-[300px] xl:w-full xl:flex-row">
        <div className="flex text-start md:flex-col">
          <div className="mb-1 text-xl font-medium text-navyBlue">
            Total Monthly Cost
          </div>{" "}
          <div className="self-start text-xl font-bold text-navyBlue">
            $
            {associatedPlan?.rate
              ? totalValue + associatedPlan?.rate
              : totalValue}
            /MO
          </div>
        </div>
        <a
          href="https://www.ncd.com/aboutNWFA"
          target="_blank"
          rel="noreferrer"
          className="hidden max-w-[224px] text-start text-xl font-bold text-celadonBlue md:block"
        >
          View More About Your NWFA Benefits
        </a>
        <div className="h-[53px] max-h-[53px] w-[250px] max-w-[250x] font-inter text-xl font-bold">
          <Button
            text="Begin Application"
            action={() => setStep((current) => current + 1)}
            mainPath
          />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="grid max-w-[775px] grid-cols-1 gap-4 lg:gap-[75px] xl:grid-cols-2">
          {selectedPlans.map((plan) => {
            if (!plan?.id) return null;
            if (
              (plan.id === VSPPreferredByMetLife || plan.id === VSPextra) &&
              associatedPlan?.rate
            ) {
              return (
                <PlanDetail
                  plan={plan}
                  associationPlans={[associatedPlan!]}
                  setStep={() => {}}
                  selectable={false}
                  associatedPlan={associatedPlan}
                  numberOfSelectedPlans={
                    selectedPlans.filter((plan) => plan.id !== undefined).length
                  }
                  fullView={fullView}
                  setFullView={setFullView}
                />
              );
            } else {
              return (
                <PlanDetail
                  plan={plan}
                  associationPlans={[associatedPlan!]}
                  setStep={() => {}}
                  selectable={false}
                  fullView={fullView}
                  setFullView={setFullView}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default ConfirmCart;
