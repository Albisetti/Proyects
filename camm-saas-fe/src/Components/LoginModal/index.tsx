import React, { FC, useState, useContext } from "react";
import { AuthContext } from "../../auth";
import { useNavigate } from "react-router-dom";
import { TabTitle } from "../Utils/BrowserTitles";

type LoginModalProps = {
	showAuthModal: {
		signUp: boolean;
		logIn: boolean;
	};
	setShowAuthModal: React.Dispatch<
		React.SetStateAction<{
			signUp: boolean;
			logIn: boolean;
		}>
	>;
};

const LoginModal: FC<LoginModalProps> = ({
	showAuthModal,
	setShowAuthModal,
}: LoginModalProps) => {
	const [userData, setUserData] = useState({ email: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);
	const [showInvalidLoginMessage, setShowInvalidLoginMessage] = useState(false);
	const [logInLoading, setLogInLoading] = useState(false);
	const navigate = useNavigate();
	const { login } = useContext(AuthContext);

	const isValidEmail = (email: string) => {
		const regEx = /\S+@\S+\.\S+/;
		return regEx.test(String(email).toLowerCase());
	};

	const validateInput = () => {
		setShowInvalidLoginMessage(false);

		if (
			!isValidEmail(userData?.email) ||
			!userData.email ||
			!userData.password
		) {
			setShowInvalidLoginMessage(true);
		}
	};

	const handleLogin = async (e: React.MouseEvent<HTMLElement>) => {
		setLogInLoading(true);
		validateInput();
		e.preventDefault();

		if (
			!isValidEmail(userData?.email) ||
			!userData.email ||
			!userData.password
		) {
			setLogInLoading(false);
			return;
		} else {
			login(userData?.password, userData?.email).then((response) => {
				if (response) navigate("/directory");
				else {
					setLogInLoading(false);
					setShowInvalidLoginMessage(true);
				}
			});
		}
	};
	TabTitle("CAMM - Login");
	return (
		<>
			<div
				className={`${
					!showAuthModal?.logIn && "hidden"
				} overflow-auto z-10 top-0 left-0 w-100% h-100% mt-[150px]`}
			>
				<div className="flex  items-center h-full justify-center font-roboto m-[20px]">
					<div className=" w-[513px] h-[542px] shadow-lg items-center flex justify-center">
						<div className=" w-[380px] ">
							<h2 className="text-[36px] leading-[48px] pb-[25px]">Log In</h2>
							<form>
								<div className="mb-3">
									<p className="text-[10px] pb-[3px] font-semibold">Email</p>
									<input
										onChange={(event) => {
											setUserData({
												email: event?.target?.value,
												password: userData.password,
											});
										}}
										required
										type="email"
										className="h-[48px] form-control block w-full px-4 py-2 text-xl font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none focus:border-brightRed"
									/>
								</div>
								<div className="relative">
									<p className="text-[10px] pb-[3px] font-semibold">Password</p>
									<div className="absolute inset-y-0 right-0 flex items-center px-2 ">
										<label
											onClick={() => setShowPassword(!showPassword)}
											className=" select-none rounded px-2 pt-4 cursor-pointer "
										>
											{showPassword ? (
												<img
													className="w-[24px] h-[24px] "
													src="/assets/icons/no-view.svg"
												/>
											) : (
												<img
													className="w-[24px] h-[24px] "
													src="/assets/icons/view.svg"
												/>
											)}
										</label>
									</div>
									<input
										onChange={(event) => {
											setUserData({
												email: userData.email,
												password: event?.target?.value,
											});
										}}
										required
										type={showPassword ? "text" : "password"}
										className="focus:border-brightRed h-[48px]  block w-full px-4 py-2 text-xl font-normal  bg-white  border  rounded transition border-grey focus:outline-none"
									/>
								</div>

								<div className="flex justify-between items-center mb-6 pt-[15px] pl-4">
									<div className="form-group form-check">
										<input
											type="checkbox"
											className=" appearance-none h-4 w-4 border border-grey rounded-sm bg-white checked:bg-brightRed checked:border-brightRed focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
										/>
										<label>Remember me</label>
									</div>
								</div>
								<button
									type="submit"
									onClick={async (event) => {
										handleLogin(event);
									}}
									className="h-[48px] inline-block px-7 py-3 bg-brightRed text-white text-[16px] font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
								>
									{!logInLoading ? "Log In" : "Logging In"}
								</button>

								{showInvalidLoginMessage && (
									<p
										className={
											"text-[12px] flex items-center justify-center text-brightRed mt-[15px]"
										}
									>
										There was an error while logging in! Please check your
										credentials
									</p>
								)}
								<a
									onClick={() => {
										setShowAuthModal({ logIn: false, signUp: false });
										navigate("/forgot-password");
									}}
									className="ml-[113px] mt-4 my-3 text-brightRed w-[150px]  flex justify-center hover:shadow-lg cursor-pointer"
								>
									Forgot Password
								</a>
								<p
									className="ml-[100px] mt-7 my-3 text-brightRed w-[180px]  flex justify-center hover:shadow-lg cursor-pointer"
									onClick={() => {
										setShowAuthModal({ logIn: false, signUp: true });
										TabTitle("CAMM - Sign Up");
										navigate("/signup");
									}}
								>
									Dont Have An Account?
								</p>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default LoginModal;
