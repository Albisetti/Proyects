import React, { FC } from "react";
import Specification from "../../Models/Specification";
type MembersForOpportunityCardProps = {
	step: number;
	membersWhoQualify: number;
	specificationTypeList: string[];
	selectedSpecification: Specification[];
};
const MembersForOpportunityCard: FC<MembersForOpportunityCardProps> = ({
	step,
	membersWhoQualify,
	specificationTypeList,
	selectedSpecification,
}: MembersForOpportunityCardProps) => {
	const getSpecificationNames = (type: string) => {
		let list = "";
		selectedSpecification
			.filter((field) => field.type === type)
			.map((spec) => (list += spec.name + ", "));
		list = list.slice(0, -2);
		return list;
	};
	return (
		<div
			className={`${
				step < 2 ? "hidden" : "block"
			} lg:w-[414px] shadow-lg shadow-grey rounded-md bg-white`}
		>
			<div className="py-9 px-6">
				<h1 className="text-4xl font-semibold text-brightRed">
					{membersWhoQualify}
				</h1>
				<h3 className="text-xl font-normal">
					members who qualify for this opportunity
				</h3>
				{specificationTypeList?.map((type) => {
					return selectedSpecification
						?.filter((specification) => specification?.type === type)
						?.map((spec: Specification, key) => {
							return (
								<div
									key={key}
									className="flex-wrap flex flex-col lg:flex-row gap-1 mt-1"
								>
									{key === 0 && (
										<div className="text-[14px] font-bold mt-3 basis-full">
											{type.toUpperCase()}
										</div>
									)}
									<div>{spec?.type === type && spec?.name}</div>
								</div>
							);
						});
				})}
			</div>
		</div>
	);
};

export default MembersForOpportunityCard;
