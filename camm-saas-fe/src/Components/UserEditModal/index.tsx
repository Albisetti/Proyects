import React, { FC, useState, useEffect, useContext, ChangeEvent } from "react";
import User from "../../Models/User";
import { AuthContext } from "../../auth";
import PortraitInput from "../PortraitInput";
import Button from "../Utils/Buttons/Button";
import Specification from "../../Models/Specification";
import Select from "react-select";
import Company from "../../Models/Company";

type UserEditModalProps = {
	active: boolean;
	user: User;
	setActiveUserEditModal: () => void;
	setUser?: React.Dispatch<React.SetStateAction<User | undefined>>;
	companyList?: Company[];
	isHeader?: boolean;
};

const UserEditModal: FC<UserEditModalProps> = ({
	active,
	user,
	setActiveUserEditModal,
	setUser,
	companyList,
	isHeader,
}: UserEditModalProps) => {
	const [userData, setUserData] = useState<{
		firstName?: string | undefined;
		lastName?: string | undefined;
		organization?: number | undefined;
		email?: string | undefined;
		profileImage?: string | undefined;
		biography?: string | undefined;
		instagram?: string | undefined;
		facebook?: string | undefined;
		twitter?: string | undefined;
		linkedIn?: string | undefined;
		specifications?: Array<number> | undefined;
	}>();
	const { token } = useContext(AuthContext);
	const [showMissingFields, setShowMissingFields] = useState({
		message: "",
		show: false,
	});

	const [formMainImage, setFormMainImage] = useState<Blob | MediaSource>();

	const [imagePreview, setImagePreview] = useState<string | undefined>(
		user?.profileImage
	);
	const [editStatus, setEditStatus] = useState("");

	const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
		if (e?.target?.files && e?.target?.files?.length > 0) {
			setImagePreview(URL.createObjectURL(e.target.files[0]));
			setFormMainImage(e.target.files[0]);
		}
	};
	const [showInvalidEmail, setShowInvalidEmail] = useState(false);
	const [specifications, setSpecifications] = useState<
		Array<Specification> | undefined
	>();
	const [formSpecifications, setFormSpecifications] = useState<Array<number>>(
		[]
	);
	const [specificationsToRemove, setSpecificationsToRemove] = useState<
		Array<number>
	>([]);
	const [userSpecifications, setUserSpecifications] = useState<
		Array<Specification> | undefined
	>();

	const [organizationSearch, setOrganizationSearch] = useState<string>();
	const [organizationOptions, setOrganizationOptions] =
		useState<{ value: number; label: string }[]>();

	const [organizationSelectValue, setOrganizationSelectValue] = useState<
		{ value: number; label: string } | undefined
	>();

	useEffect(() => {
		setShowMissingFields({
			message: "",
			show: false,
		});
		setImagePreview(user?.profileImage);

		if (user?.company?.id && !user?.company?.name) {
			Company.getCompany(token, user?.company?.id).then((company) => {
				user.company = company.company;

				if (user?.company?.id && user?.company?.name) {
					setOrganizationSelectValue({
						value: user?.company?.id,
						label: user?.company?.name,
					});
				} else {
					setOrganizationSelectValue(undefined);
				}
			});

			setOrganizationSelectValue(undefined);
		}

		if (user?.id) {
			user.getUserSpecifications(token, user?.id, 1).then((result) => {
				setUserSpecifications(result.specifications);
				specifications?.forEach((specification) => {
					if (specification?.id) {
						const newFormSpecifications = [
							...formSpecifications,
							specification?.id,
						];
						setFormSpecifications(newFormSpecifications);
					}
				});
			});
		}

		setUserData({
			firstName: user?.firstName,
			lastName: user?.lastName,
			organization: user?.company?.id,
			email: user?.email,
			profileImage: imagePreview,
			biography: user?.biography,
			instagram: user?.socialMedia?.instagramURL,
			twitter: user?.socialMedia?.twitterURL,
			facebook: user?.socialMedia?.facebookURL,
			linkedIn: user?.socialMedia?.linkedinURL,
			//specifications: specification?//TODO: load existing specification?
		});
	}, [
		user,
		// specification=[]
	]);

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

	const handleSubmit = () => {
		setEditStatus("Saving...");
		showMissingFields.message = "";
		let currentMessage = showMissingFields.message;

		if (userData?.firstName == "") {
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

		setShowInvalidEmail(!userData?.email?.includes("@"));
		if (currentMessage == "" && showInvalidEmail == false) {
			user
				.update(
					token,
					userData?.firstName,
					userData?.lastName,
					userData?.biography,
					userData?.email,
					formMainImage,
					userData?.twitter,
					userData?.instagram,
					userData?.linkedIn,
					userData?.facebook,
					formSpecifications,
					specificationsToRemove,
					userData?.organization
				)
				.then((response) => {
					if (response !== false && response instanceof User) {
						if (setUser) setUser(response);
						setEditStatus("Saved");
						if (isHeader)
							localStorage.setItem("user", JSON.stringify(response));
						if (setActiveUserEditModal) setActiveUserEditModal();
					} else {
						setEditStatus("Oops! Something went wrong...");
					}

					if (!active) setOrganizationSelectValue(undefined);
				});
		}
	};

	const checkedSpecification = (specification: Specification) => {
		let response = false;
		if (specification?.id && specificationsToRemove.includes(specification?.id))
			return response;
		userSpecifications?.forEach((specificationUser) => {
			if (specification.id === specificationUser.id) {
				response = true;
			}
		});
		if (response) return response;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		response = formSpecifications?.includes(specification.id!);
		return response;
	};

	useEffect(() => {
		setEditStatus("");
		if (!isHeader) {
			setOrganizationSelectValue(undefined);
		}
	}, [active]);

	useEffect(() => {
		Specification.getAllSpecifications(token).then((result) => {
			setSpecifications(result);
		});
		if (!isHeader) {
			setOrganizationSelectValue(undefined);
		}
	}, []);

	useEffect(() => {
		const organizationList: { value: number; label: string }[] = [];
		let userCompanyPartOfInitialLoad = false;
		if (companyList) {
			companyList.map((company) => {
				if (company.id && company.name)
					organizationList.push({
						value: company.id,
						label: company.name,
					});

				if (user?.company?.id == company.id) {
					userCompanyPartOfInitialLoad = true;
				}
			});
			setOrganizationOptions(organizationList);
		}

		if (
			!userCompanyPartOfInitialLoad &&
			user?.company?.id &&
			user?.company?.name
		) {
			organizationList.push({
				value: user?.company?.id,
				label: user?.company?.name,
			});
		}

		if (user?.company?.id && user?.company?.name) {
			setOrganizationSelectValue({
				value: user?.company?.id,
				label: user?.company?.name,
			});
		}
	}, [companyList, user]);

	useEffect(() => {
		console.log(organizationSelectValue);
	}, [organizationSelectValue]);

	return (
		<div className="w-[900px] font-roboto text-[18px] text-gray bg-white">
			<img
				onClick={() => setActiveUserEditModal()}
				src="/crossBlack.svg"
				className="w-[20px] h-[20px] right-3 top-3 absolute  cursor-pointer "
			></img>
			<form className="flex  justify-between">
				<div className="flex flex-col justify-center items-center">
					<div className="text-[36px] leading-[48px] py-[39px]">
						EDIT PROFILE
					</div>

					<div className="flex mr-3">
						<div className="mr-3">
							<div className="mb-3">
								<p className="text-[10px] pb-[3px] font-semibold">First Name</p>
								<input
									value={userData?.firstName}
									onChange={(event) => {
										setUserData({
											...userData,
											firstName: event?.target?.value,
										});
									}}
									required
									type="text"
									className="focus:border-brightRed h-[30px] text-[15px] pr-8 form-control block w-full px-1 py-2  font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								/>
							</div>
							<div className="mb-3">
								<p className="text-[10px] pb-[3px] font-semibold">
									Organization
								</p>
								<Select
									key={user?.id}
									required
									value={organizationSelectValue}
									options={organizationOptions}
									onChange={(event) => {
										setUserData({
											...userData,
											organization: event?.value ? event.value : 0,
										});
										if (event?.value && event?.label)
											setOrganizationSelectValue({
												value: event?.value,
												label: event?.label,
											});

										if (!active) setOrganizationSelectValue(undefined);
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
								<p className="text-[10px] pb-[3px] font-semibold">Last Name</p>
								<input
									value={userData?.lastName}
									onChange={(event) => {
										setUserData({
											...userData,
											lastName: event?.target?.value,
										});
									}}
									required
									type="text"
									className="focus:border-brightRed h-[30px] text-[15px] pr-8 form-control block w-full px-1 py-2  font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								/>
							</div>

							<div className="mb-3">
								<p className="text-[10px] pb-[3px] font-semibold">Email</p>
								<input
									value={userData?.email}
									onChange={(event) => {
										setUserData({
											...userData,
											email: event?.target?.value,
										});
									}}
									required
									type="email"
									className="focus:border-brightRed h-[30px] form-control text-[15px] block w-full px-1 py-2  font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								/>
							</div>
						</div>
					</div>
					<div className="flex mt-4">
						<div className="mr-3">
							<div className="mb-3 relative">
								<img
									className="absolute mt-[27px] right-0 flex items-center px-2"
									src="/assets/instagramLogo.svg"
								></img>

								<p className="text-[10px] pb-[3px] font-semibold">Instagram</p>
								<input
									value={userData?.instagram}
									onChange={(event) => {
										setUserData({
											...userData,
											instagram: event?.target?.value,
										});
									}}
									required
									type="text"
									className="focus:border-brightRed h-[30px] text-[15px] form-control pr-8 block w-full px-1 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								/>
							</div>
							<div className="mb-3 relative">
								<img
									className="absolute mt-[28px] right-0 flex items-center px-2"
									src="/assets/facebookLogo.svg"
								></img>
								<p className="text-[10px] pb-[3px] font-semibold">Facebook</p>
								<input
									value={userData?.facebook}
									onChange={(event) => {
										setUserData({
											...userData,
											facebook: event?.target?.value,
										});
									}}
									required
									type="text"
									className="focus:border-brightRed h-[30px] text-[15px] pr-8 form-control block w-full px-1 py-2  font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								/>
							</div>
						</div>
						<div className="mr-3">
							<div className="mb-3 relative">
								<img
									className="absolute mt-[28px] right-0 flex items-center px-2"
									src="/assets/twitterLogo.svg"
								></img>
								<p className="text-[10px] pb-[3px] font-semibold">Twitter</p>

								<input
									value={userData?.twitter}
									onChange={(event) => {
										setUserData({
											...userData,
											twitter: event?.target?.value,
										});
									}}
									required
									type="text"
									className="focus:border-brightRed h-[30px] form-control text-[15px] block w-full px-1 py-2 pr-8  font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								/>
							</div>

							<div className="mb-3 relative">
								<img
									className="absolute mt-[28px] right-0 flex items-center px-3"
									src="/assets/linkednLogo.svg"
								></img>
								<p className="text-[10px] pb-[3px] font-semibold">LinkedIn</p>
								<input
									value={userData?.linkedIn}
									onChange={(event) => {
										setUserData({
											...userData,
											linkedIn: event?.target?.value,
										});
									}}
									required
									type="email"
									className="focus:border-brightRed h-[30px] form-control text-[15px] block w-full px-1 py-2 pr-8 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center">
					<div className="h-[200px] aspect-square">
						<PortraitInput
							key={user?.id + "header"}
							id={user?.id ? user?.id?.toString() : ""}
							portraitImage={imagePreview}
							rounded={true}
							inputAction={uploadImage}
						/>
					</div>
					<div className="">
						<p className="text-[10px] pb-[3px] font-semibold">Profile Image</p>
					</div>
					<div>
						<div className="w-[400px]">
							<p className="text-[10px] pb-[3px] font-semibold">Biography</p>
							<textarea
								value={userData?.biography !== null ? userData?.biography : ""}
								onChange={(event) => {
									setUserData({
										...userData,
										biography: event?.target?.value,
									});
								}}
								required
								className="focus:border-brightRed resize-none overflow-x-hidden h-[135px] form-control block w-full px-1 py-2 mb-[15px] text-[15px] text-xl font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none overflow-scroll "
							/>
						</div>
					</div>
					{/* <div>
						<div className="w-[400px] flex flex-col justify-between h-[150px] overflow-y-scroll">
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
											<label className="basis-1/2">{specification.name}</label>
											<input
												className="max-h-[16px]"
												type={"checkbox"}
												checked={checkedSpecification(specification)}
												onChange={(event) => {
													if (!specification?.id) return;
													if (!event?.target?.checked) {
														const newSpecificationsToRemove = [
															...specificationsToRemove,
															specification?.id,
														];
														setSpecificationsToRemove(
															newSpecificationsToRemove
														);
													} else {
														let newSpecificationsToRemove = [
															...specificationsToRemove,
														];
														newSpecificationsToRemove =
															newSpecificationsToRemove.filter(
																(specificationID) =>
																	specificationID !== specification?.id
															);
														setSpecificationsToRemove(
															newSpecificationsToRemove
														);
														if (
															formSpecifications.includes(specification?.id)
														) {
															let newFormSpecifications = [
																...formSpecifications,
															];
															newFormSpecifications =
																newFormSpecifications.filter(
																	(specificationID) =>
																		specificationID !== specification?.id
																);
															setFormSpecifications(newFormSpecifications);
														} else {
															const newFormSpecifications = [
																...formSpecifications,
																specification?.id,
															];
															setFormSpecifications(newFormSpecifications);
														}
													}
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
			<div className="flex flex-row-reverse justify-between mt-[30px]">
				<div className="flex flex-col gap-[10px] self-start mt-[20px] w-full">
					<div className="flex gap-[10px]">
						<Button
							text="cancel"
							style="outline"
							action={() => setActiveUserEditModal()}
						/>
						<Button text="confirm" action={() => handleSubmit()} />
					</div>
					<p>{editStatus}</p>
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
	);
};

export default UserEditModal;
