import Company from "../Company";
import Specification from "../Specification";
import User from "../User";
import Opportunity from "./index";

test("Given the correct login values, opportunity getOpportunities should return an array of opportunities", async () => {
	const userForTest = new User("developers@splicedigital.com");
	const logInResponse = await userForTest.login("password");
	const response = await Opportunity.getOpportunities(logInResponse.token, 1);
	const opportunities = response?.opportunities;
	expect(Array.isArray(opportunities)).toBe(true);
	expect(opportunities[0] instanceof Opportunity).toBe(true);
});

test("Given the correct login values, opportunity searchOpportunities should return an array of opportunities", async () => {
	const userForTest = new User("developers@splicedigital.com");
	const logInResponse = await userForTest.login("password");
	const response = await Opportunity.searchOpportunities(
		logInResponse.token,
		"TEST",
		1
	);
	const opportunities = response?.opportunities;
	expect(Array.isArray(opportunities)).toBe(true);
	expect(opportunities[0] instanceof Opportunity).toBe(true);
});

// test("Given the correct login values and opportunity data, opportunity create should return true", async () => {
// 	const user = new User("developers@splicedigital.com", 1);
// 	const { token } = await user.login("password");
// 	const opportunityToCreate = new Opportunity(
// 		undefined,
// 		"Test Opportunity",
// 		"open",
// 		"Test description",
// 		undefined,
// 		undefined,
// 		new Company(1),
// 		[user],
// 		[new Specification("Mold & Die Cast Types", "0 - 500 Ton Press", 1)]
// 	);
// 	const opportunityCreateResponse = await opportunityToCreate.create(token);
// 	expect(opportunityCreateResponse).toBe(true);
// });
