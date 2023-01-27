import React, {
	FC,
	ReactElement,
	useContext,
	useEffect,
	useState,
} from "react";
import { AuthContext } from "../../../auth";
import { useNavigate } from "react-router-dom";
import Button from "../../Utils/Buttons/Button";
import PortraitInput from "../../PortraitInput";
import Modal from "../../Utils/Modal";
import UserEditModal from "../../UserEditModal";
import Company from "../../../Models/Company";
import User from "../../../Models/User";

type HeaderProps = {
	setShowAuthModal: React.Dispatch<
		React.SetStateAction<{
			signUp: boolean;
			logIn: boolean;
		}>
	>;
};

const menuStyle =
	"font-poppins font-bold w-1/3 flex justify-center self-center font-[60px]";
const subMenuStyles = "cursor-pointer py-2 px-4 block whitespace-no-wrap";

const LoggedInHeader: FC<HeaderProps> = (): ReactElement => {
	const { logout, user, token } = useContext(AuthContext);
	const [activeUserEditModal, setActiveUserEditModal] = useState(false);
	const [companyList, setCompanyList] = useState<Company[]>();
	const [userState, setUserState] = useState<User>(user);
	useEffect(() => {
		Company.getCompanies(token, 1).then((res) => {
			//TODO: apparently their is a second getCompany somwhere, could we combine and reduce the amount of calls made?
			setCompanyList(res.companies);
		});
	}, []);
	const navigate = useNavigate();

	useEffect(() => {
		if (user?.company?.id) {
			Company.getCompany(token, user?.company?.id).then((response) => {
				let userNew = new User("");
				userNew = user;
				userNew.company = response?.company;
				setUserState(userNew);
			});
		}
	}, [user]);

	return (
		<>
			<div
				className={`bg-paleRed fixed w-full z-[90]
				 h-[80px] top-0 left-0`}
			>
				<Modal
					modalActive={activeUserEditModal}
					modalActiveControl={() => setActiveUserEditModal(false)}
				>
					<UserEditModal
						key={"header"}
						active={activeUserEditModal}
						user={userState}
						setActiveUserEditModal={() => setActiveUserEditModal(false)}
						companyList={companyList}
						isHeader
					/>
				</Modal>
				<header className="bg-paleRed flex justify-between">
					<div className="ml-5 py-5 w-1/5 justify-start">
						<a className="flex" href="/">
							<img className="h-[48px] w-[176px] " src="/CammLogo.png" alt="" />
						</a>
					</div>

					<div className="flex md:w-3/5 justify-end md:justify-center items-center">
						<div className="md:flex   md:justify-center md:align-center text-brightRed text-[16px] w-2/3">
							<a className={menuStyle} onClick={() => navigate("/directory")}>
								DIRECTORY
							</a>
							<div className={`${menuStyle} group`}>
								<a
									className={menuStyle}
									onClick={() => navigate("/opportunities")}
								>
									OPPORTUNITIES
								</a>
								{user?.company?.isMember == false && (
									<ul className="absolute hidden group-hover:block bg-paleRed pt-5 mt-6 ml-8">
										<li>
											<a
												className={`${subMenuStyles}`}
												onClick={() => navigate("/create-opportunity")}
											>
												Request New Opportunity
											</a>
										</li>
									</ul>
								)}
							</div>
							{user?.roles?.includes("Super Admin") && (
								<div className={`${menuStyle} group`}>
									<a className="">MANAGE</a>
									<ul className="absolute hidden group-hover:block bg-paleRed pt-5 mt-6 ml-8">
										<li>
											<a
												className={`${subMenuStyles}`}
												onClick={() => navigate("/manage-users")}
											>
												Users
											</a>
										</li>
										<li>
											<a
												className={`${subMenuStyles}`}
												onClick={() => navigate("/manage-companies")}
											>
												Companies
											</a>
										</li>
										<li>
											<a
												className={`${subMenuStyles}`}
												onClick={() => navigate("/manage-opportunities")}
											>
												Opportunities
											</a>
										</li>
									</ul>
								</div>
							)}
							{!user?.roles?.includes("Super Admin") && (
								<a
									className={menuStyle}
									onClick={() => navigate("/directory-listing")}
								>
									COMPANIES
								</a>
							)}
							{user?.company && user?.company?.isMember && (
								<a
									className={menuStyle}
									onClick={() =>
										navigate(`/member-profile/${user?.company?.id}`)
									}
								>
									MY COMPANY
								</a>
							)}
							{user?.company && !user?.company?.isMember && (
								<a
									className={menuStyle}
									onClick={() => navigate(`/company/${user?.company?.id}`)}
								>
									MY COMPANY
								</a>
							)}
						</div>
					</div>

					<div className="py-[16px] pr-[30px] flex flex-row w-1/5 justify-end">
						<div className="">
							<Button
								text="log out"
								action={() => {
									logout();
									navigate("/");
								}}
							/>
						</div>

						<div
							className="cursor-pointer ml-5"
							onClick={() => setActiveUserEditModal(true)}
						>
							<div className="w-[48px] h-[48px] mb-2">
								<div className="flex w-full h-full ">
									<label className="cursor-pointer relative h-full w-full group">
										<div
											className={
												"w-full h-full absolute top-0 left-0 bg-no-repeat bg-cover bg-center rounded-full"
											}
											style={{
												backgroundImage: `url(${
													user?.profileImage
														? user?.profileImage
														: user?.profileImage
												})`,
											}}
										/>
									</label>
								</div>
							</div>
						</div>
					</div>
				</header>
			</div>
		</>
	);
};

export default LoggedInHeader;
