import React, { useContext, useState } from "react";
import { AuthContext } from "../../auth";
import Company from "../../Models/Company";
import Specification from "../../Models/Specification";
import OpportunityUserCard from "../OpportunityUserCard";

/* ALL VARIABLES WITH USER IN THEIR NAMES SHOULD BE COMPANIES */

type OpportunityUserListProps = {
	step: number;
	total: number;
	totalPages: number;
	userList: Company[];
	setUserList: React.Dispatch<React.SetStateAction<Company[]>>;
	setSelectedUserList?: React.Dispatch<React.SetStateAction<Company[]>>;
	selectedUserList?: Company[];
	setAddedUserList?: React.Dispatch<React.SetStateAction<Company[]>>;
	addedUserList: Company[];
	substractMode?: boolean;
	selectedSpecificationList: Specification[];
};

const OpportunityUserList = ({
	step,
	total,
	totalPages,
	userList,
	setUserList,
	setSelectedUserList,
	selectedUserList,
	setAddedUserList,
	addedUserList,
	substractMode = false,
	selectedSpecificationList,
}: OpportunityUserListProps) => {
	const { token } = useContext(AuthContext);

	const [currentPage, setCurrentPage] = useState(1);

	const substractUser = (user: Company) => {
		if (substractMode) {
			setAddedUserList!(userList.filter((userItem) => userItem.id !== user.id));
		} else {
			setSelectedUserList!(
				selectedUserList!.filter((userItem) => userItem.id !== user.id)
			);
		}
	};

	const addUser = (user: Company) => {
		const userList = [...selectedUserList!];
		userList?.push(user);
		setSelectedUserList!(userList);
	};

	const checkUserSelected = (user: Company) => {
		if (substractMode) {
			return false;
		} else {
			return (
				selectedUserList!.filter((userItem) => userItem.id === user.id).length >
				0
			);
		}
	};

	const handleScroll = async (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
		const bottom =
			Math.floor(e.currentTarget.scrollHeight - e.currentTarget.scrollTop) ===
			e.currentTarget.clientHeight;
		if (bottom) {
			const extraUsers = await Company.getQualifyingCompanies(
				token,
				selectedSpecificationList,
				currentPage + 1
			);
			setCurrentPage(currentPage + 1);
			if (extraUsers?.companies) {
				setUserList([...userList, ...extraUsers.companies]);
			}
		}
	};

	return (
		<div className={`${step === 3 ? "block " : "hidden"} font-roboto`}>
			<div className="text-[36px] font-normal">Add to Opportunity</div>
			<div
				className="flex flex-col flex-wrap gap-[11px] ml-7 md:ml-0 md:gap-[24px] overflow-y-auto  lg:grid lg:grid-cols-3 lg:max-h-[900px] lg:max-w-[910px]"
				onScroll={(e) => handleScroll(e)}
			>
				{userList.map((user, key) => {
					if (substractMode) {
						return (
							<OpportunityUserCard
								company={user}
								addCompany={addUser}
								substractCompany={substractUser}
								isSelected={checkUserSelected(user)}
								substractMode={substractMode}
								key={key}
							/>
						);
					} else if (
						addedUserList?.filter(
							(addedUserItem) => addedUserItem.id === user.id
						).length === 0
					) {
						return (
							<OpportunityUserCard
								company={user}
								addCompany={addUser}
								substractCompany={substractUser}
								isSelected={checkUserSelected(user)}
								substractMode={substractMode}
								key={key}
							/>
						);
					}
				})}
			</div>
		</div>
	);
};

export default OpportunityUserList;
