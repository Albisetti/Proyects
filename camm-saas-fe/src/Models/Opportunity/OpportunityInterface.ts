import Company from "../Company";
import { ISpecification } from "../Specification/SpecificationInterface";
import { ICompany } from "../Company/CompanyInterface";

export interface IOpportunity {
	id?: number;
	title?: string;
	status?: string;
	description?: string;
	openDate?: Date;
	closeDate?: Date;
	company?: ICompany;
	users?: Company[];
	specifications?: Array<ISpecification>;
}
