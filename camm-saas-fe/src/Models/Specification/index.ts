import axios from "axios";
import { ISpecification } from "./SpecificationInterface";

export default class Specification implements ISpecification {
	type: string;
	name: string;
	id?: number;
	description?: string;
	before?: string;
	after?: string;

	constructor(
		type: string,
		name: string,
		id?: number,
		description?: string,
		before?: string,
		after?: string
	) {
		this.type = type;
		this.name = name;
		this.id = id;
		this.description = description;
		this.before = before;
		this.after = after;
	}

	public static async getSpecifications(token: string) {
		return await axios
			.get(process.env.REACT_APP_CAMM_API + "/specifications", {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				return response.data.data.map(
					(item: {
						id: number;
						type: string;
						name: string;
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
				);
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
	}

	public static async getAllSpecifications(token: string) {
		return await axios
			.get(process.env.REACT_APP_CAMM_API + "/specificationFullList ", {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				return response.data.data.map(
					(item: {
						id: number;
						type: string;
						name: string;
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
				);
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
	}

	public static async getSpecificationTypes(token: string) {
		return await axios
			.get(process.env.REACT_APP_CAMM_API + "/specifications/types", {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				return response.data.data.map((item: string[]) => {
					return item[0];
				});
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return false;
			});
	}
}
