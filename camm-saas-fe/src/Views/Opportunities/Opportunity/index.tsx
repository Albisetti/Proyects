import React, { FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../auth";
import PortraitInput from "../../../Components/PortraitInput";
import TextPill from "../../../Components/TextPill";
import TextPillList from "../../../Components/TextPillList";
import Company from "../../../Models/Company";
import Opportunity from "../../../Models/Opportunity";
import Specification from "../../../Models/Specification";

const OpportunityProfile: FC = () => {
	const { token } = useContext(AuthContext);
	const { slug } = useParams();

	const [currentOpportunity, setCurrentOpportunity] = useState<Opportunity>();
	const [currentCompany, setCurrentCompany] = useState<Company>();

	const [specifications, setSpecifications] = useState<Specification[]>([]);
	const [specificationsTypes, setSpecificationsTypes] = useState<string[]>([]);

	useEffect(() => {
		if (!slug) return;
		Opportunity.getOpportunityWithSpecifications(token, parseInt(slug)).then(
			(response) => {
				if (!response?.opportunity) return;
				setCurrentOpportunity(response?.opportunity);

				if (response?.opportunity?.specifications) {
					setSpecifications(response?.opportunity?.specifications);
					const specificationTypesArray: string[] = [];
					response?.opportunity?.specifications?.forEach((specification) => {
						if (!specificationTypesArray.includes(specification?.type)) {
							specificationTypesArray.push(specification?.type);
						}
					});
					setSpecificationsTypes(specificationTypesArray);
				}

				if (!response?.companyId) return;
				Company.getCompany(token, response?.companyId).then(
					(responseCompany) => {
						setCurrentCompany(responseCompany?.company);
					}
				);
			}
		);
	}, []);

	return (
		<div className="container w-full h-full pt-[160px] font-roboto mb-[30px] relative ">
			<div className="flex pr-[10px]">
				<div className=" ml-[39px] mr-[30px]">
					<div className="flex flex-col items-center text-center w-[340px] justify-between md:w-full ">
						<div className="flex flex-col justify-center items-center text-center">
							<div className="w-[270px]  text-left pl-[20px]">
								<div className="h-[150px] w-[150px]">
									<PortraitInput
										id={currentCompany?.id ? currentCompany?.id.toString() : ""}
										rounded={true}
										portraitImage={currentCompany?.mainImage}
									/>
								</div>
								<div className="flex gap-[10px] mt-[20px]">
									<div>
										<div className="text-[16px]">{currentCompany?.name}.</div>
									</div>
								</div>
								<div className="flex gap-[10px] mt-[20px]">
									<img
										className="cursor-pointer"
										src="/assets/houseLogo.svg"
									></img>
									<div>
										<div className="text-[12px]">
											{currentCompany?.firstAddress}.
										</div>
										<div className="text-[12px]">
											{currentCompany?.city}, {currentCompany?.province},{" "}
											{currentCompany?.postalCode}
										</div>
									</div>
								</div>
								<div className="flex gap-[10px] mt-[20px] ml-[1px]">
									<img
										className="cursor-pointer"
										src="/assets/mailLogo.svg"
									></img>
									<div>
										<div className="text-[12px] text-brightRed underline cursor-pointer">
											<a
												href={`mailto:${currentCompany?.contactEmail}`}
												target="_blank"
												rel="noreferrer"
											>
												{currentCompany?.contactEmail}
											</a>
										</div>
									</div>
								</div>
								{currentCompany?.phoneNumber && (
									<div className="flex gap-[10px] mt-[20px] ml-[1px]">
										<img
											className="cursor-pointer"
											src="/assets/phoneLogo.svg"
										></img>
										<div>
											<div className="text-[12px] text-brightRed underline cursor-pointer">
												<a
													href={`tel:${currentCompany?.phoneNumber}`}
													target="_blank"
													rel="noreferrer"
												>
													{currentCompany?.phoneNumber}
												</a>
											</div>
										</div>
									</div>
								)}
								<div className="flex gap-[19px] mt-[25px] ml-[2px]">
									<img
										onClick={(e) => {
											e.preventDefault();
											if (
												currentCompany?.socialMedia?.facebookURL &&
												currentCompany?.socialMedia.facebookURL !== "undefined"
											) {
												window.location.href = `${currentCompany?.socialMedia.facebookURL}`;
											}
										}}
										className="cursor-pointer"
										style={{
											cursor: `${
												currentCompany?.socialMedia?.facebookURL &&
												currentCompany?.socialMedia?.facebookURL !== "undefined"
													? "pointer"
													: "default"
											}`,
										}}
										src={
											currentCompany?.socialMedia?.facebookURL &&
											currentCompany?.socialMedia?.facebookURL !== "undefined"
												? "../assets/facebookLogo.svg"
												: "../assets/facebookLogoGray.svg"
										}
									></img>
									<img
										onClick={(e) => {
											e.preventDefault();
											if (
												currentCompany?.socialMedia?.twitterURL &&
												currentCompany?.socialMedia?.twitterURL !== "undefined"
											) {
												window.location.href = `${currentCompany?.socialMedia?.twitterURL}`;
											}
										}}
										className="cursor-pointer"
										style={{
											cursor: `${
												currentCompany?.socialMedia?.twitterURL &&
												currentCompany?.socialMedia?.twitterURL !== "undefined"
													? "pointer"
													: "default"
											}`,
										}}
										src={
											currentCompany?.socialMedia?.twitterURL &&
											currentCompany?.socialMedia?.twitterURL !== "undefined"
												? "/assets/twitterLogo.svg"
												: "/assets/twitterLogoGray.svg"
										}
									></img>
									<img
										onClick={(e) => {
											e.preventDefault();
											if (
												currentCompany?.socialMedia?.linkedinURL &&
												currentCompany?.socialMedia?.linkedinURL !== "undefined"
											) {
												window.location.href = `${currentCompany?.socialMedia?.linkedinURL}`;
											}
										}}
										className="cursor-pointer"
										style={{
											cursor: `${
												currentCompany?.socialMedia?.linkedinURL &&
												currentCompany?.socialMedia?.linkedinURL !== "undefined"
													? "pointer"
													: "default"
											}`,
										}}
										src={
											currentCompany?.socialMedia?.linkedinURL &&
											currentCompany?.socialMedia?.linkedinURL !== "undefined"
												? "/assets/linkednLogo.svg"
												: "/assets/linkednLogoGray.svg"
										}
									></img>
									<img
										onClick={(e) => {
											e.preventDefault();
											if (
												currentCompany?.socialMedia?.instagramURL &&
												currentCompany?.socialMedia?.instagramURL !==
													"undefined"
											) {
												window.location.href = `${currentCompany?.socialMedia?.instagramURL}`;
											}
										}}
										className="cursor-pointer"
										style={{
											cursor: `${
												currentCompany?.socialMedia?.instagramURL &&
												currentCompany?.socialMedia?.instagramURL !==
													"undefined"
													? "pointer"
													: "default"
											}`,
										}}
										src={
											currentCompany?.socialMedia?.instagramURL &&
											currentCompany?.socialMedia?.instagramURL !== "undefined"
												? "/assets/instagramLogo.svg"
												: "/assets/instagramLogoGray.svg"
										}
									></img>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="border-l border-gray-1 pl-[32px] pt-5 flex flex-col ">
					<div className="text-[24px] font-medium my-5">
						<h2>
							Opportunity - {currentOpportunity?.title} - (
							{currentOpportunity?.openDate?.toDateString()} -{" "}
							{currentOpportunity?.closeDate?.toDateString()})
						</h2>
						<h3 className="mt-2">
							{currentOpportunity?.status && (
								<TextPill
									text={currentOpportunity?.status.toLocaleUpperCase()}
									color={
										currentOpportunity?.status === "open"
											? "#B2C290"
											: "#FF0F00"
									}
									textColor={"#FFFFFF"}
								/>
							)}
						</h3>
					</div>
					<div></div>
					<div>
						<p>{currentOpportunity?.description}</p>
					</div>
					<div className="flex flex-wrap">
						{specificationsTypes.map((type) => {
							return (
								<div key={type}>
									<div className="my-3 font-poppins font-normal">{type}:</div>
									<div className="font-bold">
										<TextPillList
											textList={specifications
												.filter((specification) => specification?.type === type)
												.map((specification) => specification?.name)}
											color={"#000000"}
											textColor={"#FFFFFF"}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
			{/* <div className="shadow-xl w-3/5 rounded-xl bg-white min-h-[50%] min-w-[20%] p-8">
				<h1 className="text-2xl pb-4">Opportunity Details</h1>
				<div className="flex flex-row items-start justify-start gap-24">
					<div className="basis-1/2">
						<h2>Owner</h2>
						<p>
							<span className="font-bold text-black">Company Name:</span>{" "}
							{currentCompany?.name}
						</p>
						<p>
							<span className="font-bold text-black">Company City:</span>{" "}
							{currentCompany?.city}
						</p>
						<p>
							<span className="font-bold text-black">Company Country:</span>{" "}
							{currentCompany?.country}
						</p>
						<p>
							<span className="font-bold text-black">Company Email:</span>{" "}
							{currentCompany?.contactEmail}
						</p>
						<p>
							<span className="font-bold text-black">Company Phone:</span>{" "}
							{currentCompany?.phoneNumber}
						</p>
					</div>

					<div className="basis-1/2">
						<h2>Opportunity</h2>
						<p>
							<span className="font-bold text-black">Opportunity Title:</span>{" "}
							{currentOpportunity?.title}
						</p>
						<p>
							<span className="font-bold text-black">
								Opportunity Description:
							</span>{" "}
							{currentOpportunity?.description}
						</p>
						<p>
							<span className="font-bold text-black">Company Phone:</span>{" "}
							{currentOpportunity?.openDate?.toDateString()}
						</p>
						<p>
							<span className="font-bold text-black">Company Phone:</span>{" "}
							{currentOpportunity?.closeDate?.toDateString()}
						</p>
						<p>
							<span className="font-bold text-black">Opportunity Status:</span>{" "}
							{currentOpportunity?.status}
						</p>
					</div>
				</div>
			</div> */}
		</div>
	);
};
export default OpportunityProfile;
