import User from "../User";
import Company from "../Company";
import CompanyMedia from "./index";

test("Given the correct login values and company, getCompanyMedias should return an array of medias", async () => {
	const userForTest = new User("developers@splicedigital.com");  //TODO: Move to pass argument
	const logInResponse = await userForTest.login("password");  //TODO: Move to input
	const company_id = 1; //TODO: Move to pass argument
	const response = await CompanyMedia.getCompanyMedias(logInResponse.token, company_id);
	const medias = response?.medias;
	expect(Array.isArray(medias)).toBe(true);
	expect(medias[0] instanceof CompanyMedia).toBe(true);
});