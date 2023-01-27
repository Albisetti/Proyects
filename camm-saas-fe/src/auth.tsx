/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, createContext, useEffect } from "react";
import User from "./Models/User";

const {
	email,
	id,
	company,
	firstName,
	lastName,
	biography,
	socialMedia,
	profileImage,
} = JSON.parse(localStorage.getItem("user") || "{}");

export const AuthContext = createContext({
	user: new User(
		email,
		id,
		company,
		firstName,
		lastName,
		biography,
		socialMedia,
		profileImage
	),
	token: localStorage.getItem("token")!,
	isLoggedIn: localStorage.getItem("isLoggedIn") === "true" ? true : false,
	login: async (email: string, password: string): Promise<boolean> => {
		if (!email || password) return false;
		return true;
	},
	logout: (): void => {
		console.log("logout");
	},
	signUp: async (
		password: string,
		passwordConfirmation: string,
		firstName: string,
		lastName: string,
		email: string,
		askedRelatedCompany: string
	): Promise<boolean> => {
		if (!email || !password || !passwordConfirmation || !firstName || !lastName)
			return false;
		return true;
	},
});

export interface LayoutProps {
	children: React.ReactNode;
}

export const AuthProvider = (props: LayoutProps) => {
	const [user, setUser] = useState(new User(""));
	const [token, setToken] = useState(localStorage.getItem("token")!);
	const [isLoggedIn, setIsLoggedIn] = useState(
		localStorage.getItem("isLoggedIn") === "true" ? true : false
	);

	useEffect(() => {
		const {
			email,
			id,
			company,
			firstName,
			lastName,
			biography,
			socialMedia,
			profileImage,
			roles,
		} = JSON.parse(localStorage.getItem("user") || "{}");
		setUser(
			new User(
				email,
				id,
				company,
				firstName,
				lastName,
				biography,
				socialMedia,
				profileImage,
				undefined,
				undefined,
				undefined,
				roles
			)
		);
		setToken(localStorage.getItem("token") || "{}");
		setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true" ? true : false);
	}, []);

	const login = async (email: string, password: string): Promise<boolean> => {
		if (!email || !password) return false;
		const logInResponse = await user.login(email, password);
		if (!logInResponse.isLoggedIn) return false;
		setUser(logInResponse.user);
		setToken(logInResponse.token);
		setIsLoggedIn(logInResponse.isLoggedIn);
		localStorage.setItem("user", JSON.stringify(logInResponse.user));
		localStorage.setItem("token", logInResponse.token);
		localStorage.setItem(
			"isLoggedIn",
			JSON.stringify(logInResponse.isLoggedIn)
		);

		return true;
	};

	const logout = (): void => {
		localStorage.setItem("user", "");
		localStorage.setItem("token", "");
		localStorage.setItem("isLoggedIn", "");
		setUser(new User(""));
		setToken("");
		setIsLoggedIn(false);
	};

	const signUp = async (
		password: string,
		passwordConfirmation: string,
		firstName: string,
		lastname: string,
		email: string,
		askedRelatedCompany: string
	): Promise<boolean> => {
		if (!email || !password || !passwordConfirmation || !firstName || !lastname)
			return false;
		await user.signUp(
			password,
			passwordConfirmation,
			firstName,
			lastname,
			email,
			askedRelatedCompany
		);
		return true;
	};

	return (
		<AuthContext.Provider
			value={{ user, token, isLoggedIn, login, logout, signUp }}
		>
			{props.children}
		</AuthContext.Provider>
	);
};
