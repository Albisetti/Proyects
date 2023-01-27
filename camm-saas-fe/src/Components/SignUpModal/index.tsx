import React, { FC, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth";
import { useNavigate } from "react-router-dom";
import { TabTitle } from "../Utils/BrowserTitles";

type SignUpModalProps = {
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

const SignUpModal: FC<SignUpModalProps> = ({
	showAuthModal,
	setShowAuthModal,
}: SignUpModalProps) => {
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
	const [showInvalidEmail, setShowInvalidEmail] = useState(false);
	const [showInvalidPassword, setShowInvalidPassword] = useState(false);
	const [showDifferentPassword, setshowDifferentPassword] = useState(false);
	const [signUpLoading, setSignUpLoading] = useState(false);
	const [showMissingFields, setShowMissingFields] = useState({
		message: "",
		show: false,
	});
	const [userData, setUserData] = useState({
		firstName: "",
		lastName: "",
		organization: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const { signUp } = useContext(AuthContext);
	const navigate = useNavigate();
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

	const handleSubmit = () => {
		showMissingFields.message = "";
		let currentMessage = showMissingFields.message;
		Object.entries(userData).forEach((field) => {
			if (field[1] === "") {
				currentMessage += field[0] += ", ";
			} else {
				showMissingFields.message = "";
			}
		});

		if (currentMessage == "") {
			setShowMissingFields({
				message: "",
				show: false,
			});
		} else {
			setShowMissingFields({
				message: "Missing: " + currentMessage.slice(0, -2),
				show: true,
			});
		}

		setshowDifferentPassword(userData.password != userData.confirmPassword);
		setShowInvalidEmail(!userData.email.includes("@") && userData?.email != "");
		setShowInvalidPassword(
			!containsSpecialChars(userData?.password) && userData?.password != ""
		);
		if (
			userData.email.includes("@") &&
			userData?.email != "" &&
			containsSpecialChars(userData?.password) &&
			userData?.password != "" &&
			showMissingFields.message == "" &&
			!(userData.password != userData.confirmPassword)
		) {
			setSignUpLoading(true);
			signUp(
				userData?.password,
				userData?.confirmPassword,
				userData?.firstName,
				userData?.lastName,
				userData?.email,
				userData?.organization
			).then((response) => {
				if (response) {
					navigate("/confirm-email");
				}
				setSignUpLoading(false);
			});
		}
	};

	// useEffect(() => {
	// 	Company.getCompanies(token);
	// }, []);

	TabTitle("CAMM - Sign Up");

	return (
		<div
			className={`${
				!showAuthModal?.signUp && "hidden"
			}  overflow-auto z-10 top-0 left-0 w-100% h-100% mt-[150px]`}
		>
			<div className="flex  items-center h-full justify-center font-roboto m-[20px]">
				<div className=" min-w-[513px] min-h-[683px] shadow-lg items-center flex justify-center">
					<div className=" w-[380px] ">
						<h2 className=" text-[36px] leading-[48px] pb-[25px]">Sign Up</h2>
						<form>
							<div className="mb-3">
								<p className="text-[10px] pb-[3px] font-semibold">First Name</p>
								<input
									onChange={(event) => {
										setUserData({
											firstName: event?.target?.value,
											lastName: userData?.lastName,
											organization: userData.organization,
											email: userData.email,
											password: userData.password,
											confirmPassword: userData.confirmPassword,
										});
									}}
									required
									type="text"
									className="focus:border-brightRed h-[48px] form-control block w-full px-4 py-2 text-xl font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								/>
							</div>
							<div className="mb-3">
								<p className="text-[10px] pb-[3px] font-semibold">Last Name</p>
								<input
									onChange={(event) => {
										setUserData({
											firstName: userData?.firstName,
											lastName: event?.target?.value,
											organization: userData.organization,
											email: userData.email,
											password: userData.password,
											confirmPassword: userData.confirmPassword,
										});
									}}
									required
									type="text"
									className="focus:border-brightRed h-[48px] form-control block w-full px-4 py-2 text-xl font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								/>
							</div>
							<div className="mb-3">
								<p className="text-[10px] pb-[3px] font-semibold">
									Organization
								</p>
								<input
									onChange={(event) => {
										setUserData({
											firstName: userData?.firstName,
											lastName: userData?.lastName,
											organization: event?.target?.value,
											email: userData.email,
											password: userData.password,
											confirmPassword: userData.confirmPassword,
										});
									}}
									required
									type="text"
									className="focus:border-brightRed h-[48px] form-control block w-full px-4 py-2 text-xl font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								/>
							</div>
							<div className="mb-3">
								<p className="text-[10px] pb-[3px] font-semibold">Email</p>
								<input
									onChange={(event) => {
										setUserData({
											firstName: userData?.firstName,
											lastName: userData?.lastName,
											organization: userData.organization,
											email: event?.target?.value,
											password: userData.password,
											confirmPassword: userData.confirmPassword,
										});
									}}
									required
									type="email"
									className="focus:border-brightRed h-[48px] form-control block w-full px-4 py-2 text-xl font-normal bg-white bg-clip-padding border border-solid border-grey rounded transition ease-in-out m-0  focus:bg-white  focus:outline-none"
								/>
							</div>
							<div className="relative mb-3">
								<div className="flex">
									<p className="text-[10px] pb-[3px] font-semibold">Password</p>
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
											firstName: userData?.firstName,
											lastName: userData?.lastName,
											organization: userData.organization,
											email: userData.email,
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
							<div className="relative mb-4">
								<p className="text-[10px] pb-[3px] font-semibold">
									Confirm Password
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
											firstName: userData?.firstName,
											lastName: userData?.lastName,
											organization: userData.organization,
											email: userData.email,
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
								onClick={(event) => {
									event?.preventDefault();
									handleSubmit();
								}}
								type="submit"
								className="h-[48px] px-7 py-3 bg-brightRed text-white text-[16px] font-medium text-sm s uppercase rounded  w-full"
							>
								{!signUpLoading ? "Sign Up" : "Signing Up"}
							</button>
							<p
								className={`${
									showMissingFields.show ? "block " : "hidden"
								} text-[12px] flex items-center text-center justify-center text-brightRed mt-[15px]`}
							>
								{showMissingFields?.message}
							</p>
							<p
								className={`${
									showInvalidEmail ? "block " : "hidden"
								} text-[12px] flex items-center justify-center text-brightRed mt-[15px]`}
							>
								Invalid email
							</p>

							<p
								className={`${
									showInvalidPassword ? "block " : "hidden"
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
								className="ml-[92px] mt-5 my-3 text-brightRed w-[200px]  flex justify-center hover:shadow-lg"
								onClick={() => {
									setShowAuthModal({ logIn: true, signUp: false });
									TabTitle("CAMM - Log In");
									navigate("/login");
								}}
								role="button"
							>
								Already have an account?
							</p>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUpModal;
