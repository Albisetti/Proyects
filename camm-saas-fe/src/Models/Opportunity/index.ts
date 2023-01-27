import { IOpportunity } from "./OpportunityInterface";
import axios from "axios";
import { ISpecification } from "../Specification/SpecificationInterface";
import User from "../User";
import Specification from "../Specification";
import Company from "../Company";
import { ICountry } from "../Country/CountryInterface";

export default class Opportunity implements IOpportunity {
	id?: number;
	title?: string;
	status?: string;
	description?: string;
	openDate?: Date;
	closeDate?: Date;
	company?: Company;
	companies?: Company[];
	specifications?: Array<ISpecification>;
	countries?: Array<ICountry>;

	constructor(
		id?: number,
		title?: string,
		status?: string,
		description?: string,
		openDate?: Date,
		closeDate?: Date,
		company?: Company,
		companies?: Company[],
		specifications?: Array<ISpecification>,
		countries?: Array<ICountry>
	) {
		this.id = id;
		this.title = title;
		this.status = status;
		this.description = description;
		this.openDate = openDate;
		this.closeDate = closeDate;
		this.company = company;
		this.companies = companies;
		this.specifications = specifications;
		this.countries = countries;
	}
	async delete(token: string, id = this.id): Promise<boolean> {
		let deleted = false;
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/opportunities/delete",
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

	async create(
		token: string,
		title = this.title,
		status = this.status,
		description = this.description,
		openDate = this.openDate,
		closeDate = this.closeDate,
		company = this.company,
		companies = this.companies,
		specifications = this.specifications,
		countries = this.countries
	): Promise<boolean> {
		let created = false;
		const usersIds = companies?.map((company) => company?.id);
		const specificiationsIds = specifications?.map(
			(specification) => specification?.id
		);
		const countriesIds = countries?.map(
			(country) => country?.id
		);
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/opportunities/create",
				{
					title: title,
					status: status,
					description: description,
					open_date: Math.floor(
						openDate?.getTime() ? openDate?.getTime() / 1000 : 0
					),

					close_date:
						closeDate &&
						Math.floor(closeDate?.getTime() ? closeDate?.getTime() / 1000 : 0),
					company_id: company?.id,
					members: usersIds && usersIds.length >= 1 ? usersIds : null,
					specifications: specificiationsIds && specificiationsIds.length >=1 ? specificiationsIds : null,
					countries: countriesIds && countriesIds.length >=1 ? countriesIds : null,
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
				if (response?.status >= 200 && response?.status < 300) {
					created = true;
				}
			})
			.catch(function (error) {
				// handle error
				console.error(error);
				return false;
			});
		return created;
	}

	async addMembers(token: string, members: Company[]): Promise<boolean> {
		let created = false;
		const membersIds = members?.map((member) => member?.id);
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/opportunities/update",
				{
					id: this.id,
					members: {
						attach: membersIds,
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
				if (response?.status >= 200 && response?.status < 300) {
					created = true;
				}
			})
			.catch(function (error) {
				// handle error
				console.error(error);
				return false;
			});
		return created;
	}

	public static async getOpportunities(
		token: string,
		page: number,
		limit?: number,
		withItem?: string[],
		filters?: { specification_ids?: string[]; specification_types?: string[] }
	): Promise<{
		opportunities: Array<Opportunity>;
		currentPage: number;
		totalPages: number;
		fromOpportunity: number;
		toOpportunity: number;
		totalOpportunities: number;
	}> {
		let currentPage = 1;
		let totalPages = 1;
		let fromOpportunity = 1;
		let toOpportunity = 1;
		let totalOpportunities = 1;

		const opportunities: Array<Opportunity> = [];
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/opportunities",
				{
					page: page,
					limit: limit || 50,
					with: withItem,
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
				response?.data?.data?.forEach(
					(element: {
						id: number;
						title: string;
						status: string;
						open_date: string;
						close_date: string;
						description: string;
						company_id: number;
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
						};
						members: {
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
								element?.company_id,
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
								element?.company?.contact_email
							),
							element?.members?.map(
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
				currentPage = response?.data?.meta?.current_page;
				totalPages = response?.data?.meta?.last_page;
				fromOpportunity = response?.data?.meta?.from;
				toOpportunity = response?.data?.meta?.to;
				totalOpportunities = response?.data?.meta?.total;
			})
			.catch(function (error) {
				// handle error
				console.error(error);
				return false;
			});
		return {
			opportunities: opportunities,
			currentPage: currentPage,
			totalPages: totalPages,
			fromOpportunity: fromOpportunity,
			toOpportunity: toOpportunity,
			totalOpportunities: totalOpportunities,
		};
	}

	public static async getOpportunityWithSpecifications(
		token: string,
		id: number
	): Promise<{
		opportunity?: Opportunity;
		companyId?: number;
	}> {
		let responseOpportunity: Opportunity | undefined = undefined;
		let responseCompanyId: number | undefined = undefined;
		await axios
			.get(process.env.REACT_APP_CAMM_API + "/opportunity", {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					Authorization: `Bearer ${token}`,
				},
				params: { id: id, with: ["specifications"] },
			})
			.then((response) => {
				responseOpportunity = new Opportunity(
					response?.data?.data?.id,
					response?.data?.data?.title,
					response?.data?.data?.status,
					response?.data?.data?.description,
					new Date(response?.data?.data?.open_date),
					new Date(response?.data?.data?.close_date),
					undefined,
					undefined,
					response?.data?.data?.specifications?.map(
						(item: {
							type: string;
							name: string;
							id: number;
							description: string;
							before_cta_text: string;
							after_cta_text: string;
						}) =>
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
				responseCompanyId = response?.data?.data?.company_id;
			})
			.catch(function (error) {
				// handle error
				console.error(error);
				return false;
			});
		return { opportunity: responseOpportunity, companyId: responseCompanyId };
	}

	public static async getLatestOpportunities(
		token: string,
		page: number
	): Promise<{
		opportunities: Array<Opportunity>;
		currentPage: number;
		totalPages: number;
		fromOpportunity: number;
		toOpportunity: number;
		totalOpportunities: number;
	}> {
		let currentPage = 1;
		let totalPages = 1;
		let fromOpportunity = 1;
		let toOpportunity = 1;
		let totalOpportunities = 1;
		const opportunities: Array<Opportunity> = [];
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/opportunities",
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
				response?.data?.data?.forEach(
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
								element?.company?.contact_email
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
				currentPage = response?.data?.meta?.current_page;
				totalPages = response?.data?.meta?.last_page;
				fromOpportunity = response?.data?.meta?.from;
				toOpportunity = response?.data?.meta?.to;
				totalOpportunities = response?.data?.meta?.total;
			})
			.catch(function (error) {
				// handle error
				console.error(error);
				return false;
			});
		return {
			opportunities: opportunities,
			currentPage: currentPage,
			totalPages: totalPages,
			fromOpportunity: fromOpportunity,
			toOpportunity: toOpportunity,
			totalOpportunities: totalOpportunities,
		};
	}

	public static async searchOpportunities(
		token: string,
		search: string,
		page?: number,
		limit?: number,
		withItem?: string[],
		filters?: { specification_types?: string[] }
	): Promise<{
		opportunities: Array<Opportunity>;
		currentPage: number;
		totalPages: number;
		fromOpportunity: number;
		toOpportunity: number;
		totalOpportunities: number;
	}> {
		let currentPage = 1;
		let totalPages = 1;
		let fromOpportunity = 1;
		let toOpportunity = 1;
		let totalOpportunities = 1;
		const opportunities: Array<Opportunity> = [];
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/opportunities/search",
				{
					page: page,
					search: search,
					with: withItem,
					limit: limit || 50,
					filters: filters?.specification_types
						? filters?.specification_types.length > 0
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
						};
						members: {
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
								element?.company?.contact_email
							),
							element?.members?.map(
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
				currentPage = response?.data?.meta?.current_page;
				totalPages = response?.data?.meta?.last_page;
				fromOpportunity = response?.data?.meta?.from;
				toOpportunity = response?.data?.meta?.to;
				totalOpportunities = response?.data?.meta?.total;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
		return {
			opportunities: opportunities,
			currentPage: currentPage,
			totalPages: totalPages,
			fromOpportunity: fromOpportunity,
			toOpportunity: toOpportunity,
			totalOpportunities: totalOpportunities,
		};
	}

	async requestNewOpportunity(
		token: string,
		title = this.title,
		description = this.description,
		openDate = this.openDate,
		closeDate = this.closeDate,
		company = this.company,
		countries = this.countries,
		specifications = this.specifications
	): Promise<boolean> {
		let created = false;
		const specificiationsIds = specifications?.map(
			(specification) => specification?.id
		);
		const countriesIds = countries?.map(
			(country) => country?.id
		);
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/opportunities/request",
				{
					title: title,
					description: description,
					open_date: Math.floor(
						openDate?.getTime() ? openDate?.getTime() / 1000 : 0
					),

					close_date:
						closeDate &&
						Math.floor(closeDate?.getTime() ? closeDate?.getTime() / 1000 : 0),
					company_id: company?.id,
					specifications: specificiationsIds ? specificiationsIds : null,
					countries: countriesIds && countriesIds?.length >= 1 ? countriesIds : null,
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
				if (response?.status >= 200 && response?.status < 300) {
					created = true;
				}
			})
			.catch(function (error) {
				// handle error
				console.error(error);
				return false;
			});
		return created;
	}

	save(): boolean {
		return true;
	}
}
