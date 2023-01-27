import React, { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import Company from "../../Models/Company";
import { AuthContext } from "../../auth";
import PortraitInput from "../PortraitInput";
import Button from "../Utils/Buttons/Button";
import Specification from "../../Models/Specification";
import CompanyMediaInput from "../CompanyMediaInput";
import CompanyMedia from "../../Models/CompanyMedia";
import { PaginationItems } from "../../Models/Utils/paginationItems";
import Pagination from "../Utils/Pagination";

type EditCompanyModalProps = {
	activeCompany: Company | undefined;
	setActiveDeleteModal: (item: Company | undefined) => void;
	setCompany?: React.Dispatch<React.SetStateAction<Company | undefined>>;
	setEditModalActive?: React.Dispatch<React.SetStateAction<boolean>>;
	getCompanyMedia?: () => void;
};

const EditCompanyModal: FC<EditCompanyModalProps> = ({
	activeCompany,
	setActiveDeleteModal,
	setCompany,
	setEditModalActive,
	getCompanyMedia,
}: EditCompanyModalProps) => {
	if (!activeCompany) {
		return null;
	}

	const { user, token } = useContext(AuthContext);

	const handleSubmit = () => {
		if (!activeCompany?.id) {
			setEditStatus("Company has not been approved");
			return false;
		}
		setEditStatus("Saving...");
		const activeCompanyImage = activeCompany?.mainImage;
		activeCompany
			?.update(
				user,
				activeCompany.id,
				formContactEmail,
				token,
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
				formMainImage,
				formIsMember,
				formWebsite,
				formPhoneNumber,
				formBanner,
				formSpecifications,
				specificationsToRemove
			)
			.then((res) => {
				if (res !== false && res instanceof Company) {
					if (setCompany) {
						console.log(res);
						setCompany(res);
					}
					setEditStatus("Saved!");
					activeCompany.mainImage = activeCompanyImage;
					if (getCompanyMedia) getCompanyMedia();
					if (setEditModalActive) setEditModalActive(false);
				} else {
					setEditStatus("Oops! Something went wrong...");
				}
			});
	};

	const [editStatus, setEditStatus] = useState("");
	const [formContactEmail, setFormContactEmail] = useState("");
	const [formName, setFormName] = useState<string | undefined>(
		activeCompany?.name
	);
	const [formFirstAddress, setFormFirstAddress] = useState<string | undefined>(
		activeCompany?.firstAddress
	);
	const [formSecondAddress, setFormSecondAddress] = useState<
		string | undefined
	>(activeCompany?.secondAddress);
	const [formThirdAddress, setFormThirdAddress] = useState<string | undefined>(
		activeCompany?.thirdAddress
	);
	const [formCity, setFormCity] = useState<string | undefined>(
		activeCompany?.city
	);
	const [formProvince, setFormProvince] = useState<string | undefined>(
		activeCompany?.province
	);
	const [formCountry, setFormCountry] = useState<string | undefined>(
		activeCompany?.country
	);
	const [formPostalCode, setFormPostalCode] = useState<string | undefined>(
		activeCompany?.postalCode
	);
	const [formLatitude, setFormLatitude] = useState<number | undefined>(
		activeCompany?.latitude
	);
	const [formLongitude, setFormLongitude] = useState<number | undefined>(
		activeCompany?.longitude
	);
	const [formBiography, setFormBiography] = useState<string | undefined>(
		activeCompany?.biography
	);
	const [formTwitter, setFormTwitter] = useState<string | undefined>(
		activeCompany?.socialMedia?.twitterURL
	);
	const [formInstagram, setFormInstagram] = useState<string | undefined>(
		activeCompany?.socialMedia?.instagramURL
	);
	const [formFacebook, setFormFacebook] = useState<string | undefined>(
		activeCompany?.socialMedia?.facebookURL
	);
	const [formLinkedin, setFormLinkedin] = useState<string | undefined>(
		activeCompany?.socialMedia?.linkedinURL
	);
	const [formIsMember, setFormIsMember] = useState<boolean | undefined>(
		activeCompany?.isMember
	);
	const [formMainImage, setFormMainImage] = useState<Blob | MediaSource>();
	const [formBanner, setFormBanner] = useState<Blob | MediaSource>();

	const [formSpecifications, setFormSpecifications] = useState<Array<number>>(
		[]
	);
	const [specificationsToRemove, setSpecificationsToRemove] = useState<
		Array<number>
	>([]);
	const [companySpecifications, setCompanySpecifications] = useState<
		Array<Specification> | undefined
	>();
	const [specifications, setSpecifications] = useState<
		Array<Specification> | undefined
	>();

	const [imagePreview, setImagePreview] = useState<string | undefined>(
		activeCompany?.mainImage
	);

	const [companyMediaList, setCompanyMediaList] = useState<CompanyMedia[]>([]);
	const [companyMediasPerPage, setCompanyMediasPerPage] =
		useState<PaginationItems>({ toItem: 0, fromItem: 0, totalPages: 1 });
	const [totalCompanyMedias, setTotalCompanyMedia] = useState<number>(0);

	const [companyMediaPageToGet, setCompanyMediaPageToGet] = useState(1);
	const [totalCompanyMediaPages, setTotalCompanyMediaPages] = useState(1);

	const [specificationTypeList, setSpecificationTypeList] = useState<string[]>(
		[]
	);
	const [formPhoneNumber, setFromPhoneNumber] = useState<string | undefined>(
		activeCompany?.phoneNumber
	);
	const [formWebsite, setFormWebsite] = useState<string | undefined>(
		activeCompany?.website
	);

	const [addingMedia, setAddingMedia] = useState<boolean>(false);

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

	const checkedSpecification = (specification: Specification) => {
		let response = false;
		if (specification?.id && specificationsToRemove.includes(specification?.id))
			return response;
		companySpecifications?.forEach((specificationCompany) => {
			if (specification.id === specificationCompany.id) {
				response = true;
			}
		});
		if (response) return response;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		response = formSpecifications?.includes(specification.id!);
		return response;
	};

	useEffect(() => {
		if (
			activeCompany?.contactEmail !== undefined ||
			activeCompany?.contactEmail !== ""
		)
			setFormContactEmail(String(activeCompany?.contactEmail));
		Specification.getAllSpecifications(token).then((result) => {
			setSpecifications(result);
		});
		Specification.getSpecificationTypes(token).then((response) => {
			setSpecificationTypeList(response);
		});

		if (activeCompany?.id) {
			activeCompany
				.getCompanySpecifications(token, activeCompany?.id, 1)
				.then((result) => {
					setCompanySpecifications(result.specifications);
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
			//TODO: is this the valid approach to enforce id as a number or no results?

			CompanyMedia.getCompanyMedias(token, activeCompany.id, 1).then(
				(response) => {
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
	}, []);

	return (
		<div
			onSubmit={handleSubmit}
			className="w-[900px] font-roboto text-[18px] text-gray overflow-y-auto h-[800px]"
		>
			<div className="w-full flex justify-between mb-[15px]">
				<h2 className="font-bold">Edit</h2>
				<img
					onClick={() => setActiveDeleteModal(undefined)}
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
								onChange={(e) => {
									setFormIsMember(e.target?.checked);
								}}
								className={
									"focus:border-brightRed h-[30px] text-[15px] form-control block max-w-[300px] px-4 py-2 font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								}
								type={"checkbox"}
								checked={formIsMember}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-[10px]">
						<CompanyMediaInput
							company_id={activeCompany?.id}
							companyMediaList={companyMediaList}
							setCompanyMediaList={setCompanyMediaList}
							mediaPerPage={companyMediasPerPage}
							setCompanyMediasPerPage={setCompanyMediasPerPage}
							setTotalCompanyMedia={setTotalCompanyMedia}
							totalCompanyMedias={totalCompanyMedias}
							setAddingMedia={setAddingMedia}
						/>
						{addingMedia && (
							<p className="text-darkRed">Media is being added please wait</p>
						)}
					</div>
				</div>
				<div className="flex w-[50%] flex-col gap-[10px]">
					<div className="flex justify-center">
						<div className="aspect-square w-[200px]">
							<PortraitInput
								id={activeCompany?.id ? activeCompany?.id?.toString() : ""}
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
											</>
										);
									});
							})}
						</div>
					</div>
				</div>
			</div>
			<div className="w-full mt-2">
				<div className="flex flex-col gap-[2px] h-[130px]  overflow-y-auto">
					{companyMediaList.map((media) => {
						return (
							<div key={media?.id} className="flex justify-between">
								{media?.file_name}
								<div>
									<Button
										text="Delete"
										style="outline"
										action={() =>
											media?.delete(token).then((response) => {
												if (response) {
													let newMediaArray = companyMediaList;
													newMediaArray = newMediaArray.filter(
														(oldMedia) => oldMedia?.id !== media?.id
													);
													setCompanyMediaList(newMediaArray);
												}
											})
										}
									/>
								</div>
							</div>
						);
					})}
				</div>
				{totalCompanyMedias > 50 && (
					<Pagination
						pageToGet={companyMediaPageToGet}
						setPageToGet={setCompanyMediaPageToGet}
						totalPages={totalCompanyMediaPages}
						itemsPerPage={companyMediasPerPage}
						totalItems={totalCompanyMedias}
					/>
				)}
			</div>

			<div className="flex flex-col gap-[10px] self-start mt-[20px]">
				<div className="flex gap-[10px]">
					<Button
						text="cancel"
						style="outline"
						action={() => setActiveDeleteModal(undefined)}
					/>
					<Button
						text="confirm"
						action={() => handleSubmit()}
						disabled={addingMedia}
					/>
				</div>
				<p>{editStatus}</p>
			</div>
		</div>
	);
};
export default EditCompanyModal;
