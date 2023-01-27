/* eslint-disable indent */
import React, { FC } from "react";
import { useContext } from "react";
import { AuthContext } from "../../auth";

type WizardProgressBarProps = {
	step: number;
	totalSteps: string[];
};

const WizardProgressBar: FC<WizardProgressBarProps> = ({
	step,
	totalSteps,
}: WizardProgressBarProps) => {
	const { user } = useContext(AuthContext);

	return (
		<div className="relative min-w-[590px] min-h-[80px]">
			{[...Array(totalSteps.length + 2)].map((_, index) => {
				const conditionalStyling =
					step > index + 1
						? "bg-darkRed"
						: step === index + 1
						? "bg-brightRed"
						: "";
				return (
					<>
						<div
							style={{ left: index === 0 ? "0rem" : 9 * index + "rem" }}
							className={` absolute left-1 top-1 hover:scale-[1.20] transition-all duration-300 rounded-full w-[16px] h-[16px] cursor-pointer ${conditionalStyling}`}
						/>
						<div
							style={{ left: index === 0 ? "0rem" : 9 * index + "rem" }}
							className="absolute top-4 -translate-x-[33%] mt-[15px]"
						>
							{index === 0 && "Setup"}
							{index === 1 && "Specifications"}
							{ user?.roles?.includes("Super Admin") && index === 2 && "Connect Members"}
						</div>
						<div
							style={{ left: index === 0 ? "0rem" : 9 * index + "rem" }}
							className={`absolute top-[0.68rem] h-[3px] transition-all duration-300 ${
								step <= index + 1
									? "w-[0px] bg-brightRed"
									: "bg-darkRed w-[155px]"
							}`}
						/>
					</>
				);
			})}
		</div>
	);
};

export default WizardProgressBar;
