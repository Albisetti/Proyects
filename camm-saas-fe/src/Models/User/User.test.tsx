import User from "./index";

const date = new Date();
const timestampInMs = date.getTime();

test("Given the correct login values, user login should return an object", () => {
	const userForTest = new User("developers@splicedigital.com");
	expect(typeof userForTest.login("password") == "object").toBe(true);
});

test("Given the incorrect login values, user login should return empty token", async () => {
	const userForTest = new User("developers@splicedigital.com");
	const logInResponse = await userForTest.login("1234");
	expect(logInResponse?.token === "").toBe(true);
});

test("Given the correct login values, user getUsers should return an array of users", async () => {
	const userForTest = new User("developers@splicedigital.com");
	const logInResponse = await userForTest.login("password");
	const response = await User.getUsers(logInResponse.token, 1);
	const users = response?.users;
	expect(Array.isArray(users)).toBe(true);
	expect(users[0] instanceof User).toBe(true);
});

test("Given the correct login values, user searchUsers should return an array of users", async () => {
	const userForTest = new User("developers@splicedigital.com");
	const logInResponse = await userForTest.login("password");
	const response = await User.searchUsers(logInResponse.token, "dev", 1);
	const users = response?.users;
	expect(Array.isArray(users)).toBe(true);
	expect(users[0] instanceof User).toBe(true);
});

test("Given the correct sign in values, user sign up should return true", async () => {
	const userForTest = new User(
		`UnitTestFECAMM${timestampInMs}@splicedigital.com`,
		undefined,
		undefined,
		"UnitTestFE",
		"CAMM"
	);
	const signUpResponse = await userForTest.signUp("password", "password");
	expect(signUpResponse).toBe(true);
});

test("Given a user whose account already exists, when trying to use user sign up it should return false", async () => {
	const userForTest = new User(
		`UnitTestFECAMM${timestampInMs}@splicedigital.com`,
		undefined,
		undefined,
		"UnitTestFE",
		"CAMM"
	);
	const signUpResponse = await userForTest.signUp("password", "password");
	expect(signUpResponse).toBe(false);
});

test("Given a logged in user, when trying to delete itself user delete should return true", async () => {
	const userForTest = new User(
		`UnitTestFECAMM${timestampInMs}@splicedigital.com`
	);
	const { token } = await userForTest.login("password");
	const deleteUser = await userForTest.delete(token);
	expect(deleteUser).toBe(true);
});
