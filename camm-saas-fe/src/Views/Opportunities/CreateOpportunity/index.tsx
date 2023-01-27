/* eslint-disable indent */
import React, { FC, useContext, useEffect, useState } from "react";
import CreateOpportunityDetails from "../../../Components/CreateOpportunityDetails";
import MembersForOpportunityCard from "../../../Components/MembersForOpportunityCard";
import SetUpOpportunity from "../../../Components/SetUpOpportunity";
import Button from "../../../Components/Utils/Buttons/Button";
import WizardProgressBar from "../../../Components/WizardProgressBar";
import Specification from "../../../Models/Specification";
import { AuthContext } from "../../../auth";
import SpecificationList from "../../../Components/SpecificationList";
import OpportunityUserList from "../../../Components/OpportunityUserList";
import OpportunityUserListSmall from "../../../Components/OpportunityUserListSmall";
import Opportunity from "../../../Models/Opportunity";
import Company from "../../../Models/Company";
import { TabTitle } from "../../../Components/Utils/BrowserTitles";
import Country from "../../../Models/Country";
import { Navigate, useNavigate } from "react-router-dom";

/* ALL VARIABLES WITH USER IN THEIR NAMES SHOULD BE COMPANIES */

const CreateOpportunity: FC = () => {
	const navigate = useNavigate();
	const [opportunityData, setOpportunityData] = useState<{
		name?: string | undefined;
		description?: string | undefined;
		startDate?: Date | undefined;
		closeDate?: Date | undefined;
		country?: string[] | undefined;
		company?: Company;
	}>({});
	const [progress, setProgress] = useState(1);
	const [specificationAmount, setSpecificationAmount] = useState(0);
	const [specificationByTypeList, setSpecificationByTypeList] = useState<
		Specification[]
	>([]);
	const [specificationTypeList, setSpecificationTypeList] = useState<string[]>(
		[]
	);
	const { token, user } = useContext(AuthContext);
	const [selectedSpecificationList, setSelectedSpecificationList] = useState<
		Specification[]
	>([]);
	const [showMissingFields, setShowMissingFields] = useState({
		message: "",
		show: false,
	});
	const [userList, setUserList] = useState<Company[]>([]);
	const [companyList, setCompanyList] = useState<Company[]>([]);
	const [totalPages, setTotalPages] = useState(0);
	const [selectedUserList, setSelectedUserList] = useState<Company[]>([]);
	const [addedUserList, setAddedUserList] = useState<Company[]>([]);
	const [createOpportunitySavingText, setCreateOpportunitySavingText] =
		useState("");

	const addSelectedUsers = () => {
		const list = [...addedUserList, ...selectedUserList];

		setAddedUserList(list);
		setSelectedUserList([]);
	};

	const selectAllUsers = () => {
		setSelectedUserList(
			userList.filter(
				(userItem) =>
					addedUserList.filter(
						(addedUserItem) => addedUserItem.id === userItem.id
					).length === 0
			)
		);
	};

	const clearSelection = () => {
		setSelectedUserList([]);
	};

	const checkSetUp = () => {
		showMissingFields.message = "";
		let currentMessage = showMissingFields.message;

		if (opportunityData?.name == "" || opportunityData?.name == undefined) {
			currentMessage += "name. ";
		}
		if (
			opportunityData?.description == "" ||
			opportunityData?.description == undefined
		) {
			currentMessage += "description, ";
		}

		if (opportunityData?.startDate == undefined) {
			currentMessage += "date, ";
		}

		if (currentMessage == "") {
			setShowMissingFields({
				message: "",
				show: false,
			});
		} else {
			setShowMissingFields({
				message: "Missing: " + currentMessage.slice(0, -2),
				show: true,
			});
		}
		if (currentMessage == "") {
			setProgress(progress + 1);
		}
	};

	const SubmitOpportunity = () => {
		const SelectedCountriesIds: Country[] = [];

		opportunityData?.country?.map((country) => {
			switch (country.toLowerCase()) {
				case "canada":
					SelectedCountriesIds.push(new Country(1));
					break;
				case "usa":
					SelectedCountriesIds.push(new Country(2));
					break;
				case "brazil":
					SelectedCountriesIds.push(new Country(3));
					break;
				case "germany":
					SelectedCountriesIds.push(new Country(4));
					break;
				case "japan":
					SelectedCountriesIds.push(new Country(5));
					break;
				case "south korea":
					SelectedCountriesIds.push(new Country(6));
					break;
			}
		});

		if (user?.roles?.includes("Super Admin")) {
			const opportunityToCreate = new Opportunity(
				undefined,
				opportunityData?.name,
				"open",
				opportunityData?.description,
				opportunityData?.startDate,
				opportunityData?.closeDate,
				opportunityData?.company,
				addedUserList,
				selectedSpecificationList,
				SelectedCountriesIds
			);
			setCreateOpportunitySavingText("Saving...");
			opportunityToCreate
				.create(
					token,
					opportunityToCreate?.title,
					"open",
					opportunityToCreate?.description,
					opportunityToCreate?.openDate,
					opportunityToCreate?.closeDate,
					opportunityToCreate?.company,
					opportunityToCreate?.companies,
					opportunityToCreate?.specifications,
					opportunityToCreate?.countries
				)
				.then((response) => {
					if (response) {
						setCreateOpportunitySavingText("Saved");
					}
					// handle error out
				});
		} else {
			//Has Non-member should only ever belong to 1 company
			if (!user?.company?.id) {
				setCreateOpportunitySavingText(
					"You cannot request an opportunity at this time. Please reach out to support."
				);
				return;
			}

			// As sets are async, by the time this is done, we would have already had tried to request a new opportunity, therefore just do the find in the request
			// setOpportunityData({
			// 	...opportunityData,
			// 	company: companyList.find((company)=>{
			// 		return company.id === user?.company?.id;
			// 	}),
			// });

			const opportunityToCreate = new Opportunity(
				undefined,
				opportunityData?.name,
				undefined,
				opportunityData?.description,
				opportunityData?.startDate,
				opportunityData?.closeDate,
				opportunityData?.company,
				undefined,
				selectedSpecificationList,
				SelectedCountriesIds
			);

			setCreateOpportunitySavingText("Requesting...");
			opportunityToCreate
				.requestNewOpportunity(
					token,
					opportunityToCreate?.title,
					opportunityToCreate?.description,
					opportunityToCreate?.openDate,
					opportunityToCreate?.closeDate,
					companyList.find((company) => {
						return company.id === user?.company?.id;
					}),
					opportunityToCreate?.countries,
					opportunityToCreate?.specifications
				)
				.then((response) => {
					if (response) {
						setCreateOpportunitySavingText("Saved");
						navigate("/opportunity-requested");
					}
					// handle error out
				});
		}
	};

	useEffect(() => {
		Specification.getSpecificationTypes(token).then((response) => {
			setSpecificationTypeList(response);
		});
		Specification.getSpecifications(token).then((response) => {
			setSpecificationByTypeList(response);
		});
	}, []);

	useEffect(() => {
		Company.getQualifyingCompanies(token, selectedSpecificationList).then(
			(res) => {
				setUserList(res.companies);
				setTotalPages(res.totalPages);
			}
		);
	}, [selectedSpecificationList]);

	useEffect(() => {
		Company.getQualifyingCompanies(token, selectedSpecificationList).then(
			(res) => {
				setUserList(res.companies);
				setTotalPages(res.totalPages);
			}
		);
		Company.getCompanies(token, 1).then((res) => {
			setCompanyList(res.companies);
			setOpportunityData({ ...opportunityData });
		});
	}, []);
	TabTitle("CAMM - Create Opportunity");
	return (
		<div className="container w-full pt-[104px] px-[46px] font-roboto relative overflow-x-hidden">
			<div className="w-fit overflow-x-hidden">
				<div className="flex lg:flex-row flex-col min-h-[750px] lg:max-h-[900px]">
					<div className="flex flex-col">
						<div className="flex flex-col lg:flex-row">
							<div className="pl-[22px] mt-8">
								{specificationTypeList.length > 0 && (
									<WizardProgressBar
										step={progress}
										totalSteps={["Specifications"]}
									/>
								)}
							</div>
							<div
								className={`${
									(user?.roles?.includes("Super Admin") && progress === 3) ||
									(!user?.roles?.includes("Super Admin") && progress === 2)
										? "hidden"
										: "block"
								} flex flex-row-reverse mt-[30px] gap-2 justify-between`}
							>
								<Button
									text="next"
									style="primary"
									action={() => {
										checkSetUp();
										Company.getQualifyingCompanies(
											token,
											selectedSpecificationList
										).then((res) => {
											setUserList(res.companies);
											setTotalPages(res.totalPages);
										});
									}}
								/>
								<div className="flex flex-col items-start">
									<p
										className={`${
											showMissingFields.show ? "block " : "hidden"
										} text-[12px] flex items-center justify-center text-brightRed`}
									>
										{showMissingFields?.message}
									</p>
								</div>
								<Button
									text="Previous"
									style={progress == 1 ? "disabled" : "alternative"}
									action={() => {
										if (progress > 1) {
											setProgress(progress - 1);
										}
									}}
								/>
							</div>
							<div className="mb-4">
								<div
									className={`${
										progress === 3 ||
										(!user?.roles?.includes("Super Admin") && progress === 2)
											? "block"
											: "hidden"
									} flex flex-row-reverse gap-2 mt-[30px] justify-between`}
								>
									<Button
										text="Save"
										style="primary"
										disabled={createOpportunitySavingText === "Saved"}
										action={SubmitOpportunity}
									/>
									<div className="flex flex-col items-start">
										<p
											className={`${
												showMissingFields.show ? "block " : "hidden"
											} text-[12px] flex items-center justify-center text-brightRed`}
										>
											{showMissingFields?.message}
										</p>
									</div>
									<Button
										text="Previous"
										style={progress == 1 ? "disabled" : "alternative"}
										action={() => {
											if (specificationAmount > 0) {
												setSpecificationAmount(specificationAmount - 1);
											}
											if (progress > 1) {
												setProgress(progress - 1);
											}
										}}
									/>
								</div>
								<div className="flex flex-row-reverse">
									{createOpportunitySavingText && (
										<p>{createOpportunitySavingText}</p>
									)}
								</div>
							</div>
						</div>

						<SetUpOpportunity
							step={progress}
							opportunityData={opportunityData}
							companyList={companyList}
							setOpportunityData={setOpportunityData}
						/>

						<SpecificationList
							step={progress}
							specificationTypes={specificationTypeList}
							specificationByTypeList={specificationByTypeList}
							specificationAmount={specificationTypeList.length}
							selectedSpecificationList={selectedSpecificationList}
							setSelectedSpecificationList={setSelectedSpecificationList}
						/>
						<div className="mt-24 lg:min-w-[920px]">
							<OpportunityUserList
								total={specificationTypeList.length}
								step={progress}
								userList={userList}
								setUserList={setUserList}
								totalPages={totalPages}
								selectedUserList={selectedUserList}
								setSelectedUserList={setSelectedUserList}
								addedUserList={addedUserList}
								selectedSpecificationList={selectedSpecificationList}
							/>
						</div>
						<div
							className={`${
								progress === 3 ? "flex" : "hidden"
							}  justify-center gap-2 mt-5`}
						>
							<Button
								style="outline"
								text={`ADD ${
									selectedUserList.length > 0
										? "( " + selectedUserList.length + " )"
										: ""
								} MEMBERS `}
								action={() => {
									addSelectedUsers();
								}}
							/>
							<Button
								style="outline"
								text="select all"
								action={() => selectAllUsers()}
							/>
							<Button
								style="outline"
								text="clear selection"
								action={() => clearSelection()}
							/>
						</div>
					</div>
					<div className="ml-[24px] lg:mt-20 flex flex-col">
						<CreateOpportunityDetails
							step={progress}
							opportunityData={opportunityData}
						/>
						{user?.roles?.includes("Super Admin") && (
							<div className="mt-5">
								<MembersForOpportunityCard
									step={progress}
									membersWhoQualify={userList?.length}
									specificationTypeList={specificationTypeList}
									selectedSpecification={selectedSpecificationList}
								/>
							</div>
						)}
						<div className="max-w-[400px] max-h-[483px] mb-12 mt-5">
							<OpportunityUserListSmall
								total={specificationTypeList.length}
								step={progress}
								userList={addedUserList}
								substractMode={true}
								setAddedUserList={setAddedUserList}
								addedUserList={addedUserList}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreateOpportunity;
