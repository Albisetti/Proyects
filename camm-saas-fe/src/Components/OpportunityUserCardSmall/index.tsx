import React from "react";
import Company from "../../Models/Company";
import Button from "../Utils/Buttons/Button";

type OpportunityUserCardProps = {
	user: Company;
	addUser: (user: Company) => void;
	substractUser: (user: Company) => void;
	substractMode: boolean;
	isSelected: boolean;
};

const OpportunityUserCardSmall = ({
	user,
	addUser,
	substractUser,
	substractMode,
	isSelected,
}: OpportunityUserCardProps) => {
	function AddOrRemoveUser(
		isSelected: boolean,
		substractUser: (user: Company) => void,
		user: Company,
		substractMode: boolean,
		addUser: (user: Company) => void
	): void {
		if (isSelected) {
			substractUser(user);
		} else if (substractMode) {
			substractUser(user);
		} else {
			addUser(user);
		}
	}

	function AddOrRemoveIcon(
		isSelected: boolean,
		substractMode: boolean
	): string | undefined {
		if (isSelected) {
			return "/assets/icons/checkmark.svg";
		} else if (substractMode) {
			return "/assets/icons/substract.svg";
		} else {
			return "/assets/icons/add.svg";
		}
	}

	return (
		<div className="w-[354px] h-[96px] flex bg-gray-3 relative">
			<img
				className="mt-[10px] ml-[10px] w-[76px] h-[76px]"
				src={
					user.mainImage ? user.mainImage : "/assets/defaultImageForUsers.jpg"
				}
			/>
			<p className="mt-[14px] ml-[10px] font-normal text-base">{user.name}</p>
			<div className="absolute mt-[54px]">
				<Button
					iconPadding={false}
					buttonPadding="medium"
					action={() =>
						AddOrRemoveUser(
							isSelected,
							substractUser,
							user,
							substractMode,
							addUser
						)
					}
					style={isSelected ? "secondary" : "primary"}
					iconRight={AddOrRemoveIcon(isSelected, substractMode)}
				/>
			</div>
		</div>
	);
};

export default OpportunityUserCardSmall;
