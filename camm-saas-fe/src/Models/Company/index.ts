/* eslint-disable indent */
/* eslint-disable no-mixed-spaces-and-tabs */
import { ICompany } from "../Company/CompanyInterface";
import axios from "axios";
import FormData from "form-data";
import { SocialMedia } from "../Utils/SocialMedia";
import User from "../User";
import Specification from "../Specification";
import Opportunity from "../Opportunity";

export default class Company implements ICompany {
	id?: number;
	name?: string;
	firstAddress?: string;
	secondAddress?: string;
	thirdAddress?: string;
	city?: string;
	province?: string;
	country?: string;
	postalCode?: string;
	latitude?: number;
	longitude?: number;
	biography?: string;
	socialMedia?: SocialMedia;
	mainImage?: string;
	contactEmail?: string;
	isMember?: boolean;
	phoneNumber?: string;
	website?: string;
	banner?: string;

	constructor(
		id?: number,
		name?: string,
		firstAddress?: string,
		secondAddress?: string,
		thirdAddress?: string,
		city?: string,
		province?: string,
		country?: string,
		postalCode?: string,
		latitude?: number,
		longitude?: number,
		biography?: string,
		socialMedia?: SocialMedia,
		mainImage?: string,
		contactEmail?: string,
		isMember?: boolean,
		phoneNumber?: string,
		website?: string,
		banner?: string
	) {
		this.id = id;
		this.name = name;
		this.firstAddress = firstAddress;
		this.secondAddress = secondAddress;
		this.thirdAddress = thirdAddress;
		this.city = city;
		this.province = province;
		this.country = country;
		this.postalCode = postalCode;
		this.latitude = latitude;
		this.longitude = longitude;
		this.biography = biography;
		this.socialMedia = {
			twitterURL: socialMedia?.twitterURL,
			facebookURL: socialMedia?.facebookURL,
			instagramURL: socialMedia?.instagramURL,
			linkedinURL: socialMedia?.linkedinURL,
		};
		this.mainImage = mainImage;
		this.contactEmail = contactEmail;
		this.isMember = isMember;
		this.phoneNumber = phoneNumber;
		this.website = website;
		this.banner = banner;
	}
	async delete(token: string, id = this.id): Promise<boolean> {
		let deleted = false;
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/companies/delete",
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

	async getOpportunities(token: string, withItem: string[], limit?: number) {
		const opportunities: Opportunity[] | undefined = [];
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/company/opportunities",
				{
					id: this.id,
					with: withItem,
					limit: limit || 50,
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
						title: string;
						status: string;
						open_date: string;
						close_date: string;
						description: string;
						company_id: string;
						country: number;
						company: {
							id: number;
							name: string;
							address_1: string;
							address_2: string;
							address_3: string;
							city: string;
							province: string;
							country: string;
							postal_code: string;
							latitude: number;
							longitude: number;
							biography: string;
							twitter: string;
							instagram: string;
							facebook: string;
							linkedin: string;
							main_image: string;
							contact_email: string;
							is_member: boolean;
						};
						companies: {
							id: number;
							name: string;
							address_1: string;
							address_2: string;
							address_3: string;
							city: string;
							province: string;
							country: string;
							postal_code: string;
							latitude: number;
							longitude: number;
							biography: string;
							twitter: string;
							instagram: string;
							facebook: string;
							linkedin: string;
							main_image: string;
							contact_email: string;
							is_member: boolean;
						}[];
						specifications: {
							id: number;
							type: string;
							name: string;
							description: string;
							before_cta_text: string;
							after_cta_text: string;
						}[];
					}) => {
						const OpportunityForArray = new Opportunity(
							element?.id,
							element?.title,
							element?.status,
							element?.description,
							undefined,
							undefined,
							new Company(
								element?.company?.id,
								element?.company?.name,
								element?.company?.address_1,
								element?.company?.address_2,
								element?.company?.address_3,
								element?.company?.city,
								element?.company?.province,
								element?.company?.country,
								element?.company?.postal_code,
								element?.company?.latitude,
								element?.company?.longitude,
								element?.company?.biography,
								{
									facebookURL: element?.company?.facebook,
									instagramURL: element?.company?.instagram,
									twitterURL: element?.company?.twitter,
									linkedinURL: element?.company?.linkedin,
								},
								element?.company?.main_image,
								element?.company?.contact_email,
								element?.company?.is_member
							),
							element?.companies?.map(
								(item) =>
									new Company(
										item.id,
										item.name,
										item.address_1,
										item.address_2,
										item.address_3,
										item.city,
										item.province,
										item.country,
										item.postal_code,
										item.latitude,
										item.longitude,
										item.biography,
										{
											facebookURL: item.facebook,
											instagramURL: item.instagram,
											twitterURL: item.twitter,
											linkedinURL: item.linkedin,
										},
										item.main_image,
										item.contact_email
									)
							),
							element?.specifications?.map(
								(item) =>
									new Specification(
										item.type,
										item.name,
										item.id,
										item.description,
										item.before_cta_text,
										item.after_cta_text
									)
							)
						);
						opportunities?.push(OpportunityForArray);
					}
				);
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return undefined;
			});
		return {
			opportunities: opportunities,
		};
	}

	public static async getCompanies(
		token: string,
		page: number,
		filters?: { specification_ids?: string[]; specification_types?: string[] },
		limit?: number
	): Promise<{
		companies: Array<Company>;
		currentPage: number;
		totalPages: number;
		fromCompany: number;
		toCompany: number;
		totalCompanies: number;
	}> {
		let currentPage = 1;
		let totalPages = 1;
		let fromCompany = 1;
		let toCompany = 1;
		let totalCompanies = 1;
		const companies: Array<Company> = [];
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/companies",
				{
					page: page,
					filters: filters?.specification_ids
						? filters?.specification_ids.length > 0
							? filters
							: undefined
						: undefined,
					limit: limit,
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
						name: string;
						address_1: string;
						address_2: string;
						address_3: string;
						city: string;
						province: string;
						country: string;
						postal_code: string;
						latitude: number;
						longitude: number;
						biography: string;
						twitter: string;
						instagram: string;
						facebook: string;
						linkedin: string;
						main_image: string;
						contact_email: string;
						is_member: boolean;
						phone_number: string;
						website: string;
					}) => {
						const companyForArray = new Company(
							element?.id,
							element?.name,
							element?.address_1,
							element?.address_2,
							element?.address_3,
							element?.city,
							element?.province,
							element?.country,
							element?.postal_code,
							element?.latitude,
							element?.longitude,
							element?.biography,
							{
								facebookURL: element?.facebook,
								instagramURL: element?.instagram,
								twitterURL: element?.twitter,
								linkedinURL: element?.linkedin,
							},
							element?.main_image,
							element?.contact_email,
							element?.is_member,
							element?.phone_number,
							element?.website
						);
						companies?.push(companyForArray);
					}
				);
				currentPage = response?.data?.meta?.current_page;
				totalPages = response?.data?.meta?.last_page;
				fromCompany = response?.data?.meta?.from;
				toCompany = response?.data?.meta?.to;
				totalCompanies = response?.data?.meta?.total;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
		return {
			companies: companies,
			currentPage: currentPage,
			totalPages: totalPages,
			fromCompany: fromCompany,
			toCompany: toCompany,
			totalCompanies: totalCompanies,
		};
	}

	public static async getCompaniesNonMembers(
		token: string,
		page: number,
		filters?: { specification_ids?: string[]; specification_types?: string[] },
		limit?: number
	): Promise<{
		companies: Array<Company>;
		currentPage: number;
		totalPages: number;
		fromCompany: number;
		toCompany: number;
		totalCompanies: number;
	}> {
		let currentPage = 1;
		let totalPages = 1;
		let fromCompany = 1;
		let toCompany = 1;
		let totalCompanies = 1;
		const companies: Array<Company> = [];
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/companies",
				{
					page: page,
					filters: filters?.specification_ids
						? filters?.specification_ids.length > 0
							? filters
							: undefined
						: undefined,
					limit: limit,
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
						name: string;
						address_1: string;
						address_2: string;
						address_3: string;
						city: string;
						province: string;
						country: string;
						postal_code: string;
						latitude: number;
						longitude: number;
						biography: string;
						twitter: string;
						instagram: string;
						facebook: string;
						linkedin: string;
						main_image: string;
						contact_email: string;
						is_member: boolean;
					}) => {
						const companyForArray = new Company(
							element?.id,
							element?.name,
							element?.address_1,
							element?.address_2,
							element?.address_3,
							element?.city,
							element?.province,
							element?.country,
							element?.postal_code,
							element?.latitude,
							element?.longitude,
							element?.biography,
							{
								facebookURL: element?.facebook,
								instagramURL: element?.instagram,
								twitterURL: element?.twitter,
								linkedinURL: element?.linkedin,
							},
							element?.main_image,
							element?.contact_email,
							element?.is_member
						);
						if (!element?.is_member) {
							companies?.push(companyForArray);
						}
					}
				);
				currentPage = response?.data?.meta?.current_page;
				totalPages = response?.data?.meta?.last_page;
				fromCompany = response?.data?.meta?.from;
				toCompany = response?.data?.meta?.to;
				totalCompanies = response?.data?.meta?.total;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
		return {
			companies: companies,
			currentPage: currentPage,
			totalPages: totalPages,
			fromCompany: fromCompany,
			toCompany: toCompany,
			totalCompanies: totalCompanies,
		};
	}

	public static async getMembers(
		token: string,
		page: number,
		filters?: { specification_ids?: string[]; specification_types?: string[] },
		limit?: number
	): Promise<{
		companies: Array<Company>;
		currentPage: number;
		totalPages: number;
		fromCompany: number;
		toCompany: number;
		totalCompanies: number;
	}> {
		let currentPage = 1;
		let totalPages = 1;
		let fromCompany = 1;
		let toCompany = 1;
		let totalCompanies = 1;
		const companies: Array<Company> = [];
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/companies",
				{
					page: page,
					filters: filters?.specification_ids
						? filters?.specification_ids.length > 0
							? filters
							: undefined
						: undefined,
					limit: limit,
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
						name: string;
						address_1: string;
						address_2: string;
						address_3: string;
						city: string;
						province: string;
						country: string;
						postal_code: string;
						latitude: number;
						longitude: number;
						biography: string;
						twitter: string;
						instagram: string;
						facebook: string;
						linkedin: string;
						main_image: string;
						contact_email: string;
						is_member: boolean;
					}) => {
						const companyForArray = new Company(
							element?.id,
							element?.name,
							element?.address_1,
							element?.address_2,
							element?.address_3,
							element?.city,
							element?.province,
							element?.country,
							element?.postal_code,
							element?.latitude,
							element?.longitude,
							element?.biography,
							{
								facebookURL: element?.facebook,
								instagramURL: element?.instagram,
								twitterURL: element?.twitter,
								linkedinURL: element?.linkedin,
							},
							element?.main_image,
							element?.contact_email,
							element?.is_member
						);
						if (element?.is_member) {
							companies?.push(companyForArray);
						}
					}
				);
				currentPage = response?.data?.meta?.current_page;
				totalPages = response?.data?.meta?.last_page;
				fromCompany = response?.data?.meta?.from;
				toCompany = response?.data?.meta?.to;
				totalCompanies = response?.data?.meta?.total;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
		return {
			companies: companies,
			currentPage: currentPage,
			totalPages: totalPages,
			fromCompany: fromCompany,
			toCompany: toCompany,
			totalCompanies: totalCompanies,
		};
	}

	public static async getQualifyingCompanies(
		token: string,
		specifications?: Specification[],
		page?: number
	): Promise<{
		companies: Array<Company>;
		currentPage: number;
		totalPages: number;
		fromCompany: number;
		toCompany: number;
		totalCompanies: number;
	}> {
		let currentPage = 1;
		let totalPages = 1;
		let fromCompany = 1;
		let toCompany = 1;
		let totalCompanies = 1;
		const specificationIds = specifications?.map(
			(specification) => specification?.id
		);
		const companies: Array<Company> = [];
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/companies/qualifying",
				{
					page: page,
					specifications: specificationIds,
					filters: {
						membership: true,
					},
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
						name: string;
						address_1: string;
						address_2: string;
						address_3: string;
						city: string;
						province: string;
						country: string;
						postal_code: string;
						latitude: number;
						longitude: number;
						biography: string;
						twitter: string;
						instagram: string;
						facebook: string;
						linkedin: string;
						main_image: string;
						contact_email: string;
						is_member: boolean;
					}) => {
						const companyForArray = new Company(
							element?.id,
							element?.name,
							element?.address_1,
							element?.address_2,
							element?.address_3,
							element?.city,
							element?.province,
							element?.country,
							element?.postal_code,
							element?.latitude,
							element?.longitude,
							element?.biography,
							{
								facebookURL: element?.facebook,
								instagramURL: element?.instagram,
								twitterURL: element?.twitter,
								linkedinURL: element?.linkedin,
							},
							element?.main_image,
							element?.contact_email,
							element?.is_member
						);
						if (element?.is_member) {
							companies?.push(companyForArray);
						}
					}
				);
				currentPage = response?.data?.meta?.current_page;
				totalPages = response?.data?.meta?.last_page;
				fromCompany = response?.data?.meta?.from;
				toCompany = response?.data?.meta?.to;
				totalCompanies = response?.data?.meta?.total;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
		return {
			companies: companies,
			currentPage: currentPage,
			totalPages: totalPages,
			fromCompany: fromCompany,
			toCompany: toCompany,
			totalCompanies: totalCompanies,
		};
	}

	public static async getNonQualifyingCompanies(
		token: string,
		specifications?: Specification[],
		page?: number
	): Promise<{
		companies: Array<Company>;
		currentPage: number;
		totalPages: number;
		fromCompany: number;
		toCompany: number;
		totalCompanies: number;
	}> {
		let currentPage = 1;
		let totalPages = 1;
		let fromCompany = 1;
		let toCompany = 1;
		let totalCompanies = 1;
		const specificationIds = specifications?.map(
			(specification) => specification?.id
		);
		const companies: Array<Company> = [];
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/companies/unqualified",
				{
					page: page,
					specifications: specificationIds,
					filters: {
						membership: true,
					},
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
						name: string;
						address_1: string;
						address_2: string;
						address_3: string;
						city: string;
						province: string;
						country: string;
						postal_code: string;
						latitude: number;
						longitude: number;
						biography: string;
						twitter: string;
						instagram: string;
						facebook: string;
						linkedin: string;
						main_image: string;
						contact_email: string;
						is_member: boolean;
					}) => {
						const companyForArray = new Company(
							element?.id,
							element?.name,
							element?.address_1,
							element?.address_2,
							element?.address_3,
							element?.city,
							element?.province,
							element?.country,
							element?.postal_code,
							element?.latitude,
							element?.longitude,
							element?.biography,
							{
								facebookURL: element?.facebook,
								instagramURL: element?.instagram,
								twitterURL: element?.twitter,
								linkedinURL: element?.linkedin,
							},
							element?.main_image,
							element?.contact_email,
							element?.is_member
						);
						if (element?.is_member) {
							companies?.push(companyForArray);
						}
					}
				);
				currentPage = response?.data?.meta?.current_page;
				totalPages = response?.data?.meta?.last_page;
				fromCompany = response?.data?.meta?.from;
				toCompany = response?.data?.meta?.to;
				totalCompanies = response?.data?.meta?.total;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
		return {
			companies: companies,
			currentPage: currentPage,
			totalPages: totalPages,
			fromCompany: fromCompany,
			toCompany: toCompany,
			totalCompanies: totalCompanies,
		};
	}

	public static async getLatestCompanies(
		token: string,
		page: number
	): Promise<{
		companies: Array<Company>;
		currentPage: number;
		totalPages: number;
		fromCompany: number;
		toCompany: number;
		totalCompanies: number;
	}> {
		let currentPage = 1;
		let totalPages = 1;
		let fromCompany = 1;
		let toCompany = 1;
		let totalCompanies = 1;
		const companies: Array<Company> = [];
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/companies",
				{
					page: page,
					limit: 5,
					sort: [{ name: "created_at", direction: "desc" }],
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
						name: string;
						address_1: string;
						address_2: string;
						address_3: string;
						city: string;
						province: string;
						country: string;
						postal_code: string;
						latitude: number;
						longitude: number;
						biography: string;
						twitter: string;
						instagram: string;
						facebook: string;
						linkedin: string;
						main_image: string;
						contact_email: string;
						is_member: boolean;
					}) => {
						const companyForArray = new Company(
							element?.id,
							element?.name,
							element?.address_1,
							element?.address_2,
							element?.address_3,
							element?.city,
							element?.province,
							element?.country,
							element?.postal_code,
							element?.latitude,
							element?.longitude,
							element?.biography,
							{
								facebookURL: element?.facebook,
								instagramURL: element?.instagram,
								twitterURL: element?.twitter,
								linkedinURL: element?.linkedin,
							},
							element?.main_image,
							element?.contact_email,
							element?.is_member
						);
						companies?.push(companyForArray);
					}
				);
				currentPage = response?.data?.meta?.current_page;
				totalPages = response?.data?.meta?.last_page;
				fromCompany = response?.data?.meta?.from;
				toCompany = response?.data?.meta?.to;
				totalCompanies = response?.data?.meta?.total;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
		return {
			companies: companies,
			currentPage: currentPage,
			totalPages: totalPages,
			fromCompany: fromCompany,
			toCompany: toCompany,
			totalCompanies: totalCompanies,
		};
	}

	public static async getCompany(
		token: string,
		id: number
	): Promise<{
		company?: Company;
	}> {
		let company: Company | undefined = undefined;
		company = await axios
			.get(process.env.REACT_APP_CAMM_API + "/company", {
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
				return new Company(
					response.data?.data?.id,
					response.data?.data?.name,
					response.data?.data?.address_1,
					response.data?.data?.address_2,
					response.data?.data?.address_3,
					response.data?.data?.city,
					response.data?.data?.province,
					response.data?.data?.country,
					response.data?.data?.postal_code,
					response.data?.data?.latitude,
					response.data?.data?.longitude,
					response.data?.data?.biography,
					{
						facebookURL: response.data?.data?.facebook,
						instagramURL: response.data?.data?.instagram,
						twitterURL: response.data?.data?.twitter,
						linkedinURL: response.data?.data?.linkedin,
					},
					response.data?.data?.main_image,
					response.data?.data?.contact_email,
					response.data?.data?.is_member,
					response.data?.data?.phone_number,
					response.data?.data?.website,
					response.data?.data?.banner_image
				);
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return undefined;
			});
		return {
			company: company,
		};
	}

	public static async searchCompanies(
		token: string,
		search: string,
		page: number,
		filters?: { specification_ids?: string[]; specification_types?: string[] },
		limit?: number
	): Promise<{
		companies: Array<Company>;
		currentPage: number;
		totalPages: number;
		fromCompany: number;
		toCompany: number;
		totalCompanies: number;
	}> {
		let currentPage = 1;
		let totalPages = 1;
		let fromCompany = 1;
		let toCompany = 1;
		let totalCompanies = 1;
		const companies: Array<Company> = [];
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/companies/search",
				{
					page: page,
					search: search,
					limit: limit,
					filters: filters?.specification_ids
						? filters?.specification_ids.length > 0
							? filters
							: undefined
						: undefined,
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
						name: string;
						address_1: string;
						address_2: string;
						address_3: string;
						city: string;
						province: string;
						country: string;
						postal_code: string;
						latitude: number;
						longitude: number;
						biography: string;
						twitter: string;
						instagram: string;
						facebook: string;
						linkedin: string;
						main_image: string;
						contact_email: string;
						is_member: boolean;
					}) => {
						const companyForArray = new Company(
							element?.id,
							element?.name,
							element?.address_1,
							element?.address_2,
							element?.address_3,
							element?.city,
							element?.province,
							element?.country,
							element?.postal_code,
							element?.latitude,
							element?.longitude,
							element?.biography,
							{
								facebookURL: element?.facebook,
								instagramURL: element?.instagram,
								twitterURL: element?.twitter,
								linkedinURL: element?.linkedin,
							},
							element?.main_image,
							element?.contact_email,
							response.data?.data?.is_member
						);
						companies?.push(companyForArray);
					}
				);
				currentPage = response?.data?.meta?.current_page;
				totalPages = response?.data?.meta?.last_page;
				fromCompany = response?.data?.meta?.from;
				toCompany = response?.data?.meta?.to;
				totalCompanies = response?.data?.meta?.total;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
		return {
			companies: companies,
			currentPage: currentPage,
			totalPages: totalPages,
			fromCompany: fromCompany,
			toCompany: toCompany,
			totalCompanies: totalCompanies,
		};
	}

	public async update(
		userEditing: User,
		id = this.id,
		contactEmail: string,
		token: string,
		name?: string,
		firstAddress?: string,
		secondAddress?: string,
		thirdAddress?: string,
		city?: string,
		province?: string,
		country?: string,
		postalCode?: string,
		latitude?: number,
		longitude?: number,
		biography?: string,
		twitter?: string,
		instagram?: string,
		facebook?: string,
		linkedin?: string,
		mainImage?: Blob | MediaSource,
		isMember?: boolean,
		website?: string,
		phoneNumber?: string,
		banner?: Blob | MediaSource,
		specifications?: Array<number>,
		specificationsToRemove?: Array<number>
	): Promise<Company | boolean> {
		if (!id) {
			console.error("Missing ID");
			return false;
		}

		const formData = new FormData();

		formData.append("id", id.toString());
		formData.append("contact_email", contactEmail);
		formData.append("name", name ? name : "");
		formData.append("address_1", firstAddress ? firstAddress : "");
		formData.append("address_2", secondAddress ? secondAddress : "");
		formData.append("address_3", thirdAddress ? thirdAddress : "");
		formData.append("city", city ? city : "");
		formData.append("province", province ? province : "");
		formData.append("country", country ? country : "");
		formData.append("postal_code", postalCode ? postalCode : "");
		formData.append("latitude", latitude ? latitude.toString() : "");
		formData.append("longitude", longitude ? longitude.toString() : "");
		formData.append("biography", biography ? biography : "");
		formData.append("twitter", twitter ? twitter : "");
		formData.append("instagram", instagram ? instagram : "");
		formData.append("facebook", facebook ? facebook : "");
		formData.append("linkedIn", linkedin ? linkedin : "");
		formData.append("website", website ? website : "");
		formData.append("phone_number", phoneNumber ? phoneNumber : "");
		formData.append("is_member", isMember ? 1 : 0);
		if (mainImage) {
			formData.append("image", mainImage);
		}
		if (banner) {
			formData.append("banner", banner);
		}

		formData.append(
			"updated_by",
			userEditing.id ? userEditing.id.toString() : ""
		);
		formData.append("updated_at", new Date().toString());
		formData.append(
			"specifications",
			specifications
				? JSON.stringify({
						attach: specifications,
						detach: specificationsToRemove,
				  })
				: []
		);

		return await axios
			.postForm(
				process.env.REACT_APP_CAMM_API + "/companies/update",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						"Access-Control-Allow-Origin": "*",
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((response) => {
				if (response?.status == 200) {
					this.contactEmail = response.data.data.contact_email;
					this.name = response.data.data.name;
					this.firstAddress = response.data.data.firstAddress;
					this.secondAddress = response.data.data.secondAddress;
					this.thirdAddress = response.data.data.thirdAddress;
					this.city = response.data.data.city;
					this.province = response.data.data.province;
					this.country = response.data.data.country;
					this.postalCode = response.data.data.postalCode;
					this.latitude = response.data.data.latitude;
					this.longitude = response.data.data.longitude;
					this.biography = response.data.data.biography;
					this.socialMedia = {
						facebookURL: response.data.data.facebook,
						instagramURL: response.data.data.instagram,
						twitterURL: response.data.data.twitter,
						linkedinURL: response.data.data.linkedin,
					};
					this.mainImage = response.data.data.mainImage;
					this.isMember = response.data.data.is_member;
					return this;
				}
				return false;
			})
			.catch(function (error) {
				console.error(error);
				return false;
			});
	}

	public async create(
		token: string,
		contactEmail: string,
		name?: string,
		firstAddress?: string,
		secondAddress?: string,
		thirdAddress?: string,
		city?: string,
		province?: string,
		country?: string,
		postalCode?: string,
		latitude?: number,
		longitude?: number,
		biography?: string,
		twitter?: string,
		instagram?: string,
		facebook?: string,
		linkedin?: string,
		isMember?: boolean,
		mainImage?: Blob | MediaSource,
		website?: string,
		phoneNumber?: string,
		banner?: Blob | MediaSource,
		specifications?: Array<number>
	): Promise<boolean> {
		let created = false;
		const formData = new FormData();
		formData.append("contact_email", contactEmail);
		formData.append("name", name ? name : "");
		formData.append("address_1", firstAddress ? firstAddress : "");
		formData.append("address_2", secondAddress ? secondAddress : "");
		formData.append("address_3", thirdAddress ? thirdAddress : "");
		formData.append("city", city ? city : "");
		formData.append("province", province ? province : "");
		formData.append("country", country ? country : "");
		formData.append("postal_code", postalCode ? postalCode : "");
		formData.append("latitude", latitude ? latitude.toString() : "");
		formData.append("longitude", longitude ? longitude.toString() : "");
		formData.append("biography", biography ? biography : "");
		formData.append("twitter", twitter ? twitter : "");
		formData.append("instagram", instagram ? instagram : "");
		formData.append("facebook", facebook ? facebook : "");
		formData.append("linkedIn", linkedin ? linkedin : "");
		formData.append("website", website ? website : "");
		formData.append("phone_number", phoneNumber ? phoneNumber : "");
		formData.append("is_member", isMember ? 1 : 0);
		if (mainImage) {
			formData.append("image", mainImage);
		}
		if (banner) {
			formData.append("banner", banner);
		}
		formData.append(
			"specifications",
			specifications ? JSON.stringify(specifications) : null
		);

		return await axios
			.postForm(
				process.env.REACT_APP_CAMM_API + "/companies/create",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						"Access-Control-Allow-Origin": "*",
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((response) => {
				if (response?.status == 201) {
					created = true;
					return created;
				}
				return created;
			})
			.catch(function (error) {
				console.error(error);
				return created;
			});
	}

	public async getCompanySpecifications(
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
			.get(process.env.REACT_APP_CAMM_API + "/company/specifications", {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					Authorization: `Bearer ${token}`,
				},
				params: {
					id: id,
					page: page,
				},
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
}
