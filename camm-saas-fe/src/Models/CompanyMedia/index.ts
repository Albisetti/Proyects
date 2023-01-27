/* eslint-disable indent */
/* eslint-disable no-mixed-spaces-and-tabs */
import axios from "axios";
import FormData from "form-data";
import { IMedia } from "../Media/MediaInterface";

export default class CompanyMedia implements IMedia {
	id?: number;
	url?: string;
	file_name?: string;
	mime_type?: string;
	size?: number;

	// created_by?:String;
	// updated_by?:String;
	// created_at?:String;
	// updated_at?:String;

	constructor(
		id?: number,
		url?: string,
		file_name?: string,
		mime_type?: string,
		size?: number
	) {
		this.id = id;
		this.url = url;
		this.file_name = file_name;
		this.mime_type = mime_type;
		this.size = size;
	}

	public static async getCompanyMedias(
		token: string,
		comapny_id: number,
		page?: number,
		limit?: number
	): Promise<{
		medias: Array<CompanyMedia>;
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
		const companyMedia: Array<CompanyMedia> = [];
		await axios
			.get(process.env.REACT_APP_CAMM_API + "/company/medias", {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					Authorization: `Bearer ${token}`,
				},
				params: {
					id: comapny_id,
					page: page,
					limit: limit || 50,
				},
			})
			.then((response) => {
				response.data?.data?.forEach(
					(element: {
						id: number;
						url: string;
						file_name: string;
						mime_type: string;
						size: number;
					}) => {
						const mediaForArray = new CompanyMedia(
							element?.id,
							element?.url,
							element?.file_name,
							element?.mime_type,
							element?.size
						);
						companyMedia?.push(mediaForArray);
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
			medias: companyMedia,
			currentPage: currentPage,
			totalPages: totalPages,
			fromCompany: fromCompany,
			toCompany: toCompany,
			totalCompanies: totalCompanies,
		};
	}

	public static async addCompanyMedia(
		token: string,
		comapny_id: number,
		media: Blob | MediaSource | string
	): Promise<CompanyMedia | boolean> {
		//FormData Require to properly process MediaSource
		const formData = new FormData();
		formData.append("id", comapny_id);
		formData.append("media", media);

		return await axios
			.post(process.env.REACT_APP_CAMM_API + "/company/medias/add", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					"Access-Control-Allow-Origin": "*",
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				if (response?.status == 200) {
					return new CompanyMedia(
						response.data?.data?.id,
						response.data?.data?.url,
						response.data?.data?.file_name,
						response.data?.data?.mime_type,
						response.data?.data?.size
					);
				}
				return false;
			})
			.catch(function (error) {
				console.error(error);
				return false;
			});
	}

	public async delete(token: string, id = this.id): Promise<boolean> {
		let deleted = false;
		await axios
			.post(
				process.env.REACT_APP_CAMM_API + "/company/medias/remove",
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
}
