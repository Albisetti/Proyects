import React, { FC, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../auth";
import OpportunityUserList from "../../../Components/OpportunityUserList";
import OpportunityUserListSmall from "../../../Components/OpportunityUserListSmall";
import Button from "../../../Components/Utils/Buttons/Button";
import User from "../../../Models/User";
type AddUserToOpportunityProps = {
	step: number;
	total: number;
};
const AddUserToOpportunity: FC<AddUserToOpportunityProps> = ({
	total,
	step,
}: AddUserToOpportunityProps) => {
	const { token } = useContext(AuthContext);
	const [userList, setUserList] = useState<User[]>([]);
	const [showButtons, setShowButtons] = useState(false);
	const [selectedUserList, setSelectedUserList] = useState<User[]>([]);
	const [addedUserList, setAddedUserList] = useState<User[]>([]);

	useEffect(() => {
		User.getUsers(token).then((res) => setUserList(res.users));
	}, []);

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

	useEffect(() => {
		setShowButtons(true);
		if (selectedUserList.length === 0) {
			setShowButtons(false);
		}
	}, [selectedUserList]);
	return (
		<>
			<div
				className={`${
					step > 1 + total ? "block" : "hidden"
				} mt-[130px] z-[100]`}
			>
				<div className="flex justify-between">
					<div className="text-[36px]">Add to Opportunity</div>
					<div className="flex flex-col">
						<div>Sort by</div>
						<div className="w-[224px] h-[36px] border"></div>
					</div>
				</div>

				<div
					className={`${showButtons ? "flex" : "hidden"}  justify-center gap-2`}
				>
					<Button
						style="outline"
						text="add members"
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
		</>
	);
};

export default AddUserToOpportunity;
