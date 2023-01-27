import { ICountry } from "./CountryInterface";

export default class Country implements ICountry {
	id?: number;
	title?: string;
	isoCode?: string;

	constructor(
		id?: number,
		title?: string,
		isoCode?: string
	) {
		this.id = id;
		this.title = title;
		this.isoCode = isoCode;
	}

	save(): boolean {
		return true;
	}
}
