import React, { FC, useEffect, useState } from "react";
import Button from "../../Button";

type AmountOfPeopleCardProps = {
  text: string;
  url: string;
  amountOfDependents: number;
  setAmountOfDependents: React.Dispatch<React.SetStateAction<number>>;
  setAmountOfDependentsType: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  removeSteps?: () => void;
};

const AmountOfPeopleCard: FC<AmountOfPeopleCardProps> = ({
  url,
  text,
  amountOfDependents,
  setAmountOfDependents,
  setAmountOfDependentsType,
  setStep,
  removeSteps,
}: AmountOfPeopleCardProps) => {
  const [currentAmount, setCurrentAmount] = useState(amountOfDependents);
  useEffect(() => {
    switch (text) {
      case "Member":
        return setCurrentAmount(0);
      case "Member plus Spouse":
        return setCurrentAmount(1);
      case "Member + 1":
        return setCurrentAmount(1);
      case "Member plus Children":
        return setCurrentAmount(1);
      case "Family":
        return setCurrentAmount(2);
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex max-h-[228px] max-w-[228px] flex-col items-center justify-center rounded-lg border border-white bg-white px-[50px] pt-[20px] pb-[18px] shadow-lg">
      <img className="h-[106px]" src={url} alt="Member" />
      <p className="whitespace-nowrap pt-4 pb-2 text-base font-bold text-black">
        {text}
      </p>
      <div className="h-[43px] w-[129px] text-xl">
        <Button
          text="Submit"
          action={() => {
            if (text === "Member" && removeSteps) removeSteps();
            setAmountOfDependentsType(text);
            setAmountOfDependents(currentAmount);
            setStep((current) => current + 1);
          }}
          mainPath
        />
      </div>
    </div>
    // <div className="flex flex-col items-center justify-center">
    //   <div className="flex flex-row items-center justify-center">
    //     <div
    //       className="text-6xl text-navyBlue cursor-pointer font-bold"
    //       onClick={() => {
    //         setCurrentAmount((current) =>
    //           current > 0 ? current - 1 : current
    //         );
    //       }}
    //     >
    //       -
    //     </div>
    //     <div className="flex w-[240px] h-[60px] m-3 bg-lightBlue hover:bg-navyBlue items-center justify-center text-center text-4xl font-bold text-white cursor-pointer rounded-full">
    //       {currentAmount}
    //     </div>
    //     <div
    //       className="text-6xl text-navyBlue cursor-pointer font-bold"
    //       onClick={() => {
    //         setCurrentAmount((current) => current + 1);
    //       }}
    //     >
    //       +
    //     </div>
    //   </div>
    //   <div className="flex flex-row gap-64 justify-between">
    //     <div className="w-[150px] h-[40px] mr-6">
    //       <Button
    //         text="Back"
    //         action={() => setStep((current) => current - 1)}
    //       />
    //     </div>
    //     <div className="w-[150px] h-[40px] mr-6">

    //     </div>
    //   </div>
    // </div>
  );
};

export default AmountOfPeopleCard;
