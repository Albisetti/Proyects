import React, { FC, useState, useContext } from "react";
import Company from "../../Models/Company";

import TextPill from "../TextPill";
import { AuthContext } from "../../auth";
import PriorDeleteModal from "../DeleteModals/PriorDeleteModal";
import ConfirmedDeletedModal from "../DeleteModals/ConfirmedDeletedModal";
import EditCompanyModal from "../EditCompanyModal";
import { PaginationItems } from "../../Models/Utils/paginationItems";
import { useNavigate } from "react-router-dom";
import Modal from "../Utils/Modal";

type CompanyListProps = {
	companyList: Company[];
	setCompaniesPerPage: React.Dispatch<React.SetStateAction<PaginationItems>>;
	setTotalCompanies: React.Dispatch<React.SetStateAction<number>>;
	totalCompanies: number;
	companiesPerPage: PaginationItems;
};

const CompanyList: FC<CompanyListProps> = ({
	companyList,
	setCompaniesPerPage,
	setTotalCompanies,
	totalCompanies,
	companiesPerPage,
}: CompanyListProps) => {
	const [editModalActive, setEditModalActive] = useState(false);
	const [activeDeleteModal, setActiveDeleteModal] = useState(false);
	const [activeEditCompany, setActiveEditCompany] = useState<
		Company | undefined
	>(undefined);

	const [activeConfirmedDeleteModal, setActiveConfirmedDeleteModal] =
		useState(false);
	const [deleted, setDeleted] = useState<Company[]>([]);
	const { token } = useContext(AuthContext);
	const navigate = useNavigate();

	const DeleteOpportunityFunction = (key: number, company: Company) => {
		companyList.splice(key, 1);
		company.delete(token).then((response) => {
			if (response) {
				setDeleted((currentlyDeleted) => [...currentlyDeleted, company]);
				setCompaniesPerPage({
					toItem: companiesPerPage.toItem - 1,
					fromItem: companiesPerPage.fromItem,
					totalPages: companiesPerPage.totalPages,
				});
				setTotalCompanies(totalCompanies - 1);
				setActiveDeleteModal(false);
				setActiveConfirmedDeleteModal(true);
			}
		});
	};

	const openModal = (company: Company) => {
		setEditModalActive(true);
		setActiveEditCompany(company);
	};

	return (
		<div className="flex w-full">
			<div className="flex flex-col mt-[5px] w-full">
				<div className="flex w-full justify-between text-[12px] leading-[24px] font-semibold border-b border-gray-1 pb-[8px]">
					<div className="flex justify-between w-[35%] min-w-[150px]">
						<div>COMPANY NAME</div>
						<div>ROLE</div>
					</div>
					<div className="flex justify-between w-[15%] min-w-[120px] text-left">
						<div className="ml-[12px]">STATUS</div>
						<div className="mr-1">ACTION</div>
					</div>
				</div>
				<Modal
					modalActive={editModalActive}
					modalActiveControl={() => setEditModalActive(false)}
				>
					<EditCompanyModal
						activeCompany={activeEditCompany}
						setActiveDeleteModal={() => setEditModalActive(false)}
						setCompany={setActiveEditCompany}
						setEditModalActive={setEditModalActive}
					/>
				</Modal>

				{companyList?.map((company: Company, key) => (
					<>
						<PriorDeleteModal
							instanceToDelete="company"
							active={activeDeleteModal}
							deleteFunction={() => DeleteOpportunityFunction(key, company)}
							setActiveDeleteModal={() => setActiveDeleteModal(false)}
						/>
						<ConfirmedDeletedModal
							instanceToDelete="Company"
							active={activeConfirmedDeleteModal}
							setActiveConfirmedDeleteModal={() =>
								setActiveConfirmedDeleteModal(false)
							}
						/>

						{!deleted.includes(company) && (
							<div
								className="flex justify-between border-b border-gray-1 py-[6px]"
								key={key}
							>
								<div className="flex justify-between w-[35%] text-[14px] leading-[24px]">
									<div className="flex  min-w-max">
										<a
											className="hover:underline cursor-pointer flex"
											onClick={() => navigate(`/company/${company.id}`)}
										>
											{company?.name}
										</a>
									</div>
									<div className="flex  min-w-max">
										<a
											key={key}
											className={`${company.isMember && ""} flex`}
											onClick={() => {
												company.isMember &&
													navigate(`/member-profile/${company.id}`);
											}}
										>
											<TextPill
												text={company.isMember ? "MEMBER" : "NON MEMBER"}
												color={company.isMember ? "#B2C290" : "#FFA500"}
												textSize="14px"
												textColor="#FFFFFF"
											/>
										</a>
									</div>
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
											onClick={() => openModal(company)}
											className="cursor-pointer h-[24px] w-[24px]"
											src="./assets/pencilBlack.svg"
										/>
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

export default CompanyList;
