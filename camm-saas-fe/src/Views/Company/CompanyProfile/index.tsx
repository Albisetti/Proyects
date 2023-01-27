import React, { useContext, useEffect, useState, FC } from "react";
import OpportunityDetails from "../../../Components/OpportunityDetails";
import Button from "../../../Components/Utils/Buttons/Button";
import { AuthContext } from "../../../auth";
import { useNavigate, useParams } from "react-router-dom";
import Company from "../../../Models/Company";
import Opportunity from "../../../Models/Opportunity";
import Modal from "../../../Components/Utils/Modal";
import EditCompanyModal from "../../../Components/EditCompanyModal";
import PriorDeleteModal from "../../../Components/DeleteModals/PriorDeleteModal";
import ConfirmedDeletedModal from "../../../Components/DeleteModals/ConfirmedDeletedModal";
import PortraitInput from "../../../Components/PortraitInput";
import TextPillList from "../../../Components/TextPillList";
import Specification from "../../../Models/Specification";
import CompanyMediaGallery from "../../../Components/CompanyMediaGallery";
import { PaginationItems } from "../../../Models/Utils/paginationItems";
import CompanyMedia from "../../../Models/CompanyMedia";
import Pagination from "../../../Components/Utils/Pagination";

const CompanyProfile: FC = () => {
	const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
	const [specifications, setSpecifications] = useState<Specification[]>([]);
	const [specificationsTypes, setSpecificationsTypes] = useState<string[]>([]);
	const [loadingOpportunities, setLoadingOpportunities] = useState(false);
	const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
	const [showPriorDeleteModaL, setShowPriorDeleteModal] = useState(false);
	const [showConfirmedDeleteModal, setShowConfirmedDeleteModal] =
		useState(false);
	const [currentCompany, setCurrentCompany] = useState<Company | undefined>();
	const [loading, setLoading] = useState(false);
	const { token, user } = useContext(AuthContext);
	const { slug } = useParams();
	const navigate = useNavigate();

	if (!slug) {
		return null;
	}
	const DeleteCompanyFunction = (company: Company) => {
		company.delete(token).then((response) => {
			if (response) {
				setShowPriorDeleteModal(false);
				setShowConfirmedDeleteModal(true);
			}
		});
	};
	useEffect(() => {
		setLoading(true);
		const setUser = async () => {
			if (slug) {
				await Company.getCompany(token, parseInt(slug)).then((res) => {
					setLoading(false);
					setCurrentCompany(res.company);
				});
			}
			setLoading(false);
		};
		setUser();
	}, []);

	useEffect(() => {
		setLoadingOpportunities(true);
		if (opportunities.length === 0) {
			currentCompany
				?.getOpportunities(token, ["company", "specifications", "users"], 7)
				.then((res) => {
					setOpportunities(res.opportunities);
					setLoadingOpportunities(false);
				})
				.catch(() => setLoadingOpportunities(false));
		}
		if (currentCompany?.id) {
			currentCompany
				?.getCompanySpecifications(token, currentCompany?.id, 1)
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
		}
	}, [currentCompany]);

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

	function getCompanyMedia() {
		if (currentCompany?.id) {
			CompanyMedia.getCompanyMedias(
				token,
				currentCompany.id,
				companyMediaPageToGet
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
		}
	}

	useEffect(() => {
		if (currentCompany?.id) {
			//TODO: is this the valid approach to enforce id as a number or no results?
			getCompanyMedia();
		}
	}, [currentCompany?.id]);

	return (
		<>
			{loading ? (
				<div></div>
			) : !currentCompany ? (
				<h1 className="container h-screen w-screen flex items-center justify-center text-[48px]">
					There is no Company for the provided ID
				</h1>
			) : (
				<div className="w-full h-full flex  mt-[127px] font-roboto mb-[20px]">
					<Modal
						modalActive={showEditCompanyModal}
						modalActiveControl={() => setShowEditCompanyModal(false)}
					>
						<EditCompanyModal
							activeCompany={currentCompany}
							setActiveDeleteModal={() => setShowEditCompanyModal(false)}
							setCompany={setCurrentCompany}
							setEditModalActive={() => setShowEditCompanyModal(false)}
							getCompanyMedia={getCompanyMedia}
						/>
					</Modal>
					<PriorDeleteModal
						instanceToDelete="company"
						active={showPriorDeleteModaL}
						deleteFunction={() => DeleteCompanyFunction(currentCompany)}
						setActiveDeleteModal={() => setShowPriorDeleteModal(false)}
					/>
					<ConfirmedDeletedModal
						instanceToDelete="Company"
						active={showConfirmedDeleteModal}
						setActiveConfirmedDeleteModal={() => {
							setShowConfirmedDeleteModal(false);
							navigate("/manage-companies");
						}}
					/>

					<div className="flex flex-col items-center text-center w-[390px] justify-between w-min-[390px]">
						<div className="flex flex-col items-center text-center w-[390px] fixed ">
							<div className="">
								<PortraitInput
									id={""}
									portraitImage={currentCompany?.mainImage}
									rounded={true}
								/>
							</div>
							<div className="w-[150px] h-[150px]">
								{" "}
								<PortraitInput
									portraitImage={currentCompany?.mainImage}
									rounded
									id=""
								/>
							</div>

							<div className="flex gap-[19px] mt-[25px]">
								<img
									onClick={(e) => {
										e.preventDefault();
										if (
											currentCompany?.socialMedia?.facebookURL &&
											currentCompany?.socialMedia.facebookURL !== "undefined"
										) {
											window.open(
												`${currentCompany?.socialMedia?.facebookURL}`,
												"_blank"
											);
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
											window.open(
												`${currentCompany?.socialMedia?.twitterURL}`,
												"_blank"
											);
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
											? "../assets/twitterLogo.svg"
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
											window.open(
												`${currentCompany?.socialMedia?.linkedinURL}`,
												"_blank"
											);
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
											? "../assets/linkednLogo.svg"
											: "/assets/linkednLogoGray.svg"
									}
								></img>
								<img
									onClick={(e) => {
										e.preventDefault();
										if (
											currentCompany?.socialMedia?.instagramURL &&
											currentCompany?.socialMedia?.instagramURL !== "undefined"
										) {
											window.open(
												`${currentCompany?.socialMedia?.instagramURL}`,
												"_blank"
											);
										}
									}}
									className="cursor-pointer"
									style={{
										cursor: `${
											currentCompany?.socialMedia?.instagramURL &&
											currentCompany?.socialMedia?.instagramURL !== "undefined"
												? "pointer"
												: "default"
										}`,
									}}
									src={
										currentCompany?.socialMedia?.instagramURL &&
										currentCompany?.socialMedia?.instagramURL !== "undefined"
											? "../assets/instagramLogo.svg"
											: "/assets/instagramLogoGray.svg"
									}
								></img>
							</div>
							<div className="text-[24px] leading-[48px] mt-[2px]">
								{currentCompany?.name}
							</div>
							<button className="w-[80px] h-[28px]  rounded-xl bg-softGreen text-white text-[14px] leading-[24px] mt-[18px]">
								ACTIVE
							</button>
							{(user?.roles?.includes("Super Admin") ||
								user?.company?.id === currentCompany?.id) && (
								<>
									<div
										onClick={() => setShowEditCompanyModal(true)}
										className="bg-brightRed w-[36px] h-[36px] rounded-full cursor-pointer flex justify-center mt-[16px]"
									>
										<img className="" src="/assets/pencil.svg"></img>
									</div>
									<span className="mt-[20px]">
										<Button
											action={() => {
												setShowPriorDeleteModal(true);
											}}
											text="delete company"
										/>
									</span>
								</>
							)}
						</div>
					</div>

					<div className="border-l border-gray-1 pl-[29px]">
						<div className="flex flex-col lg:flex-row gap-2 pr-2">
							<div>
								<div className="mb-5">{currentCompany?.biography}</div>

								{specificationsTypes.map((type) => {
									return (
										<div key={type}>
											<div className="my-3 font-poppins font-normal">
												{type}:
											</div>
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
							<div>
								<CompanyMediaGallery
									companyMediaList={companyMediaList}
									setCompanyMediasPerPage={setCompanyMediasPerPage}
									mediaPerPage={companyMediasPerPage}
									setTotalCompanyMedia={setTotalCompanyMedia}
									totalCompanyMedias={totalCompanyMedia}
								/>

								{totalCompanyMedia > 50 && (
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

						<div className="text-[24px] leading-[48px] mb-[8px] font-medium">
							OPPORTUNITIES
						</div>
						<div className="flex flex-col gap-[15px] ">
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
											opportunityId={opportunity?.id}
											opportunity={opportunity}
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
			)}
		</>
	);
};

export default CompanyProfile;
