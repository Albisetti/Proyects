import React, { FC } from "react";
import cx from "classnames";

type CreateOpportunityDetailsProps = {
	step: number;
	opportunityData: {
		name?: string | undefined;
		description?: string | undefined;
		startDate?: Date | undefined;
		closeDate?: Date | undefined;
		country?: string[] | undefined;
	};
};

const CreateOpportunityDetails: FC<CreateOpportunityDetailsProps> = ({
	step,
	opportunityData,
}: CreateOpportunityDetailsProps) => {
	const dateFormat = (date: string) => {
		const formattedDate =
			date.substring(8, date.length - 14) +
			"/" +
			date.substring(5, date.length - 17) +
			"/" +
			date.substring(0, date.length - 20);

		return formattedDate;
	};

	return (
		<div className={cx(step >= 2 ? "flex" : "hidden")}>
			<div className="lg:w-[414px] h-[188px] z-[60] shadow-lg shadow-grey rounded-md  font-roboto text-[18px] text-gray bg-white pt-2 relative px-[20px]">
				<div className="text-[16px] leading-9 font-normal">
					{opportunityData.name}
				</div>
				<div className="text-[12px] max-h-[88px] overflow-hidden mb-3">
					{opportunityData.description}
				</div>
				<div className="flex justify-between text-[12px]">
					<div className="grid grid-cols-2">
						<div className="flex ">
							<div className="">
								{opportunityData.startDate &&
									dateFormat(opportunityData.startDate?.toISOString())}
							</div>
							<div
								className={`${
									opportunityData.closeDate != undefined ? "block " : "hidden"
								} ml-[3px]`}
							>
								{" - " +
									(opportunityData.closeDate &&
										dateFormat(opportunityData.closeDate?.toISOString()))}
							</div>
						</div>
						<div className="ml-6">
							{opportunityData.country && opportunityData.country.join(", ")}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreateOpportunityDetails;
