import React, { FC, useState, useContext } from "react";
import Opportunity from "../../Models/Opportunity";
import { AuthContext } from "../../auth";
import TextPill from "../TextPill";
import PriorDeleteModal from "../DeleteModals/PriorDeleteModal";
import ConfirmedDeletedModal from "../DeleteModals/ConfirmedDeletedModal";
import { PaginationItems } from "../../Models/Utils/paginationItems";

type OpportunityListProps = {
	opportunityList: Opportunity[];
	setOpportunitiesPerPage: React.Dispatch<
		React.SetStateAction<PaginationItems>
	>;
	setTotalOpportunities: React.Dispatch<React.SetStateAction<number>>;
	totalOpportunities: number;
	opportunitiesPerPage: PaginationItems;
};

const OpportunityList: FC<OpportunityListProps> = ({
	opportunityList,
	setOpportunitiesPerPage,
	opportunitiesPerPage,
	setTotalOpportunities,
	totalOpportunities,
}: OpportunityListProps) => {
	const [activeDeleteModal, setActiveDeleteModal] = useState(false);
	const [activeConfirmedDeleteModal, setActiveConfirmedDeleteModal] =
		useState(false);
	const [deleted, setDeleted] = useState<Opportunity[]>([]);
	const { token } = useContext(AuthContext);
	const DeleteOpportunityFunction = (key: number, opportunity: Opportunity) => {
		opportunityList.splice(key, 1);
		opportunity.delete(token).then((response) => {
			if (response) {
				setDeleted((currentlyDeleted) => [...currentlyDeleted, opportunity]);
				setOpportunitiesPerPage({
					toItem: opportunitiesPerPage.toItem - 1,
					fromItem: opportunitiesPerPage.fromItem,
					totalPages: opportunitiesPerPage.totalPages,
				});
				setTotalOpportunities(totalOpportunities - 1);
				setActiveDeleteModal(false);
				setActiveConfirmedDeleteModal(true);
			}
		});
	};

	return (
		<div className="flex w-full">
			<div className="flex flex-col mt-[5px] w-full">
				<div className="flex w-full justify-between text-[12px] leading-[24px] font-semibold border-b border-gray-1 pb-[8px]">
					<div className="flex justify-between w-[35%] min-w-[150px]">
						<div className="">TITLE</div>
					</div>
					<div className="flex justify-between w-[15%] min-w-[120px] text-right">
						<div className="ml-[12px]">STATUS</div>
						<div className="mr-1">ACTION</div>
					</div>
				</div>

				{opportunityList?.map((opportunity: Opportunity, key) => (
					<>
						<PriorDeleteModal
							instanceToDelete="opportunity"
							active={activeDeleteModal}
							deleteFunction={() => DeleteOpportunityFunction(key, opportunity)}
							setActiveDeleteModal={() => setActiveDeleteModal(false)}
						/>
						<ConfirmedDeletedModal
							instanceToDelete="Opportunity"
							active={activeConfirmedDeleteModal}
							setActiveConfirmedDeleteModal={() =>
								setActiveConfirmedDeleteModal(false)
							}
						/>
						{!deleted.includes(opportunity) && (
							<div
								className="flex justify-between border-b border-gray-1 py-[6px]"
								key={key}
							>
								<div className="flex justify-between w-[35%] text-[14px] leading-[24px]">
									<a
										href={`/opportunity/${opportunity.id}`}
										className="mr-[7px]"
									>
										{opportunity.title}
									</a>
								</div>
								<div className="flex justify-between w-[15%] min-w-[140px] ">
									<TextPill
										text="ACTIVE"
										color="#B2C290"
										textSize="14px"
										textColor="#FFFFFF"
									/>
									<div className="flex gap-[6px]">
										<img
											onClick={() => {
												setActiveDeleteModal(true);
											}}
											className="cursor-pointer h-[24px] w-[24px]"
											src="./assets/carbon_trash-can.svg"
										></img>
									</div>
								</div>
							</div>
						)}
					</>
				))}
			</div>
		</div>
	);
};

export default OpportunityList;
