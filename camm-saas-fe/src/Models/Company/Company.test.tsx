import User from "../User";
import Company from "./index";

test("Given the correct login values, company getCompanies should return an array of companies", async () => {
	const userForTest = new User("developers@splicedigital.com");
	const logInResponse = await userForTest.login("password");
	const response = await Company.getCompanies(logInResponse.token, 1);
	const companies = response?.companies;
	expect(Array.isArray(companies)).toBe(true);
	expect(companies[0] instanceof Company).toBe(true);
});

test("Given the correct login values, company searchCompanies should return an array of companies", async () => {
	const userForTest = new User("developers@splicedigital.com");
	const logInResponse = await userForTest.login("password");
	const response = await Company.searchCompanies(
		logInResponse.token,
		"turco",
		1
	);
	const companies = response?.companies;
	expect(Array.isArray(companies)).toBe(true);
	expect(companies[0] instanceof Company).toBe(true);
});
