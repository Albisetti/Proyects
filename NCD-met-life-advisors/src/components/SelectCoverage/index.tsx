import React, { FC } from "react";

type SelectCoverageProps = {
  url?: string;
};

const SelectCoverage: FC<SelectCoverageProps> = ({
  url,
}: SelectCoverageProps) => {
  return (
    <div className="min-h-12 flex h-12 w-[460px] flex-row justify-center gap-4 rounded-lg bg-white py-2 shadow-2xl">
      <div className="flex flex-row justify-center">
        <input type="radio" value="dental" />
        <img src="/dental.png" alt="Dental" />
        <p>Dental</p>
      </div>
      <div className="flex flex-row justify-center">
        <input type="radio" value="vision" />
        <img src="/vision.png" alt="Dental" />
        <p>Vision</p>
      </div>
      <div className="flex flex-row justify-center">
        <input type="radio" value="vision" />
        <p>Both</p>
      </div>
    </div>
  );
};

export default SelectCoverage;
