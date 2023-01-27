import React, { FC, useState } from "react";

import { useNavigate } from "react-router-dom";
import User from "../../Models/User";

type ForgotPasswordModalProps = {
	showAuthModal: {
		signUp: boolean;
		logIn: boolean;
	};
};
const ForgotPasswordModal: FC<ForgotPasswordModalProps> = ({
	showAuthModal,
}: ForgotPasswordModalProps) => {
	const [userData, setUserData] = useState({ email: "", password: "" });
	const [showNoEmailMessage, setShowNoEmailMessage] = useState(false);
	const [showNoPasswordMessage, setShowNoPasswordMessage] = useState(false);
	const [showInvalidEmail, setShowInvalidEmail] = useState(false);
	const [logInLoading, setLogInLoading] = useState(false);
	const navigate = useNavigate();

	const isValidEmail = (email: string) => {
		const regEx = /\S+@\S+\.\S+/;
		return regEx.test(String(email).toLowerCase());
	};

	const validateInput = () => {
		setShowInvalidEmail(false);
		setShowNoEmailMessage(false);
		setShowNoPasswordMessage(false);

		if (!isValidEmail(userData?.email)) {
			setShowInvalidEmail(true);
		}
		if (!userData.email) {
			setShowNoEmailMessage(true);
		}
		if (!userData.password) {
			setShowNoPasswordMessage(true);
		}
	};

	const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
		validateInput();
		e.preventDefault();

		if (showNoEmailMessage || showNoPasswordMessage || showInvalidEmail) {
			setLogInLoading(false);
			return;
		} else {
			const user = new User(userData?.email);
			user.forgotPassword().then((response) => {
				if (response) {
					navigate("/forgot-password-email");
				} else {
					setShowInvalidEmail(true);
				}
			});
		}
	};

	return (
		<>
			<div
				className={`${
					showAuthModal?.signUp || showAuthModal.logIn ? "hidden" : "block"
				} overflow-auto z-10 top-0 left-0 w-100% h-100% mt-[150px]`}
			>
				<div className="flex  items-center h-full justify-center font-roboto m-[20px]">
					<div className=" w-[513px] min-h-[350px] shadow-lg items-center flex justify-center">
						<div className=" w-[380px] ">
							<h2 className="text-[30px] leading-[48px] pb-[25px]">
								Please enter your email
							</h2>

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

								<button
									type="submit"
									onClick={async (event) => {
										handleSubmit(event);
									}}
									className="h-[48px] inline-block px-7 py-3 bg-brightRed text-white text-[16px] font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
								>
									{!logInLoading ? "Submit" : "Submitting"}
								</button>

								{showNoEmailMessage && (
									<p
										className={
											"text-[12px] flex items-center justify-center text-brightRed mt-[15px]"
										}
									>
										Missing Email!
									</p>
								)}

								{showInvalidEmail && !showNoEmailMessage && (
									<p
										className={
											"text-[12px] flex items-center justify-center text-brightRed mt-[15px]"
										}
									>
										Invalid email!
									</p>
								)}
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ForgotPasswordModal;
