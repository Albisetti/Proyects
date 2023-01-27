/* eslint-disable react/no-unescaped-entities */
/* eslint-disable indent */
import cx from "classnames";
import React, { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth";
import Company from "../../Models/Company";
import { ICompany } from "../../Models/Company/CompanyInterface";
import Opportunity from "../../Models/Opportunity";
import Specification from "../../Models/Specification";
import OpportunityUserCard from "../OpportunityUserCard";
import PortraitInput from "../PortraitInput";
import TextPill from "../TextPill";
import Button from "../Utils/Buttons/Button";
import Modal from "../Utils/Modal";

type OpportunityDetailsProps = {
	image?: string;
	members?: ICompany[];
	specifications?: Specification[];
	companyName?: string;
	opportunityName?: string;
	mainText?: string;
	companyEmail?: string;
	opportunityId?: number;
	opportunity?: Opportunity;
	connectButton: boolean;
};

const OpportunityDetails: FC<OpportunityDetailsProps> = ({
	image,
	members = [],
	specifications = [],
	companyName = "Company Name",
	opportunityName = "Opportunity Name",
	mainText = "Your text goes here",
	companyEmail,
	opportunityId,
	opportunity,
	connectButton = false,
}: OpportunityDetailsProps) => {
	const { token, user } = useContext(AuthContext);
	const navigate = useNavigate();
	const [showExpandedText, setShowExpandedText] = useState(false);
	const [connectMemberModal, setConnectMemberModal] = useState(false);
	const [savingMembers, setSavingMembers] = useState(false);
	const [qualifyingCompanies, setQualifyingCompanies] = useState<Company[]>();
	const [nonQualifyingCompanies, setNonQualifyingCompanies] =
		useState<Company[]>();

	const [selectedCompanyList, setSelectedCompanyList] = useState<Company[]>([]);

	const [textLines, setTextLines] = useState(0);

	useEffect(() => {
		const div = document?.getElementById("mainText");
		if (div?.offsetHeight) {
			setTextLines(div?.offsetHeight);
		}

		if (connectMemberModal === true) {
			Company.getQualifyingCompanies(token, specifications).then((response) => {
				const qualifyingMembers: Company[] = [];
				response?.companies?.forEach((company) => {
					if (members.length > 0) {
						members.forEach((member) => {
							if (
								member?.id !== company?.id &&
								!qualifyingMembers.includes(company)
							)
								qualifyingMembers.push(company);
						});
					} else {
						qualifyingMembers.push(company);
					}
				});
				setQualifyingCompanies(qualifyingMembers);
			});
			Company.getNonQualifyingCompanies(token, specifications).then(
				(response) => {
					const nonQualifyingMembers: Company[] = [];
					response?.companies?.forEach((company) => {
						if (members.length > 0) {
							members.forEach((member) => {
								if (
									member?.id !== company?.id &&
									!nonQualifyingMembers.includes(company)
								)
									nonQualifyingMembers.push(company);
							});
						} else {
							nonQualifyingMembers.push(company);
						}
					});
					setNonQualifyingCompanies(nonQualifyingMembers);
				}
			);
		}
	}, [connectMemberModal]);

	function AddOrRemoveIcon(
		isSelected: boolean,
		substractMode: boolean
	): string | undefined {
		if (isSelected) {
			return "/assets/icons/checkmark.svg";
		} else if (substractMode) {
			return "/assets/icons/substract.svg";
		} else {
			return "/assets/icons/add-white.svg";
		}
	}

	const addCompany = (user: Company) => {
		const userList = [...selectedCompanyList];
		userList?.push(user);
		setSelectedCompanyList(userList);
	};

	function AddOrRemoveCompany(
		isSelected: boolean,
		company: Company,
		substractMode: boolean,
		addCompany: (company: Company) => void
	): void {
		if (!isSelected) {
			addCompany(company);
		} else {
			setSelectedCompanyList(
				selectedCompanyList?.filter(
					(companyItem) => companyItem.id !== company.id
				)
			);
		}
	}

	return (
		<div className="w-[985px]  h-auto min-h-[320px] bg-gray-3 font-roboto flex cursor-pointer">
			<div
				style={{
					width: `${connectButton ? "250px" : "188px"}`,
				}}
				className="w-[188px]"
			>
				<Modal
					modalActive={connectMemberModal}
					modalActiveControl={() => {
						setConnectMemberModal(false);
						setSelectedCompanyList([]);
					}}
				>
					<div className="min-w-[500px] max-h-[800px] overflow-y-auto overflow-x-hidden">
						{qualifyingCompanies &&
							qualifyingCompanies?.length === 0 &&
							nonQualifyingCompanies &&
							nonQualifyingCompanies?.length === 0 && (
								<div>
									There aren't any members who can be added to this opportunity
								</div>
							)}
						{qualifyingCompanies && qualifyingCompanies?.length > 0 && (
							<div>
								<h2>Qualified Members</h2>
								<div className="grid grid-cols-3 gap-3">
									{qualifyingCompanies.map((company) => {
										return (
											<div
												key={company?.id}
												className="md:w-[280px] md:h-[320px] md:block w-[354px] h-[96px] flex bg-gray-3"
											>
												<img
													className="mt-[10px] md:mx-[8.75px] md:w-[262.5px] md:h-[210px] ml-[10px] w-[76px] h-[76px]"
													src={
														company.mainImage
															? company.mainImage
															: "/assets/defaultImageForUsers.jpg"
													}
												/>
												<p className="mt-[14px] ml-[10px] font-normal text-base">
													{company.name}
												</p>
												<div className="absolute mt-12 md:ml-[230px] md:static md:mt-3">
													<Button
														iconPadding={false}
														buttonPadding="medium"
														action={() =>
															AddOrRemoveCompany(
																selectedCompanyList.includes(company),
																company,
																false,
																addCompany
															)
														}
														style={
															selectedCompanyList.includes(company)
																? "secondary"
																: "primary"
														}
														iconRight={AddOrRemoveIcon(
															selectedCompanyList.includes(company),
															false
														)}
													/>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}
						{nonQualifyingCompanies && nonQualifyingCompanies?.length > 0 && (
							<div>
								<h2>
									Unqualified Members{" "}
									<span className="text-xs text-brightRed">
										(Warning, these members do not meet all specifications)
									</span>
								</h2>
								<div className="grid grid-cols-3 gap-3">
									{nonQualifyingCompanies.map((company) => {
										return (
											<div
												key={company?.id}
												className="md:w-[280px] md:h-[320px] md:block w-[354px] h-[96px] flex bg-gray-3"
											>
												<img
													className="mt-[10px] md:mx-[8.75px] md:w-[262.5px] md:h-[210px] ml-[10px] w-[76px] h-[76px]"
													src={
														company.mainImage
															? company.mainImage
															: "/assets/defaultImageForUsers.jpg"
													}
												/>
												<p className="mt-[14px] ml-[10px] font-normal text-base">
													{company.name}
												</p>
												<div className="absolute mt-12 md:ml-[230px] md:static md:mt-3">
													<Button
														iconPadding={false}
														buttonPadding="medium"
														action={() =>
															AddOrRemoveCompany(
																selectedCompanyList.includes(company),
																company,
																false,
																addCompany
															)
														}
														style={
															selectedCompanyList.includes(company)
																? "secondary"
																: "primary"
														}
														iconRight={AddOrRemoveIcon(
															selectedCompanyList.includes(company),
															false
														)}
													/>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}
						{selectedCompanyList.length > 0 && (
							<div>
								<h2>Selected Members</h2>
								<div className="grid grid-cols-6 gap-3">
									{selectedCompanyList &&
										selectedCompanyList.map((company) => {
											return (
												<div key={company?.id} className="flex bg-gray-3 p-2">
													<p className="font-normal text-base">
														{company.name}
													</p>
												</div>
											);
										})}
								</div>
							</div>
						)}
						{qualifyingCompanies &&
							qualifyingCompanies?.length !== 0 &&
							nonQualifyingCompanies &&
							nonQualifyingCompanies?.length !== 0 && (
								<div className="mt-2">
									<Button
										iconPadding={false}
										buttonPadding="medium"
										text={savingMembers ? "Saving" : "Save"}
										action={() => {
											setSavingMembers(true);
											opportunity
												?.addMembers(token, selectedCompanyList)
												.then(() => {
													setSavingMembers(false);
												});
										}}
									/>
								</div>
							)}
					</div>
				</Modal>
				<div
					className="flex flex-col items-center text-center"
					onClick={(e) => {
						e.preventDefault();
						navigate(`/opportunity/${opportunityId}`);
					}}
				>
					<div className="mt-[18px] h-[90px] w-[90px]">
						<PortraitInput
							id=""
							portraitImage={`${image ? image : ""}`}
							rounded
						/>
					</div>
					<div className="pt-[18px]">
						<div className="justify-center max-w-[200px] flex">
							<TextPill
								color="#FFFFFF"
								text={`${companyName}`}
								textSize="16px"
							/>
						</div>
						{members.length > 0 && (
							<p className="text-left text-[10px] max-w-min pt-[10px]">
								Members:
							</p>
						)}
						<div className="flex ml-[5px] mt-[5px] relative ">
							<div className="flex">
								{members.map((member, key) =>
									key >= 4 ? null : (
										<div
											className="ml-[-5px] relative"
											key={key}
											style={{
												zIndex: key,
											}}
										>
											<div
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													navigate(`/member-profile/${member?.id}`);
												}}
												className="w-[24px] h-[24px]"
											>
												<PortraitInput
													portraitImage={member?.mainImage}
													id=""
													rounded
												/>
											</div>
										</div>
									)
								)}
							</div>
							<div
								className={`w-[24px] h-[24px] font-bold rounded-full bg-brightRed text-[10px] z-[50] absolute flex justify-center items-center  right-[60px] text-white  ${
									members.length > 4 ? "block" : "hidden"
								}`}
							>
								{members.length - 4}+
							</div>
						</div>
					</div>
					{connectButton && user?.roles?.includes("Super Admin") && (
						<div
							className="mt-[28px]"
							onClick={(e) => {
								e.stopPropagation();
								setConnectMemberModal(true);
							}}
						>
							<Button
								text="connect member"
								iconRight="/assets/icons/add-white.svg"
								textSize="medium"
								iconSize="small"
							/>
						</div>
					)}
				</div>
			</div>

			<div
				style={{
					width: `${connectButton ? "680px" : "754px"}`,
				}}
				className="pt-[32px] "
				onClick={(e) => {
					e.preventDefault();
					navigate(`/opportunity/${opportunityId}`);
				}}
			>
				<div>
					<div className="text-[24px] leading-[36px] pb-[20px]">{`${opportunityName}`}</div>
				</div>
				<div
					style={{
						width: `${connectButton ? "680px" : "754px"}`,
						marginBottom: `${connectButton ? "-10px" : "10px"}`,
					}}
					className=" w-[754px] h-[1px] bg-grey"
				></div>

				<div className=" mb-[8px] leading-[24px]">
					{mainText && (
						<>
							<div
								id="mainText"
								className={cx(
									"mt-[1em]  transition-all duration-500 max-h-[60em] overflow-hidden text-[16px] leading-[24px]",
									{
										"!max-h-[7.5em]": !showExpandedText,
									}
								)}
							>
								{mainText}
							</div>
							{textLines >= 120 && (
								<div
									className="flex cursor-pointer w-[100px]"
									onClick={() => {
										setShowExpandedText(!showExpandedText);
									}}
								>
									<div className="flex text-brightRed">
										{!showExpandedText ? "..." : "-"}

										{!showExpandedText ? "read more" : "read less"}
									</div>
								</div>
							)}
						</>
					)}
				</div>
				<div
					style={{
						width: `${connectButton ? "680px" : "754px"}`,
					}}
					className=" h-[1px] bg-grey mb-[20px]"
				></div>
				{specifications.length > 0 && (
					<div className="grid grid-cols-12  mb-[34px] text-[12px]">
						{specifications.map((item, key) => (
							<p className=" mb-2 col-span-3" key={key}>
								{item.name}
							</p>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default OpportunityDetails;
