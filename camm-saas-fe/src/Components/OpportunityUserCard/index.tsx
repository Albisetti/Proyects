import React from "react";
import Company from "../../Models/Company";
import Button from "../Utils/Buttons/Button";
import { Link } from "react-router-dom";

type OpportunityCompanyCardProps = {
	company: Company;
	addCompany: (company: Company) => void;
	substractCompany: (company: Company) => void;
	substractMode: boolean;
	isSelected: boolean;
};

const OpportunityCompanyCard = ({
	company,
	addCompany,
	substractCompany,
	substractMode,
	isSelected,
}: OpportunityCompanyCardProps) => {
	function AddOrRemoveCompany(
		isSelected: boolean,
		substractCompany: (company: Company) => void,
		company: Company,
		substractMode: boolean,
		addCompany: (company: Company) => void
	): void {
		if (isSelected) {
			substractCompany(company);
		} else if (substractMode) {
			substractCompany(company);
		} else {
			addCompany(company);
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
			return "/assets/icons/add-white.svg";
		}
	}

	return (
		<div
			className="md:w-[280px] md:h-[320px] md:block w-[354px] h-[96px] flex bg-gray-3"
			onClick={(event) => {
				event.stopPropagation();
			}}
		>
			<Link to={`/member-profile/${company?.id}`} target="_blank">
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
			</Link>

			<div className="absolute mt-12 md:ml-[230px] md:static md:mt-3">
				<Button
					iconPadding={false}
					buttonPadding="medium"
					action={() =>
						AddOrRemoveCompany(
							isSelected,
							substractCompany,
							company,
							substractMode,
							addCompany
						)
					}
					style={isSelected ? "secondary" : "primary"}
					iconRight={AddOrRemoveIcon(isSelected, substractMode)}
				/>
			</div>
		</div>
	);
};

export default OpportunityCompanyCard;
