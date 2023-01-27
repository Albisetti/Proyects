import { ICompany } from "../Company/CompanyInterface";
import { ISpecification } from "../Specification/SpecificationInterface";
import { SocialMedia } from "../Utils/SocialMedia";

export interface IUser {
	email: string;
	id?: number;
	company?: ICompany;
	firstName?: string;
	lastName?: string;
	biography?: string;
	socialMedia?: SocialMedia;
	profileImage?: string;
	specifications?: Array<ISpecification>;

	login(
		email: string,
		password: string
	): Promise<{ user: IUser; token: string; isLoggedIn: boolean }>;

	signUp(
		password: string,
		passwordConfirmation: string,
		firstName: string,
		lastName: string,
		email: string
	): Promise<boolean>;
}
