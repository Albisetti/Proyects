import React, { FC, useEffect, useState, useContext } from "react";
import Company from "../../Models/Company";
import Opportunity from "../../Models/Opportunity";
import User from "../../Models/User";
import { AuthContext } from "../../auth";
import PortraitInput from "../PortraitInput";
import { useNavigate } from "react-router-dom";

type LatestListProps = {
	typeOfList: string;
};

const LatestList: FC<LatestListProps> = ({ typeOfList }: LatestListProps) => {
	const [title, setTitle] = useState("");
	const { token, user } = useContext(AuthContext);
	const [latestListMember, setLatestListMember] = useState<Company[]>();
	const [route, setRoute] = useState("");
	const navigate = useNavigate();
	const [latestListCompany, setLatestListCompany] = useState<Company[]>();
	const [latestListOpportunity, setLatestListOpportunity] =
		useState<Opportunity[]>();

	useEffect(() => {
		if (typeOfList === "member") {
			setTitle("Latest CAMM Members");
			Company.getLatestCompanies(token, 1).then((response) => {
				setLatestListMember(response?.companies.filter((c) => c?.isMember));
			});

			setRoute("/members");
		} else if (typeOfList === "company") {
			setTitle("Latest Companies");
			Company.getLatestCompanies(token, 1).then((response) => {
				setLatestListCompany(response?.companies.filter((c) => !c?.isMember));
			});
			setRoute("/companies");
		} else if (typeOfList === "opportunity") {
			if (
				user?.email === "developers@splicedigital.com" ||
				user?.email === "info@camm.ca"
			) {
				setTitle("Latest Opportunities");
			} else {
				setTitle("Your Opportunities");
			}
			Opportunity.getLatestOpportunities(token, 1).then((response) => {
				setLatestListOpportunity(response?.opportunities);
			});
			setRoute("/opportunities");
		}
	}, []);

	const cardStyles =
		"border-gray-1 border h-[80px] flex items-center cursor-pointer hover:border-brightRed transition";

	return (
		<div className="min-h-[656px] shadow md:min-w-[440px] min-w-[260px] w-full flex flex-col p-[24px] justify-start font-roboto bg-white pt-[36px] pb-[42px] px-[24px]">
			<div className="text-[24px] leading-[36px] mb-[20px] font-poppins font-normal">
				{title}
			</div>
			<div className="flex">
				<div className="flex flex-col gap-3 w-full">
					{latestListMember?.map((member, key) =>
						key >= 5 ? null : (
							<div
								onClick={() => {
									navigate(`/member-profile/${member.id}`);
								}}
								className={`${cardStyles} pl-5`}
								key={key}
							>
								<div className="text-[16px]">{member.name}</div>
							</div>
						)
					)}
					{latestListCompany?.map((company, key) =>
						key >= 5 ? null : (
							<div
								onClick={() => navigate(`/company/${company.id}`)}
								className={`${cardStyles} pl-5`}
								key={key}
							>
								<div className="text-[16px]">{company.name}</div>
							</div>
						)
					)}
					{latestListOpportunity?.map((opportunity, key) =>
						key >= 5 ? null : (
							<div
								onClick={() => navigate(`/opportunity/${opportunity.id}`)}
								className={`${cardStyles} pl-5`}
								key={key}
							>
								<div className="text-[16px]">{opportunity.title}</div>
							</div>
						)
					)}
					<div className="w-full flex justify-center items-center mt-[20px]">
						<div
							onClick={() => {
								navigate(route);
							}}
							className="underline text-brightRed text-[16px] cursor-pointer hover:font-bold"
						>
							See All
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LatestList;
