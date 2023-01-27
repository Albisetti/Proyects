import React, { FC, useContext, useEffect, useState } from "react";
import Hero from "../../Components/Hero";
import User from "../../Models/User";
import OpportunityDetails from "../../Components/OpportunityDetails";
import Company from "../../Models/Company";
import TextPillList from "../../Components/TextPillList";
import PortraitInput from "../../Components/PortraitInput";
import ImageDisplay from "../../Components/ImageDisplay";
import { TabTitle } from "../../Components/Utils/BrowserTitles";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../auth";
import Specification from "../../Models/Specification";
import CompanyMediaGallery from "../../Components/CompanyMediaGallery";
import CompanyMedia from "../../Models/CompanyMedia";
import { PaginationItems } from "../../Models/Utils/paginationItems";
import Pagination from "../../Components/Utils/Pagination";
import Opportunity from "../../Models/Opportunity";

const MemberProfile: FC = () => {
	const params = useParams();
	const navigate = useNavigate();
	const { token, user } = useContext(AuthContext);
	const [specifications, setSpecifications] = useState<Specification[]>([]);
	const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
	const [specificationsTypes, setSpecificationsTypes] = useState<string[]>([]);
	const [company, setCompany] = useState<Company>(new Company());
	const [loadingOpportunities, setLoadingOpportunities] = useState(false);
	const [companyBanner, setCompanyBanner] = useState<string>();

	const [companyMediaPageToGet, setCompanyMediaPageToGet] = useState(1);
	const [totalCompanyMediaPages, setTotalCompanyMediaPages] = useState(1);
	const [totalCompanyMedia, setTotalCompanyMedia] = useState(1);
	const [companyMediaList, setCompanyMediaList] = useState<CompanyMedia[]>([]);
	const [companyMediasPerPage, setCompanyMediasPerPage] =
		useState<PaginationItems>({
			toItem: 1,
			fromItem: 1,
			totalPages: 1,
		});

	useEffect(() => {
		if (params.slug) {
			Company.getCompany(token, parseInt(params?.slug)).then((response) => {
				if (response?.company) setCompany(response?.company);
			});
		}
	}, []);

	useEffect(() => {
		if (company?.id) {
			setLoadingOpportunities(true);
			company
				?.getCompanySpecifications(token, company?.id, 1)
				.then((response) => {
					setSpecifications(response?.specifications);
					const specificationTypesArray: string[] = [];
					response?.specifications.forEach((specification) => {
						if (!specificationTypesArray.includes(specification?.type)) {
							specificationTypesArray.push(specification?.type);
						}
					});
					setSpecificationsTypes(specificationTypesArray);
				});

			CompanyMedia.getCompanyMedias(
				token,
				company.id,
				companyMediaPageToGet,
				6
			).then(
				(response: {
					medias: CompanyMedia[];
					currentPage: number;
					totalPages: number;
					fromCompany: number;
					toCompany: number;
					totalCompanies: number;
				}) => {
					setTotalCompanyMediaPages(response?.totalPages);
					setCompanyMediasPerPage({
						toItem: response?.toCompany,
						fromItem: response?.fromCompany,
						totalPages: response?.totalPages,
					});
					setTotalCompanyMedia(response?.totalCompanies);
					setCompanyMediaList(response?.medias);
				}
			);
			company
				?.getOpportunities(token, ["company", "specifications", "users"], 7)
				.then((res) => {
					setOpportunities(res.opportunities);
					setLoadingOpportunities(false);
				})
				.catch(() => setLoadingOpportunities(false));
		}
	}, [company]);

	useEffect(() => {
		setCompanyBanner(company?.banner);
	}, [company?.banner]);

	TabTitle(`CAMM - ${company?.name}`);

	return (
		<div className="container w-full h-full mt-[80px] font-roboto mb-[30px] relative ">
			<div className="h-[325px]">
				<Hero image={company?.banner} />
			</div>
			<div className="flex pr-[10px]">
				<div className=" ml-[39px] mr-[30px]">
					{/* <div className="flex items-center absolute left-28 top-7">
						<img
							className="cursor-pointer h-[15px] w-[18px] mr-[19px]"
							src="../assets/backArrow.svg"
						></img>
						<div>Home / Mold making expertise by application /</div>
						<div className="text-brightRed ml-[3px] ">Member</div>
					</div> */}
					<div className="flex flex-col items-center text-center w-[340px] justify-between md:w-full ">
						<div className="flex flex-col justify-center items-center text-center">
							<div className="w-[270px]  text-left pl-[20px]">
								<div className="absolute top-60 h-[150px] w-[150px]">
									<PortraitInput
										id={company?.id ? company?.id.toString() : ""}
										rounded={true}
										portraitImage={company.mainImage}
									/>
								</div>
								<div className="flex gap-[10px] mt-[80px]">
									<img
										className="cursor-pointer"
										src="/assets/houseLogo.svg"
									></img>
									<div>
										<div className="text-[12px]">{company.firstAddress}.</div>
										<div className="text-[12px]">
											{company.city}, {company.province}, {company.postalCode}
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
												href={`mailto:${company?.contactEmail}`}
												target="_blank"
												rel="noreferrer"
											>
												{company?.contactEmail}
											</a>
										</div>
									</div>
								</div>
								{company?.phoneNumber && (
									<div className="flex gap-[10px] mt-[20px] ml-[1px]">
										<img
											className="cursor-pointer"
											src="/assets/phoneLogo.svg"
										></img>
										<div>
											<div className="text-[12px] text-brightRed underline cursor-pointer">
												<a
													href={`tel:${company?.phoneNumber}`}
													target="_blank"
													rel="noreferrer"
												>
													{company?.phoneNumber}
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
												company.socialMedia?.facebookURL &&
												company.socialMedia.facebookURL !== "undefined"
											) {
												window.location.href = `${company.socialMedia.facebookURL}`;
											}
										}}
										className="cursor-pointer"
										style={{
											cursor: `${
												company.socialMedia?.facebookURL &&
												company.socialMedia?.facebookURL !== "undefined"
													? "pointer"
													: "default"
											}`,
										}}
										src={
											company.socialMedia?.facebookURL &&
											company.socialMedia?.facebookURL !== "undefined"
												? "../assets/facebookLogo.svg"
												: "../assets/facebookLogoGray.svg"
										}
									></img>
									<img
										onClick={(e) => {
											e.preventDefault();
											if (
												company.socialMedia?.twitterURL &&
												company.socialMedia?.twitterURL !== "undefined"
											) {
												window.location.href = `${company.socialMedia?.twitterURL}`;
											}
										}}
										className="cursor-pointer"
										style={{
											cursor: `${
												company.socialMedia?.twitterURL &&
												company.socialMedia?.twitterURL !== "undefined"
													? "pointer"
													: "default"
											}`,
										}}
										src={
											company.socialMedia?.twitterURL &&
											company.socialMedia?.twitterURL !== "undefined"
												? "/assets/twitterLogo.svg"
												: "/assets/twitterLogoGray.svg"
										}
									></img>
									<img
										onClick={(e) => {
											e.preventDefault();
											if (
												company.socialMedia?.linkedinURL &&
												company.socialMedia?.linkedinURL !== "undefined"
											) {
												window.location.href = `${company.socialMedia?.linkedinURL}`;
											}
										}}
										className="cursor-pointer"
										style={{
											cursor: `${
												company.socialMedia?.linkedinURL &&
												company.socialMedia?.linkedinURL !== "undefined"
													? "pointer"
													: "default"
											}`,
										}}
										src={
											company.socialMedia?.linkedinURL &&
											company.socialMedia?.linkedinURL !== "undefined"
												? "/assets/linkednLogo.svg"
												: "/assets/linkednLogoGray.svg"
										}
									></img>
									<img
										onClick={(e) => {
											e.preventDefault();
											if (
												company.socialMedia?.instagramURL &&
												company.socialMedia?.instagramURL !== "undefined"
											) {
												window.location.href = `${company.socialMedia?.instagramURL}`;
											}
										}}
										className="cursor-pointer"
										style={{
											cursor: `${
												company.socialMedia?.instagramURL &&
												company.socialMedia?.instagramURL !== "undefined"
													? "pointer"
													: "default"
											}`,
										}}
										src={
											company.socialMedia?.instagramURL &&
											company.socialMedia?.instagramURL !== "undefined"
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
					<div className="flex flex-wrap">
						<div className="w-3/4">
							<h1 className="text-[36px] font-semibold">{company.name}</h1>
							<div className="mb-5">{company.biography}</div>
							{specificationsTypes.map((type) => {
								return (
									<div key={type}>
										<div className="my-3 font-poppins font-normal">{type}:</div>
										<div className="font-bold">
											<TextPillList
												textList={specifications
													.filter(
														(specification) => specification?.type === type
													)
													.map((specification) => specification?.name)}
												color={"#000000"}
												textColor={"#FFFFFF"}
											/>
										</div>
									</div>
								);
							})}
						</div>
						<div className="py-[16px] flex flex-col ml-2">
							{/* <a className="h-[48px] w-[250px] text-white text-center pt-[12px] bg-brightRed cursor-pointer select-none mb-[30px]">
								ADD TO OPPORTUNITY +
							</a> */}
							<div className="max-w-[250px] flex flex-wrap gap gap-[10px] overflow-x-hidden">
								<CompanyMediaGallery
									companyMediaList={companyMediaList}
									setCompanyMediasPerPage={setCompanyMediasPerPage}
									mediaPerPage={companyMediasPerPage}
									setTotalCompanyMedia={setTotalCompanyMedia}
									totalCompanyMedias={totalCompanyMedia}
								/>
								{totalCompanyMedia >= 7 && (
									<Pagination
										pageToGet={companyMediaPageToGet}
										setPageToGet={setCompanyMediaPageToGet}
										totalPages={totalCompanyMediaPages}
										itemsPerPage={companyMediasPerPage}
										totalItems={totalCompanyMedia}
									/>
								)}
							</div>
						</div>
					</div>

					<div className="text-[24px] leading-[48px] font-medium my-5">
						Confirmed Opportunities
					</div>

					<div className="flex flex-col gap-[15px]">
						{loadingOpportunities ? (
							<div>Loading</div>
						) : !opportunities ? (
							<h1 className="container h-screen w-screen flex items-center justify-center text-[48px]">
								This company has no opportunities
							</h1>
						) : opportunities.length > 0 ? (
							opportunities.map((opportunity, key) => {
								return (
									<OpportunityDetails
										image={opportunity.company?.mainImage}
										members={opportunity?.companies}
										specifications={opportunity?.specifications}
										companyName={opportunity.company?.name}
										opportunityName={opportunity.title}
										mainText={opportunity.description}
										connectButton={true}
										key={key}
									/>
								);
							})
						) : (
							<p>This company has no opportunities</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MemberProfile;
