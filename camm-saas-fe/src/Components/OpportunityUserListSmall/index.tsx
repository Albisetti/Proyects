import React from "react";
import Company from "../../Models/Company";
import OpportunityUserCardSmall from "../OpportunityUserCardSmall";

/* ALL VARIABLES WITH USER IN THEIR NAMES SHOULD BE COMPANIES */

type OpportunityUserListProps = {
	step: number;
	total: number;
	userList: Company[];
	setSelectedUserList?: React.Dispatch<React.SetStateAction<Company[]>>;
	selectedUserList?: Company[];
	setAddedUserList?: React.Dispatch<React.SetStateAction<Company[]>>;
	addedUserList: Company[];
	substractMode?: boolean;
};

const OpportunityUserListSmall = ({
	step,
	total,
	userList,
	setSelectedUserList,
	selectedUserList,
	setAddedUserList,
	addedUserList,
	substractMode = false,
}: OpportunityUserListProps) => {
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

	return (
		<div
			className={`${
				step === 3 ? "block " : "hidden"
			} flex flex-col overflow-y-auto h-[270px] w-[415px] shadow-lg shadow-grey bg-white py-8 pl-7`}
		>
			<div className="text-[24px] font-normal mb-4">
				{addedUserList?.length} Members Connected
			</div>

			{userList.map((user, key) => {
				if (substractMode) {
					return (
						<>
							<div className=" mb-2">
								<OpportunityUserCardSmall
									user={user}
									addUser={addUser}
									substractUser={substractUser}
									isSelected={checkUserSelected(user)}
									substractMode={substractMode}
									key={key}
								/>
							</div>
						</>
					);
				} else if (
					addedUserList?.filter((addedUserItem) => addedUserItem.id === user.id)
						.length === 0
				) {
					return (
						<OpportunityUserCardSmall
							user={user}
							addUser={addUser}
							substractUser={substractUser}
							isSelected={checkUserSelected(user)}
							substractMode={substractMode}
							key={key}
						/>
					);
				}
			})}
		</div>
	);
};

export default OpportunityUserListSmall;
