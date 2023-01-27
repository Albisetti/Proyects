/* eslint-disable indent */
import { ICompany } from "../Company/CompanyInterface";
import { IUser } from "./UserInterface";
import axios from "axios";
import Company from "../Company";
import { ISpecification } from "../Specification/SpecificationInterface";
import { SocialMedia } from "../Utils/SocialMedia";
import FormData from "form-data";
import Specification from "../Specification";
import Opportunity from "../Opportunity";
export default class User implements IUser {
	email: string;
	id?: number;
	company?: ICompany;
	firstName?: string;
	lastName?: string;
	biography?: string;
	socialMedia?: SocialMedia;
	profileImage?: string;
	specifications?: Array<ISpecification>;
	approved?: boolean;
	askedRelatedCompany?: string;
	roles?: string[];

	constructor(
		email: string,
		id?: number,
		company?: ICompany,
		firstName?: string,
		lastName?: string,
		biography?: string,
		socialMedia?: SocialMedia,
		profileImage?: string,
		specifications?: Array<ISpecification>,
		approved?: boolean,
		askedRelatedCompany?: string,
		roles?: string[]
	) {
		this.id = id;
		this.company = company;
		this.firstName = firstName;
		this.lastName = lastName;
		this.biography = biography;
		this.socialMedia = socialMedia;
		this.profileImage = profileImage;
		this.email = email;
		this.specifications = specifications;
		this.approved = approved;
		this.askedRelatedCompany = askedRelatedCompany;
		this.roles = roles;
	}

	async login(
		password: string,
		email = this.email
	): Promise<{ user: User; token: string; isLoggedIn: boolean }> {
		let token = "";
		let isLoggedIn = false;
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/login",
				{
					email: email,
					password: password,
					withRole: true,
				},
				{
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				}
			)
			.then(async (response) => {
				const responseUser = response?.data?.user;
				this.id = responseUser?.id;
				this.email = responseUser?.email;
				this.company = responseUser?.company;
				this.firstName = responseUser?.first_name;
				this.lastName = responseUser?.last_name;
				this.biography = responseUser?.biography;
				this.profileImage = responseUser?.profile_image;
				this.socialMedia = {
					facebookURL: responseUser?.facebook,
					twitterURL: responseUser?.twitter,
					linkedinURL: responseUser?.linkedin,
					instagramURL: responseUser?.instagram,
				};
				this.roles = responseUser?.roles?.map(
					(role: { name: string }) => role.name
				);
				token = response?.data?.token;
				if (responseUser?.company_id) {
					await Company.getCompany(token, responseUser?.company_id).then(
						(response) => {
							this.company = response?.company;
						}
					);
				}
				isLoggedIn = true;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
		return { user: this, token: token, isLoggedIn: isLoggedIn };
	}

	async signUp(
		password: string,
		passwordConfirmation: string,
		firstName = this.firstName,
		lastName = this.lastName,
		email = this.email,
		askedRelatedCompany = this.askedRelatedCompany
	): Promise<boolean> {
		let signedUp = false;
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/register",
				{
					first_name: firstName,
					last_name: lastName,
					email: email,
					password: password,
					password_confirmation: passwordConfirmation,
					asked_related_company: askedRelatedCompany,
				},
				{
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				}
			)
			.then((response) => {
				if (response?.status !== 200) signedUp = false;
				else {
					this.firstName = firstName;
					this.lastName = lastName;
					this.email = email;
					this.askedRelatedCompany = askedRelatedCompany;
					signedUp = true;
				}
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
		return signedUp;
	}

	async forgotPassword(email = this.email): Promise<boolean> {
		let forgotPasswordEmailSent = false;
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/forgotPassword",
				{
					email: email,
				},
				{
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				}
			)
			.then((response) => {
				if (response?.status !== 200) forgotPasswordEmailSent = false;
				else {
					forgotPasswordEmailSent = true;
				}
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
		return forgotPasswordEmailSent;
	}

	async resetPassword(
		password: string,
		confirmPassword: string,
		verificationCode: string,
		email = this.email
	): Promise<boolean> {
		let resetSuccessful = false;
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/resetPasswordValidation",
				{
					email: email,
					password: password,
					password_confirmation: confirmPassword,
					vc: verificationCode,
				},
				{
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				}
			)
			.then((response) => {
				if (response?.status !== 200) resetSuccessful = false;
				else {
					resetSuccessful = true;
				}
			})
			.catch(function (error) {
				// handle error
				// console.log(error);
				return false;
			});
		return resetSuccessful;
	}

	async delete(token: string, id = this.id): Promise<boolean> {
		let deleted = false;
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/users/delete",
				{
					id: id,
				},
				{
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then(() => {
				deleted = true;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
		return deleted;
	}

	async approve(token: string, id: number): Promise<boolean> {
		let approved = false;

		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/approveRegistration",
				{
					id: id,
				},
				{
					headers: {
						"Content-Type": "multipart/form-data",
						"Access-Control-Allow-Origin": "*",
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((response) => {
				if (response?.status === 200) {
					approved = true;
					this.approved = true;
				}
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
		return approved;
	}

	async update(
		token: string,
		firstName?: string,
		lastName?: string,
		biography?: string,
		email?: string,
		profileImage?: Blob | MediaSource,
		twitter?: string,
		instagram?: string,
		linkedin?: string,
		facebook?: string,
		specifications?: Array<number>,
		specificationsToRemove?: Array<number>,
		company_id?: number,
		id = this.id
	): Promise<boolean | User> {
		const formData = new FormData();
		formData.append("id", id ? id.toString() : "");
		if (firstName) formData.append("first_name", firstName ? firstName : "");
		if (lastName) formData.append("last_name", lastName ? lastName : "");
		if (email) formData.append("email", email ? email : "");
		if (biography) formData.append("biography", biography ? biography : "");
		if (twitter) formData.append("twitter", twitter ? twitter : "");
		if (instagram) formData.append("instagram", instagram ? instagram : "");
		if (facebook) formData.append("facebook", facebook ? facebook : "");
		if (linkedin) formData.append("linkedIn", linkedin ? linkedin : "");
		if (company_id) formData.append("company_id", company_id ? company_id : "");
		if (profileImage)
			formData.append("image", profileImage ? profileImage : "");
		if (specifications)
			formData.append(
				"specifications",
				specifications
					? JSON.stringify({
							attach: specifications,
							detach: specificationsToRemove,
							// eslint-disable-next-line no-mixed-spaces-and-tabs
					  })
					: null
			);

		return await axios
			.post(process.env.REACT_APP_CAMM_API + "/users/update", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					"Access-Control-Allow-Origin": "*",
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				if (response?.status >= 200 && response?.status <= 299) {
					const {
						first_name,
						last_name,
						biography,
						email,
						profile_image,
						facebook,
						twitter,
						linkedin,
						instagram,
						company_id,
					} = response.data.data;
					this.firstName = first_name;
					this.lastName = last_name;
					this.biography = biography;
					this.email = email;
					this.profileImage = profile_image;
					this.socialMedia = {
						facebookURL: facebook,
						twitterURL: twitter,
						linkedinURL: linkedin,
						instagramURL: instagram,
					};
					this.company = new Company(company_id);
					return this;
				}
				return false;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
	}

	async create(
		token: string,
		firstName = this.firstName,
		lastName = this.lastName,
		biography = this.biography,
		email = this.email,
		profileImage?: Blob | MediaSource,
		socialMedia = this.socialMedia,
		specifications?: Array<number>,
		company_id?: number
	): Promise<boolean> {
		let created = false;
		const formData = new FormData();
		formData.append("first_name", firstName ? firstName : "");
		formData.append("last_name", lastName ? lastName : "");
		formData.append("biography", biography ? biography : "");
		formData.append("email", email ? email : "");
		formData.append(
			"twitter",
			socialMedia?.twitterURL ? socialMedia?.twitterURL : ""
		);
		formData.append(
			"instagram",
			socialMedia?.instagramURL ? socialMedia?.instagramURL : ""
		);
		formData.append(
			"facebook",
			socialMedia?.facebookURL ? socialMedia?.facebookURL : ""
		);
		formData.append(
			"linkedIn",
			socialMedia?.linkedinURL ? socialMedia?.linkedinURL : ""
		);
		formData.append("image", profileImage ? profileImage : "");
		formData.append(
			"specifications",
			specifications ? JSON.stringify(specifications) : null
		);
		if (company_id) formData.append("company_id", company_id);
		await axios
			.post(process.env.REACT_APP_CAMM_API + "/users/create", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					"Access-Control-Allow-Origin": "*",
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				if (response?.status === 200) {
					this.firstName = response?.data?.first_name;
					this.lastName = response?.data?.last_name;
					this.biography = response?.data?.biography;
					this.email = response?.data?.email;
					this.profileImage = response?.data?.profile_image;
					this.socialMedia = {
						facebookURL: response?.data?.facebook,
						twitterURL: response?.data?.twitter,
						linkedinURL: response?.data?.linkedin,
						instagramURL: response?.data?.instagram,
					};
					this.company = new Company(response?.data?.company_id);
					created = true;
				}
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
		return created;
	}

	public async getUserSpecifications(
		token: string,
		id: number,
		page: number
	): Promise<{
		specifications: Array<Specification>;
		currentPage: number;
		totalPages: number;
		fromSpecification: number;
		toSpecification: number;
		totalSpecifications: number;
	}> {
		let currentPage = 1;
		let totalPages = 1;
		let fromSpecification = 1;
		let toSpecification = 1;
		let totalSpecifications = 1;
		const specifications: Array<Specification> = [];
		await axios
			.get(process.env.REACT_APP_CAMM_API + "/user/specifications", {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					Authorization: `Bearer ${token}`,
				},
				params: { id: id, page: page },
			})
			.then((response) => {
				response.data?.data?.forEach(
					(element: {
						id: number;
						type: string;
						name: string;
						description: string;
						before_cta_text: string;
						after_cta_text: string;
					}) => {
						const specificationForArray = new Specification(
							element.type,
							element.name,
							element.id,
							element.description,
							element.before_cta_text,
							element.after_cta_text
						);
						specifications?.push(specificationForArray);
					}
				);
				currentPage = response?.data?.meta?.current_page;
				totalPages = response?.data?.meta?.last_page;
				fromSpecification = response?.data?.meta?.from;
				toSpecification = response?.data?.meta?.to;
				totalSpecifications = response?.data?.meta?.total;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
		return {
			specifications: specifications,
			currentPage: currentPage,
			totalPages: totalPages,
			fromSpecification: fromSpecification,
			toSpecification: toSpecification,
			totalSpecifications: totalSpecifications,
		};
	}

	// async getOpportunities(token: string, withItem: string[], limit?: number) {
	// 	const opportunities: Opportunity[] | undefined = [];
	// 	await axios
	// 		.post(
	// 			process.env.REACT_APP_CAMM_API + "/user/opportunities",
	// 			{
	// 				id: this.id,
	// 				with: withItem,
	// 				limit: limit || 50,
	// 			},
	// 			{
	// 				headers: {
	// 					"Content-Type": "application/json",
	// 					"Access-Control-Allow-Origin": "*",
	// 					Authorization: `Bearer ${token}`,
	// 				},
	// 			}
	// 		)
	// 		.then((response) => {
	// 			response.data?.data?.forEach(
	// 				(element: {
	// 					id: number;
	// 					title: string;
	// 					status: string;
	// 					open_date: string;
	// 					close_date: string;
	// 					description: string;
	// 					company_id: string;
	// 					country: number;
	// 					company: {
	// 						id: number;
	// 						name: string;
	// 						address_1: string;
	// 						address_2: string;
	// 						address_3: string;
	// 						city: string;
	// 						province: string;
	// 						country: string;
	// 						postal_code: string;
	// 						latitude: number;
	// 						longitude: number;
	// 						biography: string;
	// 						twitter: string;
	// 						instagram: string;
	// 						facebook: string;
	// 						linkedin: string;
	// 						main_image: string;
	// 					};
	// 					Companies: {
	// 						id: number;
	// 						company_id: number;
	// 						email: string;
	// 						first_name: string;
	// 						last_name: string;
	// 						biography: string;
	// 						facebook: string;
	// 						instagram: string;
	// 						linkedin: string;
	// 						twitter: string;
	// 						profile_image: string;
	// 						opportunities: Array<number>;
	// 						specifications: Array<number>;
	// 					}[];
	// 					specifications: {
	// 						id: number;
	// 						type: string;
	// 						name: string;
	// 						description: string;
	// 						before_cta_text: string;
	// 						after_cta_text: string;
	// 					}[];
	// 				}) => {
	// 					const OpportunityForArray = new Opportunity(
	// 						element?.id,
	// 						element?.title,
	// 						element?.status,
	// 						element?.description,
	// 						undefined,
	// 						undefined,
	// 						new Company(
	// 							element?.company?.id,
	// 							element?.company?.name,
	// 							element?.company?.address_1,
	// 							element?.company?.address_2,
	// 							element?.company?.address_3,
	// 							element?.company?.city,
	// 							element?.company?.province,
	// 							element?.company?.country,
	// 							element?.company?.postal_code,
	// 							element?.company?.latitude,
	// 							element?.company?.longitude,
	// 							element?.company?.biography,
	// 							{
	// 								facebookURL: element?.company?.facebook,
	// 								instagramURL: element?.company?.instagram,
	// 								twitterURL: element?.company?.twitter,
	// 								linkedinURL: element?.company?.linkedin,
	// 							},
	// 							element?.company?.main_image
	// 						),
	// 						element?.users?.map(
	// 							(item) =>
	// 								new User(
	// 									item.email,
	// 									item.id,
	// 									new Company(item?.company_id),
	// 									item.first_name,
	// 									item.last_name,
	// 									item.biography,
	// 									{
	// 										facebookURL: item?.facebook,
	// 										instagramURL: item?.instagram,
	// 										twitterURL: item?.twitter,
	// 										linkedinURL: item?.linkedin,
	// 									}
	// 								)
	// 						),
	// 						element?.specifications?.map(
	// 							(item) =>
	// 								new Specification(
	// 									item.type,
	// 									item.name,
	// 									item.id,
	// 									item.description,
	// 									item.before_cta_text,
	// 									item.after_cta_text
	// 								)
	// 						)
	// 					);
	// 					opportunities?.push(OpportunityForArray);
	// 				}
	// 			);
	// 		})
	// 		.catch(function (error) {
	// 			// handle error
	// 			console.log(error);
	// 			return undefined;
	// 		});
	// 	return {
	// 		opportunities: opportunities,
	// 	};
	// }

	public static async getQualifyingUsers(
		token: string,
		specifications?: Specification[],
		page?: number
	): Promise<{
		users: Array<User>;
		currentPage: number;
		totalPages: number;
		fromUser: number;
		toUser: number;
		totalUsers: number;
	}> {
		let currentPage = 1;
		let totalPages = 1;
		let fromUser = 1;
		let toUser = 1;
		let totalUsers = 1;
		const users: Array<User> = [];
		const specificationIds = specifications?.map(
			(specification) => specification?.id
		);
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/users/qualifying",
				{
					page: page,
					specifications: specificationIds,
				},
				{
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((response) => {
				response.data?.data?.forEach(
					(element: {
						id: number;
						company_id: number;
						email: string;
						first_name: string;
						last_name: string;
						biography: string;
						facebook: string;
						instagram: string;
						linkedin: string;
						twitter: string;
						profile_image: string;
						opportunities: Array<number>;
						specifications: Array<number>;
						confirmed_at: string;
					}) => {
						const userForArray = new User(
							element?.email,
							element?.id,
							new Company(element?.company_id),
							element?.first_name,
							element?.last_name,
							element?.biography,
							{
								facebookURL: element?.facebook,
								instagramURL: element?.instagram,
								twitterURL: element?.twitter,
								linkedinURL: element?.linkedin,
							},
							element?.profile_image,
							undefined,
							element?.confirmed_at ? true : false
						);
						users?.push(userForArray);
					}
				);
				currentPage = response?.data?.meta?.current_page;
				totalPages = response?.data?.meta?.last_page;
				fromUser = response?.data?.meta?.from;
				toUser = response?.data?.meta?.to;
				totalUsers = response?.data?.meta?.total;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
		return {
			users: users,
			currentPage: currentPage,
			totalPages: totalPages,
			fromUser: fromUser,
			toUser: toUser,
			totalUsers: totalUsers,
		};
	}

	public static async getUsers(
		token: string,
		page?: number,
		sort?: { name: string; direction: string }[],
		withParam?: string[]
	): Promise<{
		users: Array<User>;
		currentPage: number;
		totalPages: number;
		fromUser: number;
		toUser: number;
		totalUsers: number;
	}> {
		let currentPage = 1;
		let totalPages = 1;
		let fromUser = 1;
		let toUser = 1;
		let totalUsers = 1;
		const users: Array<User> = [];
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/users",
				{ page: page, sort: sort, with: withParam },
				{
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((response) => {
				response.data?.data?.forEach(
					(element: {
						id: number;
						company_id: number;
						email: string;
						first_name: string;
						last_name: string;
						biography: string;
						facebook: string;
						instagram: string;
						linkedin: string;
						twitter: string;
						profile_image: string;
						opportunities: Array<number>;
						specifications: Array<number>;
						confirmed_at: string;
						asked_related_company: string;
						company: {
							name: string;
						};
					}) => {
						const userForArray = new User(
							element?.email,
							element?.id,
							new Company(element?.company_id, element?.company?.name),
							element?.first_name,
							element?.last_name,
							element?.biography,
							{
								facebookURL: element?.facebook,
								instagramURL: element?.instagram,
								twitterURL: element?.twitter,
								linkedinURL: element?.linkedin,
							},
							element?.profile_image,
							undefined,
							element?.confirmed_at ? true : false,
							element?.asked_related_company
						);
						users?.push(userForArray);
					}
				);
				currentPage = response?.data?.meta?.current_page;
				totalPages = response?.data?.meta?.last_page;
				fromUser = response?.data?.meta?.from;
				toUser = response?.data?.meta?.to;
				totalUsers = response?.data?.meta?.total;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
		return {
			users: users,
			currentPage: currentPage,
			totalPages: totalPages,
			fromUser: fromUser,
			toUser: toUser,
			totalUsers: totalUsers,
		};
	}

	public static async getUser(
		token: string,
		id: number
	): Promise<{
		user?: User;
	}> {
		let user: User | undefined = undefined;
		user = await axios
			.get(process.env.REACT_APP_CAMM_API + "/user", {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					Authorization: `Bearer ${token}`,
				},
				params: {
					id: id,
				},
			})
			.then((response) => {
				return new User(
					response.data?.data?.email,
					response.data?.data?.id,
					new Company(response.data?.data?.company_id),
					response.data?.data?.first_name,
					response.data?.data?.last_name,
					response.data?.data?.biography,
					{
						facebookURL: response.data?.data?.facebook,
						instagramURL: response.data?.data?.instagram,
						twitterURL: response.data?.data?.twitter,
						linkedinURL: response.data?.data?.linkedin,
					},
					response?.data?.data?.profile_image,
					undefined,
					response.data?.data?.confirmed_at ? true : false,
					response.data?.data?.asked_related_company
				);
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return undefined;
			});
		return {
			user: user,
		};
	}

	public static async getLatestUsers(
		token: string,
		page?: number
	): Promise<{
		users: Array<User>;
		currentPage: number;
		totalPages: number;
		fromUser: number;
		toUser: number;
		totalUsers: number;
	}> {
		let currentPage = 1;
		let totalPages = 1;
		let fromUser = 1;
		let toUser = 1;
		let totalUsers = 1;
		const users: Array<User> = [];
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/users",
				{
					page: page,
					limit: 5,
					sort: [
						{ name: "created_at", direction: "desc" },
						{ name: "created_at", direction: "desc" },
					],
				},
				{
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((response) => {
				response.data?.data?.forEach(
					(element: {
						id: number;
						company_id: number;
						email: string;
						first_name: string;
						last_name: string;
						biography: string;
						facebook: string;
						instagram: string;
						linkedin: string;
						twitter: string;
						profile_image: string;
						opportunities: Array<number>;
						specifications: Array<number>;
						confirmed_at: string;
					}) => {
						const userForArray = new User(
							element?.email,
							element?.id,
							new Company(element?.company_id),
							element?.first_name,
							element?.last_name,
							element?.biography,
							{
								facebookURL: element?.facebook,
								instagramURL: element?.instagram,
								twitterURL: element?.twitter,
								linkedinURL: element?.linkedin,
							},
							element?.profile_image,
							undefined,
							element?.confirmed_at ? true : false
						);
						users?.push(userForArray);
					}
				);
				currentPage = response?.data?.meta?.current_page;
				totalPages = response?.data?.meta?.last_page;
				fromUser = response?.data?.meta?.from;
				toUser = response?.data?.meta?.to;
				totalUsers = response?.data?.meta?.total;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
		return {
			users: users,
			currentPage: currentPage,
			totalPages: totalPages,
			fromUser: fromUser,
			toUser: toUser,
			totalUsers: totalUsers,
		};
	}

	public static async searchUsers(
		token: string,
		search: string,
		page: number,
		withParam?: string[]
	): Promise<{
		users: Array<User>;
		currentPage: number;
		totalPages: number;
		fromUser: number;
		toUser: number;
		totalUsers: number;
	}> {
		let currentPage = 1;
		let totalPages = 1;
		let fromUser = 1;
		let toUser = 1;
		let totalUsers = 1;
		const users: Array<User> = [];
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/users/search",
				{
					page: page,
					search: search,
					with: withParam,
				},
				{
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((response) => {
				response.data?.data?.forEach(
					(element: {
						id: number;
						company_id: number;
						email: string;
						first_name: string;
						last_name: string;
						biography: string;
						facebook: string;
						instagram: string;
						linkedin: string;
						twitter: string;
						profile_image: string;
						opportunities: Array<number>;
						specifications: Array<number>;
						confirmed_at: string;
						company: {
							name: string;
						};
					}) => {
						const userForArray = new User(
							element?.email,
							element?.id,
							new Company(element?.company_id, element?.company?.name),
							element?.first_name,
							element?.last_name,
							element?.biography,
							{
								facebookURL: element?.facebook,
								instagramURL: element?.instagram,
								twitterURL: element?.twitter,
								linkedinURL: element?.linkedin,
							},
							element?.profile_image,
							undefined,
							element?.confirmed_at ? true : false
						);
						users?.push(userForArray);
					}
				);
				currentPage = response?.data?.meta?.current_page;
				totalPages = response?.data?.meta?.last_page;
				fromUser = response?.data?.meta?.from;
				toUser = response?.data?.meta?.to;
				totalUsers = response?.data?.meta?.total;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
		return {
			users: users,
			currentPage: currentPage,
			totalPages: totalPages,
			fromUser: fromUser,
			toUser: toUser,
			totalUsers: totalUsers,
		};
	}

	save(): boolean {
		return true;
	}
}
