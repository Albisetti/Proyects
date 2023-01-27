import React, { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import Company from "../../Models/Company";
import { AuthContext } from "../../auth";
import PortraitInput from "../PortraitInput";
import Button from "../Utils/Buttons/Button";
import Specification from "../../Models/Specification";

type AddCompanyModalProps = {
	setActiveAddModal: () => void;
	getCompanies: () => void;
};

const AddCompanyModal: FC<AddCompanyModalProps> = ({
	setActiveAddModal,
	getCompanies,
}: AddCompanyModalProps) => {
	const { token } = useContext(AuthContext);

	const [formName, setFormName] = useState<string | undefined>("");
	const [formContactEmail, setFormContactEmail] = useState<string>("");
	const [formFirstAddress, setFormFirstAddress] = useState<string | undefined>(
		""
	);
	const [formSecondAddress, setFormSecondAddress] = useState<
		string | undefined
	>("");
	const [formThirdAddress, setFormThirdAddress] = useState<string | undefined>(
		""
	);
	const [formCity, setFormCity] = useState<string | undefined>("");
	const [formProvince, setFormProvince] = useState<string | undefined>("");
	const [formCountry, setFormCountry] = useState<string | undefined>("");
	const [formPostalCode, setFormPostalCode] = useState<string | undefined>("");
	const [formLatitude, setFormLatitude] = useState<number | undefined>(0);
	const [formLongitude, setFormLongitude] = useState<number | undefined>(0);
	const [formBiography, setFormBiography] = useState<string | undefined>("");
	const [formTwitter, setFormTwitter] = useState<string | undefined>("");
	const [formInstagram, setFormInstagram] = useState<string | undefined>("");
	const [formFacebook, setFormFacebook] = useState<string | undefined>("");
	const [formLinkedin, setFormLinkedin] = useState<string | undefined>("");
	const [formIsMember, setFormIsMember] = useState<boolean | undefined>(false);
	const [formMainImage, setFormMainImage] = useState<Blob | MediaSource>();
	const [formPhoneNumber, setFromPhoneNumber] = useState<string | undefined>(
		""
	);
	const [formWebsite, setFormWebsite] = useState<string | undefined>("");
	const [formBanner, setFormBanner] = useState<Blob | MediaSource>();

	const [formSpecifications, setFormSpecifications] = useState<Array<number>>(
		[]
	);
	const [specificationTypeList, setSpecificationTypeList] = useState<string[]>(
		[]
	);
	const [specifications, setSpecifications] = useState<
		Array<Specification> | undefined
	>();

	const [imagePreview, setImagePreview] = useState<string | undefined>("");

	const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
		if (e?.target?.files && e?.target?.files?.length > 0) {
			setFormMainImage(e.target.files[0]);
			setImagePreview(URL.createObjectURL(e.target.files[0]));
		}
	};

	const uploadBanner = (e: ChangeEvent<HTMLInputElement>) => {
		if (e?.target?.files && e?.target?.files?.length > 0) {
			setFormBanner(e.target.files[0]);
		}
	};

	const [editStatus, setEditStatus] = useState("");

	const handleSubmit = () => {
		const newCompany = new Company();
		if (formName != undefined || formName != "" || formName != null) {
			setEditStatus("Saving...");
			newCompany
				.create(
					token,
					formContactEmail,
					formName,
					formFirstAddress,
					formSecondAddress,
					formThirdAddress,
					formCity,
					formProvince,
					formCountry,
					formPostalCode,
					formLatitude,
					formLongitude,
					formBiography,
					formTwitter,
					formInstagram,
					formFacebook,
					formLinkedin,
					formIsMember,
					formMainImage,
					formWebsite,
					formPhoneNumber,
					formBanner,
					formSpecifications
				)
				.then((res) => {
					if (res) {
						setEditStatus("Saved!");
						getCompanies();
						setActiveAddModal();
					} else if (
						formName == undefined ||
						formName == "" ||
						formName == null
					) {
						setEditStatus("Missing Name");
					} else {
						setEditStatus("Oops! Something went wrong...");
					}
				});
		}
	};

	useEffect(() => {
		Specification.getAllSpecifications(token).then((result) => {
			setSpecifications(result);
		});

		Specification.getSpecificationTypes(token).then((response) => {
			setSpecificationTypeList(response);
		});
	}, []);
	return (
		<div
			//onSubmit={handleSubmit}
			className="w-[900px] font-roboto text-[18px]"
		>
			<div className="w-full flex justify-between mb-[15px]">
				<h2 className="font-bold">Add Company</h2>
				<img
					onClick={() => setActiveAddModal()}
					src="/crossBlack.svg"
					className="w-[20px] h-[20px] right-3 top-3 absolute  cursor-pointer "
				></img>
			</div>

			<div className="flex gap-[20px]">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] w-[50%]">
					<div className="flex flex-col gap-[10px]">
						<div className="flex flex-col justify-between">
							<p className="text-[10px] pb-[3px] font-semibold">Name:</p>
							<input
								onChange={(e) => setFormName(e.target?.value)}
								className={
									"focus:border-brightRed h-[30px] text-[15px] form-control block max-w-[300px] px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								}
								type={"text"}
								value={formName}
							/>
						</div>
						<div className="flex flex-col justify-between">
							<p className="text-[10px] pb-[3px] font-semibold">
								Contact Email:
							</p>
							<input
								onChange={(e) => setFormContactEmail(e.target?.value)}
								className={
									"focus:border-brightRed h-[30px] text-[15px] form-control block max-w-[300px] px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								}
								type={"text"}
								value={formContactEmail}
							/>
						</div>
						<div className="flex flex-col justify-between relative">
							<img
								className="absolute mt-[27px] right-0 flex items-center px-2"
								src="/assets/twitterLogo.svg"
							/>
							<p className="text-[10px] pb-[3px] font-semibold">Twitter:</p>
							<input
								onChange={(e) => setFormTwitter(e.target?.value)}
								className={
									"focus:border-brightRed h-[30px] pr-8 text-[15px] form-control block max-w-[300px] px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								}
								type={"text"}
								value={formTwitter}
							/>
						</div>
						<div className="flex flex-col justify-between relative">
							<img
								className="absolute mt-[27px] right-0 flex items-center px-2"
								src="/assets/instagramLogo.svg"
							/>
							<p className="text-[10px] pb-[3px] font-semibold">Instagram:</p>
							<input
								onChange={(e) => setFormInstagram(e.target?.value)}
								className={
									"focus:border-brightRed h-[30px] pr-8 text-[15px] form-control block max-w-[300px] px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								}
								type={"text"}
								value={formInstagram}
							/>
						</div>
						<div className="flex flex-col justify-between relative">
							<img
								className="absolute mt-[27px] right-0 flex items-center px-2"
								src="/assets/facebookLogo.svg"
							/>
							<p className="text-[10px] pb-[3px] font-semibold">Facebook:</p>
							<input
								onChange={(e) => setFormFacebook(e.target?.value)}
								className={
									"focus:border-brightRed h-[30px] pr-8 text-[15px] form-control block max-w-[300px] px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								}
								type={"text"}
								value={formFacebook}
							/>
						</div>
						<div className="flex flex-col justify-between relative">
							<img
								className="absolute mt-[27px] right-0 flex items-center px-2"
								src="/assets/linkednLogo.svg"
							/>
							<p className="text-[10px] pb-[3px] font-semibold">Linkedin:</p>
							<input
								onChange={(e) => setFormLinkedin(e.target?.value)}
								className={
									"focus:border-brightRed h-[30px] pr-8 text-[15px] form-control block max-w-[300px] px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								}
								type={"text"}
								value={formLinkedin}
							/>
						</div>
						<div className="flex flex-col justify-between relative">
							<p className="text-[10px] pb-[3px] font-semibold">Website:</p>
							<input
								onChange={(e) => setFormWebsite(e.target?.value)}
								className={
									"focus:border-brightRed h-[30px] pr-8 text-[15px] form-control block max-w-[300px] px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								}
								type={"text"}
								value={formWebsite}
							/>
						</div>
						<div className="flex flex-col justify-between">
							<p className="text-[10px] pb-[3px] font-semibold">Country</p>
							<input
								onChange={(e) => setFormCountry(e.target?.value)}
								className={
									"focus:border-brightRed h-[30px] text-[15px] form-control block max-w-[300px] px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								}
								type={"text"}
								value={formCountry}
							/>
						</div>
						<div className="flex flex-col justify-between">
							<p className="text-[10px] pb-[3px] font-semibold">Postal Code</p>
							<input
								onChange={(e) => setFormPostalCode(e.target?.value)}
								className={
									"focus:border-brightRed h-[30px] text-[15px] form-control block max-w-[300px] px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								}
								type={"text"}
								value={formPostalCode}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-[10px]">
						<div className="flex flex-col justify-between">
							<p className="text-[10px] pb-[3px] font-semibold">
								First Address:
							</p>
							<input
								onChange={(e) => setFormFirstAddress(e.target?.value)}
								className={
									"focus:border-brightRed h-[30px] text-[15px] form-control block max-w-[300px] px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								}
								type={"text"}
								value={formFirstAddress}
							/>
						</div>
						<div className="flex flex-col justify-between">
							<p className="text-[10px] pb-[3px] font-semibold">
								Second Address:
							</p>
							<input
								onChange={(e) => setFormSecondAddress(e.target?.value)}
								className={
									"focus:border-brightRed h-[30px] text-[15px] form-control block max-w-[300px] px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								}
								type={"text"}
								value={formSecondAddress}
							/>
						</div>
						<div className="flex flex-col justify-between">
							<p className="text-[10px] pb-[3px] font-semibold">
								Third Address:
							</p>
							<input
								onChange={(e) => setFormThirdAddress(e.target?.value)}
								className={
									"focus:border-brightRed h-[30px] text-[15px] form-control block max-w-[300px] px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								}
								type={"text"}
								value={formThirdAddress}
							/>
						</div>

						<div className="flex flex-col justify-between">
							<p className="text-[10px] pb-[3px] font-semibold">City:</p>
							<input
								onChange={(e) => setFormCity(e.target?.value)}
								className={
									"focus:border-brightRed h-[30px] text-[15px] form-control block max-w-[300px] px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								}
								type={"text"}
								value={formCity}
							/>
						</div>
						<div className="flex flex-col justify-between">
							<p className="text-[10px] pb-[3px] font-semibold">Province:</p>
							<input
								onChange={(e) => setFormProvince(e.target?.value)}
								className={
									"focus:border-brightRed h-[30px] text-[15px] form-control block max-w-[300px] px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								}
								type={"text"}
								value={formProvince}
							/>
						</div>
						<div className="flex flex-col justify-between">
							<p className="text-[10px] pb-[3px] font-semibold">Latitude:</p>
							<input
								onChange={(e) => setFormLatitude(parseInt(e.target?.value))}
								className={
									"focus:border-brightRed h-[30px] text-[15px] form-control block max-w-[300px] px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								}
								type={"number"}
								value={formLatitude}
							/>
						</div>
						<div className="flex flex-col justify-between">
							<p className="text-[10px] pb-[3px] font-semibold">Longitude:</p>
							<input
								onChange={(e) => setFormLongitude(parseInt(e.target?.value))}
								className={
									"focus:border-brightRed h-[30px]  text-[15px] form-control block max-w-[300px] px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								}
								type={"number"}
								value={formLongitude}
							/>
						</div>
						<div className="flex flex-col justify-between">
							<p className="text-[10px] pb-[3px] font-semibold">
								Phone Number:
							</p>
							<input
								onChange={(e) => setFromPhoneNumber(e.target?.value)}
								className={
									"focus:border-brightRed h-[30px]  text-[15px] form-control block max-w-[300px] px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								}
								type={"tel"}
								value={formPhoneNumber}
							/>
						</div>
						<div className="flex flex-col w-full h-full ">
							<label
								htmlFor={"banner-media-input"}
								className="text-[10px] pb-[3px] font-semibold"
							>
								Add Banner
							</label>
							<input
								className="h-10 "
								id={"banner-media-input"}
								onChange={(e) => {
									uploadBanner(e);
								}}
								type="file"
							/>
						</div>
						<div>
							<p className="text-[10px] pb-[3px] font-semibold">CAMM Member</p>
							<input
								onChange={(e) => setFormIsMember(e.target?.checked)}
								className={
									"focus:border-brightRed h-[30px] text-[15px] form-control block max-w-[300px] px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								}
								type={"checkbox"}
								value={formPostalCode}
							/>
						</div>
					</div>
				</div>
				<div className="flex w-[50%] flex-col gap-[10px]">
					<div className="flex justify-center">
						<div className="aspect-square w-[200px]">
							<PortraitInput
								id={""}
								portraitImage={imagePreview}
								rounded={true}
								inputAction={uploadImage}
							/>
						</div>
					</div>
					<div className="flex flex-col justify-between">
						<p className="text-[10px] pb-[3px] font-semibold">Biography:</p>
						<textarea
							onChange={(e) => setFormBiography(e.target?.value)}
							className={
								"focus:border-brightRed h-[100px] overflow-x-hidden resize-none form-control block w-full px-4 py-2 mb-[15px] text-[15px] font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none overflow-scroll"
							}
							value={formBiography}
						/>
					</div>
					<div className="flex flex-col justify-between h-[200px] overflow-y-scroll">
						<p className="text-[10px] pb-[3px] font-semibold">
							Specifications:
						</p>
						<div>
							{specificationTypeList?.map((type) => {
								return specifications
									?.filter((specification) => specification?.type === type)
									?.map((specification: Specification, index) => {
										return (
											<>
												{index === 0 && (
													<p className="text-[10px] pb-[3px] font-semibold">
														{type}
													</p>
												)}
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
											</>
										);
									});
							})}
						</div>
						{/* TODO: specification checkbox component, returns a array of ids which should be then pass to setFormSpecifications */}
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-[10px] self-start mt-[20px]">
				<div className="flex gap-[10px]">
					<Button
						text="cancel"
						style="outline"
						action={() => setActiveAddModal()}
					/>
					<Button text="confirm" action={() => handleSubmit()} />
				</div>
			</div>
			<p>{editStatus}</p>
		</div>
	);
};
export default AddCompanyModal;
