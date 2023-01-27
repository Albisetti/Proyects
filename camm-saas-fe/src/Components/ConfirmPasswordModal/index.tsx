import React, { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import User from "../../Models/User";

const ConfirmPasswordModal: FC= () => {
	const [userData, setUserData] = useState({
		password: "",
		confirmPassword: "",
	});

	const [showNoPasswordMessage, setShowNoPasswordMessage] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
	const [showNoConfirmPasswordMessage, setShowNoConfirmPasswordMessage] =
		useState(false);
	const [showDifferentPassword, setShowDifferentPassword] = useState(false);
	const [showInvalidPassword, setShowInvalidPassword] = useState(false);
	const [showError, setShowError] = useState(false);
	const navigate = useNavigate();
	const { slug } = useParams();
	const email = slug?.split("=",2)?.[0];
	const confirmationCode = slug?.split("=",2)?.[1];

	const [showPassword, setShowPassword] = useState(false);
	function containsSpecialChars(str: string) {
		const specialChars =
			/(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/;
		const letters = /[0-9]/;
		if (specialChars.test(str) && letters.test(str)) {
			return specialChars.test(str);
		} else {
			return false;
		}
	}
	const validateInput = () => {
		setShowNoPasswordMessage(false);
		setShowNoConfirmPasswordMessage(false);
		setShowDifferentPassword(userData.password != userData.confirmPassword);

		if (userData.password == "") {
			setShowNoPasswordMessage(true);
		}
		if (userData.confirmPassword == "") {
			setShowNoPasswordMessage(true);
		}
		setShowInvalidPassword(!containsSpecialChars(userData?.password));
	};

	const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
		validateInput();
		e.preventDefault();
		if (
			!showInvalidPassword &&
			!showNoPasswordMessage &&
			!showDifferentPassword &&
			confirmationCode &&
			email
		) {
			const user = new User(email);
			user
				.resetPassword(userData?.password, userData?.confirmPassword, confirmationCode, email)
				.then((response) => {
					if (response) {
						navigate("/password-reset-result");
					} else {
						setShowError(true);
					}
				});
		}
	};

	return (
		<>
			<div className="flex  items-center h-full justify-center font-roboto m-[20px]">
				<div className=" w-[513px] min-h-[450px] shadow-lg items-center flex justify-center">
					<div className=" w-[380px] text-left">
						<h2 className=" text-[36px] leading-[48px] pb-[25px]">
							Enter New Password
						</h2>
						<div className="relative mb-3">
							<div className="flex">
								<p className="text-[10px] pb-[3px] font-semibold">
									New Password
								</p>
								<p className="ml-1 text-[10px] pb-[3px] text-darkGrey">
									(Min 1 Num, 1 Letter, 1 Symbol)
								</p>
							</div>
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
										password: event?.target?.value,
										confirmPassword: userData.confirmPassword,
									});
								}}
								required
								pattern="(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{3,}"
								type={showPassword ? "text" : "password"}
								className="focus:border-brightRed h-[48px]  block w-full px-4 py-2 text-xl font-normal  bg-white  border  rounded transition border-grey focus:outline-none"
							/>
						</div>
						<div className="relative mb-8 text-left ">
							<p className="text-[10px] pb-[3px] font-semibold">
								Confirm New Password
							</p>
							<div className="absolute inset-y-0 right-0 flex items-center px-2 ">
								<label
									onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
									className=" select-none rounded px-2 pt-4 cursor-pointer "
								>
									{showPasswordConfirm ? (
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
										password: userData.password,
										confirmPassword: event?.target?.value,
									});
								}}
								required
								pattern="(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{3,}"
								type={showPasswordConfirm ? "text" : "password"}
								className="focus:border-brightRed h-[48px]  block w-full px-4 py-2 text-xl font-normal  bg-white  border  rounded transition border-grey focus:outline-none"
							/>
						</div>
						<button
							type="submit"
							onClick={async (event) => {
								handleSubmit(event);
							}}
							className="h-[48px] inline-block px-7 py-3 bg-brightRed text-white text-[16px] font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
						>
							Confirm Password
						</button>
						<p
							className={`${
								showNoConfirmPasswordMessage || showNoPasswordMessage
									? "block "
									: "hidden"
							} text-[12px] flex items-center justify-center text-brightRed mt-[15px]`}
						>
							Missing password
						</p>
						<p
							className={`${
								showInvalidPassword && !showNoPasswordMessage
									? "block "
									: "hidden"
							} text-[12px] flex items-center justify-center text-brightRed mt-[15px]`}
						>
							Invalid Password
						</p>
						<p
							className={`${
								showDifferentPassword ? "block " : "hidden"
							} text-[12px] flex items-center justify-center text-brightRed mt-[15px]`}
						>
							Passwords dont match
						</p>
						<p
							className={`${
								showError ? "block " : "hidden"
							} text-[12px] flex items-center justify-center text-brightRed mt-[15px]`}
						>
							Sorry, something went wrong. Try again later
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default ConfirmPasswordModal;
