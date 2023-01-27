import React, { FC, useState, useContext } from "react";
import { PaginationItems } from "../../Models/Utils/paginationItems";
import CompanyMedia from "../../Models/CompanyMedia";
import PriorDeleteModal from "../DeleteModals/PriorDeleteModal";
import ConfirmedDeletedModal from "../DeleteModals/ConfirmedDeletedModal";
import { AuthContext } from "../../auth";

type companyMediaListProps = {
	setCompanyMediaList: React.Dispatch<React.SetStateAction<CompanyMedia[]>>; //TODO: test
	companyMediaList: CompanyMedia[];
	setCompanyMediasPerPage: React.Dispatch<
		React.SetStateAction<PaginationItems>
	>;
	mediaPerPage: PaginationItems;
	setTotalCompanyMedia: React.Dispatch<React.SetStateAction<number>>;
	totalCompanyMedias: number;
};

const CompanyMediaList: FC<companyMediaListProps> = ({
	setCompanyMediaList,
	companyMediaList,
	setCompanyMediasPerPage,
	mediaPerPage,
	setTotalCompanyMedia,
	totalCompanyMedias,
}: companyMediaListProps) => {
	const { token } = useContext(AuthContext);

	const [activeConfirmedDeleteModal, setActiveConfirmedDeleteModal] =
		useState(false);
	const [deleted, setDeleted] = useState<CompanyMedia[]>([]);
	const [editModalActive, setEditModalActive] = useState(false);
	const [activeDeleteModal, setActiveDeleteModal] = useState(false);

	const DeleteOpportunityFunction = (media: CompanyMedia) => {
		media.delete(token).then((response) => {
			if (response) {
				setCompanyMediaList(
					companyMediaList.filter((record) => {
						return record.id === media.id;
					})
				);
				setDeleted((currentlyDeleted) => [...currentlyDeleted, media]);
				setCompanyMediasPerPage({
					toItem: mediaPerPage.toItem - 1,
					fromItem: mediaPerPage.fromItem,
					totalPages: mediaPerPage.totalPages,
				});
				setTotalCompanyMedia(totalCompanyMedias - 1);
				setActiveDeleteModal(false);
				setActiveConfirmedDeleteModal(true);
			}
		});
	};

	return (
		<div className="flex w-full">
			<div className="flex flex-col mt-[5px] w-full">
				{companyMediaList?.map((companyMedia: CompanyMedia, key) => (
					<>
						<PriorDeleteModal
							instanceToDelete="media"
							active={activeDeleteModal}
							deleteFunction={() => DeleteOpportunityFunction(companyMedia)}
							setActiveDeleteModal={() => setActiveDeleteModal(false)}
						/>
						<ConfirmedDeletedModal
							instanceToDelete="media"
							active={activeConfirmedDeleteModal}
							setActiveConfirmedDeleteModal={() =>
								setActiveConfirmedDeleteModal(false)
							}
						/>

						{!deleted.includes(companyMedia) && (
							<div
								className="flex justify-between border-b border-gray-1 py-[6px]"
								key={key}
							>
								<div className="flex justify-between w-[35%] text-[14px] leading-[24px]">
									{/* TODO: probably need a better idenditifier then a S3 url */}
									<div className="flex  min-w-max">
										<span>{companyMedia?.url}</span>
									</div>
									<div className="ml-[10px]">
										<p>{companyMedia?.url}</p>
									</div>
								</div>
								<div className="flex justify-between w-[15%] min-w-[140px] ">
									<div className="flex gap-[6px]">
										<img
											onClick={() => {
												setActiveDeleteModal(true);
											}}
											className="cursor-pointer h-[24px] w-[24px]"
											src="./assets/carbon_trash-can.svg"
										/>
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

export default CompanyMediaList;
