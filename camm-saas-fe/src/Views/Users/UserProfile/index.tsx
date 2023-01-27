import React, { FC, useContext, useEffect, useState } from "react";
import User from "../../../Models/User";
import OpportunityDetails from "../../../Components/OpportunityDetails";
import Button from "../../../Components/Utils/Buttons/Button";
import { AuthContext } from "../../../auth";
import { useParams } from "react-router-dom";
import Opportunity from "../../../Models/Opportunity";
import PortraitInput from "../../../Components/PortraitInput";
import Modal from "../../../Components/Utils/Modal";
import UserEditModal from "../../../Components/UserEditModal";
import PriorDeleteModal from "../../../Components/DeleteModals/PriorDeleteModal";
import ConfirmedDeletedModal from "../../../Components/DeleteModals/ConfirmedDeletedModal";
import { TabTitle } from "../../../Components/Utils/BrowserTitles";

type UserProfileProps = {
	user?: User;
};

const UserProfile: FC<UserProfileProps> = ({ user }: UserProfileProps) => {
	const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
	const [currentUser, setCurrentUser] = useState<User | undefined>(user);
	const [loading, setLoading] = useState(false);
	const [loadingOpportunities, setLoadingOpportunities] = useState(false);
	const [showEditUserModal, setShowEditUserModal] = useState(false);
	const [activeDeleteModal, setActiveDeleteModal] = useState(false);
	const [activeConfirmedDeleteModal, setActiveConfirmedDeleteModal] =
		useState(false);
	const { token } = useContext(AuthContext);
	const { slug } = useParams();

	if (!user && !slug) {
		return null;
	}
	const DeleteUserFunction = (user: User) => {
		user.delete(token).then((response) => {
			if (response) {
				setActiveDeleteModal(false);
				setActiveConfirmedDeleteModal(true);
			}
		});
	};
	useEffect(() => {
		setLoading(true);
		const setUser = async () => {
			if (!user && slug) {
				await User.getUser(token, parseInt(slug)).then((res) => {
					setLoading(false);
					setCurrentUser(res.user);
				});
			} else if (user?.id) {
				await User.getUser(token, user?.id).then((res) => {
					setLoading(false);
					setCurrentUser(res.user);
				});
			}
			setLoading(false);
		};
		setUser();
	}, []);

	useEffect(() => {
		setLoadingOpportunities(true);
		// if (opportunities.length === 0) {
		// 	currentUser
		// 		?.getOpportunities(token, ["company", "specifications", "users"], 7)
		// 		.then((res) => {
		// 			setOpportunities(res.opportunities);
		// 			setLoadingOpportunities(false);
		// 		})
		// 		.catch(() => setLoadingOpportunities(false));
		// }
	}, [currentUser]);

	if (currentUser?.firstName && currentUser.lastName) {
		TabTitle(`CAMM - ${currentUser?.firstName + " " + currentUser?.lastName}`);
	} else if (currentUser?.firstName) {
		TabTitle(`CAMM - ${currentUser?.firstName}`);
	} else if (currentUser?.lastName) {
		TabTitle(`CAMM - ${currentUser?.lastName}`);
	}
	return (
		<>
			{loading ? (
				<div></div>
			) : !currentUser ? (
				<h1 className="container h-screen w-screen flex items-center justify-center text-[48px]">
					There is no user for the provided ID
				</h1>
			) : (
				<div className="w-full h-full flex  mt-[127px] font-roboto mb-[20px]">
					<Modal
						modalActive={showEditUserModal}
						modalActiveControl={() => setShowEditUserModal(false)}
					>
						<UserEditModal
							key={"edit"}
							active={showEditUserModal}
							user={currentUser}
							setActiveUserEditModal={() => setShowEditUserModal(false)}
							setUser={setCurrentUser}
						/>
					</Modal>
					<PriorDeleteModal
						instanceToDelete="user"
						active={activeDeleteModal}
						deleteFunction={() => DeleteUserFunction(currentUser)}
						setActiveDeleteModal={() => setActiveDeleteModal(false)}
					/>
					<ConfirmedDeletedModal
						instanceToDelete="User"
						active={activeConfirmedDeleteModal}
						setActiveConfirmedDeleteModal={() =>
							setActiveConfirmedDeleteModal(false)
						}
					/>
					<div className="flex flex-col items-center text-center w-[390px] justify-between w-min-[390px]">
						<div className="flex flex-col items-center text-center w-[390px] fixed ">
							<div className="w-[150px] h-[150px] mb-2 ">
								<PortraitInput
									portraitImage={currentUser?.profileImage}
									id=""
									rounded={true}
								/>
							</div>
							<div className="flex gap-[19px] mt-[25px] ml-[2px]">
								<img
									onClick={(e) => {
										e.preventDefault();
										if (
											currentUser?.socialMedia?.facebookURL &&
											currentUser?.socialMedia.facebookURL !== "undefined"
										) {
											window.open(
												`${currentUser?.socialMedia?.facebookURL}`,
												"_blank"
											);
										}
									}}
									className="cursor-pointer"
									style={{
										cursor: `${
											currentUser?.socialMedia?.facebookURL &&
											currentUser?.socialMedia?.facebookURL !== "undefined"
												? "pointer"
												: "default"
										}`,
									}}
									src={
										currentUser?.socialMedia?.facebookURL &&
										currentUser?.socialMedia?.facebookURL !== "undefined"
											? "../assets/facebookLogo.svg"
											: "../assets/facebookLogoGray.svg"
									}
								></img>
								<img
									onClick={(e) => {
										e.preventDefault();
										if (
											currentUser?.socialMedia?.twitterURL &&
											currentUser?.socialMedia?.twitterURL !== "undefined"
										) {
											window.open(
												`${currentUser?.socialMedia?.twitterURL}`,
												"_blank"
											);
										}
									}}
									className="cursor-pointer"
									style={{
										cursor: `${
											currentUser?.socialMedia?.twitterURL &&
											currentUser?.socialMedia?.twitterURL !== "undefined"
												? "pointer"
												: "default"
										}`,
									}}
									src={
										currentUser?.socialMedia?.twitterURL &&
										currentUser?.socialMedia?.twitterURL !== "undefined"
											? "../assets/twitterLogo.svg"
											: "/assets/twitterLogoGray.svg"
									}
								></img>
								<img
									onClick={(e) => {
										e.preventDefault();
										if (
											currentUser?.socialMedia?.linkedinURL &&
											currentUser?.socialMedia?.linkedinURL !== "undefined"
										) {
											window.open(
												`${currentUser?.socialMedia?.linkedinURL}`,
												"_blank"
											);
										}
									}}
									className="cursor-pointer"
									style={{
										cursor: `${
											currentUser?.socialMedia?.linkedinURL &&
											currentUser?.socialMedia?.linkedinURL !== "undefined"
												? "pointer"
												: "default"
										}`,
									}}
									src={
										currentUser?.socialMedia?.linkedinURL &&
										currentUser?.socialMedia?.linkedinURL !== "undefined"
											? "../assets/linkednLogo.svg"
											: "/assets/linkednLogoGray.svg"
									}
								></img>
								<img
									onClick={(e) => {
										e.preventDefault();
										if (
											currentUser?.socialMedia?.instagramURL &&
											currentUser?.socialMedia?.instagramURL !== "undefined"
										) {
											window.open(
												`${currentUser?.socialMedia?.instagramURL}`,
												"_blank"
											);
										}
									}}
									className="cursor-pointer"
									style={{
										cursor: `${
											currentUser?.socialMedia?.instagramURL &&
											currentUser?.socialMedia?.instagramURL !== "undefined"
												? "pointer"
												: "default"
										}`,
									}}
									src={
										currentUser?.socialMedia?.instagramURL &&
										currentUser?.socialMedia?.instagramURL !== "undefined"
											? "../assets/instagramLogo.svg"
											: "/assets/instagramLogoGray.svg"
									}
								></img>
							</div>
							<div className="text-[24px] leading-[48px] mt-[2px]">
								{currentUser?.firstName}
							</div>
							<div className="text-[24px] leading-[48px]">Organization</div>
							<button className="w-[80px] h-[28px]  rounded-xl bg-softGreen text-white text-[14px] leading-[24px] mt-[18px]">
								ACTIVE
							</button>
							<div
								onClick={() => setShowEditUserModal(true)}
								className="bg-brightRed w-[36px] h-[36px] rounded-full cursor-pointer flex justify-center mt-[16px]"
							>
								<img className="" src="/assets/pencil.svg"></img>
							</div>
							<span className="mt-[20px]">
								<Button
									action={() => {
										setActiveDeleteModal(true);
									}}
									text="delete user"
								/>
							</span>
						</div>
					</div>
					<div className="border-l border-gray-1 pl-[29px]">
						<div className="text-[24px] leading-[48px] mb-[8px] font-medium">
							OPPORTUNITIES
						</div>
						<div className="flex flex-col gap-[15px] ">
							{loadingOpportunities ? (
								<div></div>
							) : !opportunities ? (
								<h1 className="container h-screen w-screen flex items-center justify-center text-[48px]">
									There is no user for the provided ID
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
								<p>This user has no opportunities</p>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default UserProfile;
