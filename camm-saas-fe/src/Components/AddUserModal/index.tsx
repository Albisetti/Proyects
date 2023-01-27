import React, { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import cx from "classnames";
import PortraitInput from "../PortraitInput";
import User from "../../Models/User";
import { AuthContext } from "../../auth";
import Specification from "../../Models/Specification";
import Select from "react-select";
import Company from "../../Models/Company";

type AddUserModalProps = {
	active: boolean;
	setActiveAddModal: () => void;
	getUsers: () => void;
	companyList?: Company[];
};

const AddUserModal: FC<AddUserModalProps> = ({
	active,
	setActiveAddModal,
	getUsers,
	companyList
}: AddUserModalProps) => {
	const [showMissingFields, setShowMissingFields] = useState({
		message: "",
		show: false,
	});
	const [showInvalidEmail, setShowInvalidEmail] = useState(false);
	const [formProfileImage, setFormProfileImage] = useState<
		Blob | MediaSource
	>();
	const [userData, setUserData] = useState({
		firstName: "",
		lastName: "",
		organization: 0,
		email: "",
		profileImage: "",
		biography: "",
		instagram: "",
		facebook: "",
		twitter: "",
		linkedn: "",
		specifications: [],
	});
	const [specifications, setSpecifications] = useState<
		Array<Specification> | undefined
	>();

	const [imagePreview, setImagePreview] = useState<string | undefined>();
	const [formSpecifications, setFormSpecifications] = useState<Array<number>>(
		[]
	);

	const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
		if (e?.target?.files && e?.target?.files?.length > 0) {
			setFormProfileImage(e.target.files[0]);
			setImagePreview(URL.createObjectURL(e.target.files[0]));
		}
	};

	const [organizationSearch, setOrganizationSearch] = useState<string>();
	const [organizationOptions, setOrganizationOptions] =
		useState<{ value: number; label: string }[]>();

	const { token } = useContext(AuthContext);

	useEffect(() => {
		if (!organizationSearch) return;
		Company.searchCompanies(token, organizationSearch, 1).then((response) => {
			const newOrganizationOptionsArray: { value: number; label: string }[] =
				[];
			response?.companies?.forEach((company) => {
				if (!company?.id || !company?.name) return;
				const newCompanyForArray = { value: company?.id, label: company?.name };
				newOrganizationOptionsArray.push(newCompanyForArray);
			});
			setOrganizationOptions(newOrganizationOptionsArray);
		});
	}, [organizationSearch]);

	useEffect(() => {
		if(companyList) {
			const organizationList:{ value: number; label: string }[] = [];
			companyList.map(company=>{
				if(company.id && company.name)
					organizationList.push({
						value: company.id,
						label: company.name
					});
			});
			setOrganizationOptions(organizationList);
		}
	}, [companyList]);

	useEffect(() => {
		Specification.getAllSpecifications(token).then((result) => {
			setSpecifications(result);
		});
	}, []);

	return (
		<div
			className={cx(
				"fixed top-[0] left-[0] w-screen h-screen mt-[100px]  justify-center ",
				active ? "flex animate-fadeIn" : "hidden"
			)}
		>
			<div className="">
				<div className="w-[900px] h-[550px] shadow-sm shadow-grey rounded-md  font-roboto text-[18px] text-gray bg-white pt-[15px] relative p-[20px]">
					<img
						onClick={() => {
							setUserData({
								firstName: "",
								lastName: "",
								organization: 0,
								email: "",
								profileImage: "",
								biography: "",
								instagram: "",
								facebook: "",
								twitter: "",
								linkedn: "",
								specifications: [],
							});
							setShowMissingFields({
								message: "",
								show: false,
							});
							setShowInvalidEmail(false);
							setActiveAddModal();
						}}
						src="/crossBlack.svg"
						className="w-[20px] h-[20px] right-3 top-3 absolute  cursor-pointer "
					></img>
					<form className="flex  justify-between">
						<div className="flex flex-col justify-center items-center">
							<div className="text-[36px] leading-[48px] py-[39px]">
								ADD USER
							</div>
							<div className="flex mr-3  px-[6px]">
								<div className="mr-3 ">
									<div className="mb-3 ">
										<p className="text-[10px] pb-[3px] font-semibold">
											First Name
										</p>
										<input
											value={userData.firstName}
											onChange={(event) => {
												setUserData({
													...userData,
													firstName: event?.target?.value,
												});
											}}
											required
											type="text"
											className="focus:border-brightRed h-[30px] text-[15px] pr-8 form-control block w-full px-4 py-2  font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
										/>
									</div>
									<div className="mb-3">
										<p className="text-[10px] pb-[3px] font-semibold">
											Organization
										</p>
										<Select
											required
											options={organizationOptions}
											onChange={(event) => {
												setUserData({
													...userData,
													organization: event?.value ? event.value : 0 ,
												});
											}}
											onInputChange={(event) => {
												setOrganizationSearch(event);
											}}
											className="focus:border-brightRed form-control block w-full text-xl font-normal bg-white bg-clip-padding rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
										/>
									</div>
								</div>
								<div>
									<div className="mb-3">
										<p className="text-[10px] pb-[3px] font-semibold">
											Last Name
										</p>
										<input
											value={userData.lastName}
											onChange={(event) => {
												setUserData({
													...userData,
													lastName: event?.target?.value,
												});
											}}
											required
											type="text"
											className="focus:border-brightRed h-[30px] text-[15px] pr-8 form-control block w-full px-4 py-2  font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
										/>
									</div>

									<div className="mb-3">
										<p className="text-[10px] pb-[3px] font-semibold">Email</p>
										<input
											value={userData.email}
											onChange={(event) => {
												setUserData({
													...userData,
													email: event?.target?.value,
												});
											}}
											required
											type="email"
											className="focus:border-brightRed h-[30px] form-control text-[15px] block w-full px-4 py-2  font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
										/>
									</div>
								</div>
							</div>
							<div className="flex mt-4 px-[6px]">
								<div className="mr-3">
									<div className="mb-3 relative">
										<img
											className="absolute mt-[27px] right-0 flex items-center px-2"
											src="./assets/instagramLogo.svg"
										></img>

										<p className="text-[10px] pb-[3px] font-semibold">
											Instagram
										</p>
										<input
											value={userData.instagram}
											onChange={(event) => {
												setUserData({
													...userData,
													instagram: event?.target?.value,
												});
											}}
											required
											type="text"
											className="focus:border-brightRed h-[30px] text-[15px] form-control pr-8 block w-full px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
										/>
									</div>
									<div className="mb-3 relative">
										<img
											className="absolute mt-[28px] right-0 flex items-center px-2"
											src="./assets/facebookLogo.svg"
										></img>
										<p className="text-[10px] pb-[3px] font-semibold">
											Facebook
										</p>
										<input
											value={userData.facebook}
											onChange={(event) => {
												setUserData({
													...userData,
													facebook: event?.target?.value,
												});
											}}
											required
											type="text"
											className="focus:border-brightRed h-[30px] text-[15px] pr-8 form-control block w-full px-4 py-2  font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
										/>
									</div>
								</div>
								<div className="mr-3">
									<div className="mb-3 relative">
										<img
											className="absolute mt-[28px] right-0 flex items-center px-2"
											src="./assets/twitterLogo.svg"
										></img>
										<p className="text-[10px] pb-[3px] font-semibold">
											Twitter
										</p>

										<input
											value={userData.twitter}
											onChange={(event) => {
												setUserData({
													...userData,
													twitter: event?.target?.value,
												});
											}}
											required
											type="text"
											className="focus:border-brightRed h-[30px] form-control text-[15px] block w-full px-4 py-2 pr-8  font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
										/>
									</div>

									<div className="mb-3 relative">
										<img
											className="absolute mt-[28px] right-0 flex items-center px-3"
											src="./assets/linkednLogo.svg"
										></img>
										<p className="text-[10px] pb-[3px] font-semibold">
											Linkedn
										</p>
										<input
											value={userData.linkedn}
											onChange={(event) => {
												setUserData({
													...userData,
													linkedn: event?.target?.value,
												});
											}}
											required
											type="email"
											className="focus:border-brightRed h-[30px] form-control text-[15px] block w-full px-4 py-2 pr-8 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-col items-center">
							<div className="h-[200px] aspect-square">
								<PortraitInput
									id="add"
									portraitImage={imagePreview}
									rounded={true}
									inputAction={uploadImage}
								/>
							</div>
							<div className="">
								<p className="text-[10px] pb-[3px] font-semibold">
									Profile Image
								</p>
							</div>
							<div>
								<div className="w-[400px]">
									<p className="text-[10px] pb-[3px] font-semibold">
										Biography
									</p>
									<textarea
										value={userData.biography}
										onChange={(event) => {
											setUserData({
												...userData,
												biography: event?.target?.value,
											});
										}}
										style={{
											resize: "none",
											overflowX: "hidden",
										}}
										required
										className="focus:border-brightRed h-[140px] form-control block w-full px-4 py-2 mb-[15px] text-[15px] text-xl font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none overflow-scroll "
									/>
								</div>
							</div>
							{/* <div>
								<div className="w-[400px] flex flex-col justify-between h-[100px] overflow-y-scroll">
									<p className="text-[10px] pb-[3px] font-semibold">
										Specifications
									</p>
									<div>
										{specifications?.map((specification: Specification) => {
											return (
												<div
													className="grid grid-cols-2 gap-4 my-2"
													key={specification.id}
												>
													<label className="basis-1/2">
														{specification.name}
													</label>
													<input
														className="max-h-[16px]"
														type={"checkbox"}
														onClick={() => {
															if (!specification?.id) return;
															const newFormSpecifications = [
																...formSpecifications,
																specification?.id,
															];
															setFormSpecifications(newFormSpecifications);
														}}
													/>
												</div>
											);
										})}
									</div>
								</div>
							</div> */}
						</div>
					</form>
					<div className="flex flex-row-reverse justify-between mt-[80px]">
						<div className="flex justify-center">
							<button
								onClick={() => {
									showMissingFields.message = "";
									let currentMessage = showMissingFields.message;

									if (userData.firstName == "") {
										currentMessage += "first name. ";
									}
									if (userData?.lastName == "") {
										currentMessage += "last name, ";
									}
									if (userData?.email == "") {
										currentMessage += "email, ";
									}

									if (userData?.organization == 0) {
										currentMessage += "organization, ";
									}

									if (currentMessage == "") {
										setShowMissingFields({
											message: "",
											show: false,
										});
									} else {
										setShowMissingFields({
											message: "Missing: " + currentMessage.slice(0, -2),
											show: true,
										});
									}

									setShowInvalidEmail(!userData?.email.includes("@"));
									if (currentMessage == "" && showInvalidEmail == false) {
										const userToAdd = new User(
											userData?.email,
											undefined,
											undefined,
											userData?.firstName,
											userData?.lastName,
											userData?.biography,
											{
												instagramURL: userData?.instagram,
												facebookURL: userData?.facebook,
												linkedinURL: userData?.linkedn,
												twitterURL: userData?.twitter,
											},
											userData?.profileImage,
											undefined
										);
										userToAdd
											.create(
												token,
												userToAdd?.firstName,
												userToAdd?.lastName,
												userToAdd?.biography,
												userToAdd?.email,
												formProfileImage,
												userToAdd?.socialMedia,
												formSpecifications,
												userData.organization
											)
											.then(() => {
												getUsers();
												setActiveAddModal();
											});
									}
								}}
								type="submit"
								className="bg-brightRed w-[110px] h-[50px] text-white"
							>
								ADD USER
							</button>
						</div>
						<div className="flex flex-col items-start">
							<p
								className={`${
									showMissingFields.show ? "block " : "hidden"
								} text-[12px] flex items-center justify-center text-brightRed`}
							>
								{showMissingFields?.message}
							</p>
							<p
								className={`${
									showInvalidEmail ? "block " : "hidden"
								} text-[12px] flex items-center justify-center text-brightRed`}
							>
								Invalid email
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddUserModal;
